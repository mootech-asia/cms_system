# Moo Rabbit（兔比）交付勾選表

> **排程：兔比完整設定排在轉盤活動（`event/20261111_lucky_wheel/`）完成之後。** 轉盤要用的兔比動態在活動勾選表追蹤，不等本包。

**提交狀態以這份表為準；是否屬實以檢查腳本的結果為準。** 規格與提示詞見 [`ART_REQUIREMENTS.md`](ART_REQUIREMENTS.md)。

## 打勾規則（GPT 必讀）

1. 檔案**已放到「交付路徑」並 commit** 之後，才能把「提交」欄的 `☐` 改成 `☑`，並在「commit」欄填 commit hash（前 7 碼）。
2. 打勾後執行（在 repo 根目錄）：
   ```bash
   python3 scripts/check_delivery.py brand/moo-rabbit/DELIVERY_CHECKLIST.md
   ```
   腳本會實際檢查：檔案存在、像素尺寸、填的 commit 裡確實包含這份檔案且之後沒再改過。第一行印出「已提交且通過檢查 x / 總項數」；已打勾的列必須全部 `OK`（影片 D02 暫緩：目前忽略不做，不納入製作範圍，腳本會顯示 `SKIP` 且不計入總數）。
3. 「審核」欄由我們填寫（`☐` 待審／`☑` 通過／`✗` 退回＋原因），**GPT 不要改審核欄**。
4. 不要刪除或新增列；有疑問寫在最下方「備註」。
5. 轉盤活動的吉祥物 GIF（07_motion）在 `event/20261111_lucky_wheel/DELIVERY_CHECKLIST.md` 的 D、E 區勾選，不在本表。

## 製作優先級（照順序做，先快速掌握整體設計質感）

| 級別 | 定義 | 做法 |
|---|---|---|
| **P0 全局視覺** | 面積大、決定第一眼的整體質感，且製作相對直接 | **最先做**。全部 P0 到位後先整頁截圖確認整體方向，再往下做 |
| **P1 版面元件** | 主要版面與互動元件 | P0 確認後接著做 |
| **P2 細節** | 小圖示、裝飾、設定調整 | P1 之後 |
| **P3 精修與動態** | 複雜、需要時間打磨的項目（吉祥物動態、角色設定圖、原始檔、音效、影片） | **放最後慢慢雕出品質**；需要時可先交靜態「假圖」讓頁面先成形（假圖不打勾，正式版交付才打勾） |

勾選表每列最後一欄是優先級；檢查腳本會顯示各級進度（例：`P0 3/11`）。

## A. 角色設定（第一階段；A01 審核通過前不要開始其他區）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☑ | A01 | turnaround-sheet | 1536×1024 | `01_character/turnaround-sheet.png` | 219d4e8 | ☐ | P0 |
| ☑ | A02 | view-front | 1024×1536 | `01_character/views/01-front.png` | 219d4e8 | ☐ | P0 |
| ☑ | A03 | view-three-quarter | 1024×1536 | `01_character/views/02-three-quarter.png` | 219d4e8 | ☐ | P0 |
| ☑ | A04 | view-side | 1024×1536 | `01_character/views/03-side.png` | 219d4e8 | ☐ | P0 |
| ☑ | A05 | view-back | 1024×1536 | `01_character/views/04-back.png` | 219d4e8 | ☐ | P0 |

## B. 全身姿勢（10）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | B01 | intro | 1024×1536 | `02_poses/p01-intro.png` | | ☐ | P2 |
| ☐ | B02 | templates | 1024×1536 | `02_poses/p02-templates.png` | | ☐ | P2 |
| ☐ | B03 | globe-languages | 1024×1536 | `02_poses/p03-globe-languages.png` | | ☐ | P2 |
| ☐ | B04 | tablet-thumbsup | 1024×1536 | `02_poses/p04-tablet-thumbsup.png` | | ☐ | P2 |
| ☐ | B05 | call-wave | 1024×1536 | `02_poses/p05-call-wave.png` | | ☐ | P2 |
| ☐ | B06 | wave | 1024×1536 | `02_poses/p06-wave.png` | | ☐ | P2 |
| ☐ | B07 | thinking | 1024×1536 | `02_poses/p07-thinking.png` | | ☐ | P2 |
| ☐ | B08 | wink-thumbsup | 1024×1536 | `02_poses/p08-wink-thumbsup.png` | | ☐ | P2 |
| ☐ | B09 | handshake | 1024×1536 | `02_poses/p09-handshake.png` | | ☐ | P2 |
| ☐ | B10 | heart-hands | 1024×1536 | `02_poses/p10-heart-hands.png` | | ☐ | P2 |

