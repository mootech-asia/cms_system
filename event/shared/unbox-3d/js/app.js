/*
 * 拆卡包／拆盲盒共用流程：select（挑選）→ ready（已選定）→ loading（向後台取結果）→ opening（動畫）→ reveal（揭曉）。
 * 活動差異（type、圖片槽、文案、mock 內容）全部在各活動的 assets/js/config.js；本檔不放活動專屬內容。
 */
import { createScene } from './scene.js';

var cfg = window.EVENT_CONFIG;
var I18n = window.EventI18n;
var Store = window.EventStore;
var Sound = window.EventSound;
var t = I18n.t;
var pick = I18n.pick;
var content = Store.load();
var valid = Store.isValid(content);
var PLAYER_KEY = cfg.storageKey + '_player';
var LABELS_KEY = cfg.storageKey + '_labels';
var MOCK_KEY = 'event-mock-tools';
var PER_OPEN_KEY = cfg.storageKey + '_per_open_preview';

var $ = function (id) { return document.getElementById(id); };
var stage = $('stage');
var sceneEl = $('scene');
var btnAction = $('btnAction');
var reveal = $('reveal');
var toast = $('toast');

// iframe 嵌入時（CMS 各站）視窗只剩約 500px 高，3D 區與主標設最小尺寸，放不下就在 iframe 內捲動
var embedded = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
document.documentElement.classList.toggle('is-embedded', embedded);

var state = 'select';
var rewards = [];
var revealed = 0;
var toastTimer = null;
var perOpen = clampPerOpen(Number(content.perOpen) || 1);
try {
  var savedPerOpen = Number(sessionStorage.getItem(PER_OPEN_KEY));
  if (savedPerOpen) perOpen = clampPerOpen(savedPerOpen);
} catch (e) { /* 用後台數量 */ }

function clampPerOpen(n) { return Math.max(cfg.perOpenLimits.min, Math.min(cfg.perOpenLimits.max, n)); }

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ---------- 玩家狀態（mock；正式由後台回傳次數與紀錄） ----------
var player = loadPlayer();
function loadPlayer() {
  try {
    var s = JSON.parse(localStorage.getItem(PLAYER_KEY));
    if (s && s.version === content.updatedAt && typeof s.chances === 'number' && Array.isArray(s.records)) return s;
  } catch (e) { /* localStorage 不可用時退回記憶體狀態 */ }
  return freshPlayer();
}
function freshPlayer() { return { version: content.updatedAt, chances: Number(content.freeOpens) || 0, records: [] }; }
function savePlayer() {
  try { localStorage.setItem(PLAYER_KEY, JSON.stringify(player)); } catch (e) { /* 同上 */ }
}

// ---------- 圖片槽 ----------
function abs(src) { return new URL(src, document.baseURI).href; }
function applyImages() {
  var root = document.documentElement.style;
  Object.keys(cfg.images).forEach(function (k) {
    var src = pick(cfg.images[k]);
    if (Array.isArray(src)) src = src[0];
    // CSS 變數裡的 url() 以「使用它的樣式表」為基準解析，所以先轉成絕對網址
    if (typeof src === 'string' && src) root.setProperty('--ev-img-' + k, 'url("' + abs(src) + '")');
  });
  document.querySelectorAll('[data-img]').forEach(function (el) {
    var src = pick(cfg.images[el.getAttribute('data-img')]);
    if (Array.isArray(src)) src = src[0];
    if (!src) return;
    if (el.tagName === 'IMG') { el.decoding = 'async'; el.src = src; }
    else el.style.backgroundImage = 'url("' + src + '")';
  });
}

function renderAssetLabels() {
  document.querySelectorAll('[data-asset]').forEach(function (el) {
    el.textContent = el.getAttribute('data-asset').split(' ').map(function (k) {
      return (cfg.assetSpecs[k] || k).replace('{locale}', I18n.getLocale());
    }).join('\n');
  });
}

// ---------- 內容 ----------
function rarityOf(p) { return Store.RARITIES[Store.rarityRank(p)]; }

