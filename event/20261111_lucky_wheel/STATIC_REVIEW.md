# 最新追加：跑馬燈、彈窗修正與待機 1

素材提交：`8349b85`（跑馬燈／彈窗／第一屏定位）、`ccc0982`（基準幀與新版待機1）。交付清單最新預期38/56項；以檢查輸出為準。靜態 P0～P2 共34項，P3已提交4項，其他動態與原始檔仍未完成。

| 使用者要求 | 對應交付與驗證 | 尚未完成 |
|---|---|---|
| 繼續完成，好的素材也要推上去 | 新增690×64跑馬燈、彈窗內容alpha255；三語四尺寸實際點Spin now、結果、次數用完與分享測試85筆，12組第一屏幾何核對通過，見 art-source/verification/ticker/ | 人工美術審核待確認 |
| 每個gif都要讓我看預覽效果 | [待機1動態預覽](source/mascot-v3/preview.html)，48幀／2秒，首尾與基準一致，0輪廓像素變動；瀏覽器連續取樣確認動圖確實在播放 | 其他四段仍待重做共同起訖姿勢；新待機1暫不混入舊輪播 |

彈窗中心的少量透底是我上一批去背輸出造成，這次以不透明奶油色內襯修正，保留外框外側透明。第一屏整理清除重複角色定位，縮小場景中角色避免遮住盤面文字，保留腳下陰影與操作台前後層次。程式建置與部署於提交後另核對。

以下保留上一批靜態交付紀錄。

---

# P0～P2 靜態美術交付（待人工審核）

P0 `d913f7f`；P1/P2 `de2370c`；分享圖 JPEG 與對應路徑 `e5e2f55`。
共 33/53 項提交：P0 11/11、P1 10/10、P2 12/12，P3 0/20。這是技術交付進度，非人工審核通過或全案完成。

| 使用者原話 | 本次處理 | 驗證證據 | 未完成／未驗證 |
|---|---|---|---|
| 繼續完成，好的素材也要推上去 | P0 主視覺已推 main，部署成功；接續交 P1 彈窗／按鈕／徽章／卡片／底紋／分享圖及 P2 控制圖示／頁尾；既有獎項圖示與光效核對後納入提交 | [手機](art-source/verification/static-final/en-390.png)、[桌機](art-source/verification/static-final/en-1440.png)、[彈窗](art-source/verification/static-final/result-en-390.png)、[測試](art-source/verification/static-final/checks.json) | P3 動態與可編輯主標原始檔尚未完成；人工審核未通過前不視為定稿 |
| 上傳 | 本批素材、生成源圖、輸出程式、驗證截圖均提交 Git；發佈狀態以 GitHub Actions 最新 Deploy GitHub Pages 結果為準 | P0 已發佈：[run 43012005629](https://github.com/mootech-asia/cms_system/actions/runs/43012005629)；本批 main `8880616` 已部署成功：[run 43012715390](https://github.com/mootech-asia/cms_system/actions/runs/43012715390) | 不把舊 GIF 退回項目標成修復 |

## 已執行檢查

- en/ko/th × 390/1440 × 初始／轉動／結果／次數用完，另驗換圖標籤、分享網址及剪貼簿拒絕備援，共37筆檢查，0錯誤、0破圖、0 HTTP錯誤、0橫向溢出、0漢字外洩。
- P0 階段另驗 localStorage 被拒與後台空資料，既有行為未改動。
- 新靜態素材尺寸符合清單，單張 <300 KB；分享圖為 JPEG 217,485 bytes，避免索引色 PNG 的漸層色階斷裂；底紋左右／上下邊界逐像素一致。
- 卡片採120×120、40px九宮格；中心不透明，直邊可延伸；徽章、彈窗及按鈕不把翻譯文字燒入底圖。
- 生成源圖：source/ui-components/；輸出程式：tools/build_ui_components.py、tools/build_share_preview.cjs。

P3 後續：固定鏡頭與角色尺寸、共用頭尾基準幀、五段動態逐一預覽與驗收。現有 GIF 仍是待精修示意，idle-1 維持不參與頁面輪播。主標可編輯 PSD/AI/Figma 亦尚未提交。

## 正式站核對

2026-11-11：`8880616` 的 Deploy GitHub Pages 成功；正式網址 https://mootech-asia.github.io/cms_system/event/20261111_lucky_wheel/ 。config.js、modal-bg.webp、share-preview.jpg 下載 SHA256 與本機一致。正式站 en/ko/th × 390/1440 截圖＋英文實際抽獎、關閉彈窗、分享網址驗證通過，0 JS/HTTP錯誤，見 `art-source/verification/static-final/live/`。

pre-report-check.sh：PASS 工作樹乾淨；PASS HEAD 8880616 已在 origin/main；PASS npm run build 後 tailwind.css 無差異。
