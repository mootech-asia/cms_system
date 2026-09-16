# i18n-audit

無頭瀏覽器逐頁、逐語系把 `v2/site`、`v3/site`（可依需要在 `config.js`
加更多站台）實際跑起來，抓兩類翻譯漏洞：

- **chinese-leak**：語系切到 en/ko/th 時，畫面上還留著中文字元
  （通常是某個字串字典漏了 en/ko/th 對應，只剩 zh 那份）。
- **same-as-baked**：同一個位置的文字在 zh 與其他語系下完全相同
  （通常是整串內容根本沒進翻譯字典）。

遊戲名稱、廠商名稱、帳號、金額、遮罩戶名等「資料值」不算翻譯內容，
在 `config.js` 的 `properNounClassHints` / `ignoreExactText` /
`ignoreTextPatterns` 設定要略過的 class/字串。

## 使用方式

```bash
cd tools/i18n-audit
npm install
npm run audit                    # 掃全部設定的站台
node audit.js --site=v2-site     # 只掃單一站台
node audit.js --json=report.json # 另外輸出完整 JSON 報告
```

需要本機已有 Chromium（此 repo 的雲端執行環境已預裝於
`$PLAYWRIGHT_BROWSERS_PATH`，`audit.js` 會自動找到；本機開發如果
沒有，`npm install playwright` 改抓完整版即可，不用改程式碼）。

## 已知限制

- 只掃頁面「一載入」的狀態；靠點擊才會渲染出來的內容（例如某些頁籤/
  手風琴內容）抓不到，需要另外針對該頁寫互動腳本。
- 專有名詞排除清單是手動整理的，新增卡片樣板/欄位時記得回來補
  `config.js`，避免大量假警報淹沒真正的漏翻譯。
- `zh` 在 v2 前台預設是隱藏語系（要在 studio 開關才會出現在玩家可切換
  清單），`config.js` 用 `extraLocalStorage` 強制打開四語系一起測試。
