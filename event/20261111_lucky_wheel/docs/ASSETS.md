# 20261111_lucky_wheel 素材製作與用途清單

> 本表由 `python3 scripts/event-assets.py catalog` 產生；資料來源為 `event/ASSET_MANIFEST.json`。編號固定，新增素材接續編號，不重排既有編號。

檔名規則：`活動名稱_類別編號_用途描述.副檔名`。表內尺寸是目前實際交付尺寸；未標示可變更前請維持比例、透明區與錨點。按鈕、日期、次數、獎品文字保留程式疊字，活動主標分 en／ko／th 製作。

## 正式交付素材

### 圖片 — `assets/images/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| IMG001 | [lucky_wheel_IMG001_btn-go.webp](../assets/images/ui/lucky_wheel_IMG001_btn-go.webp) | 轉盤中央 SPIN 按鈕 | 200×200 | 保留 alpha · webp | `images.btnGo` |
| IMG002 | [lucky_wheel_IMG002_btn-primary.webp](../assets/images/ui/lucky_wheel_IMG002_btn-primary.webp) | 主要操作及領獎按鈕底圖 | 400×110 | 保留 alpha · webp | `images.btnPrimary` |
| IMG003 | [lucky_wheel_IMG003_card-frame.webp](../assets/images/ui/lucky_wheel_IMG003_card-frame.webp) | 資訊卡外框 | 120×120 | 保留 alpha · webp | `images.cardFrame` |
| IMG004 | [lucky_wheel_IMG004_card-title.webp](../assets/images/ui/lucky_wheel_IMG004_card-title.webp) | 規則／紀錄標題底圖 | 400×72 | 保留 alpha · webp | `images.cardTitle` |
| IMG005 | [lucky_wheel_IMG005_chances-badge.webp](../assets/images/ui/lucky_wheel_IMG005_chances-badge.webp) | 剩餘次數銘牌 | 360×88 | 保留 alpha · webp | `images.chancesBadge` |
| IMG006 | [lucky_wheel_IMG006_footer-deco.webp](../assets/images/scene/lucky_wheel_IMG006_footer-deco.webp) | 頁尾裝飾 | 750×160 | 保留 alpha · webp | `images.footerDeco` |
| IMG007 | [lucky_wheel_IMG007_icon-bonus.svg](../assets/images/icons/lucky_wheel_IMG007_icon-bonus.svg) | 獎項／操作圖示：bonus | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.2.icon`、`20261118_blind_box:defaultContent.prizes.3.icon`、`20261118_card_pack:defaultContent.prizes.3.icon` |
| IMG008 | [lucky_wheel_IMG008_icon-cash.svg](../assets/images/icons/lucky_wheel_IMG008_icon-cash.svg) | 獎項／操作圖示：cash | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.0.icon`、`20261118_blind_box:defaultContent.prizes.5.icon`、`20261118_card_pack:defaultContent.prizes.5.icon` |
| IMG009 | [lucky_wheel_IMG009_icon-coin.svg](../assets/images/icons/lucky_wheel_IMG009_icon-coin.svg) | 獎項／操作圖示：coin | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.4.icon`、`20261118_blind_box:defaultContent.prizes.1.icon`、`20261118_card_pack:defaultContent.prizes.1.icon` |
| IMG010 | [lucky_wheel_IMG010_icon-gift.svg](../assets/images/icons/lucky_wheel_IMG010_icon-gift.svg) | 獎項／操作圖示：gift | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.5.icon`、`20261118_blind_box:defaultContent.prizes.4.icon`、`20261118_card_pack:defaultContent.prizes.4.icon` |
| IMG011 | [lucky_wheel_IMG011_icon-points.svg](../assets/images/icons/lucky_wheel_IMG011_icon-points.svg) | 獎項／操作圖示：points | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.3.icon`、`20261118_blind_box:defaultContent.prizes.0.icon`、`20261118_card_pack:defaultContent.prizes.0.icon` |
| IMG012 | [lucky_wheel_IMG012_icon-rotate.webp](../assets/images/icons/lucky_wheel_IMG012_icon-rotate.webp) | 獎項／操作圖示：rotate | 160×160 | 保留 alpha · webp | `images.rotateHint` |
| IMG013 | [lucky_wheel_IMG013_icon-spin.svg](../assets/images/icons/lucky_wheel_IMG013_icon-spin.svg) | 獎項／操作圖示：spin | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.1.icon`、`20261118_blind_box:defaultContent.prizes.2.icon`、`20261118_card_pack:defaultContent.prizes.2.icon` |
| IMG014 | [lucky_wheel_IMG014_icon-thanks.svg](../assets/images/icons/lucky_wheel_IMG014_icon-thanks.svg) | 獎項／操作圖示：thanks | 160×160 | 保留 SVG 原透明區 · svg | `defaultContent.prizes.6.icon` |
| IMG015 | [lucky_wheel_IMG015_info-bg.webp](../assets/images/scene/lucky_wheel_IMG015_info-bg.webp) | 規則與紀錄區底圖 | 750×750 | 不透明 · webp | `images.infoBg` |
| IMG016 | [lucky_wheel_IMG016_loading-emblem.webp](../assets/images/ui/lucky_wheel_IMG016_loading-emblem.webp) | 進站 loading 主題徽章 | 480×480 | 保留 alpha · webp | `images.loadingEmblem` |
| IMG017 | [lucky_wheel_IMG017_idle-1.webp](../assets/images/mascot/lucky_wheel_IMG017_idle-1.webp) | 角色待機動畫 | 400×500；47 幀／2000ms 無縫循環 | 保留 alpha · webp | `mascot.idle.0` |
| IMG018 | [lucky_wheel_IMG018_lose.webp](../assets/images/mascot/lucky_wheel_IMG018_lose.webp) | 角色未中獎動畫 | 400×500；47 幀／2000ms 無縫循環 | 保留 alpha · webp | `mascot.lose` |
| IMG019 | [lucky_wheel_IMG019_poster.webp](../assets/images/mascot/lucky_wheel_IMG019_poster.webp) | 角色靜態首幀／減少動態備用 | 400×500 | 保留 alpha · webp | `mascot.poster` |
| IMG020 | [lucky_wheel_IMG020_result.webp](../assets/images/mascot/lucky_wheel_IMG020_result.webp) | 角色中獎動畫 | 400×500；47 幀／2000ms 無縫循環 | 保留 alpha · webp | `mascot.result` |
| IMG021 | [lucky_wheel_IMG021_spinning.webp](../assets/images/mascot/lucky_wheel_IMG021_spinning.webp) | 角色期待／轉動動畫 | 400×500；47 幀／2000ms 無縫循環 | 保留 alpha · webp | `mascot.spinning` |
| IMG022 | [lucky_wheel_IMG022_modal-bg.webp](../assets/images/ui/lucky_wheel_IMG022_modal-bg.webp) | 開獎彈窗完整底圖 | 600×760 | 保留 alpha · webp | `images.modalBg` |
| IMG023 | [lucky_wheel_IMG023_period-badge.webp](../assets/images/ui/lucky_wheel_IMG023_period-badge.webp) | 活動期間底牌 | 480×64 | 保留 alpha · webp | `images.periodBadge` |
| IMG024 | [lucky_wheel_IMG024_pointer.webp](../assets/images/ui/lucky_wheel_IMG024_pointer.webp) | 轉盤指針 | 120×160 | 保留 alpha · webp | `images.pointer` |
| IMG025 | [lucky_wheel_IMG025_share-preview.jpg](../assets/images/share/lucky_wheel_IMG025_share-preview.jpg) | 社群分享預覽圖 | 1200×630 | 不透明 · jpg | 共用 CSS／社群 metadata 引用 |
| IMG026 | [lucky_wheel_IMG026_stage-bg.webp](../assets/images/scene/lucky_wheel_IMG026_stage-bg.webp) | 主舞台背景 | 750×1000 | 不透明 · webp | `images.stageBg` |
| IMG027 | [lucky_wheel_IMG027_stage-floor.webp](../assets/images/scene/lucky_wheel_IMG027_stage-floor.webp) | 舞台地板 | 750×140 | 保留 alpha · webp | `images.stageFloor` |
| IMG028 | [lucky_wheel_IMG028_ticker-bar.webp](../assets/images/ui/lucky_wheel_IMG028_ticker-bar.webp) | 中獎跑馬燈底圖 | 690×64 | 保留 alpha · webp | `images.tickerBar` |
| IMG029 | [lucky_wheel_IMG029_title-en.webp](../assets/images/title/lucky_wheel_IMG029_title-en.webp) | 英文活動主標 | 690×240 | 保留 alpha · webp | `images.title.en` |
| IMG030 | [lucky_wheel_IMG030_title-ko.webp](../assets/images/title/lucky_wheel_IMG030_title-ko.webp) | 韓文活動主標 | 690×240 | 保留 alpha · webp | `images.title.ko` |
| IMG031 | [lucky_wheel_IMG031_title-th.webp](../assets/images/title/lucky_wheel_IMG031_title-th.webp) | 泰文活動主標 | 690×240 | 保留 alpha · webp | `images.title.th` |
| IMG032 | [lucky_wheel_IMG032_title-zh.svg](../assets/images/title/lucky_wheel_IMG032_title-zh.svg) | 內部預覽主標 | 690×240 | 保留 SVG 原透明區 · svg | `images.title.zh` |
| IMG033 | [lucky_wheel_IMG033_wheel-frame.webp](../assets/images/ui/lucky_wheel_IMG033_wheel-frame.webp) | 轉盤外框 | 680×680 | 保留 alpha · webp | `images.wheelFrame` |
| IMG034 | [lucky_wheel_IMG034_wheel-stand.webp](../assets/images/ui/lucky_wheel_IMG034_wheel-stand.webp) | 轉盤立柱與底座 | 400×600 | 保留 alpha · webp | `images.wheelStand` |

