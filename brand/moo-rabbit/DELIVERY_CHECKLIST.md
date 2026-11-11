# Moo Rabbit（兔比）交付勾選表

**提交狀態以這份表為準；是否屬實以檢查腳本的結果為準。** 規格與提示詞見 [`ART_REQUIREMENTS.md`](ART_REQUIREMENTS.md)。

## 打勾規則（GPT 必讀）

1. 檔案**已放到「交付路徑」並 commit** 之後，才能把「提交」欄的 `☐` 改成 `☑`，並在「commit」欄填 commit hash（前 7 碼）。
2. 打勾後執行（在 repo 根目錄）：
   ```bash
   python3 scripts/check_delivery.py brand/moo-rabbit/DELIVERY_CHECKLIST.md
   ```
   腳本會實際檢查：檔案存在、像素尺寸、填的 commit 裡確實包含這份檔案且之後沒再改過。第一行印出「已提交且通過檢查 x / 總項數」；已打勾的列必須全部 `OK`（影片 G01 為 `MANUAL`，長度與循環由我們人工審核）。
3. 「審核」欄由我們填寫（`☐` 待審／`☑` 通過／`✗` 退回＋原因），**GPT 不要改審核欄**。
4. 不要刪除或新增列；有疑問寫在最下方「備註」。
5. 轉盤活動的吉祥物 GIF（07_motion）在 `event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md` 的 D、E 區勾選，不在本表。

## A. 第一階段：設定圖與四視圖（審核通過前不要開始其他區）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | A01 | character-sheet | 1536×1024 | `promo/character-sheet.png` | | ☐ |
| ☐ | A02 | view-front | 1024×1536 | `promo/views/01-front.png` | | ☐ |
| ☐ | A03 | view-three-quarter | 1024×1536 | `promo/views/02-three-quarter.png` | | ☐ |
| ☐ | A04 | view-side | 1024×1536 | `promo/views/03-side.png` | | ☐ |
| ☐ | A05 | view-back | 1024×1536 | `promo/views/04-back.png` | | ☐ |

## B. 主要形象（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | B01 | main-image | 1024×1536 | `main-image.png` | | ☐ |

## C. 宣傳（9）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | C01 | video-call | 720×960 gif≥24 | `promo/video-call.gif` | | ☐ |
| ☐ | C02 | backdrop | 1575×300 | `promo/backdrop.png` | | ☐ |
| ☐ | C03 | profile | 512×512 | `promo/profile.jpg` | | ☐ |
| ☐ | C04 | support-portrait | 1280×1280 | `promo/support-portrait.png` | | ☐ |
| ☐ | C05 | key-visual | 1280×720 | `promo/key-visual.jpg` | | ☐ |
| ☐ | C06 | banner-copyspace | 1920×1008 | `promo/banner-copyspace.png` | | ☐ |
| ☐ | C07 | share-preview | 1200×630 | `promo/share-preview.jpg` | | ☐ |
| ☐ | C08 | views-lineup | 1536×1024 | `promo/views-lineup.png` | | ☐ |
| ☐ | C09 | with-moobear | 1536×1024 | `promo/with-moobear.png` | | ☐ |

## D. 表情包：半身貼圖（11）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | D01 | intro | 1024×1024 | `stickers/s01-intro.png` | | ☐ |
| ☐ | D02 | templates | 1024×1024 | `stickers/s02-templates.png` | | ☐ |
| ☐ | D03 | globe-languages | 1024×1024 | `stickers/s03-globe-languages.png` | | ☐ |
| ☐ | D04 | tablet-thumbsup | 1024×1024 | `stickers/s04-tablet-thumbsup.png` | | ☐ |
| ☐ | D05 | call-wave | 1024×1024 | `stickers/s05-call-wave.png` | | ☐ |
| ☐ | D06 | wave | 1024×1024 | `stickers/s06-wave.png` | | ☐ |
| ☐ | D07 | wink-thumbsup | 1024×1024 | `stickers/s07-wink-thumbsup.png` | | ☐ |
| ☐ | D08 | thinking | 1024×1024 | `stickers/s08-thinking.png` | | ☐ |
| ☐ | D09 | handshake | 1024×1024 | `stickers/s09-handshake.png` | | ☐ |
| ☐ | D10 | heart-hands | 1024×1024 | `stickers/s10-heart-hands.png` | | ☐ |
| ☐ | D11 | hug-palette | 1024×1024 | `stickers/s11-hug-palette.png` | | ☐ |

## E. 表情包：全身姿勢（10）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | E01 | intro | 1024×1536 | `stickers/full-body/p01-intro.png` | | ☐ |
| ☐ | E02 | templates | 1024×1536 | `stickers/full-body/p02-templates.png` | | ☐ |
| ☐ | E03 | globe-languages | 1024×1536 | `stickers/full-body/p03-globe-languages.png` | | ☐ |
| ☐ | E04 | tablet-thumbsup | 1024×1536 | `stickers/full-body/p04-tablet-thumbsup.png` | | ☐ |
| ☐ | E05 | call-wave | 1024×1536 | `stickers/full-body/p05-call-wave.png` | | ☐ |
| ☐ | E06 | wave | 1024×1536 | `stickers/full-body/p06-wave.png` | | ☐ |
| ☐ | E07 | wink-thumbsup | 1024×1536 | `stickers/full-body/p07-wink-thumbsup.png` | | ☐ |
| ☐ | E08 | thinking | 1024×1536 | `stickers/full-body/p08-thinking.png` | | ☐ |
| ☐ | E09 | handshake | 1024×1536 | `stickers/full-body/p09-handshake.png` | | ☐ |
| ☐ | E10 | heart-hands | 1024×1536 | `stickers/full-body/p10-heart-hands.png` | | ☐ |

## F. 表情包：總覽圖（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | F01 | stickers-sheet | 2048×1536 | `stickers/stickers-sheet.png` | | ☐ |

## G. 網站影片（1）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | G01 | loop-15s | 1280×720 15 秒（人工） | `website-video/loop-15s.mp4` | | ☐ |

## 備註

（GPT 有疑問或無法照規格交付時寫在這裡，附列號）
