"""Encode the four approved motion previews for the activity's runtime slots."""
from pathlib import Path
from PIL import Image
import shutil,json
R=Path(__file__).resolve().parents[1];src=R/'source/rabbit-fullpose-v4';dest=R/'assets/img/mascot'
report=[]
for name,slot in [('idle','idle-1'),('excited','spinning'),('celebration','result'),('recover','lose')]:
 frames=[Image.open(p).convert('RGBA') for p in sorted((src/f'{name}-frames').glob('*.png'))]
 assert len(frames)==48
 durations=[50 if i%6==3 else 40 for i in range(48)]
 out=dest/f'{slot}.webp'
 frames[0].save(out,save_all=True,append_images=frames[1:],duration=durations,loop=0,quality=90,method=4,minimize_size=True)
 with Image.open(out) as im:
  total=0
  for i in range(im.n_frames):im.seek(i);im.load();total+=im.info['duration']
  assert total==2000 and im.size==(400,500)
 report.append({'source':name,'runtime':str(out.relative_to(R)),'bytes':out.stat().st_size,'duration_ms':total,'quality':90,'alpha':True})
shutil.copy2(src/'idle-frames/frame-000.png',dest/'base-frame.png')
(src/'runtime-install.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
