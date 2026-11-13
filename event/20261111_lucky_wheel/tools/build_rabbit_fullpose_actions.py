"""Interpolate whole RGBA poses with a shared dense flow for color and alpha."""
from pathlib import Path
import sys,json,shutil
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,GifImagePlugin
import cv2
R=Path(__file__).resolve().parents[1];O=R/'source/rabbit-fullpose-v4';O.mkdir(exist_ok=True)
name=sys.argv[2]
assert name in ['excited','celebration','recover']
src=Path(sys.argv[1]);shutil.copy2(src,O/f'{name}-keyposes-original.png') if src.resolve()!=(O/f'{name}-keyposes-original.png').resolve() else None
im=Image.open(src).convert('RGBA');assert im.size==(1536,1024)
keys=[];metrics=[]
for i in range(6):
 p=im.crop((i%3*512,i//3*512,(i%3+1)*512,(i//3+1)*512))
 # Premultiplied resampling prevents the RGB of transparent pixels leaking into fur.
 p=p.convert('RGBa').resize((481,481),Image.Resampling.LANCZOS).convert('RGBA')
 a=np.array(p);a[:,:,3][a[:,:,3]<=2]=0;p=Image.fromarray(a,'RGBA');ys,xs=np.where(a[:,:,3]>64);bottom=ys.max();fx=np.where(a[max(0,bottom-12):bottom+1,:,3]>64)[1];cx=(fx.min()+fx.max())/2
 frame=Image.new('RGBA',(400,500));frame.alpha_composite(p,(round(200-cx),480-int(bottom)))
 if i==0 or (name=='recover' and i==5):frame=Image.open(O/'idle-key-00.png').convert('RGBA')
 frame.save(O/f'{name}-key-{i:02d}.png');keys.append(np.asarray(frame,dtype=np.float32)/255)
 metrics.append({'key':i,'body_height':int(ys.max()-ys.min()+1),'translation':[round(200-cx),480-int(bottom)]})
flows=[]
for a,b in zip(keys,keys[1:]):
 ga=cv2.cvtColor(np.uint8(a[:,:,:3]*a[:,:,3:]*255),cv2.COLOR_RGB2GRAY);gb=cv2.cvtColor(np.uint8(b[:,:,:3]*b[:,:,3:]*255),cv2.COLOR_RGB2GRAY)
 dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
 flows.append((dis.calc(ga,gb,None),dis.calc(gb,ga,None)))
if name=='recover':
 ground_weight=np.clip((475-np.arange(500,dtype=np.float32))/45,0,1)[:,None,None]
 flows=[(fa*ground_weight,fb*ground_weight) for fa,fb in flows]
y,x=np.indices((500,400),dtype=np.float32);frames=[];margins=[]
def warp_at(image,flow,amount):
 mx=x.copy();my=y.copy()
 for _ in range(8):
  f=cv2.remap(flow,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
  nx=(x-amount*f[:,:,0]).astype(np.float32);ny=(y-amount*f[:,:,1]).astype(np.float32)
  mx=(mx+nx)*.5;my=(my+ny)*.5
 return cv2.remap(image,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)

shadow=Image.new('RGBA',(400,500));ImageDraw.Draw(shadow).ellipse((102,472,304,488),fill=(0,0,0,65));shadow=shadow.filter(ImageFilter.GaussianBlur(3))
for i in range(48):
 phase=5*i/47 if name=='recover' else (1-np.cos(2*np.pi*i/47))*2.5;k=min(4,int(phase));t=phase-k
 a,b=keys[k].copy(),keys[k+1].copy();a[:,:,:3]*=a[:,:,3:];b[:,:,:3]*=b[:,:,3:];fa,fb=flows[k]
 wa=warp_at(a,fa,t)
 wb=warp_at(b,fb,1-t)
 c=wa*(1-t)+wb*t;c[:,:,:3]/=np.maximum(c[:,:,3:],1e-6);c=np.clip(c,0,1)
 if i in [0,47]:c=keys[0]
 rgba=Image.fromarray(np.uint8(np.round(c*255)),'RGBA');out=shadow.copy();out.alpha_composite(rgba);frames.append(out)
 ys,xs=np.where(np.array(out)[:,:,3]>16);margins.append(int(min(xs.min(),ys.min(),399-xs.max(),499-ys.max())))
folder=O/f'{name}-frames';folder.mkdir(exist_ok=True)
for i,f in enumerate(frames):f.save(folder/f'frame-{i:03d}.png')
frames[-1]=frames[0].copy();frames[-1].save(folder/'frame-047.png')
durations=[50 if i%6==3 else 40 for i in range(48)]
frames[0].save(O/f'{name}.webp',save_all=True,append_images=frames[1:],duration=durations,loop=0,lossless=True,method=0)
mat=[]
for f in frames:
 bg=Image.new('RGBA',f.size,'#312820');bg.alpha_composite(f);mat.append(bg.convert('RGB'))
contact=Image.new('RGB',(1200,1000))
for j,i in enumerate([0,7,15,23,31,40]):contact.paste(mat[i],(j%3*400,j//3*500))
contact.save(O/f'{name}-keyframes.jpg',quality=95)
pal=contact.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
with (O/f'{name}.gif').open('wb') as f:
 indexed=[p.quantize(palette=pal,dither=Image.Dither.NONE) for p in mat]
 for b in GifImagePlugin.getheader(indexed[0],info={'loop':0})[0]:f.write(b)
 for i,p in enumerate(indexed):
  for b in GifImagePlugin.getdata(p,duration=durations[i],disposal=2):f.write(b)
 f.write(b';')
assert min(margins)>=8
report={'name':name,'status':'motion and alpha preview; not installed','native_sheet':[1536,1024],'native_pose':[512,512],'output':[400,500],'generated_keyposes':6,'output_frames':48,'distinct_rgba_frames':len({f.tobytes() for f in frames}),'duration_ms':sum(durations),'min_margin_px':min(margins),'whole_body_flow':True,'same_flow_for_color_and_alpha':True,'chromakey':False,'limb_rig':False,'upscaled':False,'metrics':metrics}
(O/f'{name}-checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
