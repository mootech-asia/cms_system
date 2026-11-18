# 活動場景與交界修正驗證

這次取消上一輪自行改成「19 個小包＋1 個大包」的排列，恢復大型卡包在同一個環上呈現。20 包仍可逐包選取；遠方卡包使用較少幾何分段，沒有另做第二排小包。這是修正我上一輪擅自改動的排列。

## 逐項需求與證據

| 使用者原話 | 實作 | 實際證據 |
|---|---|---|
| 目前所有的event 的 loading都要根據該風格重新設計loading樣式 | 四款獨立主題 loader；提交 84ae6d5、30b03a0、02cee78 | ../event-loading/README.md：36 組多語／寬度、失敗與逾時檢查 |
| 中間的圖案改成神秘的兔子花紋 | 保留外框，改月蝕兔紋與紫晶浮雕；84ae6d5 | ../event-loading/rabbit-card.png |
| 卡包我要原來的那種排列方式 | 移除上下分離陳列，單一大型環形排列；保留 20 包 | card_pack.png、refine.log 的 20 次循環選擇 |
| 卡包側邊。你也處理一下 | 紫色金屬箔折邊貼圖、厚度與中段鼓度 | card_pack.png、source/3d/pack-side-original.png |
| 盲盒寶箱的整體位置再往下 | 道具下移、延長舞台空間，保留腳底接觸影 | blind_box.png |
| 盲盒的花瓣可以變成花瓣風暴都沒關係 | 104 花瓣與 136 沙塵，近景大瓣及遠景小瓣；中央道具區降透明度 | blind_box-sequence.jpg，相隔 650ms 實際影格 |
| 左邊的植物還可以隨風飄逸的話就更好了 | 左花枝與棕櫚拆成透明圖，獨立擺動；建築保持靜止 | blind_box-sequence.jpg |
| 換成正確的活動名稱 | CMS 名稱及語系字典使用正式活動名稱，保留路由與翻譯 key | menus.json；來源 v1.5、v2、v3、v4、v5、v6 與 v2/v3 mobile |
| 選好卡包後會置中放大 才能撕卡包 | focusing 階段禁用開啟；置中放大結束進入 ready | card_pack-ready.png、regression.log |
| 我希望是有範例的那種慢慢撕開效果 | 4.2 秒分段開包，封口由左向右掀起，之後釋放封條、抽出卡片 | card_pack-opening.png |
| 寶箱跟後面背景要有一點景深關係。目前看起來透視很怪 | 依背景地平線計算鏡頭俯角，遠箱後退、暖色空氣透視，前箱接地 | blind_box.png、blind_box-opening.png |
| 這個圈圈我希望他能不斷地發光。像魔法陣一樣 | 透明星紋圓陣貼合地面透視，慢轉且亮度持續呼吸，不熄滅；氣旋限地面圓心 | card_pack-sequence.jpg |
| 盲盒的loading。神燈希望可以讓他冒煙 | 壺嘴三道交錯上升煙霧，淡入並向上消散 | smoke-sequence.jpg |
| 處理一下兩個區塊的過渡／一樣處理過度 | 移除沙漠硬金線；場景底部漸入各自規則區底色，規則區底紋逐漸浮現 | card_pack.png、blind_box.png 的跑馬燈與規則交界 |

## 驗證範圍

- `verify-unbox-art.cjs`：兩款 en/ko/th × 390/1440，開啟、結果、扣次、紀錄、音效、分享；360×640 按鈕；禁止儲存、拒絕剪貼簿、空資料、零次數、開獎錯誤、WebGL 備援。
- `verify-unbox-refine.cjs`：20 包循環、背景音樂啟動／靜音／恢復／循環／開獎降音量與離頁暫停。
- `verify-unbox-scenes.cjs`：減少動態、離屏暫停、寶物結果、語系切換。
- `verify-unbox-swipe.cjs`：WebGL 與備援向上拖曳開箱，短拖／向下／水平不誤開。
- `npm run build`：通過，輸出見 build.log。
- 動態目視檢查：390px 實際畫面，650ms 間隔三影格；完整頁面檢查交界、道具、植物與文字空間。
- CMS 選單實際英文截圖巡檢八個入口；menus.json 中 v1.5 與 v2 mobile 的隱藏選單沒有可見連結，未視為選單互動驗證通過。未逐一操作所有 CMS skin、登入狀態及語系選單。
- 手機使用 Chromium 裝置尺寸模擬，未使用實體 iOS/Android；並非品牌美術終審通過。

原稿保留於兩款 `source/`，交付為對應 `assets/img/` WebP。場景動態遵守 reduced motion 與離屏暫停；loader 煙霧隱藏後不再繪製，不新增計時器。
