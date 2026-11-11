---
name: event-workflow
description: "在 cms_system 的 event/ 底下新增或修改任何活動頁（轉盤、刮刮樂、簽到、抽獎、排行榜、限時活動…）時使用；也用在開美術需求單、交給 GPT 產素材、收美術檔套圖、核對美術是否交付、吉祥物 Moo Rabbit／熊北素材相關工作。Triggers include: '新增活動', '做一個活動頁', '活動 mock up', '開美術需求', '美術製作清單', '讓 GPT 做素材', '套圖', '收檔案', '吉祥物', 'Moo Rabbit', '兔比', '熊北', 'event page', 'campaign page', 'art brief', 'delivery checklist'。固定工作流：mock up → 製作美術圖 → 套用，並沿用 20261111_lucky_wheel 累積的規格、檢查與踩過的坑。"
---

# 活動頁工作流（mock up → 製作美術圖 → 套用）

範本：`event/20261111_lucky_wheel/`。新活動先讀它的 `DESIGN_TASKS.md`、`GPT_ASSET_BRIEF.md`、
`DELIVERY_CHECKLIST.md`、`assets/js/*.js`，照同樣結構做，不要重新發明。

## 第 0 步：開資料夾

- 命名 `event/YYYYMMDD_event_name[_N]`（英文小寫底線；同日同名才加 `_2` 起的編號），並在 `event/README.md` 活動列表加一列。
- 結構：`index.html`、`DESIGN_TASKS.md`（美術需求）、`GPT_ASSET_BRIEF.md`（給 GPT 的步驟與提示詞）、
  `DELIVERY_CHECKLIST.md`（交付勾選表）、`reference/`、`assets/{css,js,img}`。
- 免建置純 HTML/CSS/JS；CSS 用 token（`:root` 變數），不寫死任意色碼。

## 第 1 步：mock up（先能玩、先能看）

1. **每一個視覺元件都是「可換的圖片槽」**，不是只有主圖：背景（手機＋桌機）、底紋、主標、按鈕、彈窗、
   徽章/標籤、卡片外框（九宮格）、卡片標題緞帶、頁尾裝飾、圖示、分享預覽圖、吉祥物動態。
   路徑集中在 `assets/js/config.js` 的 `images`，換圖＝同檔名覆蓋或改 config。
   - 背景類用 `data-img`；需要桌機版的加 `data-img-desktop`（≥768px 自動切換）。
   - 元件底圖用 CSS 變數 `--ev-img-<key>`，由 JS 從 config 寫入。**`url()` 放進 CSS 變數時要先轉絕對網址**
     （`new URL(src, document.baseURI).href`），否則會以樣式表位置解析而 404。
2. **圖上不放會變的文字**：按鈕、彈窗、徽章文字一律程式疊字；只有活動主標是「每個語系一張圖」。
3. **後台內容只留空位＋假資料**：獎項、規則、次數等由我們的後台提供（`window.EVENT_CONTENT`，格式寫在
   `store.js` 開頭）。mock 用 config 的 `defaultContent` 假資料；後台沒給時要有空狀態（例：規則區虛線空位）。
   不要自己做後台。
4. **語系**：前台只有 en/ko/th（預設 en）；zh 只供內部預覽，Ctrl+Alt+L（Mac：Control+Option+L）切換，
   不在選單、焦點在輸入框時不觸發；缺翻譯退回 en，絕不退回 zh。分頁標題固定英文。
   **任何對外可見的地方都不得有中文**——含 alt/aria、toast、換圖標籤、佔位圖、分享文案。
5. **舞台／場景美術方向**：預設做成**有角度、有透視的 3D 世界觀**（地板有縱深與透視線、側牆往內收、光圈打在地板），
   不要正面平面背景；背景以「貼齊底部、等比填滿」顯示，地板放下半部。**真實空間感**：主要道具（例如轉盤）要有底座
   立在地板上；吉祥物站在道具**前方**（壓住道具一角、顯得較大）；光源統一（前上方偏左）；接地陰影由程式加，
   素材不畫地面陰影；互動按鈕（例如 SPIN）不可被吉祥物蓋住，吉祥物容器設 `pointer-events: none`。
6. **版面寬度**：內容維持 H5 寬（480px 置中）；背景圖用滿版設計（桌機背景 1920 寬、底紋鋪滿），
   老闆要全螢幕時再改版面。
7. **分享活動網址**（每個活動都要）：分享面板（系統分享、複製連結＋手動複製 fallback、LINE/Facebook/X/
   WhatsApp/Telegram）、網址帶 `?lang=`（zh 預覽一律分享 en；切語系時改寫網址參數）、og/twitter meta 指向
   1200×630 **PNG/JPG**（社群不吃 SVG）。可直接複製 `assets/js/share.js`。KakaoTalk 需官方 SDK 金鑰，未做。
