/* Casino / Live games 頁的廠商標籤列：比照 v3 的 cv-tabs（全部 / 收藏 / 各廠商），
   插在遊戲網格上方，點擊後依卡片的 data-vendor 在 DOM 上顯示/隱藏，不重繪
   卡片（收藏按鈕狀態留在原節點上）。 */
(function () {
  'use strict';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  var BASE = 'flex-none inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold';
  var ON = ' border-transparent bg-primary text-on-primary';
  var OFF = ' border-border-soft bg-surface text-text-2';

  window.__v2mVendorTags = function (grid, vendors) {
    var current = 'all';

    var bar = document.createElement('div');
    bar.className = 'flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-1';
    bar.setAttribute('role', 'tablist');

    function tagHTML(key, label) {
      var on = key === current;
      return '<button type="button" class="' + BASE + (on ? ON : OFF) + '" role="tab" aria-selected="' + on + '" data-vendor-tag="' + esc(key) + '">' + label + '</button>';
    }

    var HEART = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"></path></svg>';
    var empty = document.createElement('p');
    empty.className = 'hidden py-10 text-center text-[13px] text-text-3';
    empty.setAttribute('data-i18n', 'favorites.empty');
    empty.textContent = t('favorites.empty');

    function renderBar() {
      var html = tagHTML('all', '<span data-i18n="section.all">' + esc(t('section.all')) + '</span>') +
        tagHTML('favorites', HEART + '<span data-i18n="nav.favorites">' + esc(t('nav.favorites')) + '</span>');
      vendors.forEach(function (v) { html += tagHTML(v, esc(v)); });
      bar.innerHTML = html;
    }

    /* 「收藏」標籤：只留卡片上愛心是按下狀態的；在這個標籤下取消愛心，
       卡片會即時消失。全部都沒有時顯示「尚無收藏的遊戲」。 */
    function matches(card) {
      if (current === 'all') return true;
      if (current === 'favorites') {
        var heart = card.querySelector('.fav-toggle');
        return !!heart && heart.getAttribute('aria-pressed') === 'true';
      }
      return card.getAttribute('data-vendor') === current;
    }
    function applyFilter() {
      var shown = 0;
      Array.prototype.forEach.call(grid.children, function (card) {
        var on = matches(card);
        card.classList.toggle('hidden', !on);
        if (on) shown += 1;
      });
      empty.classList.toggle('hidden', !(current === 'favorites' && shown === 0));
    }
    document.addEventListener('win100-favorite-change', function () { if (current === 'favorites') applyFilter(); });

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-vendor-tag]');
      if (!btn) return;
      current = btn.getAttribute('data-vendor-tag');
      renderBar();
      applyFilter();
    });

    grid.parentNode.insertBefore(bar, grid);
    grid.insertAdjacentElement('afterend', empty);
    renderBar();
    applyFilter();
  };
})();
