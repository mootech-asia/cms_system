import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 純 CSS 編譯用途：v4/v5/v6 改用真正 Tailwind utility class 寫 HTML，
// 每個版本一份 @theme（src/vN/theme.css）——這幾版的 site/ 本來就是
// 手機/桌機共用同一套 CSS（@media 斷點切版，沒有獨立 mobile 資料夾）。
// v2-mobile 是 v2/site-mobile（獨立手機版資料夾）的 entry。v2、v3 的
// site/、studio/ 也已改用真正 Tailwind utility class（原本的非 Tailwind
// 版已移除），entry key 為 v2-site／v2-studio／v3-site／v3-studio。
// v1.5 仍是原始 v1.5/site 加上轉換用的 v1.5/tailwind/site，entry key
// 用 "v15" 而非 "v1.5"：純 CSS entry 由 Vite 當 asset 處理，實測點號會
// 被誤判成副檔名分隔符，輸出檔名被砍成 "v1"。build 輸出到 dist/，
// scripts/publish.mjs 依 entry key 複製成固定檔名放進對應資料夾的
// tailwind.css，靜態頁面用一般 <link> 引用，瀏覽端不需要 Vite/Node，
// Vite 只是編譯期工具。
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        v4: resolve(__dirname, 'src/v4/theme.css'),
        v5: resolve(__dirname, 'src/v5/theme.css'),
        v6: resolve(__dirname, 'src/v6/theme.css'),
        'v2-mobile': resolve(__dirname, 'src/v2-mobile/theme.css'),
        'v15-tailwind-site': resolve(__dirname, 'src/v1.5/theme.css'),
        'v2-site': resolve(__dirname, 'src/v2/theme.css'),
        'v2-studio': resolve(__dirname, 'src/v2/theme-studio.css'),
        'v3-site': resolve(__dirname, 'src/v3/theme.css'),
        'v3-studio': resolve(__dirname, 'src/v3/theme-studio.css'),
      },
    },
  },
});
