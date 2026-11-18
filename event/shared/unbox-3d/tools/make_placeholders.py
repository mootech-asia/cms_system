#!/usr/bin/env python3
"""
產生拆卡包／拆盲盒的 mock 佔位圖（SVG）與分享預覽 PNG。只在建立新活動或新皮的 mock 時用；
正式素材交付後不要再跑（會覆蓋同名檔）。產生後把指紋加進 scripts/check_delivery.py 的 PLACEHOLDERS。

  python3 event/shared/unbox-3d/tools/make_placeholders.py event/20261118_card_pack card-pack
  python3 event/shared/unbox-3d/tools/make_placeholders.py event/20261118_blind_box blind-box
"""
import hashlib
import os
import sys

from PIL import Image, ImageDraw, ImageFont

INK = '#27364a'
MUTED = '#8490a2'
LAV = '#a5b8ff'
LILAC = '#c9a5ef'
MINT = '#8ed6c5'
PEACH = '#f2c18f'
PEARL = '#f6f7fd'
NAVY = '#29394f'
VIOLET = '#7765bb'
GOLD = '#e0a23a'
RARITY = {'common': '#8490a2', 'rare': '#4f8fd8', 'epic': '#8d5fd3', 'legendary': '#e0a23a'}

TITLES = {
    'card-pack': {'en': 'CARD PACK', 'ko': '카드팩 오픈', 'th': 'เปิดซองการ์ด', 'zh': '拆卡包'},
    'blind-box': {'en': 'BLIND BOX', 'ko': '랜덤박스', 'th': 'กล่องสุ่ม', 'zh': '拆盲盒'},
}


def svg(w, h, body, defs=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'<defs>{defs}</defs>{body}</svg>\n')


def grad(id_, stops, x2='0', y2='1'):
    s = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" x1="0" y1="0" x2="{x2}" y2="{y2}">{s}</linearGradient>'


def stage_bg():
    lines = ''.join(f'<line x1="375" y1="520" x2="{x}" y2="1000" stroke="#c9cfe6" stroke-width="2"/>' for x in range(-525, 1300, 150))
    rows = ''.join(f'<line x1="0" y1="{y}" x2="750" y2="{y}" stroke="#c9cfe6" stroke-width="2"/>' for y in (560, 620, 700, 810, 960))
    defs = grad('wall', [(0, '#fbfbff'), (1, '#e3e6f6')]) + grad('floor', [(0, '#dfe3f3'), (1, '#c4cbe4')]) + \
        '<radialGradient id="pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>'
    body = ('<rect width="750" height="520" fill="url(#wall)"/>'
            '<path d="M0 0 L120 70 L120 520 L0 560Z" fill="#e6e8f6"/><path d="M750 0 L630 70 L630 520 L750 560Z" fill="#e6e8f6"/>'
            '<rect y="520" width="750" height="480" fill="url(#floor)"/>' + lines + rows +
            '<line x1="0" y1="520" x2="750" y2="520" stroke="#b9c0dc" stroke-width="3"/>'
            '<ellipse cx="375" cy="700" rx="330" ry="110" fill="url(#pool)"/>')
    return svg(750, 1000, body, defs)


def info_bg():
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="3" fill="#dfe3f2"/>' for x in range(25, 750, 75) for y in range(25, 750, 75))
    return svg(750, 750, f'<rect width="750" height="750" fill="#eef1f8"/>{dots}')


def title(text, w=690, h=240):
    defs = grad('t', [(0, NAVY), (1, VIOLET)], x2='1', y2='0')
    size = 92 if len(text) <= 9 else 70
    body = (f'<text x="{w/2}" y="{h/2 + size*0.34 + 4}" text-anchor="middle" font-family="Arial Black, Arial, Noto Sans KR, Noto Sans Thai, Noto Sans TC, sans-serif" '
            f'font-weight="900" font-size="{size}" fill="#ffffff" stroke="#ffffff" stroke-width="14" stroke-linejoin="round">{text}</text>'
            f'<text x="{w/2}" y="{h/2 + size*0.34 + 4}" text-anchor="middle" font-family="Arial Black, Arial, Noto Sans KR, Noto Sans Thai, Noto Sans TC, sans-serif" '
            f'font-weight="900" font-size="{size}" fill="url(#t)">{text}</text>'
            f'<path d="M110 40 l10 22 l22 10 l-22 10 l-10 22 l-10 -22 l-22 -10 l22 -10z" fill="{LILAC}"/>'
            f'<path d="M585 160 l7 15 l15 7 l-15 7 l-7 15 l-7 -15 l-15 -7 l15 -7z" fill="{MINT}"/>')
    return svg(w, h, body, defs)


