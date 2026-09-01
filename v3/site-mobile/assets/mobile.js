/* 手機版大廳的「熱門遊戲」預覽 rail。
   刻意不去改 ../site/assets/js/site.js，所以這裡自己組一份跟
   gameCardHTML() 同樣結構的 .gcard 卡片（不含收藏愛心）：
   - 圖片路徑補上 ../site/ 前綴（CMS_DATA 裡的 image 是相對 site/ 算的）。
   - resolveGameFromCard() 是用 title/provider/圖檔檔名比對，不看路徑
     前綴，所以收藏、開啟遊戲 modal 等既有委派事件不用重寫就能用。
   - 這支 script 放在 body 最後、../site/assets/js/site.js 之後，執行時
     DOM 已經解析完成，同步塞資料即可，不用等 DOMContentLoaded。 */
(function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardHTML(g) {
    var tagHtml = g.tag
      ? '<span class="gcard-tag' + (g.tag === 'Hot' ? ' hot' : '') + (g.tag === 'New' ? ' new' : '') + '">' + esc(g.tag) + '</span>'
      : '';
    var playersHtml = g.category === 'live'
      ? '<div class="gcard-players"><span class="live-dot"></span>' + Number(g.players || 0).toLocaleString() + ' playing</div>'
      : '';
    return '<article class="gcard" style="cursor:pointer">' +
      '<div class="gcard-art">' +
        '<img class="gcard-art-image" src="../site/' + esc(g.image) + '" alt="" loading="lazy" decoding="async">' +
        tagHtml + playersHtml +
      '</div>' +
      '<div class="gcard-meta"><div class="gcard-title">' + esc(g.title) + '</div><div class="gcard-provider">' + esc(g.provider) + '</div></div>' +
    '</article>';
  }

  var rail = document.querySelector('.m-hotgames .rail');
  var data = window.CMS_DATA;
  if (!rail || !data) return;
  var games = data.GAMES.slots.concat(data.GAMES.live, data.GAMES.originals).slice(0, 10);
  rail.innerHTML = games.map(cardHTML).join('');
})();
