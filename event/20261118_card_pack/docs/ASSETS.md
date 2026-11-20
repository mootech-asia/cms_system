# 20261118_card_pack 素材製作與用途清單

> 本表由 `python3 scripts/event-assets.py catalog` 產生；資料來源為 `event/ASSET_MANIFEST.json`。編號固定，新增素材接續編號，不重排既有編號。

檔名規則：`活動名稱_類別編號_用途描述.副檔名`。表內尺寸是目前實際交付尺寸；未標示可變更前請維持比例、透明區與錨點。按鈕、日期、次數、獎品文字保留程式疊字，活動主標分 en／ko／th 製作。

## 正式交付素材

### 圖片 — `assets/images/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| IMG001 | [card_pack_IMG001_icon-rotate.svg](../assets/images/icons/card_pack_IMG001_icon-rotate.svg) | 獎項／操作圖示：rotate | 160×160 | 保留 SVG 原透明區 · svg | `images.rotateHint` |
| IMG002 | [card_pack_IMG002_icon-tap.svg](../assets/images/icons/card_pack_IMG002_icon-tap.svg) | 獎項／操作圖示：tap | 160×160 | 保留 SVG 原透明區 · svg | `images.tapHint` |
| IMG003 | [card_pack_IMG003_reward-back.webp](../assets/images/reveal/card_pack_IMG003_reward-back.webp) | 揭曉卡片／稀有度圖：reward-back | 600×900 | 不透明 · webp | `images.rewardBack` |
| IMG004 | [card_pack_IMG004_reward-front.webp](../assets/images/reveal/card_pack_IMG004_reward-front.webp) | 揭曉卡片／稀有度圖：reward-front | 600×900 | 不透明 · webp | `images.rewardFrameCommon`、`images.rewardFrameRare`、`images.rewardFrameEpic`、`images.rewardFrameLegendary` |
| IMG005 | [card_pack_IMG005_secret-back.webp](../assets/images/reveal/card_pack_IMG005_secret-back.webp) | 揭曉卡片／稀有度圖：secret-back | 600×900 | 不透明 · webp | `images.secretBack` |
| IMG006 | [card_pack_IMG006_secret-front.webp](../assets/images/reveal/card_pack_IMG006_secret-front.webp) | 揭曉卡片／稀有度圖：secret-front | 600×900 | 不透明 · webp | `images.secretFront` |
| IMG007 | [card_pack_IMG007_footer-deco.svg](../assets/images/scene/card_pack_IMG007_footer-deco.svg) | 頁尾裝飾 | 750×160 | 保留 SVG 原透明區 · svg | `images.footerDeco` |
| IMG008 | [card_pack_IMG008_info-bg.svg](../assets/images/scene/card_pack_IMG008_info-bg.svg) | 規則與紀錄區底圖 | 750×750 | 保留 SVG 原透明區 · svg | `images.infoBg` |
| IMG009 | [card_pack_IMG009_stage-bg.webp](../assets/images/scene/card_pack_IMG009_stage-bg.webp) | 主舞台背景 | 750×1000 | 不透明 · webp | `images.stageBg` |
| IMG010 | [card_pack_IMG010_share-preview.jpg](../assets/images/share/card_pack_IMG010_share-preview.jpg) | 社群分享預覽圖 | 1200×630 | 不透明 · jpg | 共用 CSS／社群 metadata 引用 |
| IMG011 | [card_pack_IMG011_title-en.webp](../assets/images/title/card_pack_IMG011_title-en.webp) | 英文活動主標 | 690×240 | 保留 alpha · webp | `images.title.en` |
| IMG012 | [card_pack_IMG012_title-ko.webp](../assets/images/title/card_pack_IMG012_title-ko.webp) | 韓文活動主標 | 690×240 | 保留 alpha · webp | `images.title.ko` |
| IMG013 | [card_pack_IMG013_title-main.webp](../assets/images/title/card_pack_IMG013_title-main.webp) | 主標基底／內部預覽 | 690×240 | 保留 alpha · webp | `images.title.zh` |
| IMG014 | [card_pack_IMG014_title-th.webp](../assets/images/title/card_pack_IMG014_title-th.webp) | 泰文活動主標 | 690×240 | 保留 alpha · webp | `images.title.th` |
| IMG015 | [card_pack_IMG015_btn-primary.webp](../assets/images/ui/card_pack_IMG015_btn-primary.webp) | 主要操作及領獎按鈕底圖 | 900×270 | 保留 alpha · webp | `images.btnPrimary` |
| IMG016 | [card_pack_IMG016_card-frame.svg](../assets/images/ui/card_pack_IMG016_card-frame.svg) | 資訊卡外框 | 120×120 | 保留 SVG 原透明區 · svg | `images.cardFrame` |
| IMG017 | [card_pack_IMG017_card-title.svg](../assets/images/ui/card_pack_IMG017_card-title.svg) | 規則／紀錄標題底圖 | 400×72 | 保留 SVG 原透明區 · svg | `images.cardTitle` |
| IMG018 | [card_pack_IMG018_chances-badge.webp](../assets/images/ui/card_pack_IMG018_chances-badge.webp) | 剩餘次數銘牌 | 630×210 | 保留 alpha · webp | `images.chancesBadge` |
| IMG019 | [card_pack_IMG019_folio-header.webp](../assets/images/ui/card_pack_IMG019_folio-header.webp) | 規則與紀錄冊頁標頭 | 900×300 | 不透明 · webp | `images.folioHeader` |
| IMG020 | [card_pack_IMG020_loading-emblem.webp](../assets/images/ui/card_pack_IMG020_loading-emblem.webp) | 進站 loading 主題徽章 | 480×480 | 保留 alpha · webp | `images.loadingEmblem` |
| IMG021 | [card_pack_IMG021_panel-frame.webp](../assets/images/ui/card_pack_IMG021_panel-frame.webp) | 規則與紀錄面板外框 | 768×768 | 保留 alpha · webp | `images.panelFrame` |
| IMG022 | [card_pack_IMG022_period-badge.webp](../assets/images/ui/card_pack_IMG022_period-badge.webp) | 活動期間底牌 | 900×150 | 保留 alpha · webp | `images.periodBadge` |
| IMG023 | [card_pack_IMG023_ticker-bar.webp](../assets/images/ui/card_pack_IMG023_ticker-bar.webp) | 中獎跑馬燈底圖 | 1000×180 | 保留 alpha · webp | `images.tickerBar` |
| IMG024 | [card_pack_IMG024_tool-medallion.webp](../assets/images/ui/card_pack_IMG024_tool-medallion.webp) | 工具列金屬底框 | 160×160 | 保留 alpha · webp | `images.toolMedallion` |

