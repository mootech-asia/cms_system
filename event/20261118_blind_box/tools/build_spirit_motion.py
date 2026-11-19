"""Assemble authored 24-frame atlases at 12 fps; no optical-flow interpolation."""
from pathlib import Path
import json, subprocess
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'source/desert-spirit'
OUT=ROOT/'assets/img/mascot/spirit'
DURATIONS=[round((i+1)*1000/12)-round(i*1000/12) for i in range(24)]
report=[]
base=None
for state in ['idle','excited','encourage']:
    atlas=SRC/f'{state}-atlas.png'
    dest=SRC/f'{state}-frames';dest.mkdir(exist_ok=True)
    frames=[]
    for i in range(24):
        target=dest/f'frame-{i:03}.png'
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(atlas),'-vf',f'crop=256:256:{i%6*256}:{i//6*256},scale=376:376:flags=lanczos,pad=400:500:12:112:color=black@0','-frames:v','1',str(target)],check=True)
        frames.append(Image.open(target).convert('RGBA'))
    if base is None:base=frames[0].copy()
    frames[0]=base.copy();frames[-1]=base.copy()
    frames[0].save(dest/'frame-000.png');frames[-1].save(dest/'frame-023.png')
    frames[0].save(OUT/f'{state}.webp',save_all=True,append_images=frames[1:],duration=DURATIONS,loop=0,lossless=True,exact=True,method=6)
    with Image.open(OUT/f'{state}.webp') as check:
        times=[]
        for i in range(check.n_frames):check.seek(i);check.load();times.append(check.info['duration'])
        assert len(times)==24 and sum(times)==2000
        check.seek(0);first=Image.alpha_composite(Image.new('RGBA',check.size,'black'),check.convert('RGBA')).tobytes();check.seek(23);assert first==Image.alpha_composite(Image.new('RGBA',check.size,'black'),check.convert('RGBA')).tobytes()
    report.append({'state':state,'frames':24,'fps':12,'durationMs':2000,'sameEndpoint':True,'lossless':True,'bytes':(OUT/f'{state}.webp').stat().st_size})
base.save(OUT/'poster.webp',lossless=True,exact=True,method=6)
(SRC/'motion-checks.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
