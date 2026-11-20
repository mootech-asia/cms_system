# 20261111_survival_spin 素材製作與用途清單

> 本表由 `python3 scripts/event-assets.py catalog` 產生；資料來源為 `event/ASSET_MANIFEST.json`。編號固定，新增素材接續編號，不重排既有編號。

檔名規則：`活動名稱_類別編號_用途描述.副檔名`。表內尺寸是目前實際交付尺寸；未標示可變更前請維持比例、透明區與錨點。按鈕、日期、次數、獎品文字保留程式疊字，活動主標分 en／ko／th 製作。

## 正式交付素材

### 圖片 — `assets/images/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| IMG001 | [survival_spin_IMG001_btn-go.webp](../assets/images/ui/survival_spin_IMG001_btn-go.webp) | 轉盤中央 SPIN 按鈕 | 200×200 | 保留 alpha · webp | `skins.survival.images.btnGo` |
| IMG002 | [survival_spin_IMG002_btn-primary.webp](../assets/images/ui/survival_spin_IMG002_btn-primary.webp) | 主要操作及領獎按鈕底圖 | 400×110 | 保留 alpha · webp | `skins.survival.images.btnPrimary` |
| IMG003 | [survival_spin_IMG003_card-frame.webp](../assets/images/ui/survival_spin_IMG003_card-frame.webp) | 資訊卡外框 | 120×120 | 保留 alpha · webp | `skins.survival.images.cardFrame` |
| IMG004 | [survival_spin_IMG004_card-title.webp](../assets/images/ui/survival_spin_IMG004_card-title.webp) | 規則／紀錄標題底圖 | 400×72 | 保留 alpha · webp | `skins.survival.images.cardTitle` |
| IMG005 | [survival_spin_IMG005_chances-badge.webp](../assets/images/ui/survival_spin_IMG005_chances-badge.webp) | 剩餘次數銘牌 | 360×88 | 保留 alpha · webp | `skins.survival.images.chancesBadge` |
| IMG006 | [survival_spin_IMG006_footer-deco.webp](../assets/images/scene/survival_spin_IMG006_footer-deco.webp) | 頁尾裝飾 | 750×160 | 保留 alpha · webp | `skins.survival.images.footerDeco` |
| IMG007 | [survival_spin_IMG007_icon-bonus.svg](../assets/images/icons/survival_spin_IMG007_icon-bonus.svg) | 獎項／操作圖示：bonus | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.2.icon` |
| IMG008 | [survival_spin_IMG008_icon-cash.svg](../assets/images/icons/survival_spin_IMG008_icon-cash.svg) | 獎項／操作圖示：cash | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.0.icon` |
| IMG009 | [survival_spin_IMG009_icon-coin.svg](../assets/images/icons/survival_spin_IMG009_icon-coin.svg) | 獎項／操作圖示：coin | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.4.icon` |
| IMG010 | [survival_spin_IMG010_icon-gift.svg](../assets/images/icons/survival_spin_IMG010_icon-gift.svg) | 獎項／操作圖示：gift | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.5.icon` |
| IMG011 | [survival_spin_IMG011_icon-points.svg](../assets/images/icons/survival_spin_IMG011_icon-points.svg) | 獎項／操作圖示：points | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.3.icon` |
| IMG012 | [survival_spin_IMG012_icon-rotate.webp](../assets/images/icons/survival_spin_IMG012_icon-rotate.webp) | 獎項／操作圖示：rotate | 160×160 | 保留 alpha · webp | `skins.survival.images.rotateHint` |
| IMG013 | [survival_spin_IMG013_icon-spin.svg](../assets/images/icons/survival_spin_IMG013_icon-spin.svg) | 獎項／操作圖示：spin | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.1.icon` |
| IMG014 | [survival_spin_IMG014_icon-thanks.svg](../assets/images/icons/survival_spin_IMG014_icon-thanks.svg) | 獎項／操作圖示：thanks | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.6.icon` |
| IMG015 | [survival_spin_IMG015_info-bg.webp](../assets/images/scene/survival_spin_IMG015_info-bg.webp) | 規則與紀錄區底圖 | 750×750 | 不透明 · webp | `skins.survival.images.infoBg` |
| IMG016 | [survival_spin_IMG016_loading-emblem.webp](../assets/images/ui/survival_spin_IMG016_loading-emblem.webp) | 進站 loading 主題徽章 | 480×480 | 保留 alpha · webp | `images.loadingEmblem` |
| IMG017 | [survival_spin_IMG017_anticipation.webp](../assets/images/mascot/survival_spin_IMG017_anticipation.webp) | 角色期待／轉動動畫 | 400×500；48 幀／2000ms 無縫循環 | 保留 alpha · webp | `skins.survival.mascot.spinning`、`skins.survival.mascot.result`、`mascot.spinning`、`mascot.result` |
| IMG018 | [survival_spin_IMG018_disappointment.webp](../assets/images/mascot/survival_spin_IMG018_disappointment.webp) | 角色未中獎動畫 | 400×500；48 幀／2000ms 無縫循環 | 保留 alpha · webp | `skins.survival.mascot.lose`、`mascot.lose` |
| IMG019 | [survival_spin_IMG019_idle.webp](../assets/images/mascot/survival_spin_IMG019_idle.webp) | 角色待機動畫 | 400×500；48 幀／2000ms 無縫循環 | 保留 alpha · webp | `skins.survival.mascot.idle.0`、`mascot.idle.0` |
| IMG020 | [survival_spin_IMG020_poster.webp](../assets/images/mascot/survival_spin_IMG020_poster.webp) | 角色靜態首幀／減少動態備用 | 400×500 | 保留 alpha · webp | `skins.survival.mascot.poster`、`mascot.poster` |
| IMG021 | [survival_spin_IMG021_modal-bg.webp](../assets/images/ui/survival_spin_IMG021_modal-bg.webp) | 開獎彈窗完整底圖 | 600×760 | 保留 alpha · webp | `skins.survival.images.modalBg` |
| IMG022 | [survival_spin_IMG022_period-badge.webp](../assets/images/ui/survival_spin_IMG022_period-badge.webp) | 活動期間底牌 | 480×64 | 保留 alpha · webp | `skins.survival.images.periodBadge` |
| IMG023 | [survival_spin_IMG023_pointer.webp](../assets/images/ui/survival_spin_IMG023_pointer.webp) | 轉盤指針 | 120×160 | 保留 alpha · webp | `skins.survival.images.pointer` |
| IMG024 | [survival_spin_IMG024_share-preview.jpg](../assets/images/share/survival_spin_IMG024_share-preview.jpg) | 社群分享預覽圖 | 1200×630 | 不透明 · jpg | 共用 CSS／社群 metadata 引用 |
| IMG025 | [survival_spin_IMG025_stage-bg.webp](../assets/images/scene/survival_spin_IMG025_stage-bg.webp) | 主舞台背景 | 750×1000 | 不透明 · webp | `skins.survival.images.stageBg` |
| IMG026 | [survival_spin_IMG026_stage-floor.webp](../assets/images/scene/survival_spin_IMG026_stage-floor.webp) | 舞台地板 | 750×140 | 保留 alpha · webp | `skins.survival.images.stageFloor` |
| IMG027 | [survival_spin_IMG027_ticker-bar.webp](../assets/images/ui/survival_spin_IMG027_ticker-bar.webp) | 中獎跑馬燈底圖 | 690×64 | 保留 alpha · webp | `skins.survival.images.tickerBar` |
| IMG028 | [survival_spin_IMG028_title-en.webp](../assets/images/title/survival_spin_IMG028_title-en.webp) | 英文活動主標 | 690×240 | 保留 alpha · webp | `skins.survival.images.title.en`、`skins.survival.images.title.zh` |
| IMG029 | [survival_spin_IMG029_title-ko.webp](../assets/images/title/survival_spin_IMG029_title-ko.webp) | 韓文活動主標 | 690×240 | 保留 alpha · webp | `skins.survival.images.title.ko` |
| IMG030 | [survival_spin_IMG030_title-th.webp](../assets/images/title/survival_spin_IMG030_title-th.webp) | 泰文活動主標 | 690×240 | 保留 alpha · webp | `skins.survival.images.title.th` |
| IMG031 | [survival_spin_IMG031_wheel-frame.webp](../assets/images/ui/survival_spin_IMG031_wheel-frame.webp) | 轉盤外框 | 680×680 | 保留 alpha · webp | `skins.survival.images.wheelFrame` |
| IMG032 | [survival_spin_IMG032_wheel-stand.webp](../assets/images/ui/survival_spin_IMG032_wheel-stand.webp) | 轉盤立柱與底座 | 400×600 | 保留 alpha · webp | `skins.survival.images.wheelStand` |

### 背景音樂 — `assets/music/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|

