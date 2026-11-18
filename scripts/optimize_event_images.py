"""Compress static delivery images, keeping geometry/alpha and immutable source art.

Default is a dry run; --write replaces only candidates saving at least 8%.
The manifest records byte counts and RGB PSNR (transparent pixels excluded).
Animated sources are handled separately by optimize_event_mascots.py.
"""
import argparse
import io
import json
import math
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FOLDERS = ['event/20261118_card_pack/assets/img', 'event/20261118_blind_box/assets/img',
           'event/20261111_lucky_wheel/assets/img', 'event/20261111_survival_spin/img']


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--report', default='/tmp/event-image-compression.json')
    args = parser.parse_args()
    rows = []
    for folder in FOLDERS:
        for path in sorted((ROOT / folder).rglob('*')):
            if path.suffix.lower() not in ('.webp', '.jpg', '.jpeg') or 'mascot' in path.parts:
                continue
            with Image.open(path) as src:
                if getattr(src, 'n_frames', 1) != 1:
                    continue
                rgba = src.convert('RGBA')
                quality = 90 if any(x in path.parts for x in ('ui', 'title')) or 'title-' in path.name else 86
                candidate = io.BytesIO()
                if path.suffix == '.webp':
                    rgba.save(candidate, format='WEBP', quality=quality, method=6, exact=True)
                else:
                    rgba.convert('RGB').save(candidate, format='JPEG', quality=86, optimize=True, progressive=True)
                data = candidate.getvalue()
                check = Image.open(io.BytesIO(data)).convert('RGBA')
                a, b = np.array(rgba).astype(float), np.array(check).astype(float)
                mask = a[:, :, 3] > 32
                mse = np.mean((a[:, :, :3][mask] - b[:, :, :3][mask]) ** 2) if mask.any() else 0
                psnr = 10 * math.log10(255**2 / mse) if mse else 100
                assert rgba.size == check.size and np.array_equal(a[:, :, 3], b[:, :, 3])
                before = path.stat().st_size
                accepted = len(data) < before * .92 and psnr >= 36
                if accepted and args.write:
                    path.write_bytes(data)
                rows.append(dict(path=str(path.relative_to(ROOT)), before=before,
                                 after=len(data) if accepted else before, psnr=round(psnr, 2),
                                 changed=accepted, size=rgba.size))
    Path(args.report).write_text(json.dumps(rows, indent=2))
    print(json.dumps(dict(files=len(rows), changed=sum(r['changed'] for r in rows),
                          before=sum(r['before'] for r in rows), after=sum(r['after'] for r in rows))))


if __name__ == '__main__':
    main()
