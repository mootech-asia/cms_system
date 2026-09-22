// 每頁截圖用來跑 pixel-diff 驗收，登入態各版本 key/value 不同（v1.5 是
// 'v15-logged-in'='true'、v2 是 'win100-logged-in'='1'……），用第 6/7 個
// 參數傳，不寫死單一版本的值。
import { chromium } from 'playwright';
import fs from 'fs';

const pages = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n');
const outDir = process.argv[3];
const baseUrlPrefix = process.argv[4]; // e.g. http://127.0.0.1:8899/v1.5/site or .../v1.5/tailwind/site
const width = Number(process.argv[5] || 1440);
const loginKey = process.argv[6] || '';
const loginValue = process.argv[7] || '';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const p of pages) {
  if (!p) continue;
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  if (loginKey) {
    await page.addInitScript(([k, v]) => { localStorage.setItem(k, v); }, [loginKey, loginValue]);
  }
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  try {
    await page.goto(`${baseUrlPrefix}/${p}`, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(500);
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))])).catch(() => {});
    const height = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewportSize({ width, height: Math.max(height, 200) });
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${outDir}/${p.replace('.html','')}.png`, fullPage: true });
    const realErrors = errors.filter(e => !e.includes('ERR_TUNNEL_CONNECTION_FAILED') && !e.includes('404'));
    console.log(p, 'OK', realErrors.length ? `ERRORS: ${JSON.stringify(realErrors)}` : '');
  } catch (e) {
    console.log(p, 'FAIL', String(e).slice(0,150));
  }
  await page.close();
}
await browser.close();
