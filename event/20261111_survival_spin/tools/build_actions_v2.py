"""Coordinated pose and weight shifts using the accepted guard source layers."""
from pathlib import Path
from PIL import Image, GifImagePlugin
from scipy.ndimage import map_coordinates
import numpy as np
import math,json
R=Path(__file__).resolve().parents[1];O=R/'source/guard-motion-v2'
# Load only the existing rig definitions, never its legacy batch-export section.
rig_path=Path(__file__).with_name('build_guard.py')
source=rig_path.read_text();marker='\nbase=rig();'
assert source.count(marker)==1
ns={'__file__':str(rig_path)};exec(compile(source.split(marker)[0],str(rig_path),'exec'),ns)
# Rounded overlap caps keep the elbow cut edges inside the moving sleeve.
for side,cx in [('left',383),('right',738)]:
 for section,cy,radius,above in [('Upper',560,47,False),('Lower',613,59,True)]:
  im,pivot=ns['arms'][side+section];a=np.array(im);yy,xx=np.indices(a.shape[:2])
  side_mask=yy<cy if above else yy>cy
  a[:,:,3][side_mask&((xx-cx)**2+(yy-cy)**2>radius**2)]=0
  ns['arms'][side+section]=(Image.fromarray(a),pivot)
rig=ns['rig'];base=Image.open(R/'source/guard-review/base-frame.png').convert('RGBA')
y,x=np.indices((500,400),dtype=float)
def smooth(v):
 v=np.clip(v,0,1);return v*v*(3-2*v)
def curve(t,points):
 for (ta,a),(tb,b) in zip(points,points[1:]):
  if ta<=t<=tb:return a+(b-a)*float(smooth((t-ta)/(tb-ta)))
 return points[-1][1]
def deform(im,lean=0,dip=0,chest=0,knees=0):
 a=np.array(im).astype(float);alpha=a[:,:,3:4]/255
 premul=np.dstack((a[:,:,:3]*alpha,a[:,:,3]))
 upper=1-smooth((y-210)/205)
 chestw=np.exp(-((y-175)/36)**4)*(1-smooth((y-210)/25))
 dx=lean*upper+chest*np.clip((x-200)/55,-1,1)*chestw
 dx+=knees*np.sign(x-200)*np.exp(-((y-337)/42)**4)
 dy=dip*upper-abs(chest)*.65*chestw
 data=np.stack([map_coordinates(premul[:,:,c],[y-dy,x-dx],order=1,mode='constant') for c in range(4)],axis=-1)
 al=data[:,:,3:4]/255
 rgb=np.divide(data[:,:,:3],al,out=np.zeros_like(data[:,:,:3]),where=al>0)
 out=np.uint8(np.rint(np.clip(np.dstack((rgb,data[:,:,3])),0,255)))
 out[420:]=a[420:].astype('uint8')
 return Image.fromarray(out)

names=['idle-look','idle-greet','anticipation','celebration','recover']
allframes={}
for name in names:
 frames=[]
 for i in range(48):
  t=i/47;e=math.sin(math.pi*t)**2
  if name=='idle-look':
   turn=curve(t,[(0,0),(.25,1),(.38,1),(.68,-.9),(.78,-.9),(1,0)])
   im=deform(rig(tilt=-6.5*turn,la=-2*e,ra=2*e),lean=6*turn,chest=1.8*e)
  elif name=='idle-greet':
   raise_=curve(t,[(0,0),(.2,.85),(.32,1),(.72,1),(1,0)])
   wave=math.sin(6*math.pi*(t-.25))*math.sin(math.pi*np.clip((t-.22)/.55,0,1))**2
   im=deform(rig(ra=27*raise_+5*wave,rb=122*raise_+12*wave,la=-4*raise_,tilt=-4*raise_),lean=-4*raise_,dip=-1.5*raise_,chest=1.3*e)
  elif name=='anticipation':
   ready=curve(t,[(0,0),(.2,1),(.75,1),(1,0)])
   pulse=math.sin(6*math.pi*t)*e
   im=deform(rig(la=-7*ready,lb=76*ready,ra=7*ready,rb=-76*ready,tilt=2*pulse),dip=5*ready+1.4*pulse,knees=3*ready,chest=2*ready)
  elif name=='celebration':
   arms=curve(t,[(0,0),(.16,-.08),(.38,1),(.58,1),(.8,.25),(1,0)])
   hop=curve(t,[(0,0),(.23,0),(.43,1),(.51,1),(.73,0),(1,0)])
   squat=curve(t,[(0,0),(.17,1),(.3,0),(.68,0),(.78,1),(1,0)])
   im=deform(rig(la=-48*arms,lb=-118*max(0,arms),ra=52*arms,rb=112*max(0,arms),tilt=-3*arms,lift=65*hop),lean=-2*hop,dip=7*squat,knees=4*squat,chest=1.5*arms)
  else:
   bow=curve(t,[(0,0),(.25,1),(.43,1),(.72,.3),(1,0)])
   recover=curve(t,[(0,0),(.45,0),(.68,1),(.8,.8),(1,0)])
   im=deform(rig(tilt=8*bow-3*recover,nod=10*bow,ra=7*recover,rb=-60*recover,la=-2*bow),lean=3*bow,dip=5*bow,knees=1.5*bow,chest=recover)
  if i in (0,47):im=base.copy()
  frames.append(im)
 allframes[name]=frames
 print('Rendered',name,flush=True)

samples=Image.new('RGB',(1600,500*len(names)),'#06231f')
for row,(name,frames) in enumerate(allframes.items()):
 for col,k in enumerate([0,12,23,36]):
  samples.paste(frames[k],(400*col,500*row),frames[k])
samples.save(O/'actions-keyframes.jpg',quality=94)
palette=samples.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
report={}
for name,frames in allframes.items():
 folder=O/(name+'-frames');folder.mkdir(exist_ok=True)
 indexed=[];margins=[]
 for i,im in enumerate(frames):
  im.save(folder/f'frame_{i+1:03d}.png')
  box=im.getchannel('A').getbbox();margins.append(min(box[0],box[1],400-box[2],500-box[3]))
  bg=Image.new('RGBA',im.size,'#06231f');bg.alpha_composite(im)
  indexed.append(bg.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE))
 assert min(margins)>=8,(name,min(margins))
 assert np.array_equal(np.array(frames[0]),np.array(base)) and np.array_equal(np.array(frames[-1]),np.array(base))
 path=O/(name+'-v2.gif')
 with path.open('wb') as f:
  header,_=GifImagePlugin.getheader(indexed[0],info={'loop':0})
  for block in header:f.write(block)
  for i,p in enumerate(indexed):
   for block in GifImagePlugin.getdata(p,duration=50 if i%6==3 else 40,disposal=2):f.write(block)
  f.write(b';')
 frames[0].save(O/(name+'-v2.webp'),save_all=True,append_images=frames[1:],duration=[round(2000*(i+1)/48)-round(2000*i/48) for i in range(48)],loop=0,quality=90,method=4)
 with Image.open(path) as gif:
  first=np.array(gif.convert('RGB'));duration=0
  for i in range(gif.n_frames):gif.seek(i);duration+=gif.info['duration']
  assert gif.n_frames==48 and duration==2000
  assert np.array_equal(first,np.array(gif.convert('RGB')))
 report[name]={'frames':48,'duration_ms':2000,'minimum_alpha_margin_px':min(margins),'shared_base_first_last':True,'bytes':path.stat().st_size}
 print('Exported',name,flush=True)
(O/'actions-checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
