"""Export generated title/lighting sources to the delivery canvas and alpha contract."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/img'
SRC = ROOT / 'source/lighting-v4'

def smooth(a, b, x):
    t = np.clip((x-a)/(b-a), 0, 1)
    return t*t*(3-2*t)

def source(name, size):
    return np.asarray(Image.open(SRC / (name+'-original.png')).convert('RGBA').resize(size, Image.Resampling.LANCZOS)).astype(float)

def save(name, arr):
    Image.fromarray(np.clip(np.rint(arr), 0, 255).astype('uint8'), 'RGBA').save(OUT / (name+'.png'))

for lang in ['en', 'ko', 'th']:
    im = Image.open(ROOT / f'source/title-v4/title-{lang}-original.png').convert('RGBA')
    im.thumbnail((648, 212), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (690, 240))
    canvas.alpha_composite(im, ((690-im.width)//2, (240-im.height)//2))
    canvas.save(OUT / f'title-{lang}.webp', lossless=True)

# Keep generated haze and dust; constrain its falloff rather than drawing a flat wedge.
a = source('spotlight', (260, 900))
y, x = np.mgrid[0:900, 0:260]
half = 15 + 108 * np.clip(y/650, 0, 1)
side = 1-smooth(.45, 1.05, abs(x-129.5)/half)
fade = smooth(0, 12, y) * (1-smooth(460, 765, y))
a[:,:,3] *= side * fade * (.95-.35*y/900)
a[:,:,:3] = np.maximum(a[:,:,:3], [235, 220, 190])
a[[0,-1],:,3] = 0
a[:,[0,-1],3] = 0
a[765:,:,3] = 0
save('spotlight', a)

a = source('light-pool', (600, 220))
y,x = np.mgrid[0:220,0:600]
r = np.sqrt(((x-299.5)/299)**2+((y-109.5)/80)**2)
a[:,:,3] *= (1-smooth(.55,1,r))*.52
a[:,:,:3] = np.maximum(a[:,:,:3], [245,225,190])
save('light-pool', a)

a = source('stage-vignette', (750, 1000))
y,x = np.mgrid[0:1000,0:750]
r = np.sqrt(((x-374.5)/375)**2+((y-449.5)/500)**2)
haze = a[:,:,:3].mean(axis=2)/255
a[:,:,3] = 255*smooth(.35,1.1,r)*(.63+.06*haze)
a[:,:,:3] = np.array([40,15,5])+haze[:,:,None]*np.array([9,6,3])
save('stage-vignette', a)

# Register both source glass rims to the same 24px body before adding the glow.
for name in ['bulb-off','bulb-on']:
    im = Image.open(SRC/(name+'-original.png')).convert('RGBA')
    box = (305,309,933,939)
    im = im.resize((1254,1254), Image.Resampling.LANCZOS)
    body = im.crop(box).resize((24,24),Image.Resampling.LANCZOS)
    mask = Image.open(SRC/'bulb-off-original.png').convert('RGBA').crop(box).resize((24,24),Image.Resampling.LANCZOS).getchannel('A')
    body.putalpha(mask)
    canvas = Image.new('RGBA',(48,48))
    if name == 'bulb-on':
        yy,xx=np.mgrid[0:48,0:48]
        rr=np.sqrt((xx-23.5)**2+(yy-23.5)**2)
        glow=np.zeros((48,48,4));glow[:,:,:3]=[255,222,155]
        glow[:,:,3]=120*np.exp(-(rr/15)**2)*(1-smooth(18,23,rr))
        canvas=Image.fromarray(glow.astype('uint8'),'RGBA')
    canvas.alpha_composite(body,(12,12))
    canvas.save(OUT/(name+'.png'))

metrics={}
for name in ['spotlight','light-pool','stage-vignette','bulb-on','bulb-off']:
    im=Image.open(OUT/(name+'.png'));a=np.array(im)[:,:,3]
    metrics[name]={'size':list(im.size),'alphaRange':[int(a.min()),int(a.max())],
                   'edgeAlphaMax':int(max(a[0].max(),a[-1].max(),a[:,0].max(),a[:,-1].max()))}
(SRC/'export-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')
