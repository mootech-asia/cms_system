"""Rabbit breathing from the adopted character design; fixed feet and camera."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, GifImagePlugin
from scipy.ndimage import map_coordinates
import numpy as np
import json, math
R=Path(__file__).resolve().parents[1]
O=R/'source/rabbit-motion-v2';O.mkdir(exist_ok=True)
F=O/'idle-breathe-frames';F.mkdir(exist_ok=True)
original=Image.open(R/'assets/img/mascot/base-frame.png').convert('RGBA')
base=Image.new('RGBA',(400,500));ImageDraw.Draw(base).ellipse((100,465,300,478),fill=(25,14,9,70))
base=base.filter(ImageFilter.GaussianBlur(3));base.alpha_composite(original.resize((384,480),Image.Resampling.LANCZOS),(8,8))
base.save(O/'base-frame.png')
a=np.array(base).astype(float);alpha=a[:,:,3]/255
premul=np.dstack((a[:,:,:3]*alpha[:,:,None],a[:,:,3]))
y,x=np.indices((500,400),dtype=float)
# Rigid head translation blends into shoulder lift, then fades before the belt.
def smoothstep(v):
 v=np.clip(v,0,1);return v*v*(3-2*v)
shoulder=smoothstep((y-185)/38)*(1-smoothstep((y-270)/88))
head=1-smoothstep((y-195)/40)
vertical=2.6*head+4.8*shoulder
horizontal=3.2*np.clip((x-200)/90,-1,1)*np.exp(-((y-277)/59)**4)*(1-smoothstep((y-328)/30))
frames=[];preview=[];margins=[]
for i in range(48):
 t=i/47
 # Slower exhale, zero velocity at each loop boundary.
 phase=t/.43 if t<.43 else (1-t)/.57
 breath=(1-math.cos(math.pi*phase))/2
 dx=horizontal*breath;dy=-vertical*breath
 warped=np.stack([map_coordinates(premul[:,:,c],[y-dy,x-dx],order=1,mode='constant') for c in range(4)],axis=-1)
 al=warped[:,:,3:4]/255
 rgb=np.divide(warped[:,:,:3],al,out=np.zeros_like(warped[:,:,:3]),where=al>0)
 rgba=np.uint8(np.rint(np.clip(np.dstack((rgb,warped[:,:,3])),0,255)))
 rgba[365:]=a[365:].astype('uint8')
 im=Image.fromarray(rgba)
 if i in (0,47):im=base.copy()
 im.save(F/f'frame_{i+1:03d}.png');frames.append(im)
 bg=Image.new('RGBA',im.size,'#280f05');bg.alpha_composite(im);preview.append(bg.convert('RGB'))
 box=im.getchannel('A').getbbox();margins.append(min(box[0],box[1],400-box[2],500-box[3]))
 assert np.array_equal(np.array(im)[365:],np.array(base)[365:]),'Lower body moved'
assert min(margins)>=8
samples=Image.new('RGB',(1200,500))
for j,k in enumerate([0,20,36]):samples.paste(preview[k],(j*400,0))
samples.save(O/'breath-keyframes.jpg',quality=94)
palette=samples.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
indexed=[im.quantize(palette=palette,dither=Image.Dither.NONE) for im in preview]
with (O/'idle-breathe-v2.gif').open('wb') as f:
 header,_=GifImagePlugin.getheader(indexed[0],info={'loop':0})
 for block in header:f.write(block)
 for i,p in enumerate(indexed):
  for block in GifImagePlugin.getdata(p,duration=50 if i%6==3 else 40,disposal=2):f.write(block)
 f.write(b';')
frames[0].save(O/'idle-breathe-v2.webp',save_all=True,append_images=frames[1:],duration=[round(2000*(i+1)/48)-round(2000*i/48) for i in range(48)],loop=0,quality=90,method=4)
with Image.open(O/'idle-breathe-v2.gif') as im:
 total=0;decoded=[]
 for i in range(im.n_frames):im.seek(i);total+=im.info['duration'];decoded.append(np.array(im.convert('RGB')))
 assert im.n_frames==48 and total==2000 and np.array_equal(decoded[0],decoded[-1])
metrics={'frames':48,'duration_ms':2000,'minimum_alpha_margin_px':min(margins),'lower_body_exactly_fixed_below_y':365,'head_lift_px':2.6,'shoulder_lift_px_approx':4.8,'chest_expansion_each_side_px_max':3.2,'identical_first_last':True,'preview_background':'#280f05','source':'adopted rabbit character base; fixed framing with baked contact shadow, no new image generation'}
(O/'breath-checks.json').write_text(json.dumps(metrics,indent=2));print(json.dumps(metrics))
