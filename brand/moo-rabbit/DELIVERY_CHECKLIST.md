# Moo Rabbit（兔比）交付勾選表

**提交狀態以這份表為準；是否屬實以檢查腳本的結果為準。** 規格與提示詞見 [`ART_REQUIREMENTS.md`](ART_REQUIREMENTS.md)。

## 打勾規則（GPT 必讀）

1. 檔案**已放到「交付路徑」並 commit** 之後，才能把「提交」欄的 `☐` 改成 `☑`，並在「commit」欄填 commit hash（前 7 碼）。
2. 打勾後執行（在 repo 根目錄）：
   ```bash
   python3 scripts/check_delivery.py brand/moo-rabbit/DELIVERY_CHECKLIST.md
   ```
   腳本會實際檢查：檔案存在、像素尺寸、填的 commit 裡確實包含這份檔案且之後沒再改過。第一行印出「已提交且通過檢查 x / 總項數」；已打勾的列必須全部 `OK`（影片 D02 暫緩：需用即夢製作，GPT 先不做，腳本會顯示 `SKIP` 且不計入總數）。
3. 「審核」欄由我們填寫（`☐` 待審／`☑` 通過／`✗` 退回＋原因），**GPT 不要改審核欄**。
4. 不要刪除或新增列；有疑問寫在最下方「備註」。
5. 轉盤活動的吉祥物 GIF（07_motion）在 `event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md` 的 D、E 區勾選，不在本表。

## A. 角色設定（第一階段；A01 審核通過前不要開始其他區）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | A01 | turnaround-sheet | 1536×1024 | `01_character/turnaround-sheet.png` | | ☐ |
| ☐ | A02 | view-front | 1024×1536 | `01_character/views/01-front.png` | | ☐ |
| ☐ | A03 | view-three-quarter | 1024×1536 | `01_character/views/02-three-quarter.png` | | ☐ |
| ☐ | A04 | view-side | 1024×1536 | `01_character/views/03-side.png` | | ☐ |
| ☐ | A05 | view-back | 1024×1536 | `01_character/views/04-back.png` | | ☐ |

## B. 全身姿勢（10）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | B01 | intro | 1024×1536 | `02_poses/p01-intro.png` | | ☐ |
| ☐ | B02 | templates | 1024×1536 | `02_poses/p02-templates.png` | | ☐ |
| ☐ | B03 | globe-languages | 1024×1536 | `02_poses/p03-globe-languages.png` | | ☐ |
| ☐ | B04 | tablet-thumbsup | 1024×1536 | `02_poses/p04-tablet-thumbsup.png` | | ☐ |
| ☐ | B05 | call-wave | 1024×1536 | `02_poses/p05-call-wave.png` | | ☐ |
| ☐ | B06 | wave | 1024×1536 | `02_poses/p06-wave.png` | | ☐ |
| ☐ | B07 | thinking | 1024×1536 | `02_poses/p07-thinking.png` | | ☐ |
| ☐ | B08 | wink-thumbsup | 1024×1536 | `02_poses/p08-wink-thumbsup.png` | | ☐ |
| ☐ | B09 | handshake | 1024×1536 | `02_poses/p09-handshake.png` | | ☐ |
| ☐ | B10 | heart-hands | 1024×1536 | `02_poses/p10-heart-hands.png` | | ☐ |

## C. 半身貼圖（11）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | C01 | intro | 1024×1024 | `03_stickers/s01-intro.png` | | ☐ |
| ☐ | C02 | templates | 1024×1024 | `03_stickers/s02-templates.png` | | ☐ |
| ☐ | C03 | globe-languages | 1024×1024 | `03_stickers/s03-globe-languages.png` | | ☐ |
| ☐ | C04 | tablet-thumbsup | 1024×1024 | `03_stickers/s04-tablet-thumbsup.png` | | ☐ |
| ☐ | C05 | call-wave | 1024×1024 | `03_stickers/s05-call-wave.png` | | ☐ |
| ☐ | C06 | wave | 1024×1024 | `03_stickers/s06-wave.png` | | ☐ |
| ☐ | C07 | wink-thumbsup | 1024×1024 | `03_stickers/s07-wink-thumbsup.png` | | ☐ |
| ☐ | C08 | thinking | 1024×1024 | `03_stickers/s08-thinking.png` | | ☐ |
| ☐ | C09 | handshake | 1024×1024 | `03_stickers/s09-handshake.png` | | ☐ |
| ☐ | C10 | heart-hands | 1024×1024 | `03_stickers/s10-heart-hands.png` | | ☐ |
| ☐ | C11 | hug-palette | 1024×1024 | `03_stickers/s11-hug-palette.png` | | ☐ |

## D. 事業部主視覺（2）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | D01 | key-visual | 1280×720 | `04_key-visual/k01-key-visual.jpg` | | ☐ |
| ☐ | D02 | loop-15s | 1280×720 15 秒（暫緩：需用即夢，GPT 先不做） | `04_key-visual/k02-loop-15s.mp4` | | ☐ |

## E. 客服介面（3）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | E01 | avatar-round | 512×512 | `05_support/c01-avatar-round.png` | | ☐ |
| ☐ | E02 | support-portrait | 1280×1280 | `05_support/c02-support-portrait.png` | | ☐ |
| ☐ | E03 | video-call-vertical | 720×960 | `05_support/c03-video-call-vertical.png` | | ☐ |

## F. 社群分享（3）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | F01 | banner-long | 1575×300 | `06_social/m01-banner-long.png` | | ☐ |
| ☐ | F02 | banner-copyspace | 1920×1008 | `06_social/m02-banner-copyspace.png` | | ☐ |
| ☐ | F03 | share-preview | 1200×630 | `06_social/m03-share-preview.jpg` | | ☐ |

## G. 根目錄代表素材（3，比照熊北：主要形象、視訊連線動畫、profile）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 |
|---|---|---|---|---|---|---|
| ☐ | G01 | main-image | 1024×1536 | `main-image.png` | | ☐ |
| ☐ | G02 | video-call | 720×720 gif≥24 | `video-call.gif` | | ☐ |
| ☐ | G03 | profile | 2000×2000 | `profile.jpg` | | ☐ |

## 備註

（GPT 有疑問或無法照規格交付時寫在這裡，附列號）
