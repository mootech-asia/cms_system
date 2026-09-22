# cms_system — 工作守則

## 專案定位
本 repo 是 `cms_system_v2`、`cms_system_v3` 的統一預覽/交付 repo。每個版本都是完全
獨立、免建置的純 HTML+CSS+JS 靜態站：不得含任何前端框架殘留（Vue／Nuxt／
Tailwind 編譯輸出／PrimeVue 等），CSS 一律手寫、以 CSS variable/token 為基礎。

**鐵則例外**：v4/v5/v6 的 `site/` 已原地改用真正的 Tailwind utility class
（不是複製一份快照，直接編輯同一份 HTML，靠 git 歷史回溯舊版），`assets/css/
tailwind.css` 是這三版的合法編譯輸出，不算框架殘留；`studio/` 維持不動，仍直接
`<link>` 原始 `main.css`／`skins/*.css`，因為 studio 控制台本身的畫面完全依賴
它們渲染。v1.5／v2／v3 未來也要轉換，但做法不同：**原始 `vN/site/`、`vN/studio/`
維持不動、不得修改或刪除**（做為轉換對照基準），另外在各自版本資料夾內新增
`vN/tailwind/site/`、`vN/tailwind/studio/`，把原始檔案複製進去做轉換。建置管線
沿用 v4/v5/v6 既有模式：`src/vN/theme.css` + 統一 `vite.config.js` 的
`rollupOptions.input` entry + `scripts/publish.mjs` 依 entry key 輸出固定檔名到
`vN/tailwind/site/assets/css/tailwind.css`，不用另外架設獨立建置專案。

## 目錄結構
```
cms_system/
├── index.html          # 統一首頁：四個入口（v2/v3 各自的前台 + 設計後台）
├── v2/
│   ├── site/            # 前台
│   └── studio/           # 設計後台（iframe 預覽 ../site/，localStorage 同步換膚）
└── v3/
    ├── site/
    └── studio/
```
`site/` 與 `studio/` 是同層級的獨立資料夾；設計後台透過相對路徑跨資料夾讀取
`../site/assets/...`、`../site/themes/...`，iframe 指向 `../site/index.html`。
localStorage 為同源同步（不受資料夾路徑影響），改動路徑時務必同步檢查 studio
內的 `<link>`／`<script>`／iframe `src`。

## 鐵則（必守，不得因後續任務忘記而破例）

1. **CSS 復用優先**：新增內容前一律先檢查既有 CSS 樣式庫（`site/assets/css/`
   下的 token／共用元件 class）是否已有可套用的定義；只有確認找不到才能新增
   新樣式。禁止為了省事另外疊加等價樣式，避免檔案累贅。

2. **禁止分派 subagent**：本 repo 所有調查、批次修改、逐頁驗證、e2e、截圖比對
   等工作一律由主對話親自執行，**不得分派給 subagent**，除非使用者在該次對話
   中明確表示要使用 subagent。

3. **禁止業主要求類敘述型註解**：程式碼註解只寫技術上必要的說明（隱藏的限制、
   不明顯的行為、bug 的因應方式），禁止寫入「業主要求」「業主指示」「業主
   2026-xx-xx」之類的敘述型/歷程型註解。這類資訊屬於 commit message 或對話
   紀錄，不進原始碼。

## 驗收標準（逐頁把關，不得留到最後才修）

每頁遷移/淨化完成才能視為該頁完成，標準如下，缺一不可：

- **視覺**：轉換前後同斷點（桌機/手機）截圖跑 pixel-diff，差異需逼近 0
  （只容許字體抗鋸齒級雜訊）。v4~v6 改用真正 Tailwind utility class 時，
  間距/尺寸類 utility 優先採用 Tailwind 預設刻度而非任意 px 值（見
  `src/vN/theme.css` 開頭註解），因此對不上 4px 刻度的原始數值換算後
  可能有 1~3px 落差——這種情況以目視確認版面沒有跑版/重疊/文字截斷
  為準，不強制 pixel-diff 逼近 0。
- **功能**：轉換前列出頁面所有互動點（按鈕/tab/輪播/表單/modal/收藏/換膚/
  換語言/studio 控制項）與預期行為，轉換後逐一重新觸發比對，缺一項不算過。
- **內容**：文字/資料/複製內容逐字保留，不做任何順手改寫。
- **console**：轉換前後瀏覽器 console 錯誤/警告數量不能變多。

## 慣例
- **溝通一律使用中文**：與使用者的所有對話（含新開的 session）一律使用繁體中文，
  不得因任務內容（英文素材、截圖英文字串等）切回英文回覆。commit message 內文
  可用英文聚焦動機，但對話說明仍須中文。
- 分支：直接於 `main` 開發（除非另有指示）。
- `v1.5`～`v3` 的 `vN/site/`、`vN/studio/`（原始快照）：樣式只用既有 token/
  共用 class，禁任意值色碼、禁 Tailwind/框架殘留。`v4`～`v6` 的 `site/`
  與所有版本的 `vN/tailwind/`：就是要用 Tailwind，顏色/陰影/圓角/間距
  一律引用既有 `--color-*`／`--radius-*` 等 token，不寫死任意值色碼。
