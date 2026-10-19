<!-- 原文照搬＋節錄自 https://github.com/rampstackco/claude-skills
     （skills/accessibility-audit/references/aria-patterns.md，MIT license），未翻譯：
     ARIA attribute/role 名稱是規格用語，翻譯反而增加對照成本。省略原文最後「審計報告
     怎麼寫」「P0~P3 嚴重度分級給正式合規報告用」兩節——本 repo 沒有獨立的無障礙合規
     稽核交付物，驗收走的是 CLAUDE.md 既有的逐頁驗收標準，不需要另外一份報告格式。
     這份收的是技術模式本身：手刻 tabs/modal/accordion/toggle 這類元件時，ARIA 跟
     鍵盤行為該長什麼樣子——這是 ../SKILL.md 和 craft-polish-motion.md 一直說「手刻
     要補齊完整鍵盤/焦點/ARIA」但從未具體講清楚的部分，本 repo 的 site.js 裡
     header-auth 下拉、tab、輪播、彈窗、betslip 都用得到。 -->

# ARIA patterns reference

Decision-grade ARIA patterns. Covers when to use ARIA, when to skip it, and the common
patterns that recur across web products.

ARIA is powerful and easy to misuse. The most common mistake is reaching for ARIA when
semantic HTML would have done the job already. The second most common mistake is applying
ARIA without the supporting JavaScript that makes the attribute true (e.g.,
`aria-expanded="false"` on a button that does not actually toggle anything).

---

## The semantic-HTML-first principle

Before reaching for ARIA, check whether semantic HTML already does what is needed.

**The principle.** ARIA exists to fill gaps in HTML. When semantic HTML provides the same
semantics natively, the semantic element is the right answer. Adding ARIA on top of semantic
HTML is usually redundant and sometimes broken.

**Examples of redundant ARIA.**

- `<button role="button">` is redundant; the element is already a button.
- `<nav role="navigation">` is redundant; `<nav>` already has the role.
- `<a href="..." role="link">` is redundant; the element is already a link.
- `<input type="checkbox" role="checkbox">` is redundant.

**Examples of correct ARIA.**

- A `<div>` styled to behave like a button needs `role="button"`. A real `<button>` does not.
- A custom dropdown built on `<div>`s needs `role="combobox"` plus full keyboard handling. A
  `<select>` does not.
- A live status region needs `role="status"` or `aria-live`. A static element does not.

**The first ARIA rule.** No ARIA is better than bad ARIA. Bad ARIA actively confuses
assistive technology; missing ARIA at most leaves a feature inaccessible (which is bad, but
recoverable). Bad ARIA misrepresents the UI to the user, which is worse.

---

## Interactive widget patterns

### Accordion (expandable disclosure section)

**Required ARIA.**
- Trigger button: `aria-expanded="true"` or `aria-expanded="false"` reflecting state.
- Trigger button: `aria-controls="<id-of-panel>"` pointing to the controlled region.
- Panel: `id="<the-id>"` matching `aria-controls`.

**Required behavior.**
- Trigger is a `<button>` (not a `<div>` or `<a>`).
- Trigger toggles `aria-expanded` when activated.
- Click and keyboard (Enter, Space) both work.

**Checks.** `aria-expanded` reflects current state, not a stale value. `aria-controls` ID
exists in the DOM. Multiple accordions on a page: focus stays on trigger after toggle (does
not jump unexpectedly).

### Tabs

**Required ARIA.**
- Tab list: `role="tablist"`.
- Each tab: `role="tab"`, `aria-selected="true"` or `aria-selected="false"`,
  `aria-controls="<panel-id>"`.
- Each panel: `role="tabpanel"`, `id="<panel-id>"`, `aria-labelledby="<tab-id>"`.

**Required behavior.**
- Arrow keys move between tabs.
- Tab key moves into and out of the tablist (not between tabs).
- Selected tab has `tabindex="0"`; non-selected tabs have `tabindex="-1"` (roving tabindex).
- Activating a tab updates `aria-selected` and shows the corresponding panel.

**Checks.** All tabs reachable via arrow keys. Tab key escapes the tablist after one press.
Only one tab has `aria-selected="true"` at a time.

### Modal / dialog

**Required ARIA.**
- Container: `role="dialog"` (or `role="alertdialog"` for confirmations).
- Container: `aria-modal="true"` when modal.
- Container: `aria-labelledby="<heading-id>"` pointing to the dialog's heading, or
  `aria-label="<purpose>"`.
- Optional: `aria-describedby="<description-id>"` pointing to descriptive content.

