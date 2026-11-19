# 活動配置、美術與目錄整理

實作提交 c91aeeb，後續交付文件修訂跟隨同一批發布。

| 要求 | 實作與證據 |
|---|---|
| 位置也要統一 | 分享／音效列以最先兩款為基準：8px 頂距、16px 邊距、8px 間距、36px 容器；24 組四活動 × 360/390/1440 × 獨立/嵌入座標完全一致。toolbar-matrix.json。 |
| 底座設計漂亮一點 | 新增透明雕金花紋、祖母綠台面及綠松石鑲嵌的立體底座；原稿 source，交付900×291 WebP。20261118_blind_box-reward.png。 |
| 真的是 3D 卡包 | 袋身採連續鼓起曲面，周邊收薄，封口與袋身深度銜接，細微側摺；保留正背貼圖、內含卡片、旋轉與撕封口。pouch-quarter.png、pouch-side.png、gestures.json。 |
| 後面的光輝重新設計 | 新透明紫色星雲、細金色星軌與星芒，緩慢小角度呼吸變化，沿用 reduced-motion；替換粗直白光。20261118_card_pack-reward.png。 |
| event 資料夾統一、沒用到的移動到備選 | 4 款統一 assets/css/js/img/audio、docs、source、tools、alternatives。共210個檔案變更位置，54份備選素材保留原檔；各 docs/FILE_MIGRATION.json 記錄原路徑。check-event-structure.cjs 核對設定、metadata 和目錄。保留原版轉盤 survival.html 與歷史社群圖作已公開網址相容入口。 |

功能驗證：en/ko/th × 390/1440 的12組選擇、開啟、揭曉、收取流程；360px操作可見，儲存與剪貼簿權限拒絕、空資料、零次數、獎品解析失敗、WebGL fallback。第一次並行跑 hover 音訊回歸時遇到時間斷言失敗，停止並行負載後單獨重跑通過；滑鼠／觸控均可轉袋身、頂端撕開且不誤旋轉。見 gameplay.json、gestures.json。

本次未驗證實體 iOS/Android GPU、揚聲器聲音或真實後台發獎。未改機率、音檔或主畫面元件排列。美術截圖為實際渲染檢視，不代表使用者終審。

目錄遷移同步更新設定、HTML metadata、引用文件、製作工具與交付檢查器。沙漠舊背景預載改為現行 open-desert，避免載入已歸檔背景。資源採壓縮 WebP，原稿保留，沒有引入新的逐幀 JavaScript 動畫迴圈。

搬移回歸發現生存轉盤 skin.css 屬性被路徑替換誤改，已在發布前修正為 skin.css 存取，並將換膚腳本更新版本號。修正後24組工具列測試包含 pageerror 與 HTTP 失敗檢查，全部通過；兩款轉盤實際 Spin → Result 通過且無載入錯誤。
