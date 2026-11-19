# 新增機制效能與回頂按鈕驗證（2026-11-19）

基準版本：`87655c8`。範圍為自動十轉／Skip、紀錄分頁、儲存、音效節點、提示循環，以及四款活動的回到頂部按鈕。原有美術解析度、獎項與逐次結算方式保留。

## 修改

- 紀錄分頁先切當頁 10 筆，再反轉；以 DocumentFragment 一次更新清單。
- Skip 十轉逐次保存結果，整批完成後才更新一次紀錄清單；略過不需要的中間畫面狀態與等待。
- 快取只會追加的紀錄 JSON，新增結果只編碼新紀錄；更換或縮短紀錄陣列會重建快取。每次扣次數與每次結算仍寫入原來的完整玩家儲存格式。
- 音效節點結束／失敗後自 Set 移除，避免十轉累積已停止的節點。
- 提示在載入遮罩期間、場景離屏或分頁隱藏時停止循環，遮罩消失或返回後重新開始；精靈在載入遮罩後方也暫停渲染；動畫離屏暫停時，開包仍能在期限內完成結算。
- 回頂按鈕沿用共用 36px 美術與 44px 點擊區；滑到規則區顯示，到頂隱藏，支援英／韓／泰與內部中文及減少動態偏好。使用 IntersectionObserver 和不讀取版面的被動捲動事件，無常駐輪詢。

## 同條件操作測量

本機 Chromium、軟體 WebGL、390×844、CPU 模擬降低 6 倍、10,000 筆歷史、減少動態開啟、本機 HTTP 無網速限制。這是單輪配對壓力測試，會受主機排程影響，不能當作真機速度保證。音效保留測試不降 CPU，使用明確停止與強制 GC；不是所有頁面記憶體的測量。

| 活動 | 20 次換頁（前 → 後，ms） | Skip 十轉（前 → 後，ms） | 十轉新增／移除紀錄列（各） |
|---|---:|---:|---:|
| Lucky Wheel | 261 → 110 | 3302 → 2232 | 100 → 10 |
| Survival Spin | 218 → 179 | 2886 → 1706 | 100 → 10 |
| Card Pack | 443 → 380 | — | — |
| Blind Box | 448 → 359 | — | — |

- 十轉紀錄列更新量減少 90%；上述壓力測試的 Skip 耗時下降約 32%／41%，完整紀錄仍為 10,010 筆。
- 20 次換頁反轉處理量：200,000 → 200 筆（不是「頁面快 1,000 倍」）。
- 12 次轉動排程、停止及 GC 後仍被保留的音效節點：Lucky Wheel 600 → 0；Survival Spin 288 → 0。兩邊建立的音效節點數相同。
- 場景離屏 30 秒的提示 class 更新：卡包與盲盒各 3 → 0；恢復可見後循環正常。

## 冷快取、慢網路檢查

390×844、CPU 6 倍降速、RTT 150ms、下載 1.6Mbps、上傳 0.75Mbps、減少動態開啟。本機 HTTP 未啟用傳輸壓縮；不是 GitHub Pages/CDN 的真實傳輸測量。下表是 DOM 就緒／載入遮罩移除時間，不表示所有背景素材均已下載完成，也沒有對此宣稱前後改善。

| 活動 | DOM 就緒 ms | 遮罩移除 ms | 當時已完成資源的 encoded bytes |
|---|---:|---:|---:|
| Lucky Wheel | 2491 | 4697 | 653617 |
| Survival Spin | 2213 | 3871 | 566809 |
| Card Pack | 6322 | 16731 | 2457643 |
| Blind Box | 6303 | 14635 | 2404164 |

四款皆能在上述條件下捲到規則、顯示回頂按鈕並返回頂部，未觀察到 JavaScript 例外。新共用腳本約 2.3KB；箭頭使用既有 4.7KB 共用圖，沒有新增角色或背景圖片。卡包／盲盒冷載入仍受 3D 程式與主題素材流量影響，本次沒有改動其畫質。

## 功能驗證

- 編碼器每一步與 JSON.stringify 的解碼結果相同：1,000 次追加、Unicode／跳脫字元、空項、縮短、重設、替換與庫存欄位。
- 自動十轉、單抽 Skip、再次抽獎、次數不足、Again 十次上限、每次紀錄與音效判斷。
- 卡包／寶箱批次開啟、部分失敗、隱藏三張 EPIC 以上、100 次累計與補次數後保留進度。
- 10／10／3 分頁、各語系切換與新獎項保留；零庫存提示、淡出與恢復。
- 四款回頂按鈕在 360×640／1440×900 顯示、點擊、隱藏、36px 美術及語系；v1.5、v2、v3、v4、v5、v6 與 v2／v3 手機版共 32 個入口的分頁和回頂操作。
- 真機觸控、Safari／Firefox、跨裝置後端與長時間多小時測試未驗證。

## 重跑

```sh
node scripts/verify-player-encoder.cjs
node scripts/verify-event-back-top.cjs
node scripts/verify-event-lifecycle.cjs
node scripts/verify-event-refinements.cjs
node scripts/verify-event-embeds.cjs
MEASURE_OUT=/tmp/mechanisms.json node scripts/measure-event-mechanisms.cjs
MEASURE_OUT=/tmp/entry.json node scripts/measure-event-entry.cjs
```

原始數據：[優化前](event-mechanism-performance-20261119-before.json)、[優化後](event-mechanism-performance-20261119-after.json)、[慢網路](event-mechanism-performance-20261119-entry.json)。
