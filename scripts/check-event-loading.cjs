const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.EVENT_TEST_BASE || 'http://127.0.0.1:8000/';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    for (const event of ['20261111_lucky_wheel', '20261111_survival_spin']) {
      for (const lang of ['en', 'ko', 'th']) {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        const errors = [];
        const requested = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('request', request => requested.push(request.url()));
        // Failed animation downloads must not block entry or replace the visible poster.
        await page.route('**/images/mascot/*.webp', route => route.request().url().includes('_poster.webp') ? route.continue() : route.abort());
        await page.goto(`${base}event/${event}/?lang=${lang}`, { waitUntil: 'domcontentloaded' });
        await page.locator('#loading').waitFor({ state: 'hidden', timeout: 5000 });
        await page.waitForFunction(() => {
          const image = document.getElementById('mascot');
          return image.complete && image.naturalWidth > 0 && image.src.includes('_poster.webp');
        });
        const titles = requested.filter(url => /\/title-(en|ko|th|zh)\./.test(url));
        assert(titles.length > 0 && titles.every(url => url.includes(`title-${lang}.`)));
        await page.locator('#btnSpin').click();
        await page.locator('#resultModal').waitFor({ state: 'visible' });
        assert(await page.locator('#mascot').evaluate(image => image.complete && image.naturalWidth > 0));
        await page.locator('#btnClose').click();
        assert.deepEqual(errors, []);
        console.log(`PASS ${event} ${lang}: localized entry, failed-animation fallback, spin`);
        await page.close();
      }
      const page = await browser.newPage();
      await page.route('**/stage-bg.webp*', () => {});
      await page.goto(`${base}event/${event}/`, { waitUntil: 'domcontentloaded' });
      await page.locator('#loading').waitFor({ state: 'hidden', timeout: 12000 });
      assert(await page.locator('#btnSpin').isVisible());
      console.log(`PASS ${event}: stalled critical image releases loader`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
