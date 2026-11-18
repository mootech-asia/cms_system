# 卡包互動與沙漠分層景深

本批延續既有大型單環排列；沒有新增第二排小卡包。四層沙漠背景是配準圖片的 2.5D 合成，寶箱／卡包是 WebGL 3D。素材原稿保留，頁面使用 WebP／MP3。

## 逐項對照

實作提交：`c6f8443`。下列為工程與實際畫面自查，並非業主美術終審。

| 使用者原話 | 實作／證據 | 驗證範圍 | 未驗證 |
|---|---|---|---|
| 後面的漩渦太爛。可以優化過高級一點嗎。用你剛剛做的沙塵全窩。做連續圖動態 | 16 格透明沙塵圖集、相鄰影格淡化、3.2 秒循環；vortex.webp、visual-tests.json | 真實 390 寬結果畫面，動畫／減少動態／關閉暫停／圖集載入失敗仍可領取 | 實機 GPU |
| hover到卡包的時候要有果凍效果。參考spin的那種彈動的方式 | 173ms 的壓扁→伸展→回復，沿用 Spin 時序；hover-0～3.webp | 滑鼠進入卡包，固定時間影格檢查 | 真實觸控裝置沒有 hover |
| 斯卡包的速度再快一點。或是判定快的撕開。跟慢的撕開 | 快速 900ms、慢速最高 2600ms，按鈕 1700ms；interactions.json | 頂端封條快／慢滑動，檢查音效接收時長與成功開獎 | 原生裝置手感 |
| 沙漠的背景要有景深效果 | 遠景、柱廊、地板、布簾分開疊合，寶箱及文字保持清晰；depth-390-near.webp | 360／390／1440 | 實體 3D 背景模型不在本次實作 |
| 景深還要時不時有深有淺。感覺好像真的在風沙之中 | 四層獨立週期／相位／強度；depth-390-near.webp、depth-390-far.webp、depth-tests.json | 相隔 4 秒畫面及四層 opacity 獨立變化；減少動態靜止 | 實機效能 |
| 背景拆成幾個部分分別出  左上的布簾 前面的柱子 後面的沙漠。還有主場景的地板 這幾個物件分別出 再組合 | source/scene/layers 四張 PNG 原稿、assets/img/scene/layers 四張壓縮圖；共享底部對齊透視與獨立景深 | 四層載入、實際手機／桌機合成、單層失敗退回完整背景且可開獎 | 真 3D 幾何背景、自由移動攝影機 |
| 卡包要再設計出一種隱藏卡包。卡包設計。卡片設計都要突顯隱藏版的高貴 | 黑曜石／鉑金／月光石，兔子包裝與卡片正背；secret-pack.webp、secret-back.webp、secret-front.webp | 正常／隱藏版切換；隱藏卡三語 × 360／390／1440 | 業主美術終審 |
| 累積次數目前可以包含使用外掛重置來累積次數。 重點是。是５０抽以內隨幾出一包。不是50抽才有一包 | 獨立持久化成功開包計數，每次隱藏後下一次在 1–50 內均勻選定；失敗不累積；unit-secret.log、interactions.json | 500 次模擬、重載、重設次數、失敗退款、禁用儲存 | 後端跨裝置／防作弊計數未接入 |
| 有隱藏卡包的時候要有特別的提示聲音 | 2.5 秒低音＋和聲鈴音，解鎖後每次出現播一次；audio.json、interactions.json | 音檔解碼／播放／一次提示／靜音立即停止 | 原生喇叭／iOS 靜音鍵聲學驗收 |
| 撕開卡包要有撕開卡包的音效 | 新 1.7 秒合成鋁箔顆粒／撕裂聲，播放速度對應撕開速度；source/audio/foil-tear.wav、audio.json | 音檔與播放速率、靜音阻止啟動 | 真實錄音；本檔為合成音效 |
| 獎品要置中 | 普通卡上方圖案區與隱藏卡主視覺區置中；prize-centered.webp、visual-tests.json | 實際結果畫面、隱藏卡三語三寬度水平中心誤差小於 1px | 任意後台自帶不對稱透明圖案的視覺中心 |
| 在這個選種畫面時要能轉動 | ready 畫面本體拖曳旋轉，封條拖曳開啟；rotation-0～2.webp、rotation.log | 側面／背面、旋轉不扣次數、從側面按按鈕開獎 | WebGL 不可用時只有平面 fallback |
| 或是可以稍微調整一點 | 卡包鏡頭高度 2.3→2.5，半徑與 20 包排列不變；ring-subtle.webp、refine.log | 手機與桌機呈現、逐包切換共 20 包 | 業主美術終審 |
| 其他調整也都完成就一起發佈吧 | 本文件列出的修改同批提交；pre-report.txt、發布流程連結於最終回覆 | 兩個活動頁，default 主題；沒有其他 skin；未增加登入功能 | 真實帳戶與後台獎項入帳 |

