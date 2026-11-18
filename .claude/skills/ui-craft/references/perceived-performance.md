# 感知效能／資源載入

> 來源：Google web.dev 的 Core Web Vitals／圖片與字型載入指南（公開官方
> 文件，非 skill 檔案照搬）。門檻數值已於 web.dev/articles/vitals 核實。
> 本 repo 的 event 頁、吉祥物素材、各版本大量美術圖都吃得到。

## 一、三個目標數值（真實使用者第 75 百分位，桌機/手機分開算）

- **LCP（最大內容繪製）≤ 2.5s**：首屏最大的那張圖/那塊文字多快畫出來。
- **INP（互動到下次繪製）≤ 200ms**：點下去到畫面有反應多快。
- **CLS（累積版面位移）≤ 0.1**：畫面載入過程有沒有亂跳（接第八層骨架：
  目標 CLS 要逼近 0）。

## 二、圖片與 LCP：最常見的自傷

- **首屏主圖（hero / banner）千萬不要 `loading="lazy"`**：lazy 會讓瀏覽器
  等版面算完才去抓圖，首屏圖反而延後 → LCP 變慢。首屏圖用 **eager**（預設）
  ＋ `fetchpriority="high"`。
- 反過來，**首屏以下、要捲動才看到的圖才掛 `loading="lazy"`**（event 頁
  一長條活動圖、記錄頁下方內容都適用）。
- 從 CSS/JS 參照、瀏覽器不易提早發現的關鍵圖，用 `<link rel="preload">`
  ＋ `fetchpriority` 提早抓。
- 格式：同畫質下 AVIF 大約比 WebP 再小 30–50%，WebP 又比 JPEG/PNG 小。
  有 `<picture>` 就提供 AVIF/WebP + 舊格式 fallback；純裝飾小圖能用 SVG
  就用 SVG。

## 三、圖片與 CLS：先占位

- 每張 `<img>` 一定要寫 `width`／`height` 屬性（或 CSS `aspect-ratio`），
  讓瀏覽器在圖還沒到時就保留正確空間，圖一到不會把下面內容往下推。
  lazy-load 的圖尤其要寫，否則捲到它時會跳版。
- 這條跟第八層骨架是同一個目標（CLS→0），骨架佔位的尺寸也要用真實元件
  尺寸。

## 四、字型載入：FOUT/FOIT 與跳版

- **`font-display: swap`**：web 字還沒到先用系統字顯示文字（不要讓文字
  整段隱形＝FOIT），但 web 字到的時候字寬變化會造成跳版（CLS）。
- 縮小那次跳版：①`<link rel="preload">` 關鍵字型檔，縮短 fallback 時間；
  ②用 `size-adjust`／`ascent-override` 等 `@font-face` 描述詞，讓 fallback
  字的字寬/行高貼近 web 字，swap 時幾乎不位移；③子集化（subset）只留
  用得到的字元，檔案大幅變小。
- 本 repo 四語（zh/en/ko/th）若用到 web 字，中日韓泰字型檔很大，子集化
  跟 `unicode-range` 分檔尤其重要；CJK 常直接優先用系統字避免巨檔。

## 五、感知效能（讓「等待」感覺更短）

- 骨架/樂觀更新的時機規格走第八層（`skeleton-loading.md`）：< 200ms 不顯示
  任何 loading；確定結果可預期的動作（收藏）用樂觀更新。
- 關鍵路徑先出（首屏文字/主圖優先），裝飾性動效/次要圖延後載，不要讓
  一堆非關鍵資源卡住首屏。
- 第三層的動效規則在這裡交會：只對 `transform`/`opacity` 做動畫（不碰
  width/height/margin），既是視覺流暢也是 INP/掉幀考量。

## 六、驗收

- 首屏主圖是 eager 不是 lazy；首屏以下的圖才 lazy。
- 所有 `<img>` 有 width/height 或 aspect-ratio（捲動時不跳版）。
- 用 web 字的地方有 `font-display: swap` ＋ 關鍵字型 preload。
- 改完在 DevTools 的 Lighthouse/Performance 粗看 LCP、CLS 有沒有明顯惡化
  （容器連不到正式站時，至少本機 preview 量一次並在回報寫明「正式站未親眼
  確認」）。
