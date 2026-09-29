/* Casino / Live games 頁的廠商標籤列：比照 v3 的 cv-tabs（全部 / 收藏 /
   各廠商），插在遊戲網格上方，點擊後依卡片的 data-vendor 在 DOM 上顯示/
   隱藏，不重繪卡片（收藏按鈕狀態留在原節點上）。「收藏」篩選讀
   __v2mFav.isFavorite；在收藏篩選下取消愛心，卡片會即時從列表消失。 */
(function () {
  'use strict';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  var BASE = 'flex-none inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold';
  var ON = ' border-transparent bg-accent btn-3d text-text-on-accent';
  var OFF = ' border-line bg-bg-card text-text-mid';
  var HEART = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"></path></svg>';

  window.__v2mVendorTags = function (grid, vendors) {
    var fav = window.__v2mFav;
    var current = 'all';

    var bar = document.createElement('div');
    bar.className = 'flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-3 mb-1';
    bar.setAttribute('role', 'tablist');

    var empty = document.createElement('p');
    empty.className = 'hidden py-10 text-center text-[13px] text-text-dim';
    empty.setAttribute('data-i18n', 'favorites.empty');
    empty.textContent = t('favorites.empty');

    function favCount() {
      if (!fav) return 0;
      return Array.prototype.filter.call(grid.querySelectorAll('.fav-toggle[data-fav-id]'), function (b) {
        return fav.isFavorite(b.getAttribute('data-fav-id'));
      }).length;
    }

    function tagHTML(key, label, extra) {
      var on = key === current;
      return '<button type="button" class="' + BASE + (on ? ON : OFF) + '" role="tab" aria-selected="' + on + '" data-vendor-tag="' + esc(key) + '">' + (extra || '') + label + '</button>';
    }

    function renderBar() {
      var n = favCount();
      var html = tagHTML('all', '<span data-i18n="section.all">' + esc(t('section.all')) + '</span>');
      if (fav) {
        html += tagHTML('favorites', '<span data-i18n="nav.favorites">' + esc(t('nav.favorites')) + '</span>' +
          (n ? '<span class="rounded-full bg-black/20 px-1.5 text-[10.5px] leading-4">' + n + '</span>' : ''), HEART);
      }
      vendors.forEach(function (v) { html += tagHTML(v, esc(v)); });
      bar.innerHTML = html;
    }

    function applyFilter() {
      var shown = 0;
      Array.prototype.forEach.call(grid.children, function (card) {
        var ok;
        if (current === 'all') ok = true;
        else if (current === 'favorites') {
          var btn = card.querySelector('.fav-toggle[data-fav-id]');
          ok = !!(btn && fav && fav.isFavorite(btn.getAttribute('data-fav-id')));
        } else ok = card.getAttribute('data-vendor') === current;
        card.classList.toggle('hidden', !ok);
        if (ok) shown++;
      });
      empty.classList.toggle('hidden', shown > 0);
    }

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-vendor-tag]');
      if (!btn) return;
      current = btn.getAttribute('data-vendor-tag');
      renderBar();
      applyFilter();
    });

    document.addEventListener('win100-favorite-change', function () {
      renderBar();
      if (current === 'favorites') applyFilter();
    });

    grid.parentNode.insertBefore(bar, grid);
    grid.parentNode.insertBefore(empty, grid.nextSibling);
    renderBar();
    applyFilter();
  };
})();