目前採程式合成／未配置背景曲；不建立假的音檔。

### 音效 — `assets/sounds/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| SFX001 | [survival_spin_SFX001_click.mp3](../assets/sounds/survival_spin_SFX001_click.mp3) | 點擊音效 | 1.202 秒 | 音訊依音量配置；不得削波 · mp3 | `20261111_lucky_wheel:sounds.click`、`sounds.click` |
| SFX002 | [survival_spin_SFX002_hover.mp3](../assets/sounds/survival_spin_SFX002_hover.mp3) | 滑過音效 | 1.045 秒 | 音訊依音量配置；不得削波 · mp3 | `20261111_lucky_wheel:sounds.hover`、`sounds.hover`、`20261118_blind_box:sounds.hover`、`20261118_card_pack:sounds.hover` |
| SFX003 | [survival_spin_SFX003_reward-lose.mp3](../assets/sounds/survival_spin_SFX003_reward-lose.mp3) | 未中獎提示音 | 0.549 秒 | 音訊依音量配置；不得削波 · mp3 | `20261111_lucky_wheel:sounds.rewardLose`、`sounds.rewardLose` |
| SFX004 | [survival_spin_SFX004_reward.mp3](../assets/sounds/survival_spin_SFX004_reward.mp3) | 得獎音效 | 1.071 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.reward` |

### 視覺特效 — `assets/effects/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| VFX001 | [survival_spin_VFX001_bulb-off.webp](../assets/effects/survival_spin_VFX001_bulb-off.webp) | 轉盤燈泡暗態 | 48×48 | 保留 alpha · webp | `skins.survival.images.bulbOff` |
| VFX002 | [survival_spin_VFX002_bulb-on.webp](../assets/effects/survival_spin_VFX002_bulb-on.webp) | 轉盤燈泡亮態 | 48×48 | 保留 alpha · webp | `skins.survival.images.bulbOn` |
| VFX003 | [survival_spin_VFX003_light-pool.webp](../assets/effects/survival_spin_VFX003_light-pool.webp) | 地面光池 | 600×220 | 保留 alpha · webp | `skins.survival.images.lightPool` |
| VFX004 | [survival_spin_VFX004_spotlight.webp](../assets/effects/survival_spin_VFX004_spotlight.webp) | 舞台體積聚光 | 260×900 | 保留 alpha · webp | `skins.survival.images.spotlight` |
| VFX005 | [survival_spin_VFX005_stage-vignette.webp](../assets/effects/survival_spin_VFX005_stage-vignette.webp) | 舞台暗角 | 750×1000 | 保留 alpha · webp | `skins.survival.images.stageVignette` |
| VFX006 | [survival_spin_VFX006_wheel-gloss.svg](../assets/effects/survival_spin_VFX006_wheel-gloss.svg) | 轉盤表面反光 | 600×600 | 保留 SVG 原透明區 · svg | `skins.survival.images.wheelGloss` |

