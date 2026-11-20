# Survival Spin — 生存輪盤

素材分類、編號、用途與尺寸請以 [素材製作清單](docs/ASSETS.md) 為準；分類規範與新活動建立方式見 [統一範本](../_template/README.md)。

正式素材統一放 `assets/images/`（圖片）、`assets/music/`（背景音樂）、`assets/sounds/`（音效）、`assets/effects/`（視覺特效）、`assets/3d/`（貼圖／模型）。`source/` 保留依同分類分組的製作原稿；淘汰提案、快取與舊測試輸出已移除，由 Git 歷史回溯。

獨立活動入口：[index.html](./index.html)。英文、韓文、泰文以 `?lang=en`、`?lang=ko`、`?lang=th` 選擇。本站使用 mock 獎項與次數，尚未代表後台正式串接。

## 檔案用途

| 路徑 | 用途 |
|---|---|
| `index.html` | 遊戲與專屬 OG / Twitter 分享 metadata |
| `assets/js/` | 設定、轉盤、語系、分享、音效與資料介面 |
| `assets/css/event.css`、`assets/css/skin.css` | 沿用的共用版型與生存輪盤色票 |
| `docs/DESIGN_TASKS.md`、`docs/GPT_ASSET_BRIEF.md` | 美術需求與製作規格 |
| `docs/DELIVERY_CHECKLIST.md` | 提交紀錄；人工審核與素材可用性仍須分別確認 |

## 目前採用版本

- 舞台：墨綠大廳、桃紅階梯與轉盤。
- 社群圖：[assets/images/share/survival_spin_IMG024_share-preview.jpg](assets/images/share/survival_spin_IMG024_share-preview.jpg)，1200×630。新入口的 HTML 原始碼直接引用此圖。
- 舊文件中的「兔比工作人員造型」是先前方向；目前遊戲角色為桃紅面具人物。原交付表保留歷史審核欄，不冒填舊項目。

原版轉盤與兔比活動素材位於 [../20261111_lucky_wheel/](../20261111_lucky_wheel/)。品牌完整吉祥物包位於 [../../brand/moo-rabbit/](../../brand/moo-rabbit/)。

## 載入與動畫交付

首屏只等待目前語系及舞台必要素材，角色先顯示 `optimized/poster.webp`，動畫在畫面可操作後載入。`config.js` 的角色路徑使用各角色目錄下的 `optimized/` 網頁交付檔；原動畫保留作為來源。執行 `python3 scripts/optimize_event_mascots.py` 可重建交付檔，保留原尺寸、透明背景與循環時長。

## 主題進站畫面（20261118-loading1）

生存輪盤：墨綠機械虹膜閘門、桃紅掃描光、分段式進度、等寬百分比。

| 素材 | 尺寸 | 用途 |
|---|---|---|
| `assets/images/ui/survival_spin_IMG016_loading-emblem.webp` | 480×480 RGBA | 中央專屬器物；無文字，按240px顯示；原稿保留 `source/images/survival_spin_SRC002_loading/emblem-original.png` |

共用樣式位於 `event/shared/loading/loading.css`，HTML 的 `data-theme` 在應用程式啟動前指定主題。實際圖片完成數驅動進度；失敗仍計為已處理，維持10秒截止退場，不用假進度或強迫等待。三語文案獨立於圖片，減少動態模式停止裝飾動畫。

## 標準目錄

- `source`：原稿、分層檔與 reference 參考資料。


## 自動轉動與略過動畫

- Auto ×N：N 依目前剩餘次數計算，最多 10 次，本輪開始後目標次數固定，剩餘次數為零時提早停止；每次獨立扣次數、記錄結果，Again 只補回一次機會，不延長本輪上限。
- Skip：單抽立即揭曉；自動模式略過本輪剩餘動畫，仍逐次結算，最後集中顯示結果。
- 結果清單可捲動；所有共用此活動的網站版本同步套用。

剩餘次數牌置於轉盤下方，上方一行顯示次數，下一行並排 Auto ×N／Skip（N 依剩餘次數計算，上限 10）；Skip 未轉動時停用。整批結果只要有獎品即播放中獎音效，全部 Again 才播放 Again 音效。獎項紀錄每頁 10 筆，保留完整歷史。

規則區捲動後顯示共用主題的回到頂部按鈕，到頂隱藏；支援語系與減少動態偏好。紀錄分頁、十轉畫面批次更新與音效資源優化的測試條件及數據見 [效能紀錄](../../docs/event-mechanism-performance-20261119.md)。

結果彈窗底圖與領獎按鈕在進場後以低優先序預載；SPIN 時提升載入優先序，底圖解碼完成後整體顯示結果。等待期間鎖定重複抽獎，圖片失敗或逾時則使用可讀的結果面板，保留已結算的獎項。
