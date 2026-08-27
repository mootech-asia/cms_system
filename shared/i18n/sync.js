// 讀取 master.json(翻譯主檔),套用回各版本各自的 i18n.js。
// 用法: node shared/i18n/sync.js [--dry-run] [v4,v5,v6,...]
// 不帶版本參數時,套用到 master.json 內所有 entry.targets 出現過的版本。
'use strict';
const fs = require('fs');
const path = require('path');
const store = require('./flat-store');

const VERSION_FILE = {
  v4: '../../v4/site/assets/js/i18n.js',
  v5: '../../v5/site/assets/js/i18n.js',
  v6: '../../v6/site/assets/js/i18n.js',
};

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const versionArg = args.find((a) => !a.startsWith('--'));
const onlyVersions = versionArg ? versionArg.split(',') : null;

const masterPath = path.join(__dirname, 'master.json');
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
const brandMap = master.brand || {};

function applyBrand(value, brand) {
  if (!brand || value.indexOf('{{BRAND}}') === -1) return value;
  return value.split('{{BRAND}}').join(brand);
}

function resolveValue(entry, version, locale) {
  const override = entry.overrides && entry.overrides[version] && entry.overrides[version][locale];
  const raw = override != null ? override : entry[locale];
  return applyBrand(raw, brandMap[version]);
}

const versionsToSync = Object.keys(VERSION_FILE).filter((v) => !onlyVersions || onlyVersions.includes(v));

let anyChanged = false;
for (const version of versionsToSync) {
  const updates = {};
  for (const [masterKey, entry] of Object.entries(master.entries)) {
    const targetKey = entry.targets && entry.targets[version];
    if (!targetKey) continue;
    updates[targetKey] = {
      zh: resolveValue(entry, version, 'zh'),
      en: resolveValue(entry, version, 'en'),
      ko: resolveValue(entry, version, 'ko'),
      th: resolveValue(entry, version, 'th'),
    };
  }

  const filePath = path.join(__dirname, VERSION_FILE[version]);
  const original = fs.readFileSync(filePath, 'utf8');
  const parsed = store.load(original);
  const updated = store.apply(parsed, updates);

  if (updated === original) {
    console.log(version, '無變更 (', Object.keys(updates).length, '個 key 已同步)');
    continue;
  }
  anyChanged = true;
  console.log(version, '有變更 (', Object.keys(updates).length, '個 key 套用中)');
  if (!dryRun) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('  已寫入', VERSION_FILE[version]);
  } else {
    console.log('  [dry-run] 未寫入');
  }
}

if (!anyChanged) {
  console.log('\n全部版本皆與主檔一致,無需更新。');
}
