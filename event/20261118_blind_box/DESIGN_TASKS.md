# 20261118_blind_box 美術製作需求單（拆盲盒）

> 版本：2026-11-18 第 1 版（Codex 3D 原型優化後，第一次開需求）

目前頁面是可操作的 mock up：六個盲盒環形排列（左右拖曳／箭頭挑選）→ 選定後橫滑或按「Open the box」→ 盒蓋彈開 → 翻開獎品卡（後台可設每盒 1 個以上；多個時逐張翻開並顯示總覽）。
次數、規則、紀錄、跑馬燈、分享、音效（合成）、三語系都已運作；獎項與規則由我們的後台提供，目前是假資料。
**所有圖片都是佔位圖。美術依本單交付到 `assets/img/`（同檔名覆蓋，或改 `assets/js/config.js` 路徑），不需要改程式。**
畫面同一個位置連點三下（每下間隔 ≤0.5 秒，點在按鈕上不算）叫出內部面板，打開「Asset labels」會在每個位置顯示對應檔名與尺寸。

- 前台：`index.html`；提交狀態：`DELIVERY_CHECKLIST.md`（`python3 scripts/check_delivery.py event/20261118_blind_box/DELIVERY_CHECKLIST.md` 核對）
- 用 GPT 製作：`GPT_ASSET_BRIEF.md`；後台資料格式：`../shared/unbox-3d/js/store.js` 開頭註解
- 換主題：同一套程式換一套圖＋色票，見第六節

---

## 製作優先級（照順序做，先快速掌握整體設計質感）

| 級別 | 定義 | 本活動項目 |
|---|---|---|
| **P0 全局視覺** | 面積大、決定第一眼 | `title-en`、`title-ko`、`title-th`、`stage-bg`、`btn-primary`、`box-front`、`box-side`、`box-lid`、`box-lid-side`、色票 `theme.css` → **全部到位後先整頁截圖確認方向** |
| **P1 版面元件** | 主要元件與揭曉 | `reward-back`、`reward-frame-common`、`reward-frame-rare`、`reward-frame-epic`、`reward-frame-legendary`、`reveal-rays`、`period-badge`、`chances-badge`、`ticker-bar`、`card-frame`、`card-title`、`info-bg`、`share-preview` |
| **P2 細節** | 小圖示與裝飾 | `btn-arrow`、`icon-sound-on`、`icon-sound-off`、`icon-share`、`icon-rotate`、`icon-tap`、`footer-deco`、config 路徑 |
| **P3 精修** | 需要時間打磨 | 音效 ×6、主標可編輯原始檔、3D 材質微調（吉祥物暫緩） |

## 一、美術方向

| 項目 | 方向 |
|---|---|
| 預設主題 | 珍珠薰衣草「神秘收藏盒」：白、珍珠、薰衣草、薄荷、蜜桃的柔和配色，乾淨、明亮、潮玩精品感（延續 Codex 原型配色）。 換主題時只換圖＋色票（第六節）。 |
| 空間 | **有角度、有透視的 3D 展示空間**：背牆＋往前延伸的地板（透視線、縱深），光源統一「前上方偏左」，地板中央有柔和光圈；六個包裝浮在光圈上方緩慢擺動，接地陰影由程式畫，**素材不畫地面陰影**。 |
| 3D 包裝 | 盲盒是程式做的 3D 立方體＋盒蓋：正面＝`box-front`、其他三面＝`box-side`、盒蓋頂＝`box-lid`、盒蓋四邊＝`box-lid-side`。 立體、打光、透視都由程式負責，**交付的是「攤平的平面貼圖」**，不要畫成立體照片。 |
| 揭曉 | 深色遮罩上，一張獎品卡從卡背翻到正面，後方放射光＋依稀有度變色的光暈；最高稀有度要明顯更華麗。 |
| 版面（第一屏） | 主標 → 活動期間 → 3D 選擇區（左右箭頭；**直接點選任意一包就是選擇**，一次只能選一包撕開）→ 剩餘次數 → 點選提示（選定後變成主按鈕）→ 提示文字 → 跑馬燈。手機 360×640 起第一屏就看得到主按鈕；只用 H5 寬度（480px 置中）。 |
| 吉祥物 | **暫緩**：目前頁面不放吉祥物（2026-11-18 決定先移除）。第四節保留規格，之後要加回時再開工，現在不要做。 |

