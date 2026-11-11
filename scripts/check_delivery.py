#!/usr/bin/env python3
"""
核對交付勾選表（DELIVERY_CHECKLIST.md）：已打勾（☑）的列，檔案必須真的存在且規格正確。
交付路徑以勾選表所在資料夾為基準。

  python3 scripts/check_delivery.py <勾選表路徑>          只檢查已打勾的列
  python3 scripts/check_delivery.py <勾選表路徑> --all    未打勾的列也檢查（看目前檔案離規格多遠）

例：python3 scripts/check_delivery.py event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md
    python3 scripts/check_delivery.py brand/moo-rabbit/DELIVERY_CHECKLIST.md

結果：OK＝符合；FAIL＝已打勾但不符（仍是佔位圖、尺寸／幀數錯、commit 裡沒有這個檔案…，exit code 1）；TODO＝未打勾；
MANUAL＝無法自動判斷，需人工審核（色票、音效長度）；SKIP＝尺寸欄標「暫緩」的列，不計入總數。
需要 Pillow（pip install pillow）。
"""
import hashlib
import os
import re
import signal
import subprocess
import sys

signal.signal(signal.SIGPIPE, signal.SIG_DFL)

_args = [a for a in sys.argv[1:] if not a.startswith('--')]
if not _args:
    sys.exit(__doc__)
CHECKLIST = os.path.abspath(_args[0])
ROOT = os.path.dirname(CHECKLIST)
# event/20261111_lucky_wheel mock 階段的佔位圖指紋（sha256 前 16 碼）：交付檔若仍是這些檔案，代表沒有真的換圖。
PLACEHOLDERS = {
    '002106becb5c85c6',
    '038411be37fb69ea',
    '03d5bb529d09a722',
    '0a1e1bfb307fd9ec',
    '1005b7fd8bf39614',
    '1e08321e5ea40c7c',
    '211783801ae49f4e',
    '2d7ead69e127a716',
    '333328ad874e3a80',
    '34391fdcb0f1fab2',
    '37530f3859fa83da',
    '3bb9d58c7a45af3b',
    '3c8c9da3a693f5ad',
    '40383b38e8cceedc',
    '4b83622f2cadaf2e',
    '4f3720775b8551e9',
    '548d2c23694120ea',
    '56dce8e96644b133',
    '62d58fd3dbcf2d8b',
    '63256e51da516722',
    '6b7d35f08466e86c',
    '6c9c6f97a62f9ee6',
    '724009691629147f',
    '75029fe59bf64095',
    '83da9a30a92b0548',
    '83fa5faf16da21a6',
    '897e6a0c48bb9c9f',
    '946c1941b3aa56c2',
    '965f6fe1710c6a71',
    '96720a5304292b89',
    '9abde38f737ca1da',
    '9c70379b403c9add',
    'a9706ba65ccb7975',
    'b7b6148d46b4fa1b',
    'c6137077de6e3dcb',
    'c819f950dcf962a2',
    'd30a56edc1c2999e',
    'd65f3986a98ebb04',
    'd78a64c124c45713',
    'e9d1f1a59fc718f9',
    'ed025b42ded13040',
    'f644e3678cf0184e',
    'fdf1fb27ec7749af',
}
ROW = re.compile(r'^\|\s*(☐|☑)\s*\|\s*([A-Z]\d{2})\s*\|([^|]*)\|([^|]*)\|\s*`([^`]+)`[^|]*\|([^|]*)\|')

try:
    from PIL import Image
except ImportError:
    sys.exit('需要 Pillow：pip install pillow')


def expand(path):
    m = re.search(r'\{([^}]+)\}', path)
    if not m:
        return [path]
    return [path[:m.start()] + ext + path[m.end():] for ext in m.group(1).split(',')]


def svg_size(p):
    head = open(p, encoding='utf-8', errors='ignore').read(2000)
    w = re.search(r'<svg[^>]*\bwidth="(\d+)', head)
    h = re.search(r'<svg[^>]*\bheight="(\d+)', head)
    return (int(w.group(1)), int(h.group(1))) if w and h else None


def image_size(p):
    if p.endswith('.svg'):
        return svg_size(p)
    with Image.open(p) as im:
        return im.size


def parse_spec(spec):
    m = re.search(r'(\d+)×(\d+)', spec)
    size = (int(m.group(1)), int(m.group(2))) if m else None
    n = re.search(r'(?:gif|frames)≥(\d+)', spec)
    return size, int(n.group(1)) if n else 0


