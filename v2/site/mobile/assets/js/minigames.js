/* 首頁遊戲分頁輪播：比照 v2/site 桌機版 initMiniGamesGrid()（MiniGamesGrid.vue）。
   迷你遊戲／老虎機／真人娛樂三個分頁每 8 秒自動切到下一個，選中分頁底部的
   進度條顯示倒數（線性連續增長）；點分頁或左右箭頭會重新計時。左右箭頭一次捲動「一屏可見的
   卡片數」，到底再按回到開頭。「查看全部」連到該分類頁。遊戲名稱與圖片取自
   桌機版 D.MINI_NAMES / D.MINI_IMG_POOL / D.LIVE_TABLES。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};
  var KEYS = ['mini', 'slot', 'live'];
  var INTERVAL = 8000;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* 桌機版圖庫路徑相對於 v2/site，手機版在隔壁資料夾，要補上 ../ */
  function src(path) { return /^(https?:)?\/\//.test(path || '') ? path : '../' + path; }

  function gamesFor(key) {
    var names = (D.MINI_NAMES || {})[key] || [];
    if (key === 'live') {
      var tables = D.LIVE_TABLES || [];
      return names.map(function (title, i) {
        var tb = tables.length ? tables[i % tables.length] : {};
        return { title: title, img: tb.image, focalPoint: tb.focalPoint || 'center' };
      });
    }
    var pool = D.MINI_IMG_POOL || [];
    return names.map(function (title, i) { return { title: title, img: pool.length ? src(pool[i % pool.length]) : '', focalPoint: 'center' }; });
  }
  function cardHtml(g) {
    return '<div class="w-25 flex-none" data-game-card>' +
      '<div class="aspect-square overflow-hidden rounded-xl bg-surface-2 ring-1 ring-border">' +
      '<img src="' + esc(g.img) + '" alt="' + esc(g.title) + '" class="h-full w-full object-cover" style="object-position:' + esc(g.focalPoint) + '" loading="lazy"></div>' +
      '<p class="mt-1.5 truncate text-center text-[12px] font-semibold text-text">' + esc(g.title) + '</p></div>';
  }

  function init() {
    var root = document.querySelector('[data-mini-games]');
    if (!root) return;
    var rail = root.querySelector('[data-mini-rail]');
    var allLink = root.querySelector('[data-mini-all]');
    var tabs = {};
    root.querySelectorAll('[data-mini-tab]').forEach(function (b) { tabs[b.getAttribute('data-mini-tab')] = b; });
    var current = 'mini';
    var startedAt = 0;

    function setActive(key) {
      current = key;
      startedAt = performance.now();
      rail.innerHTML = gamesFor(key).map(cardHtml).join('');
      rail.scrollLeft = 0;
      KEYS.forEach(function (k) {
        var b = tabs[k];
        var on = k === key;
        b.setAttribute('aria-selected', String(on));
        ['bg-bg', 'text-primary', 'ring-1', 'ring-primary/40'].forEach(function (c) { b.classList.toggle(c, on); });
        b.classList.toggle('text-text-3', !on);
        var bar = b.querySelector('[data-mini-bar]');
        if (on && !bar) b.insertAdjacentHTML('beforeend', '<span class="absolute inset-x-3 bottom-1 h-0.5 overflow-hidden rounded-full bg-primary/20" aria-hidden="true"><span class="block h-full w-0 rounded-full bg-primary" data-mini-bar></span></span>');
        if (!on && bar) bar.parentElement.remove();
      });
      if (allLink && D.MINI_ROUTES) allLink.setAttribute('href', D.MINI_ROUTES[key]);
    }
    function move(dir) {
      var card = rail.querySelector('[data-game-card]');
      var gap = parseFloat(getComputedStyle(rail).columnGap) || 12;
      var w = (card && card.offsetWidth) || 100;
      var visible = Math.max(1, Math.floor((rail.clientWidth + gap) / (w + gap)));
      var jump = (w + gap) * visible;
      var max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      if (max <= 1) return;
      var target = dir > 0
        ? (rail.scrollLeft >= max - 2 ? 0 : Math.min(max, rail.scrollLeft + jump))
        : (rail.scrollLeft <= 2 ? max : Math.max(0, rail.scrollLeft - jump));
      startedAt = performance.now();
      rail.scrollTo({ left: target, behavior: 'smooth' });
    }

    KEYS.forEach(function (k) { tabs[k].addEventListener('click', function () { setActive(k); }); });
    root.querySelectorAll('[data-mini-move]').forEach(function (b) {
      b.addEventListener('click', function () { move(+b.getAttribute('data-mini-move')); });
    });
    setActive('mini');
    /* 每一幀依實際經過時間算寬度，進度條連續線性增長，不會一格一格跳 */
    function frame(now) {
      var elapsed = now - startedAt;
      if (elapsed >= INTERVAL) {
        setActive(KEYS[(KEYS.indexOf(current) + 1) % KEYS.length]);
        elapsed = 0;
      }
      var bar = tabs[current].querySelector('[data-mini-bar]');
      if (bar) bar.style.width = Math.min(100, (elapsed / INTERVAL) * 100) + '%';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
