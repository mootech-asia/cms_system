# 美術交付勾選表：生存遊戲秀皮（survival）

**提交狀態以這份表為準；是否屬實以檢查腳本為準。** 規格看同資料夾 `docs/DESIGN_TASKS.md`，提示詞看 `docs/GPT_ASSET_BRIEF.md`。
交付路徑以本資料夾（`event/20261111_survival_spin/`）為基準。

## 打勾規則（GPT 必讀）

1. 檔案放到交付路徑並 commit 後，才把「提交」改成 ☑，「commit」填 commit hash 前 7 碼。
2. 換副檔名時刪掉同名 `.svg` 佔位檔，並改 config 路徑（S44 列）。
3. 打勾前執行，已打勾的列必須全部 OK：
   ```bash
   python3 scripts/check_delivery.py event/20261111_survival_spin/docs/DELIVERY_CHECKLIST.md
   ```
4. 「審核」欄由我們填，GPT 不要改；不要刪改列。
5. **禁止元素**（見 DESIGN_TASKS 第一節）出現任一項即退回。

## 製作優先級

P0 主標三語＋舞台＋轉盤＋燈光＋色票 → P1 版面元件 → P2 圖示 → P3 兔比造型與動態（最後）。

## A. 靜態圖（29）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | S01 | title-en | 690×240 | `assets/img/title-en.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S02 | title-ko | 690×240 | `assets/img/title-ko.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S03 | title-th | 690×240 | `assets/img/title-th.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S04 | stage-bg | 750×1000 | `assets/img/stage-bg.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S05 | stage-floor | 750×140 | `assets/img/stage-floor.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S06 | wheel-frame | 680×680 | `assets/img/wheel-frame.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S07 | wheel-stand | 400×600 | `assets/img/wheel-stand.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S08 | pointer | 120×160 | `assets/img/pointer.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S09 | btn-go | 200×200 | `assets/img/btn-go.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S10 | spotlight | 260×900 | `assets/img/spotlight.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S11 | light-pool | 600×220 | `assets/img/light-pool.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S12 | stage-vignette | 750×1000 | `assets/img/stage-vignette.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S13 | bulb-on | 48×48 | `assets/img/bulb-on.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S14 | bulb-off | 48×48 | `assets/img/bulb-off.{png,webp,svg}` | c91aeeb | ☐ | P0 |
| ☑ | S15 | modal-bg | 600×760 | `assets/img/modal-bg.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S16 | btn-primary | 400×110 | `assets/img/btn-primary.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S17 | period-badge | 480×64 | `assets/img/period-badge.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S18 | chances-badge | 360×88 | `assets/img/chances-badge.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S19 | ticker-bar | 690×64 | `assets/img/ticker-bar.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S20 | card-frame | 120×120 | `assets/img/card-frame.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S21 | card-title | 400×72 | `assets/img/card-title.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S22 | info-bg | 750×750 | `assets/img/info-bg.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S23 | footer-deco | 750×160 | `assets/img/footer-deco.{png,webp,svg}` | c91aeeb | ☐ | P1 |
| ☑ | S24 | icon-sound-on | 64×64 | `assets/img/icon-sound-on.{png,webp,svg}` | c91aeeb | ☐ | P2 |
| ☑ | S25 | icon-sound-off | 64×64 | `assets/img/icon-sound-off.{png,webp,svg}` | c91aeeb | ☐ | P2 |
| ☑ | S26 | icon-share | 64×64 | `assets/img/icon-share.{png,webp,svg}` | c91aeeb | ☐ | P2 |
| ☑ | S27 | icon-rotate | 160×160 | `assets/img/icon-rotate.{png,webp,svg}` | c91aeeb | ☐ | P2 |
| ☐ | S45 | icon-tap | 160×160 | `alternatives/assets/img/icon-tap.{png,webp,svg}` | | ☐ | P2 |
| ☑ | S28 | share-preview | 1200×630 | `assets/img/share-preview.{png,jpg}` | c91aeeb | ☐ | P1 |

## B. 色票（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | S29 | 扇區色 6 組（底色＋文字色） | — | `assets/css/skin.css`（`--ev-wheel-1`～`6`、`--ev-wheel-N-text`） | c91aeeb | ☐ | P0 |

