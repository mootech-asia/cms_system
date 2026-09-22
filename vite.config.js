import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 純 CSS 編譯用途：v4/v5/v6 改用真正 Tailwind utility class 寫 HTML，
// 每個版本一份 @theme（src/vN/theme.css）——這幾版的 site/ 本來就是
// 手機/桌機共用同一套 CSS（@media 斷點切版，沒有獨立 mobile 資料夾）。
// v2-mobile 是例外：v2/site 本身維持原本免建置純手寫 CSS 不動，但
// v2/site-mobile（獨立手機版資料夾，跟 v3/site-mobile 同層級架構）
// 改用真正 Tailwind utility class，所以這裡多一個 entry。v1.5/v3
// 仍完全不進這份 build。build 輸出到 dist/，scripts/publish.mjs 依
// entry key 複製成固定檔名放進對應資料夾的 assets/css/tailwind.css，
// 靜態頁面用一般 <link> 引用，瀏覽端不需要 Vite/Node，Vite 只是
// 編譯期工具。
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
      },
    },
  },
});
