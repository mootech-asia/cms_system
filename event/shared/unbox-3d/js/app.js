/*
 * 拆卡包／拆盲盒共用流程：select（挑選）→ ready（已選定）→ loading（向後台取結果）→ opening（動畫）→ reveal（揭曉）。
 * 活動差異（type、圖片槽、文案、mock 內容）全部在各活動的 assets/js/config.js；本檔不放活動專屬內容。
 */
import { createAtmosphere } from './atmosphere.js?v=20261119-desert1';
import { createRevealVortex } from './reveal-vortex.js?v=20261118-vortex2';
import { createSecretCycle } from './secret-cycle.js?v=20261119-secretfix1';
import { createScene } from './scene.js?v=20261119-perf1';

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
createAtmosphere(stage, cfg.type, cfg.images.atmosphereSprite, cfg.images.starSprite, { mode:cfg.atmosphereMode, flowers:cfg.images.windFlowers, palm:cfg.images.windPalm, circle:cfg.images.magicCircle, depthLayers:cfg.type === 'blind-box' ? {desert:cfg.images.depthDesert, floor:cfg.images.depthFloor, columns:cfg.images.depthColumns, curtain:cfg.images.depthCurtain} : null });
var sceneEl = $('scene');
var btnAction = $('btnAction');
var reveal = $('reveal');
// Older embedded markup can survive a script/config refresh.
if (cfg.type === 'blind-box' && cfg.images.revealVortex && !$('revealVortex')) {
  var legacyRays = reveal.querySelector('.ev-reveal-rays');
  if (legacyRays) {
    var vortexCanvas = document.createElement('canvas');
    vortexCanvas.id = 'revealVortex'; vortexCanvas.className = 'ev-reveal-vortex';
    vortexCanvas.setAttribute('aria-hidden', 'true');
    vortexCanvas.style.cssText = 'position:absolute;width:min(116%,76svh);aspect-ratio:1;opacity:.62;pointer-events:none;mask-image:radial-gradient(circle,#000 0 59%,transparent 72%)';
    legacyRays.replaceWith(vortexCanvas);
  }
}
createRevealVortex($('revealVortex'), reveal, $('revealSingle'), stage, cfg.images.revealVortex);
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
var secretCycle = cfg.secretEvery ? createSecretCycle(cfg.storageKey + '_secret_cycle', cfg.secretEvery, null, Math.random, player.records.length) : null;
function notifySecret() {
  if (secretCycle && secretCycle.needsNotice() && Sound.isEnabled() && Sound.isUnlocked()) {
    Sound.play('secret'); secretCycle.notified();
  }
}
function syncSecret() {
  var active = !!(secretCycle && secretCycle.due());
  stage.dataset.secret = String(active);
  if (scene) scene.setSecret(active);
  if (cfg.secretEvery) {
    var notice = $('secretNotice'); notice.hidden = !active; notice.textContent = t('edition.discovered');
    if (!scene) { $('sceneFallback').src = active ? cfg.images.secretPack : pick(cfg.images.packFront); $('sceneFallback').setAttribute('data-img',active?'secretPack':'packFront'); }
  }
  notifySecret();
}
document.addEventListener('ev:audio-ready',notifySecret);
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
var mascotVisible = true;
var mascotReduced = matchMedia('(prefers-reduced-motion: reduce)');
function syncMascotMotion() {
  if (!M) return;
  var paused = mascotReduced.matches || document.hidden || !mascotVisible || state === 'reveal';
  var wanted = paused ? M.poster : mascotWant;
  if (wanted && (wanted === M.poster || mascotCache[wanted]?.ready)) {
    if (mascotEl.getAttribute('src') !== wanted) mascotEl.src = wanted;
  }
  mascotEl.dataset.motion = paused ? 'paused' : 'playing';
}
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
      syncMascotMotion();
      mascotEl.dataset.state = next;
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
  setMascot(list.some(function (r) { return !Store.isEmpty(r); }) ? 'celebrate' : 'lose');
  mascotAfter = setTimeout(function () { if (state === 'select') setMascot('idle'); }, Math.max(2, Math.ceil(3000 / (M.loopMs || 3000))) * (M.loopMs || 1500));
}
if (M) {
  mascotReduced.addEventListener('change', syncMascotMotion);
  document.addEventListener('visibilitychange', syncMascotMotion);
  new IntersectionObserver(function (entries) {
    mascotVisible = entries[0].isIntersecting;
    syncMascotMotion();
  }).observe($('spiritStage') || sceneEl);
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
    if (typeof w.prize === 'number' && Store.isEmpty(prizes[w.prize])) return '';
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
    var matchingPrize = content.prizes.find(function (p) { return pick(p.name) === pick(r.name); });
    var icon = r.icon || (matchingPrize && matchingPrize.icon);
    li.setAttribute('data-rarity', rarityOf(r));
    li.innerHTML = '<span class="ev-record-art" aria-hidden="true">' + (icon ? '<img src="' + esc(icon) + '" alt="" loading="lazy" />' : '<span>✦</span>') + '</span>' +
      '<span class="ev-record-detail"><span class="ev-record-name">' + esc(pick(r.name)) + '</span><time>' + esc(r.time) + '</time></span>' +
      '<span class="ev-rarity-tag" data-rarity="' + esc(rarityOf(r)) + '">' + esc(t(Store.isEmpty(r) ? 'result.emptyTag' : r.edition === 'secret' ? 'edition.secret' : 'rarity.' + rarityOf(r))) + '</span>';
    list.appendChild(li);
  });
}

