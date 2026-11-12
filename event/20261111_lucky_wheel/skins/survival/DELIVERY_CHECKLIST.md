# 美術交付勾選表：生存遊戲秀皮（survival）

**提交狀態以這份表為準；是否屬實以檢查腳本為準。** 規格看同資料夾 `DESIGN_TASKS.md`，提示詞看 `GPT_ASSET_BRIEF.md`。
交付路徑以本資料夾（`event/20261111_lucky_wheel/skins/survival/`）為基準。

## 打勾規則（GPT 必讀）

1. 檔案放到交付路徑並 commit 後，才把「提交」改成 ☑，「commit」填 commit hash 前 7 碼。
2. 換副檔名時刪掉同名 `.svg` 佔位檔，並改 config 路徑（S44 列）。
3. 打勾前執行，已打勾的列必須全部 OK：
   ```bash
   python3 scripts/check_delivery.py event/20261111_lucky_wheel/skins/survival/DELIVERY_CHECKLIST.md
   ```
4. 「審核」欄由我們填，GPT 不要改；不要刪改列。
5. **禁止元素**（見 DESIGN_TASKS 第一節）出現任一項即退回。

## 製作優先級

P0 主標三語＋舞台＋轉盤＋燈光＋色票 → P1 版面元件 → P2 圖示 → P3 兔比造型與動態（最後）。

## A. 靜態圖（28）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | S01 | title-en | 690×240 | `img/title-en.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S02 | title-ko | 690×240 | `img/title-ko.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S03 | title-th | 690×240 | `img/title-th.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S04 | stage-bg | 750×1000 | `img/stage-bg.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S05 | stage-floor | 750×140 | `img/stage-floor.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S06 | wheel-frame | 680×680 | `img/wheel-frame.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S07 | wheel-stand | 400×600 | `img/wheel-stand.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S08 | pointer | 120×160 | `img/pointer.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S09 | btn-go | 200×200 | `img/btn-go.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S10 | spotlight | 260×900 | `img/spotlight.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S11 | light-pool | 600×220 | `img/light-pool.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S12 | stage-vignette | 750×1000 | `img/stage-vignette.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S13 | bulb-on | 48×48 | `img/bulb-on.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S14 | bulb-off | 48×48 | `img/bulb-off.{png,webp,svg}` | | ☐ | P0 |
| ☐ | S15 | modal-bg | 600×760 | `img/modal-bg.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S16 | btn-primary | 400×110 | `img/btn-primary.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S17 | period-badge | 480×64 | `img/period-badge.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S18 | chances-badge | 360×88 | `img/chances-badge.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S19 | ticker-bar | 690×64 | `img/ticker-bar.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S20 | card-frame | 120×120 | `img/card-frame.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S21 | card-title | 400×72 | `img/card-title.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S22 | info-bg | 750×750 | `img/info-bg.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S23 | footer-deco | 750×160 | `img/footer-deco.{png,webp,svg}` | | ☐ | P1 |
| ☐ | S24 | icon-sound-on | 64×64 | `img/icon-sound-on.{png,webp,svg}` | | ☐ | P2 |
| ☐ | S25 | icon-sound-off | 64×64 | `img/icon-sound-off.{png,webp,svg}` | | ☐ | P2 |
| ☐ | S26 | icon-share | 64×64 | `img/icon-share.{png,webp,svg}` | | ☐ | P2 |
| ☐ | S27 | icon-rotate | 160×160 | `img/icon-rotate.{png,webp,svg}` | | ☐ | P2 |
| ☐ | S28 | share-preview | 1200×630 | `img/share-preview.{png,jpg}` | | ☐ | P1 |

## B. 色票（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | S29 | 扇區色 6 組（底色＋文字色） | — | `skin.css`（`--ev-wheel-1`～`6`、`--ev-wheel-N-text`） | | ☐ | P0 |

## C. 兔比工作人員造型與動態（14）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | S30 | 兔比工作人員造型四視圖 | —（人工） | `source/rabbit-staff-turnaround.{png,webp}` | | ☐ | P3 |
| ☐ | S31 | base-frame（含影子） | 400×500 | `img/mascot/base-frame.png` | | ☐ | P3 |
| ☐ | S32 | idle-1（待機1） | 400×500 gif≥24 | `img/mascot/idle-1.gif` | | ☐ | P3 |
| ☐ | S33 | idle-2（待機2） | 400×500 gif≥24 | `img/mascot/idle-2.gif` | | ☐ | P3 |
| ☐ | S34 | idle-3（待機3） | 400×500 gif≥24 | `img/mascot/idle-3.gif` | | ☐ | P3 |
| ☐ | S35 | spinning（期待） | 400×500 gif≥24 | `img/mascot/spinning.gif` | | ☐ | P3 |
| ☐ | S36 | result（慶祝） | 400×500 gif≥24 | `img/mascot/result.gif` | | ☐ | P3 |
| ☐ | S37 | lose（失望） | 400×500 gif≥24 | `img/mascot/lose.gif` | | ☐ | P3 |
| ☐ | S38 | idle-1 PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/idle-1/` | | ☐ | P3 |
| ☐ | S39 | idle-2 PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/idle-2/` | | ☐ | P3 |
| ☐ | S40 | idle-3 PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/idle-3/` | | ☐ | P3 |
| ☐ | S41 | spinning PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/spinning/` | | ☐ | P3 |
| ☐ | S42 | result PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/result/` | | ☐ | P3 |
| ☐ | S43 | lose PNG 序列幀（RGBA） | 400×500 frames≥24 | `source/mascot-frames/lose/` | | ☐ | P3 |

## D. 程式路徑（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | S44 | `config.js` 的 skins.survival 圖片／吉祥物路徑改成實際交付的檔名，`?skin=survival` 無破圖 | — | `../../assets/js/config.js` | | ☐ | P2 |

## 備註

（GPT 交付說明寫在這裡）
