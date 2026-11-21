# Figma 修改單（2026-11-17 ～ 11-20 本週）

> 給 Figma 助理：請依本文件更新 Figma 設計檔。本週只動到 **event 活動頁** 與 **CMS 各版本的活動選單入口**；BO、INFA、官網這週只有文件／素材規範整理，畫面沒變，Figma 不用動。
> 依 main `9d1bd00`（2026-11-20）實際畫面整理。上一份交接是 `figma-changes-20261113-pm.md`，本文件只列那之後的修改。
> 截圖：手機 390×844，2 倍圖。尺寸單位 px。

附件資料夾：
- `01_活動截圖/`：四款活動各狀態（Loading、待機、轉動／開啟中、結果、紀錄分頁）
- `02_CMS入口/`：v3、v6 桌機選單，v6 手機卡包頁／寶箱頁
- `03_素材/`：兩款新活動全部正式圖、四款 Loading 器物、共用按鈕圖

---

## 一、修改總表

| # | 範圍 | 修改內容 | Figma 動作 |
|---|---|---|---|
| 1 | **新活動：Cosmic Magic Card Pack 宇宙卡包** | 全新活動頁（3D 卡包環形陳列、撕封開包、翻卡揭曉、隱藏版） | **新建一組 Frame**（見第二節） |
| 2 | **新活動：Desert Genie's Gift 沙漠寶箱** | 全新活動頁（3D 寶箱環形陳列、開蓋、寶物揭曉、神燈精靈角色） | **新建一組 Frame**（見第三節） |
| 3 | 四款活動共用 | 每款各自的主題 Loading 畫面（取代 11/13 的簡易 Loading） | 四個 Loading Frame 換新版（見第四節） |
| 4 | 兩款轉盤 | 新增 **Auto ×N／Skip** 按鈕列、十連結果彙總彈窗；SPIN 改 LED 跑字動畫；移除點擊提示 | 轉盤主畫面與結果彈窗改版（見第五節） |
| 5 | 四款活動共用 | 獎項紀錄**分頁**（每頁 10 筆）、捲動後出現**回到頂部**按鈕、分享／音效／左右箭頭統一成同一套亮面圓角方形（36×36，只換色）、桌機隱藏捲軸 | 資訊區與右上工具鈕更新（見第六節） |
| 6 | CMS v1.5～v6 | 活動選單新增「Magic Card Pack」「Genie's Gift」兩個入口與兩張活動頁 | 每版選單 Component 加兩項（見第七節） |
| 7 | 素材命名 | 四款活動素材改成「活動名_類別編號_用途」新檔名（例：`lucky_wheel_IMG033_wheel-frame.webp`） | Figma 圖層／圖片名稱建議同步改，方便對檔；圖片內容不變 |

---

## 二、宇宙卡包（Cosmic Magic Card Pack）

- 正式入口：`event/20261118_card_pack/index.html`（`?lang=en|ko|th`）
- 截圖：`01_活動截圖/03_CardPack_a～f`

### 流程與畫面

| 狀態 | 畫面內容 | 截圖 |
|---|---|---|
| Loading | 浮動紫晶星儀、細銀軌道、星芒進度軌、深紫星空 | `03_CardPack_a_Loading` |
| 待機 | 主標（三語各一張 690×240）→ 活動日期牌 → 3D 卡包環形陳列（20 包，前景為選定包）＋左右箭頭＋「Tap any pack to choose it」提示 → `PACK 01 / 20` → 次數銘牌「Packs left 20」→ 主按鈕「Open 10 packs」 | `03_CardPack_b_待機` |
| 開啟中 | 前排卡包縮成兩排小卡包依序開啟，主按鈕變「Opening 10…」（停用態），下方小字狀態列 | `03_CardPack_c_開啟動畫` |
| 結果總覽 | 「Your haul」三欄卡片格（卡面＋稀有度標籤 COMMON／RARE／SUPER RARE…＋獎品名），底部「Collect」 | `03_CardPack_d_十件結果總覽` |
| 領取後 | 回到待機，次數減少；按鈕變「Open all (N)」 | `03_CardPack_e_領取後` |
| 資訊區 | 規則冊頁＋「My Prizes」紀錄（獎品圖示＋名稱＋時間＋稀有度），每頁 10 筆，右下回到頂部 | `03_CardPack_f_規則紀錄分頁_回到頂部` |

