# shared 素材製作與用途清單

> 本表由 `python3 scripts/event-assets.py catalog` 產生；資料來源為 `event/ASSET_MANIFEST.json`。編號固定，新增素材接續編號，不重排既有編號。

檔名規則：`活動名稱_類別編號_用途描述.副檔名`。表內尺寸是目前實際交付尺寸；未標示可變更前請維持比例、透明區與錨點。按鈕、日期、次數、獎品文字保留程式疊字，活動主標分 en／ko／th 製作。

## 正式交付素材

### 圖片 — `assets/images/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| IMG001 | [shared_IMG001_arrow-frame.webp](../assets/images/shared_IMG001_arrow-frame.webp) | 共用左右切換按鈕底框 | 128×128 | 保留 alpha · webp | `20261118_blind_box:images.btnArrow`、`20261118_blind_box:assetSpecs.btnArrow`、`20261118_card_pack:images.btnArrow`、`20261118_card_pack:assetSpecs.btnArrow` |
| IMG002 | [shared_IMG002_icon-share.webp](../assets/images/shared_IMG002_icon-share.webp) | 分享按鈕圖 | 64×64 | 保留 alpha · webp | `20261111_lucky_wheel:images.share`、`20261111_lucky_wheel:assetSpecs.share`、`20261111_survival_spin:skins.survival.images.share`、`20261111_survival_spin:assetSpecs.share`、`20261118_blind_box:images.share`、`20261118_blind_box:assetSpecs.share`、`20261118_card_pack:images.share`、`20261118_card_pack:assetSpecs.share` |
| IMG003 | [shared_IMG003_icon-sound-off.webp](../assets/images/shared_IMG003_icon-sound-off.webp) | 音效關閉按鈕圖 | 64×64 | 保留 alpha · webp | `20261111_lucky_wheel:images.soundOff`、`20261111_survival_spin:skins.survival.images.soundOff`、`20261118_blind_box:images.soundOff`、`20261118_card_pack:images.soundOff` |
| IMG004 | [shared_IMG004_icon-sound-on.webp](../assets/images/shared_IMG004_icon-sound-on.webp) | 音效開啟按鈕圖 | 64×64 | 保留 alpha · webp | `20261111_lucky_wheel:images.soundOn`、`20261111_survival_spin:skins.survival.images.soundOn`、`20261118_blind_box:images.soundOn`、`20261118_card_pack:images.soundOn` |
| IMG006 | [shared_IMG006_status-badges.webp](../assets/images/shared_IMG006_status-badges.webp) | 卡包／寶箱耗盡狀態徽章 | 1536×1024 | 保留 alpha · webp | `20261118_blind_box:images.statusBadges` |

### 背景音樂 — `assets/music/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|

目前採程式合成／未配置背景曲；不建立假的音檔。

### 音效 — `assets/sounds/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|
| SFX005 | [shared_SFX005_click01.wav](../assets/sounds/shared_SFX005_click01.wav) | 批次開啟倒數音效 | 0.21 秒 | 音訊依音量配置；不得削波 · wav | `20261118_blind_box:sounds.count`、`20261118_card_pack:sounds.count` |

### 視覺特效 — `assets/effects/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|

此活動目前未使用此類素材；新主題有需要時新增正式槽位。

### 3D 物件與貼圖 — `assets/3d/`

| 編號 | 檔案 | 用途 | 尺寸／時間 | 透明／格式 | 引用槽位 |
|---|---|---|---|---|---|

此活動目前未使用此類素材；新主題有需要時新增正式槽位。

## 程式生成的動態／3D 物件

以下不是遺漏的模型或影片檔；圖檔控制視覺材質，程式控制幾何與動態。換造型、UV 或骨架時需工程配合。

| 編號 | 程式來源 | 用途 |
|---|---|---|

## 製作原稿

原稿與正式交付分離；序列幀／分層檔內部名稱保留，外層套用活動前綴與來源編號，避免破壞關鍵幀對應。字型授權與角色設定說明隨原稿保留。

| 分類 | 原稿包 | 用途 | 檔案數 |
|---|---|---|---|
| 圖片 | [source/images/shared_SRC001_arrow-frame-original.png](../source/images/shared_SRC001_arrow-frame-original.png) | 共用方向按鈕底框可編輯原稿 | 1 |

## 製作／替換驗收

1. 依本表逐項製作，三語主標不可漏交；同槽位換圖保持檔名、尺寸、透明與定位。
2. 可編輯原稿放 `source/<分類>/`；網頁檔放 `assets/<分類>/`，不可把原稿加入首屏。
3. 圖片維持透明邊緣與主題材質；動畫維持畫布、循環時間、腳底基準與安全邊界；音樂可循環、音效依事件觸發。
4. 共用按鈕與借用的獎項圖示／音效見下表，不複製成另一份。新主題可改 config 槽位為自己的素材。
5. 執行 `python3 scripts/event-assets.py check`、交付檢查及實際手機／桌機流程驗證；更新 JS／CSS 版本碼後發布。

## 跨活動／共用引用

| 槽位 | 所屬素材 |
|---|---|
