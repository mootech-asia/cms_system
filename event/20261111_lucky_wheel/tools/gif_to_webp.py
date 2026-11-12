"""把吉祥物動態轉成動態 WebP（網頁實際載入的版本）。

來源優先用 PNG 序列幀 source/mascot-frames/<狀態>/（RGBA，含畫進角色的半透明影子）；沒有序列幀才用 GIF
（GIF 只有 1-bit 透明，影子會變顆粒）。GIF 每段約 1.2MB，手機網路慢時換動作會整隻消失好幾秒，
動態 WebP 約 1/3 大小。序列幀的每幀時長平均分配到 MASCOT_LOOP_MS；GIF 則照抄每幀時長。
WebP 比來源 GIF 還大時（例：只有眨眼的待機）保留 GIF。

用法：python3 tools/gif_to_webp.py [assets/img/mascot/xxx.gif ...]（不帶參數＝全部）
"""
import glob
import os
import sys

from PIL import Image, ImageSequence

here = os.path.dirname(os.path.abspath(__file__))
paths = sys.argv[1:] or sorted(glob.glob(os.path.join(here, '..', 'assets', 'img', 'mascot', '*.gif')))
MASCOT_LOOP_MS = 2000
frames_root = os.path.join(here, '..', 'source', 'mascot-frames')

for gif in paths:
    name = os.path.splitext(os.path.basename(gif))[0]
    fdir = os.path.join(frames_root, name)
    pngs = sorted(glob.glob(os.path.join(fdir, '*.png'))) if os.path.isdir(fdir) else []
    if len(pngs) >= 24:
        frames = [Image.open(f).convert('RGBA') for f in pngs]
        n = len(frames)
        durs = [round(MASCOT_LOOP_MS * (i + 1) / n) - round(MASCOT_LOOP_MS * i / n) for i in range(n)]
        from_frames = True
        print('%s：使用 PNG 序列幀 %d 張' % (name, n))
    else:
        from_frames = False
        im = Image.open(gif)
        frames, durs = [], []
        for f in ImageSequence.Iterator(im):
            frames.append(f.convert('RGBA'))
            durs.append(f.info.get('duration', 40))
    out = gif[:-4] + '.webp'
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=durs, loop=0,
                   quality=80, method=6)
    g, w = os.path.getsize(gif), os.path.getsize(out)
    if w >= g and not from_frames:
        os.remove(out)
        print('%s: WebP 沒有比較小（%dKB >= %dKB），保留 GIF' % (os.path.basename(gif), w // 1024, g // 1024))
    else:
        print('%s -> %s  %dKB -> %dKB, %d 幀, %dms' % (os.path.basename(gif), os.path.basename(out), g // 1024, w // 1024, len(frames), sum(durs)))
