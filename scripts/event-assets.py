#!/usr/bin/env python3
"""Generate art briefs, validate delivery slots, or scaffold a themed event."""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'event/ASSET_MANIFEST.json'
CATEGORIES = {'images': '圖片', 'music': '背景音樂', 'sounds': '音效', 'effects': '視覺特效', '3d': '3D 物件與貼圖'}
MEDIA = {'.webp', '.png', '.svg', '.jpg', '.jpeg', '.gif', '.mp3', '.wav', '.ogg', '.mp4', '.mov', '.glb', '.gltf', '.fbx', '.blend'}

def load():
    return json.loads(MANIFEST.read_text())

def describe(a):
    size = f"{a['width']}×{a['height']}" if 'width' in a else ''
    if a.get('frames', 1) > 1:
        size += f"；{a['frames']} 幀／{a.get('durationMs', '?')}ms 無縫循環"
    if 'durationSeconds' in a:
        size += f"{a['durationSeconds']} 秒"
    return size or '依原交付規格'

def configs():
    # Collect explicit configuration slots without running application side effects.
    code = """const fs=require('fs'),vm=require('vm'); const out={};for(const n of fs.readdirSync('event').filter(n=>/^\\d{8}_/.test(n))){let c={window:{}};vm.runInNewContext(fs.readFileSync('event/'+n+'/assets/js/config.js','utf8'),c);out[n]=[];function walk(v,k){if(typeof v==='string'&&/\\.(webp|png|svg|jpg|jpeg|gif|mp3|wav|ogg|mp4|glb|gltf)([?#]|$)/.test(v))out[n].push({slot:k,value:v});else if(v&&typeof v==='object')for(const [a,b] of Object.entries(v))walk(b,k?k+'.'+a:a)}walk(c.window.EVENT_CONFIG,'')}console.log(JSON.stringify(out))"""
    return json.loads(subprocess.check_output(['node', '-e', code], cwd=ROOT, text=True))

def slots_for(data):
    lookup = {}
    for event, refs in configs().items():
        base = ROOT / 'event' / event
        for ref in refs:
            value = ref['value'].split('?')[0].split('#')[0]
            if value.startswith('https://mootech-asia.github.io/cms_system/'):
                path = ROOT / value.split('/cms_system/', 1)[1]
            elif '://' in value:
                continue
            else:
                path = (base / value).resolve()
            lookup.setdefault(str(path), []).append(event + ':' + ref['slot'])
    return lookup