**Required behavior.**
- Focus moves into the modal when opened (typically to the first focusable element or the
  dialog itself).
- Focus is trapped within the modal while open (Tab cycles within; cannot escape).
- Escape closes the modal.
- Focus returns to the triggering element when the modal closes.
- Background content has `inert` attribute or `aria-hidden="true"` (and is not focusable).

**Checks.** Focus management on open and close (the most common modal failure). Tab does not
escape into background content. Screen reader does not read background content while modal
is open.

### Toggle button (button that holds state)

**Required ARIA.** `aria-pressed="true"` or `aria-pressed="false"` reflecting state.

**Examples.** Mute button, favorite button, skin/換膚切換的開關式按鈕。

**Checks.** `aria-pressed` reflects state, not a stale value. Use of toggle button is
appropriate (the button is genuinely a toggle, not a momentary action).

### Disclosure widget (show/hide additional content)

**Required ARIA.** Trigger: `<button>` with `aria-expanded="true"`/`"false"`. Optional:
`aria-controls="<region-id>"` if the controlled region is not adjacent.

**Examples.** "顯示更多" buttons, 展開賠率明細。

**Difference from accordion.** Accordions are typically grouped (multiple panels in a related
set, often only one open at a time); disclosure widgets are standalone reveals.

### Navigation

**Required ARIA.**
- `<nav>` element (semantic; no `role="navigation"` needed).
- For multiple navs on a page (header nav / sidebar / mobile tabbar / footer)：each `<nav>`
  should have `aria-label` or `aria-labelledby` to distinguish them.
- Current page link: `aria-current="page"`.

**Checks.** Multiple navs are distinguishable to screen readers. The current page/current tab
is identified. Skip link present and works where the page has enough repeated chrome to
warrant one.

---

## Live region patterns

### aria-live

- `aria-live="polite"`：announces when the user is idle. 大多數情境用這個（表單存檔
  成功、內容更新）。
- `aria-live="assertive"`：立即打斷使用者，謹慎使用（阻擋送出的錯誤、工作階段逾時）。
- **Anti-pattern**：routine updates 用 assertive——使用者會一直被打斷，很快失去信任。

### aria-atomic

`aria-atomic="true"` tells screen readers to announce the entire region when any part
changes, not just the changed part. 用在「只有整句才有意義」的情境（例如「已處理 5 之
10 筆」）。

### role="status" / role="alert"

`role="status"`（隱含 polite）用於非緊急狀態訊息（「已加入收藏」「表單已儲存」）。
`role="alert"`（隱含 assertive + atomic）只用於緊急訊息（表單送出錯誤、安全性警示）。

**Checks.** 動態內容變更時才會宣告——靜態內容放進 live region 不會有任何宣告效果；
region 不是該用 polite 卻設成 assertive。

---

## Hiding from screen reader patterns

### aria-hidden

`aria-hidden="true"` 把元素從無障礙樹拿掉。

**何時用**：有相鄰文字標籤的裝飾性 icon、純視覺背景元素。

**何時不要用**：
- **可以被 focus 到的元素**——鍵盤使用者還是能 tab 到它，但螢幕閱讀器完全不會念出來，
  這是最常見的 ARIA bug 組合，每次用 `aria-hidden` 都要確認該元素本身跟其子孫都不可
  被 focus。
- 內容本身有意義的情況。
- 整個互動元件（鍵盤使用者還是能 tab 進去，但螢幕閱讀器念不出來）。

### Visually-hidden CSS class

視覺上隱藏但仍留在無障礙樹裡的手法：

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

用於 skip link、設計上隱藏但無障礙規範要求存在的表單標籤。**反模式**：用
`display:none`／`visibility:hidden` 做這件事——兩者都會把內容整個從無障礙樹移除，
達不到效果。

---

## Description and labeling patterns

- **`aria-label`**：沒有可見標籤時提供可存取名稱（icon-only 按鈕、需要上下文的泛用
  連結）。有可見 `<label>` 時不要用。
- **`aria-labelledby`**：指向既有元素的文字當作可存取名稱（例如 `<legend>`、modal
  用自己的標題當 labelledby）。語法：空白分隔多個 id，文字會串接。
- **`aria-describedby`**：指向既有元素的文字當作可存取描述（表單欄位的輔助說明、
  錯誤訊息跟輸入框的關聯）。

**標籤優先順序**：瀏覽器計算可存取名稱的順序是
`aria-labelledby` > `aria-label` > `<label>` > placeholder/title（最後手段，不可靠）。

