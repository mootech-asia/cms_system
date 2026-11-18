# 活動音訊包更新

使用者原話：「幫我更新音樂音效」，附 blind_box_audio.zip、card_pack_audio.zip。

實作提交：4dc5bce。兩包內 25 個 MP3 位元組比對一致，並保留全部 WAV 母帶與提供者 README。README 的創作／授權敘述是交付者聲明，未獨立查證。

## 對應與交付

- 盲盒：12 個 MP3（1 BGM＋11 音效）；tear 開箱事件使用 open.mp3；四種稀有度各用專用揭曉音效。
- 卡包：13 個 MP3（1 BGM＋12 音效）；tear 使用新的 0.8 秒音檔，快／慢撕開仍依手勢持續時間調速。
- 卡包 Spin 共用 hover 與隱藏包提示聲未被本批取代。舊泛用 reveal 停用；下載失敗可使用程式合成音效，玩法不阻塞。
- reward 由 1.4 倍改為 1 倍，避免對已處理響度的交付音檔額外放大。BGM 保留 0.35 音量，開封／揭曉降至 0.1，領取恢復。
- MP3 合計 2,851,469 bytes；WAV 母帶 41,689,212 bytes。網頁使用交付 MP3，不重複有損壓縮；母帶不下載。音效於首次操作後載入，BGM 以串流 audio 播放。
- 修正首次滑鼠操作的 BGM 啟動：pointerdown 尚無滑鼠啟用權限時，pointerup 重試；不強制未操作自動播放。
- 更新 config／sound 與音檔版本參數，保留原版面、美術、抽獎規則及語系。

## 驗證

- [音檔容量](manifest.json)、[ffprobe 格式與長度](probe.json)，來源 MP3 與頁面資產位元組一致。
- `verify-unbox-art.cjs`：兩活動 × en/ko/th × 390/1440，共 12 開獎與領取流程；另測 360 控制、儲存／剪貼簿拒絕、空資料、零次數、解析失敗、WebGL fallback。[輸出](regression.log)。
- `verify-pack-audio.cjs`：新撕封條音檔調速、隱藏版音效、立即靜音。[輸出](pack-check.log)。
- 交付檢查：盲盒 89/89、卡包 96/96，打勾但不符均為 0；這是檔案交付檢查，不代表美術或聽感終審。[盲盒](delivery-blind.log)、[卡包](delivery-card.log)。
- `npm run build` 通過，[輸出](build.log)。

未驗證：真實 iOS／Android 裝置與實體喇叭聽感、各瀏覽器音訊輸出、提供者版權聲明；未改動正式後台或獎品發放機制。

- `verify-unbox-audio.cjs`：兩頁實際解碼並播放交付音檔，量測輸出端 RMS；首次操作啟動、BGM 跨尾端循環、靜音停止／恢復、四級揭曉、快慢撕開、開獎與領取壓低／恢復 BGM、音檔全遭封鎖仍可領取皆通過。[輸出](audio-test.log)、[逐音效證據](audio.json)。音效輸出量測不等於實體喇叭聽感驗收。
- 實際結果畫面：[盲盒](blind_box-result.webp)、[卡包](card_pack-result.webp)。沒有改動視覺素材與排版。
- 效能：390×844、CPU 6 倍降速、SwiftShader、1.6Mbps/150ms、冷快取。卡包載入 13.29s、待機 2s 主執行緒 670ms、結果 626ms；盲盒 14.50s、921ms、1141ms。兩頁成功開獎、無 pageerror、離屏 WebGL 暫停；軟體 GPU 下盲盒平均 rAF 121ms，不能宣稱固定 60fps。[數據](performance.json)。
