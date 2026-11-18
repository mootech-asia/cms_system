# Hover 音效、布簾風動、開獎相容性與撕包判定

本批是 `20261118_card_pack` 與 `20261118_blind_box` 的四項修改；default 主題。實作提交 `2a36ceb`。

| 使用者原話 | 修改與證據 | 驗證範圍 | 未驗證 |
|---|---|---|---|
| 卡包hover的時候的音效要跟spin的同款 | 直接引用 Spin 的 `20261111_survival_spin/assets/audio/hover.mp3`，同樣音量 0.7、180ms 間隔，取代前一個 hover 聲音；checks.json | WebGL 與平面 fallback；每次移入只播一次、停留不重播、快速觸發不疊音、靜音、不以 hover 解鎖瀏覽器音訊 | 實機喇叭聽感；首次點擊／按鍵前遵守瀏覽器音訊限制，與 Spin 相同 |
| 沙漠的左上的布簾也要隨風飄。幅度可以大一點 | 布簾圖層上緣為軸，疊加風陣旋轉／斜切／起伏：最大 ±8px 位移、±4.6° 旋轉、±3.4° 斜切；curtain-0.webp、curtain-1.webp | 柱廊／地板不移動、減少動態靜止、離屏停止；360／390／1440 景深回歸 | 真實布料物理模擬；此處為獨立圖層風動 |
| 動畫沒出來的意思嗎？ | 我上一輪漏處理新舊結構相容性造成：舊 HTML 的 `.ev-reveal-rays` 圖片遇到移除該設定的新 config，留下旋轉空框。以舊 HTML＋已發布 JS/config 重現；新 app 自動替換成 Canvas 圖集動畫，並保留 poster 設定供舊 renderer 使用；legacy-before.webp、legacy-after.webp、compat.log | 實際重現相同空框，修復後影格有變、空框元素不存在、仍可領取；不是只推測使用者快取 | 使用者原瀏覽器記憶體狀態無法直接取得；重現證明此組合會造成同樣畫面 |
| 撕開卡包。跟旋轉卡包容易衝突。判定如果接近頂端的話就是撕開卡包 | 由封條射線精準命中改為投影到螢幕的頂端容錯帶：上方 26px、左右各 32px、下方依舞台高 44–76px；按下時鎖定 tear／rotate，拖曳途中不切換；checks.json | 滑鼠與 CDP 觸控；旋轉至側面後，在頂端下方 40px 拖曳仍撕開，本體中下方旋轉不扣次數；按下到放開前頂端滑動不轉動 | 實體手機手感 |

## 驗證

- `verify-hover-wind.cjs`：hover 真正啟動 AudioBufferSource、音檔／音量、停留與節流、前音停止、靜音；頂端／本體手勢分流；布簾和柱廊獨立、減少動態／離屏暫停。
- `verify-reveal-compat.cjs`：以 git `3f92eaa` 的 HTML 及 `1dfa508` 的 app/config 重現；更新版改成動畫 Canvas，開獎及領取可完成。
- `verify-unbox-art.cjs`：en／ko／th × 390／1440 開獎、領取、分享及靜音；另測 360 操作、禁用儲存與剪貼簿、空資料、零次數、解析獎項失敗、WebGL fallback。沒有額外 skin 或登入功能。
- `verify-unbox-secret.cjs`：快／慢撕開、隱藏版成功次數與重設隔離回歸。
- `verify-unbox-scenes.cjs`、`verify-desert-depth.cjs`：動態／靜態偏好／離屏與缺圖退回。
- 效能條件：390×844、Chromium SwiftShader、CPU 6 倍降速、1.6Mbps／150ms、冷快取，詳 performance.json。非實機 FPS 保證。
- `npm run build` 與 `git diff --check`；發布前檢查另附輸出。

此次增加的 poster 是原沙塵圖集的第 0 格，320×320 WebP，原稿／原影格仍留在 source/reveal；沒有新增首屏預載。Hover 直接復用既有音檔，未複製另一份相似聲音。

## 模擬效能結果

| 活動 | 冷載入 | 待機 2s 主執行緒 | 結果 2s 主執行緒 | 平均 rAF 間隔 |
|---|---:|---:|---:|---:|
| 20261118_card_pack | 13.39s | 563ms | 653ms | 16.4ms |
| 20261118_blind_box | 14.04s | 1252ms | 931ms | 57.6ms |

兩頁可完成開獎，離屏 WebGL 暫停；CPU 6 倍降速加軟體 GPU 的沙漠場景不是 60fps，不以模擬數字保證實機。素材檢查打勾但不符均 0；卡包 89/96、盲盒 82/89，既有未交付項目沒有改標完成。

Poster 原影格 PNG：180762 bytes；交付 WebP：59094 bytes，320×320、保留透明。