function renderChances() {
  $('chances').textContent = player.chances;
  if (state === 'select') renderState();
}

// ---------- 操作台 ----------
var ACTION_TEXT = { select: 'action.choose', focusing: 'action.choose', ready: 'action.open', loading: 'action.open', opening: 'action.open', reveal: 'action.open' };
var STATUS_TEXT = { select: 'status.select', focusing: 'status.focusing', ready: 'status.ready', loading: 'status.loading', opening: 'status.opening' };
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
  btnAction.disabled = state === 'focusing' || state === 'loading' || state === 'opening';
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
  $('pickLabel').textContent = t('pick.label', { n: String(i + 1).padStart(2, '0') }) + (scene && cfg.carouselCount ? ' / ' + cfg.carouselCount : '');
}

function setState(next, status) {
  var prev = state;
  state = next;
  statusOverride = status || null;
  renderState();
  syncMascotMotion();
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
  btnAction.classList.add('is-pressing');
  setTimeout(function () { btnAction.classList.remove('is-pressing'); }, 140);
  try { if (typeof navigator.vibrate === 'function') navigator.vibrate(18); } catch (e) { /* 震動為選配 */ }
}

function choose(autoOpen) {
  if (!valid) { Sound.play('error'); showToast(t('empty.prizes')); return; }
  if (player.chances <= 0) { Sound.play('error'); showToast(t('toast.noChances')); return; }
  Sound.play('select');
  btnAction.classList.add('is-pressing');
  setTimeout(function () { btnAction.classList.remove('is-pressing'); }, 140);
  if (scene && cfg.type === 'card-pack') {
    setState('focusing');
    scene.focus().then(function () {
      if (state !== 'focusing') return;
      scene.setMode('ready'); setState('ready');
      if (autoOpen === true) open();
    });
  } else {
    if (scene) scene.setMode('ready');
    setState('ready');
    if (autoOpen === true) open();
    if (cfg.type === 'blind-box' && matchMedia('(max-width: 600px)').matches) {
      requestAnimationFrame(function () {
        var overflow = btnAction.getBoundingClientRect().bottom - innerHeight;
        if (overflow > 0) window.scrollTo({ top: scrollY + overflow + 16, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
    }
  }
}

function open(gesture) {
  if (state !== 'ready') return;
  if (player.chances <= 0) { showToast(t('toast.noChances')); return; }
  var duration = cfg.openMs;
  if (cfg.tearSpeed && gesture && Number.isFinite(gesture.speed)) {
    var speed = cfg.tearSpeed;
    var amount = Math.max(0, Math.min(1, (gesture.speed-speed.slowVelocity)/(speed.fastVelocity-speed.slowVelocity)));
    duration = Math.round(speed.slowMs + (speed.fastMs-speed.slowMs)*amount);
  }
  press();
  player.chances -= 1;
  savePlayer();
  renderChances();
  setState('loading');
  var selection = scene ? scene.selected() : 0;
  var secretDraw = !!(secretCycle && secretCycle.due());
  Store.resolve(content, { type: cfg.type, selection: selection, count: secretDraw ? 3 : perOpen, edition:secretDraw?'secret':'standard', drawNumber:secretCycle?secretCycle.total()+1:undefined }).then(function (list) {
    var edition = secretCycle ? secretCycle.commit() : {};
    rewards = list.map(function (r) { return Object.assign({},r,edition); });
    var stamp = now();
    rewards.forEach(function (r) { player.records.push({ type:r.type, edition:r.edition, drawNumber:r.drawNumber, name: r.name, icon: r.icon || '', rarity: rarityOf(r), time: stamp }); });
    savePlayer();
    renderRecords();
    setState('opening');
    Sound.duck(true);
    Sound.stopEffects();
    Sound.play('tear',duration);
    stage.classList.add('is-opening');
    var done = scene ? scene.open(duration) : new Promise(function (ok) { fallbackTimer = setTimeout(ok, 600); });
    return done.then(function () {
      stage.classList.remove('is-opening');
      showReveal();
    });
  }).catch(function () {
    Sound.play('error');
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
  if (!valid) { Sound.play('error'); showToast(t('empty.prizes')); return; }
  if (player.chances <= 0) { Sound.play('error'); showToast(t('toast.noChances')); return; }
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
  return '<span class="ev-prize-face ev-prize-front" data-outcome="' + (Store.isEmpty(r) ? 'empty' : 'prize') + '" data-rarity="' + rarity + '" data-edition="' + (r.edition || 'standard') + '">' +
    '<span class="ev-prize-frame" aria-hidden="true"></span>' +
    '<span class="ev-card-stars" aria-hidden="true">' + (Store.isEmpty(r) ? '' : '✦'.repeat(Store.rarityRank(r) + 1)) + '</span>' +
    (r.icon ? '<img class="ev-prize-icon" src="' + esc(r.icon) + '" alt="" />' : '') +
    (Store.isEmpty(r) ? '' : '<span class="ev-rarity-tag" data-rarity="' + rarity + '">' + esc(t(r.edition === 'secret' ? 'edition.secret' : 'rarity.' + rarity)) + '</span>') +
    '<span class="ev-prize-name' + (small ? ' is-small' : '') + '">' + esc(pick(r.name)) + '</span></span>';
}

function treasureHtml(r) {
  var rarity = rarityOf(r);
  return '<span class="ev-treasure-plinth" aria-hidden="true"></span>' +
    '<span class="ev-treasure-object">' + (r.icon ? '<img src="' + esc(r.icon) + '" alt="" />' : Store.isEmpty(r) ? '' : '<span class="ev-treasure-gem" aria-hidden="true">◆</span>') + '</span>' +
    '<span class="ev-treasure-caption">' + (Store.isEmpty(r) ? '' : '<span class="ev-rarity-tag" data-rarity="' + rarity + '">' + esc(t('rarity.' + rarity)) + '</span>') +
    '<strong>' + esc(pick(r.name)) + '</strong></span>';
}

var treasureMode = cfg.type === 'blind-box';
var revealView = 'card';
var treasureCuePlayed = false;
var secretFanMode = false;
var secretFanRevealed = 0;
var secretFanBusy = false;
var secretFanTimer = null;

function renderSecretFanText() {
  $('revealTitle').textContent = t('reveal.title');
  $('revealCount').textContent = t('reveal.count', { n:secretFanRevealed, total:3 });
  $('revealActionText').textContent = t(secretFanRevealed === 3 ? 'reveal.done' : 'reveal.flip');
  $('btnRevealAll').hidden = true;
  $('btnReveal').disabled = secretFanBusy;
  Array.from($('secretFan').children).forEach(function (card, i) {
    card.setAttribute('aria-label', i < secretFanRevealed ? pick(rewards[i].name) : t('reveal.flip'));
    card.disabled = secretFanBusy || i > secretFanRevealed;
  });
}

function showSecretFan() {
  var fan = $('secretFan');
  fan.innerHTML = rewards.map(function (r, i) {
    return '<button type="button" class="ev-prize-card" data-edition="secret" data-rarity="' + rarityOf(r) + '" data-fan-index="' + i + '"><span class="ev-prize-face ev-prize-back" aria-hidden="true"></span>' + cardHtml(r) + '</button>';
  }).join('');
  fan.hidden = false;
  $('revealCard').hidden = true;
  $('treasureDisplay').hidden = true;
  $('revealSingle').hidden = false;
  $('revealGrid').hidden = true;
  secretFanRevealed = 0;
  secretFanBusy = true;
  clearTimeout(secretFanTimer);
  renderSecretFanText();
  secretFanTimer = setTimeout(function () { secretFanBusy = false; renderSecretFanText(); }, mascotReduced.matches ? 0 : 480);
}

function flipSecretFan() {
  if (secretFanBusy || secretFanRevealed >= 3) return;
  var cards = Array.from($('secretFan').children);
  cards.forEach(function (card) { card.classList.remove('is-presenting'); });
  var r = rewards[secretFanRevealed], card = cards[secretFanRevealed];
  card.classList.add('is-presenting', 'is-flipped');
  $('revealGlow').setAttribute('data-rarity', rarityOf(r));
  secretFanRevealed += 1;
  secretFanBusy = true;
  Sound.play('flip');
  renderSecretFanText();
  secretFanTimer = setTimeout(function () {
    if (reveal.hidden || !secretFanMode) return;
    Sound.play('reveal', Store.rarityRank(r));
    secretFanTimer = setTimeout(function () {
      if (secretFanRevealed === 3) cards.forEach(function (item) { item.classList.remove('is-presenting'); });
      secretFanBusy = false; renderSecretFanText();
    }, mascotReduced.matches ? 0 : secretFanRevealed === 3 ? 900 : 420);
  }, mascotReduced.matches ? 0 : 180);
}

if ($('secretFan')) $('secretFan').addEventListener('click', function (event) {
  var card = event.target.closest('[data-fan-index]');
  if (!card || secretFanBusy) return;
  var i = Number(card.dataset.fanIndex);
  if (i === secretFanRevealed) flipSecretFan();
  else if (i < secretFanRevealed) {
    Array.from($('secretFan').children).forEach(function (other) { other.classList.toggle('is-presenting', other === card); });
  }
});
function showReveal() {
  treasureCuePlayed = false;
  setState('reveal');
  revealed = 0;
  revealView = 'card';
  reveal.hidden = false;
  secretFanMode = cfg.type === 'card-pack' && rewards.length === 3 && rewards.every(function (r) { return r.edition === 'secret'; });
  if ($('secretFan')) $('secretFan').hidden = !secretFanMode;
  if (secretFanMode) { showSecretFan(); $('btnReveal').focus(); return; }
  $('btnReveal').disabled = false;
  renderRevealCard();
  (treasureMode ? $('btnReveal') : $('revealCard')).focus();
}

function renderRevealCard() {
  var r = rewards[revealed];
  var card = $('revealCard');
  card.hidden = treasureMode;
  $('treasureDisplay').hidden = !treasureMode;
  if (treasureMode) {
    $('treasureDisplay').innerHTML = treasureHtml(r);
    $('treasureDisplay').setAttribute('aria-label', pick(r.name));
    $('treasureDisplay').setAttribute('data-rarity', rarityOf(r));
    $('revealGlow').setAttribute('data-rarity', rarityOf(r));
    if (!treasureCuePlayed) {
      Sound.stopEffects();
      Sound.play(Store.isEmpty(r) ? 'empty' : 'reveal', Store.rarityRank(r));
      treasureCuePlayed = true;
    }
    renderRevealText();
    return;
  }
  card.classList.remove('is-flipped');
  card.setAttribute('data-rarity', rarityOf(r));
  card.setAttribute('data-edition',r.edition || 'standard');
  $('revealGlow').setAttribute('data-rarity', 'common');
  card.innerHTML = '<span class="ev-prize-face ev-prize-back" aria-hidden="true"></span>' + cardHtml(r);
  card.classList.remove('is-enter');
  void card.offsetWidth;
  card.classList.add('is-enter');
  renderRevealText();
}

function flipped() { return treasureMode || $('revealCard').classList.contains('is-flipped'); }

function renderRevealText() {
  if (secretFanMode) { renderSecretFanText(); return; }
  var total = rewards.length;
  var summary = revealView === 'summary';
  $('revealTitle').textContent = !summary && flipped() && Store.isEmpty(rewards[revealed]) ? t('result.empty') : summary ? t('reveal.summary') : t('reveal.title');
  $('revealSingle').hidden = summary;
  $('revealGrid').hidden = !summary;
  var shown = revealed + (flipped() ? 1 : 0);
  $('revealCount').textContent = summary ? '' : treasureMode && !Store.isEmpty(rewards[revealed]) ? t('treasure.count', { n: shown, total: total }) : flipped() ? t('reveal.count', { n: shown, total: total }) : t('reveal.tap');
  $('revealCard').setAttribute('aria-label', flipped() ? pick(rewards[revealed].name) : t('reveal.flip'));
  var last = revealed === total - 1;
  var key = summary || (flipped() && last && total === 1) ? 'reveal.done'
    : !flipped() ? 'reveal.flip'
    : last ? 'reveal.seeAll' : 'reveal.next';
  $('revealActionText').textContent = t(key === 'reveal.done' && rewards.every(Store.isEmpty) ? 'result.continue' : key);
  $('btnRevealAll').hidden = summary || total < 2 || (last && flipped());
}

function flip() {
  if (revealView !== 'card' || flipped()) return;
  var r = rewards[revealed];
  $('revealCard').classList.add('is-flipped');
  $('revealGlow').setAttribute('data-rarity', rarityOf(r));
  Sound.play('flip');
  setTimeout(function () { Sound.play(Store.isEmpty(r) ? 'empty' : 'reveal', Store.rarityRank(r)); }, 180);
  renderRevealText();
}

function showSummary() {
  revealView = 'summary';
  $('revealGrid').innerHTML = rewards.map(function (r) { return '<li class="' + (treasureMode ? 'ev-treasure is-small' : 'ev-prize-card is-static') + '">' + (treasureMode ? treasureHtml(r) : cardHtml(r, true)) + '</li>'; }).join('');
  if (!treasureMode) Sound.play(rewards.every(Store.isEmpty) ? 'empty' : 'reward');
  renderRevealText();
}

function revealStep() {
  if (secretFanMode) {
    if (secretFanBusy) return;
    if (secretFanRevealed < 3) flipSecretFan(); else closeReveal();
    return;
  }
  if (revealView === 'summary') { closeReveal(); return; }
  if (!flipped()) { flip(); return; }
  if (revealed < rewards.length - 1) { revealed += 1; renderRevealCard(); return; }
  if (rewards.length > 1) showSummary();
  else closeReveal();
}

function closeReveal() {
  clearTimeout(secretFanTimer);
  secretFanMode = false; secretFanBusy = false;
  $('btnReveal').disabled = false;
  if ($('secretFan')) $('secretFan').hidden = true;
  reveal.hidden = true;
  if (!treasureMode) Sound.play(rewards.every(Store.isEmpty) ? 'click' : 'collect');
  Sound.duck(false);
  var emptyResult = rewards.length && rewards.every(Store.isEmpty);
  if (rewards.length) mascotReact(rewards);
  rewards = [];
  if (scene) scene.setMode('select');
  setState('select');
  syncSecret();
  sceneEl.focus();
  if (treasureMode && emptyResult) sceneEl.scrollIntoView({ block: 'center', behavior: 'instant' });
}

// ---------- 音效／語系 ----------
function renderSound() {
  var on = Sound.isEnabled();
  $('btnSound').setAttribute('aria-pressed', String(on));
  $('btnSound').setAttribute('aria-label', t(on ? 'sound.off' : 'sound.on'));
  $('soundIcon').src = on ? cfg.images.soundOn : cfg.images.soundOff;
  notifySecret();
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
  if (state === 'select' || state === 'ready') syncSecret();
  if (!reveal.hidden) {
    if (secretFanMode) {
      Array.from($('secretFan').children).forEach(function (card, i) { card.querySelector('.ev-prize-front').outerHTML = cardHtml(rewards[i]); });
      renderSecretFanText(); return;
    }
    if (revealView === 'summary') showSummary();
    else {
      var r = rewards[revealed];
      if (treasureMode) { $('treasureDisplay').innerHTML = treasureHtml(r); $('treasureDisplay').setAttribute('aria-label', pick(r.name)); }
      else $('revealCard').querySelector('.ev-prize-front').outerHTML = cardHtml(r);
      renderRevealText();
    }
  }
}

// ---------- 3D ----------
var scene = null;
var imagesFor = cfg.type === 'blind-box'
  ? { front: cfg.images.boxFront, side: cfg.images.boxSide, lid: cfg.images.boxLid, lidSide: cfg.images.boxLidSide, interior: cfg.images.boxInterior }
  : { front: cfg.images.packFront, back: cfg.images.packBack, side: cfg.images.packSide, crimp: cfg.images.packCrimp, rewardBack: cfg.images.packContents || cfg.images.rewardBack };
scene = createScene(sceneEl, {
  type: cfg.type,
  count: cfg.carouselCount,
  images: imagesFor,
  material: cfg.material,
  scale: cfg.sceneScale,
  carouselCameraY: cfg.carouselCameraY,
  shape: cfg.shape,
  sceneArt: cfg.sceneArt,
  secretImages: cfg.secretEvery ? {front:cfg.images.secretPack,side:cfg.images.secretSide,back:cfg.images.secretBack} : null,
  mascot: cfg.mascot && cfg.mascot.layout !== 'hero' ? { img: $('mascot'), poster: cfg.mascot.poster, height: cfg.mascot.height, offsetX: cfg.mascot.offsetX, offsetZ: cfg.mascot.offsetZ } : null,
  onSelect: function () { if (cfg.type !== 'blind-box') Sound.play('move'); renderPickLabel(); },
  onSwipeOpen: open,
  onHover: function () { if (Sound.hover) Sound.hover(); },
  onPick: pickItem
});
if (!scene) {
  // WebGL 不可用：顯示 2D 正面圖，流程照樣用按鈕完成
  sceneEl.classList.add('is-flat');
  $('sceneFallback').hidden = false;
  $('sceneFallback').setAttribute('data-img', cfg.type === 'blind-box' ? 'boxFront' : 'packFront');
  $('sceneNote').hidden = false;
  $('sceneFallback').addEventListener('pointerenter', function (e) { if (cfg.type === 'card-pack' && state === 'select' && e.pointerType === 'mouse') Sound.hover(); });
  $('sceneFallback').addEventListener('click', function () { if (state === 'select') choose(); });
  var fallbackStart = null;
  $('sceneFallback').addEventListener('pointerdown', function (event) {
    if (state !== 'ready') return;
    fallbackStart = { x:event.clientX, y:event.clientY, time:performance.now() };
    event.currentTarget.setPointerCapture(event.pointerId);
  });
  $('sceneFallback').addEventListener('pointerup', function (event) {
    if (!fallbackStart) return;
    var dx = event.clientX - fallbackStart.x, dy = event.clientY - fallbackStart.y;
    var speed = Math.abs(dx) / Math.max(16, performance.now()-fallbackStart.time);
    fallbackStart = null;
    if (state === 'ready' && (cfg.type === 'blind-box' ? dy < -55 && Math.abs(dy) > Math.abs(dx) : Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)*1.2)) open({speed:speed});
  });
  $('sceneFallback').addEventListener('pointercancel', function () { fallbackStart = null; });
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
  syncSecret();
  showToast(t('toast.reset', { n: player.chances }));
});
if ($('btnSecret')) $('btnSecret').addEventListener('click', function () {
  if (!secretCycle || (state !== 'select' && state !== 'ready')) return;
  if (!valid) { showToast(t('empty.prizes')); return; }
  secretCycle.forceNext();
  player.chances = Math.max(1, player.chances);
  savePlayer(); renderChances(); syncSecret(); setPanel(false);
  sceneEl.scrollIntoView({ block: 'center', behavior: 'instant' });
  if (state === 'select') choose(true); else open();
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
    $('loadingProgress').setAttribute('aria-valuenow', pct);
  }
  function step() { done += 1; render(); if (done >= total) finish(); }
  function finish() {
    if (finished) return;
    finished = true;
    overlay.hidden = true;
    setMascot('idle');
    // Warm reveal artwork only after the interactive stage is ready.
    var warm = function () {
      ['rewardBack', 'rewardFrameCommon', 'statusBadges'].forEach(function (key) {
        var src = pick(cfg.images[key]);
        if (typeof src === 'string') { var img = new Image(); img.decoding = 'async'; img.fetchPriority = 'low'; img.src = src; }
      });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 1500 });
    else setTimeout(warm, 300);
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