### 語系規則（嚴格）

- 前台語系：英文／韓文／泰文，預設英文。**所有交付圖檔不得出現中文字。**
- 需要文字的圖只有活動主標（每個語系一張）；按鈕、標籤、彈窗、包裝上一律**不放文字**，由程式疊字。

## 二、交付規格（共通）

- 設計稿基準寬度 750px（手機 2 倍圖）；照下表「外框尺寸」輸出，比例不同會變形或跑版。
- 除背景與 3D 貼圖外全部去背。PNG／WebP／SVG 皆可（分享預覽只能 PNG／JPG）。單張建議 ≤300KB，背景 ≤500KB。
- 3D 貼圖（包裝各面）**滿版不透明**、不留白邊、不畫陰影與透視。
- 換副檔名時：刪掉同名 `.svg` 佔位檔，改 `assets/js/config.js` 的路徑；`stage-bg` 另外改 `index.html` 的 `<link rel="preload">`。

### 素材分類規則（嚴格，放錯資料夾檢查腳本會判定找不到檔案）

所有路徑以活動資料夾 `event/20261118_blind_box/` 為基準。**一個圖片槽只對應一個檔案**；同名不同副檔名只能留一個（換格式時刪掉舊的 `.svg` 佔位檔）。

| 分類資料夾 | 放什麼 | 本活動檔案 |
|---|---|---|
| `assets/img/scene/` | 場景與大面積底圖：舞台背景、下半部底紋、頁尾裝飾 | `stage-bg`、`info-bg`、`footer-deco` |
| `assets/img/title/` | 活動主標（每個語系一張） | `title-en`、`title-ko`、`title-th` |
| `assets/img/3d/` | 貼在 3D 包裝上的平面貼圖（滿版、不透明、無陰影無透視） | `box-front`、`box-side`、`box-lid`、`box-lid-side` |
| `assets/img/reveal/` | 揭曉畫面：放射光、獎品卡背、四種稀有度外框 | `reward-back`、`reward-frame-common`、`reward-frame-rare`、`reward-frame-epic`、`reward-frame-legendary`、`reveal-rays` |
| `assets/img/ui/` | 可重複使用的介面元件：按鈕、緞帶、徽章、跑馬燈條、卡片框 | `btn-primary`、`period-badge`、`chances-badge`、`ticker-bar`、`card-frame`、`card-title`、`btn-arrow` |
| `assets/img/icon/` | 小圖示（64×64／160×160） | `icon-sound-on`、`icon-sound-off`、`icon-share`、`icon-rotate`、`icon-tap` |
| `assets/img/mascot/` | 吉祥物網頁用動態（GIF 預覽、轉好的 WebP）與 base-frame.png | `idle`、`anticipate`、`celebrate`、`lose`、`base-frame` |
| `assets/img/share/` | 社群分享預覽圖（PNG／JPG） | `share-preview` |
| `assets/audio/` | 音效 mp3 | `click`、`move`、`tear`、`flip`、`reveal`、`reward` |
| `source/` | 原始檔與序列幀（不會被網頁載入）：`source/title/`（主標 PSD／AI／Figma 連結說明）、`source/mascot/<狀態>/`（PNG 序列幀） | — |

- **檔名**：英文小寫＋連字號，照下表檔名，不加日期、版本號、中文或空白（`stage-bg.webp` ✅、`舞台背景_v2.png` ❌）。改版直接覆蓋同檔名，舊版靠 git 歷史回溯。
- **格式**：照片質感或大面積漸層用 WebP／PNG；純向量可用 SVG；分享預覽只能 PNG／JPG；吉祥物動態交 GIF＋PNG 序列幀。
- **換主題（皮）**：新皮放在 `skins/<皮名>/img/`，底下用**同一套分類資料夾**（例：`skins/xmas/img/3d/pack-front-1.webp`），只放跟預設不同的圖。
- **不要放進 assets 的東西**：參考圖、比對圖、草稿、截圖 → 放 `reference/` 或直接附在對話，不進 `assets/`。

