#!/usr/bin/env node
/*
 * 逐頁、逐語系用無頭瀏覽器把每個版本的靜態站實際「跑起來」，
 * 抓出兩類翻譯漏洞：
 *   1. chinese-leak  — 語系切到 en/ko/th 時，畫面上還留著中文字元
 *      （通常是某個字串只有 zh 版本、字典漏了 en/ko/th 對應）。
 *   2. same-as-baked — 同一個位置的文字在四個語系下完全一樣（通常是
 *      整串內容根本沒進翻譯字典，四個語系都顯示同一份烘焙原文，
 *      例如這次修的「Rewards · Day 27...」「Please enter your
 *      nickname」「Slot/Live」）。專有名詞（遊戲名/廠商名/球隊名/
 *      帳號/金額等，見 config.js）不受此規則限制。
 *
 * 用法：
 *   cd tools/i18n-audit && npm install && npm run audit
 *   npm run audit -- --site=v3-site         只跑單一站
 *   npm run audit -- --json=report.json     另外輸出 JSON 報告
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright-core');
const config = require('./config');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const CJK_RE = /[㐀-䶿一-鿿豈-﫿]/;

function findChromePath() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const dirs = fs.readdirSync(base).filter((d) => d.startsWith('chromium-'));
  if (!dirs.length) throw new Error('找不到 chromium，請確認 PLAYWRIGHT_BROWSERS_PATH: ' + base);
  return path.join(base, dirs.sort().pop(), 'chrome-linux', 'chrome');
}

const MIME = {
  html: 'text/html; charset=utf-8', js: 'application/javascript', css: 'text/css',
  json: 'application/json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg',
  jpeg: 'image/jpeg', woff2: 'font/woff2', ico: 'image/x-icon',
};

function startServer(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(root, p);
      if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('not found: ' + p); return; }
        const ext = path.extname(filePath).slice(1);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function listPages(absDir, excludePages) {
  const exclude = excludePages || [];
  return fs.readdirSync(absDir).filter((f) => f.endsWith('.html') && exclude.indexOf(f) === -1);
}

/* 在頁面內執行：走過所有文字節點與關鍵屬性，回傳 {kind, text, selector, properNoun} */
function collectPageStrings(args) {
  const hints = args[0], ignoreExact = args[1];
  function cssPath(el) {
    const parts = [];
    let cur = el;
    while (cur && cur.nodeType === 1 && parts.length < 6) {
      let sel = cur.tagName.toLowerCase();
      if (typeof cur.className === 'string' && cur.className.trim()) {
        sel += '.' + cur.className.trim().split(/\s+/).slice(0, 2).join('.');
      }
      parts.unshift(sel);
      cur = cur.parentElement;
    }
    return parts.join(' > ');
  }
  function isProperNoun(el) {
    let cur = el;
    for (let i = 0; i < 6 && cur; i++) {
      const cls = typeof cur.className === 'string' ? cur.className : '';
      if (hints.some((h) => cls.indexOf(h) !== -1)) return true;
      cur = cur.parentElement;
    }
    return false;
  }
  const out = [];
  const seen = new Set();
  function push(kind, text, el) {
    const t = (text || '').trim();
    if (!t || ignoreExact.indexOf(t) !== -1) return;
    const key = kind + '|' + cssPath(el) + '|' + t;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ kind: kind, text: t, selector: cssPath(el), properNoun: isProperNoun(el) });
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const parent = n.parentElement;
    if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue;
    push('text', n.nodeValue, parent);
  }
  ['placeholder', 'aria-label', 'title', 'alt'].forEach((attr) => {
    document.querySelectorAll('[' + attr + ']').forEach((el) => push(attr, el.getAttribute(attr), el));
  });
  return out;
}

