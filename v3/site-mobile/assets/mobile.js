/* 手機版大廳的「熱門遊戲」預覽 rail。
   刻意不去改 ../site/assets/js/site.js，所以這裡自己組一份跟
   gameCardHTML() 同樣結構的 .gcard 卡片（不含收藏愛心）：
   - 圖片路徑不用在這裡另外補前綴——index.html 裡 data.js 載入後那段
     inline script 已經把 CMS_DATA 每一筆 g.image 統一補好 ../site/
     前綴，這裡直接用就是正確路徑（重複補會變成 ../site/../site/...）。
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
        '<img class="gcard-art-image" src="' + esc(g.image) + '" alt="" loading="lazy" decoding="async">' +
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

/* 補救 site.js 內部（例如促銷卡 PROMO_ART 那組 4 張圖）直接把裸路徑
   assets/mock/... 組進 inline style="background-image:url(...)" 的
   地方——這些字串是 site.js 內部組出來的，不是走 CMS_DATA，前面那段
   patch CMS_DATA.image 的 script 補不到。這裡改成通用做法：不管是
   page load 當下就在 DOM 上的，還是之後(cat-tabs 切換等)才動態塞進來
   的，只要 style 屬性裡出現沒補過前綴的 assets/ 路徑就補上 ../site/，
   不用逐一去 site.js 裡面找是哪一段程式碼組的字串。 */
(function () {
  function fixOne(el) {
    var raw = el.getAttribute && el.getAttribute('style');
    if (!raw) return;
    var fixed = raw.replace(/url\((["']?)assets\//g, 'url($1../site/assets/');
    if (fixed !== raw) el.setAttribute('style', fixed);
  }
  function fixIn(root) {
    fixOne(root);
    var els = root.querySelectorAll ? root.querySelectorAll('[style*="assets/"]') : [];
    Array.prototype.forEach.call(els, fixOne);
  }
  fixIn(document);
  if (window.MutationObserver) {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, function (node) {
          if (node.nodeType === 1) fixIn(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