## 三、靜態圖清單

| 檔名 | 外框尺寸 (px) | 優先 | 內容 / 注意事項 |
|---|---|---|---|
| `title-en` | 690×240 | P0 | 活動主標（英文），規格見「主視覺文字」。 |
| `title-ko` | 690×240 | P0 | 活動主標（韓文）。 |
| `title-th` | 690×240 | P0 | 活動主標（泰文）。 |
| `stage-bg` | 750×1000 | P0 | **有透視的 3D 展示空間**（不是正面平面背景）：上方約 0–520 為背牆／展示櫃牆面（主標、活動期間在這區，保持乾淨明亮），下方 520–1000 為往前延伸、有透視線的地板，地板中央約 y 620–780 打一圈柔和光圈（包裝浮在這裡）。程式「貼齊底部、等比填滿」，畫面較高時會裁掉上方與左右，重要元素不要貼邊。不畫包裝、不畫人物。 |
| `box-front` | 512×512 | P0 | **盒子正面**。正方形滿版不透明（貼在 3D 立方體正面）。主圖可用大問號、剪影、包裝紋樣；**不放任何文字**。不畫陰影、不畫透視。 |
| `box-side` | 512×512 | P0 | **盒子側面／背面**（左右與後面共用）。重複紋樣或小問號，程式會乘上 `--ev-3d-item-N` 色票讓六盒顏色不同，**請用淺灰白為主**，顏色交給色票。 |
| `box-lid` | 512×512 | P0 | **盒蓋頂面**。從斜上方看得到，開蓋時會飛起。可放徽記或封印圖形，不放文字。 |
| `box-lid-side` | 512×80 | P0 | **盒蓋側邊**（四邊共用）。細長條紋或緞帶，會乘上色票，請用淺色。 |
| `btn-primary` | 400×110 | P0 | **主按鈕底圖**（Tear it open／Open the box／Reveal／Collect 都用這張；挑選階段不顯示按鈕，改顯示點選提示），膠囊形，中間留給白字。**不畫文字**。停用時程式自動降透明度、次數用完自動轉灰階。 |
| `reward-back` | 600×900 | P1 | **獎品卡背面**：揭曉前看到的卡背，2:3 直式，可做圓角（圓角外透明）。卡背要「讓人想翻開」：中央徽記＋光澤。不放文字。 |
| `reward-frame-common` | 600×900 | P1 | **獎品卡外框（普通）**：疊在卡片正面最上層，**中間必須透明**（下方是程式畫的淺色卡面、獎品圖示 y 160–420、稀有度標籤與名稱 y 640–820）。四個稀有度同構圖、不同材質：普通＝銀灰。 |
| `reward-frame-rare` | 600×900 | P1 | 稀有＝藍色金屬＋少量光點（色相參考 `--ev-rarity-rare`）。 |
| `reward-frame-epic` | 600×900 | P1 | 超稀有＝紫色全息＋光芒（`--ev-rarity-epic`）。 |
| `reward-frame-legendary` | 600×900 | P1 | 最高級（卡包：Legendary／盲盒：Secret 隱藏款）＝金色＋強烈光芒、角飾（`--ev-rarity-legendary`）。 |
| `reveal-rays` | 750×750 | P1 | **揭曉放射光**：卡片後方緩慢旋轉的放射光束，白色半透明、中心亮、往外漸透明，**正方形且中心對稱**（會旋轉）。顏色由程式另疊稀有度光暈，請做白色。 |
| `period-badge` | 480×64 | P1 | 活動期間緞帶，中間約 400×44 淺色放字（程式疊「Event period: …」）。 |
| `chances-badge` | 360×88 | P1 | 剩餘次數牌，中間淺色放字（程式疊「Packs left 5」等）。 |
| `ticker-bar` | 690×64 | P1 | 中獎跑馬燈底條：左側約 150px 標籤區（程式疊白字「Winners」），右側滾動區（白字），請用深色或半透明深底。 |
| `card-frame` | 120×120 | P1 | 下半部規則／紀錄卡片外框，**九宮格**（四角各 40px 不變形，邊與中心會拉伸，不要放會變形的圖案）。中心為淺色卡面。 |
| `card-title` | 400×72 | P1 | 卡片標題緞帶，程式疊白字（Event Rules／My Prizes）。 |
| `info-bg` | 750×750 | P1 | 下半部底紋，可無縫拼接（程式以 375px 寬重複）。淡雅，不干擾文字。 |
| `share-preview` | 1200×630 | P1 | **分享預覽圖（og:image，PNG 或 JPG，不可 SVG）**：英文主標＋包裝主視覺，重要內容在中間 1100×580 內。 |
| `btn-arrow` | 96×96 | P2 | 挑選箭頭（**畫朝右**，左邊那顆程式鏡像），圓形。 |
| `icon-sound-on` | 64×64 | P2 | 音效開。 |
| `icon-sound-off` | 64×64 | P2 | 音效關。 |
| `icon-share` | 64×64 | P2 | 分享，與音效同一套風格。 |
| `icon-rotate` | 160×160 | P2 | 「請轉直向」提示圖示（手機直立＋旋轉箭頭，淺色線條，放在深色底上）。 |
| `icon-tap` | 160×160 | P2 | **點選提示手勢**：挑選階段主按鈕位置改成提示框「Tap any pack／box to choose it」，左邊放這個手勢圖示（約 36px 顯示，程式做點按動畫）。食指朝下點擊的手，白色或奶油色＋深色描邊，可加一圈點擊波紋；去背、不放文字。 |
| `footer-deco` | 750×160 | P2 | 頁尾收尾裝飾，不放文字。 |

