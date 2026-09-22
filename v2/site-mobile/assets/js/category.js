/* 分類頁（hot-games/slot/fish/mini-games）共用的遊戲網格渲染。讀
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
    slot: D.SLOT_VENDORS,
    fish: D.SLOT_VENDORS,
    'mini-games': D.SLOT_VENDORS,
  };
  var MEDIA_KEY_BY_CATEGORY = { 'hot-games': 'slot', slot: 'slot', fish: 'fish', 'mini-games': 'mini-games' };

  var vendors = VENDOR_BY_CATEGORY[category] || D.SLOT_VENDORS || ['Pragmatic Play'];
  var media = (D.VENDOR_MEDIA && D.VENDOR_MEDIA[MEDIA_KEY_BY_CATEGORY[category]]) || [];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  function cardHTML(i) {
    var m = media[i % media.length] || {};
    var provider = vendors[i % vendors.length];
    return '<a href="#" class="rounded-2xl overflow-hidden bg-bg-card border border-line">' +
      '<div class="aspect-square overflow-hidden bg-bg-elev">' +
        '<img src="' + esc(m.image || '') + '" alt="" class="h-full w-full object-cover" style="object-position:' + esc(m.focalPoint || '50% 50%') + '" loading="lazy">' +
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
    var count = Math.max(vendors.length, media.length * 3, 24);
    var html = '';
    for (var i = 0; i < count; i++) html += cardHTML(i);
    grid.innerHTML = html;
  });
})();
