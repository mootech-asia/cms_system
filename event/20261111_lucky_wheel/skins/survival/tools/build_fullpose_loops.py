"""Export whole-pose animation loops with shared endpoints and native-size masters."""
from pathlib import Path
import json,sys
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,GifImagePlugin
from scipy.ndimage import label,binary_fill_holes
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'source/guard-fullpose-v3'
OUT.mkdir(exist_ok=True)
name=sys.argv[1];source=Path(sys.argv[2]);folder=OUT/name;folder.mkdir(exist_ok=True)
if source.resolve()!=(folder/'keyposes-original.png').resolve():
 import shutil
 shutil.copy2(source,folder/'keyposes-original.png')
sheet=Image.open(source).convert('RGB');w,h=sheet.width//2,sheet.height//2
poses=[];margins=[]
for i in range(4):
 cell=sheet.crop((i%2*w,i//2*h,(i%2+1)*w,(i//2+1)*h));a=np.array(cell).astype(float)
 fg=~((a[:,:,1]>a[:,:,0]+7)&(a[:,:,1]>a[:,:,2]+1));regions,_=label(fg);counts=np.bincount(regions.ravel());counts[0]=0;fg=binary_fill_holes(regions==counts.argmax())
 ys,xs=np.nonzero(fg);bottom=int(ys.max());fx=np.where(fg[max(0,bottom-25):bottom+1])[1];dx=round(w/2-(fx.min()+fx.max())/2);dy=round(h*644/724)-bottom
 mask=Image.fromarray((fg*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.6));rgba=cell.convert('RGBA');rgba.putalpha(mask)
 aligned=Image.new('RGBA',(w,h));aligned.alpha_composite(rgba,(dx,dy));aligned=aligned.resize((512,682),Image.Resampling.LANCZOS)
 if i==0:aligned=Image.open(ROOT/'source/guard-fullpose-study/keys/pose-00.png').convert('RGBA')
 shadow=Image.new('RGBA',(512,682));ImageDraw.Draw(shadow).ellipse((153,599,359,618),fill=(0,0,0,100));frame=shadow.filter(ImageFilter.GaussianBlur(6));frame.alpha_composite(aligned)
 frame.save(folder/f'pose-{i:02d}.png');poses.append(frame)
 ys,xs=np.where(np.array(frame)[:,:,3]>16);margins.append(int(min(xs.min(),ys.min(),511-xs.max(),681-ys.max())))
seq=[0]*6+[1]*6+[2]*6+[3]*6+[2]*6+[3]*6+[1]*6+[0]*6
if name in ['recover','celebration']:
 seq=[0]*6+[1]*6+[2]*12+[3]*18+[0]*6
frames=[poses[k] for k in seq];fd=folder/'frames';fd.mkdir(exist_ok=True)
for i,f in enumerate(frames):f.save(fd/f'frame-{i:03d}.png')
mat=[]
for f in poses:
 bg=Image.new('RGBA',f.size,'#06231f');bg.alpha_composite(f);mat.append(bg.convert('RGB'))
contact=Image.new('RGB',(1024,1364))
for i,p in enumerate(mat):contact.paste(p,(i%2*512,i//2*682))
contact.save(folder/'keyframes.jpg',quality=95)
pal=contact.quantize(colors=256,method=Image.Quantize.MEDIANCUT);indexed=[p.quantize(palette=pal,dither=Image.Dither.NONE) for p in mat]
durations=[50 if i%6==3 else 40 for i in range(48)]
with (OUT/f'{name}.gif').open('wb') as f:
 for b in GifImagePlugin.getheader(indexed[0],info={'loop':0})[0]:f.write(b)
 for i,k in enumerate(seq):
  for b in GifImagePlugin.getdata(indexed[k],duration=durations[i],disposal=2):f.write(b)
 f.write(b';')
frames[0].save(OUT/f'{name}.webp',save_all=True,append_images=frames[1:],duration=durations,loop=0,lossless=True)
with Image.open(OUT/f'{name}.gif') as im:
 assert im.n_frames==48
 first=im.convert('RGB').tobytes();total=0
 for i in range(im.n_frames):im.seek(i);total+=im.info['duration']
 assert total==2000 and im.convert('RGB').tobytes()==first
assert min(margins)>=8
report={'name':name,'size':[512,682],'native_pose_size':[w,h],'unique_poses':4,'gif_frame_records':48,'duration_ms':2000,'min_margin_px':min(margins),'common_endpoints':True,'interpolation':False,'limb_rig':False,'style':'Approved stepped full-body poses','runtime_installed':False}
(folder/'checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