### 背景音樂 — `assets/music/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|

目前採程式合成／未配置背景曲；不建立假的音檔。

### 音效 — `assets/sounds/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| SFX001 | [lucky_wheel_SFX001_reward.mp3](../assets/sounds/lucky_wheel_SFX001_reward.mp3) | 得獎音效 | 5.224 秒 | 音訊依音量配置；不得削波 · mp3 | `sounds.reward` |

### 視覺特效 — `assets/effects/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| VFX001 | [lucky_wheel_VFX001_bulb-off.png](../assets/effects/lucky_wheel_VFX001_bulb-off.png) | 轉盤燈泡暗態 | 48×48 | 保留 alpha · png | `images.bulbOff` |
| VFX002 | [lucky_wheel_VFX002_bulb-on.png](../assets/effects/lucky_wheel_VFX002_bulb-on.png) | 轉盤燈泡亮態 | 48×48 | 保留 alpha · png | `images.bulbOn` |
| VFX003 | [lucky_wheel_VFX003_light-pool.webp](../assets/effects/lucky_wheel_VFX003_light-pool.webp) | 地面光池 | 600×220 | 保留 alpha · webp | `images.lightPool` |
| VFX004 | [lucky_wheel_VFX004_spotlight.webp](../assets/effects/lucky_wheel_VFX004_spotlight.webp) | 舞台體積聚光 | 260×900 | 保留 alpha · webp | `images.spotlight` |
| VFX005 | [lucky_wheel_VFX005_stage-vignette.webp](../assets/effects/lucky_wheel_VFX005_stage-vignette.webp) | 舞台暗角 | 750×1000 | 保留 alpha · webp | `images.stageVignette` |
| VFX006 | [lucky_wheel_VFX006_wheel-gloss.svg](../assets/effects/lucky_wheel_VFX006_wheel-gloss.svg) | 轉盤表面反光 | 600×600 | 保留 SVG 原透明區 · svg | `images.wheelGloss` |

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
| 音效 | [source/sounds/lucky_wheel_SRC001_audio](../source/sounds/lucky_wheel_SRC001_audio) | 可編輯原稿／製作來源：audio | 1 |
| 視覺特效 | [source/effects/lucky_wheel_SRC001_lighting-v4](../source/effects/lucky_wheel_SRC001_lighting-v4) | 可編輯原稿／製作來源：lighting-v4 | 7 |
| 圖片 | [source/images/lucky_wheel_SRC001_loading](../source/images/lucky_wheel_SRC001_loading) | 可編輯原稿／製作來源：loading | 1 |
| 圖片 | [source/images/lucky_wheel_SRC002_main-visual](../source/images/lucky_wheel_SRC002_main-visual) | 可編輯原稿／製作來源：main-visual | 9 |
| 圖片 | [source/images/lucky_wheel_SRC003_mascot](../source/images/lucky_wheel_SRC003_mascot) | 可編輯原稿／製作來源：mascot | 4 |
| 圖片 | [source/images/lucky_wheel_SRC004_rabbit-fullpose-v4](../source/images/lucky_wheel_SRC004_rabbit-fullpose-v4) | 可編輯原稿／製作來源：rabbit-fullpose-v4 | 242 |
| 圖片 | [source/images/lucky_wheel_SRC005_reference](../source/images/lucky_wheel_SRC005_reference) | 可編輯原稿／製作來源：reference | 16 |
| 圖片 | [source/images/lucky_wheel_SRC006_title-v4](../source/images/lucky_wheel_SRC006_title-v4) | 可編輯原稿／製作來源：title-v4 | 4 |
| 圖片 | [source/images/lucky_wheel_SRC007_ui-components](../source/images/lucky_wheel_SRC007_ui-components) | 可編輯原稿／製作來源：ui-components | 14 |

