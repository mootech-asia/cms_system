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

## 製作優先級（照順序做，先快速掌握整體設計質感）

| 級別 | 定義 | 做法 |
|---|---|---|
| **P0 全局視覺** | 面積大、決定第一眼的整體質感，且製作相對直接 | **最先做**。全部 P0 到位後先整頁截圖確認整體方向，再往下做 |
| **P1 版面元件** | 主要版面與互動元件 | P0 確認後接著做 |
| **P2 細節** | 小圖示、裝飾、設定調整 | P1 之後 |
| **P3 精修與動態** | 複雜、需要時間打磨的項目（吉祥物動態、角色設定圖、原始檔、音效、影片） | **放最後慢慢雕出品質**；需要時可先交靜態「假圖」讓頁面先成形（假圖不打勾，正式版交付才打勾） |

勾選表每列最後一欄是優先級；檢查腳本會顯示各級進度（例：`P0 3/11`）。

## A. 靜態圖（31）＋主標原始檔（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | A01 | stage-bg | 750×1000 | `assets/img/stage-bg.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☑ | A02 | stage-floor | 750×140 | `assets/img/stage-floor.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☑ | A03 | title-en | 690×240 | `assets/img/title-en.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☑ | A04 | title-ko | 690×240 | `assets/img/title-ko.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☑ | A05 | title-th | 690×240 | `assets/img/title-th.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☐ | A06 | spotlight | 260×900 | `assets/img/spotlight.{png,webp,svg}` | | ☐ | P1 |
| ☑ | A07 | wheel-frame | 680×680 | `assets/img/wheel-frame.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☐ | A08 | wheel-gloss | 600×600 | `assets/img/wheel-gloss.{png,webp,svg}` | | ☐ | P1 |
| ☑ | A09 | pointer | 120×160 | `assets/img/pointer.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☑ | A10 | btn-go | 200×200 | `assets/img/btn-go.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☐ | A11 | modal-bg | 600×760 | `assets/img/modal-bg.{png,webp,svg}` | | ☐ | P1 |
| ☐ | A12 | btn-primary | 400×110 | `assets/img/btn-primary.{png,webp,svg}` | | ☐ | P1 |
| ☐ | A13 | icon-sound-on | 64×64 | `assets/img/icon-sound-on.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A14 | icon-sound-off | 64×64 | `assets/img/icon-sound-off.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A15 | icon-cash | 160×160 | `assets/img/icon-cash.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A16 | icon-coin | 160×160 | `assets/img/icon-coin.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A17 | icon-gift | 160×160 | `assets/img/icon-gift.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A18 | icon-spin | 160×160 | `assets/img/icon-spin.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A19 | icon-bonus | 160×160 | `assets/img/icon-bonus.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A20 | icon-points | 160×160 | `assets/img/icon-points.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A21 | icon-thanks | 160×160 | `assets/img/icon-thanks.{png,webp,svg}` | | ☐ | P2 |
| ☑ | A22 | stage-bg-desktop | 1920×1000 | `assets/img/stage-bg-desktop.{png,webp,svg}` | d913f7f | ☐ | P0 |
| ☐ | A23 | info-bg | 750×750 | `assets/img/info-bg.{png,webp,svg}` | | ☐ | P1 |
| ☐ | A24 | period-badge | 480×64 | `assets/img/period-badge.{png,webp,svg}` | | ☐ | P1 |
| ☐ | A25 | chances-badge | 360×88 | `assets/img/chances-badge.{png,webp,svg}` | | ☐ | P1 |
| ☐ | A26 | card-frame | 120×120 | `assets/img/card-frame.{png,webp,svg}` | | ☐ | P1 |
| ☐ | A27 | card-title | 400×72 | `assets/img/card-title.{png,webp,svg}` | | ☐ | P1 |
| ☐ | A28 | footer-deco | 750×160 | `assets/img/footer-deco.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A29 | icon-share | 64×64 | `assets/img/icon-share.{png,webp,svg}` | | ☐ | P2 |
| ☐ | A30 | share-preview | 1200×630 | `assets/img/share-preview.{png,jpg}` | | ☐ | P1 |
| ☐ | A31 | title 原始檔（PSD／AI／Figma） | —（人工） | `source/title-source.md` | | ☐ | P3 |
| ☑ | A32 | wheel-stand | 400×600 | `assets/img/wheel-stand.{png,webp,svg}` | d913f7f | ☐ | P0 |

## B. 色票（1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | B01 | 扇區色 6 組（底色＋文字色）＋分隔線色 | — | `assets/css/event.css`（`--ev-wheel-1`～`6`、`--ev-wheel-N-text`） | d913f7f | ☐ | P0 |

## C. 吉祥物角色設定圖（1，第一階段）

> 由品牌包 `brand/moo-rabbit/` 製作，這裡只追蹤同一個檔案；品牌包勾選表 A01 打勾時，這列可填同一個 commit。

