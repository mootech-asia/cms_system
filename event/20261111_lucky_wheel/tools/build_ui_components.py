#!/usr/bin/env python3
"""Export generated UI artwork with exact canvas sizes and seamless tile edges."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'source/ui-components';OUT=ROOT/'assets/img'
SIZES={'modal-bg':(600,760),'btn-primary':(400,110),'period-badge':(480,64),'chances-badge':(360,88),'card-frame':(120,120),'card-title':(400,72),'footer-deco':(750,160),'icon-share':(64,64),'icon-sound-on':(64,64),'icon-sound-off':(64,64)}
updated=[]
for name,size in SIZES.items():
 path=SRC/(name+'-original.png')
 if not path.exists():continue
 im=Image.open(path).convert('RGBA');a=im.getchannel('A').point(lambda v:max(0,min(255,round((v-210)*255/45))));im.putalpha(a)
 box=a.point(lambda v:255 if v>=180 else 0).getbbox();im=im.crop(box)
 if name=='card-frame':
  # Fill the generated central cutout; nine-slice center must be opaque.
  under=Image.new('RGBA',im.size);d=ImageDraw.Draw(under);d.rounded_rectangle((4,4,im.width-5,im.height-5),radius=im.width*.09,fill='#fff9ee');under.alpha_composite(im);im=under.resize(size,Image.Resampling.LANCZOS)
  ar=np.array(im);ar[40:80,40:80]=[255,249,238,255]
  ar[:40,40:80]=ar[:40,60:61];ar[80:,40:80]=ar[80:,60:61]
  ar[40:80,:40]=ar[60:61,:40];ar[40:80,80:]=ar[60:61,80:];im=Image.fromarray(ar)
 elif name=='modal-bg':im=im.resize(size,Image.Resampling.LANCZOS)
 else:
  # Reserve a minimal transparent margin without distorting metal/satin forms.
  im.thumbnail((size[0]-2,size[1]-2),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',size);canvas.alpha_composite(im,((size[0]-im.width)//2,(size[1]-im.height)//2));im=canvas
 im.save(OUT/(name+'.webp'),quality=93,method=6,lossless=(name=='card-frame'));(OUT/(name+'.svg')).unlink(missing_ok=True);updated.append(name)
 print(name,im.size,(OUT/(name+'.webp')).stat().st_size)
# Reflect a quarter tile to guarantee matching boundary pixels in both axes.
q=Image.open(SRC/'info-bg-original.png').convert('RGB').resize((375,375),Image.Resampling.LANCZOS)
q=Image.blend(Image.new('RGB',q.size,'#fff6ea'),q,.18)
im=Image.new('RGB',(750,750));im.paste(q,(0,0));im.paste(ImageOps.mirror(q),(375,0));im.paste(ImageOps.flip(q),(0,375));im.paste(ImageOps.flip(ImageOps.mirror(q)),(375,375))
im.save(OUT/'info-bg.webp',lossless=True,method=6);(OUT/'info-bg.svg').unlink(missing_ok=True);updated.append('info-bg')
p=ROOT/'assets/js/config.js';s=p.read_text()
for name in updated:s=s.replace('assets/img/'+name+'.svg','assets/img/'+name+'.webp')
p.write_text(s)