function renderContent() {
  $('period').textContent = content.period ? t('period', { p: content.period }) : '';
  $('rulesTitle').textContent = pick(content.rulesTitle) || t('rules.title');
  var rules = (pick(content.rules) || []).filter(function (r) { return String(r).trim(); });
  $('rulesList').innerHTML = rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
  $('rulesList').hidden = !rules.length;
  $('rulesEmpty').hidden = rules.length > 0;
}

function renderTicker() {
  var prizes = content.prizes || [];
  var list = (content.winners || []).map(function (w) {
    var prize = typeof w.prize === 'number' ? (prizes[w.prize] || {}).name : w.prize;
    return prize ? t('ticker.item', { name: esc(w.name), prize: esc(pick(prize)) }) : '';
  }).filter(Boolean);
  $('ticker').hidden = !list.length;
  var html = list.map(function (x) { return '<span class="ev-ticker-item">' + x + '</span>'; }).join('');
  $('tickerItems').innerHTML = html + html;
}

function renderRecords() {
  var list = $('recordList');
  list.querySelectorAll('.ev-record').forEach(function (li) { li.remove(); });
  $('recordEmpty').hidden = player.records.length > 0;
  player.records.slice().reverse().forEach(function (r) {
    var li = document.createElement('li');
    li.className = 'ev-record';
    li.innerHTML = '<span class="ev-record-name"><span class="ev-rarity-tag" data-rarity="' + esc(r.rarity) + '">' +
      esc(t('rarity.' + r.rarity)) + '</span>' + esc(pick(r.name)) + '</span><time>' + esc(r.time) + '</time>';
    list.appendChild(li);
  });
}

function renderChances() {
  $('chances').textContent = player.chances;
}

// ---------- 操作台 ----------
var ACTION_TEXT = { select: 'action.choose', ready: 'action.open', loading: 'action.open', opening: 'action.open', reveal: 'action.open' };
var STATUS_TEXT = { select: 'status.select', ready: 'status.ready', loading: 'status.loading', opening: 'status.opening' };
var statusOverride = null;

function renderState() {
  stage.setAttribute('data-state', state);
  $('actionText').textContent = t(ACTION_TEXT[state]);
  btnAction.disabled = state === 'loading' || state === 'opening';
  btnAction.classList.toggle('is-empty', state === 'select' && (player.chances <= 0 || !valid));
  $('btnBack').hidden = state !== 'ready';
  $('btnSkip').hidden = state !== 'opening';
  $('btnPrev').hidden = $('btnNext').hidden = state !== 'select' || !scene;
  var key = statusOverride || STATUS_TEXT[state];
  $('status').textContent = !valid ? t('empty.prizes') : key ? t(key) : '';
  renderPickLabel();
}

function renderPickLabel() {
  var i = scene ? scene.selected() : 0;
  $('pickLabel').textContent = t('pick.label', { n: String(i + 1).padStart(2, '0') });
}

function setState(next, status) {
  state = next;
  statusOverride = status || null;
  renderState();
}

function showToast(text) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.hidden = true; }, 2200);
}