### 3D 物件與貼圖 — `assets/3d/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|

此活動目前未使用此類素材；新主題有需要時新增正式槽位。

## 程式生成的動態／3D 物件

以下不是遺漏的模型或影片檔；圖檔控制視覺材質，程式控制幾何與動態。換造型、UV 或骨架時需工程配合。

| 編號 | 程式來源 | 用途 |
|---|---|---|
| CODE001 | [assets/js/wheel.js](../assets/js/wheel.js) | 轉盤 Canvas 扇區、燈泡亮暗與旋轉 |
| CODE002 | [assets/css/event.css](../assets/css/event.css) | 轉盤舞台燈光與介面狀態 |

## 製作原稿

原稿與正式交付分離；序列幀／分層檔內部名稱保留，外層套用活動前綴與來源編號，避免破壞關鍵幀對應。字型授權與角色設定說明隨原稿保留。

| 分類 | 原稿包 | 用途 | 檔案數 |
|---|---|---|---|
| 音效 | [source/sounds/survival_spin_SRC001_audio](../source/sounds/survival_spin_SRC001_audio) | 可編輯原稿／製作來源：audio | 4 |
| 圖片 | [source/images/survival_spin_SRC001_guard-rifle-v1](../source/images/survival_spin_SRC001_guard-rifle-v1) | 可編輯原稿／製作來源：guard-rifle-v1 | 240 |
| 圖片 | [source/images/survival_spin_SRC002_loading](../source/images/survival_spin_SRC002_loading) | 可編輯原稿／製作來源：loading | 1 |
| 圖片 | [source/images/survival_spin_SRC003_mascot](../source/images/survival_spin_SRC003_mascot) | 可編輯原稿／製作來源：mascot | 3 |
| 圖片 | [source/images/survival_spin_SRC004_p0](../source/images/survival_spin_SRC004_p0) | 可編輯原稿／製作來源：p0 | 16 |
| 圖片 | [source/images/survival_spin_SRC005_social-promo](../source/images/survival_spin_SRC005_social-promo) | 可編輯原稿／製作來源：social-promo | 3 |
| 圖片 | [source/images/survival_spin_SRC006_ui](../source/images/survival_spin_SRC006_ui) | 可編輯原稿／製作來源：ui | 14 |

## 製作／替換驗收

1. 依本表逐項製作，三語主標不可漏交；同槽位換圖保持檔名、尺寸、透明與定位。
2. 可編輯原稿放 `source/<分類>/`；網頁檔放 `assets/<分類>/`，不可把原稿加入首屏。
3. 圖片維持透明邊緣與主題材質；動畫維持畫布、循環時間、腳底基準與安全邊界；音樂可循環、音效依事件觸發。
4. 共用按鈕與借用的獎項圖示／音效見下表，不複製成另一份。新主題可改 config 槽位為自己的素材。
5. 執行 `python3 scripts/event-assets.py check`、交付檢查及實際手機／桌機流程驗證；更新 JS／CSS 版本碼後發布。

## 跨活動／共用引用

| 槽位 | 所屬素材 |
|---|---|
| `skins.survival.images.soundOn` | `../shared/assets/images/shared_IMG004_icon-sound-on.webp` |
| `skins.survival.images.soundOff` | `../shared/assets/images/shared_IMG003_icon-sound-off.webp` |
| `skins.survival.images.share` | `../shared/assets/images/shared_IMG002_icon-share.webp` |
| `assetSpecs.share` | `../shared/assets/images/shared_IMG002_icon-share.webp` |