### 主視覺文字（`title-en` / `title-ko` / `title-th`）

- 文案：英文 `BLIND BOX`、韓文 `랜덤박스`、泰文 `กล่องสุ่ม`（確定文案後再出圖；有修改請先跟我們確認）。
- **客製 Logo 字**：字形、立體感、材質要融入活動主題元素（卡包：卡片、封條、全息光澤；盲盒：盒子、緞帶、問號），不是系統字打在底圖上。
- 690×240 去背；手機上顯示約 345px 寬，最細筆畫縮小後仍要清楚。泰文上下標（聲調、母音符號）上下各留 ≥24px，不可被裁。
- 三語各自設計字形，不是同一張換字；另交可編輯原始檔（PSD／AI／Figma 連結）。

### 色票（`assets/css/theme.css`，P0）

交付主視覺時一起給色票，填進 theme.css：
- `--ev-color-*`：頁面底色、文字、主色（按鈕）、強調色（跑馬燈標籤、loading 條）。
- `--ev-3d-item-1`～`6`：六個包裝的側邊／封條／盒蓋色（相鄰要能分辨）；`--ev-3d-accent` 補光色；`--ev-3d-shadow` 接地陰影色。
- `--ev-rarity-common` / `rare` / `epic` / `legendary`：稀有度標籤與揭曉光暈。

## 四、吉祥物（暫緩：目前頁面不放，先不要做）

- 角色：**兔比 Moo Rabbit**。形象一律以品牌包為準：`brand/moo-rabbit/`（cms_system 事業部品牌包）；現有動態參考 `event/20261111_lucky_wheel/assets/img/mascot/`。目前暫借轉盤活動的兔比動態（待機／轉動／中獎／未中獎）。
- 位置：站在環形**正中央（圓心）**的地板上，六個盲盒繞著它轉。靜止時前排盲盒擋住角色的身體、只露出頭與肩膀；轉動中會從盲盒之間露出全身。所以**頭部與臉的表情要最清楚**，全身動作也要完整（轉動時看得到）。程式依 3D 投影擺放角色，不會擋到左右箭頭與主按鈕。
- **`base-frame`（站姿）同時是 3D 遮擋剪影**：程式用它的透明度決定「後排包裝被擋住的範圍」，所以其他動作的輪廓不要離站姿太遠（手可以舉高，但身體不要大幅位移）。
- 畫布 **400×500**，角色寬約畫布 80%，腳底固定在離下緣約 12px 的基準線；**鏡頭固定**，角色不可忽大忽小（逐幀外框寬度變化 ≤10%）。
- 影子畫在素材裡（腳底接觸影＋往右後方的柔和投影），程式不加影子。任何一幀都不可貼到畫布邊緣（四邊 ≥8px）。
- 每段 **48 幀、24fps、共 2000ms**，無縫循環；**所有段的第一幀＝最後一幀＝同一張 `base-frame.png`**，程式在一輪結束時切換動作才不會跳。
- 主交付：每段一個 RGBA PNG 序列幀資料夾（`source/mascot/<狀態>/0001.png`…，保留半透明影子）＋一個 GIF 預覽（`assets/img/mascot/<狀態>.gif`）；網頁用的動態 WebP 由我們轉。

