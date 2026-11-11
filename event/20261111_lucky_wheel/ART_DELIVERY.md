# Lucky Wheel 美術交付：新版動畫待審

依最新版製作清單與使用者「用新版設定」指示製作。所有審核欄保留由業主填寫；這份文件不代表正式站已更新。

## 交付內容

- 21 張靜態 SVG、三語標題與六組盤面色票：`6a34f07`。
- 角色設定圖：`reference/rabbit-turnaround.png`，`6a34f07`；使用者已採用此設定。
- 5 個透明循環 GIF，均 400×500、48 幀、2 秒；實測檔案 1.19–1.40MB。
- 240 張含 alpha 的 PNG：`source/mascot-frames/`。
- 10 張 1024×1536、3×4 原始序列圖：`source/mascot-sheets/`。
- 5 張關鍵幀與角色設定圖並排比對：`source/mascot-compare/`。
- 個別動態預覽：`source/mascot-preview.html`。

| 動作 | GIF／PNG／比對圖 commit |
|---|---|
| idle-1：呼吸眨眼 | 47dd674 |
| idle-2：側耳聆聽 | 0e22a5f |
| idle-3：揮手扶眼鏡 | ab7eab9 |
| spinning：握拳期待 | a3b6cbf |
| result：歡呼比讚 | 37e00d8 |

每個動作包含 24 個生成關鍵幀，利用光流補幀為 48 幀。GIF 以 40／50ms 延遲組合達到平均 24fps；暖色 matte 為 #FFE6CC，落地基準 y=480，歡呼有刻意的 10px 離地位移。這些是 AI 生成序列，不是綁骨骼的 3D 動畫；配件小字、毛髮與姿態可能有細微逐幀變動，需以動態預覽做視覺審核。

重建方式：`python tools/build_mascot.py <idle-1|idle-2|idle-3|spinning|result>`。需 Pillow、FFmpeg、ImageMagick。

## 使用者需求與證據

| 使用者原話 | 交付證據 | 驗證範圍 | 未驗證 |
|---|---|---|---|
| 用新版設定 | 以上五筆 commit；五張角色比對圖 | 官方配色、羽絨背心、左胸徽記、耳麥、裸兔掌目視比對 | 使用者對逐幀美術的最終審核 |
| 美術製作清單已更新，並給了確認提交方式。請更新 | DELIVERY_CHECKLIST.md 提交欄及逐項 commit | check_assets.py；不改業主審核欄 | 遠端發布 |
| 每個gif都要讓我看預覽效果 | source/mascot-preview.html 與五個 GIF | Chromium 五個圖皆可播放；兩次取樣畫面不同 | Safari、真實手機 |

## 驗證紀錄

`art-source/verification/animation-specs.json`：五組 GIF 尺寸、幀數、時長、檔案大小與 240 張 PNG 規格。

`animation-runtime.json`：五個 GIF 實際播放、待機 1→2→3 輪播，console 無錯誤。

`browser-results.json`：en／ko／th，各 390px／1440px 無橫向溢出、無破圖；實際抽獎切換 spinning→result、關閉彈窗、次數遞減至禁用、空獎項情境。截圖同目錄。

`loop-metrics.json` 保留循環接點與逐幀差異數值供追蹤；數值不取代人工觀看。

`npm run build` 已執行；此活動免建置。選配三個音效未另製，沿用合成音效。會員／後端 API、正式派獎仍是既有 mock，未修改獎項文案或移除 mock 工具列。

## 發布

先前 Git 推送回傳 `Permission to mootech-asia/cms_system.git denied to JKson188`（HTTP 403）。本地提交／素材交付不等於已上線；以最後的遠端推送與部署結果為準。
