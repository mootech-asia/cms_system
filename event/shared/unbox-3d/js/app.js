/*
 * 拆卡包／拆盲盒共用流程：select（挑選）→ ready（已選定）→ loading（向後台取結果）→ opening（動畫）→ reveal（揭曉）。
 * 活動差異（type、圖片槽、文案、mock 內容）全部在各活動的 assets/js/config.js；本檔不放活動專屬內容。
 */
import { createAtmosphere } from './atmosphere.js?v=20261119-desert1';
import { createRevealVortex } from './reveal-vortex.js?v=20261119-hd-motion';
import { createSecretCycle } from './secret-cycle.js?v=20261119-fixed100';
import { createScene } from './scene.js?v=20261119-inertia';

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
var inventoryLimit = 20;
var batchLimit = 10;
var isBox = cfg.type === 'blind-box';

function clampInventory(value) {
  var count = Number(value);
  return Number.isFinite(count) ? Math.max(0, Math.min(inventoryLimit, Math.trunc(count))) : 0;
}

function initialInventory() {
  var limit = content.freeOpens ?? inventoryLimit;
  var supplied = (isBox ? content.boxCount : content.packCount) ?? limit;
  return Math.min(clampInventory(supplied), clampInventory(limit));
}

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
var perOpen = Math.trunc(Number(content.perOpen)) || 1;
perOpen = Math.max(cfg.perOpenLimits.min, Math.min(cfg.perOpenLimits.max, perOpen));
var batchResults = null;
var summaryPage = 0;
var resultPageSize = 10;
var pendingAnimation = null;
var openingCount = 0;

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ---------- 玩家狀態（mock；正式由後台回傳次數與紀錄） ----------
var player = loadPlayer();
var recordPager = window.createRecordPager($('recordList'), t, renderRecords);
var recordedDraws = player.records.reduce(function (total, record) {
  var drawNumber = Number(record.drawNumber);
  return Number.isSafeInteger(drawNumber) && drawNumber >= 0 ? Math.max(total, drawNumber) : total;
}, 0);
var secretCycle = cfg.secretEvery ? createSecretCycle(cfg.storageKey + '_secret_cycle', cfg.secretEvery, null, Math.random, recordedDraws || player.records.length, !!cfg.secretFixed) : null;
function notifySecret() {
  if (player.chances && secretCycle && secretCycle.needsNotice() && Sound.isEnabled() && Sound.isUnlocked()) {
    Sound.play('secret'); secretCycle.notified();
  }
}
function syncSecret() {
  var active = !!(player.chances && secretCycle && secretCycle.due());
  stage.dataset.secret = String(active);
  if (scene) scene.setSecret(active);
  if (cfg.secretEvery) {
    var notice = $('secretNotice'); notice.hidden = !active; notice.textContent = t('edition.discovered');
    if (!scene) { $('sceneFallback').src = active ? cfg.images.secretPack : cfg.images.packFront[(player.slots[0] || 0) % cfg.images.packFront.length]; $('sceneFallback').setAttribute('data-img',active?'secretPack':'packFront'); }
  }
  notifySecret();
}
document.addEventListener('ev:audio-ready',notifySecret);
function resetInventory(target, count) {
  target.slots = Array.from({length: clampInventory(count)}, function (_, i) { return i; });
  target.chances = target.slots.length;
  target.wave = Math.min(batchLimit, target.chances);
}
function loadPlayer() {
  try {
    var saved = JSON.parse(localStorage.getItem(PLAYER_KEY));
    if (saved && saved.version === content.updatedAt && Array.isArray(saved.records)) {
      if (!Array.isArray(saved.slots)) resetInventory(saved, saved.chances);
      else {
        saved.slots = Array.from(new Set(saved.slots.filter(function (id) {
          return Number.isInteger(id) && id >= 0 && id < inventoryLimit;
        })));
        saved.chances = saved.slots.length;
        saved.wave = Math.min(batchLimit, saved.chances, Math.trunc(saved.wave) > 0 ? Math.trunc(saved.wave) : batchLimit);
      }
      return saved;
    }
  } catch (e) { /* localStorage 不可用時退回記憶體狀態 */ }
  return freshPlayer();
}
function freshPlayer() {
  var fresh = { version: content.updatedAt, records: [] };
  resetInventory(fresh, initialInventory());
  return fresh;
}
function visibleSlots() {
  return isBox ? player.slots.slice(0, player.wave) : player.slots.slice();
}
function refreshInventory() {
  var slots = visibleSlots();
  if (scene) scene.setItems(slots);
  $('panelPerOpen').textContent = player.chances;
  $('panelLess').disabled = player.chances <= 1;
  $('panelMore').disabled = player.chances >= inventoryLimit;
  if (!scene) {
    $('sceneFallback').hidden = !slots.length;
    if (!isBox && slots.length && !(secretCycle && secretCycle.due())) {
      $('sceneFallback').src = cfg.images.packFront[slots[0] % cfg.images.packFront.length];
    }
  }
  renderChances();
}
function consumeSlot(id, retry) {
  player.slots.splice(player.slots.indexOf(id), 1);
  if (retry) player.slots.push(id);
  player.chances = player.slots.length;
  if (isBox) {
    player.wave -= 1;
    if (player.wave === 0) player.wave = Math.min(batchLimit, player.chances);
  }
}
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
  if (!M.motion && wanted && (wanted === M.poster || mascotCache[wanted]?.ready)) {
    if (mascotEl.getAttribute('src') !== wanted) mascotEl.src = wanted;
  }
  var motion = paused ? 'paused' : 'playing';
  if (mascotEl.dataset.motion !== motion) mascotEl.dataset.motion = motion;
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
  var src = M.motion ? M.poster : next === 'idle' ? M.idle[0] : (M[next] || M.idle[0]);
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
    if (!mascotShownAt || !loop || (M.motion && next !== 'idle')) { swap(); return; }
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
  if (M.motion) {
    import(new URL(M.motion, document.baseURI)).then(function (module) {
      return module.mountSpiritMotion(mascotEl);
    }).catch(function () { /* The lossless poster remains visible without WebGL. */ });
  }
  window.addEventListener('load', function () {
    if (M.motion) return;
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
  recordPager.slice(player.records.slice().reverse()).forEach(function (r) {
    var li = document.createElement('li');
    li.className = 'ev-record';
    var matchingPrize = content.prizes.find(function (p) { return pick(p.name) === pick(r.name); });
    var icon = r.icon || (matchingPrize && matchingPrize.icon);
    li.setAttribute('data-rarity', rarityOf(r));
    li.innerHTML = '<span class="ev-record-art" aria-hidden="true">' + (icon ? '<img src="' + esc(icon) + '" alt="" loading="lazy" />' : '<span>✦</span>') + '</span>' +
      '<span class="ev-record-detail"><span class="ev-record-name">' + esc(pick(r.name)) + '</span><time>' + esc(r.time) + '</time></span>' +
      (r.retry ? '' : '<span class="ev-rarity-tag" data-rarity="' + esc(rarityOf(r)) + '">' + esc(t(Store.isEmpty(r) ? 'result.emptyTag' : r.edition === 'secret' ? 'edition.secret' : 'rarity.' + rarityOf(r))) + '</span>');
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
var pickHintTimer = null;

function renderPickHint(show, persistent) {
  var hint = $('pickHint');
  if (!show || persistent) {
    clearInterval(pickHintTimer);
    pickHintTimer = null;
    hint.hidden = !show;
    hint.classList.remove('is-faded');
    hint.removeAttribute('aria-hidden');
  } else if (pickHintTimer === null) {
    hint.hidden = false;
    pickHintTimer = setInterval(function () {
      var faded = hint.classList.toggle('is-faded');
      hint.setAttribute('aria-hidden', String(faded));
    }, 10000);
  }
}

function renderState() {
  stage.setAttribute('data-state', state);
  var picking = state === 'select';
  var visibleCount = visibleSlots().length;
  var quantity = Math.min(batchLimit, visibleCount);
  btnAction.hidden = false;
  var empty = !valid ? 'empty.prizes' : player.chances <= 0 ? 'toast.noChances' : null;
  renderPickHint(picking, !!empty);
  $('pickHintText').textContent = t(empty || 'hint.pick');
  $('pickHint').classList.toggle('is-empty', !!empty);
  var action = ACTION_TEXT[state];
  if (picking) {
    if (empty) action = empty;
    else if (quantity === player.chances) action = 'batch.openAll';
    else action = quantity === batchLimit ? 'batch.openCount' : 'batch.openWave';
  } else if (openingCount && (state === 'loading' || state === 'opening')) action = 'batch.opening';
  $('actionText').textContent = t(action, { n: openingCount && !picking ? openingCount : quantity });
  btnAction.disabled = (picking && !!empty) || state === 'focusing' || state === 'loading' || state === 'opening';
  btnAction.classList.toggle('is-empty', state === 'select' && (player.chances <= 0 || !valid));
  $('btnBack').hidden = state !== 'ready';
  $('btnSkip').hidden = state !== 'opening';
  $('btnPrev').hidden = $('btnNext').hidden = state !== 'select' || !scene || visibleCount < 2;
  var key = statusOverride || (picking && visibleCount < 2 ? null : STATUS_TEXT[state]);
  $('status').textContent = !valid ? t('empty.prizes') : key ? t(key) : '';
  renderPickLabel();
}

function renderPickLabel() {
  var i = scene ? scene.selected() : 0;
  var slots = visibleSlots();
  $('pickLabel').textContent = slots.length
    ? t('pick.label', { n: String(i + 1).padStart(2, '0') }) + ' / ' + slots.length
    : '';
  $('pickLabel').hidden = !slots.length || stage.classList.contains('is-batch-opening');
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
  var selected = visibleSlots()[scene ? scene.selected() : 0];
  if (selected == null) return;
  var duration = cfg.openMs;
  if (cfg.tearSpeed && gesture && Number.isFinite(gesture.speed)) {
    var speed = cfg.tearSpeed;
    var amount = Math.max(0, Math.min(1, (gesture.speed-speed.slowVelocity)/(speed.fastVelocity-speed.slowVelocity)));
    duration = Math.round(speed.slowMs + (speed.fastMs-speed.slowMs)*amount);
  }
  openSlots([selected], duration, false);
}

function openBatch() {
  if (state !== 'select' || pickTimer || !valid) return;
  var slots = visibleSlots();
  var index = scene ? scene.selected() : 0;
  var batch = slots.slice(index).concat(slots.slice(0, index)).slice(0, batchLimit);
  if (batch.length) openSlots(batch, 900, true);
}

async function openSlots(slots, duration, batch) {
  press();
  openingCount = batch ? slots.length : 0;
  setState('loading');
  summaryPage = 0;
  var opened = [];
  var failed = false;
  var audioReady = Sound.prepare('tear');
  // Each item is a separate draw. Commit successful draws before asking for the next one.
  for (var id of slots) {
    var secret = !!(secretCycle && secretCycle.due());
    var list;
    try {
      list = await Store.resolve(content, {
        type: cfg.type, selection: id, count: secret ? 3 : perOpen,
        edition: secret ? 'secret' : 'standard',
        drawNumber: secretCycle ? secretCycle.total() + 1 : undefined
      }, batch ? 0 : undefined);
    } catch (e) {
      failed = true;
      break;
    }
    var edition = secretCycle ? secretCycle.commit() : {};
    var drawRewards = list.map(function (item) { return Object.assign({}, item, edition); });
    var retries = cfg.retryEmpty ? drawRewards.filter(Store.isEmpty) : [];
    retries.forEach(function (item) { item.name = cfg.retryEmpty; item.retry = true; });
    consumeSlot(id, !!retries.length);
    var stamp = now();
    drawRewards.forEach(function (r) {
      player.records.push({type:r.type, retry:r.retry, edition:r.edition, drawNumber:r.drawNumber, name:r.name, icon:r.icon || '', rarity:rarityOf(r), time:stamp});
    });
    opened.push({ id:id, secret:secret, rewards:drawRewards });
    savePlayer();
  }
  if (!opened.length) {
    Sound.play('error');
    openingCount = 0;
    setState(batch ? 'select' : 'ready', 'status.error');
    return;
  }
  await audioReady;
  rewards = opened.flatMap(function (draw) { return draw.rewards; });
  batchResults = batch && (opened.length > 1 || failed) ? {
    rewards: rewards,
    secretGroups: opened.filter(function (draw) { return draw.secret; }).map(function (draw) { return draw.rewards; }),
    failed: failed,
    opened: opened.length
  } : null;
  renderChances();
  renderRecords();
  if (batch) {
    openingCount = opened.length;
    stage.classList.add('is-batch-opening');
    sceneEl.scrollIntoView({block:'center', behavior:'instant'});
  }
  setState('opening');
  Sound.duck('opening');
  Sound.stopEffects();
  Sound.play('tear', duration);
  stage.classList.add('is-opening');
  if (scene) {
    var deadline = batch ? setTimeout(function () { scene.skip(); }, duration + 1400) : null;
    await (batch ? scene.openBatch(opened, duration) : scene.open(duration));
    clearTimeout(deadline);
  } else await showFlatOpening(opened, batch, duration);
  openingCount = 0;
  stage.classList.remove('is-opening', 'is-batch-opening');
  showReveal();
}

function showFlatOpening(opened, batch, duration) {
  var display = $('batchFallback');
  if (batch) {
    display.replaceChildren();
    opened.forEach(function (draw, i) {
      var img = document.createElement('img');
      var fronts = isBox ? cfg.images.boxFront : cfg.images.packFront;
      img.src = draw.secret ? cfg.images.secretPack : fronts[draw.id % fronts.length];
      img.alt = '';
      img.style.setProperty('--batch-delay', Math.min(i, 9) * 45 + 'ms');
      display.appendChild(img);
    });
    display.hidden = false;
  }
  return new Promise(function (finish) {
    var timer = setTimeout(end, mascotReduced.matches ? 250 : batch ? duration : 600);
    function end() {
      clearTimeout(timer);
      pendingAnimation = null;
      display.hidden = true;
      finish();
    }
    pendingAnimation = end;
  });
}
function skip() {
  if (state !== 'opening') return;
  if (scene) scene.skip();
  else if (pendingAnimation) pendingAnimation();
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
  $('btnPrevPage').hidden = true;
  $('revealTitle').textContent = t('reveal.title');
  $('revealCount').textContent = t('reveal.count', { n:secretFanRevealed, total:3 });
  $('revealActionText').textContent = t(secretFanRevealed === 3 ? batchResults ? 'batch.results' : 'reveal.done' : 'reveal.flip');
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
  if (cfg.type === 'card-pack') {
    Sound.stopEffects();
    Sound.duck(true);
  }
  treasureCuePlayed = false;
  setState('reveal');
  revealed = 0;
  revealView = 'card';
  reveal.hidden = false;
  if (batchResults) {
    advanceBatchResult();
    reveal.scrollTop = 0;
    return;
  }
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
  $('revealTitle').textContent = !summary && flipped() && Store.isEmpty(rewards[revealed]) ? t(cfg.retryEmpty ? 'result.extraChance' : 'result.empty') : summary ? t('reveal.summary') : t('reveal.title');
  $('revealSingle').hidden = summary;
  $('revealGrid').hidden = !summary;
  var shown = revealed + (flipped() ? 1 : 0);
  var pages = Math.ceil(total / resultPageSize);
  var summaryInfo = [];
  if (pages > 1) summaryInfo.push(t('batch.page', { n:summaryPage + 1, total:pages }));
  if (batchResults?.failed) summaryInfo.push(t('batch.partial', { n:batchResults.opened }));
  $('revealCount').textContent = summary ? summaryInfo.join(' · ') : treasureMode && !Store.isEmpty(rewards[revealed]) ? t('treasure.count', { n: shown, total: total }) : flipped() ? t('reveal.count', { n: shown, total: total }) : t('reveal.tap');
  $('revealCard').setAttribute('aria-label', flipped() ? pick(rewards[revealed].name) : t('reveal.flip'));
  var last = revealed === total - 1;
  var key = summary || (flipped() && last && total === 1) ? 'reveal.done'
    : !flipped() ? 'reveal.flip'
    : last ? 'reveal.seeAll' : 'reveal.next';
  if (summary && (summaryPage + 1) * resultPageSize < total) key = 'batch.nextPage';
  $('btnPrevPage').hidden = !summary || summaryPage === 0;
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

function showSummary(playCue) {
  revealView = 'summary';
  var start = summaryPage * resultPageSize;
  $('revealGrid').classList.toggle('is-batch-grid', rewards.length >= 5);
  $('revealGrid').innerHTML = rewards.slice(start, start + resultPageSize).map(function (r) { return '<li class="' + (treasureMode ? 'ev-treasure is-small' : 'ev-prize-card is-static') + '">' + (treasureMode ? treasureHtml(r) : cardHtml(r, true)) + '</li>'; }).join('');
  if (playCue !== false) {
    if (batchResults) {
      var best = rewards.reduce(function (a, b) { return Store.rarityRank(a) >= Store.rarityRank(b) ? a : b; });
      Sound.stopEffects();
      Sound.play(rewards.every(Store.isEmpty) ? 'empty' : 'reveal', Store.rarityRank(best));
    } else if (!treasureMode) Sound.play(rewards.every(Store.isEmpty) ? 'empty' : 'reward');
  }
  renderRevealText();
}

function advanceBatchResult() {
  var group = batchResults.secretGroups.shift();
  if (group) {
    rewards = group;
    secretFanMode = true;
    Sound.play('secret');
    showSecretFan();
  } else {
    secretFanMode = false;
    if ($('secretFan')) $('secretFan').hidden = true;
    rewards = batchResults.rewards;
    showSummary();
  }
  $('btnReveal').focus();
}

function revealStep() {
  if (secretFanMode) {
    if (secretFanBusy) return;
    if (secretFanRevealed < 3) flipSecretFan();
    else if (batchResults) advanceBatchResult();
    else closeReveal();
    return;
  }
  if (revealView === 'summary') {
    if ((summaryPage + 1) * resultPageSize < rewards.length) {
      summaryPage += 1;
      showSummary(false);
      reveal.scrollTop = 0;
    } else closeReveal();
    return;
  }
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
  var result = batchResults ? batchResults.rewards : rewards;
  batchResults = null;
  rewards = [];
  if (scene) scene.setMode('select');
  setState('select');
  refreshInventory();
  syncSecret();
  sceneEl.focus({ preventScroll: treasureMode });
  if (treasureMode) {
    var sceneTop = sceneEl.getBoundingClientRect().top;
    if (sceneTop < 24 || sceneTop > innerHeight * 0.45) {
      window.scrollTo({ top: scrollY + sceneTop - 24, behavior: 'instant' });
    }
  }
  if (result.length) mascotReact(result);
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
    if (revealView === 'summary') showSummary(false);
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
  slots: visibleSlots(),
  capacity: inventoryLimit,
  images: imagesFor,
  material: cfg.material,
  scale: cfg.sceneScale,
  carouselCameraY: cfg.carouselCameraY,
  shape: cfg.shape,
  sceneArt: cfg.sceneArt,
  secretImages: cfg.secretEvery ? {front:cfg.images.secretPack,side:cfg.images.secretSide,back:cfg.images.secretBack} : null,
  mascot: cfg.mascot && cfg.mascot.layout !== 'hero' ? { img: $('mascot'), poster: cfg.mascot.poster, height: cfg.mascot.height, offsetX: cfg.mascot.offsetX, offsetZ: cfg.mascot.offsetZ } : null,
  onSelect: function () { Sound.play('move'); renderPickLabel(); },
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
  $('sceneFallback').addEventListener('pointerenter', function (e) { if (state === 'select' && e.pointerType === 'mouse') Sound.hover(); });
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
  if (state === 'select') openBatch();
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
$('btnPrevPage').addEventListener('click', function () {
  if (revealView !== 'summary' || summaryPage === 0) return;
  summaryPage -= 1;
  showSummary(false);
  reveal.scrollTop = 0;
  if (!$('btnPrevPage').hidden) $('btnPrevPage').focus();
  else $('btnReveal').focus();
});
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
  resetInventory(player, cfg.mockResetOpens);
  if (scene) scene.setMode('select');
  setState('select');
  savePlayer();
  refreshInventory();
  renderRecords();
  renderState();
  syncSecret();
  showToast(t('toast.reset', { n: player.chances }));
});
if ($('btnSecret')) $('btnSecret').addEventListener('click', function () {
  if (!secretCycle || (state !== 'select' && state !== 'ready')) return;
  if (!valid) { showToast(t('empty.prizes')); return; }
  secretCycle.forceNext();
  if (!player.chances) resetInventory(player, 1);
  savePlayer(); refreshInventory(); syncSecret(); setPanel(false);
  sceneEl.scrollIntoView({ block: 'center', behavior: 'instant' });
  if (state === 'select') choose(true); else open();
});
function changeInventory(delta) {
  if (state !== 'select' || pickTimer) return;
  var before = player.chances;
  if ((delta > 0 && before >= inventoryLimit) || (delta < 0 && before <= 1)) return;
  if (delta > 0) {
    var free = Array.from({length:inventoryLimit}, function (_, i) { return i; })
      .find(function (id) { return !player.slots.includes(id); });
    player.slots.push(free);
    if (isBox && player.wave === before && before < batchLimit) player.wave += 1;
  } else {
    player.slots.pop();
    if (isBox) player.wave = Math.min(player.wave, player.slots.length);
  }
  player.chances = player.slots.length;
  savePlayer();
  refreshInventory();
  syncSecret();
  Sound.play('count');
}
$('panelLess').addEventListener('click', function () { changeInventory(-1); });
$('panelMore').addEventListener('click', function () { changeInventory(1); });
document.addEventListener('keydown', function (event) {
  if (!event.ctrlKey || !event.altKey || event.metaKey || event.shiftKey) return;
  if (event.code !== 'ArrowUp' && event.code !== 'ArrowDown') return;
  if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
  event.preventDefault();
  changeInventory(event.code === 'ArrowUp' ? 1 : -1);
});
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
refreshInventory();
I18n.applyLocale();
runLoading();
