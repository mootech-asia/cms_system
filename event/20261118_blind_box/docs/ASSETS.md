# 20261118_blind_box 素材製作與用途清單

> 本表由 `python3 scripts/event-assets.py catalog` 產生；資料來源為 `event/ASSET_MANIFEST.json`。編號固定，新增素材接續編號，不重排既有編號。

檔名規則：`活動名稱_類別編號_用途描述.副檔名`。表內尺寸是目前實際交付尺寸；未標示可變更前請維持比例、透明區與錨點。按鈕、日期、次數、獎品文字保留程式疊字，活動主標分 en／ko／th 製作。

## 正式交付素材

### 圖片 — `assets/images/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| IMG001 | [blind_box_IMG001_icon-rotate.svg](../assets/images/icons/blind_box_IMG001_icon-rotate.svg) | 獎項／操作圖示：rotate | 160×160 | 保留 SVG 原透明區 · svg | `images.rotateHint` |
| IMG002 | [blind_box_IMG002_icon-tap.svg](../assets/images/icons/blind_box_IMG002_icon-tap.svg) | 獎項／操作圖示：tap | 160×160 | 保留 SVG 原透明區 · svg | `images.tapHint` |
| IMG003 | [blind_box_IMG003_poster.webp](../assets/images/mascot/blind_box_IMG003_poster.webp) | 角色靜態首幀／減少動態備用 | 1500×1875 | 保留 alpha · webp | `mascot.poster` |
| IMG004 | [blind_box_IMG004_reward-back.svg](../assets/images/reveal/blind_box_IMG004_reward-back.svg) | 揭曉卡片／稀有度圖：reward-back | 600×900 | 保留 SVG 原透明區 · svg | `images.rewardBack` |
| IMG005 | [blind_box_IMG005_reward-frame-common.svg](../assets/images/reveal/blind_box_IMG005_reward-frame-common.svg) | 揭曉卡片／稀有度圖：reward-frame-common | 600×900 | 保留 SVG 原透明區 · svg | `images.rewardFrameCommon` |
| IMG006 | [blind_box_IMG006_reward-frame-epic.svg](../assets/images/reveal/blind_box_IMG006_reward-frame-epic.svg) | 揭曉卡片／稀有度圖：reward-frame-epic | 600×900 | 保留 SVG 原透明區 · svg | `images.rewardFrameEpic` |
| IMG007 | [blind_box_IMG007_reward-frame-legendary.svg](../assets/images/reveal/blind_box_IMG007_reward-frame-legendary.svg) | 揭曉卡片／稀有度圖：reward-frame-legendary | 600×900 | 保留 SVG 原透明區 · svg | `images.rewardFrameLegendary` |
| IMG008 | [blind_box_IMG008_reward-frame-rare.svg](../assets/images/reveal/blind_box_IMG008_reward-frame-rare.svg) | 揭曉卡片／稀有度圖：reward-frame-rare | 600×900 | 保留 SVG 原透明區 · svg | `images.rewardFrameRare` |
| IMG009 | [blind_box_IMG009_footer-deco.svg](../assets/images/scene/blind_box_IMG009_footer-deco.svg) | 頁尾裝飾 | 750×160 | 保留 SVG 原透明區 · svg | `images.footerDeco` |
| IMG010 | [blind_box_IMG010_info-bg.svg](../assets/images/scene/blind_box_IMG010_info-bg.svg) | 規則與紀錄區底圖 | 750×750 | 保留 SVG 原透明區 · svg | `images.infoBg` |
| IMG011 | [blind_box_IMG011_open-desert.webp](../assets/images/scene/blind_box_IMG011_open-desert.webp) | 沙漠舞台及遠景 | 750×1125 | 不透明 · webp | `images.depthDesert`、`images.depthFloor`、`images.stageBg` |
| IMG012 | [blind_box_IMG012_share-preview.jpg](../assets/images/share/blind_box_IMG012_share-preview.jpg) | 社群分享預覽圖 | 1200×630 | 不透明 · jpg | 共用 CSS／社群 metadata 引用 |
| IMG013 | [blind_box_IMG013_title-en.webp](../assets/images/title/blind_box_IMG013_title-en.webp) | 英文活動主標 | 690×240 | 保留 alpha · webp | `images.title.en` |
| IMG014 | [blind_box_IMG014_title-ko.webp](../assets/images/title/blind_box_IMG014_title-ko.webp) | 韓文活動主標 | 690×240 | 保留 alpha · webp | `images.title.ko` |
| IMG015 | [blind_box_IMG015_title-main.webp](../assets/images/title/blind_box_IMG015_title-main.webp) | 主標基底／內部預覽 | 690×240 | 保留 alpha · webp | `images.title.zh` |
| IMG016 | [blind_box_IMG016_title-th.webp](../assets/images/title/blind_box_IMG016_title-th.webp) | 泰文活動主標 | 690×240 | 保留 alpha · webp | `images.title.th` |
| IMG017 | [blind_box_IMG017_btn-primary.webp](../assets/images/ui/blind_box_IMG017_btn-primary.webp) | 主要操作及領獎按鈕底圖 | 900×270 | 保留 alpha · webp | `images.btnPrimary` |
| IMG018 | [blind_box_IMG018_card-frame.svg](../assets/images/ui/blind_box_IMG018_card-frame.svg) | 資訊卡外框 | 120×120 | 保留 SVG 原透明區 · svg | `images.cardFrame` |
| IMG019 | [blind_box_IMG019_card-title.svg](../assets/images/ui/blind_box_IMG019_card-title.svg) | 規則／紀錄標題底圖 | 400×72 | 保留 SVG 原透明區 · svg | `images.cardTitle` |
| IMG020 | [blind_box_IMG020_chances-badge.webp](../assets/images/ui/blind_box_IMG020_chances-badge.webp) | 剩餘次數銘牌 | 630×210 | 保留 alpha · webp | `images.chancesBadge` |
| IMG021 | [blind_box_IMG021_loading-emblem.webp](../assets/images/ui/blind_box_IMG021_loading-emblem.webp) | 進站 loading 主題徽章 | 480×480 | 保留 alpha · webp | `images.loadingEmblem` |
| IMG022 | [blind_box_IMG022_panel-crown.webp](../assets/images/ui/blind_box_IMG022_panel-crown.webp) | 規則與紀錄面板冠飾 | 900×300 | 保留 alpha · webp | `images.folioHeader` |
| IMG023 | [blind_box_IMG023_period-badge.webp](../assets/images/ui/blind_box_IMG023_period-badge.webp) | 活動期間底牌 | 900×150 | 保留 alpha · webp | `images.periodBadge` |
| IMG024 | [blind_box_IMG024_ticker-bar.webp](../assets/images/ui/blind_box_IMG024_ticker-bar.webp) | 中獎跑馬燈底圖 | 1000×180 | 保留 alpha · webp | `images.tickerBar` |
| IMG025 | [blind_box_IMG025_tool-medallion.webp](../assets/images/ui/blind_box_IMG025_tool-medallion.webp) | 工具列金屬底框 | 160×160 | 保留 alpha · webp | `images.toolMedallion` |
| IMG026 | [blind_box_IMG026_treasure-plinth.webp](../assets/images/ui/blind_box_IMG026_treasure-plinth.webp) | 寶物展示底座 | 900×291 | 保留 alpha · webp | `images.treasurePlinth` |

