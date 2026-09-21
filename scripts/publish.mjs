// vite build 對純 CSS entry 會把輸出當 asset 處理，檔名帶 hash
// （dist/assets/<version>-<hash>.css，entry key 見 vite.config.js）。
// 這裡把它複製成固定檔名 tailwind.css，放進對應 vN/site/assets/css/，
// 靜態頁面用不變的 <link href> 引用，不用每次 build 都去改 HTML。
import { readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distAssets = join(root, 'dist', 'assets');
const entries = readdirSync(distAssets).filter((f) => f.endsWith('.css'));

for (const file of entries) {
  const m = file.match(/^(v[0-9._]+)-[A-Za-z0-9_-]{8}\.css$/);
  if (!m) { console.warn('跳過（檔名格式不符預期，entry key 要用 vN）：', file); continue; }
  const [, version] = m;
  const destDir = join(root, version, 'site', 'assets', 'css');
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, 'tailwind.css');
  copyFileSync(join(distAssets, file), dest);
  console.log(`${file} -> ${version}/site/assets/css/tailwind.css`);
}