async function scanPage(browser, origin, site, pagePath) {
  const perLocale = {};
  for (const locale of site.locales) {
    const context = await browser.newContext();
    const extra = Object.entries(site.extraLocalStorage || {});
    await context.addInitScript(
      ([key, loc, extraEntries]) => {
        try {
          window.localStorage.setItem(key, loc);
          extraEntries.forEach(([k, v]) => window.localStorage.setItem(k, v));
        } catch (e) {}
      },
      [site.localeStorageKey, locale, extra]
    );
    const page = await context.newPage();
    const url = origin + '/' + site.dir + '/' + pagePath;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(250);
      perLocale[locale] = await page.evaluate(collectPageStrings, [config.properNounClassHints, config.ignoreExactText]);
    } catch (e) {
      perLocale[locale] = { error: String((e && e.message) || e) };
    } finally {
      await context.close();
    }
  }
  return perLocale;
}

function matchesIgnorePattern(text) {
  return (config.ignoreTextPatterns || []).some((re) => re.test(text));
}

function analyze(site, pagePath, perLocale) {
  const findings = [];
  const locales = site.locales;
  const zh = perLocale.zh;
  if (!Array.isArray(zh)) return findings;

  // 1) chinese-leak: en/ko/th 底下任何非專有名詞字串仍含中文字元
  locales.filter((l) => l !== 'zh').forEach((locale) => {
    const rows = perLocale[locale];
    if (!Array.isArray(rows)) return;
    rows.forEach((row) => {
      if (row.properNoun || matchesIgnorePattern(row.text)) return;
      if (CJK_RE.test(row.text)) {
        findings.push({ type: 'chinese-leak', locale, kind: row.kind, selector: row.selector, text: row.text });
      }
    });
  });

  // 2) same-as-baked：同一個 (kind, selector) 在 zh 與其他語系文字逐字相同
  //    （純數字/符號字串不算，那本來就該跨語系一樣）
  const zhMap = new Map();
  zh.forEach((row) => { if (!row.properNoun) zhMap.set(row.kind + '|' + row.selector, row); });
  const hasLetter = /[a-zA-Z一-鿿가-힣฀-๿]/;
  locales.filter((l) => l !== 'zh').forEach((locale) => {
    const rows = perLocale[locale];
    if (!Array.isArray(rows)) return;
    rows.forEach((row) => {
      if (row.properNoun || !hasLetter.test(row.text) || matchesIgnorePattern(row.text)) return;
      const zhRow = zhMap.get(row.kind + '|' + row.selector);
      if (zhRow && zhRow.text === row.text) {
        findings.push({ type: 'same-as-baked', locale, kind: row.kind, selector: row.selector, text: row.text });
      }
    });
  });

  return findings;
}

async function main() {
  const args = process.argv.slice(2);
  const onlySite = (args.find((a) => a.startsWith('--site=')) || '').split('=')[1];
  const jsonOut = (args.find((a) => a.startsWith('--json=')) || '').split('=')[1];

  const server = await startServer(REPO_ROOT);
  const port = server.address().port;
  const origin = 'http://127.0.0.1:' + port;
  const browser = await chromium.launch({ executablePath: findChromePath(), headless: true });

  const report = [];
  try {
    for (const site of config.sites) {
      if (onlySite && site.key !== onlySite) continue;
      const absDir = path.join(REPO_ROOT, site.dir);
      const pages = listPages(absDir, site.excludePages);
      console.log('\n=== ' + site.key + ' (' + pages.length + ' 頁) ===');
      for (const pagePath of pages) {
        const perLocale = await scanPage(browser, origin, site, pagePath);
        const errors = Object.keys(perLocale).filter((l) => !Array.isArray(perLocale[l]));
        if (errors.length) {
          console.log('  ' + pagePath + ': [error] ' + errors.map((l) => l + ': ' + perLocale[l].error).join('; '));
        }
        const findings = analyze(site, pagePath, perLocale);
        if (findings.length) {
          console.log('  ' + pagePath + ':');
          findings.forEach((f) => {
            console.log('    [' + f.type + '][' + f.locale + '][' + f.kind + '] ' + f.selector + '  ->  "' + f.text + '"');
          });
        }
        report.push({ site: site.key, page: pagePath, findings: findings });
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const total = report.reduce((n, r) => n + r.findings.length, 0);
  console.log('\n共發現 ' + total + ' 筆疑似翻譯漏洞。');
  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2));
    console.log('完整報告已寫入 ' + jsonOut);
  }
  process.exit(total > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
