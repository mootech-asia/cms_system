<!-- 原文照搬＋節錄自 https://github.com/FranciscoYuster/skeleton-loading
     （MIT license），數值/CSS 保持精確，未翻譯規則本身。CSS 範例原文用
     `color-mix(in oklch, currentColor 8%, transparent)` 取代寫死色碼，已經是
     跟著文字顏色走、不需要額外色票，套用時只需要把 `border-radius: 4px` 這類
     跟本版本既有 `--radius-*` token 無關的寫死值換成既有 token，其餘不用改。 -->

# Skeleton loading（骨架載入畫面）

用在內容還沒載入完成、但**版面長相已經確定**的情境（遊戲縮圖列表、投注記錄表格、
頭像/暱稱這類）。這個 repo 目前的「空狀態」只處理「載入完成但沒有資料」，這份補的是
「還在載入中」這個中間狀態——`references/diagnose.md`、`craft-polish-motion.md` 都
提過「互動狀態 loading/empty/error 缺一不可」，這份是把 loading 狀態寫成具體規格。

## Hard rules

1. **骨架畫面延遲 200ms 後才掛載**。0ms 就顯示的話，網路夠快時會出現「空白→骨架→
   內容」的三段閃爍，比完全不顯示 loading 指示還糟。
2. **絕不要用靜態（不會動）的骨架**——沒有 shimmer 動畫寧可用 spinner 取代，靜態
   灰色方塊是測起來體感最差的 loading 呈現方式。
3. **Shimmer 是單一方向的掃光**：由左至右（RTL 介面反過來），每次掃過 1.5–2 秒、
   等速、低對比，**整個畫面只有一條時間軸**（所有骨架方塊同步，不要各自用不同
   `animation-delay` 各自跑）。不要用 pulse（透明度閃爍呼吸）。
4. **`prefers-reduced-motion: reduce` 時完全不顯示骨架/shimmer**，改成純文字
   `<p role="status">載入中…</p>`。
5. **骨架方塊的尺寸/長寬比/數量要從真實元件的既有 token 推算**，不是憑感覺抓一個
   差不多的尺寸——內容換上來的那一刻版面不能跳動（CLS 要是 0）。
6. **不要對「可能不存在的條件式元素」做骨架**——一個骨架方塊解析出來卻變成空的，
   等於是個違背版面承諾的 bug，比沒有骨架更差。
7. **骨架不能停留超過該停留的時間**：成功載入或進入下面 step-4 的任何一個 escalation
   階段之後，骨架就要撤掉，不能一直停在畫面上。
8. 骨架方塊本身 `aria-hidden="true"`，不進 tab 順序；外層容器掛
   `aria-busy="true"`，資料到了之後翻成 `"false"`。

## 用骨架還是用別的——先過這張表再動手

| 情境 | 用什麼 |
|---|---|
| 等待 < 200ms | 不顯示任何 loading 指示 |
| 200ms–3s，版面已知 | 骨架畫面 |
| 200ms–3s，版面未知 | inline spinner |
| 進度可量測（上傳進度這類） | 確定式進度條，不要用骨架 |
| 使用者主動觸發、結果可預期（例如收藏按鈕點擊） | 樂觀更新（Optimistic UI），不用 loading 畫面 |
| 時間不確定或 > 3s | 骨架 + 下面的 step-4 升級機制 |
| `prefers-reduced-motion` | 規則 4 的純文字狀態 |
| 只有畫面裡一個區塊在載入 | 骨架範圍只框住那個區塊，不要整頁一起變骨架 |

## 執行步驟

1. 先對照上面的表格分類這次的等待情境，如果命中「不用骨架」的那幾列，就不要硬套
   骨架。
2. 骨架的尺寸/行數跟著真實元件的既有 token 走，文字行抓 60–80% 寬度，最後一行
   比其他行更短（模擬真實段落參差不齊的樣子）。
3. 套用下面的 CSS 骨架，`border-radius` 這類數值換成本版本既有 `--radius-*` token，
   機制（動畫/aria 屬性）不要改。
4. **Escalation 一定要接在 loading 元件本身，不是接在 fetch 邏輯裡**：
   - **200ms**：掛載骨架
   - **3s**：換成 spinner + 「仍在載入中…」文字（或先顯示部分已載入的內容）
   - **10s**：給使用者可以做的動作（預估剩餘時間、重試、取消、轉背景繼續）
   - **錯誤**：撤掉骨架，顯示具體失敗原因 + 重試（見
     `references/ux-writing.md` 的錯誤訊息模式——這裡又是只限新寫文案適用）
5. 內容換上來時淡入 ~150ms，清單類內容逐項 stagger 30–50ms 進場（呼應
   `craft-polish-motion.md` 的動效時長規則），並且保留使用者原本的捲動位置。
6. 驗證時用節流過的網路（瀏覽器開發者工具的 throttle），不要只在本機测，本機幾乎
   不會踩到 200ms/3s/10s 這些門檻。

## 參考 CSS（機制照抄，數值照本版本既有 token 調）

```css
@keyframes skeleton-sweep {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

.skeleton {
  --skeleton-base: color-mix(in oklch, currentColor 8%, transparent);
  --skeleton-highlight: color-mix(in oklch, currentColor 14%, transparent);
  --skeleton-duration: 1.8s;

  background-image: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  background-repeat: no-repeat;
  animation: skeleton-sweep var(--skeleton-duration) linear infinite;
  border-radius: var(--radius-sm); /* 原文是寫死 4px，這裡換成既有 token */
  user-select: none;
}
[dir="rtl"] .skeleton { animation-direction: reverse; }

.skeleton--text { height: 1em; width: 72%; }
.skeleton--text:last-child { width: 48%; }
.skeleton--media { width: 100%; aspect-ratio: var(--skeleton-aspect, 16 / 9); }
.skeleton--avatar {
  width: var(--skeleton-avatar-size, 40px);
  height: var(--skeleton-avatar-size, 40px);
  border-radius: 50%;
}

@media (prefers-reduced-motion: reduce) {
  [data-skeleton-region] .skeleton { display: none; }
  [data-skeleton-region] .skeleton-status { display: block; }
}
.skeleton-status { display: none; }

@keyframes skeleton-content-in { from { opacity: 0; } to { opacity: 1; } }
[data-skeleton-region][aria-busy="false"] > * {
  animation: skeleton-content-in 150ms ease-out both;
}
@media (prefers-reduced-motion: reduce) {
  [data-skeleton-region][aria-busy="false"] > * { animation: none; }
}
```

對應的 HTML 結構（骨架方塊要 `aria-hidden`，外層要 `aria-busy`，呼應 Hard rule 8）：

```html
<div data-skeleton-region aria-busy="true">
  <p class="skeleton-status" role="status">載入中…</p>
  <!-- 200ms 延遲後才掛載，不要在 0ms 就顯示 -->
  <div class="skeleton skeleton--media" aria-hidden="true"></div>
  <p class="skeleton skeleton--text" aria-hidden="true"></p>
  <p class="skeleton skeleton--text" aria-hidden="true"></p>
</div>
```