### 背景音樂 — `assets/music/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| BGM001 | [card_pack_BGM001_bgm.wav](../assets/music/card_pack_BGM001_bgm.wav) | 活動背景音樂 | 30.0 秒 | 音訊依音量配置；不得削波 · wav | `sounds.bgm` |

### 音效 — `assets/sounds/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| SFX001 | [card_pack_SFX001_click.mp3](../assets/sounds/card_pack_SFX001_click.mp3) | 點擊音效 | 0.209 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.click` |
| SFX002 | [card_pack_SFX002_collect.mp3](../assets/sounds/card_pack_SFX002_collect.mp3) | 領取獎品音效 | 0.627 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.collect` |
| SFX003 | [card_pack_SFX003_empty.mp3](../assets/sounds/card_pack_SFX003_empty.mp3) | 未中獎提示音 | 1.437 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.empty` |
| SFX004 | [card_pack_SFX004_error.mp3](../assets/sounds/card_pack_SFX004_error.mp3) | 無法操作提示音 | 0.313 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.error` |
| SFX005 | [card_pack_SFX005_flip.mp3](../assets/sounds/card_pack_SFX005_flip.mp3) | 翻卡音效 | 0.261 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.flip` |
| SFX006 | [card_pack_SFX006_move.mp3](../assets/sounds/card_pack_SFX006_move.mp3) | 輪播移動音效 | 0.261 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.move` |
| SFX007 | [card_pack_SFX007_reveal-3026.wav](../assets/sounds/card_pack_SFX007_reveal-3026.wav) | 獎項揭曉音效 | 2.194 秒 | 音訊依音量配置；不得削波 · wav | `sounds.reveal-epic`、`sounds.reveal-legendary` |
| SFX008 | [card_pack_SFX008_reveal-basic.wav](../assets/sounds/card_pack_SFX008_reveal-basic.wav) | 普通／稀有獎項揭曉音效 | 0.588 秒 | 音訊依音量配置；不得削波 · wav | `sounds.reveal-common`、`sounds.reveal-rare` |
| SFX009 | [card_pack_SFX009_reward.mp3](../assets/sounds/card_pack_SFX009_reward.mp3) | 得獎音效 | 1.045 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.reward` |
| SFX010 | [card_pack_SFX010_secret.mp3](../assets/sounds/card_pack_SFX010_secret.mp3) | 隱藏卡揭曉音效 | 2.038 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.secret` |
| SFX011 | [card_pack_SFX011_select.mp3](../assets/sounds/card_pack_SFX011_select.mp3) | 選定物件音效 | 0.418 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.select` |
| SFX012 | [card_pack_SFX012_tear.wav](../assets/sounds/card_pack_SFX012_tear.wav) | 卡包撕封音效 | 0.385 秒 | 音訊依音量配置；不得削波 · wav | `sounds.tear` |

