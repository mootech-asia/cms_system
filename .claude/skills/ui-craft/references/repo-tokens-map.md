# 本 repo 各版本既有 token 在哪裡

動手挑任何顏色/間距/圓角/陰影數值前，先查這裡對應版本的檔案，不要自己編新值。

| 版本 | raw token（`:root` CSS variable） | 換膚 skin 覆寫 | Tailwind 對應（僅 v4~v6） |
|---|---|---|---|
| v1.5 | `v1.5/site/assets/css/main.css` | （無獨立 skins 目錄，需另行確認） | 無（未轉換） |
| v2 | `v2/site/assets/css/main.css`、`app.css` | （需另行確認） | 無（未轉換） |
| v3 | `v3/site/assets/css/design-system/tokens.css`（主要）、`main.css` | `v3/site/assets/css/skins/`、`design-system/variants.css`、`chrome-variants.css` | 無（未轉換） |
| v4 | `v4/site/assets/css/main.css` | `v4/site/assets/css/skins/*.css` | `src/v4/theme.css`（`@theme static` 把 `--color-*` 對應回 raw token） |
| v5 | `v5/site/assets/css/main.css` | `v5/site/assets/css/skins/*.css` | `src/v5/theme.css` |
| v6 | `v6/site/assets/css/main.css` | `v6/site/assets/css/skins/*.css` | `src/v6/theme.css` |

**v4~v6 找 Tailwind class 對應的 token 名稱**：直接看 `src/vN/theme.css` 的
`@theme static { --color-xxx: var(--xxx); }` 區塊，左邊是 Tailwind 那邊能用的
`bg-xxx`/`text-xxx`/`border-xxx` 名稱，右邊 `var(--xxx)` 才是實際色值來源
（在 `main.css`／`skins/*.css` 的 `:root`）。**不要跳過這層直接寫任意值**，也不要
在 `theme.css` 重複宣告 `main.css` 已經有的 raw token（見該檔開頭註解）。

**v1.5~v3（尚未轉 Tailwind）**：色值/間距全部從對應 `main.css`／`tokens.css` 的
`:root` 找既有 CSS variable 套用，不得新增任意 hex/px（CLAUDE.md 版本慣例）。

**未來 v1.5~v3 轉 `vN/tailwind/` 時**：照搬 v4~v6 的模式——`src/vN/theme.css` +
`vite.config.js` 的 `rollupOptions.input` entry + `scripts/publish.mjs` 輸出到
`vN/tailwind/site/assets/css/tailwind.css`（見 CLAUDE.md「專案定位」一節）。做這件事
之前先跑一次上面這張表確認原始版本的 token 檔案實際名稱／路徑，可能跟這裡列的有出入
（v1.5/v2 的 skins 目錄未確認存在，動手前用 `ls` 實際核對一次）。