function now() {
  var d = new Date();
  var p = function (x) { return String(x).padStart(2, '0'); };
  return d.getFullYear() + '/' + p(d.getMonth() + 1) + '/' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

function press() {
  Sound.play('click');
  btnAction.classList.add('is-pressing');
  setTimeout(function () { btnAction.classList.remove('is-pressing'); }, 140);
  try { if (typeof navigator.vibrate === 'function') navigator.vibrate(18); } catch (e) { /* 震動為選配 */ }
}

function choose() {
  if (!valid) { showToast(t('empty.prizes')); return; }
  if (player.chances <= 0) { showToast(t('toast.noChances')); return; }
  press();
  if (scene) scene.setMode('ready');
  setState('ready');
}

function open() {
  if (state !== 'ready') return;
  if (player.chances <= 0) { showToast(t('toast.noChances')); return; }
  press();
  player.chances -= 1;
  savePlayer();
  renderChances();
  setState('loading');
  var selection = scene ? scene.selected() : 0;
  Store.resolve(content, { type: cfg.type, selection: selection, count: perOpen }).then(function (list) {
    rewards = list;
    var stamp = now();
    list.forEach(function (r) { player.records.push({ name: r.name, rarity: rarityOf(r), time: stamp }); });
    savePlayer();
    renderRecords();
    setState('opening');
    Sound.play('tear');
    stage.classList.add('is-opening');
    var done = scene ? scene.open(cfg.openMs) : new Promise(function (ok) { fallbackTimer = setTimeout(ok, 600); });
    return done.then(function () {
      stage.classList.remove('is-opening');
      showReveal();
    });
  }).catch(function () {
    player.chances += 1;
    savePlayer();
    renderChances();
    setState('ready', 'status.error');
  });
}

var fallbackTimer = null;
function skip() {
  if (state !== 'opening') return;
  if (scene) scene.skip();
  else { clearTimeout(fallbackTimer); stage.classList.remove('is-opening'); showReveal(); }
}

function backToSelect() {
  if (state !== 'ready') return;
  Sound.play('move');
  if (scene) scene.setMode('select');
  setState('select');
}

// ---------- 揭曉 ----------
function cardHtml(r, small) {
  var rarity = rarityOf(r);
  return '<span class="ev-prize-face ev-prize-front" data-rarity="' + rarity + '">' +
    '<span class="ev-prize-frame" aria-hidden="true"></span>' +
    (r.icon ? '<img class="ev-prize-icon" src="' + esc(r.icon) + '" alt="" />' : '') +
    '<span class="ev-rarity-tag" data-rarity="' + rarity + '">' + esc(t('rarity.' + rarity)) + '</span>' +
    '<span class="ev-prize-name' + (small ? ' is-small' : '') + '">' + esc(pick(r.name)) + '</span></span>';
}

var revealView = 'card';
function showReveal() {
  setState('reveal');
  revealed = 0;
  revealView = 'card';
  reveal.hidden = false;
  renderRevealCard();
  $('revealCard').focus();
}

function renderRevealCard() {
  var r = rewards[revealed];
  var card = $('revealCard');
  card.classList.remove('is-flipped');
  card.setAttribute('data-rarity', rarityOf(r));
  $('revealGlow').setAttribute('data-rarity', 'common');
  card.innerHTML = '<span class="ev-prize-face ev-prize-back" aria-hidden="true"></span>' + cardHtml(r);
  card.classList.remove('is-enter');
  void card.offsetWidth;
  card.classList.add('is-enter');
  renderRevealText();
}

function flipped() { return $('revealCard').classList.contains('is-flipped'); }

function renderRevealText() {
  var total = rewards.length;
  var summary = revealView === 'summary';
  $('revealTitle').textContent = summary ? t('reveal.summary') : t('reveal.title');
  $('revealSingle').hidden = summary;
  $('revealGrid').hidden = !summary;
  var shown = revealed + (flipped() ? 1 : 0);
  $('revealCount').textContent = summary ? '' : flipped() ? t('reveal.count', { n: shown, total: total }) : t('reveal.tap');
  $('revealCard').setAttribute('aria-label', flipped() ? pick(rewards[revealed].name) : t('reveal.flip'));
  var last = revealed === total - 1;
  var key = summary || (flipped() && last && total === 1) ? 'reveal.done'
    : !flipped() ? 'reveal.flip'
    : last ? 'reveal.seeAll' : 'reveal.next';
  $('revealActionText').textContent = t(key);
  $('btnRevealAll').hidden = summary || total < 2 || (last && flipped());
}

function flip() {
  if (revealView !== 'card' || flipped()) return;
  var r = rewards[revealed];
  $('revealCard').classList.add('is-flipped');
  $('revealGlow').setAttribute('data-rarity', rarityOf(r));
  Sound.play('flip');
  setTimeout(function () { Sound.play('reveal', Store.rarityRank(r)); }, 180);
  renderRevealText();
}

function showSummary() {
  revealView = 'summary';
  $('revealGrid').innerHTML = rewards.map(function (r) { return '<li class="ev-prize-card is-static">' + cardHtml(r, true) + '</li>'; }).join('');
  Sound.play('reward');
  renderRevealText();
}

function revealStep() {
  if (revealView === 'summary') { closeReveal(); return; }
  if (!flipped()) { flip(); return; }
  if (revealed < rewards.length - 1) { revealed += 1; renderRevealCard(); return; }
  if (rewards.length > 1) showSummary();
  else closeReveal();
}

function closeReveal() {
  reveal.hidden = true;
  rewards = [];
  if (scene) scene.setMode('select');
  setState('select');
  btnAction.focus();
}

// ---------- 音效／語系 ----------
function renderSound() {
  var on = Sound.isEnabled();
  $('btnSound').setAttribute('aria-pressed', String(on));
  $('btnSound').setAttribute('aria-label', t(on ? 'sound.off' : 'sound.on'));
  $('soundIcon').src = on ? cfg.images.soundOn : cfg.images.soundOff;
}

function renderLabelToggle() {
  var on = document.body.classList.contains('show-asset-labels');
  $('btnLabels').setAttribute('aria-pressed', String(on));
  $('labelsState').textContent = t(on ? 'mock.on' : 'mock.off');
}

function renderLocale() {
  applyImages();
  renderContent();
  renderTicker();
  renderRecords();
  renderSound();
  renderState();
  renderLabelToggle();
  renderAssetLabels();
  if (!reveal.hidden) {
    if (revealView === 'summary') showSummary();
    else {
      var r = rewards[revealed];
      $('revealCard').querySelector('.ev-prize-front').outerHTML = cardHtml(r);
      renderRevealText();
    }
  }
}

// ---------- 3D ----------
var scene = null;
var imagesFor = cfg.type === 'blind-box'
  ? { front: cfg.images.boxFront, side: cfg.images.boxSide, lid: cfg.images.boxLid, lidSide: cfg.images.boxLidSide }
  : { front: cfg.images.packFront, back: cfg.images.packBack, side: cfg.images.packSide, crimp: cfg.images.packCrimp };
scene = createScene(sceneEl, {
  type: cfg.type,
  images: imagesFor,
  material: cfg.material,
  onSelect: function () { Sound.play('move'); renderPickLabel(); },
  onSwipeOpen: open
});
if (!scene) {
  // WebGL 不可用：顯示 2D 正面圖，流程照樣用按鈕完成
  sceneEl.classList.add('is-flat');
  $('sceneFallback').hidden = false;
  $('sceneFallback').setAttribute('data-img', cfg.type === 'blind-box' ? 'boxFront' : 'packFront');
  $('sceneNote').hidden = false;
}

// ---------- 事件 ----------
btnAction.addEventListener('click', function () {
  if (state === 'select') choose();
  else if (state === 'ready') open();
});
$('btnBack').addEventListener('click', backToSelect);
$('btnSkip').addEventListener('click', skip);
$('btnPrev').addEventListener('click', function () { if (scene) scene.move(1); });
$('btnNext').addEventListener('click', function () { if (scene) scene.move(-1); });
$('revealCard').addEventListener('click', function () { if (!flipped()) flip(); });
$('btnReveal').addEventListener('click', revealStep);
$('btnRevealAll').addEventListener('click', function () {
  if (!flipped()) $('revealCard').classList.add('is-flipped');
  if (rewards.length > 1) showSummary(); else closeReveal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !reveal.hidden && revealView === 'summary') closeReveal();
  if (state === 'select' && reveal.hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
    !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && scene) {
    scene.move(e.key === 'ArrowLeft' ? 1 : -1);
  }
});
$('btnSound').addEventListener('click', function () {
  Sound.setEnabled(!Sound.isEnabled());
  renderSound();
});

