# P0 主視覺：本機待審，未上線

素材 commit `d913f7f`；交付勾選 commit `077f243`。P0 11/11 已提交，色票需人工確認；全清單 12/53，非全案完成。審核欄未更動。

| 使用者原話 | 本次處理 | 直接驗證與證據 | 未完成／未驗證 |
|---|---|---|---|
| 繼續完成主視覺 按優先級來做 | P0：手機／桌機透視舞台、台口、三語主標、外框、底座、指針、按鈕及色票（d913f7f） | [手機整頁](art-source/verification/p0/en-390.png)、[桌機整頁](art-source/verification/p0/en-1440.png)；[檢查紀錄](art-source/verification/p0/checks.json)含 en/ko/th × 390/1440 × 初始／抽獎中／結果／次數用完，37 筆檢查，0 JS 錯誤／HTTP 錯誤／破圖／橫向溢出／漢字外洩；儲存被拒、空資料及剪貼簿被拒測試通過 | 正式站未更新；P1/P2 尚待新版驗收；P3 動態需重做共用頭尾基準幀 |
| 第一個呼吸與扎眼忽大呼小的待機很怪，請優化，但這個可以往後面排程，先做完整體轉盤遊戲的主視覺 | idle-1 保持移出輪播，先交 P0 | config.js 的 idle 僅含 idle-2、idle-3；交付表保留退回欄 | idle-1 未修復；其餘四段也仍是示意 GIF，未標為正式交付 |

主視覺 10 張 WebP 已核對尺寸；每張 <300 KB（背景 <500 KB），wheel-frame 中央直徑600完全透明，stage-floor 底部20px精確 #FFF6EA。素材源圖與輸出程式見 source/main-visual/ 與 tools/build_main_visual.py。新增地板與底座套圖時一併修正兔子腳尖被台口遮住、桌機底座懸空的定位。

P0 預覽後下一批為 P1：聚光燈、盤面光澤、結果彈窗、一般按鈕、規則底紋、期間與次數徽章、卡片框／標題、分享圖。P0 頁面中的下半部等其他元件仍沿用既有稿，不代表 P1 已驗收。

## 上線限制

`git push origin main` 被 GitHub 拒絕：Permission denied to JKson188，HTTP 403。檔案只在本機 main；沒有部署成功證據，正式站看不到此版本。

`pre-report-check.sh`（077f243）：

```
PASS 工作樹沒有未提交的改動
FAIL HEAD 077f243 不在 origin/main：只在分支上，正式站看不到
PASS npm run build 後 tailwind.css 沒有差異
```

完整輸出見 art-source/verification/p0/pre-report.txt。此報告取代先前 ART_DELIVERY.md 的進度描述，舊版 GIF 與舊清單統計不可視為新版驗收。
