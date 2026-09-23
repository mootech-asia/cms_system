/* 收藏功能，port 自 v2/site 桌機版 site.js 的 favoriteIds/toggleFavorite/
   favIdFor/favToggleHtml/initFavorites()（見該檔 89-157 行一帶）。localStorage
   key（win100-static-favorites）跟 id 組成規則（kind|provider|i，live 用
   kind|<桌名>）都刻意跟桌機版共用同一套，同一使用者在桌機/手機收藏同一張
   卡，兩邊狀態互通。home.js/category.js/live.js 產生卡片時呼叫
   window.__v2mFav.favToggleHtml() 取得按鈕 markup，實際的點擊切換靠這裡
   掛在 document 的委派事件處理（卡片本身是動態塞入/會整批重繪，委派在
   document 上才不會每次重繪後失效）。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};

  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var FAVORITES_KEY = 'win100-static-favorites';
  function favoriteIds() {
    try {
      var raw = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveFavoriteIds(ids) {
    try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)); } catch (e) { /* ignore */ }
  }
  function isFavorite(id) { return favoriteIds().indexOf(id) !== -1; }
  function toggleFavorite(id) {
    var ids = favoriteIds();
    var idx = ids.indexOf(id);
    if (idx === -1) ids.push(id); else ids.splice(idx, 1);
    saveFavoriteIds(ids);
    return idx === -1; /* true = now favorited */
  }
  function favIdFor(provider, i, kind) {
    if (kind === 'live') {
      var names = D.LIVE_GAME_NAMES || ['Game'];
      return kind + '|' + names[i % names.length];
    }
    return kind + '|' + provider + '|' + i;
  }
  function parseFavId(id) {
    var sep = id.indexOf('|');
    var kind = id.slice(0, sep);
    var rest = id.slice(sep + 1);
    if (kind === 'live') return { kind: kind, provider: '', i: (D.LIVE_GAME_NAMES || []).indexOf(rest) };
    var lastSep = rest.lastIndexOf('|');
    return { kind: kind, provider: rest.slice(0, lastSep), i: parseInt(rest.slice(lastSep + 1), 10) || 0 };
  }

  function heartSvg(active) {
    return '<svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' +
      (active ? 'fill-current' : 'fill-none') + '" aria-hidden="true">' +
      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"></path></svg>';
  }
  function favToggleHtml(id, posClass) {
    var active = isFavorite(id);
    return '<button type="button" class="fav-toggle absolute ' + (posClass || 'right-2 bottom-2') + ' z-10 h-7 w-7 grid place-items-center rounded-full border backdrop-blur-sm transition-colors' +
      (active ? ' border-accent/50 bg-bg/85 text-accent' : ' border-line-hi bg-bg/70 text-text-dim') +
      '" data-fav-id="' + esc(id) + '" aria-pressed="' + active + '" aria-label="' + esc(t('nav.favorites')) + '">' +
      heartSvg(active) + '</button>';
  }

  /* 委派在 document 上（不綁在特定容器），卡片是整批動態重繪，容器綁定
     的事件在重繪後就失效；按鈕包在可點擊的卡片 <a> 裡面，一定要
     stopPropagation + preventDefault，不然點愛心會連帶觸發卡片本身的
     連結跳轉。 */
  function initFavoritesToggle() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.fav-toggle');
      if (!btn) return;
      e.stopPropagation();
      e.preventDefault();
      var id = btn.getAttribute('data-fav-id');
      if (!id) return;
      var active = toggleFavorite(id);
      btn.classList.toggle('border-accent/50', active);
      btn.classList.toggle('bg-bg/85', active);
      btn.classList.toggle('text-accent', active);
      btn.classList.toggle('border-line-hi', !active);
      btn.classList.toggle('bg-bg/70', !active);
      btn.classList.toggle('text-text-dim', !active);
      btn.setAttribute('aria-pressed', String(active));
      var svg = btn.querySelector('svg');
      if (svg) {
        svg.classList.toggle('fill-current', active);
        svg.classList.toggle('fill-none', !active);
      }
      document.dispatchEvent(new CustomEvent('win100-favorite-change', { detail: { id: id, active: active } }));
    });
  }

  document.addEventListener('DOMContentLoaded', initFavoritesToggle);

  window.__v2mFav = {
    favoriteIds: favoriteIds,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    favIdFor: favIdFor,
    parseFavId: parseFavId,
    favToggleHtml: favToggleHtml,
  };
})();