## C. 半身貼圖（11）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | C01 | intro | 1024×1024 | `03_stickers/s01-intro.png` | | ☐ | P1 |
| ☐ | C02 | templates | 1024×1024 | `03_stickers/s02-templates.png` | | ☐ | P1 |
| ☐ | C03 | globe-languages | 1024×1024 | `03_stickers/s03-globe-languages.png` | | ☐ | P1 |
| ☐ | C04 | tablet-thumbsup | 1024×1024 | `03_stickers/s04-tablet-thumbsup.png` | | ☐ | P1 |
| ☐ | C05 | call-wave | 1024×1024 | `03_stickers/s05-call-wave.png` | | ☐ | P1 |
| ☐ | C06 | wave | 1024×1024 | `03_stickers/s06-wave.png` | | ☐ | P1 |
| ☐ | C07 | wink-thumbsup | 1024×1024 | `03_stickers/s07-wink-thumbsup.png` | | ☐ | P1 |
| ☐ | C08 | thinking | 1024×1024 | `03_stickers/s08-thinking.png` | | ☐ | P1 |
| ☐ | C09 | handshake | 1024×1024 | `03_stickers/s09-handshake.png` | | ☐ | P1 |
| ☐ | C10 | heart-hands | 1024×1024 | `03_stickers/s10-heart-hands.png` | | ☐ | P1 |
| ☐ | C11 | hug-palette | 1024×1024 | `03_stickers/s11-hug-palette.png` | | ☐ | P1 |

## D. 事業部主視覺（2）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | D01 | key-visual | 1280×720 | `04_key-visual/k01-key-visual.jpg` | | ☐ | P2 |
| ☐ | D02 | loop-15s | 1280×720 15 秒（暫緩：目前忽略不做，不列待辦） | `04_key-visual/k02-loop-15s.mp4` | | ☐ | P3 |

## E. 客服介面（3）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | E01 | avatar-round | 512×512 | `05_support/c01-avatar-round.png` | | ☐ | P1 |
| ☐ | E02 | support-portrait | 1280×1280 | `05_support/c02-support-portrait.png` | | ☐ | P2 |
| ☐ | E03 | video-call-vertical | 720×960 | `05_support/c03-video-call-vertical.png` | | ☐ | P3 |

## F. 社群分享（3）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | F01 | banner-long | 1575×300 | `06_social/m01-banner-long.png` | | ☐ | P2 |
| ☐ | F02 | banner-copyspace | 1920×1008 | `06_social/m02-banner-copyspace.png` | | ☐ | P2 |
| ☐ | F03 | share-preview | 1200×630 | `06_social/m03-share-preview.jpg` | | ☐ | P2 |

## G. 根目錄代表素材（3，比照熊北：主要形象、視訊連線動畫、profile）

| 提交 | # | 檔名 | 尺寸 | 交付路徑 | commit | 審核 | 優先 |
|---|---|---|---|---|---|---|---|
| ☐ | G01 | main-image | 1024×1536 | `main-image.png` | | ☐ | P0 |
| ☐ | G02 | video-call | 720×720 gif≥24 | `video-call.gif` | | ☐ | P3 |
| ☐ | G03 | profile | 2000×2000 | `profile.jpg` | | ☐ | P1 |

## 備註

（GPT 有疑問或無法照規格交付時寫在這裡，附列號）

A01–A05：提交 219d4e8，原生尺寸與透明通道檢查見 `01_character/checks.json`。四視圖腳底相差 4px；身高面板為概念示意，尚非精準建模量測圖。人工審核待填。
