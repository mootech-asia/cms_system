"""Repack static event images only when smaller and decoded RGBA is identical."""
from pathlib import Path
from PIL import Image
import io,json,argparse
parser=argparse.ArgumentParser();parser.add_argument('--write',action='store_true');parser.add_argument('--report',default='/tmp/event-lossless.json');args=parser.parse_args()
rows=[]
for p in sorted(Path('event').glob('*/assets/**/*')):
 if p.suffix.lower() not in ('.png','.webp'):continue
 with Image.open(p) as im:
  if getattr(im,'is_animated',False):continue
  im.load();rgba=im.convert('RGBA');buf=io.BytesIO();kw={k:im.info[k] for k in ('icc_profile','exif','xmp') if k in im.info}
  if p.suffix=='.webp':rgba.save(buf,format='WEBP',lossless=True,exact=True,method=6,**kw)
  else:im.save(buf,format='PNG',optimize=True,**kw)
  data=buf.getvalue();old=p.stat().st_size
  if len(data)>=old:continue
  with Image.open(io.BytesIO(data)) as check:
   assert check.size==im.size and check.convert('RGBA').tobytes()==rgba.tobytes(),p
   assert all(check.info.get(k)==v for k,v in kw.items()),p
  rows.append({'path':str(p),'before':old,'after':len(data),'rgbaIdentical':True})
  if args.write:p.write_bytes(data)
report={'files':rows,'savedBytes':sum(r['before']-r['after'] for r in rows)}
Path(args.report).write_text(json.dumps(report,indent=2));print('Lossless:',len(rows),'files;',report['savedBytes'],'bytes saved')