def pill(w, h, fill, stroke):
    r = h / 2
    return svg(w, h, f'<rect x="2" y="2" width="{w-4}" height="{h-4}" rx="{r-2}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')


def btn_primary():
    defs = grad('b', [(0, '#41567a'), (1, NAVY)])
    return svg(400, 110, '<rect x="4" y="6" width="392" height="100" rx="50" fill="#1b2638"/>'
               '<rect x="4" y="2" width="392" height="96" rx="48" fill="url(#b)"/>'
               '<rect x="24" y="10" width="352" height="30" rx="15" fill="#ffffff" opacity="0.14"/>', defs)


def btn_arrow():
    return svg(96, 96, '<circle cx="48" cy="48" r="44" fill="#ffffff" stroke="#d3d9e8" stroke-width="3"/>'
               f'<path d="M40 30 L58 48 L40 66" fill="none" stroke="{NAVY}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>')


def ticker_bar():
    return svg(690, 64, f'<rect x="1" y="1" width="688" height="62" rx="31" fill="{NAVY}" opacity="0.88"/>'
               f'<rect x="1" y="1" width="150" height="62" rx="31" fill="{VIOLET}"/>')


def card_frame():
    return svg(120, 120, '<rect x="3" y="3" width="114" height="114" rx="22" fill="#ffffff" stroke="#d3d9e8" stroke-width="4"/>'
               f'<rect x="12" y="12" width="96" height="96" rx="14" fill="none" stroke="{LILAC}" stroke-width="2" stroke-dasharray="6 6"/>')


def card_title():
    defs = grad('c', [(0, VIOLET), (1, NAVY)], x2='1', y2='0')
    return svg(400, 72, '<path d="M20 6 H380 L396 36 L380 66 H20 L4 36Z" fill="url(#c)"/>', defs)


def footer_deco():
    sparks = ''.join(f'<path d="M{x} {y} l6 13 l13 6 l-13 6 l-6 13 l-6 -13 l-13 -6 l13 -6z" fill="{c}" opacity="0.8"/>'
                     for x, y, c in [(80, 60, LILAC), (210, 100, MINT), (375, 50, LAV), (540, 100, PEACH), (670, 60, LILAC)])
    return svg(750, 160, f'<path d="M0 160 Q375 40 750 160Z" fill="#dfe3f2"/>{sparks}')


def icon(kind):
    base = f'<circle cx="32" cy="32" r="30" fill="#ffffff" stroke="#d3d9e8" stroke-width="2"/>'
    if kind == 'sound-on':
        g = f'<path d="M18 27h7l9-8v26l-9-8h-7z" fill="{NAVY}"/><path d="M39 25q6 7 0 14M43 20q11 12 0 24" fill="none" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/>'
    elif kind == 'sound-off':
        g = f'<path d="M18 27h7l9-8v26l-9-8h-7z" fill="{MUTED}"/><path d="M40 26l10 12M50 26l-10 12" stroke="{MUTED}" stroke-width="3" stroke-linecap="round"/>'
    else:
        g = (f'<circle cx="22" cy="32" r="5" fill="{NAVY}"/><circle cx="42" cy="21" r="5" fill="{NAVY}"/><circle cx="42" cy="43" r="5" fill="{NAVY}"/>'
             f'<path d="M22 32L42 21M22 32L42 43" stroke="{NAVY}" stroke-width="3"/>')
    return svg(64, 64, base + g)


def icon_rotate():
    return svg(160, 160, '<rect x="52" y="20" width="56" height="100" rx="10" fill="none" stroke="#ffffff" stroke-width="7"/>'
               '<circle cx="80" cy="108" r="4" fill="#ffffff"/><path d="M30 120 a55 55 0 0 0 60 30" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>'
               '<path d="M84 140 l8 10 l-12 4" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>')


def rays():
    rs = ''.join(f'<path d="M375 375 L{375 + 520 * __import__("math").cos(a):.1f} {375 + 520 * __import__("math").sin(a):.1f} '
                 f'L{375 + 520 * __import__("math").cos(a + 0.12):.1f} {375 + 520 * __import__("math").sin(a + 0.12):.1f}Z" fill="#ffffff"/>'
                 for a in [i * 0.3927 for i in range(16)])
    defs = '<radialGradient id="f" cx="0.5" cy="0.5" r="0.5"><stop offset="0.2" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="m"><rect width="750" height="750" fill="url(#f)"/></mask>'
    return svg(750, 750, f'<g mask="url(#m)" opacity="0.6">{rs}</g>', defs)


