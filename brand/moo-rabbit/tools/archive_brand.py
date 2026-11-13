"""Sync delivery assets into the website brand archive and verify its ZIP."""
from pathlib import Path
import shutil,json,zipfile,hashlib,subprocess
src=Path(__file__).resolve().parents[1]; dst=Path('/workspace/mootech_website/brand/moo-rabbit')
shutil.copy2(src/'01_character/personality.md',dst/'01_character/personality.md')
files=[]
for p in sorted(src.rglob('*')):
 rel=p.relative_to(src)
 if p.is_file() and rel.parts[0] not in {'source','tools'} and p.suffix.lower() in {'.png','.webp','.jpg','.gif'}:
  out=dst/rel;out.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,out)
  commit=subprocess.check_output(['git','log','-1','--format=%h','--',str(p)],cwd=src,text=True).strip()
  files.append({'path':str(rel),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source_commit':commit})
for folder,title in [('02_poses','全身姿勢'),('03_stickers','半身貼圖'),('04_key-visual','事業部主視覺'),('05_support','客服形象'),('06_social','社群分享')]:
 items=[f for f in files if f['path'].startswith(folder+'/')];p=dst/folder;p.mkdir(exist_ok=True)
 (p/'README.md').write_text('# '+title+'\n\n'+('\n'.join('- ['+Path(f['path']).name+']('+Path(f['path']).name+')' for f in items) if items else '尚未製作。')+'\n\n已歸檔素材仍待人工審核。\n')
rows=[]
for folder,title in [('01_character','設定圖與四視圖'),('02_poses','全身姿勢'),('03_stickers','半身貼圖'),('04_key-visual','事業部主視覺'),('05_support','客服形象'),('06_social','社群分享')]:
 count=sum(f['path'].startswith(folder+'/') for f in files);rows.append('| ['+folder+']('+folder+'/) | '+title+' | '+str(count)+' 張／段 |')
for f in files:
 if '/' not in f['path']:rows.append('| ['+f['path']+']('+f['path']+') | 代表素材 | 已歸檔 |')
(dst/'README.md').write_text('# Moo Rabbit（兔比）｜CMS 事業部吉祥物\n\n[最新性格與表演方向](01_character/personality.md)：智慧型官方客服，聰明、機靈、帶點狡黠幽默；既有素材保留。\n\n目前 '+str(len(files))+'／36 項素材已歸檔，待人工審核；15 秒影片不列製作範圍。\n\n| 分類 | 內容 | 已歸檔 |\n|---|---|---|\n'+'\n'.join(rows)+'\n\n[下載素材 ZIP](../moo-rabbit.zip) · [活動動態索引](07_motion/README.md)\n\n製作與驗收以 [cms_system 交付表](https://github.com/mootech-asia/cms_system/blob/main/brand/moo-rabbit/DELIVERY_CHECKLIST.md) 為準。原始生成檔、尺寸處理與檢查紀錄保留於該專案的 `source/`；這裡提供分類後交付檔。\n')
(dst/'archive-manifest.json').write_text(json.dumps({'source_repo':'mootech-asia/cms_system','status':'submitted-for-review','files':files},indent=2)+'\n')
with zipfile.ZipFile(dst.parent/'moo-rabbit.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(dst.rglob('*')):
  if p.is_file():z.write(p,p.relative_to(dst.parent))
with zipfile.ZipFile(dst.parent/'moo-rabbit.zip') as z:
 assert z.testzip() is None
 for p in dst.rglob('*'):
  if p.is_file():assert z.read(str(p.relative_to(dst.parent)))==p.read_bytes()
print('PASS archive and ZIP:',len(files),'assets')
