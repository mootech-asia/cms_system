/* favorites.html 專用：讀 window.__v2mFav 收藏清單，依 kind 重建卡片
   （grid 版式跟 category.js/live.js 一致），provider/media 一律回頭查
   WIN100_DATA 既有資料，不重複維護一份。收藏清單跨頁共用同一把
   localStorage，這裡收到 favorites.js 的 win100-favorite-change 事件
   就整批重繪，取消收藏的卡片立刻從清單消失。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};
  var LIVE_VENDORS = D.LIVE_VENDORS || ['Evolution Gaming'];
  var LIVE_GAME_NAMES = D.LIVE_GAME_NAMES || ['Live Table'];
  var MEDIA = D.VENDOR_MEDIA || {};
  var MEDIA_KEY_BY_KIND = { 'hot-games': 'slot', slot: 'slot', fish: 'fish', 'mini-games': 'mini-games', live: 'live' };
  var HREF_BY_KIND = { 'hot-games': 'hot-games.html', slot: 'slot.html', fish: 'fish.html', 'mini-games': 'mini-games.html', live: 'live.html' };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  function cardHTML(kind, provider, i) {
    var mediaList = MEDIA[MEDIA_KEY_BY_KIND[kind]] || MEDIA.slot || [];
    var m = mediaList[i % mediaList.length] || {};
    var isLive = kind === 'live';
    var name = isLive ? LIVE_GAME_NAMES[i % LIVE_GAME_NAMES.length] : t('game.placeholder');
    var vendorName = isLive ? LIVE_VENDORS[i % LIVE_VENDORS.length] : provider;
    var favId = window.__v2mFav.favIdFor(vendorName, i, kind);
    return '<a href="' + (HREF_BY_KIND[kind] || 'hot-games.html') + '" class="rounded-2xl overflow-hidden bg-bg-card border border-line">' +
      '<div class="relative aspect-square overflow-hidden bg-bg-elev">' +
        '<img src="' + esc(m.image || '') + '" alt="" class="h-full w-full object-cover" style="object-position:' + esc(m.focalPoint || '50% 50%') + '" loading="lazy">' +
        (isLive
          ? '<span class="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">' +
            '<span class="h-1.5 w-1.5 rounded-full" style="background:var(--live-dot)"></span>LIVE</span>'
          : '') +
        window.__v2mFav.favToggleHtml(favId, isLive ? 'right-2 top-2' : 'right-2 bottom-2') +
      '</div>' +
      '<div class="p-2.5">' +
        '<p class="text-[12.5px] font-bold text-text truncate">' + esc(name) + '</p>' +
        '<p class="text-[10.5px] text-text-dim truncate">' + esc(vendorName) + '</p>' +
      '</div>' +
    '</a>';
  }

  function render() {
    var grid = document.getElementById('favorites-grid');
    var empty = document.getElementById('favorites-empty');
    var fav = window.__v2mFav;
    if (!grid || !fav) return;
    var list = fav.favoriteIds().map(fav.parseFavId).filter(function (p) { return p.kind !== 'live' || p.i !== -1; });
    if (!list.length) {
      grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    grid.innerHTML = list.map(function (p) { return cardHTML(p.kind, p.provider, p.i); }).join('');
  }

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('win100-favorite-change', render);
})();
