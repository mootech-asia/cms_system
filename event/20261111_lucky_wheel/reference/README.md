# 吉祥物參考圖（熊北 Mootech Bear）

製作兔子吉祥物時必須比對的角色設計參考。來源：官網 repo `mootech-asia/mootech_website` 的
`brand/moo-bear/`（commit `e725c45`；原資料夾名 `熊北-吉祥物`，已改為英文檔名）。該資料夾 README 寫明「三視圖是生圖、設計、外包時的唯一依據」。

| 檔案 | 來源（官網 repo 內） | 用途 |
|---|---|---|
| `bear-view-1-front.png` | `01_character/views/01-front.png`（原檔） | 正面：比例、配件、logo 位置 |
| `bear-view-2-three-quarter.png` | `01_character/views/02-three-quarter.png`（原檔） | 四分之三側：麥克風臂方向、背心厚度 |
| `bear-view-3-side.png` | `01_character/views/03-side.png`（原檔） | 側面：體型輪廓、尾巴 |
| `bear-view-4-back.png` | `01_character/views/04-back.png`（原檔） | 背面：內搭帽子垂在背後、背心無標誌 |
| `bear-character-sheet.webp` | `01_character/character-sheet.webp`（原檔） | 角色設定總表：兔比設定圖的版面參考（五視圖、表情、細節、色票、比例） |
| `bear-pose-intro.webp` | `02_poses/p01-intro.png`（縮為 1024px WebP） | 全身姿勢的動作幅度與渲染質感 |
| `bear-sticker-wave.webp` | `03_stickers/s06-wave.png`（縮為 1024px WebP） | 待機「揮手」參考 |
| `bear-sticker-wink-thumbsup.webp` | `03_stickers/s07-wink-thumbsup.png`（縮為 1024px WebP） | 發表結果「眨眼比讚」參考 |
| `bear-sticker-think.webp` | `03_stickers/s08-thinking.png`（縮為 1024px WebP） | 待機「思考」參考 |

## 品牌 logo（背心左胸標誌必須用這個）

來源：官網 repo `assets/brand/`。圖形是「不可能 M」立體線框，**藍綠 → 黃綠漸層**（約 `#00A0E0` → `#B0C040`），字標為 MOOTECH。**不是橘色 M。**

| 檔案 | 來源 | 用途 |
|---|---|---|
| `mootech-logo-mark.png` | `favicon.png` | 只有圖形（64×64），背心刺繡用的圖形參考 |
| `mootech-logo-horizontal.png` | `logo-h.png` | 橫式（圖形＋字標），淺色背景 |
| `mootech-logo-horizontal-white.png` | `logo-h-white.png` | 橫式，字標反白，深色背景（深藍背心上用這種配色） |
| `mootech-logo-stacked.png` | `logo-stacked.png` | 直式 |

官網沒有向量檔（SVG／AI），以上皆為 PNG。

## 公開連結（給 GPT／外部工具直接讀取）

正式站：`https://mootech-asia.github.io/cms_system/event/20261111_lucky_wheel/reference/<檔名>`，例如
`https://mootech-asia.github.io/cms_system/event/20261111_lucky_wheel/reference/bear-view-1-front.png`。

完整高解析原檔、其餘姿勢與貼圖、官方生成提示詞（`01_character/prompts.md`）請到官網 repo 取用。
角色設定與禁止事項的重點已轉寫進 `../GPT_ASSET_BRIEF.md` 第 1 節。