### 背景音樂 — `assets/music/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| BGM001 | [blind_box_BGM001_bgm.mp3](../assets/music/blind_box_BGM001_bgm.mp3) | 活動背景音樂 | 150.622 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.bgm` |

### 音效 — `assets/sounds/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| SFX001 | [blind_box_SFX001_empty.mp3](../assets/sounds/blind_box_SFX001_empty.mp3) | 未中獎提示音 | 1.437 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.empty` |
| SFX002 | [blind_box_SFX002_error.mp3](../assets/sounds/blind_box_SFX002_error.mp3) | 無法操作提示音 | 0.313 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.error` |
| SFX003 | [blind_box_SFX003_move.mp3](../assets/sounds/blind_box_SFX003_move.mp3) | 輪播移動音效 | 0.261 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.move` |
| SFX004 | [blind_box_SFX004_open.wav](../assets/sounds/blind_box_SFX004_open.wav) | 寶箱掀蓋音效 | 3.144 秒 | 音訊依音量配置；不得削波 · wav | `sounds.tear` |
| SFX005 | [blind_box_SFX005_reveal-basic.wav](../assets/sounds/blind_box_SFX005_reveal-basic.wav) | 普通／稀有獎項揭曉音效 | 0.588 秒 | 音訊依音量配置；不得削波 · wav | `sounds.reveal-common`、`sounds.reveal-rare` |
| SFX006 | [blind_box_SFX006_reveal-epic.mp3](../assets/sounds/blind_box_SFX006_reveal-epic.mp3) | 史詩獎項揭曉音效 | 1.28 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.reveal-epic` |
| SFX007 | [blind_box_SFX007_reveal-legendary.mp3](../assets/sounds/blind_box_SFX007_reveal-legendary.mp3) | 傳說獎項揭曉音效 | 1.985 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.reveal-legendary` |
| SFX008 | [blind_box_SFX008_select.mp3](../assets/sounds/blind_box_SFX008_select.mp3) | 選定物件音效 | 0.418 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.select` |

### 視覺特效 — `assets/effects/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| VFX001 | [blind_box_VFX001_sand-vortex.webp](../assets/effects/blind_box_VFX001_sand-vortex.webp) | 開箱揭曉沙漠氣旋貼圖 | 1254×1254 | 保留 alpha · webp | `images.revealRays`、`images.revealVortex` |
| VFX002 | [blind_box_VFX002_atmosphere.webp](../assets/effects/blind_box_VFX002_atmosphere.webp) | 環境粒子／沙霧貼圖 | 900×300 | 保留 alpha · webp | `images.atmosphereSprite` |

