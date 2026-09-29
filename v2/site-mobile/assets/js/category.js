/* 分類頁（hot-games/casino/slot/fish/mini-games）共用的遊戲網格渲染。讀
   <body data-category="slot"> 決定要用 WIN100_DATA.VENDOR_MEDIA 的哪個
   key、配哪一份廠商清單；規則對齊 v3/site-mobile mobile.js 同一批分頁
   的既有慣例（Fish/Mini Games 桌機版本來就沒有獨立廠商圖庫，沿用
   slot 那組頂替，不是漏接）。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};
  var category = document.body.getAttribute('data-category');
  if (!category) return;

  var VENDOR_BY_CATEGORY = {
    'hot-games': D.SLOT_VENDORS,
    casino: D.SLOT_VENDORS,
    slot: D.SLOT_VENDORS,
    fish: D.SLOT_VENDORS,
    'mini-games': D.SLOT_VENDORS,
  };
  var MEDIA_KEY_BY_CATEGORY = { 'hot-games': 'slot', casino: 'slot', slot: 'slot', fish: 'fish', 'mini-games': 'mini-games' };

  var vendors = VENDOR_BY_CATEGORY[category] || D.SLOT_VENDORS || ['Pragmatic Play'];
  var media = (D.VENDOR_MEDIA && D.VENDOR_MEDIA[MEDIA_KEY_BY_CATEGORY[category]]) || [];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  function cardHTML(i) {
    var m = media[i % media.length] || {};
    var provider = vendors[i % vendors.length];
    var fav = window.__v2mFav;
    var favId = fav ? fav.favIdFor(provider, i, category) : '';
    return '<a href="#" class="rounded-2xl overflow-hidden bg-bg-card border border-line" data-vendor="' + esc(provider) + '">' +
      '<div class="relative aspect-square overflow-hidden bg-bg-elev">' +
        '<img src="' + esc(m.image || '') + '" alt="" class="h-full w-full object-cover" style="object-position:' + esc(m.focalPoint || '50% 50%') + '" loading="lazy">' +
        (fav ? fav.favToggleHtml(favId, 'right-2 bottom-2') : '') +
      '</div>' +
      '<div class="p-2.5">' +
        '<p class="text-[12.5px] font-bold text-text truncate">' + esc(t('game.placeholder')) + '</p>' +
        '<p class="text-[10.5px] text-text-dim truncate">' + esc(provider) + '</p>' +
      '</div>' +
    '</a>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('category-grid');
    if (!grid) return;
    var withTags = category === 'casino' && window.__v2mVendorTags;
    // 有廠商標籤時每家至少 3 款，單選某廠商時不會只剩一張卡
    var count = Math.max(withTags ? vendors.length * 3 : vendors.length, media.length * 3, 24);
    var html = '';
    for (var i = 0; i < count; i++) html += cardHTML(i);
    grid.innerHTML = html;
    if (withTags) window.__v2mVendorTags(grid, vendors);
  });
})();