def check_file(rel, spec):
    size, min_frames = parse_spec(spec)
    found = [c for c in expand(rel) if os.path.isfile(os.path.join(ROOT, c))]
    if not found:
        return False, '找不到檔案 ' + rel
    if len(found) > 1:
        return False, '同名檔案有多個副檔名，只能留一個：' + ', '.join(found)
    p = os.path.join(ROOT, found[0])
    if hashlib.sha256(open(p, 'rb').read()).hexdigest()[:16] in PLACEHOLDERS:
        return False, found[0] + ' 仍是 mock 佔位圖，尚未換成正式素材'
    if p.endswith(('.mp3', '.mp4')):
        return os.path.getsize(p) > 0, found[0] + '（長度／內容需人工確認）'
    got = image_size(p)
    if size and got != size:
        return False, '%s 尺寸 %s，應為 %dx%d' % (found[0], got and '%dx%d' % got, size[0], size[1])
    if p.endswith('.gif'):
        with Image.open(p) as im:
            frames = getattr(im, 'n_frames', 1)
            loop = im.info.get('loop')
        if frames < min_frames:
            return False, '%s 只有 %d 幀，至少 %d 幀' % (found[0], frames, min_frames)
        if loop != 0:
            return False, '%s 未設定無限循環（loop=0）' % found[0]
        return True, '%s %d 幀' % (found[0], frames)
    return True, found[0]


def check_dir(rel, spec):
    size, min_frames = parse_spec(spec)
    d = os.path.join(ROOT, rel)
    if not os.path.isdir(d):
        return False, '找不到資料夾 ' + rel
    pngs = sorted(f for f in os.listdir(d) if f.lower().endswith('.png'))
    if len(pngs) < min_frames:
        return False, '%s 只有 %d 張 PNG，至少 %d 張' % (rel, len(pngs), min_frames)
    bad = [f for f in pngs if image_size(os.path.join(d, f)) != size]
    if bad:
        return False, '%s 有 %d 張尺寸不是 %dx%d（例：%s）' % (rel, len(bad), size[0], size[1], bad[0])
    return True, '%s %d 張' % (rel, len(pngs))


def check_config():
    src = open(os.path.join(ROOT, 'assets/js/config.js'), encoding='utf-8').read()
    missing = [p for p in re.findall(r"'(assets/[^']+)'", src) if not os.path.isfile(os.path.join(ROOT, p))]
    if missing:
        return False, 'config.js 指向不存在的檔案：' + ', '.join(missing)
    return True, 'config.js 所有路徑都存在'


def git_ok(*args):
    return subprocess.run(['git', '-C', ROOT] + list(args),
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0


def commit_has(h, rel):
    """填的 commit 必須包含「現在這份」交付檔：路徑存在於該 commit，且內容與工作目錄完全相同。"""
    if not git_ok('cat-file', '-e', h + '^{commit}'):
        return 'commit %s 不存在於此 repo' % h
    if rel.endswith('/'):
        target = rel
    else:
        found = [c for c in expand(rel) if os.path.isfile(os.path.join(ROOT, c))]
        target = found[0] if found else rel
    listed = subprocess.run(['git', '-C', ROOT, 'ls-tree', '-r', '--name-only', h, '--', target],
                            capture_output=True, text=True).stdout.strip()
    if not listed:
        return 'commit %s 裡沒有 %s' % (h, target)
    if not git_ok('diff', '--quiet', h, '--', target):
        return '%s 在 commit %s 之後又改過或尚未 commit，請填最新的 commit' % (target, h)
    return None


def main():
    check_all = '--all' in sys.argv
    fails = 0
    rows = 0
    passed = 0
    out = []
    for line in open(CHECKLIST, encoding='utf-8'):
        m = ROW.match(line)
        if not m:
            continue
        rows += 1
        mark, rid, name, spec, rel, commit = [g.strip() for g in m.groups()]
        ticked = mark == '☑'
        if '暫緩' in spec:
            rows -= 1
            out.append('SKIP    %s  %s  — 暫緩，不計入' % (rid, name))
            continue
        if not ticked and not check_all:
            out.append('TODO    %s  %s' % (rid, name))
            continue
        if rel.endswith('.md') or '（人工）' in spec:
            exists = os.path.isfile(os.path.join(ROOT, rel))
            ok, msg = (None, '需人工審核') if exists else (False, '找不到檔案 ' + rel)
        elif rel == 'assets/css/event.css':
            ok, msg = None, '色票需人工審核'
        elif rel == 'assets/js/config.js':
            ok, msg = check_config()
        elif rel.endswith('/'):
            ok, msg = check_dir(rel, spec)
        else:
            ok, msg = check_file(rel, spec)
        if ticked and ok is not False:
            if not commit:
                ok, msg = False, '已打勾但 commit 欄是空的'
            else:
                err = commit_has(commit, rel)
                if err:
                    ok, msg = False, err
        status = 'MANUAL' if ok is None else ('OK' if ok else ('FAIL' if ticked else 'TODO'))
        if status == 'FAIL':
            fails += 1
        if ticked and status in ('OK', 'MANUAL'):
            passed += 1
        out.append('%-7s %s  %s  — %s' % (status, rid, name, msg))
    print('已提交且通過檢查：%d / %d 項；打勾但不符：%d 項\n' % (passed, rows, fails))
    print('\n'.join(out))
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
