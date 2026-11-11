"""把吉祥物 GIF 轉成動態 WebP（網頁實際載入的版本）。

美術交付仍是 GIF（規格、頭尾基準幀檢查都以 GIF 為準）；GIF 每段約 1.2MB，手機網路慢時
換動作會整隻消失好幾秒，所以網頁改載入同內容的動態 WebP（約 1/3 大小）。
每幀時長照抄 GIF，循環總長不變。WebP 比 GIF 還大時（例：idle-1）保留 GIF。

用法：python3 tools/gif_to_webp.py [assets/img/mascot/xxx.gif ...]（不帶參數＝全部）
"""
import glob
import os
import sys

from PIL import Image, ImageSequence

here = os.path.dirname(os.path.abspath(__file__))
paths = sys.argv[1:] or sorted(glob.glob(os.path.join(here, '..', 'assets', 'img', 'mascot', '*.gif')))
for gif in paths:
    im = Image.open(gif)
    frames, durs = [], []
    for f in ImageSequence.Iterator(im):
        frames.append(f.convert('RGBA'))
        durs.append(f.info.get('duration', 40))
    out = gif[:-4] + '.webp'
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=durs, loop=0,
                   quality=80, method=6)
    g, w = os.path.getsize(gif), os.path.getsize(out)
    if w >= g:
        os.remove(out)
        print('%s: WebP 沒有比較小（%dKB >= %dKB），保留 GIF' % (os.path.basename(gif), w // 1024, g // 1024))
    else:
        print('%s -> %s  %dKB -> %dKB, %d 幀, %dms' % (os.path.basename(gif), os.path.basename(out), g // 1024, w // 1024, len(frames), sum(durs)))
