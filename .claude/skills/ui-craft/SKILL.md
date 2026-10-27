---
name: ui-craft
description: "在本 repo 新增或修改任何頁面的視覺呈現時使用——排版、間距、顏色、陰影、視覺層級、動效/轉場時長、換膚 skin 色板、無障礙(ARIA/鍵盤操作)、表單設計、多語言排版(韓文/泰文字長撐版面)、投注/交易記錄這類資料表格、v1.5~v3 轉 Tailwind 時挑值怎麼挑，或是被要求「這個畫面看起來很業餘/雜亂/沒重點/廉價/普通/卡頓」時的診斷與修正。Triggers include: 'UI 看起來不對', '幫這個頁面/元件做設計', '視覺層級', '間距/圓角/陰影怎麼抓', '這個組件看起來很普通/AI 感很重', '動效/轉場怎麼做', '無障礙/ARIA/鍵盤操作', '表單怎麼設計/驗證', '多語言版面會不會爆/文字被裁切', '記錄表格/table 怎麼設計', 'improve this UI', 'visual hierarchy', 'design tokens', 'diagnose UI', 'motion/transition', 'accessibility', 'form validation', 'i18n layout', 'data table', '設計要有突破/新意'。整合七份公開分享的 Claude skill 方法論（改編，非原文照搬），並針對本 repo「每個版本已有完整 token 系統、不得發明新任意值」的鐵則做了覆寫。"
---

# UI 製作與視覺突破技能

## 來源與改編說明

這份技能整合七個外部方法論，都是上網搜尋找到、口碑良好的公開分享：

