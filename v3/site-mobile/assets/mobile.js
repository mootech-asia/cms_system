/* 手機版首頁分頁區：熱門遊戲/小遊戲/老虎機/真人/捕魚 5 個分頁各自的
   精簡版遊戲 grid。刻意不去改 ../site/assets/js/site.js，所以這裡自己
   組一份跟 gameCardHTML() 同樣結構的 .gcard 卡片（不含收藏愛心）：
   - 圖片路徑不用在這裡另外補前綴——index.html 裡 data.js 載入後那段
     inline script 已經把 CMS_DATA 每一筆 g.image 統一補好 ../site/
     前綴，這裡直接用就是正確路徑（重複補會變成 ../site/../site/...）。
   - resolveGameFromCard() 是用 title/provider/圖檔檔名比對，不看路徑
     前綴，所以開啟遊戲 modal 等既有委派事件不用重寫就能用。
   - 各分頁對應的遊戲清單比照桌機版 CATEGORY_PARAMS 的分類方式
     (Hot Games=slots+live+originals前10、Mini Games=originals、
     Slots=slots、Live=live、Fish 沿用桌機版同樣的 placeholder 用
     slots 頂替——桌機版本來就沒有獨立的 fish 資料來源)。體育不在
     這裡面，維持連到獨立頁面，因為賽事不是遊戲卡片 grid。
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

  var data = window.CMS_DATA;
  var pages = document.querySelectorAll('.m-tabpage');
  if (!data || !pages.length) return;
  var TAB_GAMES = {
    'Hot Games': data.GAMES.slots.concat(data.GAMES.live, data.GAMES.originals).slice(0, 10),
    'Mini Games': data.GAMES.originals,
    'Slots': data.GAMES.slots,
    'Live': data.GAMES.live,
    'Fish': data.GAMES.slots
  };
  Array.prototype.forEach.call(pages, function (page) {
    var games = TAB_GAMES[page.getAttribute('data-tab')];
    var grid = page.querySelector('.grid');
    if (games && grid) grid.innerHTML = games.map(cardHTML).join('');
  });
})();

/* 首頁分頁籤：點圖示切換 .m-tabpanel-scroller 對應分頁，並跟左右滑動
   手勢雙向同步——scroll-snap 讓原生觸控滑動就有分頁吸附效果，這裡只
   負責兩件事：點圖示時捲到對應分頁、滑動停下時回頭同步哪個圖示要顯示
   成 active。 */
(function () {
  var scroller = document.querySelector('.m-tabpanel-scroller');
  var tabBtns = document.querySelectorAll('.m-quicknav-item[data-tab]');
  if (!scroller || !tabBtns.length) return;
  var pages = Array.prototype.slice.call(scroller.querySelectorAll('.m-tabpage'));
  var programmatic = false;
  var programmaticTimer = null;

  function setActive(tabName) {
    Array.prototype.forEach.call(tabBtns, function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
  }

  Array.prototype.forEach.call(tabBtns, function (btn) {
    btn.addEventListener('click', function () {
      var tabName = btn.getAttribute('data-tab');
      var idx = -1;
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].getAttribute('data-tab') === tabName) { idx = i; break; }
      }
      if (idx === -1) return;
      /* 點擊當下到 smooth-scroll 動畫結束這段期間，捲動事件都算程式
         觸發，下面滑動同步那段邏輯要跳過，不然動畫還在跑的中途值會
         回頭把這裡剛設好的 active 蓋掉(連續快速點兩個圖示時尤其明顯，
         active 會停在上一個分頁)。 */
      programmatic = true;
      if (programmaticTimer) clearTimeout(programmaticTimer);
      programmaticTimer = setTimeout(function () { programmatic = false; }, 500);
      scroller.scrollTo({ left: idx * scroller.clientWidth, behavior: 'smooth' });
      setActive(tabName);
    });
  });

  var scrollTimer = null;
  scroller.addEventListener('scroll', function () {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      if (programmatic) return;
      var idx = Math.round(scroller.scrollLeft / scroller.clientWidth);
      var page = pages[idx];
      if (page) setActive(page.getAttribute('data-tab'));
    }, 120);
  }, { passive: true });
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
