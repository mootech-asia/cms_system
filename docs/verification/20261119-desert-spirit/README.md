# 沙漠精靈與卡包主題修訂

美術提交 578aa12；整合與檢查 adb54b9。此為實作檢查紀錄，不代表使用者美術終審。

| 要求 | 實作與直接證據 | 檢查範圍 |
|---|---|---|
| 壯碩上身、金色腕環、旋轉煙霧下身、年輕俏皮、表情誇張 | `event/20261118_blind_box/source/desert-spirit/character-sheet.png`、三組 keyposes 與 review 圖；`motion-live-review.jpg` 是實際頁面連續截圖 | 上身、煙霧與神燈有完整原稿；場景中前景寶箱會遮住部分煙霧與燈 |
| 呼吸待機／興奮／再接再厲 | 三段 48 幀、2000ms 動態 WebP；idle / anticipate / celebrate / lose 狀態；motion-report.json | 減少動態、離屏、結果覆蓋時靜止；動畫載入失敗保留 poster |
| 整體在沙漠中，移除建築 | `blind_box.jpg`；金色沙丘、暮色天空、沙地，未載入柱廊／布簾／植物 | 兩個不同參數的景深圖層；共用一張已配準場景原圖，近景使用漸層遮罩 |
| 按鈕風格與第二張一致 | `card_pack.jpg`；紫色琺瑯、雕花金屬、紫晶及綠松石 | 分享／音效圖示仍是動態可操作元件 |
| 卡包圓圈稍微垂直橢圓 | 相機高度 2.5→3.05；保留 20 包原排列 | card-input-checks.json：滑鼠／觸控，包身旋轉，頂端撕開，hover 音效 |

功能：en/ko/th × 390/1440，12 組開啟、揭曉、收取、紀錄、音效、分享流程通過。360×640 操作區、空獎品、零次數、localStorage／剪貼簿拒絕、獎品回傳失敗、WebGL fallback 通過，見 flows-report.json。npm run build 與 git diff --check 通過。

效能模擬：Chromium SwiftShader、390×844、CPU 6 倍降速、冷快取、1.6Mbps／150ms。卡包進站 13.3s、已載入 2.33MB；盲盒 12.75s、2.22MB。WebGL 離屏停止繪圖；兩頁開獎通過。這些是模擬數據，不能當成實機 FPS。第一次測試開獎等待逾時；檢查腳本補上 ready 狀態等待後重跑通過，未單獨證明首次逾時的唯一原因。

交付場景 WebP 124KB，按鈕 16KB；人物 poster 約 59KB，三段動態總計約 6.63MB，於可互動後載入，原始設定圖、姿勢表與 RGBA 幀皆保留。動態使用完整人物關鍵姿勢光流插值，並非可任意旋轉的骨架 3D 模型。原生 iOS／Android GPU、實體喇叭、真實帳號後台發獎尚未驗證。