### 規則與狀態（要畫 Variant）

- 一次開啟包數：依剩餘次數，最多 10。
- 單包揭曉：每包一張卡，點擊翻開；卡背 `reward-back`（星盤寶石＋長耳月兔金屬雕紋），卡面 `reward-front`（星雲雕花），名稱／圖示／稀有度／星數是程式疊字。四種稀有度外緣光色不同。
- **隱藏版**：第 100、200、300…次成功開包出現；三張卡扇形展開逐張揭曉，用 `secret-back`／`secret-front`，保證三張 EPIC 以上。
- Try Again（Again）結果：補回一次機會。
- 卡包用完：顯示「沒有卡包」常駐提示（共用狀態徽章 `shared_IMG006_status-badges.webp`）。
- 選擇提示：「Tap any pack to choose it」每 10 秒淡入淡出循環。

### 版面元件尺寸（交付圖原尺寸）

| 元件 | 檔案 | 尺寸 |
|---|---|---|
| 主標 | `title/card_pack_IMG011～014`（en／ko／main／th） | 690×240 |
| 日期牌 | `ui/card_pack_IMG022_period-badge` | 900×150 |
| 次數銘牌 | `ui/card_pack_IMG018_chances-badge` | 630×210 |
| 主按鈕 | `ui/card_pack_IMG015_btn-primary` | 900×270 |
| 跑馬燈 | `ui/card_pack_IMG023_ticker-bar` | 1000×180 |
| 資訊區冊頁頭 | `ui/card_pack_IMG019_folio-header` | 900×300 |
| 規則／紀錄框 | `ui/card_pack_IMG021_panel-frame`（九宮格） | 768×768 |
| 場景底圖 | `scene/card_pack_IMG009_stage-bg` | 750×1000 |
| 卡背／卡面／隱藏版 | `reveal/card_pack_IMG003～006` | 600×900 |
| 分享圖 | `share/card_pack_IMG010_share-preview.jpg` | 1200×630 |

色調：深紫星空、銀金星盤、紫水晶琺瑯，面板為切角科技框。3D 卡包本體是程式即時生成（不是圖檔），Figma 用截圖當示意即可。

---

## 三、沙漠寶箱（Desert Genie's Gift）

- 正式入口：`event/20261118_blind_box/index.html`
- 截圖：`01_活動截圖/04_BlindBox_a～f`

### 流程與畫面

| 狀態 | 畫面內容 | 截圖 |
|---|---|---|
| Loading | 鏤金神燈、綠松石煙霧、拱門輪廓、流沙金進度槽 | `04_BlindBox_a_Loading` |
| 待機 | 主標 → 日期牌（綠底金框）→ **神燈精靈**（綠皮膚肌肉型、飛機頭）站在寶箱後方 → 金色寶箱環形陳列＋左右箭頭＋「Tap any box to choose it」→ `BOX 01 / 10` → 「Boxes left 20」→「Open 10 boxes」 | `04_BlindBox_b_待機` |
| 開啟中 | 寶箱縮成兩排小箱依序開蓋，中央沙暴漩渦，按鈕「Opening 10…」 | `04_BlindBox_c_開啟動畫` |
| 結果總覽 | 「Your haul」：寶物立在小基座上（稀有度標籤＋名稱），底部「Collect」 | `04_BlindBox_d_十件結果總覽` |
| 領取後 | 次數減少；有 Try Again 時補回一次（截圖 20 → 11） | `04_BlindBox_e_領取後_TryAgain補次數` |
| 資訊區 | 墨綠底金框紀錄，每頁 10 筆＋回到頂部 | `04_BlindBox_f_規則紀錄分頁_回到頂部` |

