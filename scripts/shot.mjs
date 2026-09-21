import { chromium } from 'playwright';
const url = process.argv[2];
const outPath = process.argv[3];
const width = Number(process.argv[4] || 1440);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width, height: 1000 } });
page.setDefaultTimeout(15000);
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));
// networkidle 在 sandbox 環境下會因為外部資源（字型/CDN）連線被 proxy
// 擋掉、瀏覽器不斷重試而永遠等不到零連線,改用 load + 固定等待。
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(500);
// document.fonts.ready 在字型被 proxy 擋掉時可能永遠 pending,
// evaluate() 本身沒有 timeout,一定要在瀏覽器內用 race 自己頂一個上限。
await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))])).catch(() => {});
await page.evaluate(() => Promise.race([
  Promise.all([...document.images].map((img) => img.decode().catch(() => {}))),
  new Promise((r) => setTimeout(r, 3000)),
])).catch(() => {});
await page.waitForTimeout(300);
const height = await page.evaluate(() => document.body.scrollHeight);
await page.setViewportSize({ width, height });
await page.waitForTimeout(150);
await page.screenshot({ path: outPath, fullPage: true });
console.log(JSON.stringify({ errors }));
await browser.close();
