# 主題 loading 與月兔卡背

## 需求對照

| 使用者原話 | 實作／視覺證據 | 驗證範圍 | 未驗證 |
|---|---|---|---|
| 目前所有的event 的 loading都要根據該風格重新設計loading樣式 | [四款真實390px畫面](loading-overview.jpg)，四個活動入口各自使用新素材、輪廓、材質、進度槽與動態 | en/ko/th × 360/390/1440（36組）；圖片失敗、10秒逾時退場各四款 | iOS/Android實機 |
| 中間的圖案改成神秘的兔子花紋 | [實際開獎畫面](rabbit-card.png)，中央換成長耳月兔金屬雕花，紫晶嵌面／月亮紋樣，保留外框與月蝕；600×900卡背及256×384抽出卡同步 | 卡包與盲盒12組回歸，卡包開封、翻卡、收下及語系切換 | 品牌／美術終審未代表使用者確認 |

活動範圍：`20261111_lucky_wheel`、`20261111_survival_spin`、`20261118_card_pack`、`20261118_blind_box`。`source/` 中美術審閱頁並非活動入口。

## 設計

- 幸運轉盤：酒紅天鵝絨、皇冠黃銅燈泡環、中央百分比、鍍金軌槽與暖光呼吸。
- 生存輪盤：墨綠／桃紅機械虹膜、掃描光、分段式進度、等寬字百分比。
- 宇宙卡包：浮動紫晶星儀、細銀軌道、星芒進度槽與暗紫背景。
- 沙漠盲盒：綠松石神燈、黃銅雕紋、拱門與金砂進度。

原稿保留 `source/loading/emblem-original.png`，網頁使用480×480 RGBA WebP，以240px呈現；容量見 [compression.json](compression.json)。月兔卡背原稿另存，沒有覆蓋之前晶核原稿。

進度由原有資源完成數驅動，失敗也記為已處理；維持10秒截止，不加入最低展示時間或假進度。共用CSS從入口HTML載入，主題不依賴應用程式啟動。文字為動態三語，進度使用有名稱及0–100值的progressbar。減少動態模式停止裝飾動畫。

## 檢查

- `scripts/verify-event-loaders.cjs`：[36組loading、四款停滯與四款失敗圖結果](loading-tests.json)。截圖以阻擋一張舞台背景保留真實載入畫面，進度不是偽造。
- `scripts/check-event-loading.cjs`：兩個轉盤 × en/ko/th 載入／動態圖失敗備援／旋轉開獎，另兩款各一次停滯截止，通過。
- `scripts/verify-unbox-art.cjs`：[12組開包／開箱與失敗情境結果](gameplay-tests.json)。含空資料、零次數、儲存及剪貼簿拒絕、resolver錯誤、WebGL備援。
- loading 以正常亮度390px檢視，另檢視三語360px與桌機置中版本。四款 `*-final.png` 與 `*-motion.png` 是相隔1.1秒的真實狀態；裝飾運動不影響進度值。
- 效能條件：Chromium SwiftShader、CPU6倍、1.6Mbps／150ms；結果見performance.json。不是手機實機FPS保證。

此批沒有修改後台介面、獎品機率或扣次邏輯。正式活動仍使用既有mock或外部內容注入。

實作提交 `84ae6d5`。效能檢查另修正 modulepreload 與 Three.js import 的版本參數一致，避免同一套件以兩個 URL 重複下載；loading 測試加入防重複版本斷言。

## 動態與效能補充

四段約3秒的實際CDP錄影： [幸運轉盤](20261111_lucky_wheel.mp4)、[生存輪盤](20261111_survival_spin.mp4)、[宇宙卡包](20261118_card_pack.mp4)、[沙漠盲盒](20261118_blind_box.mp4)。三語小螢幕對照見 [locales-review.jpg](locales-review.jpg)。

套件版本一致性修正提交 `30b03a0`。修正後慢網路模擬：卡包約12.1秒／2.10MB，盲盒約11.2秒／1.97MB，幸運轉盤約4.3秒／0.62MB，生存輪盤約3.9秒／0.54MB。數字包含模組啟動至loading退場，並非僅loader圖片下載時間；保留原本應用啟動後10秒退場上限。四款額外loading交付圖分別約51／40／108／57KB。詳細請求與環境見performance.json。