### 規則與狀態

- 每盒可設 1～5 件寶物，多件時逐件看再顯示總覽。
- 選定寶箱可「向上滑」開蓋，有手指提示。
- 寶箱用完：常駐「沒有寶箱」提示（共用狀態徽章）。
- 精靈角色：待機、期待、開箱反應等手勢＋臉部表情分開動（程式依狀態切換），Figma 放 `mascot/blind_box_IMG003_poster.webp`（1500×1875）當靜態圖。
- 場景：低空沙霧、細沙粒、花瓣飄落（程式粒子，Figma 不用畫）。

### 版面元件尺寸

| 元件 | 檔案 | 尺寸 |
|---|---|---|
| 主標 | `title/blind_box_IMG013～016` | 690×240 |
| 日期牌 | `ui/blind_box_IMG023_period-badge` | 900×150 |
| 次數銘牌 | `ui/blind_box_IMG020_chances-badge` | 630×210 |
| 主按鈕 | `ui/blind_box_IMG017_btn-primary` | 900×270 |
| 跑馬燈 | `ui/blind_box_IMG024_ticker-bar` | 1000×180 |
| 面板拱形框飾 | `ui/blind_box_IMG022_panel-crown` | 900×300 |
| 寶物基座 | `ui/blind_box_IMG026_treasure-plinth` | 900×291 |
| 場景 | `scene/blind_box_IMG011_open-desert` | 750×1125 |
| 精靈靜態 | `mascot/blind_box_IMG003_poster` | 1500×1875 |
| 分享圖 | `share/blind_box_IMG012_share-preview.jpg` | 1200×630 |

色調：黃銅雕刻、綠松石、翡翠琺瑯；寶箱統一金色。

---

## 四、四款活動的主題 Loading（取代 11/13 簡易版）

| 活動 | 設計 | 中央器物（480×480，顯示 240） |
|---|---|---|
| Lucky Wheel | 天鵝絨幕布、皇冠黃銅燈泡徽章、中央百分比、雙層鍍金進度槽 | `lucky_wheel_IMG016_loading-emblem.webp` |
| Survival Spin | 墨綠機械虹膜閘門、桃紅掃描光、分段式進度、等寬百分比 | `survival_spin_IMG016_loading-emblem.webp` |
| Card Pack | 紫晶星儀、銀軌道、星芒進度軌 | `card_pack_IMG020_loading-emblem.webp` |
| Blind Box | 鏤金神燈、綠松石煙霧、流沙金進度槽 | `blind_box_IMG021_loading-emblem.webp` |

共通：器物無文字；標題與百分比是 DOM 三語文字；進度依實際圖片載入數；最長 10 秒一定進場。截圖 `0X_*_a_Loading`。

---

## 五、兩款轉盤（Lucky Wheel／Survival Spin）

設計、角色、色票不變，只改下面這些：

| 項目 | 修改後 | 截圖 |
|---|---|---|
| 次數牌下方按鈕列 | 次數牌「Spins left 10」下面新增一列兩顆：**Auto ×N**（N＝剩餘次數，上限 10）、**Skip**；未轉動時 Skip 為停用態 | `0X_*_b_待機` |
| 自動連轉中 | Auto 顯示進度「Auto 1 / 10」，Skip 變可按 | `0X_*_c_自動連轉中` |
| 十連結果彙總 | 結果彈窗標題「10 spin results」，內容改成編號清單（可捲動），底部「Claim Prize」 | `0X_*_d_十連結果彙總` |
| SPIN 中心鈕 | 「SPIN」字改 LED 粗斜體跑字（連續波浪掃光）；滑鼠移上有一次果凍彈跳；原本的點擊手指提示移除 | 動態，截圖看靜態 |
| 換圖標籤 | 預設關閉（Figma 不用畫標籤） | — |
| 結果彈窗 | 底圖載入失敗時有純色可讀版面（備用，Figma 可不畫） | — |

