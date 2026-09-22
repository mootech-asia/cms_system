/* sport.html 專用：讀 WIN100_DATA.SPORT_MATCHES 渲染賽事卡（跟桌機版
   v2/site/sport.html 同一份資料來源，只換卡片版面成手機單欄）。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};
  var matches = D.SPORT_MATCHES || [];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function cardHTML(m) {
    return '<div class="rounded-2xl border border-line bg-bg-card p-4">' +
      '<div class="flex items-center justify-between mb-3">' +
        '<span class="text-[11.5px] font-semibold text-text-dim">' + esc(m.league) + '</span>' +
        '<span class="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold" style="color:var(--live-dot)">' +
          '<span class="h-1.5 w-1.5 rounded-full" style="background:var(--live-dot)"></span>LIVE</span>' +
      '</div>' +
      '<div class="flex items-center justify-between gap-2">' +
        '<div class="flex flex-col items-center gap-1.5 w-20">' +
          '<span class="h-9 w-9 grid place-items-center rounded-full bg-bg-elev text-[11px] font-bold text-text">' + esc(m.home.abbr) + '</span>' +
          '<span class="text-[11px] font-semibold text-text-mid text-center truncate w-full">' + esc(m.home.name) + '</span>' +
        '</div>' +
        '<div class="flex flex-col items-center">' +
          '<span class="text-[20px] font-extrabold text-text">' + esc(m.score) + '</span>' +
          '<span class="text-[10.5px] text-text-dim">' + esc(m.time) + '</span>' +
        '</div>' +
        '<div class="flex flex-col items-center gap-1.5 w-20">' +
          '<span class="h-9 w-9 grid place-items-center rounded-full bg-bg-elev text-[11px] font-bold text-text">' + esc(m.away.abbr) + '</span>' +
          '<span class="text-[11px] font-semibold text-text-mid text-center truncate w-full">' + esc(m.away.name) + '</span>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="mt-3 w-full h-10 rounded-xl bg-accent text-text-on-accent text-[13px] font-bold">Place Bet</button>' +
    '</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.getElementById('sport-match-list');
    if (!list) return;
    list.innerHTML = matches.map(cardHTML).join('');
  });
})();