### 3D 物件與貼圖 — `assets/3d/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| 3D001 | [blind_box_3D001_chest-front.webp](../assets/3d/textures/blind_box_3D001_chest-front.webp) | 3D 寶箱貼圖：chest-front | 640×400 | 不透明 · webp | `images.boxFront.0` |
| 3D002 | [blind_box_3D002_chest-interior.webp](../assets/3d/textures/blind_box_3D002_chest-interior.webp) | 3D 寶箱貼圖：chest-interior | 512×352 | 不透明 · webp | `images.boxInterior` |
| 3D003 | [blind_box_3D003_chest-lid.webp](../assets/3d/textures/blind_box_3D003_chest-lid.webp) | 3D 寶箱貼圖：chest-lid | 512×512 | 不透明 · webp | `images.boxLid`、`images.boxLidSide` |
| 3D004 | [blind_box_3D004_chest-side.webp](../assets/3d/textures/blind_box_3D004_chest-side.webp) | 3D 寶箱貼圖：chest-side | 512×320 | 不透明 · webp | `images.boxSide` |

## 程式生成的動態／3D 物件

以下不是遺漏的模型或影片檔；圖檔控制視覺材質，程式控制幾何與動態。換造型、UV 或骨架時需工程配合。

| 編號 | 程式來源 | 用途 |
|---|---|---|
| CODE001 | [../shared/unbox-3d/js/scene.js](../../shared/unbox-3d/js/scene.js) | 3D 卡包／寶箱即時幾何、UV、開啟與拖曳動態 |
| CODE002 | [../shared/unbox-3d/js/atmosphere.js](../../shared/unbox-3d/js/atmosphere.js) | Canvas 星光／風沙／花瓣環境特效 |
| CODE003 | [assets/js/spirit-motion.js](../assets/js/spirit-motion.js) | 沙漠精靈 WebGL 網格動態 |
| CODE004 | [../shared/unbox-3d/js/reveal-vortex.js](../../shared/unbox-3d/js/reveal-vortex.js) | 揭曉風沙氣旋 WebGL 特效 |
| CODE005 | [../shared/unbox-3d/js/desert-depth.js](../../shared/unbox-3d/js/desert-depth.js) | 沙漠舞台景深合成 |

## 製作原稿

原稿與正式交付分離；序列幀／分層檔內部名稱保留，外層套用活動前綴與來源編號，避免破壞關鍵幀對應。字型授權與角色設定說明隨原稿保留。

| 分類 | 原稿包 | 用途 | 檔案數 |
|---|---|---|---|
| 3D 物件與貼圖 | [source/3d/blind_box_SRC001_3d](../source/3d/blind_box_SRC001_3d) | 可編輯原稿／製作來源：3d | 4 |
| 圖片 | [source/images/blind_box_SRC001_desert-spirit-hd](../source/images/blind_box_SRC001_desert-spirit-hd) | 可編輯原稿／製作來源：desert-spirit-hd | 1 |
| 圖片 | [source/images/blind_box_SRC002_loading](../source/images/blind_box_SRC002_loading) | 可編輯原稿／製作來源：loading | 1 |
| 圖片 | [source/images/blind_box_SRC003_reveal](../source/images/blind_box_SRC003_reveal) | 可編輯原稿／製作來源：reveal | 1 |
| 圖片 | [source/images/blind_box_SRC004_scene](../source/images/blind_box_SRC004_scene) | 可編輯原稿／製作來源：scene | 6 |
| 圖片 | [source/images/blind_box_SRC005_status-badges.png](../source/images/blind_box_SRC005_status-badges.png) | 可編輯原稿／製作來源：status-badges.png | 1 |
| 圖片 | [source/images/blind_box_SRC006_title](../source/images/blind_box_SRC006_title) | 可編輯原稿／製作來源：title | 11 |
| 圖片 | [source/images/blind_box_SRC007_ui](../source/images/blind_box_SRC007_ui) | 可編輯原稿／製作來源：ui | 9 |

## 製作／替換驗收

1. 依本表逐項製作，三語主標不可漏交；同槽位換圖保持檔名、尺寸、透明與定位。
2. 可編輯原稿放 `source/<分類>/`；網頁檔放 `assets/<分類>/`，不可把原稿加入首屏。
3. 圖片維持透明邊緣與主題材質；動畫維持畫布、循環時間、腳底基準與安全邊界；音樂可循環、音效依事件觸發。
4. 共用按鈕與借用的獎項圖示／音效見下表，不複製成另一份。新主題可改 config 槽位為自己的素材。
5. 執行 `python3 scripts/event-assets.py check`、交付檢查及實際手機／桌機流程驗證；更新 JS／CSS 版本碼後發布。

## 跨活動／共用引用

| 槽位 | 所屬素材 |
|---|---|
| `images.statusBadges` | `../shared/assets/images/shared_IMG006_status-badges.webp` |
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
