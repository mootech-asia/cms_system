# 美術交付勾選表（20261111_lucky_wheel）

**提交狀態以這份表為準；是否屬實以 `tools/check_assets.py` 的結果為準。** 規格看 `DESIGN_TASKS.md`，製作步驟看 `GPT_ASSET_BRIEF.md`。

## 打勾規則（GPT 必讀）

1. 檔案**已放到「交付路徑」並 commit** 之後，才能把「提交」欄的 `☐` 改成 `☑`，並在「commit」欄填上 commit hash（前 7 碼）。
2. 打勾前先執行檢查腳本，**所有已打勾的列都必須是 `OK`**：
   ```bash
   python3 event/20261111_lucky_wheel/tools/check_assets.py
   ```
   腳本會實際檢查：檔案存在、不是 mock 佔位圖、像素尺寸、GIF 幀數與循環、填的 commit 裡確實包含這份檔案且之後沒再改過。打了勾但不符會列為 `FAIL`；第一行會印出「已提交且通過檢查 x / 總項數」。
3. 交付路徑中的 `{png,webp,svg}` 代表三選一的副檔名。**換副檔名時要刪掉舊的 `.svg` 佔位檔**（同名多副檔名會被判 FAIL），並一併修改 `assets/js/config.js` 的路徑（第 F 區有一列專門勾這件事）。
4. 「審核」欄由我們填寫（`☐` 待審／`☑` 通過／`✗` 退回＋原因），**GPT 不要改審核欄**。
5. 不要刪除或新增列；有疑問寫在最下方「備註」。

## A. 靜態圖（21）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | A01 | stage-bg | 750×1000 | `assets/img/stage-bg.{png,webp,svg}` | | ☐ |
| ☐ | A02 | stage-floor | 750×140 | `assets/img/stage-floor.{png,webp,svg}` | | ☐ |
| ☐ | A03 | title-en | 690×240 | `assets/img/title-en.{png,webp,svg}` | | ☐ |
| ☐ | A04 | title-ko | 690×240 | `assets/img/title-ko.{png,webp,svg}` | | ☐ |
| ☐ | A05 | title-th | 690×240 | `assets/img/title-th.{png,webp,svg}` | | ☐ |
| ☐ | A06 | spotlight | 260×900 | `assets/img/spotlight.{png,webp,svg}` | | ☐ |
| ☐ | A07 | wheel-frame | 680×680 | `assets/img/wheel-frame.{png,webp,svg}` | | ☐ |
| ☐ | A08 | wheel-gloss | 600×600 | `assets/img/wheel-gloss.{png,webp,svg}` | | ☐ |
| ☐ | A09 | pointer | 120×160 | `assets/img/pointer.{png,webp,svg}` | | ☐ |
| ☐ | A10 | btn-go | 200×200 | `assets/img/btn-go.{png,webp,svg}` | | ☐ |
| ☐ | A11 | modal-bg | 600×760 | `assets/img/modal-bg.{png,webp,svg}` | | ☐ |
| ☐ | A12 | btn-primary | 400×110 | `assets/img/btn-primary.{png,webp,svg}` | | ☐ |
| ☐ | A13 | icon-sound-on | 64×64 | `assets/img/icon-sound-on.{png,webp,svg}` | | ☐ |
| ☐ | A14 | icon-sound-off | 64×64 | `assets/img/icon-sound-off.{png,webp,svg}` | | ☐ |
| ☐ | A15 | icon-cash | 160×160 | `assets/img/icon-cash.{png,webp,svg}` | | ☐ |
| ☐ | A16 | icon-coin | 160×160 | `assets/img/icon-coin.{png,webp,svg}` | | ☐ |
| ☐ | A17 | icon-gift | 160×160 | `assets/img/icon-gift.{png,webp,svg}` | | ☐ |
| ☐ | A18 | icon-spin | 160×160 | `assets/img/icon-spin.{png,webp,svg}` | | ☐ |
| ☐ | A19 | icon-bonus | 160×160 | `assets/img/icon-bonus.{png,webp,svg}` | | ☐ |
| ☐ | A20 | icon-points | 160×160 | `assets/img/icon-points.{png,webp,svg}` | | ☐ |
| ☐ | A21 | icon-thanks | 160×160 | `assets/img/icon-thanks.{png,webp,svg}` | | ☐ |

## B. 色票（1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | B01 | 扇區色 6 組（底色＋文字色）＋分隔線色 | — | `assets/css/event.css`（`--ev-wheel-1`～`6`、`--ev-wheel-N-text`） | | ☐ |

## C. 吉祥物角色設定圖（1，第一階段）

> C01 審核通過（☑）之前，不要開始 D 區。

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | C01 | rabbit-turnaround | 1536×1024 | `reference/rabbit-turnaround.{png,webp}` | | ☐ |

## D. 吉祥物 GIF（5，第二階段）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | D01 | idle-1 | 400×500 gif≥24 | `assets/img/mascot/idle-1.gif` | | ☐ |
| ☐ | D02 | idle-2 | 400×500 gif≥24 | `assets/img/mascot/idle-2.gif` | | ☐ |
| ☐ | D03 | idle-3 | 400×500 gif≥24 | `assets/img/mascot/idle-3.gif` | | ☐ |
| ☐ | D04 | spinning | 400×500 gif≥24 | `assets/img/mascot/spinning.gif` | | ☐ |
| ☐ | D05 | result | 400×500 gif≥24 | `assets/img/mascot/result.gif` | | ☐ |

## E. 吉祥物附件（10）

序列幀與比對圖不會上線，放在 `source/`。

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | E01 | idle-1 PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/idle-1/` | | ☐ |
| ☐ | E02 | idle-2 PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/idle-2/` | | ☐ |
| ☐ | E03 | idle-3 PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/idle-3/` | | ☐ |
| ☐ | E04 | spinning PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/spinning/` | | ☐ |
| ☐ | E05 | result PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/result/` | | ☐ |
| ☐ | E06 | idle-1 關鍵幀 vs 角色設定圖 | — | `source/mascot-compare/idle-1.{png,webp}` | | ☐ |
| ☐ | E07 | idle-2 關鍵幀 vs 角色設定圖 | — | `source/mascot-compare/idle-2.{png,webp}` | | ☐ |
| ☐ | E08 | idle-3 關鍵幀 vs 角色設定圖 | — | `source/mascot-compare/idle-3.{png,webp}` | | ☐ |
| ☐ | E09 | spinning 關鍵幀 vs 角色設定圖 | — | `source/mascot-compare/spinning.{png,webp}` | | ☐ |
| ☐ | E10 | result 關鍵幀 vs 角色設定圖 | — | `source/mascot-compare/result.{png,webp}` | | ☐ |

## F. 程式路徑（1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | F01 | `config.js` 的 images／mascot 路徑改成實際交付的檔名，前台實際載入無破圖 | — | `assets/js/config.js` | | ☐ |

## G. 音效（選配 3）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | G01 | drumroll | 約 5 秒 | `assets/audio/drumroll.mp3` | | ☐ |
| ☐ | G02 | win | 1～2 秒 | `assets/audio/win.mp3` | | ☐ |
| ☐ | G03 | lose | 1 秒內 | `assets/audio/lose.mp3` | | ☐ |

## 備註

（GPT 有疑問或無法照規格交付時寫在這裡，附列號）
