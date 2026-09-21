import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 純 CSS 編譯用途：v4/v5/v6 改用真正 Tailwind utility class 寫 HTML，
// 每個版本一份 @theme（src/vN/theme.css）——這幾版的 site/ 本來就是
// 手機/桌機共用同一套 CSS（@media 斷點切版，沒有獨立 mobile 資料夾，
// 見各版 CLAUDE.md 鐵則 4），所以不比照 cms_system_tailwind 那份為
// v3 site-mobile 額外拆出 pc/mobile 兩份 @theme 的做法。v1.5/v2/v3
// 維持原本免建置純手寫 CSS，不進這份 build。build 輸出到 dist/，
// scripts/publish.mjs 依 entry key 複製成固定檔名放進對應
// vN/site/assets/css/tailwind.css，靜態頁面用一般 <link> 引用，
// 瀏覽端不需要 Vite/Node，Vite 只是編譯期工具。
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        v4: resolve(__dirname, 'src/v4/theme.css'),
        v5: resolve(__dirname, 'src/v5/theme.css'),
      },
    },
  },
});
