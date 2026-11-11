#!/usr/bin/env python3
"""Render a fixed-silhouette idle loop from one base and a masked blink keyframe."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,GifImagePlugin,ImageChops
from scipy.ndimage import map_coordinates
import numpy as np,json,math
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'source/mascot-v3';OUT=ROOT/'source/mascot-frames/idle-1';OUT.mkdir(exist_ok=True)
base=Image.open(SRC/'base-frame.png').convert('RGBA');base.save(ROOT/'assets/img/mascot/base-frame.png');closed=Image.open(SRC/'blink-aligned-draft.png').convert('RGBA')
mask=Image.new('L',base.size);d=ImageDraw.Draw(mask)
d.ellipse((157,128,189,147),fill=255);d.ellipse((205,127,236,146),fill=255);mask=mask.filter(ImageFilter.GaussianBlur(1.2))
blink=Image.composite(closed,base,mask);blink.putalpha(base.getchannel('A'));blink.save(SRC/'blink-keyframe.png')
a=np.array(base);yy,xx=np.indices((500,400));wx=np.clip((xx-112)/176,0,1);wy=np.clip((yy-225)/130,0,1);weight=np.sin(np.pi*wx)**2*np.sin(np.pi*wy)**2
frames=[]
blink_curve={16:.22,17:.72,18:1,19:1,20:.7,21:.22}
for i in range(48):
 t=2*math.pi*i/47;breath=math.sin(t)
 # Sub-pixel fabric displacement strictly inside the vest; no camera/body scaling.
 dx=.75*breath*weight*(xx-200)/88;dy=.35*breath*weight
 rgb=np.stack([map_coordinates(a[:,:,c],[yy-dy,xx-dx],order=1,mode='nearest') for c in range(3)],axis=-1).astype('uint8')
 rgba=np.dstack([rgb,a[:,:,3]]);im=Image.fromarray(rgba)
 if i in blink_curve:im=Image.composite(blink,im,mask.point(lambda v:round(v*blink_curve[i])))
 if i in (0,47):im=base.copy()
 im.save(OUT/f'frame_{i+1:03d}.png');frames.append(im)
# One palette and explicit delta records retain all 48 frames, including holds.
matte=Image.new('RGBA',base.size,(255,230,204,255));samples=Image.new('RGB',(800,640));samples.paste(Image.alpha_composite(matte,base).convert('RGB'),(0,0));samples.paste(Image.alpha_composite(matte,blink).convert('RGB'),(400,0));samples.paste(base.crop((145,120,245,155)).convert('RGB').resize((400,140)),(0,500));samples.paste(blink.crop((145,120,245,155)).convert('RGB').resize((400,140)),(400,500));palette=samples.quantize(colors=255,method=Image.Quantize.MEDIANCUT)
indexed=[]
for im in frames:
 p=Image.alpha_composite(matte,im).convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE);p.paste(255,mask=im.getchannel('A').point(lambda v:255 if v<128 else 0));indexed.append(p)
path=ROOT/'assets/img/mascot/idle-1.gif'
with path.open('wb') as f:
 header,_=GifImagePlugin.getheader(indexed[0],info={'loop':0,'transparency':255})
 for block in header:f.write(block)
 prev=None
 for i,p in enumerate(indexed):
  if prev is None:part=p;offset=(0,0)
  else:
   ar=np.array(p);old=np.array(prev);diff=ar!=old;box=Image.fromarray(diff).getbbox()
   if box:
    ar[~diff]=255;part=Image.fromarray(ar,'P');part.putpalette(p.getpalette());part=part.crop(box);offset=box[:2]
   else:part=Image.new('P',(1,1),255);part.putpalette(p.getpalette());offset=(0,0)
  for block in GifImagePlugin.getdata(part,offset=offset,duration=50 if i%6==3 else 40,disposal=1,transparency=255):f.write(block)
  prev=p
 f.write(b';')
with Image.open(path) as im:
 decoded=[];duration=0
 for i in range(im.n_frames):im.seek(i);decoded.append(np.array(im.convert('RGBA')));duration+=im.info['duration']
 assert im.n_frames==48 and duration==2000
 assert np.array_equal(decoded[0],decoded[-1])
 alpha=decoded[0][:,:,3];assert all(np.array_equal(f[:,:,3],alpha) for f in decoded)
 metrics={'frames':len(decoded),'duration_ms':duration,'loop':im.info.get('loop'),'bytes':path.stat().st_size,'identical_first_last':True,'silhouette_pixels_changed':0,'canvas':[400,500],'base_bbox':base.getbbox(),'max_internal_fabric_displacement_px':.75,'blink_frames':[17,22]}
(SRC/'idle-1-metrics.json').write_text(json.dumps(metrics,indent=2));print(json.dumps(metrics))
