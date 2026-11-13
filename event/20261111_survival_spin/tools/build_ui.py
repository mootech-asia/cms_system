"""Export generated survival UI, preserving opaque panels and tile boundaries."""
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
from scipy.ndimage import binary_fill_holes
import numpy as np,json
R=Path(__file__).resolve().parents[1];S=R/'source/ui';O=R/'img'
sizes={'modal-bg':(600,760),'btn-primary':(400,110),'period-badge':(480,64),'chances-badge':(360,88),'ticker-bar':(690,64),'card-frame':(120,120),'card-title':(400,72),'footer-deco':(750,160),'icon-sound-on':(64,64),'icon-sound-off':(64,64),'icon-share':(64,64),'icon-rotate':(160,160)}
updated=[]
SHARP={'ticker-bar','chances-badge','card-title','period-badge'}
def save(n,im):
 im.save(O/(n+'.webp'),quality=95 if n in SHARP else 88,method=6,alpha_quality=100 if n in SHARP else 95);(O/(n+'.svg')).unlink(missing_ok=True);updated.append(n)
for n,size in sizes.items():
 im=Image.open(S/(n+'-original.png')).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:round(max(0,a-210)*255/45)));box=im.getbbox();im=im.crop(box)
 if n in ['modal-bg','card-frame']:
  mask=np.array(im.getchannel('A'));filled=binary_fill_holes(mask>128);under=Image.new('RGBA',im.size,'#F3E9D2');under.putalpha(Image.fromarray((filled*255).astype('uint8')));under.alpha_composite(im);im=under.resize(size,Image.Resampling.LANCZOS)
  if n=='card-frame':
   a=np.array(im);a[40:80,40:80]=[243,233,210,255];im=Image.fromarray(a)
  else:
   a=np.array(im);rgb=a[:,:,:3].astype(float);yy,xx=np.mgrid[:760,:600]
   cream=(yy>105)&(rgb[:,:,0]>120)&(rgb[:,:,1]>.72*rgb[:,:,0])&(rgb[:,:,2]>.55*rgb[:,:,0])
   a[cream,:3]=[243,233,210];im=Image.fromarray(a)
 elif n=='ticker-bar':
  cut=round(im.width*.225);left=im.crop((0,0,cut,im.height)).resize((150,64),Image.Resampling.LANCZOS);right=im.crop((cut,0,im.width,im.height)).resize((540,64),Image.Resampling.LANCZOS);im=Image.new('RGBA',size);im.alpha_composite(left);im.alpha_composite(right,(150,0))
 else:
  if n.startswith('icon-'):im.thumbnail((size[0]-4,size[1]-4),Image.Resampling.LANCZOS)
  else:im=im.resize((size[0]-2,size[1]-2),Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',size);canvas.alpha_composite(im,((size[0]-im.width)//2,(size[1]-im.height)//2));im=canvas
 save(n,im)
q=Image.open(S/'info-bg-original.png').convert('RGB').resize((375,375),Image.Resampling.LANCZOS);q=Image.blend(Image.new('RGB',q.size,'#F3ECE0'),q,.35);im=Image.new('RGB',(750,750));im.paste(q,(0,0));im.paste(ImageOps.mirror(q),(375,0));im.paste(ImageOps.flip(q),(0,375));im.paste(ImageOps.flip(ImageOps.mirror(q)),(375,375));save('info-bg',im)
p=R.parents[1]/'assets/js/config.js';s=p.read_text()
for n in updated:s=s.replace('skins/survival/img/'+n+'.svg','skins/survival/img/'+n+'.webp')
if "share: 'skins/survival/img/icon-share.webp'" not in s:
 s=s.replace("css: 'skins/survival/skin.css',\n      images: {", "css: 'skins/survival/skin.css',\n      images: {\n        soundOn: 'skins/survival/img/icon-sound-on.webp',\n        soundOff: 'skins/survival/img/icon-sound-off.webp',\n        share: 'skins/survival/img/icon-share.webp',\n        rotateHint: 'skins/survival/img/icon-rotate.webp',")
p.write_text(s)
checks={}
a=np.array(Image.open(O/'modal-bg.webp').convert('RGBA'));checks['modalInteriorOpaque']=bool((a[130:700,45:555,3]==255).all())
a=np.array(Image.open(O/'card-frame.webp').convert('RGBA'));checks['cardCenterOpaque']=bool((a[40:80,40:80,3]==255).all())
a=np.array(Image.open(O/'info-bg.webp'));checks['tileLeftRightEqual']=bool((a[:,0]==a[:,-1]).all());checks['tileTopBottomEqual']=bool((a[0]==a[-1]).all())
(S/'export-checks.json').write_text(json.dumps(checks,indent=2)+'\n');print('Exported',len(updated),checks)
