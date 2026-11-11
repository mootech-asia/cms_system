(function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var prizes = cfg.prizes;
  var seg = 360 / prizes.length;
  var STORE_KEY = 'event_20261111_lucky_wheel';

  var $ = function (id) { return document.getElementById(id); };
  var disc = $('wheelDisc');
  var btnSpin = $('btnSpin');
  var chancesEl = $('chances');
  var recordList = $('recordList');
  var modal = $('resultModal');
  var toast = $('toast');

  var state = load();
  var rotation = 0;
  var spinning = false;
  var toastTimer = null;

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && typeof s.chances === 'number' && Array.isArray(s.records)) return s;
    } catch (e) { /* localStorage 不可用時退回記憶體狀態 */ }
    return { chances: cfg.freeSpins, records: [] };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 同上 */ }
  }

  function applyImages() {
    document.querySelectorAll('[data-img]').forEach(function (el) {
      var src = cfg.images[el.getAttribute('data-img')];
      if (!src) return;
      if (el.tagName === 'IMG') el.src = src;
      else el.style.backgroundImage = 'url("' + src + '")';
    });
  }

  function renderWheelLabels() {
    var list = $('wheelLabels');
    if (!cfg.showLabels) { list.remove(); return; }
    list.innerHTML = prizes.map(function (p, i) {
      return '<li style="--ev-angle:' + (i * seg) + 'deg">' +
        '<span class="ev-wheel-label"><img src="' + p.icon + '" alt="" /><span>' + p.name + '</span></span></li>';
    }).join('');
  }

  function renderPrizeList() {
    $('prizeList').innerHTML = prizes.map(function (p) {
      return '<li><img src="' + p.icon + '" alt="" /><span>' + p.name + '</span></li>';
    }).join('');
  }

  function renderRecords() {
    var empty = $('recordEmpty');
    recordList.querySelectorAll('.ev-record').forEach(function (li) { li.remove(); });
    empty.hidden = state.records.length > 0;
    state.records.slice().reverse().forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'ev-record';
      li.innerHTML = '<span>' + r.name + '</span><time>' + r.time + '</time>';
      recordList.appendChild(li);
    });
  }

  function renderChances() {
    chancesEl.textContent = state.chances;
    btnSpin.classList.toggle('is-disabled', state.chances <= 0);
  }

  function pickIndex() {
    var total = prizes.reduce(function (sum, p) { return sum + p.weight; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < prizes.length; i++) {
      r -= prizes[i].weight;
      if (r < 0) return i;
    }
    return prizes.length - 1;
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2200);
  }

  function now() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '/' + p(d.getMonth() + 1) + '/' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function spin() {
    if (spinning) return;
    if (state.chances <= 0) { showToast('抽獎次數已用完'); return; }

    var idx = pickIndex();
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var duration = reduced ? 600 : cfg.spinDurationMs;

    // 落點留 15% 邊界避免停在分隔線上；目標角度須以「目前角度取模後」補齊，
    // 否則連續抽獎時累計角度會讓落點偏移。
    var jitter = (Math.random() - 0.5) * seg * 0.7;
    var target = (360 - idx * seg + jitter) % 360;
    var current = ((rotation % 360) + 360) % 360;
    var delta = (target - current + 360) % 360;
    rotation += cfg.minFullTurns * 360 + delta;

    spinning = true;
    state.chances -= 1;
    save();
    renderChances();
    btnSpin.setAttribute('aria-busy', 'true');

    disc.style.transitionDuration = duration + 'ms';
    disc.style.transform = 'rotate(' + rotation + 'deg)';

    setTimeout(function () {
      spinning = false;
      btnSpin.removeAttribute('aria-busy');
      var prize = prizes[idx];
      state.records.push({ id: prize.id, name: prize.name, time: now() });
      save();
      renderRecords();
      openModal(prize);
    }, duration + 50);
  }

  function openModal(prize) {
    $('resultTitle').textContent = prize.isLose ? cfg.loseTitle : cfg.winTitle;
    $('btnClose').textContent = prize.isLose ? '知道了' : '收下獎勵';
    $('resultIcon').src = prize.icon;
    $('resultName').textContent = prize.name;
    modal.hidden = false;
    $('btnClose').focus();
  }

  function closeModal() {
    modal.hidden = true;
    btnSpin.focus();
  }

  btnSpin.addEventListener('click', spin);
  $('btnClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  $('btnReset').addEventListener('click', function () {
    if (spinning) return;
    state = { chances: cfg.freeSpins, records: [] };
    save();
    renderChances();
    renderRecords();
    showToast('已重設為 ' + cfg.freeSpins + ' 次');
  });

  applyImages();
  renderWheelLabels();
  renderPrizeList();
  renderRecords();
  renderChances();
})();
