#!/usr/bin/env python3
"""Assemble approved sprite sheets into alpha PNG frames, GIFs, and review boards."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import argparse, subprocess, tempfile, json, math
ROOT=Path(__file__).resolve().parents[1]
MATTE=(255,230,204)

def prepare(sheet):
 im=Image.open(sheet).convert('RGBA'); frames=[]
 for row in range(4):
  for col in range(3):
   cell=im.crop((round(col*im.width/3),round(row*im.height/4),round((col+1)*im.width/3),round((row+1)*im.height/4)))
   # Remove low-alpha background noise while retaining a soft fur transition.
   a=cell.getchannel('A').point(lambda a: max(0,min(255,round((a-24)*255/216))))
   cell.putalpha(a)
   scale=min(390/cell.width,460/cell.height)
   cell=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.LANCZOS)
   a=cell.getchannel('A').point(lambda a:255 if a>=128 else 0)
   box=a.getbbox(); bottom=box[3]
   foot=a.crop((0,max(0,bottom-15),cell.width,bottom)).getbbox()
   anchor=(foot[0]+foot[2])/2
   canvas=Image.new('RGBA',(400,500))
   canvas.alpha_composite(cell,(round(200-anchor),480-bottom))
   frames.append(canvas)
 return frames

def build(name):
 sheets=ROOT/'source/mascot-sheets';out=ROOT/'source/mascot-frames'/name;out.mkdir(parents=True,exist_ok=True)
 keys=prepare(sheets/(name+'-01-12.png'))+prepare(sheets/(name+'-13-24.png'))
 # Result has an intentional 10px airborne arc, with the same landing baseline.
 if name=='result':
  for i in range(6,15):
   lift=round(10*math.sin(math.pi*(i-6)/8))
   moved=Image.new('RGBA',(400,500));moved.alpha_composite(keys[i],(0,-lift));keys[i]=moved
 with tempfile.TemporaryDirectory() as tmp:
  tmp=Path(tmp)
  for i,im in enumerate(keys+keys[:2]):
   im.save(tmp/f'key-{i:02}.png')
   bg=Image.new('RGBA',im.size,MATTE+(255,));bg.alpha_composite(im);bg.convert('RGB').save(tmp/f'color-{i:02}.png')
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','12','-i',str(tmp/'key-%02d.png'),'-framerate','12','-i',str(tmp/'color-%02d.png'),'-filter_complex','[1:v]format=rgb24,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1[col];[0:v]alphaextract,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1[al];[col][al]alphamerge','-frames:v','48',str(out/'frame_%03d.png')],check=True)
 frames=[Image.open(f).convert('RGBA') for f in sorted(out.glob('frame_*.png'))]
 # Fixed palette prevents color flicker between frames. Reserve index 255 for alpha.
 samples=Image.new('RGB',(400*8,500*6),MATTE)
 for i,f in enumerate(frames):
  bg=Image.new('RGBA',f.size,MATTE+(255,));bg.alpha_composite(f);samples.paste(bg.convert('RGB'),((i%8)*400,(i//8)*500))
 palette=samples.quantize(colors=96,method=Image.Quantize.MEDIANCUT)
 gif=[]
 for f in frames:
  bg=Image.new('RGBA',f.size,MATTE+(255,));bg.alpha_composite(f)
  indexed=bg.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE)
  indexed.paste(255,mask=f.getchannel('A').point(lambda a:255 if a<128 else 0));indexed.info['transparency']=255;gif.append(indexed)
 dest=ROOT/'assets/img/mascot'/f'{name}.gif'
 gif[0].save(dest,save_all=True,append_images=gif[1:],duration=[50 if (i+1)%6==0 else 40 for i in range(48)],loop=0,disposal=2,transparency=255,optimize=False)
 compare=ROOT/'source/mascot-compare';compare.mkdir(exist_ok=True)
 board=Image.new('RGB',(1600,680),(15,27,46));d=ImageDraw.Draw(board);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',24)
 d.text((35,20),f'MOOTECH BUNNY / {name.upper()} / CHARACTER CONSISTENCY',font=font,fill='white')
 ref=Image.open(ROOT/'reference/rabbit-turnaround.png').crop((248,65,540,462));ref.thumbnail((330,450));board.paste(ref,(35,85))
 d.text((35,590),'Approved reference',font=font,fill='#92d7ee')
 for j,k in enumerate([0,22,36]):
  x=410+j*390;bg=Image.new('RGBA',(360,450),MATTE+(255,));f=frames[k].resize((360,450),Image.Resampling.LANCZOS);bg.alpha_composite(f);board.paste(bg.convert('RGB'),(x,85));d.text((x,590),f'Frame {k+1:02d} / 48',font=font,fill='#92d7ee')
 board.save(compare/(name+'.png'),optimize=True)
 print(json.dumps({'name':name,'frames':len(frames),'bytes':dest.stat().st_size,'size':[400,500],'duration_ms':2000}))

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('state',choices=['idle-1','idle-2','idle-3','spinning','result']);build(p.parse_args().state)