1. **[s0xDk/refactoring-ui-skill](https://github.com/s0xDk/refactoring-ui-skill)**（MIT
   license）——把 Adam Wathan／Steve Schoger《Refactoring UI》濃縮成可執行規則的 Claude
   skill。`references/diagnose.md`、`references/techniques.md`、`references/systems.md`
   三份是從該 repo **原文照搬**（MIT 授權允許），負責「基本功」：層級、間距、對比、
   陰影、診斷既有畫面哪裡不對。
2. **[Ilm-Alan/frontend-design](https://github.com/Ilm-Alan/frontend-design)**——「八個美學
   錨點」skill，核心價值不是它的八組色票（跟本 repo 無關，未照搬），而是它對抗
   generic/「AI 感」設計的**機制**：動手前先講清楚「這次要有的那一個記憶點是什麼」，
   而不是套用最安全、最預設的元件長相。下方「第二層：突破」是**改寫過的版本**，套進
   本 repo 既有品牌調性，不是原文引用。
3. **[Dammyjay93/interface-design](https://github.com/Dammyjay93/interface-design)**（MIT
   license）——`references/craft-polish-motion.md` 節錄自此 repo（MIT 授權允許），補
   前兩個來源完全沒涵蓋的三塊：**動效時長/easing 的具體數值**、**既有優先的元件/樣式
   升級順序**（native → 既有 class/元件 → 手刻是最後手段，呼應 CLAUDE.md 鐵則）、以及
   驗收記憶點用的**四個具體測試**（互換/瞇眼/記憶點/token 測試）。省略了原技能裡
   「自己發明一套新色彩世界」的部分——跟本 repo 顏色鎖定既有 token 的規則衝突，不收。
4. **[rampstackco/claude-skills](https://github.com/rampstackco/claude-skills)**
   `accessibility-audit` skill（MIT license）——`references/aria-patterns.md` 節錄自
   它的 `references/aria-patterns.md`。前三個來源一直說「手刻元件要補齊鍵盤/焦點/ARIA」
   卻從沒講清楚具體該長什麼樣，這份把 tabs/modal/accordion/toggle/disclosure/
   navigation 這幾種本 repo `site.js` 實際會用到的元件，該有哪些 ARIA attribute、
   該有哪些鍵盤行為，寫成可以直接核對的清單。省略了原技能裡「正式 WCAG 合規稽核
   報告」的格式與嚴重度分級——本 repo 驗收走 CLAUDE.md 既有的逐頁標準，不需要另外
   一份報告交付物。
5. **[szilu/ux-designer-skill](https://github.com/szilu/ux-designer-skill)**（MIT
   license）——補表單（label 位置、驗證時機、錯誤訊息怎麼關聯回欄位）跟導覽項目數量
   這兩塊，前四個來源都沒碰：這個 repo 的存款/提款/註冊這類表單、各版本的
   header-auth／mobile-tabbar 導覽都用得上。也補了幾個前面沒提到的生成式介面通病
   （紫色漸層+玻璃擬態當預設、每個區塊都套一樣的卡片+一樣的留白、hover-only 但沒有
   觸控/鍵盤替代）。
6. **[mindrally/skills](https://github.com/mindrally/skills) 的 internationalization-i18n**
   （Apache License 2.0，依授權標示來源＋說明改動如下）——原文以 React/Vue/React
   Native 技術堆疊為主，跟本 repo 完全不符，**沒有照搬程式碼**，只取「文字變長版面
   要撐得住」「文字不要烤進圖片」這幾個跟框架無關的通用原則，重寫成
   `references/i18n-layout.md`，串起本 repo 既有的 `data-i18n` 機制（`cms-scaffold`
   技能文件化過）跟視覺驗收標準之間一直沒人講的那塊：翻譯到位之後，版面撐不撐得住
   韓文/泰文比中文長 20–50% 這件事。RTL 排版鏡像的部分整段省略——本 repo 語言
   （zh/en/ko/th）都是 left-to-right，用不到。
7. **[Criptso/data-table-standard](https://github.com/Criptso/data-table-standard)**
   （MIT license）——原文 25 條規則鎖定「有後端資料庫、每個使用者能自訂欄位並持久化」
   的互動式資料網格（SaaS 後台那種），本 repo 的 `betting-record.html`／
   `deposit-record.html`／`withdrawal-record.html`／`profit-loss.html` 這類頁面雖然
   真的用 `<table>`，但沒有後端、沒有逐使用者持久化設定，所以「新增欄位寫回資料庫」
   「拖曳排序持久化」這類規則整段不收，只取純前端 CSS/結構就能做到的部分（表頭明度
   對比量測、數值欄位右對齊、長內容 3 行截斷+hover、窄螢幕下首欄/操作欄 sticky
   固定），重寫進 `references/data-tables.md`。原文檔案裡「這份檔案每次編輯都自動
   commit/push」的附帶說明是它自己 repo 的 meta 註記，跟本 repo 無關，沒有照搬那個
   行為。

## 第一層：基本功（不能先跳過）——覆寫原技能的「自建 scale」前提

原技能假設你在空白專案「從零定義」spacing/color/shadow scale。這個 repo 不是空白專案：
每個版本（v1.5~v6）都已經有自己完整的 token 系統：

- `vN/site/assets/css/main.css`（及 `v3` 的 `design-system/tokens.css`）裡的 `:root`
  CSS variable：`--color-*`、`--radius-*`、間距、陰影等。
- `vN/site/assets/css/skins/*.css`：同一版本的多套換膚色板，覆寫 `:root[data-skin=...]`。
- v4~v6 另有 `src/vN/theme.css`：`@theme static` 把 Tailwind `--color-*` token 對應回
  上面那組 raw token，`vN/tailwind/`（未來 v1.5~v3 轉換後也會有）比照辦理。

**所以以下規則只借「怎麼做視覺判斷」的方法論，不借「怎麼定義新 scale」**：

> 任何要挑顏色/間距/圓角/陰影數值的情境，一律先查當前版本既有 token 有沒有能用的
> （各版本實際檔案路徑見 `references/repo-tokens-map.md`，`grep` 該檔案的
> `:root`／`@theme` 區塊），找不到才回報使用者討論要不要新增 token，**不自己發明新
> hex/px 任意值**。這跟 CLAUDE.md 鐵則「CSS 復用優先」是同一件事，只是延伸到
> 「視覺判斷」層面而非單純 class 複用。

診斷/改善既有畫面時（"這裡看起來很業餘/雜亂/沒重點"）→ 先讀 `references/diagnose.md`
症狀對照表，逐一核對再動手，不要憑感覺亂調。

**層級（Hierarchy）是最重要的技巧**：不要只靠字級做層級——字級一大一小,大的太大、
小的太小。用**字重＋顏色**做主次區分，字級盡量落在既有 type scale 的中段。三種文字
顏色封頂：主要內容（深色 token）／次要內容（中灰 token）／輔助內容（淺灰 token，僅限
footnote/版權這類，正文絕不用最淺那階）。

**Hard rules（違反會直接看得出來哪裡壞掉，照抄自來源，數值/邏輯不因翻譯打折）**：
1. 彩色背景上絕不用灰字或降低透明度的白字——灰在白底上是「降低對比」，灰在彩色底上
   是「看起來髒」。要嘛在該版本 token 裡找同色相但飽和度/明度不同的既有變體，真的沒有
   才跟使用者討論。
2. 不用 `%` 寬度做本來就不該縮放的元素（側欄固定寬、主區域 flex）。
3. 不同尺寸的視覺元素跨斷點不能等比例縮放——大的要縮得比小的快。
4. 群組**之間**的間距永遠要大於群組**內部**的間距，否則會出現「這個標籤到底屬於哪個
   欄位」「這段文字算誰的內文」的歸屬歧義——這是功能性 bug，不只是不好看。
5. 不能只用顏色當唯一區分信號（圖表、狀態）——一定要搭圖示/形狀/文字線索，色弱使用者
   靠亮度分層辨識，靠色相不可靠。
6. 對比最低標準：一般文字 4.5:1；「大字」（24px 以上 regular 或 18.66px 以上 bold）
   才適用 3:1，18px regular **不算**大字。非文字的功能性邊框（input 外框、checkbox
   邊）也要 3:1，純裝飾用的分隔線不用。
7. icon 不要遠離原始設計尺寸硬縮放（16–24px 畫的 icon 放大到 48px 會很粗糙），要放大
   就包在一個色塊/圓形容器裡達到視覺尺寸，而不是暴力縮放 icon 本身。

需要處理陰影/深度模擬、圖片相關技巧（文字疊圖片、使用者上傳圖裁切、baseline 對齊、
字距）→ 讀 `references/techniques.md`。

需要新增/調整換膚 skin 色板（同一版本要新增一組 `data-skin`）才需要
`references/systems.md`（色相沿用該版本既有品牌色相去延伸出新色階，不是重新發明一套
完全無關的配色邏輯；對比公式、深色模式的「不要機械式反轉 ramp」規則都在裡面）。

**刻任何互動元件/樣式前，先看 `references/craft-polish-motion.md` 的「既有優先」
升級順序**：native HTML → 本版本既有共用 class/元件 → 手刻是最後手段，且手刻要補齊
完整鍵盤/焦點/ARIA 行為，不能只有外觀。這是 CLAUDE.md「CSS 復用優先」鐵則的具體
落地步驟。

## 第二層：突破——不要交出「安全但普通」的設計

使用者明確要求「設計能力要有新突破、要置入新元素」時，光是把基本功做對（層級正確、
間距不歧義、對比達標）只是**及格線**，不是目標。及格線之上要做到：

1. **動手前先講一句話，講清楚這次的「記憶點」是什麼**。不是「這個 hero 區塊要好看」，
   而是具體到「用一個 XX 手法讓這個區塊跟同版本其他頁不一樣」——例如：用
   `techniques.md` 的 overlap（負 margin 讓卡片跨兩個背景區塊）取代平鋪；用兩階陰影
   （cast + contact）取代單一陰影讓卡片有真實浮起感；用 `techniques.md` 的「打破預設
   元件形狀」把一般的 dropdown 改成帶 icon/描述的多欄選單、把一般的 radio 改成可選卡片。
   這句話要能被具體驗收（做完後看得出來那個記憶點有沒有真的在畫面上）,不是空泛形容詞。
2. **記憶點只能用當前版本既有 token 調色盤跟品牌調性去實現，不能換一套全新美學**。
   例如 v4「紅金喜慶」不會因為要「突破」就變成 Brutalist 純色撞色——突破是「用金/紅
   既有色階做出沒人做過的層次感」，不是「換掉整套美學語言」。這條界線由 CLAUDE.md
   的 token 鐵則決定，優先權高於「要有新意」。
3. **避免生成式介面的通病（AI 感）**：
   - 不要用預設元件的第一個念頭當最終答案——套用前先過一遍
     `techniques.md`「Break the default component shape」一節，問自己「這個 dropdown/
     table/radio 是不是又長得跟教科書範例一模一樣」。
   - 不要為了讓畫面「看起來有內容」而編造假資料、假狀態、假統計數字去填版面——這個
     repo 的驗收標準本來就要求「內容逐字保留、不做任何順手改寫」，編造內容直接違反
     這條，發現版面缺內容要回報使用者，不要自己編。
   - 不要加裝飾性的英文大寫標語、`//` 開頭的假註解式文案、純粹湊字數的說明文字——
     每個畫面上的字串要嘛是真實資料/文案，要嘛是使用者原本就有的既有文案，禁止順手
     加「風味文案」。
4. **一個頁面/區塊只做一個記憶點，不要同時塞三種新手法**——多個手法互相競爭注意力，
   效果會抵消，回到「Hierarchy」一節的道理：每次只放大一件事。
5. **記憶點做完要自己先跑一遍驗收測試，不是自己說好就算數**——見
   `references/craft-polish-motion.md` 最後一節「驗收測試」的互換/瞇眼/記憶點/token
   四個測試，逐一回答，答不出具體位置就是沒做到。

## 第三層：打磨與動效——過去完全沒覆蓋、這次新增的能力

基本功跟記憶點之外，還有一類純粹靠執行細節堆出來的「做完 vs 做好」落差，過去這份
技能沒有涵蓋，這次補上（見 `references/craft-polish-motion.md`）：

- **分層/深度要讓人「感覺到但看不到」**：彈出層疊在正確層級上、輸入框比周圍暗一點
  （凹陷感）、邊框低調到瞇眼看才找得到。深度策略（純邊框／淺陰影／多層陰影／色階
  差異）整個版面選一種就不要混用。
- **容易漏掉的打磨細節**：同心圓角（外圈半徑＝內圈半徑＋內距）、動態數字一律
  `font-variant-numeric: tabular-nums`、互動狀態 default/hover/active/focus/
  disabled 缺一不可、點擊熱區至少 40px。
- **動效（這個 repo 的輪播/tab/彈窗/換膚切換都適用）**：UI 動效時長一律 <300ms（按鈕
  按壓 100–160ms、彈窗 200–500ms）；進場用自訂 ease-out
  `cubic-bezier(0.23,1,0.32,1)`，不要用瀏覽器內建 `ease-in`；只對 `transform`／
  `opacity` 做動畫，不要對 width/height/margin 做動畫（會掉幀）；彈出層要從觸發它的
  位置長出來（`transform-origin` 對齊觸發元素），不要從畫面中心長出來；高頻率操作
  （例如語言切換）乾脆不要加動畫，加了反而感覺變慢。

## 第四層：無障礙與表單——同樣是過去完全沒覆蓋的能力

### 無障礙：先原生 HTML，ARIA 是補洞用的

延續第一層「既有優先」的順序：能用原生 `<button>`/`<nav>`/`<input>` 就不要疊加多餘的
`role`（`<button role="button">` 這種是多餘的，而且有時候還會蓋掉正確語意）。真的要
手刻 tabs/modal/accordion/toggle/disclosure 這類元件（本 repo `site.js` 的 header-auth
下拉、彈窗、輪播、betslip 都是這類），該有哪些 ARIA attribute、該有哪些鍵盤行為，
查 `references/aria-patterns.md`——裡面針對每種元件都列好了「必要 ARIA」「必要行為」
「要核對什麼」，不要憑印象亂加 `aria-*`。**沒有 ARIA 好過錯的 ARIA**：漏掉頂多讓某個
功能對輔助科技不可用，加錯的（例如 `aria-expanded` 沒有對應 JS 真的去切換）會讓輔助
科技回報的狀態直接跟實際不符，更糟。

手刻完任何互動元件，拔掉滑鼠跑一次 `references/aria-patterns.md` 最後的鍵盤測試檢查表
（Tab 順序、Enter/Space、方向鍵、Escape、focus 可見、彈窗關閉後 focus 回得去、沒有鍵盤
陷阱）——這是把第一層「手刻要補齊完整鍵盤/焦點/ARIA」這句話兌現成具體動作的地方。

### 表單：存款/提款/註冊這類頁面專用

- **Label 放在欄位上方，不要只靠 placeholder 當 label**——placeholder 一開始打字就消失，
  使用者/輔助科技都會失去上下文。
- **驗證時機**：欄位 blur 時驗證一次；一旦該欄位顯示過錯誤，之後改成即時（每次 input
  都重新驗證），不要等到使用者再次送出才又跳錯誤。
- **錯誤訊息要跟欄位綁在一起**（`aria-describedby` 指到錯誤文字，見
  `references/aria-patterns.md`），顯示在該欄位旁邊，送出時再彙總一次有哪些欄位有誤——
  不要只在頁面最上方丟一句「表單有誤」讓使用者自己去找是哪一欄。
- **只問真的需要的欄位**，必填/選填兩者中人數較少的那一邊才需要特別標示（例如大部分
  欄位都必填，就只標「選填」那幾個，不要每個必填欄位都標星號）。

### 補充幾個生成式介面通病（接續第二層的清單）

- 紫色/靛色漸層 + 玻璃擬態 + 發光陰影當作「預設好看」的樣式——這些是沒有設計決策時
  模型最常見的 fallback，不是本 repo 既有品牌調性的一部分就不要加。
- 每個區塊都套一樣的卡片外框、一樣的留白——跟第一層「群組間距要有輕重之分」矛盾，
  也是最容易被看出來「這是套模板」的地方。
- **hover-only 的互動**（只有滑鼠移上去才會出現的功能）一定要有觸控/鍵盤的對應方式——
  這個 repo 的頁面要在手機上用，純 hover 的功能在觸控裝置上等於不存在。

### 導覽項目數量

桌機主導覽抓 5–7 項是好讀的上限，手機底部 tabbar 抓 3–5 項（這個 repo 多個版本都有
`mobile-tabbar`）。超過這個數量不是「資訊都很重要所以都要放」，是該做分類/收合的訊號。

## 第五層：多語言排版——翻譯到位之後，版面撐不撐得住

這個 repo 用 `data-i18n` 機制支援 zh/en/ko/th 四種語言（`cms-scaffold` 技能有完整
文件），但那解決的是「怎麼換字」，沒有解決「換了字之後版面會不會爆」——這是純視覺
排版問題，見 `references/i18n-layout.md`：

- 按鈕/badge/輸入框的寬度盡量讓內容決定，不要寫死 `width`；真的需要固定寬度的欄位，
  量測基準要用四種語言裡最長的那個，韓文/泰文常比中文長 20–50%。
- 文字一律是真的 HTML 文字節點/屬性，不要烤進圖片——`data-i18n` 掃不到圖片裡的文字，
  遇到這種素材要回報使用者，不要假裝已經處理好。
- 改完視覺之後，額外切到韓文或泰文看同一個斷點，確認沒有文字被裁切/按鈕被撐到換行——
  這跟 `cms-scaffold` 的殘留語言稽核是两件事（稽核抓「沒翻譯到」，這裡抓「翻譯到了
  但排版撐不住」），兩者都要做。
- 視覺調整時如果看到賠率/金額這類數字的千分位/小數格式，不要順手「修正」成自己覺得
  對的格式——格式差異可能是刻意設計，不確定要跟使用者確認，這跟驗收標準「內容逐字
  保留」是同一條界線。

## 第六層：資料表格——投注記錄/交易記錄/盈虧明細這類頁面專用

本 repo 的 `betting-record.html`／`deposit-record.html`／`withdrawal-record.html`／
`profit-loss.html` 這類頁面用的是真的 `<table>`，有專屬規則，見
`references/data-tables.md`：

- 表頭底色跟內文要有實際可量測的明度差（不是肉眼覺得有換色就好），表頭文字對表頭
  底色對比至少 7:1（比一般內文的 4.5:1 更嚴）。
- 數值欄位（金額/賠率/盈虧）右對齊 + 等寬數字，一般文字/狀態/日期欄位置中，長文字
  換行欄位左對齊。
- 同一頁面的日期格式/月份語言要前後一致，日期+時間同時存在時時間放日期下面一行，
  不要擠成一串。
- 長內容（備註/遊戲名稱）3 行截斷 + hover 顯示完整內容；手機寬度橫向捲動時第一欄/
  操作欄用 `position: sticky` 固定。
- 這份參考資料裡「排序/搜尋」那段只在頁面本來就有互動排序功能時才適用，不要為了
  套規則反過來無中生有加功能。

## 驗收時的自我檢查

- 記憶點是否真的體現在畫面上，還是只停留在描述？互換/瞇眼/記憶點/token 四個測試
  （見 `references/craft-polish-motion.md` 最後一節）有沒有全部通過？
- 有沒有用到當前版本既有 token 以外的任意色碼/px 值？（`grep` 新增的 CSS/inline style
  找 `#[0-9a-f]{3,6}`、裸 `px` 數字，逐一確認來源是既有 token 還是自己編的）
- 新增的互動元件是不是先檢查過 native HTML／本版本既有共用 class 才手刻的？手刻的
  有沒有照 `references/aria-patterns.md` 核對必要 ARIA、跑過鍵盤測試檢查表（拔滑鼠
  能不能完整操作）？
- 有加動效的地方時長是否 <300ms、用的是自訂 ease-out、只對 transform/opacity 做
  animate？
- 有表單的頁面：label 是否在欄位上方、錯誤訊息是否綁定對應欄位且送出時有彙總？
- 有固定寬度的按鈕/badge/欄位嗎？換成韓文/泰文看同一個斷點會不會被裁切或撐到換行？
- 有 `<table>` 的頁面：表頭對比量過了嗎？數值欄位右對齊+等寬數字了嗎？
- Hard rules 七條有沒有踩到任何一條？
- 是否符合本 repo 驗收標準（視覺 pixel-diff、功能互動點、內容逐字保留、console 不變多）？
