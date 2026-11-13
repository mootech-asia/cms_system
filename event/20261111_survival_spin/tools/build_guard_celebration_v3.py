"""Interpolate transparent whole-character poses; keep a shared neutral endpoint."""
from pathlib import Path
import sys,json,shutil
import numpy as np
import cv2
from PIL import Image,ImageDraw,ImageFilter
R=Path(__file__).resolve().parents[1];O=R/'source/guard-celebration-v3'
name=sys.argv[1];src=Path(sys.argv[2]);D=O/name;D.mkdir(parents=True,exist_ok=True)
shutil.copy2(src,D/'keyposes-original.png')
sheet=Image.open(src).convert('RGBA');assert sheet.size==(1536,1024)
keys=[]
for i in range(6):
 p=sheet.crop((i%3*512,i//3*512,i%3*512+512,i//3*512+512))
 p=p.convert('RGBa').resize((481,481),Image.Resampling.LANCZOS).convert('RGBA')
 alpha=np.array(p)[:,:,3];yy,xx=np.where(alpha>64);ratio=408/(yy.max()-yy.min()+1)
 p=p.convert('RGBa').resize((round(p.width*ratio),round(p.height*ratio)),Image.Resampling.LANCZOS).convert('RGBA')
 a=np.array(p)[:,:,3];ys,xs=np.where(a>64);bottom=int(ys.max());feet=np.where(a[max(0,bottom-12):bottom+1]>64)[1];cx=(feet.min()+feet.max())/2
 frame=Image.new('RGBA',(400,500));frame.alpha_composite(p,(round(200-cx),460-bottom))
 if i==0:
  if name=='idle':frame.save(O/'neutral.png')
  else:frame=Image.open(R/'source/guard-rifle-v1/neutral.png').convert('RGBA')
 frame.save(D/f'key-{i:02d}.png');keys.append(np.array(frame,dtype=np.float32)/255)
keys=[keys[i] for i in [0,2,3,4,2,0]]
flows=[]
use_mesh=name=='celebration' and '--rifle' in sys.argv
if use_mesh:
 from scipy.interpolate import RBFInterpolator
 # Corresponding full-frame landmarks align the moving glove while anchoring the rifle.
 hands=[(186,225),(147,190),(135,159),(147,195),(147,190),(186,225)]
 fixed=[(0,0),(399,0),(0,499),(399,499),(0,250),(399,250),
        (200,40),(200,100),(200,140),(245,175),(250,260),(290,320),
        (200,275),(145,350),(250,350),(148,450),(250,450)]
 fixed += [(xx,yy) for xx in [160,180,220,240] for yy in [45,80,115,135]]
 fixed += [(190,170),(205,205),(230,240),(255,280),(275,305),(160,290),(230,300)]
 def points(i):
  hx,hy=hands[i]
  return np.array(fixed+[(hx-10,hy),(hx+10,hy),(hx,hy-12),(hx,hy+12),(hx,hy)],np.float32)
use_raft='--raft' in sys.argv
if use_raft:
 import torch
 from torchvision.models.optical_flow import raft_large,Raft_Large_Weights
 torch.set_num_threads(4)
 model=raft_large(weights=Raft_Large_Weights.DEFAULT).eval()
 def tensor(c):
  rgb=c[:,:,:3]*c[:,:,3:]+np.array([6,35,31],dtype=np.float32)/255*(1-c[:,:,3:])
  rgb=np.pad(rgb,((0,4),(0,0),(0,0)),mode='edge')
  return torch.from_numpy(rgb).permute(2,0,1).unsqueeze(0)*2-1
 def infer(a,b):
  with torch.inference_mode():f=model(tensor(a),tensor(b),num_flow_updates=12)[-1]
  return f[0].permute(1,2,0).numpy()[:500].copy()
for i,a in enumerate(keys):
 b=keys[(i+1)%6];gray=lambda c:cv2.cvtColor(np.uint8(c[:,:,:3]*c[:,:,3:]*255),cv2.COLOR_RGB2GRAY)
 if use_mesh:flows.append((None,None))
 elif use_raft:flows.append((infer(a,b),infer(b,a)))
 else:
  dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM);flows.append((dis.calc(gray(a),gray(b),None),dis.calc(gray(b),gray(a),None)))
y,x=np.indices((500,400),dtype=np.float32)
def warp(im,flow,t):
 if not use_raft:
  mx=x.copy();my=y.copy()
  for _ in range(8):
   f=cv2.remap(flow,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
   mx=((mx+x-t*f[:,:,0])*.5).astype(np.float32);my=((my+y-t*f[:,:,1])*.5).astype(np.float32)
  return cv2.remap(im,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
 # Forward splatting prevents disoccluded background from retaining the old arm.
 dx=x+t*flow[:,:,0];dy=y+t*flow[:,:,1];ix=np.floor(dx).astype(int);iy=np.floor(dy).astype(int)
 fx=dx-ix;fy=dy-iy;out=np.zeros((500,400,4),np.float32);weight=np.zeros((500,400),np.float32)
 for ox,oy,w in [(0,0,(1-fx)*(1-fy)),(1,0,fx*(1-fy)),(0,1,(1-fx)*fy),(1,1,fx*fy)]:
  xx=ix+ox;yy=iy+oy;valid=(xx>=0)&(xx<400)&(yy>=0)&(yy<500)&(im[:,:,3]>.005)
  np.add.at(weight,(yy[valid],xx[valid]),w[valid])
  for channel in range(4):np.add.at(out[:,:,channel],(yy[valid],xx[valid]),im[:,:,channel][valid]*w[valid])
 weight=cv2.GaussianBlur(weight,(3,3),.45);out=cv2.GaussianBlur(out,(3,3),.45)
 return out/np.maximum(weight[:,:,None],1e-6)
shadow=Image.new('RGBA',(400,500));ImageDraw.Draw(shadow).ellipse((137,455,263,470),fill=(0,0,0,80));shadow=shadow.filter(ImageFilter.GaussianBlur(4))
jacobians=[];frames=[];margins=[];times=[0,8,16,24,32,40,47]
for j in range(48):
 k=min(5,int(np.searchsorted(times,j,side='right')-1));t=float(j-times[k])/(times[k+1]-times[k])
 a=keys[k].copy();b=keys[(k+1)%6].copy();a[:,:,:3]*=a[:,:,3:];b[:,:,:3]*=b[:,:,3:]
 if use_mesh:
  pa=points(k);pb=points((k+1)%6);mid=pa*(1-t)+pb*t
  source=pa if t<.5 else pb;texture=a if t<.5 else b
  # Smooth inverse displacement from ONE complete pose; never blend silhouettes.
  coords=np.stack([x,y],axis=-1)
  displacement=RBFInterpolator(mid,source-mid,kernel='thin_plate_spline',smoothing=12)(coords.reshape(-1,2)).reshape(500,400,2).astype(np.float32)
  scale=1.
  while True:
   mapping=coords+displacement*scale
   dxdy,dxdx=np.gradient(mapping[:,:,0]);dydy,dydx=np.gradient(mapping[:,:,1])
   determinant=dxdx*dydy-dxdy*dydx
   if determinant.min()>.2:break
   scale*=.8
  jacobians.append(float(determinant.min()))
  c=cv2.remap(texture,mapping[:,:,0],mapping[:,:,1],cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
 else:
  fa,fb=flows[k];c=warp(a,fa,t)*(1-t)+warp(b,fb,1-t)*t
 c[:,:,:3]/=np.maximum(c[:,:,3:],1e-6);c=np.clip(c,0,1)
 if j in [0,47]:c=keys[0]
 rgba=Image.fromarray(np.uint8(np.round(c*255)),'RGBA');out=shadow.copy();out.alpha_composite(rgba);frames.append(out)
 ys,xs=np.where(np.array(out)[:,:,3]>16);margins.append(int(min(xs.min(),ys.min(),399-xs.max(),499-ys.max())))
fd=D/'frames';fd.mkdir(exist_ok=True)
for i,f in enumerate(frames):f.save(fd/f'frame-{i:03d}.png')
durations=[50 if i%6==3 else 40 for i in range(48)]
frames[0].save(O/f'{name}.webp',save_all=True,append_images=frames[1:],duration=durations,loop=0,lossless=True,method=0)
frames[0].save(O/'base-frame.png')
mat=[]
for f in frames:
 bg=Image.new('RGBA',f.size,'#06231f');bg.alpha_composite(f);mat.append(bg.convert('RGB'))
contact=Image.new('RGB',(1200,1000))
for z,i in enumerate([0,8,16,24,32,40]):contact.paste(mat[i],(z%3*400,z//3*500))
contact.save(D/'review.jpg',quality=95)
palette=contact.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
indexed=[f.quantize(palette=palette,dither=Image.Dither.NONE) for f in mat]
indexed[0].save(O/f'{name}.gif',save_all=True,append_images=indexed[1:],duration=durations,loop=0,disposal=1,optimize=False)
assert min(margins)>=8
with Image.open(O/f'{name}.gif') as im:
 encoded_frames=im.n_frames
 assert encoded_frames>=24
 first=im.convert('RGB').tobytes();ms=0
 for i in range(im.n_frames):im.seek(i);ms+=im.info['duration']
 assert ms==2000 and im.convert('RGB').tobytes()==first
report={'action':name,'frames':48,'gif_encoded_frames':encoded_frames,'distinct_rgba_frames':len({f.tobytes() for f in frames}),'duration_ms':ms,'native_sheet':[1536,1024],'native_key':[512,512],'output':[400,500],'min_margin_px':min(margins),'whole_pose_flow':True,'flow_method':'single-source smooth nonfolding warp' if use_mesh else ('RAFT-large' if use_raft else 'DIS'),'limb_rig':False,'chromakey':False,'alpha_and_rgb_shared_flow':True,'runtime_installed':False,'texture_crossfade':False,'minimum_mapping_jacobian':min(jacobians)}
(D/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
