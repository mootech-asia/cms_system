(function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var I18n = window.EventI18n;
  var Sound = window.EventSound;
  var t = I18n.t;
  var pick = I18n.pick;
  var content = window.EventStore.load();
  var invalid = !window.EventStore.isValid(content);
  var prizes = invalid ? [] : content.prizes;
  var n = prizes.length;
  var seg = n ? 360 / n : 0;
  var PLAYER_KEY = 'event_20261111_lucky_wheel_player';
  var LABELS_KEY = 'event_20261111_lucky_wheel_labels';

  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage');
  var disc = $('wheelDisc');
  var btnSpin = $('btnSpin');
  var modal = $('resultModal');
  var toast = $('toast');
  var mascot = $('mascot');

  var player = loadPlayer();
  var rotation = 0;
  var spinning = false;
  var toastTimer = null;
  var idleTimer = null;
  var idleIndex = 0;
  var mascotState = 'idle';
  var lastPrize = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // 後台改過內容（updatedAt 變了）就重發次數，避免沿用舊獎項的紀錄。
  function loadPlayer() {
    try {
      var s = JSON.parse(localStorage.getItem(PLAYER_KEY));
      if (s && s.version === content.updatedAt && typeof s.chances === 'number' && Array.isArray(s.records)) return s;
    } catch (e) { /* localStorage 不可用時退回記憶體狀態 */ }
    return freshPlayer();
  }

  function freshPlayer() {
    return { version: content.updatedAt, chances: Number(content.freeSpins) || 0, records: [] };
  }

  function savePlayer() {
    try { localStorage.setItem(PLAYER_KEY, JSON.stringify(player)); } catch (e) { /* 同上 */ }
  }

  // 版面元件圖（徽章、卡片框…）以 CSS 變數 --ev-img-<key> 提供給 event.css；沒設定的 key 走 CSS 預設樣式
  function applyImageVars() {
    var root = document.documentElement.style;
    Object.keys(cfg.images).forEach(function (key) {
      var src = pick(cfg.images[key]);
      // CSS 變數裡的 url() 會以「使用它的樣式表」為基準解析相對路徑，所以先轉成絕對網址
      if (typeof src === 'string' && src) root.setProperty('--ev-img-' + key, 'url("' + new URL(src, document.baseURI).href + '")');
    });
  }

  function applyImages() {
    applyImageVars();
    document.querySelectorAll('[data-img]').forEach(function (el) {
      var key = el.getAttribute('data-img');
      var src = pick(cfg.images[key]);
      if (!src) return;
      if (el.tagName === 'IMG') el.src = src;
      else el.style.backgroundImage = 'url("' + src + '")';
    });
  }

  function wheelColor(i) {
    var css = getComputedStyle(document.documentElement);
    var len = parseInt(css.getPropertyValue('--ev-wheel-count'), 10) || 1;
    var k = i % len;
    // 獎項數除不盡色數時，最後一格可能與第一格同色而相鄰，改用下一個顏色
    if (i === n - 1 && n > 1 && k === 0) k = 1 % len;
    return {
      bg: css.getPropertyValue('--ev-wheel-' + (k + 1)).trim(),
      text: css.getPropertyValue('--ev-wheel-' + (k + 1) + '-text').trim()
    };
  }

  function point(deg, r) {
    var a = deg * Math.PI / 180;
    return [(r * Math.sin(a)).toFixed(2), (-r * Math.cos(a)).toFixed(2)];
  }

  function renderWheel() {
    var R = 300;
    var paths = '';
    var lines = '';
    for (var i = 0; i < n; i++) {
      var c = wheelColor(i);
      var p1 = point(i * seg - seg / 2, R);
      var p2 = point(i * seg + seg / 2, R);
      paths += '<path d="M0 0L' + p1.join(' ') + 'A' + R + ' ' + R + ' 0 0 1 ' + p2.join(' ') + 'Z" fill="' + c.bg + '"/>';
      lines += '<line x1="0" y1="0" x2="' + p2[0] + '" y2="' + p2[1] + '"/>';
    }
    disc.querySelector('svg').innerHTML = paths + '<g class="ev-wheel-dividers">' + lines + '</g>';
    var list = $('wheelLabels');
    list.style.setProperty('--ev-label-w', Math.min(34, 2 * 30 * Math.sin(Math.PI / n)) + '%');
    list.classList.toggle('is-dense', n > 8);
    renderWheelLabels();
  }

  function renderWheelLabels() {
    $('wheelLabels').innerHTML = prizes.map(function (p, i) {
      var name = String(pick(p.name));
      return '<li style="--ev-angle:' + (i * seg) + 'deg;--ev-label-color:' + wheelColor(i).text + '">' +
        '<span class="ev-wheel-label' + (name.length > 12 ? ' is-long' : '') + '">' +
        (p.icon ? '<img src="' + esc(p.icon) + '" alt="" />' : '') +
        '<span>' + esc(name) + '</span></span></li>';
    }).join('');
  }

  // 燈泡分三層：全部熄燈（不動）＋奇數亮燈一組＋偶數亮燈一組；閃爍只切換兩組的透明度，
  // 24 顆燈泡共用 2 個動畫，手機上比每顆各自動畫省很多
  function renderBulbs() {
    var off = '', on = ['', ''];
    for (var i = 0; i < cfg.bulbCount; i++) {
      var a = (i / cfg.bulbCount) * Math.PI * 2;
      var pos = '<i style="left:' + (50 + 46.6 * Math.sin(a)).toFixed(2) + '%;top:' + (50 - 46.6 * Math.cos(a)).toFixed(2) + '%"></i>';
      off += pos;
      on[i % 2] += pos;
    }
    $('wheelBulbs').innerHTML = '<div class="ev-bulbs-off">' + off + '</div>' +
      '<div class="ev-bulbs-on">' + on[0] + '</div><div class="ev-bulbs-on ev-bulbs-on--b">' + on[1] + '</div>';
  }

  function renderContent() {
    $('period').textContent = content.period ? t('period', { p: content.period }) : '';
    $('rulesTitle').textContent = pick(content.rulesTitle) || t('rules.title');
    var rules = (pick(content.rules) || []).filter(function (r) { return String(r).trim(); });
    $('rulesList').innerHTML = rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
    $('rulesList').hidden = !rules.length;
    $('rulesEmpty').hidden = rules.length > 0;
  }

  // 中獎跑馬燈：winners 由後台提供（prize 為獎項索引或 {en,ko,th,zh} 名稱）；內容複製一份讓捲動無縫
  function renderTicker() {
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
      li.innerHTML = '<span>' + esc(pick(r.name)) + '</span><time>' + esc(r.time) + '</time>';
      list.appendChild(li);
    });
  }

  function renderChances() {
    $('chances').textContent = player.chances;
    btnSpin.classList.toggle('is-disabled', player.chances <= 0 || !n);
    $('btnSpinCta').classList.toggle('is-disabled', player.chances <= 0 || !n);
  }

  function renderAssetLabels() {
    var specs = cfg.assetSpecs;
    document.querySelectorAll('[data-asset]').forEach(function (el) {
      el.textContent = el.getAttribute('data-asset').split(' ').map(function (k) {
        return specs[k].replace('{locale}', I18n.getLocale()).replace('{state}', mascotState);
      }).join('\n');
    });
  }

  // 被 CMS 前台用 iframe 嵌入時，換圖標籤預設關閉（mock 工具列手動打開才顯示）
  var embedded = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
  function labelsOn() {
    try {
      var v = localStorage.getItem(LABELS_KEY);
      return v ? v !== 'off' : !embedded;
    } catch (e) { return !embedded; }
  }

  function renderLabelToggle() {
    var on = document.body.classList.contains('show-asset-labels');
    $('btnLabels').setAttribute('aria-pressed', String(on));
    $('labelsState').textContent = t(on ? 'mock.on' : 'mock.off');
  }

  // 所有吉祥物 GIF 都從同一張基準幀開始、回到同一張結束，且每段長度相同（cfg.mascot.loopMs），
  // 所以切換時等目前這段播完一輪（剛好回到基準幀）再換，畫面不會跳；第一次顯示則立即換。
  var mascotShownAt = 0;
  var mascotSwapTimer = null;

  // 動態圖每段約 400KB：頁面載入完成後在背景依序預載所有狀態；切換時若目標還沒下載完，
  // 先保留目前的動作，下載完才換（不然慢網路下角色會整隻消失好幾秒）。
  var mascotCache = {};
  function loadMascot(src, done) {
    var entry = mascotCache[src];
    if (!entry) {
      entry = mascotCache[src] = { ready: false, cbs: [] };
      var img = new Image();
      img.onload = img.onerror = function () {
        entry.ready = true;
        entry.cbs.splice(0).forEach(function (cb) { cb(); });
      };
      img.src = src;
    }
    if (done) { if (entry.ready) done(); else entry.cbs.push(done); }
  }
  function preloadMascots() {
    var list = [cfg.mascot.spinning, cfg.mascot.result, cfg.mascot.lose].concat(cfg.mascot.idle).filter(Boolean);
    (function next(i) { if (i < list.length) loadMascot(list[i], function () { next(i + 1); }); })(0);
  }

  var mascotWant = null;
  function showMascot(src, state) {
    clearTimeout(mascotSwapTimer);
    mascotWant = src;
    var swap = function () {
      if (mascotWant !== src) return;
      mascot.src = src;
      mascotShownAt = performance.now();
      mascotState = state;
      renderAssetLabels();
    };
    loadMascot(src, function () {
      if (mascotWant !== src) return;
      var loop = cfg.mascot.loopMs;
      if (!mascotShownAt || !loop) { swap(); return; }
      var wait = (loop - (performance.now() - mascotShownAt) % loop) % loop;
      mascotSwapTimer = setTimeout(swap, wait);
    });
  }

  function setMascot(state) {
    clearTimeout(idleTimer);
    if (state === 'idle') {
      var i = idleIndex % cfg.mascot.idle.length;
      var src = cfg.mascot.idle[i];
      showMascot(src, src.split('/').pop().replace(/\.[a-z]+$/, ''));
      idleTimer = setTimeout(function () {
        idleIndex++;
        setMascot('idle');
      }, cfg.idleSwapMs);
    } else {
      // 「失望」動作還沒交付時先用「慶祝」那段
      var key = state === 'lose' && !cfg.mascot.lose ? 'result' : state;
      showMascot(cfg.mascot[key], state);
    }
  }

  function setStage(state) {
    stage.classList.toggle('is-spinning', state === 'spinning');
    stage.classList.toggle('is-result', state === 'result');
  }

  function pickIndex() {
    var total = prizes.reduce(function (s, p) { return s + Number(p.weight); }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < n; i++) {
      r -= Number(prizes[i].weight);
      if (r < 0) return i;
    }
    return n - 1;
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

  function spin() {
    if (spinning) return;
    if (!n) { showToast(t('toast.noPrizes')); return; }
    if (player.chances <= 0) { showToast(t('toast.noChances')); return; }

    var idx = pickIndex();
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var duration = reduced ? 600 : cfg.spinDurationMs;

    // 落點留 15% 邊界避免停在分隔線上；以「目前角度取模後」補齊，連續抽獎才不會偏移。
    var jitter = (Math.random() - 0.5) * seg * 0.7;
    var target = (360 - idx * seg + jitter) % 360;
    var current = ((rotation % 360) + 360) % 360;
    rotation += cfg.minFullTurns * 360 + (target - current + 360) % 360;

    spinning = true;
    player.chances -= 1;
    savePlayer();
    renderChances();
    btnSpin.setAttribute('aria-busy', 'true');
    setStage('spinning');
    setMascot('spinning');
    Sound.drumroll(duration);

    disc.style.transitionDuration = duration + 'ms';
    disc.style.transform = 'rotate(' + rotation + 'deg)';

    setTimeout(function () {
      var prize = prizes[idx];
      setStage('result');
      setMascot(prize.isLose ? 'lose' : 'result');
      Sound.finale(prize.isLose);
      player.records.push({ name: prize.name, time: now() });
      savePlayer();
      renderRecords();
      setTimeout(function () {
        spinning = false;
        btnSpin.removeAttribute('aria-busy');
        openModal(prize);
      }, cfg.resultHoldMs);
    }, duration + 50);
  }

  function renderModal() {
    if (!lastPrize) return;
    $('resultTitle').textContent = t(lastPrize.isLose ? 'modal.lose' : 'modal.win');
    $('btnClose').textContent = t(lastPrize.isLose ? 'modal.ok' : 'modal.claim');
    $('resultName').textContent = pick(lastPrize.name);
  }

  function openModal(prize) {
    lastPrize = prize;
    var icon = $('resultIcon');
    icon.hidden = !prize.icon;
    if (prize.icon) icon.src = prize.icon;
    renderModal();
    modal.hidden = false;
    Sound.reward(prize.isLose);
    $('btnClose').focus();
  }

  function closeModal() {
    modal.hidden = true;
    setStage('idle');
    setMascot('idle');
    btnSpin.focus();
  }

  function renderSound() {
    var on = Sound.isEnabled();
    $('btnSound').setAttribute('aria-pressed', String(on));
    $('btnSound').setAttribute('aria-label', t(on ? 'sound.off' : 'sound.on'));
    $('soundIcon').src = on ? cfg.images.soundOn : cfg.images.soundOff;
  }

  function renderLocale() {
    applyImages();
    if (n) renderWheelLabels();
    renderContent();
    renderTicker();
    renderRecords();
    renderSound();
    renderModal();
    renderLabelToggle();
    renderAssetLabels();
  }

  btnSpin.addEventListener('click', spin);
  $('btnSpinCta').addEventListener('click', spin);
  $('btnClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  $('btnSound').addEventListener('click', function () {
    Sound.setEnabled(!Sound.isEnabled());
    renderSound();
  });
  $('btnLabels').addEventListener('click', function () {
    var on = !document.body.classList.contains('show-asset-labels');
    document.body.classList.toggle('show-asset-labels', on);
    try { localStorage.setItem(LABELS_KEY, on ? 'on' : 'off'); } catch (e) { /* 只在本次頁面生效 */ }
    renderLabelToggle();
  });
  $('btnReset').addEventListener('click', function () {
    if (spinning) return;
    player = freshPlayer();
    player.chances = cfg.mockResetSpins;
    savePlayer();
    renderChances();
    renderRecords();
    showToast(t('toast.reset', { n: player.chances }));
  });
  // mock 工具列平常隱藏（老闆／客戶看不到），內部用 Ctrl+Alt+H（Mac：Control+Option+H）叫出／收起，
  // 本分頁內記住狀態
  var MOCK_KEY = 'event-mock-tools';
  var mockTools = $('mockTools');
  try { mockTools.hidden = sessionStorage.getItem(MOCK_KEY) !== 'on'; } catch (e) { /* 預設隱藏 */ }
  document.addEventListener('keydown', function (e) {
    if (!e.ctrlKey || !e.altKey || e.metaKey || e.shiftKey || e.code !== 'KeyH') return;
    var el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    e.preventDefault();
    mockTools.hidden = !mockTools.hidden;
    try { sessionStorage.setItem(MOCK_KEY, mockTools.hidden ? 'off' : 'on'); } catch (err) { /* 只在本次頁面生效 */ }
    if (!mockTools.hidden) mockTools.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
  document.addEventListener('ev:locale', renderLocale);
  window.EventShare.init(showToast);
  if (document.readyState === 'complete') preloadMascots();
  else window.addEventListener('load', preloadMascots);
  // 支援的瀏覽器（Android 全螢幕／已安裝）直接鎖直向；不支援時由 .ev-rotate 提示層處理
  try {
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(function () {});
  } catch (e) { /* 不支援 */ }

  document.body.classList.toggle('show-asset-labels', labelsOn());
  I18n.renderSwitcher($('langSwitch'));
  renderBulbs();
  if (n) renderWheel();
  else $('wheelEmpty').hidden = false;
  renderChances();
  setMascot('idle');
  I18n.applyLocale();
})();
