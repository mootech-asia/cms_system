/* live.html 專用：真人視訊桌用 LIVE_GAME_NAMES（穩定枚舉，比照 site.js
   resolveGameFromCard() 用 `live|<name>` 反查同一款桌的既有慣例），不是
   generic「遊戲名稱」placeholder——真人視訊本來就該掛真的桌名。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};
  var vendors = D.LIVE_VENDORS || ['Evolution Gaming'];
  var names = D.LIVE_GAME_NAMES || ['Live Table'];
  var media = (D.VENDOR_MEDIA && D.VENDOR_MEDIA.live) || [];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function cardHTML(i) {
    var m = media[i % media.length] || {};
    var name = names[i % names.length];
    var provider = vendors[i % vendors.length];
    var players = 40 + ((i * 37) % 260);
    var fav = window.__v2mFav;
    var favId = fav ? fav.favIdFor(provider, i, 'live') : '';
    return '<a href="#" class="rounded-2xl overflow-hidden bg-bg-card border border-line">' +
      '<div class="relative aspect-square overflow-hidden bg-bg-elev">' +
        '<img src="' + esc(m.image || '') + '" alt="" class="h-full w-full object-cover" style="object-position:' + esc(m.focalPoint || '50% 50%') + '" loading="lazy">' +
        '<span class="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">' +
          '<span class="h-1.5 w-1.5 rounded-full" style="background:var(--live-dot)"></span>LIVE</span>' +
        (fav ? fav.favToggleHtml(favId, 'right-2 top-2') : '') +
        '<span class="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">' + players + '</span>' +
      '</div>' +
      '<div class="p-2.5">' +
        '<p class="text-[12.5px] font-bold text-text truncate">' + esc(name) + '</p>' +
        '<p class="text-[10.5px] text-text-dim truncate">' + esc(provider) + '</p>' +
      '</div>' +
    '</a>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('category-grid');
    if (!grid) return;
    var count = Math.max(names.length, 18);
    var html = '';
    for (var i = 0; i < count; i++) html += cardHTML(i);
    grid.innerHTML = html;
  });
})();