---

## 六、四款活動共用元件

| 項目 | 規格 |
|---|---|
| 獎項紀錄分頁 | 每頁 10 筆，上一頁／下一頁切換（截圖 `*_e/f_規則紀錄分頁`） |
| 回到頂部 | 資訊區捲動後出現在右下，主題色方形小鈕；回頂隱藏 |
| 右上分享／音效、左右箭頭 | 四款統一用同一套亮面圓角方形按鈕（`shared_IMG002～004` 分享／音效開／關，`shared_IMG001` 箭頭底框），**可見尺寸 36×36**；只換色：Lucky Wheel 金、Survival Spin 粉、卡包 cosmic 紫、寶箱 desert。位置：頂部 8、左右內距 16、按鈕間距 8、頂端對齊；獨立頁有語系列時靠右，嵌入 CMS（語系列隱藏）時靠左。請做成一個 Component＋4 個色彩 Variant |
| 語系切換 | 卡包／寶箱共用金色語系膠囊（EN／한국어／ไทย），宇宙主題配紫色版；有 hover／按下／focus 三態 |
| 桌機捲軸 | 四款活動在桌機隱藏捲軸（仍可捲動） |

---

## 七、CMS v1.5～v6：活動選單新增兩項

六個版本的活動選單（EVENT 群組）在既有 Daily Check-in、Lucky Wheel、Survival Spin 旁新增：

| 項目 | en | 繁中 | ko | th | 連到 |
|---|---|---|---|---|---|
| 卡包 | Magic Card Pack | 宇宙神奇魔幻卡包 | 신비한 우주 마법 카드팩 | ซองการ์ดเวทมนตร์มหัศจรรย์จักรวาล | `card-pack.html` |
| 寶箱 | Genie's Gift | 沙漠精靈的贈禮 | 사막 정령의 선물 | ของขวัญจากภูตทะเลทราย | `blind-box.html` |

- 選單圖示（六版同一組線條圖示，24×24，stroke 2，圓角端點）：
  - 卡包：`<rect x="4" y="3" width="11" height="16" rx="2"/><path d="M8 21h9a2 2 0 0 0 2-2V7"/><path d="M9.5 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>`
  - 寶箱：`<rect x="3" y="7" width="18" height="4" rx="1"/><path d="M5 11v9h14v-9"/><path d="M10 14.2a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9v.3"/><path d="M12 19.2h.01"/>`
  - v1.5 另有檔案版 `assets/images/icon/usercenter/card-pack.svg`、`blind-box.svg`（同圖形，色 `#060C34`）
- 兩張新頁（`card-pack.html`、`blind-box.html`）版型與既有 `lucky-wheel.html` 相同：活動以 H5 寬 iframe 置中嵌入，手機版**沒有底部導覽列**；活動語系跟著網站語系。
- 截圖：`02_CMS入口/v3_桌機_選單入口`、`v6_桌機_選單入口`、`v6_手機_卡包頁`、`v6_手機_寶箱頁`。v1.5／v2／v4／v5 的選單是收合式，入口位置同各版既有 Lucky Wheel 下方，這次沒另外截圖。

---

## 八、Figma 不用動的

- 兩款轉盤的轉盤、角色（兔比、生存版第一版面具人物）、色票、三語主標、分享面板：同 11/13。
- CMS 各版本除了選單兩項與兩張新頁，其他頁面這週沒改。
- BO（bo_system）、INFA、MOOTECH 官網：本週只整理素材規範與交接文件，畫面沒變。
- 音效／BGM 這週換成美術交付的音檔（Seal 系列）並調整播放邏輯，不影響畫面。
