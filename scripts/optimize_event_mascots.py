"""Rebuild web delivery copies from the preserved event animation sources."""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'event'
GROUPS = [
    ('20261111_lucky_wheel', 'source/mascot', ['idle-1', 'spinning', 'result', 'lose']),
    ('20261111_survival_spin', 'source/mascot/rifle-v1', ['idle', 'anticipation', 'disappointment']),
]


def export_animation(base, name):
    source = base / (name + '.webp')
    relative = base.relative_to(ROOT)
    destination = ROOT / relative.parts[0] / 'assets/img' / Path(*relative.parts[2:]) / 'optimized' / source.name
    destination.parent.mkdir(exist_ok=True)
    with Image.open(source) as image:
        size = image.size
        loop = image.info.get('loop', 0)
        frames, durations = [], []
        for index in range(image.n_frames):
            image.seek(index)
            frames.append(image.convert('RGBA').copy())
            durations.append(image.info.get('duration', 40))
    frames[0].save(
        destination, format='WEBP', save_all=True, append_images=frames[1:],
        duration=durations, loop=loop, quality=84, method=4, minimize_size=False,
    )
    if name in ('idle', 'idle-1'):
        frames[0].save(destination.parent / 'poster.webp', quality=88, method=4)
    with Image.open(destination) as check:
        times = []
        for index in range(check.n_frames):
            check.seek(index)
            check.load()
            times.append(check.info.get('duration', 0))
        assert check.size == size and len(times) == len(frames)
        assert sum(times) == sum(durations)
    return {
        'source': str(source.relative_to(ROOT)),
        'before': source.stat().st_size,
        'after': destination.stat().st_size,
        'frames': len(frames), 'duration': sum(durations), 'size': size,
    }


if __name__ == '__main__':
    for event, folder, names in GROUPS:
        for name in names:
            print(json.dumps(export_animation(ROOT / event / folder, name)), flush=True)
