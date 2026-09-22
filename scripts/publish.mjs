// vite build 對純 CSS entry 會把輸出當 asset 處理，檔名帶 hash
// （dist/assets/<entry key>-<hash>.css，entry key 見 vite.config.js）。
// 這裡把它複製成固定檔名 tailwind.css，放進對應輸出資料夾，靜態頁面用
// 不變的 <link href> 引用，不用每次 build 都去改 HTML。
// entry key -> 輸出目的地，逐筆列表而非用正規表示式猜版號組字串：
// v2-mobile 這種「vN 但不是 vN/site」的例外（獨立手機版資料夾）沒辦法
// 純靠版號推導路徑，顯式列表兩種情況都能處理，也不用每加一個例外就
// 改一次規則。
import { readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distAssets = join(root, 'dist', 'assets');
const entries = readdirSync(distAssets).filter((f) => f.endsWith('.css'));

const DEST_BY_ENTRY = {
  v4: 'v4/site/assets/css',
  v5: 'v5/site/assets/css',
  v6: 'v6/site/assets/css',
  'v2-mobile': 'v2/site-mobile/assets/css',
};

for (const file of entries) {
  const m = file.match(/^([A-Za-z0-9._-]+)-[A-Za-z0-9_-]{8}\.css$/);
  const entryKey = m && m[1];
  const destRel = entryKey && DEST_BY_ENTRY[entryKey];
  if (!destRel) { console.warn('跳過（entry key 不在 DEST_BY_ENTRY 對照表裡）：', file); continue; }
  const destDir = join(root, destRel);
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, 'tailwind.css');
  copyFileSync(join(distAssets, file), dest);
  console.log(`${file} -> ${destRel}/tailwind.css`);
}
