"""Interpolate whole RGBA poses with a shared dense flow for color and alpha."""
from pathlib import Path
import sys,json,shutil
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,GifImagePlugin
import cv2
R=Path(__file__).resolve().parents[1];O=R/'source/rabbit-fullpose-v4';O.mkdir(exist_ok=True)
src=Path(sys.argv[1]);shutil.copy2(src,O/'idle-keyposes-original.png') if src.resolve()!=(O/'idle-keyposes-original.png').resolve() else None
im=Image.open(src).convert('RGBA');assert im.size==(1536,1024)
keys=[];metrics=[]
for i in range(6):
 p=im.crop((i%3*512,i//3*512,(i%3+1)*512,(i//3+1)*512))
 # Premultiplied resampling prevents the RGB of transparent pixels leaking into fur.
 p=p.convert('RGBa').resize((481,481),Image.Resampling.LANCZOS).convert('RGBA')
 a=np.array(p);a[:,:,3][a[:,:,3]<=2]=0;p=Image.fromarray(a,'RGBA');ys,xs=np.where(a[:,:,3]>64);bottom=ys.max();fx=np.where(a[max(0,bottom-12):bottom+1,:,3]>64)[1];cx=(fx.min()+fx.max())/2
 frame=Image.new('RGBA',(400,500));frame.alpha_composite(p,(round(200-cx),480-int(bottom)))
 frame.save(O/f'idle-key-{i:02d}.png');keys.append(np.asarray(frame,dtype=np.float32)/255)
 metrics.append({'key':i,'body_height':int(ys.max()-ys.min()+1),'translation':[round(200-cx),480-int(bottom)]})
flows=[]
for a,b in zip(keys,keys[1:]):
 ga=cv2.cvtColor(np.uint8(a[:,:,:3]*a[:,:,3:]*255),cv2.COLOR_RGB2GRAY);gb=cv2.cvtColor(np.uint8(b[:,:,:3]*b[:,:,3:]*255),cv2.COLOR_RGB2GRAY)
 dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
 flows.append((dis.calc(ga,gb,None),dis.calc(gb,ga,None)))
y,x=np.indices((500,400),dtype=np.float32);frames=[];margins=[]
shadow=Image.new('RGBA',(400,500));ImageDraw.Draw(shadow).ellipse((102,472,304,488),fill=(0,0,0,65));shadow=shadow.filter(ImageFilter.GaussianBlur(3))
for i in range(48):
 phase=(1-np.cos(2*np.pi*i/47))*2.5;k=min(4,int(phase));t=phase-k
 a,b=keys[k].copy(),keys[k+1].copy();a[:,:,:3]*=a[:,:,3:];b[:,:,:3]*=b[:,:,3:];fa,fb=flows[k]
 wa=cv2.remap(a,(x-t*fa[:,:,0]).astype(np.float32),(y-t*fa[:,:,1]).astype(np.float32),cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
 wb=cv2.remap(b,(x-(1-t)*fb[:,:,0]).astype(np.float32),(y-(1-t)*fb[:,:,1]).astype(np.float32),cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
 c=wa*(1-t)+wb*t;c[:,:,:3]/=np.maximum(c[:,:,3:],1e-6);c=np.clip(c,0,1)
 if i in [0,47]:c=keys[0]
 rgba=Image.fromarray(np.uint8(np.round(c*255)),'RGBA');out=shadow.copy();out.alpha_composite(rgba);frames.append(out)
 ys,xs=np.where(np.array(out)[:,:,3]>16);margins.append(int(min(xs.min(),ys.min(),399-xs.max(),499-ys.max())))
folder=O/'idle-frames';folder.mkdir(exist_ok=True)
for i,f in enumerate(frames):f.save(folder/f'frame-{i:03d}.png')
frames[-1]=frames[0].copy();frames[-1].save(folder/'frame-047.png')
durations=[50 if i%6==3 else 40 for i in range(48)]
frames[0].save(O/'idle.webp',save_all=True,append_images=frames[1:],duration=durations,loop=0,lossless=True)
mat=[]
for f in frames:
 bg=Image.new('RGBA',f.size,'#312820');bg.alpha_composite(f);mat.append(bg.convert('RGB'))
contact=Image.new('RGB',(1200,1000))
for j,i in enumerate([0,7,15,23,31,40]):contact.paste(mat[i],(j%3*400,j//3*500))
contact.save(O/'idle-keyframes.jpg',quality=95)
pal=contact.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
with (O/'idle.gif').open('wb') as f:
 indexed=[p.quantize(palette=pal,dither=Image.Dither.NONE) for p in mat]
 for b in GifImagePlugin.getheader(indexed[0],info={'loop':0})[0]:f.write(b)
 for i,p in enumerate(indexed):
  for b in GifImagePlugin.getdata(p,duration=durations[i],disposal=2):f.write(b)
 f.write(b';')
assert min(margins)>=8
report={'status':'motion and alpha preview; not installed','native_sheet':[1536,1024],'native_pose':[512,512],'output':[400,500],'generated_keyposes':6,'output_frames':48,'distinct_rgba_frames':len({f.tobytes() for f in frames}),'duration_ms':sum(durations),'min_margin_px':min(margins),'whole_body_flow':True,'same_flow_for_color_and_alpha':True,'chromakey':False,'limb_rig':False,'upscaled':False,'metrics':metrics}
(O/'checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
