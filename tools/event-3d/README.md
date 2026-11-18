# event-3d：Three.js vendor 建置

只負責產生 `event/shared/unbox-3d/vendor/three.min.js`（拆卡包／拆盲盒用到的 Three.js 子集，r187）。
活動本身是免建置的靜態頁，程式在 `event/shared/unbox-3d/`，改圖、改文案、改流程都不需要跑這裡。

```bash
npm ci
npm run build
```

需要新的 Three.js 類別時，先加進 `vendor-entry.js` 的 export 清單再 build，並把產物一起 commit。
`THREE-LICENSE.txt` 為 Three.js 授權（MIT），同一份也放在 vendor 資料夾。
