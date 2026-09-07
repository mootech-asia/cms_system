/* 手機版首頁分頁區：熱門遊戲/小遊戲/老虎機/真人/捕魚 5 個分頁各自的
   精簡版遊戲 grid。刻意不去改 ../site/assets/js/site.js，所以這裡自己
   組一份跟 gameCardHTML() 同樣結構的 .gcard 卡片（含收藏愛心，點擊交由
   site.js 既有的 .gcard-fav 全域委派處理，見下方 gcardHeartSvg 註解）：
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

  /* 讀取跟桌機版(site.js useFavorites)同一把 lobby_favs_v1 key——這裡
     只讀不寫，這個精簡卡片本身不含收藏愛心，"Favorite" 這個 tag 純粹
     篩選出使用者在其他頁面(如 slots.html 的 .gcard-fav)已收藏、且剛好
     也出現在本分頁清單裡的遊戲。 */
  var FAV_KEY = 'lobby_favs_v1';
  var favIds = (function () {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
    catch (e) { return new Set(); }
  })();
  var HEART_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path ' +
    'd="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.3 1-1a5.5 5.5 0 0 0 0-7.8Z" ' +
    'fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* 收藏愛心的 on/off 兩態，跟 site.js gcardHeartSvg() 同一份 path data。
     這裡只負責初始渲染狀態；點擊後的切換交給 site.js 既有的全域委派
     （.gcard-fav 這個 class 名稱一樣，site.js 的 onDocumentClick 認得
     出來，不用在這裡另外綁 click/寫 toggleFav，兩邊共用同一把
     lobby_favs_v1，resolveGameFromCard() 靠 title/provider/圖檔名比對
     也能認出這是同一款遊戲）。 */
  function gcardHeartSvg(isFav) {
    return '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path ' +
      'd="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.3 1-1a5.5 5.5 0 0 0 0-7.8Z" ' +
      'fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function cardHTML(g) {
    var tagHtml = g.tag
      ? '<span class="gcard-tag' + (g.tag === 'Hot' ? ' hot' : '') + (g.tag === 'New' ? ' new' : '') + '">' + esc(g.tag) + '</span>'
      : '';
    var playersHtml = g.category === 'live'
      ? '<div class="gcard-players"><span class="live-dot"></span>' + Number(g.players || 0).toLocaleString() + ' playing</div>'
      : '';
    var fav = favIds.has(g.id);
    var favHtml = '<button type="button" class="gcard-fav' + (fav ? ' on' : '') + '" aria-label="' + (fav ? 'Remove favorite' : 'Add favorite') + '">' + gcardHeartSvg(fav) + '</button>';
    return '<article class="gcard" data-provider="' + esc(g.provider) + '" data-gid="' + esc(g.id) + '" style="cursor:pointer">' +
      '<div class="gcard-art">' +
        '<img class="gcard-art-image" src="' + esc(g.image) + '" alt="" loading="lazy" decoding="async">' +
        tagHtml + favHtml + playersHtml +
      '</div>' +
      '<div class="gcard-meta"><div class="gcard-title">' + esc(g.title) + '</div><div class="gcard-provider">' + esc(g.provider) + '</div></div>' +
    '</article>';
  }

  /* 廠商篩選頁籤：每個分頁各自依實際出現的廠商動態產生(不是列出全部
     PROVIDERS，只列這個分頁遊戲清單裡真的有出現的那幾家)，插在該分頁
     .grid 前面。"All" 之後加一個 "Favorite" tag(比照桌機版 .cv-tab 的
     Favorites 頁籤，heart icon + 數量)，點擊只是篩選同一個 .grid 內
     已經渲染好的卡片顯示/隱藏(data-provider／data-gid 比對)，不用重新
     渲染或重打 API。 */
  function providerFilterHTML(games) {
    var seen = {};
    var providers = [];
    var favCount = 0;
    games.forEach(function (g) {
      if (!seen[g.provider]) { seen[g.provider] = true; providers.push(g.provider); }
      if (favIds.has(g.id)) favCount++;
    });
    var favChip = '<button type="button" class="m-provider-chip m-provider-chip-fav" data-provider="favorite">' +
      HEART_SVG + 'Favorite' + (favCount > 0 ? '<span class="m-provider-chip-count">' + favCount + '</span>' : '') + '</button>';
    var chips = '<button type="button" class="m-provider-chip active" data-provider="all">All</button>' + favChip +
      providers.map(function (p) {
        return '<button type="button" class="m-provider-chip" data-provider="' + esc(p) + '">' + esc(p) + '</button>';
      }).join('');
    return '<div class="m-provider-filter" role="tablist">' + chips + '</div>';
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
    if (!games || !grid) return;
    grid.insertAdjacentHTML('beforebegin', providerFilterHTML(games));
    grid.innerHTML = games.map(cardHTML).join('');
  });

  document.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.m-provider-chip') : null;
    if (!chip) return;
    var bar = chip.parentElement;
    var grid = bar.nextElementSibling;
    if (!grid || !grid.classList.contains('grid')) return;
    Array.prototype.forEach.call(bar.querySelectorAll('.m-provider-chip'), function (b) {
      b.classList.toggle('active', b === chip);
    });
    var provider = chip.getAttribute('data-provider');
    Array.prototype.forEach.call(grid.querySelectorAll('.gcard'), function (card) {
      var show = provider === 'all' ? true
        : provider === 'favorite' ? favIds.has(card.getAttribute('data-gid'))
        : card.getAttribute('data-provider') === provider;
      card.style.display = show ? '' : 'none';
    });
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
