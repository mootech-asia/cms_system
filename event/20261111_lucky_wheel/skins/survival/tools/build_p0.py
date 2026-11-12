"""Resize generated art and enforce transparent compositor boundaries."""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np
from scipy.ndimage import map_coordinates
import json
R=Path(__file__).resolve().parents[1];S=R/'source/p0';O=R/'img';updated=[]
def src(n):return Image.open(S/(n+'-original.png')).convert('RGBA')
def save(n,im):
 im.save(O/(n+'.webp'),lossless=True,method=2);(O/(n+'.svg')).unlink(missing_ok=True);updated.append(n)
def clean(im,low=220):
 im=im.copy();im.putalpha(im.getchannel('A').point(lambda a:round(max(0,a-low)*255/(255-low))));return im

def fit(n,size,inner):
 im=clean(src(n));im=im.crop(im.getbbox());im.thumbnail(inner,Image.Resampling.LANCZOS);o=Image.new('RGBA',size);o.alpha_composite(im,((size[0]-im.width)//2,(size[1]-im.height)//2));save(n,o)
for l in ['en','ko','th']:
 im=src('title-'+l);im.thumbnail((650,212),Image.Resampling.LANCZOS);o=Image.new('RGBA',(690,240));o.alpha_composite(im,((690-im.width)//2,(240-im.height)//2));save('title-'+l,o)
save('stage-bg',src('stage-bg').convert('RGB').resize((750,1000),Image.Resampling.LANCZOS))
im=clean(src('stage-floor'),160);box=im.getbbox();im=im.crop(box).resize((750,140),Image.Resampling.LANCZOS);a=np.array(im)
for y in range(106,120):
 t=(y-106)/14;a[y]=np.round(a[y]*(1-t)+np.array([243,236,224,255])*t)
a[120:]=[243,236,224,255];save('stage-floor',Image.fromarray(a))
im=np.array(src('wheel-frame'));h,w=im.shape[:2];y,x=np.mgrid[0:1360,0:1360];dx=(x+.5)/2-340;dy=(y+.5)/2-340;r=np.hypot(dx,dy);t=np.arctan2(dy,dx)
sr=(.397+(r-300)/40*.097)*w;coords=[h*.5+sr*np.sin(t),w*.5+sr*np.cos(t)]
a=np.stack([map_coordinates(im[:,:,i],coords,order=1,mode='nearest') for i in range(4)],axis=-1).astype('uint8');a[:,:,3]=np.where((r>=300)&(r<339.5),255,0);im=Image.fromarray(a).resize((680,680),Image.Resampling.LANCZOS);a=np.array(im);yy,xx=np.mgrid[0:680,0:680];a[((xx+.5-340)**2+(yy+.5-340)**2)<300**2,3]=0;save('wheel-frame',Image.fromarray(a))
fit('wheel-stand',(400,600),(330,560));fit('pointer',(120,160),(112,152));fit('btn-go',(200,200),(196,196))
def smooth(a,b,x):
 t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)
def arr(n,size):return np.array(src(n).resize(size,Image.Resampling.LANCZOS)).astype(float)
def out(n,a):save(n,Image.fromarray(np.clip(np.rint(a),0,255).astype('uint8')))
a=arr('spotlight',(260,900));y,x=np.mgrid[0:900,0:260];half=15+108*np.clip(y/650,0,1);a[:,:,3]*=(1-smooth(.45,1.05,abs(x-129.5)/half))*smooth(0,12,y)*(1-smooth(460,765,y))*(.95-.35*y/900);a[:,:,:3]=np.maximum(a[:,:,:3],[245,215,225]);a[[0,-1],:,3]=0;a[:,[0,-1],3]=0;a[765:,:,3]=0;out('spotlight',a)
a=arr('light-pool',(600,220));y,x=np.mgrid[0:220,0:600];r=np.sqrt(((x-299.5)/299)**2+((y-109.5)/80)**2);a[:,:,3]*=(1-smooth(.55,1,r))*.55;a[:,:,:3]=np.maximum(a[:,:,:3],[245,210,225]);out('light-pool',a)
a=arr('stage-vignette',(750,1000));y,x=np.mgrid[0:1000,0:750];r=np.sqrt(((x-374.5)/375)**2+((y-449.5)/500)**2);haze=a[:,:,:3].mean(axis=2)/255;a[:,:,3]=255*smooth(.35,1.1,r)*(.67+.03*haze);a[:,:,:3]=np.array([6,35,31])+haze[:,:,None]*np.array([3,7,5]);out('stage-vignette',a)
off=src('bulb-off');box=off.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox();mask=off.crop(box).resize((24,24),Image.Resampling.LANCZOS).getchannel('A')
for n in ['bulb-off','bulb-on']:
 im=src(n).resize(off.size,Image.Resampling.LANCZOS).crop(box).resize((24,24),Image.Resampling.LANCZOS);im.putalpha(mask);o=Image.new('RGBA',(48,48))
 if n=='bulb-on':
  yy,xx=np.mgrid[0:48,0:48];rr=np.hypot(xx-23.5,yy-23.5);g=np.zeros((48,48,4));g[:,:,:3]=[255,185,217];g[:,:,3]=135*np.exp(-(rr/15)**2)*(1-smooth(18,23,rr));o=Image.fromarray(g.astype('uint8'))
 o.alpha_composite(im,(12,12));save(n,o)
p=R.parents[1]/'assets/js/config.js';s=p.read_text()
for n in updated:s=s.replace('skins/survival/img/'+n+'.svg','skins/survival/img/'+n+'.webp')
p.write_text(s)
board=Image.new('RGB',(1035,190),'#06231f');d=ImageDraw.Draw(board)
for i,l in enumerate(['en','ko','th']):
 im=Image.open(O/f'title-{l}.webp').resize((345,120));board.paste(im,(i*345,40),im);d.text((i*345+8,10),l.upper(),fill='white')
board.save(S/'titles-comparison.png')
metrics={}
for n in updated:
 im=Image.open(O/(n+'.webp')).convert('RGBA');a=np.array(im)[:,:,3];metrics[n]={'size':list(im.size),'alphaMin':int(a.min()),'alphaMax':int(a.max()),'edgeAlphaMax':int(max(a[0].max(),a[-1].max(),a[:,0].max(),a[:,-1].max()))}
(S/'export-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')
print('Exported',len(updated),'assets')