### 視覺特效 — `assets/effects/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| VFX001 | [card_pack_VFX001_atmosphere.webp](../assets/effects/card_pack_VFX001_atmosphere.webp) | 環境粒子／沙霧貼圖 | 640×454 | 保留 alpha · webp | `images.atmosphereSprite` |
| VFX002 | [card_pack_VFX002_magic-circle.webp](../assets/effects/card_pack_VFX002_magic-circle.webp) | 宇宙魔法陣 | 640×640 | 保留 alpha · webp | `images.magicCircle` |
| VFX003 | [card_pack_VFX003_reveal-aura.webp](../assets/effects/card_pack_VFX003_reveal-aura.webp) | 揭曉光暈 | 900×900 | 保留 alpha · webp | `images.revealRays`、`assetSpecs.revealRays` |
| VFX004 | [card_pack_VFX004_star-glint.webp](../assets/effects/card_pack_VFX004_star-glint.webp) | 星光閃耀粒子 | 192×192 | 保留 alpha · webp | `images.starSprite` |

### 3D 物件與貼圖 — `assets/3d/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| 3D001 | [card_pack_3D001_pack-back.webp](../assets/3d/textures/card_pack_3D001_pack-back.webp) | 3D 卡包貼圖：pack-back | 512×768 | 不透明 · webp | `images.packBack` |
| 3D002 | [card_pack_3D002_pack-contents.webp](../assets/3d/textures/card_pack_3D002_pack-contents.webp) | 3D 卡包貼圖：pack-contents | 256×384 | 不透明 · webp | `images.packContents` |
| 3D003 | [card_pack_3D003_pack-crimp.webp](../assets/3d/textures/card_pack_3D003_pack-crimp.webp) | 3D 卡包貼圖：pack-crimp | 512×64 | 不透明 · webp | `images.packCrimp` |
| 3D004 | [card_pack_3D004_pack-front-1.webp](../assets/3d/textures/card_pack_3D004_pack-front-1.webp) | 3D 卡包貼圖：pack-front-1 | 512×768 | 不透明 · webp | `images.packFront.0` |
| 3D005 | [card_pack_3D005_pack-front-2.webp](../assets/3d/textures/card_pack_3D005_pack-front-2.webp) | 3D 卡包貼圖：pack-front-2 | 512×768 | 不透明 · webp | `images.packFront.1` |
| 3D006 | [card_pack_3D006_pack-front-3.webp](../assets/3d/textures/card_pack_3D006_pack-front-3.webp) | 3D 卡包貼圖：pack-front-3 | 512×768 | 不透明 · webp | `images.packFront.2` |
| 3D007 | [card_pack_3D007_pack-side.webp](../assets/3d/textures/card_pack_3D007_pack-side.webp) | 3D 卡包貼圖：pack-side | 128×512 | 不透明 · webp | `images.packSide` |
| 3D008 | [card_pack_3D008_secret-pack.webp](../assets/3d/textures/card_pack_3D008_secret-pack.webp) | 3D 卡包貼圖：secret-pack | 512×768 | 不透明 · webp | `images.secretPack` |
| 3D009 | [card_pack_3D009_secret-side.webp](../assets/3d/textures/card_pack_3D009_secret-side.webp) | 3D 卡包貼圖：secret-side | 128×512 | 不透明 · webp | `images.secretSide` |

## 程式生成的動態／3D 物件

以下不是遺漏的模型或影片檔；圖檔控制視覺材質，程式控制幾何與動態。換造型、UV 或骨架時需工程配合。

| 編號 | 程式來源 | 用途 |
|---|---|---|
| CODE001 | [../shared/unbox-3d/js/scene.js](../../shared/unbox-3d/js/scene.js) | 3D 卡包／寶箱即時幾何、UV、開啟與拖曳動態 |
| CODE002 | [../shared/unbox-3d/js/atmosphere.js](../../shared/unbox-3d/js/atmosphere.js) | Canvas 星光／風沙／花瓣環境特效 |

