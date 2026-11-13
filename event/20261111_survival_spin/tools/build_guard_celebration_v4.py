"""Render the drawn pose sequence without morphing, optical flow or crossfades."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageSequence
root=Path(__file__).resolve().parents[1]/'source/guard-celebration-v4'
sheet=Image.open(root/'keyposes-original.png').convert('RGBA')
assert sheet.size==(1086,1448)
frames=[];bounds=[]
(root/'poses').mkdir(exist_ok=True)
shadow=Image.new('RGBA',(320,400));ImageDraw.Draw(shadow).ellipse((104,366,216,380),fill=(0,0,0,55));shadow=shadow.filter(ImageFilter.GaussianBlur(3))
for i in range(12):
 cell=sheet.crop((i%3*362,i//3*362,(i%3+1)*362,(i//3+1)*362))
 a=np.array(cell.getchannel('A'));ys,xs=np.where(a>128);bottom=int(ys.max());feet=np.where(a[bottom-12:bottom+1]>128)[1];center=(int(feet.min())+int(feet.max()))/2
 # Integer translation only: the generated anatomy and texture remain untouched.
 out=Image.new('RGBA',(320,400));out.alpha_composite(cell,(round(160-center),374-bottom))
 composite=shadow.copy();composite.alpha_composite(out);frames.append(composite)
 mask=np.array(out.getchannel('A'));yy,xx=np.where(mask>16);bounds.append([int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)])
 assert min(xx.min(),yy.min(),319-xx.max(),399-yy.max())>=12
 composite.save(root/'poses'/f'{i:02d}.png')
order=[0]+list(range(1,11))+[11]+list(range(10,0,-1))+[0]
durations=[180]+[70]*10+[240]+[70]*10+[180]
assert sum(durations)==2000
sequence=[frames[i] for i in order]
sequence[0].save(root/'celebration.webp',save_all=True,append_images=sequence[1:],duration=durations,loop=0,lossless=True,method=6)
mat=[]
for f in frames:
 bg=Image.new('RGBA',f.size,'#06231f');bg.alpha_composite(f);mat.append(bg.convert('RGB'))
contact=Image.new('RGB',(1280,1200),'#06231f')
for i,f in enumerate(mat):contact.paste(f,(i%4*320,i//4*400))
contact.save(root/'review-dark.jpg',quality=95)
palette=contact.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
gif=[mat[i].quantize(palette=palette,dither=Image.Dither.NONE) for i in order]
gif[0].save(root/'celebration.gif',save_all=True,append_images=gif[1:],duration=durations,loop=0,disposal=2,optimize=False)
contact=Image.new('RGB',(1280,1200),'#eeeeee')
for i,f in enumerate(frames):
 bg=Image.new('RGBA',f.size,'#eeeeee');bg.alpha_composite(f);contact.paste(bg.convert('RGB'),(i%4*320,i//4*400))
contact.save(root/'review-light.jpg',quality=95)
with Image.open(root/'celebration.gif') as im:
 decoded=[f.convert('RGB').copy() for f in ImageSequence.Iterator(im)]
 assert len(decoded)==len(order) and decoded[0].tobytes()==decoded[-1].tobytes()
 assert sum(f.info['duration'] for f in ImageSequence.Iterator(im))==2000
 # Each decoded GIF frame must equal its independent palette image: no stale pixels.
 for a,b in zip(decoded,gif):assert a.tobytes()==b.convert('RGB').tobytes()
with Image.open(root/'celebration.webp') as im:
 for i,expected in enumerate(sequence):
  im.seek(i);a=np.array(im.convert('RGBA'));b=np.array(expected);assert np.array_equal(a[:,:,3],b[:,:,3]);mask=a[:,:,3]>0;assert np.max(np.abs(a[:,:,:3].astype(int)-b[:,:,:3].astype(int))[mask])<=1
report={'native_sheet':list(sheet.size),'native_cell':[362,362],'output':[320,400],'drawn_poses':12,'encoded_frames':len(order),'duration_ms':2000,'pose_order':order,'frame_durations_ms':durations,'body_bounds':bounds,'upscaled':False,'crossfade':False,'optical_flow':False,'mesh_warp':False,'frame_disposal_verified':True,'runtime_installed':False}
(root/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