def render(data):
    slots = slots_for(data)
    events = sorted({a['event'] for a in data['assets']})
    for event in events:
        root = ROOT / 'event' / event
        rows = [a for a in data['assets'] if a['event'] == event]
        lines = [f'# {event} 素材製作與用途清單', '', '> 本表由 `python3 scripts/event-assets.py catalog` 產生；資料來源為 `event/ASSET_MANIFEST.json`。編號固定，新增素材接續編號，不重排既有編號。', '', '檔名規則：`活動名稱_類別編號_用途描述.副檔名`。表內尺寸是目前實際交付尺寸；未標示可變更前請維持比例、透明區與錨點。按鈕、日期、次數、獎品文字保留程式疊字，活動主標分 en／ko／th 製作。', '', '## 正式交付素材', '']
        for c, title in CATEGORIES.items():
            lines.extend([f'### {title} — `assets/{c}/`', '', '| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |', '|---|---|---|---|---|---|'])
            subset = [a for a in rows if a['category'] == c]
            for a in subset:
                refs = slots.get(str(root / a['path']), [])
                refs = [v.removeprefix(event + ':') for v in refs]
                a['slots'] = refs
                fmt = a.get('transparency', '音訊依音量配置；不得削波') + ' · ' + Path(a['path']).suffix[1:]
                lines.append(f"| {a['id']} | [{Path(a['path']).name}](../{a['path']}) | {a['purpose']} | {describe(a)} | {fmt} | {'、'.join('`'+v+'`' for v in refs) or '共用 CSS／社群 metadata 引用'} |")
            if not subset:
                note = '目前採程式合成／未配置背景曲；不建立假的音檔。' if c in {'music','sounds'} else '此活動目前未使用此類素材；新主題有需要時新增正式槽位。'
                lines.extend(['', note])
            lines.append('')
            # A small useful task sheet makes all five category folders discoverable, even when not applicable.
            folder = root / 'assets' / c
            folder.mkdir(parents=True, exist_ok=True)
            brief = f'# {event} · {title}\n\n完整編號、用途、尺寸與程式引用見 [素材製作清單](../../docs/ASSETS.md)。\n\n'
            brief += '\n'.join(f"- `{a['id']}` — `{Path(a['path']).name}`：{a['purpose']}；{describe(a)}。" for a in subset) + '\n'
            if not subset:
                brief += '目前不適用；不放佔位圖、靜音音檔或空模型。新增需求先登記 ASSET_MANIFEST.json，再製作交付檔。\n'
            if c == '3d':
                brief += '\n卡包／寶箱使用 `event/shared/unbox-3d/js/scene.js` 即時生成幾何，現行無 GLB／FBX 模型檔。`textures/` 是包裝各面貼圖；更換同型主題只換貼圖。若改模型輪廓、UV 或骨架，需同步修改程式並驗證，不屬於單純換圖。模型原始檔歸 `source/3d/`，網頁交付模型歸本目錄 `models/`（有實檔才建子目錄）。\n' if event in {'20261118_card_pack','20261118_blind_box'} else ''
            (folder / 'README.md').write_text(brief)
            source_folder = root / 'source' / c
            source_folder.mkdir(parents=True, exist_ok=True)
            source_brief = f'# {event} · {title}原稿\n\n正式交付規格見 [素材清單](../../docs/ASSETS.md)。本目錄放可編輯來源、母帶、授權與關聯序列幀；網頁不可直接引用原稿。\n\n'
            packages = [g for g in data['sources'] if g['event'] == event and g['category'] == c]
            source_brief += '\n'.join(f"- `{g['path'].split('/')[-1]}`：{g['purpose']}。" for g in packages) + '\n'
            if not packages:
                source_brief += '目前沒有此類原稿包；需要新增時先登記用途與交付槽位，不放佔位檔。\n'
            (source_folder / 'README.md').write_text(source_brief)
        lines += ['## 程式生成的動態／3D 物件', '', '以下不是遺漏的模型或影片檔；圖檔控制視覺材質，程式控制幾何與動態。換造型、UV 或骨架時需工程配合。', '', '| 編號 | 程式來源 | 用途 |', '|---|---|---|']
        for item in data.get('procedural', []):
            if item['event'] == event:
                lines.append(f"| {item['id']} | [{item['path']}](../{item['path']}) | {item['purpose']} |")
        lines.append('')
        lines += ['## 製作原稿', '', '原稿與正式交付分離；序列幀／分層檔內部名稱保留，外層套用活動前綴與來源編號，避免破壞關鍵幀對應。字型授權與角色設定說明隨原稿保留。', '', '| 分類 | 原稿包 | 用途 | 檔案數 |', '|---|---|---|---|']
        for g in data['sources']:
            if g['event'] == event:
                lines.append(f"| {CATEGORIES[g['category']]} | [{g['path']}](../{g['path']}) | {g['purpose']} | {g['files']} |")
        lines += ['', '## 製作／替換驗收', '', '1. 依本表逐項製作，三語主標不可漏交；同槽位換圖保持檔名、尺寸、透明與定位。', '2. 可編輯原稿放 `source/<分類>/`；網頁檔放 `assets/<分類>/`，不可把原稿加入首屏。', '3. 圖片維持透明邊緣與主題材質；動畫維持畫布、循環時間、腳底基準與安全邊界；音樂可循環、音效依事件觸發。', '4. 共用按鈕與借用的獎項圖示／音效見下表，不複製成另一份。新主題可改 config 槽位為自己的素材。', '5. 執行 `python3 scripts/event-assets.py check`、交付檢查及實際手機／桌機流程驗證；更新 JS／CSS 版本碼後發布。', '', '## 跨活動／共用引用', '', '| 槽位 | 所屬素材 |', '|---|---|']
        for eventname, refs in configs().items():
            if eventname == event:
                for ref in refs:
                    if ref['value'].startswith('../'):
                        lines.append(f"| `{ref['slot']}` | `{ref['value'].split('?')[0]}` |")
        docs = root / 'docs';docs.mkdir(exist_ok=True)
        (docs / 'ASSETS.md').write_text('\n'.join(lines)+'\n')
    MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    print(f'產生 {len(events)} 份素材清單與五類製作說明。')

