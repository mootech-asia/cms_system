// CMS_前台_v4 — 純靜態站 vanilla JS 行為層（無框架、無 build）。
(function () {
  'use strict';

  function safe(fn) { try { fn(); } catch (e) { /* 避免單一功能失敗拖垮整頁 */ } }

  function initHero() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var len = slides.length;
    if (!len) return;
    var idx = 0;
    var timer = null;

    function apply() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    function resetAuto() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { idx = (idx + 1) % len; apply(); }, 6000);
    }
    function goTo(i) { idx = i; apply(); resetAuto(); }

    var prevBtn = hero.querySelector('.hero-arrow.prev');
    var nextBtn = hero.querySelector('.hero-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo((idx - 1 + len) % len); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo((idx + 1) % len); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    resetAuto();
  }

  function initFeatureCarousel() {
    var carousel = document.getElementById('featureCarousel');
    if (!carousel) return;
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.feature-card'));
    var len = slides.length;
    if (!len) return;
    var idx = 0;
    setInterval(function () {
      idx = (idx + 1) % len;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
    }, 5000);
  }

  function initVendorSelect() {
    var rails = Array.prototype.slice.call(document.querySelectorAll('.vendor-rail'));
    rails.forEach(function (rail) {
      var card = rail.closest('.feature-card');
      var bg = card ? card.querySelector('.feature-card-bg') : null;
      var chips = Array.prototype.slice.call(rail.querySelectorAll('.feature-vendor-chip'));
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
          if (bg && chip.dataset.bg) bg.style.backgroundImage = 'url(' + chip.dataset.bg + ')';
        });
      });
    });
  }

  function initRails() {
    var rails = Array.prototype.slice.call(document.querySelectorAll('.tile-grid.rail'));
    rails.forEach(function (rail) {
      var panel = rail.closest('.panel');
      var prevBtn = panel ? panel.querySelector('.rail-arrow-prev') : null;
      var nextBtn = panel ? panel.querySelector('.rail-arrow-next') : null;

      function updateArrows() {
        var maxScroll = rail.scrollWidth - rail.clientWidth;
        if (prevBtn) prevBtn.disabled = rail.scrollLeft <= 4;
        if (nextBtn) nextBtn.disabled = maxScroll <= 4 || rail.scrollLeft >= maxScroll - 4;
      }
      if (prevBtn) prevBtn.addEventListener('click', function () { rail.scrollBy({ left: -rail.clientWidth * 0.9, behavior: 'smooth' }); });
      if (nextBtn) nextBtn.addEventListener('click', function () { rail.scrollBy({ left: rail.clientWidth * 0.9, behavior: 'smooth' }); });
      rail.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      updateArrows();

      // 滑鼠可直接按住拖曳橫向捲動（觸控裝置原生滑動已可用，這裡補上桌機滑鼠操作）。
      var dragging = false;
      var startX = 0;
      var startScroll = 0;
      rail.addEventListener('mousedown', function (e) {
        dragging = true;
        rail.classList.add('dragging');
        startX = e.pageX;
        startScroll = rail.scrollLeft;
      });
      window.addEventListener('mouseup', function () {
        if (!dragging) return;
        dragging = false;
        rail.classList.remove('dragging');
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        e.preventDefault();
        rail.scrollLeft = startScroll - (e.pageX - startX);
      });
    });
  }

  /* 收藏：以 localStorage 保存，事件代理掛在 document 上,
     讓 tab 切換重繪卡片後仍然有效。 */
  var FAV_KEY = 'cms-v4-favorites';
  function favIds() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; }
  }
  function saveFavIds(ids) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); } catch (e) {}
  }
  function initFavorites() {
    var ids = favIds();
    Array.prototype.slice.call(document.querySelectorAll('.game-tile-fav')).forEach(function (btn) {
      var on = ids.indexOf(btn.getAttribute('data-fav-id')) !== -1;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.game-tile-fav');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var id = btn.getAttribute('data-fav-id');
      if (!id) return;
      var list = favIds();
      var idx = list.indexOf(id);
      if (idx === -1) list.push(id); else list.splice(idx, 1);
      saveFavIds(list);
      btn.classList.toggle('is-active', idx === -1);
      btn.setAttribute('aria-pressed', String(idx === -1));
      applyListingTab();
    });
  }

  /* 分類頁「廠商 / 收藏」頁簽：收藏頁只顯示已收藏的卡片。 */
  function applyListingTab() {
    var grid = document.getElementById('listingGrid');
    if (!grid) return;
    var active = document.querySelector('.listing-tab.active');
    var mode = active ? active.getAttribute('data-listing-tab') : 'all';
    var ids = favIds();
    var shown = 0;
    Array.prototype.slice.call(grid.querySelectorAll('.game-tile')).forEach(function (tile) {
      var btn = tile.querySelector('.game-tile-fav');
      var id = btn ? btn.getAttribute('data-fav-id') : '';
      var show = mode !== 'fav' || ids.indexOf(id) !== -1;
      tile.hidden = !show;
      if (show) shown++;
    });
    var empty = document.getElementById('listingEmpty');
    if (empty) empty.hidden = shown !== 0;
  }
  function initListingTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.listing-tab'));
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        applyListingTab();
      });
    });
    applyListingTab();
  }

  /* 分類頁搜尋：即時過濾卡片名稱（前台靜態站無後端,純前端比對）。 */
  function initListingSearch() {
    var wrap = document.querySelector('.listing-search');
    var grid = document.getElementById('listingGrid');
    if (!wrap || !grid) return;
    var input = wrap.querySelector('input');
    var btn = wrap.querySelector('button');
    function run() {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      Array.prototype.slice.call(grid.querySelectorAll('.game-tile')).forEach(function (tile) {
        var name = (tile.querySelector('.game-tile-name') || {}).textContent || '';
        var show = !q || name.toLowerCase().indexOf(q) !== -1;
        tile.hidden = !show;
        if (show) shown++;
      });
      var empty = document.getElementById('listingEmpty');
      if (empty) empty.hidden = shown !== 0;
    }
    input.addEventListener('input', run);
    if (btn) btn.addEventListener('click', run);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    safe(initHero);
    safe(initFeatureCarousel);
    safe(initVendorSelect);
    safe(initRails);
    safe(initFavorites);
    safe(initListingTabs);
    safe(initListingSearch);
  });
})();