8. **吉祥物要夠大**：站在舞台地板上、全身入鏡，手機角色寬約 200px、全身約 360px 高（畫布約內容欄 95% 寬），不要縮在角落。
   狀態至少：待機 ×3（輪播）、進行中、發表結果，各一個循環 GIF。
9. **換圖標籤**：每個圖片槽旁顯示「檔名 · 尺寸」（英文），放角落/空白處不壓內容，mock 工具列可關閉。
   佔位圖本身**不要把尺寸字樣畫進圖裡**，佔位文字不可超出框。
10. **mock 工具列**（重設次數、換圖標籤開關）上線前要拿掉，寫進需求單的「上線前」清單。

## 第 2 步：製作美術圖（開需求 → GPT 產出 → 勾選）

1. `DESIGN_TASKS.md`：美術方向、語系規則、共通規格、**每個圖片槽一列**（檔名、外框尺寸、構圖與可放字區域、
   透明區、九宮格切法）、主視覺文字專節（三語文案、字體方向、手機可讀性、泰文上下標留白、交可編輯原始檔）、
   吉祥物比對驗收表、音效（選配）、哪些是後台內容不要做成圖。
2. `GPT_ASSET_BRIEF.md`：STYLE LOCK 共通段落＋每項英文提示詞；GPT 原生尺寸（1024²/1536×1024/1024×1536）
   與目標尺寸不同時寫明縮放裁切；吉祥物動態用 sprite sheet 3×4 + 組 GIF 腳本（400×500、24fps、≥24 幀、無縫循環、
   GIF 1-bit 透明用舞台暖色 matte）。
3. 吉祥物形象一律以品牌包為準：Moo Rabbit `brand/moo-rabbit/`（cms_system 事業部）、熊北官方
   `mootech-asia/mootech_website` 的 `brand/moo-bear/`。生成時附四視圖＋官方 MOOTECH logo
   （藍綠→黃綠漸層的「不可能 M」，不是橘色 M）。驗收時放大檢查**背心字樣拼字**（AI 常拼錯）。
4. `DELIVERY_CHECKLIST.md`：每個交付物一列（提交☐/☑、尺寸、交付路徑、commit、審核）。GPT 只能打「提交」勾並填
   commit；「審核」欄由我們填。進度與真偽一律用腳本：
   `python3 scripts/check_delivery.py <勾選表>`（`--all` 看全部）。腳本會擋：仍是佔位圖（sha256 指紋，
   新增佔位圖後要把指紋加進 `PLACEHOLDERS`）、尺寸錯、GIF 幀數/循環、commit 裡沒有該檔或之後又改過、
   同名多副檔名。尺寸欄寫「暫緩」的列會 SKIP（例：要用即夢做的影片）；寫「（人工）」的列只檢查存在。

## 第 3 步：套用（收檔 → 換圖 → 驗證 → 上線）

1. **收檔**：對話裡貼圖會被轉檔（GIF 變成第一幀 PNG、PNG 變 WebP、透明變棋盤格），工作中途插入的訊息附圖
   甚至不會存檔。**請使用者把原檔壓成 zip 上傳**（`/root/.claude/uploads/...`），或由 GPT 直接推到交付路徑。
   收到先驗：尺寸、幀數、alpha 是否真透明、內容對應哪個狀態（抽關鍵幀拼成總覽圖看）。
2. **換圖**：放到交付路徑、刪掉同名佔位檔、改 config 路徑；吉祥物確認每個狀態都切到對的 GIF 且真的在動
   （同狀態隔 300ms 截兩張比對）。
3. **驗證**（依 CLAUDE.md 回報規則）：en/ko/th × 初始/進行中/結果/次數用完，掃 `innerText`＋alt/aria/title
   的漢字（換圖標籤開著時也要掃）；手機 390 與桌機 1440 截圖目視；console 0 錯誤、無 404、無橫向捲動；
   失敗情境（後台空資料、localStorage 被封鎖、剪貼簿被拒）。
4. **勾選與上線**：commit 素材 → 勾選表打勾填該 commit → 腳本全 OK → 推 `main` → 查 `Deploy GitHub Pages`
   結論；回報附正式站網址與 pre-report-check 輸出，未驗證項目照實寫。

## 交付後常見退回項目（先自查）

- 背心字樣拼錯、logo 顏色不是官方漸層
- 角色在畫布裡太小（應佔畫布寬八成）
- 「透明」其實是畫上去的棋盤格
- 圖上出現中文或多餘文字；主標字超出框
- 去背白邊（暖色舞台上要放大看）