| 狀態 | 用途 | 交付 |
|---|---|---|
| `idle` | 待機（挑選中，循環） | `assets/img/mascot/idle.gif`＋`source/mascot/idle/` |
| `anticipate` | 期待（已選定、撕封條／開蓋中，緊張搓手、探頭） | `assets/img/mascot/anticipate.gif`＋`source/mascot/anticipate/` |
| `celebrate` | 慶祝（開到稀有以上；關閉揭曉後演兩輪） | `assets/img/mascot/celebrate.gif`＋`source/mascot/celebrate/` |
| `lose` | 小失望（只開到普通，仍然可愛、不沮喪） | `assets/img/mascot/lose.gif`＋`source/mascot/lose/` |
| `base-frame` | 所有動態共用的第一幀／最後一幀（站姿） | `assets/img/mascot/base-frame.png` |

驗收：放大檢查背心字樣拼字與 MOOTECH logo（藍綠→黃綠漸層的「不可能 M」，不是橘色 M）；四段動作都要一眼看得出情緒；在頁面上截圖確認只露出上半身時仍然可辨識。

## 五、音效（選配，P3；未交付時程式用合成音）

| 名稱 | 用途 | 交付路徑 |
|---|---|---|
| `click` | 按鈕（≤0.2 秒） | `assets/audio/click.mp3`，再把路徑填進 config `sounds.click` |
| `move` | 切換選項（≤0.15 秒） | `assets/audio/move.mp3`，再把路徑填進 config `sounds.move` |
| `tear` | 撕封條／開蓋（約 0.5 秒） | `assets/audio/tear.mp3`，再把路徑填進 config `sounds.tear` |
| `flip` | 翻卡（≤0.25 秒） | `assets/audio/flip.mp3`，再把路徑填進 config `sounds.flip` |
| `reveal` | 揭曉提示音（約 0.6 秒，程式依稀有度提高音高） | `assets/audio/reveal.mp3`，再把路徑填進 config `sounds.reveal` |
| `reward` | 全部揭曉（約 1 秒） | `assets/audio/reward.mp3`，再把路徑填進 config `sounds.reward` |

## 六、不屬於美術的部分（由後台提供，請勿做成圖）

- 獎項名稱、圖示、稀有度、機率、每次開出幾個（`perOpen`）、可開次數、活動期間、規則、中獎名單。
- 獎項圖示由後台上傳（mock 暫借轉盤活動的 `icon-*.svg`）；如需一套本活動專用的獎項圖示庫，另開需求。

## 七、換主題（之後的活動直接換圖）

1. 只換圖：同檔名覆蓋 `assets/img/`。
2. 保留原版、另做一套：建 `skins/<名稱>/`（`skin.css` 只覆寫色票、`img/` 只放不同的圖），在 config `skins` 登記，網址 `?skin=<名稱>` 預覽。
   新皮照本單第三節的檔名與尺寸交付即可，勾選表另開一份在皮資料夾。
3. 新主題同樣要做：主標三語、背景、包裝貼圖、色票（P0）→ 揭曉與元件（P1）→ 圖示（P2）。

## 八、上線前（工程，非美術）

- 拿掉內部面板與換圖標籤；串接後台內容與後端開獎（`window.EVENT_CONTENT`／`window.EVENT_RESOLVE`）；次數改由後台回傳。
