from pathlib import Path
from PIL import Image
import numpy as np
import json

root=Path(__file__).resolve().parent
base=np.array(Image.open(root/'base-frame.png').convert('RGBA'))
report=[]
for name in ['idle-1','idle-2','idle-3','spinning','result','lose']:
    paths=sorted((root.parent/'guard-motion/frames'/name).glob('frame_*.png'))
    assert len(paths)==48
    raw=[]
    for path in paths:
        im=Image.open(path);assert im.size==(400,500) and im.mode=='RGBA'
        a=np.array(im);raw.append(a)
        box=im.getchannel('A').getbbox()
        assert min(box[0],box[1],400-box[2],500-box[3])>=8,(name,path,box)
    assert np.array_equal(raw[0],base) and np.array_equal(raw[-1],base)
    for ext in ['gif','webp']:
        im=Image.open(root/f'{name}.{ext}')
        if ext=='gif':assert im.n_frames==48
        else:assert 24<=im.n_frames<=48
        frames=[];duration=0;margins=[]
        for i in range(im.n_frames):
            im.seek(i);frame=im.convert('RGBA');frames.append(np.array(frame));duration+=im.info.get('duration',0)
            b=frame.getchannel('A').getbbox();margins.append(min(b[0],b[1],400-b[2],500-b[3]))
        assert duration==2000,(name,ext,duration)
        assert min(margins)>=8
        first,last=frames[0].astype(float),frames[-1].astype(float)
        seam=float((np.abs(first[:,:,:3]*first[:,:,3:4]/255-last[:,:,:3]*last[:,:,3:4]/255)).mean())
        assert np.array_equal(first[:,:,3],last[:,:,3])
        assert seam<1.5,(name,ext,'visible loop seam',seam)
        if ext=='gif':assert np.array_equal(frames[0],frames[-1])
        assert any(not np.array_equal(frames[0],f) for f in frames[1:-1])
        report.append({'state':name,'format':ext,'frames':im.n_frames,'duration_ms':duration,'minimum_margin_px':min(margins),'exact_loop_seam':bool(np.array_equal(frames[0],frames[-1])),'premultiplied_seam_mean_255':seam,'motion_present':True,'bytes':(root/f'{name}.{ext}').stat().st_size})
(root/'audit.json').write_text(json.dumps(report,indent=2))
print('PASS: 288 RGBA frames, six GIF loops and six WebP loops; no clipping.')