---

## State indicator patterns

- **`aria-busy="true"`**：告知輔助科技此元素正在過渡狀態（載入中）。操作完成要記得
  移除。
- **`aria-disabled="true"` vs 原生 `disabled`**：原生 `disabled` 會把元素整個移出 tab
  順序；`aria-disabled` 保留可被 focus 但標示為停用，適合「想讓使用者 focus 到並讀到
  為什麼被停用」的情境。用 `aria-disabled` 時視覺上也要看起來是停用狀態，且要擋掉
  click handler。
- **`aria-invalid="true"`**：表單欄位驗證失敗時設定，通常搭配
  `aria-describedby` 指向錯誤訊息，驗證狀態變動要同步更新，不能是個 stale 屬性。

---

## Common ARIA anti-patterns

| 模式 | 為什麼有問題 | 怎麼修 |
|---|---|---|
| `<button role="button">`／`<nav role="navigation">`／`<a role="link">` | 多餘，有時還會蓋掉正確語意 | 拿掉多餘的 role |
| `aria-expanded="false"` 但按鈕沒有對應 JS 真的去切換 | 屬性在說謊，輔助科技回報的狀態跟實際不符 | 實作該有的行為，或拿掉這個屬性 |
| 可被 focus 的元素上掛 `aria-hidden="true"` | 鍵盤使用者能 focus 到，螢幕閱讀器卻念不出來 | 拿掉 `aria-hidden`（如果有意義），或用 `tabindex="-1"` 移出 tab 順序並停用互動 |
| `role="dialog"` 開啟但 focus 留在背景觸發元素上 | 螢幕閱讀器使用者不知道彈窗開了；鍵盤使用者還能 tab 進背景內容 | 開啟時把 focus 移進彈窗、開啟期間鎖住 focus、關閉時把 focus 還給觸發元素 |
| 靜態 `<div role="status">載入完成</div>` 寫死在初始 HTML | live region 只有「內容在頁面載入後變動」才會宣告，靜態內容不會有任何效果 | 拿掉 role（如果內容本來就是靜態的），或改成真的動態更新內容 |
| 每次表單存檔成功都用 `role="alert"` | 每次都打斷使用者正在做的事，很快失去信任 | 非緊急更新用 `role="status"`（polite），`role="alert"` 留給真正緊急的訊息 |
| `<input type="text">` 只有 placeholder 沒有 label | 螢幕閱讀器念出來是籠統的「編輯」，使用者不知道這欄位是做什麼的，而且一開始打字 placeholder 就消失，上下文也跟著不見 | 加上可見的 `<label>`（優先）或 `aria-label`；placeholder 不是 label |
| 錯誤文字出現在輸入框附近但沒有程式上的關聯 | focus 在輸入框上時螢幕閱讀器聽不到錯誤 | 用 `aria-describedby="error-id"` 指向錯誤訊息，視情況加上 `aria-invalid="true"` |
| 用正數 `tabindex`（`tabindex="1"`、`tabindex="2"`）控制順序 | 會產生一套獨立的 tab 順序，常常跟 DOM 順序衝突，非常脆弱 | 只用 `tabindex="0"`（加入自然順序）或 `tabindex="-1"`（移出自然順序），不要用正數 |

---

## 鍵盤測試檢查表（手刻完任何互動元件都要跑一次）

拔掉滑鼠，只用鍵盤操作該元件：

- Tab／Shift+Tab 依邏輯順序在可互動元素間移動
- Enter 可以觸發按鈕跟連結
- Space 可以觸發按鈕（並且切換 checkbox）
- 複合元件（tabs/menu/listbox）內用方向鍵移動
- Escape 可以關閉彈窗/popover/選單
- focus 永遠可見（不會被 `outline: none` 不小心拿掉又沒補視覺替代）
- 彈窗/popover 關閉後 focus 回到合理的位置（通常是觸發它的那個元素）
- 沒有鍵盤陷阱（focus 永遠可以離開）

這份檢查表沒跑完，`craft-polish-motion.md`／`../SKILL.md` 裡說的「手刻要補齊完整鍵盤/
焦點/ARIA 行為」就只是一句空話，沒有真的做到。

## 參考

- W3C ARIA Authoring Practices Guide (APG): https://www.w3.org/WAI/ARIA/apg/
- WAI-ARIA 1.2 規格: https://www.w3.org/TR/wai-aria-1.2/

這份文件是 APG 常見模式的精簡摘要，真的要刻複雜元件（例如多層巢狀選單）時去查 APG
的完整範例。