def reward_back():
    defs = grad('rb', [(0, '#41567a'), (1, NAVY)])
    rings = ''.join(f'<ellipse cx="300" cy="450" rx="{60 + i*28}" ry="{110 + i*22}" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="3"/>' for i in range(7))
    return svg(600, 900, f'<rect width="600" height="900" rx="40" fill="url(#rb)"/>{rings}'
               f'<rect x="24" y="24" width="552" height="852" rx="28" fill="none" stroke="{LILAC}" stroke-width="6"/>'
               f'<path d="M300 380 l22 48 l48 22 l-48 22 l-22 48 l-22 -48 l-48 -22 l48 -22z" fill="#ffffff"/>', defs)


def reward_frame(color):
    return svg(600, 900, f'<rect x="9" y="9" width="582" height="882" rx="36" fill="none" stroke="{color}" stroke-width="18"/>'
               f'<rect x="30" y="30" width="540" height="840" rx="24" fill="none" stroke="{color}" stroke-opacity="0.45" stroke-width="4"/>'
               f'<path d="M300 30 l18 30 l-18 30 l-18 -30z" fill="{color}"/>')


def pack_front(a, b, mark):
    defs = grad('p', [(0, a), (0.5, '#edf5ff'), (1, b)], x2='1', y2='1')
    rings = ''.join(f'<ellipse cx="260" cy="380" rx="{80 + j*24}" ry="{180 + j*12}" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2" transform="rotate(34 260 380)"/>' for j in range(8))
    return svg(512, 768, f'<rect width="512" height="768" fill="url(#p)"/>{rings}'
               f'<text x="256" y="430" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="120" fill="{INK}">{mark}</text>'
               f'<rect x="36" y="560" width="200" height="14" rx="7" fill="{INK}" opacity="0.75"/>'
               f'<rect x="36" y="590" width="130" height="10" rx="5" fill="{INK}" opacity="0.45"/>', defs)


def pack_back():
    lines = ''.join(f'<rect x="60" y="{y}" width="{w}" height="10" rx="5" fill="{INK}" opacity="0.3"/>' for y, w in [(560, 392), (590, 330), (620, 360), (650, 250)])
    return svg(512, 768, f'<rect width="512" height="768" fill="#e9ecf8"/><rect x="60" y="120" width="392" height="380" rx="24" fill="#ffffff" opacity="0.7"/>{lines}')


def pack_crimp():
    teeth = ''.join(f'<rect x="{x}" y="0" width="3" height="64" fill="#ffffff" opacity="0.55"/>' for x in range(0, 512, 9))
    return svg(512, 64, f'<rect width="512" height="64" fill="#cfd5ec"/>{teeth}')


def box_front():
    defs = grad('bf', [(0, LAV), (0.55, '#edf5ff'), (1, LILAC)], x2='1', y2='1')
    return svg(512, 512, f'<rect width="512" height="512" fill="url(#bf)"/>'
               f'<rect x="28" y="28" width="456" height="456" rx="20" fill="none" stroke="#ffffff" stroke-width="6"/>'
               f'<text x="256" y="320" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="200" fill="{INK}">?</text>', defs)


