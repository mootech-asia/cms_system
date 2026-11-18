/*
 * 拆卡包／拆盲盒共用流程：select（挑選）→ ready（已選定）→ loading（向後台取結果）→ opening（動畫）→ reveal（揭曉）。
 * 活動差異（type、圖片槽、文案、mock 內容）全部在各活動的 assets/js/config.js；本檔不放活動專屬內容。
 */
import { createScene } from './scene.js?v=20261118-art2';

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
      return (cfg.assetSpecs[k] || k).replace('{locale}', I18n.getLocale()).replace('{state}', mascotState);
    }).join('\n');
  });
}

// ---------- 吉祥物：站在選中包裝後方中央（畫布在上層，前排包裝擋住下半身） ----------
// 所有動態共用同一張基準幀、長度相同（config.mascot.loopMs），切換時等目前這段播完一輪再換，畫面不會跳；
// loopMs 為 0（靜態圖）時立即切換。目標動態還沒下載完就保留目前動作，慢網路下角色不會消失。
var M = cfg.mascot || null;
var mascotEl = $('mascot');
var mascotCache = {};
var mascotWant = null;
var mascotShownAt = 0;
var mascotTimer = null;
var mascotAfter = null;
var mascotState = 'idle';
function loadMascot(src, done) {
  var entry = mascotCache[src];
  if (!entry || entry.failed) {
    entry = mascotCache[src] = { ready: false, failed: false, cbs: [] };
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () { entry.ready = true; entry.cbs.splice(0).forEach(function (cb) { cb(true); }); };
    img.onerror = function () { entry.failed = true; entry.cbs.splice(0).forEach(function (cb) { cb(false); }); };
    img.src = src;
  }
  if (entry.ready) done(true); else entry.cbs.push(done);
}
function setMascot(next) {
  if (!M) return;
  clearTimeout(mascotAfter);
  var src = next === 'idle' ? M.idle[0] : (M[next] || M.idle[0]);
  if (!src) return;
  mascotWant = src;
  loadMascot(src, function (ok) {
    if (!ok || mascotWant !== src) return;
    clearTimeout(mascotTimer);
    var swap = function () {
      if (mascotWant !== src) return;
      mascotEl.src = src;
      mascotShownAt = performance.now();
      mascotState = next;
      renderAssetLabels();
    };
    var loop = M.loopMs;
    if (!mascotShownAt || !loop) { swap(); return; }
    mascotTimer = setTimeout(swap, (loop - (performance.now() - mascotShownAt) % loop) % loop);
  });
}
// 揭曉層蓋住舞台，所以慶祝／失望在關閉揭曉後演兩輪再回到待機
function mascotReact(list) {
  if (!M) return;
  var best = Math.max.apply(null, list.map(Store.rarityRank));
  setMascot(best >= 1 ? 'celebrate' : 'lose');
  mascotAfter = setTimeout(function () { if (state === 'select') setMascot('idle'); }, Math.max(2, Math.ceil(3000 / (M.loopMs || 3000))) * (M.loopMs || 1500));
}
if (M) {
  if (M.poster) mascotEl.src = M.poster;
  window.addEventListener('load', function () {
    var list = [M.anticipate, M.celebrate, M.lose].concat(M.idle).filter(Boolean);
    (function next(i) { if (i < list.length) loadMascot(list[i], function () { next(i + 1); }); })(0);
  });
} else {
  mascotEl.hidden = true;
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
  if (state === 'select') renderState();
}

// ---------- 操作台 ----------
var ACTION_TEXT = { select: 'action.choose', ready: 'action.open', loading: 'action.open', opening: 'action.open', reveal: 'action.open' };
var STATUS_TEXT = { select: 'status.select', ready: 'status.ready', loading: 'status.loading', opening: 'status.opening' };
var statusOverride = null;

function renderState() {
  stage.setAttribute('data-state', state);
  // 挑選階段沒有主按鈕：點選 3D 區的任意一包就是選擇，按鈕位置改顯示提示
  var picking = state === 'select';
  btnAction.hidden = picking;
  $('pickHint').hidden = !picking;
  var empty = !valid ? 'empty.prizes' : player.chances <= 0 ? 'toast.noChances' : null;
  $('pickHintText').textContent = t(empty || 'hint.pick');
  $('pickHint').classList.toggle('is-empty', !!empty);
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
  var prev = state;
  state = next;
  statusOverride = status || null;
  renderState();
  if (next === 'ready' && prev !== 'ready') setMascot('anticipate');
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

// 點選 3D 區的某一包＝選擇它：不在正前方就先轉過來，轉完再進入已選定
var pickTimer = null;
function pickItem(i) {
  if (state !== 'select' || pickTimer) return;
  if (!valid) { showToast(t('empty.prizes')); return; }
  if (player.chances <= 0) { showToast(t('toast.noChances')); return; }
  var turned = scene.goTo(i);
  pickTimer = setTimeout(function () {
    pickTimer = null;
    if (state === 'select') choose();
  }, turned ? 350 : 0);
}

function backToSelect() {
  if (state !== 'ready') return;
  Sound.play('move');
  if (scene) scene.setMode('select');
  setState('select');
  setMascot('idle');
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
  if (rewards.length) mascotReact(rewards);
  rewards = [];
  if (scene) scene.setMode('select');
  setState('select');
  sceneEl.focus();
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
  scale: cfg.sceneScale,
  shape: cfg.shape,
  mascot: cfg.mascot ? { img: $('mascot'), poster: cfg.mascot.poster, height: cfg.mascot.height } : null,
  onSelect: function () { Sound.play('move'); renderPickLabel(); },
  onSwipeOpen: open,
  onPick: pickItem
});
if (!scene) {
  // WebGL 不可用：顯示 2D 正面圖，流程照樣用按鈕完成
  sceneEl.classList.add('is-flat');
  $('sceneFallback').hidden = false;
  $('sceneFallback').setAttribute('data-img', cfg.type === 'blind-box' ? 'boxFront' : 'packFront');
  $('sceneNote').hidden = false;
  $('sceneFallback').addEventListener('click', function () { if (state === 'select') choose(); });
}

// ---------- 事件 ----------
btnAction.addEventListener('click', function () {
  if (state === 'select') choose();
  else if (state === 'ready') open();
});
sceneEl.addEventListener('keydown', function (e) {
  if (state !== 'select' || e.target !== sceneEl || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  choose();
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
  if (e.target.closest('button, a, input, select, textarea, label, [role="button"], #mockPanel, #scene')) { taps = []; return; }
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
    setMascot('idle');
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
