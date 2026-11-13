"""Package generated masters at delivery dimensions; preserve alpha during resampling."""
from pathlib import Path
from PIL import Image, ImageOps
import json, shutil
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'source/static-manifest.json').read_text())
checks=[]
for item in manifest:
 target=root/item['target'];master=(root/'source/originals'/item['target']).with_suffix('.png');master.parent.mkdir(parents=True,exist_ok=True)
 if not master.exists(): shutil.copy2(item['source'],master)
 im=Image.open(master);size=tuple(item['size']);target.parent.mkdir(parents=True,exist_ok=True)
 if im.mode=='RGBA':
  # Premultiplied interpolation avoids fringes from RGB in transparent pixels.
  pad=42 if '03_stickers/' in item['target'] else 0
  fitted=ImageOps.contain(im.convert('RGBa'),(size[0]-2*pad,size[1]-2*pad),Image.Resampling.LANCZOS).convert('RGBA')
  out=Image.new('RGBA',size);out.alpha_composite(fitted,((size[0]-fitted.width)//2,(size[1]-fitted.height)//2))
 else:
  out=ImageOps.fit(im.convert('RGB'),size,Image.Resampling.LANCZOS)
 if target.suffix.lower() in ['.jpg','.jpeg']:out.convert('RGB').save(target,quality=95,subsampling=0)
 else:out.save(target)
 rec={'id':item['id'],'file':item['target'],'native_size':list(im.size),'delivery_size':list(out.size),'mode':out.mode}
 if out.mode=='RGBA':
  a=out.getchannel('A');hist=a.histogram();rec.update(transparent_pixels=hist[0],alpha_bbox_128=a.point(lambda x:255 if x>=128 else 0).getbbox())
  assert hist[0]>1000
 checks.append(rec)
(root/'source/static-checks.json').write_text(json.dumps(checks,indent=2)+'\n')
print('PACKAGED',len(checks),'static assets')
