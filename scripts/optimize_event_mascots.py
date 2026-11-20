"""Rebuild web delivery copies from the preserved event animation sources."""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'event'
MANIFEST = json.loads((ROOT / 'ASSET_MANIFEST.json').read_text())
GROUPS = []
for event, names in [('20261111_lucky_wheel', ['idle-1', 'spinning', 'result', 'lose']),
                     ('20261111_survival_spin', ['idle', 'anticipation', 'disappointment'])]:
    folder = next(g['path'] for g in MANIFEST['sources'] if g['event'] == event and g['path'].endswith('_mascot'))
    if event.endswith('survival_spin'):
        folder += '/rifle-v1'
    GROUPS.append((event, folder, names))


def export_animation(base, name):
    source = base / (name + '.webp')
    relative = base.relative_to(ROOT)
    event = relative.parts[0]
    delivery = next(a['path'] for a in MANIFEST['assets'] if a['event'] == event and a['category'] == 'images' and '/mascot/' in a['path'] and a['previousPath'].endswith('/' + source.name))
    destination = ROOT / event / delivery
    destination.parent.mkdir(parents=True, exist_ok=True)
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
