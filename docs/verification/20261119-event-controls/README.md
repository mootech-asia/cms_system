# 全活動共用按鈕驗證

要求：分享、音效與左右方向鍵沿用亮面圓角方形系列；依主題換色；所有 event 預設適用，除非另行要求特殊設計。

實作：四個活動同時引用 `event/shared/buttons/buttons.css`；保留原有 DOM 事件、ARIA 狀態、點擊區和位置。CLAUDE.md 加入全 repo 規則。

實際檢視四款 390px 截圖，見 contact.jpg。Playwright Chromium 在 360、390、1440 寬度逐頁比對啟用／停用新 CSS 前後四個按鈕座標與尺寸，完全相同；分享面板可開啟、音效開關可切換，卡包和寶箱左右切換維持有效。report.json 記錄結果。npm run build 與 git diff --check 通過。

本次未重測抽獎機率、全部角色動態或實機音訊播放；沒有修改這些機制。圖示無文字，沿用各頁既有三語 ARIA 標籤。

原圖 1.6 MB，方向鍵網頁底框約 8 KB（128px WebP），分享／音效沿用既有壓縮素材。未新增腳本、動畫迴圈或大型首屏圖片。
