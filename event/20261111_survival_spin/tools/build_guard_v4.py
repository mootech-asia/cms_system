"""Interpolate transparent whole-character poses; keep a shared neutral endpoint."""
from pathlib import Path
import sys,json,shutil
import numpy as np
import cv2
from PIL import Image,ImageDraw,ImageFilter
R=Path(__file__).resolve().parents[1];O=R/'source/guard-fullpose-v4'
name=sys.argv[1];src=Path(sys.argv[2]);D=O/name;D.mkdir(parents=True,exist_ok=True)
shutil.copy2(src,D/'keyposes-original.png')
sheet=Image.open(src).convert('RGBA');assert sheet.size==(1536,1024)
keys=[]
for i in range(6):
 p=sheet.crop((i%3*512,i//3*512,i%3*512+512,i//3*512+512))
 p=p.convert('RGBa').resize((481,481),Image.Resampling.LANCZOS).convert('RGBA')
 a=np.array(p)[:,:,3];ys,xs=np.where(a>64);bottom=int(ys.max());feet=np.where(a[max(0,bottom-12):bottom+1]>64)[1];cx=(feet.min()+feet.max())/2
 frame=Image.new('RGBA',(400,500));frame.alpha_composite(p,(round(200-cx),460-bottom))
 if i==0:
  if name=='idle':frame.save(O/'neutral.png')
  else:frame=Image.open(O/'neutral.png').convert('RGBA')
 frame.save(D/f'key-{i:02d}.png');keys.append(np.array(frame,dtype=np.float32)/255)
flows=[]
for i,a in enumerate(keys):
 b=keys[(i+1)%6];gray=lambda c:cv2.cvtColor(np.uint8(c[:,:,:3]*c[:,:,3:]*255),cv2.COLOR_RGB2GRAY)
 dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM);flows.append((dis.calc(gray(a),gray(b),None),dis.calc(gray(b),gray(a),None)))
y,x=np.indices((500,400),dtype=np.float32)
def warp(im,flow,t):
 mx=x.copy();my=y.copy()
 for _ in range(8):
  f=cv2.remap(flow,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
  mx=((mx+x-t*f[:,:,0])*.5).astype(np.float32);my=((my+y-t*f[:,:,1])*.5).astype(np.float32)
 return cv2.remap(im,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
shadow=Image.new('RGBA',(400,500));ImageDraw.Draw(shadow).ellipse((137,455,263,470),fill=(0,0,0,80));shadow=shadow.filter(ImageFilter.GaussianBlur(4))
frames=[];margins=[];times=[0,8,16,24,32,40,47]
for j in range(48):
 k=min(5,int(np.searchsorted(times,j,side='right')-1));t=float(j-times[k])/(times[k+1]-times[k])
 a=keys[k].copy();b=keys[(k+1)%6].copy();a[:,:,:3]*=a[:,:,3:];b[:,:,:3]*=b[:,:,3:]
 fa,fb=flows[k];c=warp(a,fa,t)*(1-t)+warp(b,fb,1-t)*t;c[:,:,:3]/=np.maximum(c[:,:,3:],1e-6);c=np.clip(c,0,1)
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
 assert im.n_frames==48
 first=im.convert('RGB').tobytes();ms=0
 for i in range(im.n_frames):im.seek(i);ms+=im.info['duration']
 assert ms==2000 and im.convert('RGB').tobytes()==first
report={'action':name,'frames':48,'distinct_rgba_frames':len({f.tobytes() for f in frames}),'duration_ms':ms,'native_sheet':[1536,1024],'native_key':[512,512],'output':[400,500],'min_margin_px':min(margins),'whole_pose_flow':True,'limb_rig':False,'chromakey':False,'alpha_and_rgb_shared_flow':True,'runtime_installed':False}
(D/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
