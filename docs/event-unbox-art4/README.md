# 宇宙卡包／沙漠寶箱改版驗證

程式與美術 commit：`5844c7b`。交付版本：`20261118-art4`。兩頁維持 480px H5 上限；獎項、次數和發獎流程仍為 mock。

| 使用者原話 | 本次變更（5844c7b） | 實際驗證與證據 | 未驗證 |
|---|---|---|---|
| 這幾個部分設計都很弱。請強化 | 重做選擇提示、主要按鈕、中獎跑馬燈與資訊面板 | [宇宙 UI](card-ui.jpg)、[沙漠 UI](box-ui.jpg)；六個道具逐一點選及返回 | 實體手機 |
| 這個底部是什麼回事 | 移除波浪與星星頁尾，延續主題底色 | 兩張全頁 UI 圖，兩頁均無 ev-footer-deco | 無 |
| 你主標的多語系呢？ | 六張 en／ko／th 藝術字，中文僅內部預覽；頁籤固定英文 | [六張主標](titles.jpg)、[12 組語系與尺寸測試](matrix.json) | 母語者文字美術校對 |
| 盲盒打開應該看起來會是實質的寶物不是卡片。 | 開箱直接顯示獎品物件、接地影與金屬底座；移除翻卡步驟 | [單件寶物](treasure.jpg)、[多件寶物](multi-treasure.jpg)；領取後紀錄與次數正確，揭曉中可切語系 | 正式後台獎品素材與發獎 |
| 兩款都要做場景效果／沙漠的要有飄動的花瓣。還有風沙／宇宙的要有星星閃耀。還有一些氣旋 | 獨立 Canvas，沙漠花瓣與低空沙流；宇宙星光與雙氣旋 | [場景測試](scenes.json)；動態影格不同、減少動態與移出畫面後保持靜止 | 實體 GPU 表現 |
| 沙漠寶箱點開十上方蓋子會消失。請修正 | 拱蓋雙面材質與隨鉸鏈轉動的內面板 | [開蓋階段](lid-stages.jpg)，正常開啟及跳過動畫均可進入寶物畫面 | iOS Safari 實機 |
| 兩款ＵＩ不要同個系列。要依照風格做不同的風格設計 | 宇宙深色切角科技面板；沙漠黃銅圓弧、綠松石與羊皮紙；含語系、日期、次數、提示、按鈕、跑馬燈、規則／紀錄面板 | 兩張全頁 UI 圖、390／1440 寬三語檢查，360×640 主操作可見 | 實體手機 |
| 卡包的卡片設計你也要再做更精緻一點 | 新星盤寶石卡背、星雲雕花卡面、四種稀有度邊光與星數、一次箔光反射 | [卡背](card-back.jpg)、[傳說卡面](card-front.jpg)；common／rare／epic／legendary 各自翻開與領取 | 印刷或實體輸出 |
| 這個符號幫我轉１８０度 | 兩頁僅旋轉手勢圖片，外層框與高光方向不變 | UI 圖及 [180 度檢查](scenes.json) | 無 |

驗證指令：

- `CHECK_OUTPUT=/workspace/event-update/matrix-final node scripts/verify-unbox-art.cjs`：PASS，2 活動 × 3 語系 × 390/1440，另驗 360 控制區、儲存／剪貼簿拒絕、空獎品、零次數、取得獎項失敗與 WebGL fallback。
- `CHECK_OUTPUT=/workspace/event-update/polish-final node scripts/verify-unbox-polish.cjs`：PASS，兩活動六個位置逐一用滑鼠選擇，切三語主標與尺寸。
- `CHECK_OUTPUT=/workspace/event-update/scenes-final node scripts/verify-unbox-scenes.cjs`：PASS，場景動畫、減少動態、畫面外暫停、頁尾移除、手勢 180 度、三件寶物與揭曉中切語系。
- `/workspace/event-update/cards.cjs`：PASS，四種稀有度翻卡／領取，等待入場完成後目視卡背。
- `check_delivery.py`：[卡包](delivery-card.txt)、[盲盒](delivery-box.txt) 均無 FAIL；原有人工審核及暫緩的吉祥物動畫保持原狀。

[效能資料](performance.json)：Chromium 軟體 WebGL、6× CPU 降速、1.6Mbps／150ms 網路模擬。卡包載入約 9.8 秒、寶箱約 8.6 秒；2 秒抽樣 rAF 平均約 60／51ms。兩者可完成開啟，但這不是實機 60fps 保證，也不能用來代表手機 GPU。粒子限制 25fps，離開畫面或分頁隱藏時停繪。

主標及新卡片原稿為點陣 PNG；不是可編輯字型或分層向量檔。舊版 SVG 原稿仍保留。各主題未設定其他 skin；本輪驗證 default。

正式站驗證會在部署成功後進行；本文件的圖像與測試資料為本機瀏覽器證據。公開站 Chromium 因容器憑證信任問題使用 ignoreHTTPSErrors；另以正常憑證驗證的 curl 比對正式站檔案。
