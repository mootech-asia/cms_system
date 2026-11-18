# unbox-3d：拆卡包／拆盲盒共用引擎

`event/20261118_card_pack` 與 `event/20261118_blind_box` 共用的程式與版面。兩個活動只差各自的
`assets/js/config.js`（type、圖片槽、文案、mock 內容）、`assets/css/theme.css`（色票）與 `assets/img/`（素材）。
免建置：直接開 `index.html` 或放上 GitHub Pages 即可，改圖、改文案、改程式都不用跑 npm。

## 目錄

| 路徑 | 內容 |
|---|---|
| `js/app.js` | 流程：select → ready → loading → opening → reveal；次數、紀錄、揭曉、內部面板、loading（ES module） |
| `js/scene.js` | Three.js 3D 選擇區：六個包裝環形排列、拖曳／箭頭切換、撕封條／開蓋動畫（ES module） |
| `js/store.js` | 後台內容格式（`window.EVENT_CONTENT`）與開獎介面（`window.EVENT_RESOLVE`），寫在檔案開頭 |
| `js/i18n.js` | en／ko／th（預設 en），zh 只供 Ctrl+Alt+L 內部預覽；活動文案寫在 config.strings |
| `js/skin.js` | 換皮：`config.skin` 或網址 `?skin=<名稱>` |
| `js/sound.js` | 音效：config.sounds 有檔案就播檔案，沒有就 Web Audio 合成 |
| `js/share.js` | 分享面板（同轉盤） |
| `css/unbox.css` | 版面與元件（只用 token；色票在各活動 theme.css） |
| `vendor/three.min.js` | Three.js r187 子集（只含用到的類別），由 `tools/event-3d` 產生 |
| `tools/make_placeholders.py` | 產生 mock 佔位圖與分享預覽 PNG |

## 換主題（換皮）

1. **只換圖**：同檔名覆蓋 `assets/img/` 的檔案；副檔名不同就改 `config.js` 的 `images` 路徑。
2. **整套新主題但保留原版**：在活動資料夾建立 `skins/<名稱>/`，放 `skin.css`（只覆寫 theme.css 的變數）與 `img/`
   （只放跟預設不同的圖，子資料夾分類與 `assets/img/` 相同），在 `config.js` 加：
   ```js
   skins: {
     xmas: {
       css: 'skins/xmas/skin.css',
       images: { stageBg: 'skins/xmas/img/scene/stage-bg.webp', packFront: ['skins/xmas/img/3d/pack-front-1.webp'] },
       strings: { 'title.alt': { en: 'Holiday Packs', ko: '…', th: '…', zh: '…' } }
     }
   }
   ```
   網址加 `?skin=xmas` 預覽；確定後把 `skin: 'xmas'` 設成預設。分享連結會自動帶上非預設的 skin。
3. 3D 包裝的側邊／封條／盒蓋側邊會乘上 `--ev-3d-item-1`～`6`，補光色 `--ev-3d-accent`，接地陰影 `--ev-3d-shadow`；
   揭曉光暈與紀錄標籤用 `--ev-rarity-*`。全部在 theme.css／skin.css 改，不用動程式。

## 新增第三種活動

複製其中一個活動資料夾，改 `config.js` 的 `type`（目前支援 `card-pack`／`blind-box`）、`storageKey`、文案與 index.html 的 og 網址。
新的 3D 外型需要在 `js/scene.js` 加一個分支（包裝幾何＋開封動作），流程與介面不用改。

## 更新 Three.js

```bash
cd tools/event-3d && npm ci && npm run build
```
會覆蓋 `vendor/three.min.js`。新增用到的 Three.js 類別時，先加進 `tools/event-3d/vendor-entry.js` 再 build。

## 上線前（工程）

- 拿掉內部面板（`#mockPanel` 與 app.js 的連點三下）與換圖標籤。
- 串接後台：`window.EVENT_CONTENT`（內容）＋ `window.EVENT_RESOLVE`（後端開獎、扣次數、冪等請求 ID）；
  次數與紀錄目前存 localStorage，只是 mock。
- mock 獎項圖示借用 `../20261111_lucky_wheel/assets/img/icon-*.svg`，正式由後台提供。