// ---------- 內部面板（預設隱藏；畫面同一位置連點三下叫出） ----------
// 連點判斷：每一下和前一下相隔 0.5 秒內、相距 40px 內就累計（一般人連點三下約 0.6～1 秒，
// 不能用「三下總共幾秒內」判斷）；點在按鈕、連結、輸入框上不算。
var panel = $('mockPanel');
function setPanel(openPanel) {
  panel.hidden = !openPanel;
  try { sessionStorage.setItem(MOCK_KEY, openPanel ? 'on' : 'off'); } catch (e) { /* 只在本次頁面生效 */ }
}
try { panel.hidden = sessionStorage.getItem(MOCK_KEY) !== 'on'; } catch (e) { /* 預設隱藏 */ }
var taps = [];
document.addEventListener('pointerup', function (e) {
  if (e.target.closest('button, a, input, select, textarea, label, [role="button"], #mockPanel')) { taps = []; return; }
  var t0 = performance.now();
  var lastTap = taps[taps.length - 1];
  if (!lastTap || t0 - lastTap.t > 500 || Math.abs(lastTap.x - e.clientX) > 40 || Math.abs(lastTap.y - e.clientY) > 40) taps = [];
  taps.push({ t: t0, x: e.clientX, y: e.clientY });
  if (taps.length >= 3) { taps = []; setPanel(panel.hidden); }
});
$('panelClose').addEventListener('click', function () { setPanel(false); });
$('btnReset').addEventListener('click', function () {
  if (state !== 'select' && state !== 'ready') return;
  player = freshPlayer();
  player.chances = cfg.mockResetOpens;
  savePlayer();
  renderChances();
  renderRecords();
  renderState();
  showToast(t('toast.reset', { n: player.chances }));
});
function setPerOpen(n) {
  var next = clampPerOpen(n);
  if (next === perOpen) return;
  perOpen = next;
  $('panelPerOpen').textContent = perOpen;
  try { sessionStorage.setItem(PER_OPEN_KEY, String(perOpen)); } catch (e) { /* 只在本次頁面生效 */ }
  showToast(t('toast.perOpen', { n: perOpen }));
}
$('panelPerOpen').textContent = perOpen;
$('panelLess').addEventListener('click', function () { setPerOpen(perOpen - 1); });
$('panelMore').addEventListener('click', function () { setPerOpen(perOpen + 1); });
$('btnLabels').addEventListener('click', function () {
  var on = !document.body.classList.contains('show-asset-labels');
  document.body.classList.toggle('show-asset-labels', on);
  try { localStorage.setItem(LABELS_KEY, on ? 'on' : 'off'); } catch (e) { /* 只在本次頁面生效 */ }
  renderLabelToggle();
});
try { document.body.classList.toggle('show-asset-labels', localStorage.getItem(LABELS_KEY) === 'on'); } catch (e) { /* 預設關閉 */ }

