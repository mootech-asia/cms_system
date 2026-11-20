# Lucky Wheel — 原版轉盤

活動入口：[index.html](./index.html)。語系：`?lang=en`、`?lang=ko`、`?lang=th`。

這個資料夾管理百老匯舞台風格的原版轉盤與兔比活動素材。生存輪盤已獨立到 [../20261111_survival_spin/](../20261111_survival_spin/)，桃紅人物與相關來源檔在該處維護。

- `assets/`：本活動的程式、樣式與遊戲使用圖片。
- `source/`、`tools/`：現行原圖、製作工具與動態序列。
- `source/reference/`：官方品牌參考與已採用的兔比設定。
- [docs/DESIGN_TASKS.md](docs/DESIGN_TASKS.md)、[docs/GPT_ASSET_BRIEF.md](docs/GPT_ASSET_BRIEF.md)：美術需求與製作規格。
- [docs/DELIVERY_CHECKLIST.md](docs/DELIVERY_CHECKLIST.md)：提交狀態與人工審核；已有素材不等於全部通過審核。

主視覺與介面素材已套用，活動仍使用 mock 資料。兔比下一輪先優化四段：待機、興奮、慶祝、再接再厲；每段需有足夠中間姿勢、透明邊緣檢查與 GIF 預覽。四段之後再做完整吉祥物設定；15 秒影片不做。

`survival.html`、入口的 `?skin=survival` 轉址與 `skins/survival/img/share-preview.jpg` 僅保留舊連結相容用途，不是第二份生存輪盤。

## 兔比動態優化進度

[四段動態預覽與透明素材](./source/rabbit-fullpose-v4/README.md)：待機、興奮、慶祝、再接再厲。已套用原版轉盤，胸前字標仍需修整。

## 載入與動畫交付

首屏只等待目前語系及舞台必要素材，角色先顯示 `optimized/poster.webp`，動畫在畫面可操作後載入。`config.js` 的角色路徑使用各角色目錄下的 `optimized/` 網頁交付檔；原動畫保留作為來源。執行 `python3 scripts/optimize_event_mascots.py` 可重建交付檔，保留原尺寸、透明背景與循環時長。

## 主題進站畫面（20261118-loading1）

百老匯：天鵝絨幕布、皇冠黃銅燈泡徽章、中央百分比、雙層鍍金進度槽。

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

目前圖片及音效放 `assets/img/`、`assets/audio/`；未採用或廢棄版本統一放 `alternatives/`，詳見 [搬移索引](docs/ARCHIVE_20261119.json)。共用素材可由其他活動或 `event/shared/` 引用，不複製。

## 自動轉動與略過動畫

- Auto ×N：N 依目前剩餘次數計算，最多 10 次，本輪開始後目標次數固定，剩餘次數為零時提早停止；每次獨立扣次數、記錄結果，Again 只補回一次機會，不延長本輪上限。
- Skip：單抽立即揭曉；自動模式略過本輪剩餘動畫，仍逐次結算，最後集中顯示結果。
- 結果清單可捲動；所有共用此活動的網站版本同步套用。

剩餘次數牌置於轉盤下方，上方一行顯示次數，下一行並排 Auto ×N／Skip（N 依剩餘次數計算，上限 10）；Skip 未轉動時停用。整批結果只要有獎品即播放中獎音效，全部 Again 才播放 Again 音效。獎項紀錄每頁 10 筆，保留完整歷史。

規則區捲動後顯示共用主題的回到頂部按鈕，到頂隱藏；支援語系與減少動態偏好。紀錄分頁、十轉畫面批次更新與音效資源優化的測試條件及數據見 [效能紀錄](../../docs/event-mechanism-performance-20261119.md)。

結果彈窗底圖與領獎按鈕在進場後以低優先序預載；SPIN 時提升載入優先序，底圖解碼完成後整體顯示結果。等待期間鎖定重複抽獎，圖片失敗或逾時則使用可讀的結果面板，保留已結算的獎項。