def check(data):
    errors=[];paths=set();ids=set()
    slots=slots_for(data)
    for a in data['assets']:
        root=ROOT/'event'/a['event'];p=root/a['path'];paths.add(p)
        key=(a['event'],a['id'])
        if key in ids:errors.append(f'重複編號：{key}')
        ids.add(key)
        prefix='shared' if a['event']=='shared' else a['event'][9:]
        if not p.name.startswith(prefix+'_'+a['id']+'_'):errors.append(f'命名不符：{p}')
        if a.get('status', '已交付') != '已交付':errors.append(f'尚未確認交付狀態：{p}')
        if not a.get('purpose'):errors.append(f'缺用途：{p}')
        if not p.is_file():errors.append(f'缺少交付檔：{p}');continue
        if a.get('sha256') and hashlib.sha256(p.read_bytes()).hexdigest()!=a['sha256']:errors.append(f'素材已變更，請更新規格與指紋：{p}')
        if a.get('width') and p.suffix!='.svg':
            from PIL import Image
            with Image.open(p) as im:
                if (im.width,im.height)!=(a['width'],a['height']):errors.append(f'尺寸不符：{p}')
                if getattr(im, 'n_frames', 1) != a.get('frames', 1):errors.append(f'動畫幀數不符：{p}')
                if a.get('transparency') == '保留 alpha' and 'A' not in im.getbands():errors.append(f'缺少透明通道：{p}')
        if str(p) not in slots and a['event']!='shared':
            # Metadata references (social image) are the only non-config runtime media.
            if p.name not in (root/'index.html').read_text():errors.append(f'無程式引用的素材：{p}')
    for event,refs in configs().items():
        root=ROOT/'event'/event
        for ref in refs:
            value=ref['value'].split('?')[0].split('#')[0]
            if '://' not in value and not (root/value).resolve().is_file():errors.append(f'槽位缺檔：{event} {ref}')
    for event in {a['event'] for a in data['assets']}:
        root=ROOT/'event'/event
        if not (root/'docs/ASSETS.md').is_file():errors.append(f'缺少素材清單：{event}')
        for c in CATEGORIES:
            if not (root/'assets'/c/'README.md').is_file():errors.append(f'缺少分類製作說明：{event}/{c}')
        for p in (root/'assets').rglob('*'):
            if p.is_file() and p.suffix in MEDIA and p not in paths:errors.append(f'未列入素材表的檔案：{p}')
        if (root/'alternatives').exists():errors.append(f'不應保留淘汰素材目錄：{event}')
    for item in data.get('procedural', []):
        if not (ROOT/'event'/item['event']/item['path']).is_file():errors.append(f'程式來源缺少：{item}')
    for g in data['sources']:
        package=ROOT/'event'/g['event']/g['path']
        if not package.exists():errors.append(f'原稿包缺少：{g}')
        else:
            count=1 if package.is_file() else sum(p.is_file() for p in package.rglob('*'))
            if count != g['files']:errors.append(f'原稿包檔案數變更，請核對缺幀／來源：{package} {count}/{g["files"]}')
    for p in (ROOT/'event').rglob('*'):
        if p.name in {'__pycache__','.DS_Store','Thumbs.db'} or p.suffix=='.pyc':errors.append(f'快取／系統廢檔：{p}')
    if errors:
        print('\n'.join(errors));return 1
    print(f"PASS：{len(data['assets'])} 項素材編號、用途、規格、指紋、引用；{len(data['sources'])} 組原稿；五類結構與無額外素材。")
    return 0

