"""Package generated full-body keyposes with the existing mascot optical-flow workflow."""
from pathlib import Path
import json
import numpy as np
import cv2
from PIL import Image
ROOT=Path(__file__).resolve().parent
OUT=ROOT.parents[1]/'assets/img/mascot/spirit'
OUT.mkdir(parents=True,exist_ok=True)
W,H=400,500
x,y=np.meshgrid(np.arange(W,dtype=np.float32),np.arange(H,dtype=np.float32))
base=None
reports=[]
def warp(im,flow,t):
 mx=x.copy();my=y.copy()
 for _ in range(6):
  f=cv2.remap(flow,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
  mx=(mx+x-t*f[:,:,0])*.5;my=(my+y-t*f[:,:,1])*.5
 return cv2.remap(im,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
for name in ['idle','excited','encourage']:
 sheet=Image.open(ROOT/f'{name}-keyposes.png').convert('RGBA');assert sheet.size==(1536,1024)
 keys=[]
 for i in range(6):
  im=sheet.crop((i%3*512,i//3*512,(i%3+1)*512,(i//3+1)*512))
  im=im.convert('RGBa').resize((376,376),Image.Resampling.LANCZOS).convert('RGBA')
  a=np.asarray(im);ys,xs=np.where(a[:,:,3]>160);bottom=ys.max()
  frame=Image.new('RGBA',(W,H));frame.alpha_composite(im,(12,480-int(bottom)))
  keys.append(np.asarray(frame,dtype=np.float32)/255)
 if base is None:base=keys[0].copy();Image.fromarray(np.uint8(base*255)).save(OUT/'poster.webp',quality=94,method=6)
 keys[0]=base.copy();keys.append(base.copy())
 flows=[]
 for a,b in zip(keys,keys[1:]):
  ga=cv2.cvtColor(np.uint8(a[:,:,:3]*a[:,:,3:]*255),cv2.COLOR_RGB2GRAY);gb=cv2.cvtColor(np.uint8(b[:,:,:3]*b[:,:,3:]*255),cv2.COLOR_RGB2GRAY)
  dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
  flows.append((dis.calc(ga,gb,None),dis.calc(gb,ga,None)))
 frames=[];margins=[]
 directory=ROOT/(name+'-frames');directory.mkdir(exist_ok=True)
 for i in range(48):
  phase=i/47*6;k=min(5,int(phase));t=phase-k;t=t*t*(3-2*t)
  a,b=keys[k].copy(),keys[k+1].copy();a[:,:,:3]*=a[:,:,3:];b[:,:,:3]*=b[:,:,3:]
  wa=warp(a,flows[k][0],t);wb=warp(b,flows[k][1],1-t)
  c=wa if t<.5 else wb
  c[:,:,:3]/=np.maximum(c[:,:,3:],1e-6);c=np.clip(c,0,1)
  if i in [0,47]:c=base.copy()
  frame=Image.fromarray(np.uint8(np.round(c*255)),'RGBA');frame.save(directory/f'frame-{i:03}.png');frames.append(frame)
  ys,xs=np.where(np.asarray(frame)[:,:,3]>16);margins.append(int(min(xs.min(),ys.min(),W-1-xs.max(),H-1-ys.max())))
 durations=[50 if i%6==3 else 40 for i in range(48)]
 frames[0].save(OUT/(name+'.webp'),save_all=True,append_images=frames[1:],duration=durations,loop=0,quality=86,method=3,minimize_size=False)
 contact=Image.new('RGBA',(W*3,H*2),'#60452a')
 for j,i in enumerate([0,9,18,27,36,47]):contact.alpha_composite(frames[i],((j%3)*W,(j//3)*H))
 contact.convert('RGB').save(ROOT/(name+'-review.jpg'),quality=93)
 reports.append({'state':name,'frames':48,'durationMs':sum(durations),'minMargin':min(margins),'bytes':(OUT/(name+'.webp')).stat().st_size,'sameEndpoint':frames[0].tobytes()==frames[-1].tobytes()})
 assert min(margins)>=8
(ROOT/'motion-checks.json').write_text(json.dumps(reports,indent=2));print(reports)