## C. 兔比工作人員造型與動態（14）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | S30 | 兔比工作人員造型四視圖 | —（人工） | `source/rabbit-staff-turnaround.{png,webp}` | | ☐ | P3 |
| ☐ | S31 | base-frame（含影子） | 400×500 | `alternatives/assets/img/mascot/base-frame.png` | | ☐ | P3 |
| ☐ | S32 | idle-1（待機1） | 400×500 gif≥24 | `assets/img/mascot/idle-1.gif` | | ☐ | P3 |
| ☐ | S33 | idle-2（待機2） | 400×500 gif≥24 | `assets/img/mascot/idle-2.gif` | | ☐ | P3 |
| ☐ | S34 | idle-3（待機3） | 400×500 gif≥24 | `assets/img/mascot/idle-3.gif` | | ☐ | P3 |
| ☐ | S35 | spinning（期待） | 400×500 gif≥24 | `assets/img/mascot/spinning.gif` | | ☐ | P3 |
| ☐ | S36 | result（慶祝） | 400×500 gif≥24 | `assets/img/mascot/result.gif` | | ☐ | P3 |
| ☐ | S37 | lose（失望） | 400×500 gif≥24 | `assets/img/mascot/lose.gif` | | ☐ | P3 |
| ☐ | S38 | idle-1 PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/idle-1/` | | ☐ | P3 |
| ☐ | S39 | idle-2 PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/idle-2/` | | ☐ | P3 |
| ☐ | S40 | idle-3 PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/idle-3/` | | ☐ | P3 |
| ☐ | S41 | spinning PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/spinning/` | | ☐ | P3 |
| ☐ | S42 | result PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/result/` | | ☐ | P3 |
| ☐ | S43 | lose PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/lose/` | | ☐ | P3 |

## D. 程式路徑（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | S44 | `assets/js/config.js` 的 skins.survival 圖片／吉祥物路徑改成實際交付的檔名，新活動入口無破圖 | — | `assets/js/config.js` | c91aeeb | ☐ | P2 |

## 備註

（GPT 交付說明寫在這裡）

- 2026-11-13（套用）：`alternatives/source/guard-review/` 六段已轉成動態 WebP（quality 80，由 288 張 RGBA 序列幀轉出）放到 `alternatives/assets/img/mascot/`，config `skins.survival.mascot` 指向它們，正式遊戲角色已換成面具人物；人物設定圖 V2 定稿、動畫重做後再覆蓋同檔名。S30–S44 仍以舊兔比規格列出，未勾選。
- 2026-11-13：依最新「先做魷魚遊戲桃紅色面具人物的動態」指示，六段人形面具人物動態研究已提交 `f3da8b0`，預覽在 `alternatives/source/guard-review/`，原圖與 288 張 RGBA 幀在 `alternatives/source/guard-motion/`。本批不沿用舊兔比角色設定；尚未替換正式遊戲角色，因此 S30–S44 與審核欄維持原狀。逐幀裁切與播放驗證見 `alternatives/source/guard-review/REVIEW.md`。

- 2026-11-12：P0 14 張正式圖與色票已提交（560465b），方向加強粉彩樓梯迷宮與桃紅／墨綠空間對比。預覽與測試位於 `alternatives/source/review/`。P1／P2 元件及 P3 工作服兔比尚未交付，現用兔比仍為佔位。S44 待其餘素材交齊後確認；審核欄未改。

- 2026-11-12：S15–S27 已提交 be67d07：9項介面面板／裝飾與4項控制圖示。預覽 `alternatives/source/ui-review/`，彈窗內部與卡片中心不透明、底紋四邊相接。分享圖 S28 等工作服兔比定稿後製作；S44 等角色路徑交齊再確認。審核欄未改。
- 2026-11-12：效能優化（6e95855）：S01–S12 由無損 WebP 重新壓成有損（主標 q92、其餘 q86，透明度預乘後 99% 像素差 ≤ 22），內容與尺寸不變；stage-bg 由 665KB 降到 48KB。`tools/build_p0.py` 已同步改為有損輸出。

- 2026-11-12：效能優化（6bf12e1）：P1／P2 介面圖由無損 WebP 改有損（面板／底紋／圖示 q88；細框標籤條 q95、透明度無損），內容與尺寸不變；`tools/build_ui.py` 同步改為有損輸出。

- S28：提交專屬橫式社群推廣圖 2e31750。主標、桃紅轉盤、面具人物與階梯大廳；1200×630 JPG，原圖保存在 source/social-promo/。審核欄保留。後續已透過 index.html 獨立活動入口引用此圖。

- 活動拆分：已提交素材與 config 的路徑遷移至本活動資料夾，對應 commit 統一更新為 8854f62；原美術提交仍可從 git 歷史追溯。S44 已驗證新入口與八個網站內嵌入口，人工審核欄不變。

2026-11-18：此淺層工作副本缺少部分早期 commit；這些已提交素材的檢查指標改指向包含相同檔案的 aaa6c24 快照，不代表原稿於本次新製。

## 主題 loading（20261118-loading1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | L01 | 主題 loading 器物 | 480×480 | `assets/img/loading-emblem.webp` | c91aeeb | ☐ | P1 |
| ☑ | L02 | Loading 原稿 | （人工） | `source/loading/emblem-original.png` | c91aeeb | ☐ | P1 |
