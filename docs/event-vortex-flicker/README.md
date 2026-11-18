# 沙塵圓環閃爍修正

使用者原話：「沙圈圈動畫會什麼會一直閃」。

原因是透明圖集的兩張影格以 source-over 互相覆蓋，雖然權重合計為 1，重疊區仍被再次乘上透明度，造成每 200ms 中途變暗。改為加總加權的預乘透明色彩（Canvas lighter），繪製後還原合成狀態。保留原圖集、播放速度與自然濃淡，沒有增加下載素材。

## 實際渲染驗證

`node scripts/verify-vortex-blend.cjs`（先於 repo 根目錄啟動 8895 靜態伺服器）：在 Chromium 執行真正的動畫模組，對比 git 691230d 舊版，每 50ms 取樣一次、共 81 次，跨過 3.2 秒循環接點。

- 舊版全段亮度起伏 25.85%；新版 5.35%。
- 逐影格測量：原本交接中點平均下降 22.59%；新版沒有中點變暗（8-bit 捨入約 +0.8%）。原圖集自身濃淡差約 4.78%，沒有將其抹平。
- [亮度曲線](brightness.png)、[實際模組取樣](actual-renderer.json)、[逐影格測量](blend-measurements.json)。
- 活動實際開獎截圖：[影格一](reveal-1.webp)、[影格二](reveal-3.webp)。截圖確認呈現，連續亮度取樣確認閃爍修正；單張截圖不作為動畫證據。

## 功能與限制

- `verify-unbox-art.cjs`：兩活動 × en/ko/th × 390/1440，共 12 流程，另有 360 操作、禁用儲存/剪貼簿、空內容、零次數、獎項解析失敗、WebGL fallback；[結果](regression.log)。
- `verify-secret-art.cjs`：隱藏卡片三語三尺寸，沙塵動畫、減少動態暫停、關閉暫停、圖集失敗仍可領取；[結果](visual-tests.json)。
- `npm run build` 通過；[輸出](build.log)。
- 僅修正沙塵動畫混合與快取版本。真實手機 GPU 與所有瀏覽器未實測，不宣稱實機固定 FPS。

效能模擬：390×844、CPU 6 倍降速、SwiftShader、1.6Mbps/150ms 冷快取。冷載入 13.63s、待機 2s 主執行緒 1396ms、結果 2s 主執行緒 1047ms、平均 rAF 80.8ms，離屏 WebGL 暫停，開獎成功且無 pageerror。此高負載軟體 GPU 條件不流暢；本次不宣稱提高 FPS。[原始數據](performance.json)。

實作提交：45cc052。發布後另以正式站開獎 Canvas 取樣與領取檢查確認部署。
