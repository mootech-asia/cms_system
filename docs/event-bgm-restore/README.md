# 還原兩款背景音樂

使用者原話：「爛死了。音樂音樂換回上一個版本」。

提交 2d65268：盲盒與卡包的 assets/audio/bgm.mp3 均還原為上傳音訊包套用前 eb48514 的原檔；SHA-256 與位元組完全一致，見 [檔案比對](files.json)。更新 BGM 和 config 快取版本。

本次只還原背景音樂，音效、首操作播放修正與 PC 捲軸隱藏保留。source/audio 的上傳 bgm-master.wav 與提供者 README 留存作交付紀錄，不代表目前播放版本。

驗證：各活動使用獨立 Chromium 開啟，首次鍵盤操作後實際播放，循環接點、靜音與恢復均通過；載入的 MP3 SHA-256 與 eb48514 完全一致。[結果](checks.json)、[輸出](checks.log)。npm run build 通過。

原跨頁音訊回歸在第二頁的媒體播放等待逾時（paused，沒有音檔錯誤）；改以各活動獨立瀏覽器驗證後通過。本次不宣稱原跨頁測試通過；真實 iOS／Android 喇叭與 Safari／Firefox 未驗證。音效及玩法未修改。