// ---------- 進站 loading：第一屏圖片與 3D 貼圖載完才移除（最多等 10 秒） ----------
function runLoading() {
  var overlay = $('loading');
  var urls = {};
  function add(src) {
    if (Array.isArray(src)) { src.forEach(add); return; }
    if (typeof src === 'string' && src) urls[abs(src)] = true;
  }
  cfg.loadingImages.forEach(function (k) { add(pick(cfg.images[k])); });
  var list = Object.keys(urls);
  var total = list.length + (scene ? 1 : 0);
  var done = 0;
  var finished = false;
  function render() {
    var pct = total ? Math.round(done / total * 100) : 100;
    $('loadingFill').style.width = pct + '%';
    $('loadingPct').textContent = pct + '%';
  }
  function step() { done += 1; render(); if (done >= total) finish(); }
  function finish() {
    if (finished) return;
    finished = true;
    overlay.hidden = true;
  }
  render();
  setTimeout(finish, 10000);
  if (!total) { finish(); return; }
  list.forEach(function (src) {
    var img = new Image();
    img.onload = img.onerror = step;
    img.src = src;
  });
  if (scene) scene.ready.then(step);
}

try {
  if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(function () {});
} catch (e) { /* 不支援 */ }

document.addEventListener('ev:locale', renderLocale);
window.EventShare.init(showToast);
I18n.renderSwitcher($('langSwitch'));
renderChances();
I18n.applyLocale();
runLoading();
