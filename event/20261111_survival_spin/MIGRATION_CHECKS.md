# 活動拆分驗證

- 原生存輪盤 img 目錄的 35 個使用中素材與拆分前逐位元一致；第一版桃紅人物的六段 WebP 與基準圖也保持一致。
- 本地 Chromium 驗證：兩個活動 × en/ko/th × 390/1440 寬，共 12 組，均確認載入、分享語系、轉盤結果彈窗、無腳本錯誤與資源 404。
- 三種舊入口均導向新生存輪盤，保留語系。停用 JavaScript 時，新入口原始 HTML 仍含專屬 OG 圖片。
- 390px 畫面拆分前後目視比對，舞台、轉盤、人物與操作區位置維持一致；動態人物與跑馬燈時間點不同，未宣稱像素完全相同。
- 資料夾、程式與文件拆分；後台登入／真實交易不在本活動 mock 驗證範圍。

- 八個內嵌入口已在 Chromium 實際載入新人物：v1.5/site、v2/site、v2/site-mobile、v3/site、v3/site-mobile、v4/site、v5/site、v6/site。改為 URL API 加入 lang，避免移除舊 skin query 後出現錯誤的 `index.html&lang=`。
