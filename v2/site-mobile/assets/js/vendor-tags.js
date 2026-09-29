/* Casino / Live games 頁的廠商標籤列：比照 v3 的 cv-tabs（全部 / 各廠商），
   插在遊戲網格上方，點擊後依卡片的 data-vendor 在 DOM 上顯示/隱藏，不重繪
   卡片（收藏按鈕狀態留在原節點上）。 */
(function () {
  'use strict';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  var BASE = 'flex-none inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold';
  var ON = ' border-transparent bg-accent text-text-on-accent';
  var OFF = ' border-line bg-bg-card text-text-mid';

  window.__v2mVendorTags = function (grid, vendors) {
    var current = 'all';

    var bar = document.createElement('div');
    bar.className = 'flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-3 mb-1';
    bar.setAttribute('role', 'tablist');

    function tagHTML(key, label) {
      var on = key === current;
      return '<button type="button" class="' + BASE + (on ? ON : OFF) + '" role="tab" aria-selected="' + on + '" data-vendor-tag="' + esc(key) + '">' + label + '</button>';
    }

    function renderBar() {
      var html = tagHTML('all', '<span data-i18n="section.all">' + esc(t('section.all')) + '</span>');
      vendors.forEach(function (v) { html += tagHTML(v, esc(v)); });
      bar.innerHTML = html;
    }

    function applyFilter() {
      Array.prototype.forEach.call(grid.children, function (card) {
        card.classList.toggle('hidden', current !== 'all' && card.getAttribute('data-vendor') !== current);
      });
    }

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-vendor-tag]');
      if (!btn) return;
      current = btn.getAttribute('data-vendor-tag');
      renderBar();
      applyFilter();
    });

    grid.parentNode.insertBefore(bar, grid);
    renderBar();
    applyFilter();
  };
})();
