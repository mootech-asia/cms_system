/* 遊戲搜尋，比照 v2/site 桌機版分類頁 VendorBrowser 的搜尋框（輸入即時過濾）：
   - 分類頁（熱門／娛樂城／真人／老虎機／捕魚／迷你遊戲）在標題下方放搜尋框，
     依卡片文字（遊戲名稱、供應商）即時過濾，可清除；無結果時顯示提示。
   - 選單抽屜頂端的搜尋框按 Enter／搜尋鈕：在分類頁就過濾目前頁，
     其他頁帶 ?q= 進熱門遊戲頁。
   過濾用 inline display，不碰廠商標籤列（vendor-tags.js）用的 hidden class，
   兩種篩選同時生效。 */
(function () {
  'use strict';

  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }
  var SEARCH_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>';
  var X_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>';

  function boxHtml(attr) {
    return '<div class="relative">' +
      '<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-3">' + SEARCH_SVG + '</span>' +
      '<input type="search" enterkeyhint="search" autocomplete="off" class="h-11 w-full rounded-xl border border-border-soft bg-bg pl-9 pr-10 text-[14px] text-text placeholder:text-text-3 [&::-webkit-search-cancel-button]:hidden" ' + attr + ' data-i18n-placeholder="search.game" placeholder="' + t('search.game') + '">' +
      '<button type="button" class="absolute right-1.5 top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-text-3" data-search-clear aria-label="Clear">' + X_SVG + '</button>' +
      '</div>';
  }

  var grid = null;
  var input = null;
  var empty = null;
  function apply() {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    Array.prototype.forEach.call(grid.children, function (card) {
      var hit = !q || (card.textContent || '').toLowerCase().indexOf(q) !== -1;
      card.style.display = hit ? '' : 'none';
      if (hit && !card.classList.contains('hidden')) shown += 1;
    });
    empty.classList.toggle('hidden', shown > 0);
    var clear = input.parentElement.querySelector('[data-search-clear]');
    clear.classList.toggle('hidden', !input.value);
    clear.classList.toggle('grid', !!input.value);
  }

  function initPageSearch() {
    grid = document.getElementById('category-grid');
    if (!grid) return;
    var h1 = grid.parentElement.querySelector('h1');
    var wrap = document.createElement('div');
    wrap.className = 'mb-3';
    wrap.innerHTML = boxHtml('data-page-search');
    (h1 || grid).insertAdjacentElement(h1 ? 'afterend' : 'beforebegin', wrap);
    input = wrap.querySelector('input');
    empty = document.createElement('p');
    empty.className = 'hidden py-10 text-center text-[13px] text-text-3';
    empty.setAttribute('data-i18n', 'search.noResults');
    empty.textContent = t('search.noResults');
    grid.insertAdjacentElement('afterend', empty);
    input.addEventListener('input', apply);
    wrap.querySelector('[data-search-clear]').addEventListener('click', function () { input.value = ''; apply(); input.focus(); });
    /* 廠商標籤切換後重新計算「是否無結果」 */
    grid.parentElement.addEventListener('click', function (e) { if (e.target.closest('[data-vendor-tag]')) setTimeout(apply, 0); });
    var q = new URLSearchParams(location.search).get('q');
    if (q) input.value = q;
    apply();
  }

  /* 選單抽屜是 <template> 每次打開才複製，所以用事件委派處理 */
  function submitDrawer(field) {
    var q = field.value.trim();
    if (!q) return;
    if (input) {
      input.value = q;
      apply();
      var closeBtn = field.closest('[data-drawer-panel]').querySelector('button[data-drawer-close]');
      if (closeBtn) closeBtn.click();
      input.scrollIntoView({ block: 'center' });
      return;
    }
    location.href = 'hot-games.html?q=' + encodeURIComponent(q);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-drawer-search]')) { e.preventDefault(); submitDrawer(e.target); }
  });
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-drawer-search-go]');
    if (go) submitDrawer(go.parentElement.querySelector('[data-drawer-search]'));
  });

  window.__v2mSearchBox = boxHtml;
  document.addEventListener('DOMContentLoaded', function () { setTimeout(initPageSearch, 0); });
})();