> 兔比完整設定排在轉盤活動完成之後，C01 暫緩、不計入本活動進度；D 區（動態）不必等 C01，但排在 P0～P2 之後。
> **D 區規則**：先交 D00 基準幀；每個 GIF 第一幀＝最後一幀＝D00，且每段長度相同（48 幀、2 秒），檢查腳本會逐一驗證。

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | C01 | turnaround-sheet（品牌包同一檔案） | 1536×1024（暫緩：兔比完整設定排在轉盤活動之後） | `../../brand/moo-rabbit/01_character/turnaround-sheet.png` | | ☐ | P3 |

## D. 吉祥物 GIF（5，第二階段）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | D00 | base-frame（所有動態共用的基準幀） | 400×500 | `assets/img/mascot/base-frame.png` | | ☐ | P3 |
| ☐ | D01 | idle-1 | 400×500 gif≥24 | `assets/img/mascot/idle-1.gif` | | ✗ 退回：整隻角色忽大忽小（寬度變化約 19%），已從頁面移除，需重做 | P3 |
| ☐ | D02 | idle-2 | 400×500 gif≥24 | `assets/img/mascot/idle-2.gif` | | ✗ 需重做：頭尾幀不一致、與其他動態起始姿勢不同（目前當假圖留在頁面） | P3 |
| ☐ | D03 | idle-3 | 400×500 gif≥24 | `assets/img/mascot/idle-3.gif` | | ✗ 需重做：頭尾幀不一致、與其他動態起始姿勢不同（目前當假圖留在頁面） | P3 |
| ☐ | D04 | spinning | 400×500 gif≥24 | `assets/img/mascot/spinning.gif` | | ✗ 需重做：頭尾幀不一致、與其他動態起始姿勢不同（目前當假圖留在頁面） | P3 |
| ☐ | D05 | result | 400×500 gif≥24 | `assets/img/mascot/result.gif` | | ✗ 需重做：頭尾幀不一致、與其他動態起始姿勢不同（目前當假圖留在頁面） | P3 |

## E. 吉祥物附件（10）

序列幀與比對圖不會上線，放在 `source/`。

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | E01 | idle-1 PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/idle-1/` | | ☐ | P3 |
| ☐ | E02 | idle-2 PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/idle-2/` | | ☐ | P3 |
| ☐ | E03 | idle-3 PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/idle-3/` | | ☐ | P3 |
| ☐ | E04 | spinning PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/spinning/` | | ☐ | P3 |
| ☐ | E05 | result PNG 序列幀 | 400×500 frames≥24 | `source/mascot-frames/result/` | | ☐ | P3 |
| ☐ | E06 | idle-1 關鍵幀 vs 熊北參考 | — | `source/mascot-compare/idle-1.{png,webp}` | | ☐ | P3 |
| ☐ | E07 | idle-2 關鍵幀 vs 熊北參考 | — | `source/mascot-compare/idle-2.{png,webp}` | | ☐ | P3 |
| ☐ | E08 | idle-3 關鍵幀 vs 熊北參考 | — | `source/mascot-compare/idle-3.{png,webp}` | | ☐ | P3 |
| ☐ | E09 | spinning 關鍵幀 vs 熊北參考 | — | `source/mascot-compare/spinning.{png,webp}` | | ☐ | P3 |
| ☐ | E10 | result 關鍵幀 vs 熊北參考 | — | `source/mascot-compare/result.{png,webp}` | | ☐ | P3 |

## F. 程式路徑（1）

| 提交 | # | 項目 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | F01 | `config.js` 的 images／mascot 路徑改成實際交付的檔名，前台實際載入無破圖 | — | `assets/js/config.js` | d913f7f | ☐ | P2 |

## G. 音效（選配 3）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | G01 | drumroll | 約 5 秒 | `assets/audio/drumroll.mp3` | | ☐ | P3 |
| ☐ | G02 | win | 1～2 秒 | `assets/audio/win.mp3` | | ☐ | P3 |
| ☐ | G03 | lose | 1 秒內 | `assets/audio/lose.mp3` | | ☐ | P3 |

## 備註

（GPT 有疑問或無法照規格交付時寫在這裡，附列號）

- A31：原始檔放雲端時，在 `source/title-source.md` 寫下檔案連結即可（腳本只檢查這個說明檔存在，內容由我們人工審核）。

- D01～D05（2026-11-11 收檔）：5 個 GIF 規格符合（400×500、48 幀、24fps、無限循環），已套用到前台。待審核注意：背心字樣放大後有拼錯（讀起來像 WOOTECH／MADTECH 等），logo 圖形為橘藍配色而非官方藍綠→黃綠漸層（`DESIGN_TASKS.md` 驗收表第 6 項）。E01～E10（PNG 序列幀、比對圖）尚未交付。

### P0 本機交付 2026-11-11

- d913f7f：10 張正式靜態圖＋扇區色票；三語主標、手機／桌機透視舞台、外框、底座、指針與主按鈕。
- 預覽及三語雙寬檢查：`art-source/verification/p0/`。P1/P2 尚未按新版清單完成驗收。
- D01～D05 沿用退回紀錄；頁面目前的 GIF 是待精修示意，不算正式交付。
