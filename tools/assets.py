#!/usr/bin/env python3
"""Check registered art delivery, generate a catalog, or prepare a new art brief."""
import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
MANIFEST=ROOT/'ASSET_MANIFEST.json'
MEDIA={'.png','.jpg','.jpeg','.webp','.svg','.gif','.mp3','.wav','.ogg','.mp4','.webm','.mov','.glb','.gltf','.blend','.fbx','.psd','.ai','.woff','.woff2','.ttf','.otf','.eot'}
CATEGORIES={'images':'圖片','music':'背景音樂','sounds':'音效','effects':'視覺特效','3d':'3D 物件／貼圖','videos':'影片','fonts':'字型'}

def load():return json.loads(MANIFEST.read_text())
def actual_files():
    raw=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=ROOT)
    return {p for value in raw.split(b'\0') if value for p in [Path(value.decode()).as_posix()] if (ROOT/p).is_file() and Path(p).suffix.lower() in MEDIA}
def delegated(path,data):return any(path==d['root'] or path.startswith(d['root']+'/') for d in data.get('delegates',[]))
def dimensions(a):
    text=f"{a['width']}×{a['height']}" if a.get('width') else a.get('format','')
    if a.get('frames',1)>1:text+=f"；{a['frames']} 幀"
    if a.get('durationSeconds'):text+=f"；{a['durationSeconds']} 秒"
    return text+'；'+a.get('transparency','')

def check(data):
    errors=[];ids=set();paths=set()
    for a in data['assets']:
        path=a['path'];p=ROOT/path
        if a['id'] in ids:errors.append('重複編號：'+a['id'])
        ids.add(a['id'])
        if path in paths:errors.append('重複路徑：'+path)
        paths.add(path)
        if not a.get('purpose'):errors.append('缺用途：'+path)
        if a.get('status','delivered')!='delivered':errors.append('尚未交付：'+path)
        if a.get('category') not in CATEGORIES:errors.append('分類錯誤：'+path)
        if a.get('pathPolicy')=='contract':
            if not a.get('preserveReason'):errors.append('相容路徑未說明原因：'+path)
        elif not p.name.startswith(a.get('prefix',data['prefix'])+'_'+a['id']+'_'):
            errors.append('檔名前綴／編號不符：'+path)
        if not p.is_file():errors.append('缺檔：'+path);continue
        if hashlib.sha256(p.read_bytes()).hexdigest()!=a.get('sha256'):errors.append('指紋變更，請先核對規格：'+path)
    extras=actual_files()-paths
    extras={p for p in extras if not delegated(p,data)}
    errors.extend('未登錄素材：'+p for p in sorted(extras))
    for d in data.get('delegates',[]):
        if not (ROOT/d['manifest']).is_file():errors.append('子清單缺檔：'+d['manifest']);continue
        result=subprocess.run(d['check'],cwd=ROOT,capture_output=True,text=True)
        if result.returncode:errors.append('子清單檢查失敗：'+result.stdout+result.stderr)
    for item in data.get('procedural', []):
        if not (ROOT/item['path']).is_file():errors.append('程式生成來源缺檔：'+item['path'])
    if errors:print('\n'.join(errors));return 1
    print(f"PASS {data['repository']}: {len(paths)} 項素材；缺檔／未登錄／指紋／編號檢查通過；{len(data.get('delegates',[]))} 份子清單。")
    return 0

def catalog(data):
    text=[f"# {data['repository']} 素材清單",'', '依 [跨 repo 素材標準](ASSET_STANDARD.md) 製作。由 `python3 tools/assets.py catalog` 產生；登錄來源為根目錄 ASSET_MANIFEST.json。', '', '「相容路徑」保留既有公開或程式契約，並未改為新檔名；新加素材必須採前綴編號規格。原稿、設計證據和正式交付分開列管。', '']
    for c,title in CATEGORIES.items():
        text.extend([f'## {title}', '', '| 編號 | 用途／角色 | 檔案 | 規格 | 路徑政策／原因 |','|---|---|---|---|---|'])
        rows=[a for a in data['assets'] if a['category']==c]
        for a in rows:
            policy='標準前綴編號' if a['pathPolicy']=='standard' else '相容路徑：'+a['preserveReason']
            text.append(f"| {a['id']} | {a['purpose']}（{a['usage']}） | [{a['path']}](../{a['path']}) | {dimensions(a)} | {policy} |")
        if not rows:text.extend(['','目前沒有獨立檔案；不建立空素材。'])
        text.append('')
    if data.get('procedural'):
        text+=['## 程式生成素材／特效','','| 程式來源 | 用途 |','|---|---|']
        for a in data['procedural']:text.append(f"| [{a['path']}](../{a['path']}) | {a['purpose']} |")
    if data.get('delegates'):
        text+=['','## 獨立子清單','']
        for a in data['delegates']:text.append(f"- [{a['manifest']}](../{a['manifest']})：`{' '.join(a['check'])}`；該範圍不重複登錄。")
    if data.get('notes'):text+=['','## 專案說明','',*data['notes']]
    out=ROOT/'docs/ASSETS.md';out.parent.mkdir(exist_ok=True);out.write_text('\n'.join(text)+'\n');print('產生 '+str(out))

def brief(data,name,prefix):
    if not re.fullmatch('[a-z][a-z0-9_]*',name):raise SystemExit('名稱僅接受英文小寫、數字與底線')
    selected=[a for a in data['assets'] if a['usage']=='runtime' and (not prefix or a.get('prefix',data['prefix'])==prefix)]
    if prefix and not selected:raise SystemExit('找不到該前綴的正式素材，拒絕產生不完整範本')
    dest=ROOT/'docs/art'/f'{name}.md'
    if dest.exists():raise SystemExit('清單已存在，拒絕覆蓋')
    lines=[f'# {name} 素材製作清單','','狀態：待製作。先確立主題、語系、畫布與程式槽位；本工具不複製舊主題素材冒充新交付。', '', '| 提交 | 編號 | 分類／用途 | 規格／透明 | 新交付路徑 | 程式槽位／原稿 |','|---|---|---|---|---|---|']
    for a in selected:
        suffix=Path(a['path']).suffix
        lines.append(f"| ☐ | {a['id']} | {a['category']}／{a['purpose']} | {dimensions(a)} | `assets/{a['category']}/{name}_{a['id']}_{Path(a['path']).stem}{suffix}` | 待登錄 |")
    if not selected:
        for c,title in CATEGORIES.items():lines.append(f'| ☐ | 待編號 | {c}／{title} | 待定或明確註明不適用 | 待登錄 | 待登錄 |')
    lines+=['','交付前填清所有槽位、規格與授權；不適用的類別要明確標註，不建立假檔案。新素材加入 manifest 後先執行 check；圖片替換另驗手機／桌機與相關狀態。']
    dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text('\n'.join(lines)+'\n');print(dest)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('command',choices=['check','catalog','brief']);parser.add_argument('--name');parser.add_argument('--from-prefix');args=parser.parse_args();data=load()
    if args.command=='check':sys.exit(check(data))
    elif args.command=='catalog':catalog(data)
    elif not args.name:parser.error('brief 需要 --name')
    else:brief(data,args.name,args.from_prefix)