def init(data, source, name, destination=None):
    if not re.fullmatch(r'\d{8}_[a-z][a-z0-9_]*',name):raise SystemExit('名稱必須是 YYYYMMDD_event_name')
    source_root=ROOT/'event'/source
    if not source_root.is_dir() or not any(a['event']==source for a in data['assets']):raise SystemExit('請指定現有活動為 --from，完整繼承對應玩法的素材槽位')
    dest=Path(destination) if destination else ROOT/'event'/name
    if dest.exists():raise SystemExit('目的資料夾已存在，拒絕覆蓋')
    dest.mkdir(parents=True)
    shutil.copytree(source_root/'assets/js',dest/'assets/js')
    shutil.copytree(source_root/'assets/css',dest/'assets/css')
    shutil.copy2(source_root/'index.html',dest/'index.html')
    cloned=[];replacements={source:name,source[9:]:name[9:]}
    for a in data['assets']:
        if a['event']!=source:continue
        item=dict(a);item['event']=name
        item['path']=a['path'].replace(source[9:]+'_',name[9:]+'_')
        item.pop('sha256',None);item.pop('bytes',None);item.pop('previousPath',None)
        item['status']='待製作';cloned.append(item)
        replacements[a['path']]=item['path']
    for p in dest.rglob('*'):
        if p.is_file():
            text=p.read_text()
            for a,b in sorted(replacements.items(),key=lambda x:-len(x[0])):text=text.replace(a,b)
            p.write_text(text)
    docs=dest/'docs';docs.mkdir()
    lines=[f'# {name} 美術製作清單', '', f'玩法來源：{source}。以下正式檔案尚未製作，不複製舊主題圖片冒充交付。', '', '| 提交 | 編號 | 交付路徑 | 用途 | 規格 |', '|---|---|---|---|---|']
    for a in cloned:
        lines.append(f"| ☐ | {a['id']} | `{a['path']}` | {a['purpose']} | {describe(a)}；{a.get('transparency','音訊')} |")
    code_items=[]
    lines += ['', '## 程式生成特效／3D', '', '| 編號 | 程式 | 用途 |', '|---|---|---|']
    for item in data.get('procedural', []):
        if item['event'] == source:
            clone=dict(item);clone['event']=name;code_items.append(clone)
            lines.append(f"| {clone['id']} | `{clone['path']}` | {clone['purpose']} |")
    (docs/'ASSETS.md').write_text('\n'.join(lines)+'\n')
    for c,title in CATEGORIES.items():
        (dest/'assets'/c).mkdir(exist_ok=True)
        (dest/'assets'/c/'README.md').write_text(f'# {title}\n\n依 ../../docs/ASSETS.md 的槽位逐項製作，保持尺寸、錨點與透明區。\n')
        (dest/'source'/c).mkdir(parents=True,exist_ok=True)
        (dest/'source'/c/'README.md').write_text(f'# {title}製作來源\n\n放可編輯原稿與授權；正式交付檔放 assets/{c}/。\n')
    (dest/'README.md').write_text(f'# {name}\n\n尚在製作，入口會缺素材，請先依 docs/ASSETS.md 交付。玩法沿用 {source}，主題色票位於 assets/css/；動態文案由 config 設定。完成後執行素材檢查與四狀態流程驗證。\n')
    if not destination:
        data['assets'].extend(cloned)
        data.setdefault('procedural', []).extend(code_items)
        MANIFEST.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(f'建立 {dest}，{len(cloned)} 個待製作素材槽位；沒有建立假素材。')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command',choices=['catalog','check','init'])
    parser.add_argument('--from',dest='source')
    parser.add_argument('--name')
    parser.add_argument('--destination',help=argparse.SUPPRESS)
    args=parser.parse_args();data=load()
    if args.command=='catalog':render(data)
    elif args.command=='check':sys.exit(check(data))
    else:
        if not args.source or not args.name:parser.error('init 需要 --from 與 --name')
        init(data,args.source,args.name,args.destination)