## 製作／替換驗收

1. 依本表逐項製作，三語主標不可漏交；同槽位換圖保持檔名、尺寸、透明與定位。
2. 可編輯原稿放 `source/<分類>/`；網頁檔放 `assets/<分類>/`，不可把原稿加入首屏。
3. 圖片維持透明邊緣與主題材質；動畫維持畫布、循環時間、腳底基準與安全邊界；音樂可循環、音效依事件觸發。
4. 共用按鈕與借用的獎項圖示／音效見下表，不複製成另一份。新主題可改 config 槽位為自己的素材。
5. 執行 `python3 scripts/event-assets.py check`、交付檢查及實際手機／桌機流程驗證；更新 JS／CSS 版本碼後發布。

## 跨活動／共用引用

| 槽位 | 所屬素材 |
|---|---|
| `images.soundOn` | `../shared/assets/images/shared_IMG004_icon-sound-on.webp` |
| `images.soundOff` | `../shared/assets/images/shared_IMG003_icon-sound-off.webp` |
| `images.share` | `../shared/assets/images/shared_IMG002_icon-share.webp` |
| `sounds.hover` | `../20261111_survival_spin/assets/sounds/survival_spin_SFX002_hover.mp3` |
| `sounds.click` | `../20261111_survival_spin/assets/sounds/survival_spin_SFX001_click.mp3` |
| `sounds.rewardLose` | `../20261111_survival_spin/assets/sounds/survival_spin_SFX003_reward-lose.mp3` |
| `assetSpecs.share` | `../shared/assets/images/shared_IMG002_icon-share.webp` |
