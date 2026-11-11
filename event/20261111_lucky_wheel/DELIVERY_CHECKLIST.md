# 美術交付勾選表（20261111_lucky_wheel）

**提交狀態以這份表為準；是否屬實以 `scripts/check_delivery.py`（repo 根目錄） 的結果為準。** 規格看 `DESIGN_TASKS.md`，製作步驟看 `GPT_ASSET_BRIEF.md`。

## 打勾規則（GPT 必讀）

1. 檔案**已放到「交付路徑」並 commit** 之後，才能把「提交」欄的 `☐` 改成 `☑`，並在「commit」欄填上 commit hash（前 7 碼）。
2. 打勾前先執行檢查腳本，**所有已打勾的列都必須是 `OK`**：
   ```bash
   python3 scripts/check_delivery.py event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md
   ```
   腳本會實際檢查：檔案存在、不是 mock 佔位圖、像素尺寸、GIF 幀數與循環、填的 commit 裡確實包含這份檔案且之後沒再改過。打了勾但不符會列為 `FAIL`；第一行會印出「已提交且通過檢查 x / 總項數」。
3. 交付路徑中的 `{png,webp,svg}` 代表三選一的副檔名。**換副檔名時要刪掉舊的 `.svg` 佔位檔**（同名多副檔名會被判 FAIL），並一併修改 `assets/js/config.js` 的路徑（第 F 區有一列專門勾這件事）。
4. 「審核」欄由我們填寫（`☐` 待審／`☑` 通過／`✗` 退回＋原因），**GPT 不要改審核欄**。
5. 不要刪除或新增列；有疑問寫在最下方「備註」。

## A. 靜態圖（30）＋主標原始檔（1）

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
| ☐ | A22 | stage-bg-desktop | 1920×1000 | `assets/img/stage-bg-desktop.{png,webp,svg}` | | ☐ |
| ☐ | A23 | info-bg | 750×750 | `assets/img/info-bg.{png,webp,svg}` | | ☐ |
| ☐ | A24 | period-badge | 480×64 | `assets/img/period-badge.{png,webp,svg}` | | ☐ |
| ☐ | A25 | chances-badge | 360×88 | `assets/img/chances-badge.{png,webp,svg}` | | ☐ |
| ☐ | A26 | card-frame | 120×120 | `assets/img/card-frame.{png,webp,svg}` | | ☐ |
| ☐ | A27 | card-title | 400×72 | `assets/img/card-title.{png,webp,svg}` | | ☐ |
| ☐ | A28 | footer-deco | 750×160 | `assets/img/footer-deco.{png,webp,svg}` | | ☐ |
| ☐ | A29 | icon-share | 64×64 | `assets/img/icon-share.{png,webp,svg}` | | ☐ |
| ☐ | A30 | share-preview | 1200×630 | `assets/img/share-preview.{png,jpg}` | | ☐ |
| ☐ | A31 | title 原始檔（PSD／AI／Figma） | —（人工） | `source/title-source.md` | | ☐ |

## B. 色票（1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | B01 | 扇區色 6 組（底色＋文字色）＋分隔線色 | — | `assets/css/event.css`（`--ev-wheel-1`～`6`、`--ev-wheel-N-text`） | | ☐ |

## C. 吉祥物角色設定圖（1，第一階段）

> 由品牌包 `brand/moo-rabbit/` 製作，這裡只追蹤同一個檔案；品牌包勾選表 A01 打勾時，這列可填同一個 commit。

> C01 審核通過（☑）之前，不要開始 D 區。

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | C01 | turnaround-sheet（品牌包同一檔案） | 1536×1024 | `../../brand/moo-rabbit/01_character/turnaround-sheet.png` | | ☐ |

## D. 吉祥物 GIF（5，第二階段）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☑ | D01 | idle-1 | 400×500 gif≥24 | `assets/img/mascot/idle-1.gif` | 61c9eab | ☐ |
| ☑ | D02 | idle-2 | 400×500 gif≥24 | `assets/img/mascot/idle-2.gif` | 61c9eab | ☐ |
| ☑ | D03 | idle-3 | 400×500 gif≥24 | `assets/img/mascot/idle-3.gif` | 61c9eab | ☐ |
| ☑ | D04 | spinning | 400×500 gif≥24 | `assets/img/mascot/spinning.gif` | 61c9eab | ☐ |
| ☑ | D05 | result | 400×500 gif≥24 | `assets/img/mascot/result.gif` | 61c9eab | ☐ |

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

- A31：原始檔放雲端時，在 `source/title-source.md` 寫下檔案連結即可（腳本只檢查這個說明檔存在，內容由我們人工審核）。

- D01～D05（2026-11-11 收檔）：5 個 GIF 規格符合（400×500、48 幀、24fps、無限循環），已套用到前台。待審核注意：背心字樣放大後有拼錯（讀起來像 WOOTECH／MADTECH 等），logo 圖形為橘藍配色而非官方藍綠→黃綠漸層（`DESIGN_TASKS.md` 驗收表第 6 項）。E01～E10（PNG 序列幀、比對圖）尚未交付。