## 製作原稿

原稿與正式交付分離；序列幀／分層檔內部名稱保留，外層套用活動前綴與來源編號，避免破壞關鍵幀對應。字型授權與角色設定說明隨原稿保留。

| 分類 | 原稿包 | 用途 | 檔案數 |
|---|---|---|---|
| 3D 物件與貼圖 | [source/3d/card_pack_SRC001_3d](../source/3d/card_pack_SRC001_3d) | 可編輯原稿／製作來源：3d | 4 |
| 音效 | [source/sounds/card_pack_SRC001_audio](../source/sounds/card_pack_SRC001_audio) | 可編輯原稿／製作來源：audio | 1 |
| 圖片 | [source/images/card_pack_SRC001_character](../source/images/card_pack_SRC001_character) | 可編輯原稿／製作來源：character | 3 |
| 圖片 | [source/images/card_pack_SRC002_loading](../source/images/card_pack_SRC002_loading) | 可編輯原稿／製作來源：loading | 1 |
| 圖片 | [source/images/card_pack_SRC003_reveal](../source/images/card_pack_SRC003_reveal) | 可編輯原稿／製作來源：reveal | 5 |
| 圖片 | [source/images/card_pack_SRC004_scene](../source/images/card_pack_SRC004_scene) | 可編輯原稿／製作來源：scene | 2 |
| 圖片 | [source/images/card_pack_SRC005_secret](../source/images/card_pack_SRC005_secret) | 可編輯原稿／製作來源：secret | 3 |
| 圖片 | [source/images/card_pack_SRC006_title](../source/images/card_pack_SRC006_title) | 可編輯原稿／製作來源：title | 11 |
| 圖片 | [source/images/card_pack_SRC007_ui](../source/images/card_pack_SRC007_ui) | 可編輯原稿／製作來源：ui | 11 |

## 製作／替換驗收

1. 依本表逐項製作，三語主標不可漏交；同槽位換圖保持檔名、尺寸、透明與定位。
2. 可編輯原稿放 `source/<分類>/`；網頁檔放 `assets/<分類>/`，不可把原稿加入首屏。
3. 圖片維持透明邊緣與主題材質；動畫維持畫布、循環時間、腳底基準與安全邊界；音樂可循環、音效依事件觸發。
4. 共用按鈕與借用的獎項圖示／音效見下表，不複製成另一份。新主題可改 config 槽位為自己的素材。
5. 執行 `python3 scripts/event-assets.py check`、交付檢查及實際手機／桌機流程驗證；更新 JS／CSS 版本碼後發布。

## 跨活動／共用引用

| 槽位 | 所屬素材 |
|---|---|
| `images.btnArrow` | `../shared/assets/images/shared_IMG001_arrow-frame.webp` |
| `images.soundOn` | `../shared/assets/images/shared_IMG004_icon-sound-on.webp` |
| `images.soundOff` | `../shared/assets/images/shared_IMG003_icon-sound-off.webp` |
| `images.share` | `../shared/assets/images/shared_IMG002_icon-share.webp` |
| `sounds.count` | `../shared/assets/sounds/shared_SFX005_click01.wav` |
| `sounds.hover` | `../20261111_survival_spin/assets/sounds/survival_spin_SFX002_hover.mp3` |
| `assetSpecs.btnArrow` | `../shared/assets/images/shared_IMG001_arrow-frame.webp` |
| `assetSpecs.share` | `../shared/assets/images/shared_IMG002_icon-share.webp` |
| `defaultContent.prizes.0.icon` | `../20261111_lucky_wheel/assets/images/icons/lucky_wheel_IMG011_icon-points.svg` |
| `defaultContent.prizes.1.icon` | `../20261111_lucky_wheel/assets/images/icons/lucky_wheel_IMG009_icon-coin.svg` |
| `defaultContent.prizes.2.icon` | `../20261111_lucky_wheel/assets/images/icons/lucky_wheel_IMG013_icon-spin.svg` |
| `defaultContent.prizes.3.icon` | `../20261111_lucky_wheel/assets/images/icons/lucky_wheel_IMG007_icon-bonus.svg` |
| `defaultContent.prizes.4.icon` | `../20261111_lucky_wheel/assets/images/icons/lucky_wheel_IMG010_icon-gift.svg` |
| `defaultContent.prizes.5.icon` | `../20261111_lucky_wheel/assets/images/icons/lucky_wheel_IMG008_icon-cash.svg` |
