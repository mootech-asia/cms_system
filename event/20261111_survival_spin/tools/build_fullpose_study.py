"""Assemble complete generated poses; no limb rotation or body deformation."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,GifImagePlugin
from scipy.ndimage import label,binary_fill_holes
import numpy as np, subprocess,json,tempfile,shutil
R=Path(__file__).resolve().parents[1];O=R/'source/guard-fullpose-study';K=O/'keys';F=O/'frames';T=Path(tempfile.mkdtemp(prefix='guard-poses-'))
for p in [K,F,T]:p.mkdir(exist_ok=True)
sheet=Image.open(O/'keyposes-original.png').convert('RGB');w,h=sheet.width//2,sheet.height//2
poses=[];metrics=[]
for i in range(4):
 cell=sheet.crop(((i%2)*w,(i//2)*h,(i%2+1)*w,(i//2+1)*h));a=np.array(cell).astype(float)
 fg=~((a[:,:,1]>a[:,:,0]+7)&(a[:,:,1]>a[:,:,2]+1));regions,_=label(fg);counts=np.bincount(regions.ravel());counts[0]=0;fg=binary_fill_holes(regions==counts.argmax())
 ys,xs=np.nonzero(fg);bottom=int(ys.max());footx=np.where(fg[max(0,bottom-25):bottom+1])[1];center=(footx.min()+footx.max())/2
 dx=round(w/2-center);dy=644-bottom
 mask=Image.fromarray((fg*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.6));rgba=cell.convert('RGBA');rgba.putalpha(mask)
 aligned=Image.new('RGBA',(w,h));aligned.alpha_composite(rgba,(dx,dy));aligned=aligned.resize((512,682),Image.Resampling.LANCZOS);aligned.save(K/f'pose-{i:02d}.png')
 bg=Image.new('RGBA',(512,682),'#06231f');shadow=Image.new('RGBA',bg.size);ImageDraw.Draw(shadow).ellipse((153,599,359,618),fill=(0,0,0,100));bg.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(6)));bg.alpha_composite(aligned);poses.append(bg.convert('RGB'))
 metrics.append({'pose':i,'native_cell':[w,h],'translation_only':[dx,dy],'export':[512,682],'source_bottom':bottom})
# Hold complete poses without optical-flow ghosting across sparse keyframes.
sequence=[0]*6+[1]*6+[2]*6+[3]*12+[2]*6+[1]*6+[0]*6
frames=[poses[k].copy() for k in sequence]
for i,frame in enumerate(frames):frame.save(F/f'frame_{i+1:03d}.png')
shutil.rmtree(T)
contact=Image.new('RGB',(1536,1364))
for j,k in enumerate([0,10,18,25,33,47]):contact.paste(frames[k],((j%3)*512,(j//3)*682))
contact.save(O/'keyframes.jpg',quality=95)
palette=contact.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
indexed=[f.quantize(palette=palette,dither=Image.Dither.NONE) for f in frames]
with (O/'anticipation-fullpose-study.gif').open('wb') as f:
 header,_=GifImagePlugin.getheader(indexed[0],info={'loop':0})
 for block in header:f.write(block)
 for i,p in enumerate(indexed):
  for block in GifImagePlugin.getdata(p,duration=50 if i%6==3 else 40,disposal=2):f.write(block)
 f.write(b';')
with Image.open(O/'anticipation-fullpose-study.gif') as gif:
 first=np.array(gif.convert('RGB'));total=0
 for i in range(gif.n_frames):gif.seek(i);total+=gif.info['duration']
 assert gif.n_frames==48 and total==2000 and np.array_equal(first,np.array(gif.convert('RGB')))
report={'status':'motion study only; airborne poses not generated','generated_fullbody_keyposes':4,'frames':48,'unique_poses':4,'interpolation':False,'duration_ms':2000,'size':[512,682],'upscaled':False,'limb_rig_used':False,'poses':metrics}
(O/'checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
