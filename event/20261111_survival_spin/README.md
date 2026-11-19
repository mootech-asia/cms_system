# Survival Spin — 生存輪盤

獨立活動入口：[index.html](./index.html)。英文、韓文、泰文以 `?lang=en`、`?lang=ko`、`?lang=th` 選擇。本站使用 mock 獎項與次數，尚未代表後台正式串接。

## 檔案用途

| 路徑 | 用途 |
|---|---|
| `index.html` | 遊戲與專屬 OG / Twitter 分享 metadata |
| `assets/js/` | 設定、轉盤、語系、分享、音效與資料介面 |
| `assets/css/event.css`、`assets/css/skin.css` | 沿用的共用版型與生存輪盤色票 |
| `img/` | 遊戲正在使用的主視覺、介面、角色與社群圖 |
| `source/` | 原圖、歷史提案、動態序列與檢查資料；不代表全數已採用 |
| `tools/` | 素材組裝與輸出工具 |
| `docs/DESIGN_TASKS.md`、`docs/GPT_ASSET_BRIEF.md` | 美術需求與製作規格 |
| `docs/DELIVERY_CHECKLIST.md` | 提交紀錄；人工審核與素材可用性仍須分別確認 |

## 目前採用版本

- 舞台：墨綠大廳、桃紅階梯與轉盤。
- 人物：`img/mascot/` 使用第一版桃紅面具人物（還原來源 `ba4675c`，還原提交 `e3f2143`）。六段新版分段姿勢留在 `source/guard-fullpose-v3/`，已因流暢度與邊緣問題退回，不作為遊戲使用版。
- 社群圖：[assets/img/share-preview.jpg](assets/img/share-preview.jpg)，1200×630。新入口的 HTML 原始碼直接引用此圖。
- 舊文件中的「兔比工作人員造型」是先前方向；目前遊戲角色為桃紅面具人物。原交付表保留歷史審核欄，不冒填舊項目。

原版轉盤與兔比活動素材位於 [../20261111_lucky_wheel/](../20261111_lucky_wheel/)。品牌完整吉祥物包位於 [../../brand/moo-rabbit/](../../brand/moo-rabbit/)。

## 載入與動畫交付

首屏只等待目前語系及舞台必要素材，角色先顯示 `optimized/poster.webp`，動畫在畫面可操作後載入。`config.js` 的角色路徑使用各角色目錄下的 `optimized/` 網頁交付檔；原動畫保留作為來源。執行 `python3 scripts/optimize_event_mascots.py` 可重建交付檔，保留原尺寸、透明背景與循環時長。

## 主題進站畫面（20261118-loading1）

生存輪盤：墨綠機械虹膜閘門、桃紅掃描光、分段式進度、等寬百分比。

| 素材 | 尺寸 | 用途 |
|---|---|---|
| `assets/img/loading-emblem.webp` | 480×480 RGBA | 中央專屬器物；無文字，按240px顯示；原稿保留 `source/loading/emblem-original.png` |

共用樣式位於 `event/shared/loading/loading.css`，HTML 的 `data-theme` 在應用程式啟動前指定主題。實際圖片完成數驅動進度；失敗仍計為已處理，維持10秒截止退場，不用假進度或強迫等待。三語文案獨立於圖片，減少動態模式停止裝飾動畫。

## 標準目錄

- `assets/css`、`assets/js`、`assets/img`、`assets/audio`：正式樣式、程式、圖片與音訊。
- `docs`：需求、交付清單與 FILE_MIGRATION.json 搬移索引；交付表路徑以活動根目錄為基準。
- `source`：原稿、分層檔與 reference 參考資料。
- `tools`：此活動的素材製作工具。
- `alternatives`：目前未引用的備選／舊版素材，保留原路徑結構。