def box_side():
    dots = ''.join(f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="{INK}" opacity="0.18">?</text>' for x in range(64, 512, 128) for y in range(90, 512, 128))
    return svg(512, 512, f'<rect width="512" height="512" fill="#f3f4fb"/>{dots}')


def box_lid():
    return svg(512, 512, f'<rect width="512" height="512" fill="#f3f4fb"/><rect x="40" y="40" width="432" height="432" rx="24" fill="none" stroke="{VIOLET}" stroke-opacity="0.5" stroke-width="6"/>'
               f'<path d="M256 196 l20 44 l44 20 l-44 20 l-20 44 l-20 -44 l-44 -20 l44 -20z" fill="{VIOLET}" opacity="0.6"/>')


def box_lid_side():
    return svg(512, 80, f'<rect width="512" height="80" fill="#f3f4fb"/><rect y="56" width="512" height="8" fill="{VIOLET}" opacity="0.4"/>')


def share_preview(path, kind):
    w, h = 1200, 630
    im = Image.new('RGB', (w, h), '#eef1f8')
    d = ImageDraw.Draw(im)
    for i in range(h):
        t = i / h
        d.line([(0, i), (w, i)], fill=(int(246 - 30 * t), int(247 - 30 * t), int(253 - 10 * t)))
    def font(size):
        for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
            if os.path.exists(f):
                return ImageFont.truetype(f, size)
        return ImageFont.load_default()
    text = TITLES[kind]['en']
    d.text((80, 220), text, fill=NAVY, font=font(110))
    d.text((84, 360), 'Open now and reveal your prize', fill=MUTED, font=font(40))
    cols = [LAV, LILAC, MINT]
    for k, c in enumerate(cols):
        x = 820 + k * 90
        if kind == 'card-pack':
            d.rounded_rectangle([x, 150 + k * 20, x + 200, 450 + k * 20], 16, fill=c, outline='#ffffff', width=6)
        else:
            d.rectangle([x, 230 + k * 20, x + 200, 430 + k * 20], fill=c, outline='#ffffff', width=6)
    im.save(path, 'PNG', optimize=True)


# 素材分類（與 DESIGN_TASKS.md「素材分類規則」一致）：assets/img/<分類>/<檔名>
CATEGORY = {
    'scene': ('stage-bg', 'info-bg', 'footer-deco'),
    'title': ('title-',),
    '3d': ('pack-', 'box-'),
    'reveal': ('reveal-', 'reward-'),
    'ui': ('btn-', 'period-badge', 'chances-badge', 'ticker-bar', 'card-frame', 'card-title'),
    'icon': ('icon-',),
}


def category(name):
    for cat, prefixes in CATEGORY.items():
        if name.startswith(prefixes):
            return cat
    raise SystemExit('未分類的素材：' + name)


def main():
    if len(sys.argv) != 3 or sys.argv[2] not in TITLES:
        sys.exit(__doc__)
    root, kind = sys.argv[1], sys.argv[2]
    out = os.path.join(root, 'assets', 'img')
    os.makedirs(out, exist_ok=True)
    files = {
        'stage-bg.svg': stage_bg(), 'info-bg.svg': info_bg(),
        'period-badge.svg': pill(480, 64, '#ffffff', '#d3d9e8'), 'chances-badge.svg': pill(360, 88, '#ffffff', LILAC),
        'btn-primary.svg': btn_primary(), 'btn-arrow.svg': btn_arrow(), 'ticker-bar.svg': ticker_bar(),
        'card-frame.svg': card_frame(), 'card-title.svg': card_title(), 'footer-deco.svg': footer_deco(),
        'icon-sound-on.svg': icon('sound-on'), 'icon-sound-off.svg': icon('sound-off'), 'icon-share.svg': icon('share'),
        'icon-rotate.svg': icon_rotate(), 'reveal-rays.svg': rays(), 'reward-back.svg': reward_back(),
    }
    for r, c in RARITY.items():
        files[f'reward-frame-{r}.svg'] = reward_frame(c)
    for loc, text in TITLES[kind].items():
        files[f'title-{loc}.svg'] = title(text)
    if kind == 'card-pack':
        files['pack-front-1.svg'] = pack_front(LAV, LILAC, '✧')
        files['pack-front-2.svg'] = pack_front(MINT, LAV, '❖')
        files['pack-front-3.svg'] = pack_front(PEACH, LILAC, '☾')
        files['pack-back.svg'] = pack_back()
        files['pack-crimp.svg'] = pack_crimp()
    else:
        files['box-front.svg'] = box_front()
        files['box-side.svg'] = box_side()
        files['box-lid.svg'] = box_lid()
        files['box-lid-side.svg'] = box_lid_side()
    files = {f'{category(n)}/{n}': d for n, d in files.items()}
    files['share/share-preview.png'] = None
    for name, data in files.items():
        os.makedirs(os.path.join(out, os.path.dirname(name)), exist_ok=True)
        if data is None:
            share_preview(os.path.join(out, name), kind)
            continue
        with open(os.path.join(out, name), 'w', encoding='utf-8') as f:
            f.write(data)
    for name in sorted(files):
        digest = hashlib.sha256(open(os.path.join(out, name), 'rb').read()).hexdigest()[:16]
        print(f"    '{digest}',  # {os.path.basename(root)}/{name}")


if __name__ == '__main__':
    main()
