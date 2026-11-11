from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np
from scipy.ndimage import map_coordinates
import shutil,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/img';SRC=ROOT/'source/main-visual';SRC.mkdir(parents=True,exist_ok=True)
files={'wheel-frame':'0ff3d91b-aab9-408a-a228-667ac4f8a304','btn-go':'7ed2964f-5fe3-4065-b624-59177e7a93dc','title-plate':'8220b5ca-2019-4d28-bf39-e84b0130f1a1','stage-floor':'969e0225-baff-4ad2-b759-8d919a6ced26','wheel-stand':'e22011d9-eca9-4bf9-85a4-ef2cba2f4fc3'}
def source(n):
 return Image.open(SRC/(n+'-original.png')).convert('RGBA')
def clean(im,low=210):
 im=im.copy();im.putalpha(im.getchannel('A').point(lambda a:max(0,min(255,round((a-low)*255/(255-low))))));return im
updated=[]
def save(n,im):
 im.save(OUT/(n+'.webp'),quality=92,method=6,lossless=(n=='stage-floor'));(OUT/(n+'.svg')).unlink(missing_ok=True);updated.append(n);print(n,im.size,(OUT/(n+'.webp')).stat().st_size)
# Remap annulus radially into exact 40px rim, preserving both bevels.
im=np.array(source('wheel-frame'));n=1360
y,x=np.indices((n,n));dx=(x+.5)/2-340;dy=(y+.5)/2-340;r=np.hypot(dx,dy);a=np.arctan2(dy,dx)
sr=496+(r-300)/40*107
coords=[627+sr*np.sin(a),620+sr*np.cos(a)]
rgba=np.stack([map_coordinates(im[:,:,i],coords,order=1,mode='nearest') for i in range(4)],axis=-1).astype('uint8')
rgba[:,:,3]=np.where((r>=300)&(r<339.5),255,0)
rim=Image.fromarray(rgba).resize((680,680),Image.Resampling.LANCZOS)
a=np.array(rim.getchannel('A'));yy,xx=np.indices(a.shape);a[(xx+.5-340)**2+(yy+.5-340)**2<300**2]=0;rim.putalpha(Image.fromarray(a));save('wheel-frame',rim)
im=clean(source('btn-go'));im=im.crop(im.getbbox());save('btn-go',im.resize((200,200),Image.Resampling.LANCZOS))
im=clean(source('stage-floor'),140).crop((0,425,1836,857)).resize((750,140),Image.Resampling.LANCZOS)
a=np.array(im);cream=np.array([255,246,234,255]);
for y in range(105,120):a[y]=np.round(a[y]*(1-(y-105)/15)+cream*((y-105)/15))
a[120:]=cream;save('stage-floor',Image.fromarray(a))
im=clean(source('wheel-stand'),220);box=im.getbbox();im=im.crop(box);im=im.resize((300,520),Image.Resampling.LANCZOS);can=Image.new('RGBA',(400,600));can.alpha_composite(im,(50,0));save('wheel-stand',can)
plate=clean(source('title-plate'),150).resize((1380,480),Image.Resampling.LANCZOS)
texts={'en':('LUCKY WHEEL','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',0),'ko':('행운의 룰렛','/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',1),'th':('วงล้อนำโชค','/usr/share/fonts/truetype/noto/NotoSansThai-Bold.ttf',0)}
for lang,(txt,font,index) in texts.items():
 size=150
 while True:
  f=ImageFont.truetype(font,size,index=index);b=f.getbbox(txt)
  if b[2]-b[0]<1110 and b[3]-b[1]<180:break
  size-=1
 layer=Image.new('L',(1380,480));d=ImageDraw.Draw(layer);pos=((1380-(b[2]-b[0]))/2-b[0],(480-(b[3]-b[1]))/2-b[1]-5);d.text(pos,txt,font=f,fill=255)
 im=plate.copy()
 # Thin bronze outline and extruded gold lower edge.
 outline=layer.filter(ImageFilter.MaxFilter(7));sh=Image.new('RGBA',im.size,(83,23,10));im.alpha_composite(Image.composite(sh,Image.new('RGBA',im.size),outline))
 for offset in range(9,0,-1):
  shadow=Image.new('RGBA',im.size,(156+offset*3,84+offset*3,25,0));shadow.putalpha(layer);im.alpha_composite(shadow,(0,offset))
 gradient=np.zeros((480,1380,4),dtype='uint8')
 for y in range(480):
  t=max(0,min(1,(y-130)/200));gradient[y,:,:3]=np.array([255,255,239])*(1-t)+np.array([255,216,124])*t
 gradient[:,:,3]=np.array(layer);im.alpha_composite(Image.fromarray(gradient));save('title-'+lang,im.resize((690,240),Image.Resampling.LANCZOS))
(SRC/'title-typesetting.json').write_text(json.dumps({k:{'text':v[0],'font':v[1],'font_index':v[2]} for k,v in texts.items()},ensure_ascii=False,indent=2))
p=ROOT/'assets/js/config.js';s=p.read_text()
for name in updated:s=s.replace('assets/img/'+name+'.svg','assets/img/'+name+'.webp')
p.write_text(s)
files.update({'stage-bg':'6afd5081-edba-4ea2-9add-2e6ede4c1b09','pointer':'db065c36-f759-4688-bac2-669ea7fd1e8e'})
save('stage-bg',source('stage-bg').convert('RGB').resize((750,1000),Image.Resampling.LANCZOS))
im=clean(source('pointer'),210);im=im.crop(im.getbbox());im.thumbnail((116,156),Image.Resampling.LANCZOS);can=Image.new('RGBA',(120,160));can.alpha_composite(im,((120-im.width)//2,160-im.height));save('pointer',can)
p=ROOT/'assets/js/config.js';s=p.read_text()
for name in updated:s=s.replace('assets/img/'+name+'.svg','assets/img/'+name+'.webp')
p.write_text(s)

save('stage-bg-desktop',source('stage-bg-desktop').convert('RGB').resize((1920,1000),Image.Resampling.LANCZOS))
