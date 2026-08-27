# 共用翻譯主檔(shared/i18n/)

這個資料夾**不會被任何版本的 `site/` 或 `studio/` 在瀏覽器執行期讀取**——純粹是給人編輯、
給腳本同步用的維護工具。每個版本的 `site/` 資料夾仍然是完全獨立、可以整包單獨出貨給客戶的
靜態站,不會因為缺了這個資料夾而壞掉。這一點是鐵則,`sync.js` 只會「寫回」各版本自己的
`i18n.js`,絕不會讓任何版本的 HTML/JS 在執行期跨資料夾讀取這裡的檔案。

## 用法:改文字只改一個地方

1. 編輯 `master.json` 裡對應的 key(不確定 key 在哪,直接搜尋中文內容即可找到)。
2. 執行:
   ```
   node shared/i18n/sync.js
   ```
   會把 `master.json` 的內容套用回 `v3/v4/v5/v6` 各自的 `assets/js/i18n.js`
   (只套用到該版本 `targets` 裡有列出的 key)。
3. 想先看會改哪些檔案、不實際寫入,加 `--dry-run`:
   ```
   node shared/i18n/sync.js --dry-run
   ```
4. 只想同步特定版本:
   ```
   node shared/i18n/sync.js v6
   ```

## master.json 結構

```jsonc
{
  "brand": { "v4": "Bet100", "v5": "IGNITE100", "v6": "APEX100" },
  "entries": {
    "nav.lobby": {
      "targets": { "v4": "nav.lobby", "v5": "nav.lobby", "v6": "nav.lobby" },
      "zh": "大廳", "en": "Lobby", "ko": "로비", "th": "ล็อบบี้"
    },
    "faq.q1": {
      "targets": { "v4": "faq.q1", "v5": "faq.q1", "v6": "faq.q1" },
      "zh": "什麼是 {{BRAND}}？", "en": "What is {{BRAND}}?", "ko": "...", "th": "..."
    },
    "auth.registerNow": {
      "targets": { "v4": "auth.registerNow", "v5": "auth.registerNow", "v6": "auth.registerNow" },
      "zh": "立即註冊", "en": "Register Now", "ko": "지금 가입", "th": "ลงทะเบียนเลย",
      "overrides": { "v5": { "en": "Join" }, "v6": { "en": "Join" } }
    }
  }
}
```

- **`targets`**:這個 key 在各版本 `i18n.js` 裡實際對應的 key 名稱。目前 v4/v5/v6 用同一套
  扁平命名慣例(`'nav.lobby'` 這種點分字串),所以 target key 跟 master key 通常同名;但不強制
  一樣——如果某個版本用不同 key 名稱存同樣內容,照樣可以在這裡對應。
  某個版本沒有這個內容(該版沒有對應功能/頁面),`targets` 就不列出那個版本,`sync.js` 就不會
  動那個版本的檔案。
- **`{{BRAND}}` 佔位符**:內容裡凡是原本寫死品牌名稱(Bet100/IGNITE100/APEX100)的地方,一律
  用 `{{BRAND}}` 代替,`sync.js` 會依 `brand` 表自動代換回各版本真正的品牌名稱。
- **`overrides`**:極少數情況,同一個 key 在不同版本「故意」要有不同文案(例如 v4 用
  「Register Now」、v5/v6 用「Join」,這是刻意的品牌語氣差異,不是翻譯錯誤),用 `overrides`
  記錄該版本、該語系要蓋掉的值。**不要**把「其實是漏翻譯的 bug」也塞進 overrides——那種情況
  應該直接修正 master 裡的 canonical 值,讓所有版本一起吃到修正(這次建置主檔時就抓到並修好了
  v6 的 `sidebar.myAccount` 韓文/泰文誤植成英文的 bug)。

## 檔案

- `master.json` — 翻譯主檔,**唯一該編輯的地方**。
- `flat-store.js` — 解析/寫回 v4/v5/v6 共用的扁平字串表格式(`var STRINGS = { 'key': {zh,en,ko,th}, ... }`)。
  用字元掃描而非單一大正規表示式,避免長字串在正規表示式引擎裡發生退化。支援就地替換既有 key、
  新增區塊裡沒有的 key。
- `v3-nav-store.js` — 解析/寫回 v3 巢狀結構裡的 `nav` 命名空間(`TRANSLATIONS.<locale>.nav.<key>`)。
  只支援就地替換既有 key,不支援新增。
- `sync.js` — 讀 `master.json`,依版本分別用 `flat-store.js`(v4/v5/v6)或 `v3-nav-store.js`(v3)
  套用回各版本 `i18n.js`;不會更動其他程式邏輯、既有排版、註解或未被 master 涵蓋的 key。
- `build-master.js` — 一次性工具,當初用來從既有的 v4/v5/v6 `i18n.js` 反推出第一版
  `master.json`。之後不會再執行,保留是為了留下產生方式的紀錄。
- `test-flat-store.js` / `test-v3-nav-store.js` — 對應兩個 store 模組的最小自我測試
  (round-trip 一致性、新增/替換 key 正確性)。

## 目前涵蓋範圍

- ✅ v4 / v5 / v6:三版共用同一套扁平 key 命名慣例,`master.json` 目前已完整涵蓋(487 個 key,
  含只有單一版本使用的 key)。
- 🟡 v3:資料結構不同(巢狀命名空間 `TRANSLATIONS.nav.Lobby`,而非扁平 `'nav.lobby'`),用
  `v3-nav-store.js` 解析/寫回。目前只對應到 `nav` 命名空間裡跟 v4/v5/v6 內容**逐字完全相同
  (四種語言都一樣)**的 15 個 key(導覽/側邊欄/紀錄表格欄位等),其餘 v3 自己的內容
  (`common`/`footer`/`topbar`/`deposit`/`modal`/`studio` 命名空間,以及 `HERO_COPY`/
  `PROMOTION_COPY`/`PROMO_RIBBON_COPY`/`TOURNAMENT_COPY`/`SPOTLIGHT_COPY` 等 v3 專屬結構、
  其餘版本沒有對應內容)仍照舊直接編輯 v3 自己的 `i18n.js`。
  另外 `v3-nav-store.js` 目前只能**更新既有 key**,不支援新增——這 15 個 key 在 v3 原本就存在,
  之後若要讓 master.json 新增的 key 也同步進 v3,要先擴充這支工具的新增邏輯。
- ⏳ v1.5 / v2:完全沒有 i18n 機制,尚未整合。
