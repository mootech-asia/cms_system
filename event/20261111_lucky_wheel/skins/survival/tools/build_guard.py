"""Render a fixed-camera guard rig; previews remain separate from runtime art."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, GifImagePlugin
from scipy.ndimage import label, map_coordinates
import numpy as np
import math, json

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT/'source/guard-motion'
OUT = ROOT/'source/guard-review'
OUT.mkdir(exist_ok=True)

def clean(path):
    a = np.array(Image.open(path).convert('RGBA'))
    regions, count = label(a[:,:,3] > 16)
    sizes = np.bincount(regions.ravel()); sizes[0] = 0
    keep = sizes[regions] > 300
    a[:,:,3][~keep] = 0
    return Image.fromarray(a)

original = clean(SRC/'guard-original.png')
body = clean(SRC/'body-layer.png')
W,H = original.size

def part(im, points):
    mask = Image.new('L', im.size)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    a = np.array(im).copy()
    a[:,:,3] = (a[:,:,3].astype(float)*np.array(mask)/255).astype('uint8')
    regions,_=label(a[:,:,3]>16)
    sizes=np.bincount(regions.ravel());sizes[0]=0
    a[:,:,3][regions!=sizes.argmax()]=0
    return Image.fromarray(a)

head = part(original, [(0,0),(W,0),(W,380),(0,380)])
torso = part(body, [(0,373),(W,373),(W,H),(0,H)])
arms = {}
for side, polygon, pivot in [
    ('left', [(410,398),(448,469),(452,554),(420,605),(318,616),(324,520),(365,429)], (416,440)),
    ('right', [(697,398),(657,469),(668,554),(684,605),(794,616),(794,520),(750,429)], (700,440))]:
    arms[side+'Upper'] = (part(original,polygon), pivot)
arms['leftLower'] = (part(original,[(319,565),(433,579),(430,648),(403,704),(411,865),(300,865),(298,640)]),(383,587))
arms['rightLower'] = (part(original,[(680,579),(790,565),(814,640),(814,865),(710,865),(706,704),(680,648)]),(738,587))
for side,cx in [('left',383),('right',738)]:
    im,pivot=arms[side+'Upper'];a=np.array(im);yy,xx=np.indices(a.shape[:2])
    a[:,:,3][(yy>570)&(((xx-cx)/58)**2+((yy-570)/58)**2>1)]=0
    arms[side+'Upper']=(Image.fromarray(a),pivot)

def rotate_point(p, center, angle):
    a = math.radians(angle); x,y = p[0]-center[0],p[1]-center[1]
    return (center[0]+x*math.cos(a)+y*math.sin(a), center[1]-x*math.sin(a)+y*math.cos(a))

def composite_rotated(canvas,image,center,angle,offset=(0,0)):
    box=image.getbbox();x0,y0,x1,y1=box
    corners=[rotate_point(p,center,angle) for p in [(x0,y0),(x1,y0),(x1,y1),(x0,y1)]]
    left=math.floor(min(p[0] for p in corners))-2;top=math.floor(min(p[1] for p in corners))-2
    width=math.ceil(max(p[0] for p in corners))-left+2;height=math.ceil(max(p[1] for p in corners))-top+2
    a=math.radians(angle);c,s=math.cos(a),math.sin(a);cx,cy=center
    transform=(c,-s,cx+c*(left-cx)-s*(top-cy)-x0,s,c,cy+s*(left-cx)+c*(top-cy)-y0)
    rotated=image.crop(box).transform((width,height),Image.Transform.AFFINE,transform,Image.Resampling.BICUBIC)
    canvas.alpha_composite(rotated,(left+offset[0],top+offset[1]))

def rig(la=0, lb=0, ra=0, rb=0, tilt=0, nod=0, breath=0, lift=0):
    canvas = Image.new('RGBA',(W,H))
    canvas.alpha_composite(torso)
    for side, upper, lower in [('left',la,lb),('right',ra,rb)]:
        image,pivot = arms[side+'Upper']
        composite_rotated(canvas,image,pivot,upper)
        image,elbow = arms[side+'Lower']
        moved = rotate_point(elbow,pivot,upper)
        composite_rotated(canvas,image,elbow,upper+lower,(round(moved[0]-elbow[0]),round(moved[1]-elbow[1])))
    composite_rotated(canvas,head,(561,374),tilt,(0,round(nod)))
    # Contact shadow lives inside every RGBA frame, below the feet.
    shadow=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(shadow)
    d.ellipse((350+lift,1282,800-lift,1345),fill=(15,10,20,round(65-lift*.6)))
    shadow=shadow.filter(ImageFilter.GaussianBlur(13))
    shadow.alpha_composite(canvas,(0,-round(lift)))
    out=Image.new('RGBA',(400,500));out.alpha_composite(shadow.resize((370,462),Image.Resampling.LANCZOS),(15,16))
    if breath:
        a=np.array(out);yy,xx=np.indices((500,400))
        weight=np.exp(-((xx-200)/34)**4-((yy-190)/29)**4)
        dx=.65*breath*weight*(xx-200)/34;dy=.35*breath*weight
        rgb=np.stack([map_coordinates(a[:,:,c],[yy-dy,xx-dx],order=1,mode='nearest') for c in range(3)],axis=-1)
        out=Image.fromarray(np.dstack((rgb,a[:,:,3])).astype('uint8'))
    return out

base=rig();base.save(OUT/'base-frame.png')
all_frames={}
for name in ['idle-1','idle-2','idle-3','spinning','result','lose']:
    cached=sorted((SRC/'frames'/name).glob('frame_*.png'))
    if len(cached)==48:
        all_frames[name]=[Image.open(p).convert('RGBA') for p in cached]
        continue
    frames=[]
    for i in range(48):
        t=i/47; e=math.sin(math.pi*t)**2
        if name=='idle-1': im=rig(breath=math.sin(2*math.pi*t),tilt=.6*math.sin(2*math.pi*t)*e)
        elif name=='idle-2': im=rig(tilt=5*math.sin(2*math.pi*t)*e,ra=1.5*e,la=-1.5*e)
        elif name=='idle-3': im=rig(ra=12*e,rb=(95+12*math.sin(6*math.pi*t))*e,tilt=-2*e)
        elif name=='spinning': im=rig(la=-5*e,lb=95*e,ra=5*e,rb=-95*e,tilt=1.5*math.sin(4*math.pi*t)*e)
        elif name=='result': im=rig(la=-40*e,lb=-125*e,ra=40*e,rb=125*e,tilt=-3*e,lift=24*e)
        else: im=rig(la=2*e,ra=-2*e,tilt=6*e,nod=9*e)
        if i in (0,47):im=base.copy()
        frames.append(im)
    all_frames[name]=frames

sheet=Image.new('RGB',(1200,500*len(all_frames)),'#26332f')
for row,(name,frames) in enumerate(all_frames.items()):
    for col,i in enumerate([0,16,28]):
        sheet.paste(frames[i],(400*col,500*row),frames[i])
sheet.save(OUT/'keyframes.jpg',quality=92)
matte=Image.new('RGBA',(400,500),(52,60,56,255))
palette=sheet.quantize(colors=255,method=Image.Quantize.MEDIANCUT)
metrics={}
for name,frames in all_frames.items():
    folder=SRC/'frames'/name;folder.mkdir(parents=True,exist_ok=True)
    indexed=[];bounds=[]
    for i,im in enumerate(frames):
        im.save(folder/f'frame_{i+1:03d}.png')
        bounds.append(im.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox())
        p=Image.alpha_composite(matte,im).convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE)
        p.paste(255,mask=im.getchannel('A').point(lambda a:255 if a<128 else 0));indexed.append(p)
    with (OUT/f'{name}.gif').open('wb') as f:
        header,_=GifImagePlugin.getheader(indexed[0],info={'loop':0,'transparency':255})
        for block in header:f.write(block)
        for i,p in enumerate(indexed):
            for block in GifImagePlugin.getdata(p,duration=50 if i%6==3 else 40,disposal=2,transparency=255):f.write(block)
        f.write(b';')
    durations=[round(2000*(i+1)/48)-round(2000*i/48) for i in range(48)]
    if not (OUT/f'{name}.webp').exists() or not (OUT/f'{name}.webp').stat().st_size:
        frames[0].save(OUT/f'{name}.webp',save_all=True,append_images=frames[1:],duration=durations,loop=0,quality=88,method=4)
    with Image.open(OUT/f'{name}.gif') as gif:
        total=0
        for i in range(gif.n_frames):gif.seek(i);total+=gif.info['duration']
        assert gif.n_frames==48 and total==2000
    margins=[min(x0,y0,400-x1,500-y1) for x0,y0,x1,y1 in bounds]
    assert min(margins)>=8
    assert np.array_equal(np.array(frames[0]),np.array(frames[-1]))
    metrics[name]={'frames':48,'duration_ms':2000,'minimum_margin_px':min(margins),'identical_first_last':True,'canvas':[400,500]}
(OUT/'checks.json').write_text(json.dumps(metrics,indent=2))
print(json.dumps(metrics,indent=2))
