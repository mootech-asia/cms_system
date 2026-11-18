# CMS Event · 3D 活動模組

兩個獨立活動入口，共用 Three.js 呈現與流程核心。這是可運作的獨立原型；尚未連接既有 CMS／轉盤，無扣次數、機率計算或發獎。

## 啟動

```sh
npm ci
npm run dev
```

開啟 http://localhost:5173/card-pack/ 或 http://localhost:5173/blind-box/ 。`npm run build` 產生 dist，部署時保留兩個子目錄。`npm test` 執行 Playwright 流程測試（先 `npx playwright install chromium`）。

## 目錄

- `card-pack/`：環形選包、滑動或按鈕撕封條、多獎品逐張揭曉。
- `blind-box/`：立體盒選擇、開蓋、獎品揭曉。
- `shared/event.js`：場景、狀態流程、資源釋放。
- `shared/demo.js`：固定示範獎品，無真實抽獎。

## 套圖與 CMS 串接

各活動的 `main.js` 設定 `coverUrl` 即可替換封面，建議 2:3 圖像（盲盒正面會壓縮為方形，請使用方形圖）。`colors` 可設定六個包裝側面色彩。獎品可提供 `imageUrl`、`name`、`rarity`、`symbol`。圖片需可由瀏覽器讀取，跨網域需允許 CORS；封面失敗會保留暫代圖。

```js
const event = createEvent(document.querySelector('#app'), {
  type: 'card-pack', // 或 blind-box
  coverUrl: '/assets/pack-cover.webp',
  resolveRewards: async ({ type, selection }) => {
    // 在此串接現有轉盤 API；由後端檢查資格、扣次數並決定獎品。
    // 請使用後端冪等請求 ID，避免斷線重試重複扣次數。
    return [{ name: '獎品名稱', rarity: 'RARE', imageUrl: '/assets/reward.webp' }];
  },
});
// SPA 卸載時呼叫 event.destroy()。
```

流程：select → ready → loading → opening → reveal → complete。失敗返回 ready；loading／opening 鎖定操作，跳過動畫不重抽。每次結果陣列長度決定揭曉數量。

## 已做與後續

已限制像素密度至 2、共用渲染器、支援減少動態效果、響應式尺寸、鍵盤可操作的替代按鈕、頁面隱藏時停止渲染、卸載釋放 GPU 資源。WebGL 無法啟動仍可按鈕操作。

暫代版包含幾何包裝、金屬光澤、透視與開封動畫。尚無柔性包裝模擬、真實鏡面倒影、音效或 3D 獎品模型；正式美術套入後可再調整材質、鏡頭及動作。目前 Three.js 主包約 137 KB gzip，後續可依實際 CMS 打包方式拆分。

## 轉盤尺寸對齊

依 mootech-asia/cms_system 的 event/20261111_lucky_wheel 與 event/20261111_survival_spin/assets/css/event.css：頁面最大寬度 480px、水平置中、頂部 48px（矮螢幕 46px）、舞台基準 min(84vw, 380px, (100svh - 340px) / 1.32)。3D 畫布高度採基準的 1.32 倍容納開封動作。嵌入時採原版 66vw 最小尺寸規則，保留捲動。只對齊尺寸規則，尚未整合原版其他 CMS 功能。

## 更新發布檔

在本目錄執行 `npm ci && npm run build && python3 scripts/build-standalone.py`，會將自包含 HTML 更新至兩個 `event/20261118_*` 入口。正式站直接提供這些 HTML，無需執行 Node.js。