## 驗證與效能

- `verify-unbox-art.cjs`：en／ko／th × 390／1440，初始→開獎→領取、分享／靜音；另測 360 操作、禁用 localStorage／clipboard、空資料、零次數、後端拒絕、WebGL fallback。
- `verify-secret-art.cjs`：隱藏卡三語 × 360／390／1440；沙塵圖集動態與靜態偏好／關閉暫停／圖集失敗。
- `verify-pack-rotation.cjs`、`verify-unbox-secret.cjs`：旋轉側背面不開包／不扣次數，封條快慢撕開、重設和重載保留隱藏累積。
- `verify-desert-depth.cjs`：四層獨立景深、減少動態與缺圖 fallback。
- `verify-unbox-scenes.cjs`：大幅捲動後等離屏且渲染穩定 500ms，再驗 500ms 不變；修正非同步素材載入及 resize 在不可見時繪製，保留完整失敗／複驗紀錄。200ms 等待曾在軟體渲染壓力下看到尾幀。
- `verify-unbox-swipe.cjs`：沙漠向上拖曳開箱，反方向／短滑不開啟；WebGL 與平面 fallback。
- `verify-unbox-refine.cjs`：兩款 BGM 延後解鎖、循環、音量壓低與恢復、靜音與背景頁籤暫停，20 包循環。
- `verify-pack-audio.cjs`：音檔時長／速率、靜音立即停止與阻止新播放；沒有以此代替原生音訊聽感驗收。
- `verify-unbox-performance.cjs`：Chromium SwiftShader，390×844，CPU 6 倍降速、1.6Mbps／150ms、冷快取；結果見 performance.json。屬模擬，非實機 FPS 保證。
- `assets.json` 列出交付容量；四層壓縮前後見 blind_box/source/scene/layers/compression.json。沙塵圖集首次互動才請求，隱藏版貼圖只在出現時請求。
- `npm run build`、`git diff --check`；發布前後檢查見 pre-report.txt。

## 整合限制

隱藏版屬外觀版本，沒有改變獎品機率／稀有度。現有活動是靜態 mock；累積與下一次出現位置保存在同源 localStorage。預覽重設不清除，但使用者清除瀏覽器資料、換裝置或多分頁競爭不等同後端交易；正式串接應由後端原子地管理計數／發放，`EVENT_RESOLVE` 已收到 edition 與 drawNumber 供整合。

### 本次模擬量測

| 活動 | 冷載入直到 loading 隱藏 | 已載入資源 | 待機 2 秒主執行緒時間 | 結果顯示 2 秒主執行緒時間 | rAF 平均間隔 |
|---|---:|---:|---:|---:|---:|
| 20261118_card_pack | 13.40s | 2.31MB | 487ms | 684ms | 17.0ms |
| 20261118_blind_box | 13.93s | 2.45MB | 1175ms | 974ms | 53.9ms |

CPU 6 倍降速／軟體 GPU 模擬中沙漠較吃效能（平均 rAF 約 54ms），不宣稱 60fps；兩頁都可開獎，離屏 WebGL 不再繪製。交付檢查：卡包 88/95、盲盒 81/88，打勾但不符均為 0；既有未交付項目沒有改標為完成。
