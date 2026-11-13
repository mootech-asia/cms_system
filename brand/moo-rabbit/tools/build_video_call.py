"""Build a whole-pose interpolated call loop with a deterministic brand UI."""
from pathlib import Path
import json, shutil, sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, GifImagePlugin

R=Path(__file__).resolve().parents[1]
O=R/'source/video-call';O.mkdir(parents=True,exist_ok=True)
shutil.copy2(sys.argv[1],O/'keyposes-original.png')
sheet=Image.open(sys.argv[1]).convert('RGBA');assert sheet.size==(1536,1024)
keys=[]
for i in range(6):
    p=sheet.crop((i%3*512,i//3*512,i%3*512+512,i//3*512+512))
    p=p.convert('RGBa').resize((460,460),Image.Resampling.LANCZOS).convert('RGBA')
    p.save(O/f'key-{i:02d}.png')
    keys.append(np.array(p,dtype=np.float32)/255)
flows=[]
for i,a in enumerate(keys):
    b=keys[(i+1)%6]
    gray=lambda c:cv2.cvtColor(np.uint8(c[:,:,:3]*c[:,:,3:]*255),cv2.COLOR_RGB2GRAY)
    dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    flows.append((dis.calc(gray(a),gray(b),None),dis.calc(gray(b),gray(a),None)))
y,x=np.indices((460,460),dtype=np.float32)
def warp(im,flow,t):
    mx=x.copy();my=y.copy()
    for _ in range(8):
        f=cv2.remap(flow,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
        mx=((mx+x-t*f[:,:,0])*.5).astype(np.float32);my=((my+y-t*f[:,:,1])*.5).astype(np.float32)
    return cv2.remap(im,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)

font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f20=ImageFont.truetype(font,20);f22=ImageFont.truetype(font,22)
yy,xx=np.indices((720,720));light=np.exp(-((xx-510)**2+(yy-390)**2)/140000)
bg=np.zeros((720,720,3),dtype=np.uint8)
for c,(base,delta) in enumerate([(5,9),(15,29),(30,35)]):bg[:,:,c]=base+light*delta
base=Image.fromarray(bg).convert('RGBA');d=ImageDraw.Draw(base)
d.rounded_rectangle((12,12,707,707),radius=28,outline='#276584',width=2)
d.line((35,98,685,98),fill='#28506b',width=1)
d.line((35,624,685,624),fill='#28506b',width=1)
logo=Image.open(R.parents[1]/'event/20261111_lucky_wheel/reference/mootech-logo-horizontal-white.png').convert('RGBA')
logo.thumbnail((155,40),Image.Resampling.LANCZOS);base.alpha_composite(logo,(37,39))
d=ImageDraw.Draw(base);d.ellipse((222,45,231,54),fill='#73e3b3');d.text((243,35),'Video Call',font=f22,fill='#edf9ff')
for j in range(4):d.rounded_rectangle((594+j*7,63-j*6,598+j*7,66),radius=1,fill='#78dce9')
d.rounded_rectangle((644,43,664,60),radius=3,outline='#8edfeb',width=2);d.polygon([(665,48),(674,44),(674,60),(665,56)],fill='#8edfeb')
d.rounded_rectangle((36,278,258,476),radius=20,fill='#10273a',outline='#285c77',width=2)
d.arc((116,309,174,365),180,360,fill='#5ae2ee',width=4)
d.rounded_rectangle((114,337,124,359),radius=4,fill='#5ae2ee');d.rounded_rectangle((166,337,176,359),radius=4,fill='#5ae2ee')
d.line((171,357,166,369,151,372),fill='#5ae2ee',width=3)
d.text((67,394),'Connecting...',font=f20,fill='#e0f4ff')
d.rounded_rectangle((61,439,232,445),radius=3,fill='#234459')
for cx in [260,326,392,458]:d.ellipse((cx-24,645,cx+24,693),fill='#203c51' if cx!=458 else '#ee526b')
# Microphone, camera, menu, and hang-up symbols.
d.rounded_rectangle((255,656,265,674),radius=5,outline='white',width=2);d.arc((251,662,269,680),0,180,fill='white',width=2);d.line((260,680,260,684),fill='white',width=2)
d.rounded_rectangle((315,660,331,677),radius=3,outline='white',width=2);d.polygon([(332,665),(338,661),(338,677),(332,673)],fill='white')
for cx in [385,392,399]:d.ellipse((cx-1,668,cx+1,670),fill='white')
d.arc((445,662,471,685),205,335,fill='white',width=4);d.line((446,674,446,678),fill='white',width=4);d.line((470,674,470,678),fill='white',width=4)

times=np.array([0,18,28,32,36,48,71])
frames=[];character_frames=[];margins=[]
for frame in range(72):
    k=min(5,int(np.searchsorted(times,frame,side='right')-1));t=(frame-times[k])/(times[k+1]-times[k]);t=t*t*(3-2*t)
    a=keys[k].copy();b=keys[(k+1)%6].copy();a[:,:,:3]*=a[:,:,3:];b[:,:,:3]*=b[:,:,3:]
    fa,fb=flows[k];c=warp(a,fa,t)*(1-t)+warp(b,fb,1-t)*t
    c[:,:,:3]/=np.maximum(c[:,:,3:],1e-6);c=np.clip(c,0,1)
    if frame in [0,71]:c=keys[0]
    rabbit=Image.fromarray(np.uint8(np.round(c*255)),'RGBA')
    character_frames.append(rabbit)
    a=np.array(rabbit)[:,:,3];ys,xs=np.where(a>64);margins.append([int(xs.min()),int(ys.min()),int(459-xs.max()),int(459-ys.max())])
    out=base.copy();out.alpha_composite(rabbit,(238,138));dr=ImageDraw.Draw(out)
    phase=(1-np.cos(2*np.pi*frame/71))/2
    dr.rounded_rectangle((61,439,77+int(155*phase),445),radius=3,fill='#53d9e7')
    frames.append(out.convert('RGB'))
frames[-1]=frames[0].copy()
contact=Image.new('RGB',(2160,1440))
for j,i in enumerate([0,18,28,32,36,48]):contact.paste(frames[i],(j%3*720,j//3*720))
contact.save(O/'review-keyframes.jpg',quality=94)
palette=contact.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
indexed=[p.quantize(palette=palette,dither=Image.Dither.FLOYDSTEINBERG) for p in frames]
indexed[0].save(R/'video-call.gif',save_all=True,append_images=indexed[1:],duration=40,loop=0,disposal=1,optimize=False)
character_frames[0].save(O/'character-loop.webp',save_all=True,append_images=character_frames[1:],duration=40,loop=0,lossless=True,method=0)
report={'size':[720,720],'frames':72,'duration_ms':2880,'distinct_frames':len({p.tobytes() for p in frames}),'distinct_character_frames':len({p.tobytes() for p in character_frames}),'first_last_identical':frames[0].tobytes()==frames[-1].tobytes(),'native_key_size':[512,512],'render_key_size':[460,460],'whole_pose_flow':True,'limb_rig':False,'alpha_and_rgb_shared_flow':True,'minimum_key_margin':np.min(margins,axis=0).tolist()}
(O/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
