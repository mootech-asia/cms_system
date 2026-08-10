// CMS_前台_v4 — 純靜態站 vanilla JS 行為層（無框架、無 build）。
(function () {
  'use strict';

  function safe(fn) { try { fn(); } catch (e) { /* 避免單一功能失敗拖垮整頁 */ } }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  /* studio（設計後台）套用首頁區塊顯示/站點名稱/skin：與 studio.js 共用同一把
     localStorage key,同源即可跨資料夾（../site/、../studio/）讀取,不受路徑影響。
     每個 applyStudioXxx 拆成「核心套用函式（接參數，可重複呼叫）」與「讀
     localStorage 的載入包裝」，讓 studio 開著 iframe 即時操作時可直接呼叫
     window.__cmsV4StudioApply 核心函式立即反映，不必等按下「套用到本站」、
     也不必整頁重整。 */
  var ORIGINAL_TITLE = document.title;
  var STUDIO_SECTIONS_KEY = 'cms-v4-studio-sections';
  var STUDIO_SITENAME_KEY = 'cms-v4-studio-sitename';
  var STUDIO_SKIN_KEY = 'cms-v4-studio-skin';
  var STUDIO_LAYOUT_KEY = 'cms-v4-studio-layout';

  function applySections(map) {
    Array.prototype.slice.call(document.querySelectorAll('[data-section]')).forEach(function (el) {
      var name = el.getAttribute('data-section');
      el.style.display = (map && map[name] === false) ? 'none' : '';
    });
  }
  function applySiteName(name) {
    document.title = name ? ORIGINAL_TITLE.replace(/^CMS_前台_v4/, name) : ORIGINAL_TITLE;
  }
  function applySkin(skinId) {
    document.documentElement.setAttribute('data-skin', skinId || 'festive-red-gold');
  }
  /* 首頁 12 欄版位:layout 是 [{key,span}] 陣列,依陣列順序把對應
     [data-section] 元素依序 appendChild 回 .grid12(對已存在文件中的節點
     appendChild 等同於搬移到新位置,藉此同時做到「重新排序」),並更新
     data-span 決定跨欄數。跟 studio 的拖曳排序／寬度選單共用這份格式。 */
  function applyLayout(layout) {
    var grid = document.querySelector('.grid12');
    if (!grid || !Array.isArray(layout)) return;
    layout.forEach(function (item) {
      var el = grid.querySelector('[data-section="' + item.key + '"]');
      if (!el) return;
      el.setAttribute('data-span', item.span || 3);
      grid.appendChild(el);
    });
  }

  function applyStudioSections() {
    var raw;
    try { raw = JSON.parse(localStorage.getItem(STUDIO_SECTIONS_KEY)); } catch (e) { raw = null; }
    if (raw) applySections(raw);
  }
  function applyStudioSiteName() {
    var name;
    try { name = localStorage.getItem(STUDIO_SITENAME_KEY); } catch (e) { name = null; }
    if (name) applySiteName(name);
  }
  function applyStudioSkin() {
    var id;
    try { id = localStorage.getItem(STUDIO_SKIN_KEY); } catch (e) { id = null; }
    if (id) applySkin(id);
  }
  function applyStudioLayout() {
    var raw;
    try { raw = JSON.parse(localStorage.getItem(STUDIO_LAYOUT_KEY)); } catch (e) { raw = null; }
    if (raw) applyLayout(raw);
  }

  /* 12 欄版位的「直接在預覽畫面拖曳排序」:只有 studio 呼叫過
     __cmsV4StudioSetEditMode(true) 才會啟用,一般訪客直接開 index.html
     不會出現任何拖曳 UI／行為。每個模組左上角疊一個把手,只有從把手
     mousedown 才把該模組設成 draggable,放開/拖曳結束都還原,避免拖到
     模組內部的按鈕、輪播箭頭等既有互動。drop 完成後直接在 iframe 內
     appendChild 重新排序(同 applyLayout 的做法),再把最新順序透過
     postMessage 回報給同源的 studio 父頁,讓左側清單／localStorage 保持
     同步。 */
  var gridEditModeOn = false;
  function currentGridLayout() {
    var grid = document.querySelector('.grid12');
    if (!grid) return [];
    return Array.prototype.slice.call(grid.querySelectorAll('[data-section]')).map(function (el) {
      return { key: el.getAttribute('data-section'), span: Number(el.getAttribute('data-span')) || 3 };
    });
  }
  function notifyStudioReorder() {
    try { window.parent.postMessage({ type: 'cms-v4-studio-reorder', layout: currentGridLayout() }, location.origin); } catch (e) {}
  }
  function initGrid12DragEdit() {
    var grid = document.querySelector('.grid12');
    if (!grid) return;
    var dragEl = null;
    Array.prototype.slice.call(grid.querySelectorAll('[data-section]')).forEach(function (el) {
      if (el.querySelector('.grid12-drag-handle')) return; // 重複呼叫時不要疊加把手
      var handle = document.createElement('span');
      handle.className = 'grid12-drag-handle';
      handle.setAttribute('aria-hidden', 'true');
      handle.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>';
      el.style.position = el.style.position || 'relative';
      el.appendChild(handle);
      on(handle, 'mousedown', function () { el.setAttribute('draggable', 'true'); });
      on(el, 'dragstart', function (e) {
        dragEl = el;
        el.classList.add('grid12-dragging');
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });
      on(el, 'dragend', function () {
        el.classList.remove('grid12-dragging');
        el.removeAttribute('draggable');
        dragEl = null;
        Array.prototype.slice.call(grid.querySelectorAll('[data-section]')).forEach(function (o) { o.classList.remove('grid12-drop-target'); });
      });
      on(el, 'dragover', function (e) { e.preventDefault(); if (dragEl && dragEl !== el) el.classList.add('grid12-drop-target'); });
      on(el, 'dragleave', function () { el.classList.remove('grid12-drop-target'); });
      on(el, 'drop', function (e) {
        e.preventDefault();
        el.classList.remove('grid12-drop-target');
        if (!dragEl || dragEl === el) return;
        grid.insertBefore(dragEl, el);
        notifyStudioReorder();
      });
    });
  }
  window.__cmsV4StudioSetEditMode = function (on) {
    gridEditModeOn = !!on;
    document.documentElement.classList.toggle('cms-v4-grid-edit', gridEditModeOn);
    if (gridEditModeOn) safe(initGrid12DragEdit);
  };

  /* studio 父頁（同源）在 iframe load 後或任何控制項變動時直接呼叫這個函式，
     即時把草稿反映到畫面上，不經過 localStorage、不需重整。 */
  window.__cmsV4StudioApply = function (draft) {
    if (!draft) return;
    if (draft.sections) applySections(draft.sections);
    if ('sitename' in draft) applySiteName(draft.sitename);
    if (draft.skin) applySkin(draft.skin);
    if (draft.layout) applyLayout(draft.layout);
    if (gridEditModeOn) safe(initGrid12DragEdit); // layout 套用後可能重新排過 DOM,把手要重新確保存在
  };

  function initHero() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var len = slides.length;
    if (!len) return;
    var idx = 0;
    var timer = null;

    function apply() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    function resetAuto() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { idx = (idx + 1) % len; apply(); }, 6000);
    }
    function goTo(i) { idx = i; apply(); resetAuto(); }

    var prevBtn = hero.querySelector('.hero-arrow.prev');
    var nextBtn = hero.querySelector('.hero-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo((idx - 1 + len) % len); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo((idx + 1) % len); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    resetAuto();
  }

  function initFeatureCarousel() {
    var carousel = document.getElementById('featureCarousel');
    if (!carousel) return;
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.feature-card'));
    var len = slides.length;
    if (!len) return;
    var idx = 0;
    setInterval(function () {
      idx = (idx + 1) % len;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
    }, 5000);
  }

  function initVendorSelect() {
    var rails = Array.prototype.slice.call(document.querySelectorAll('.vendor-rail'));
    rails.forEach(function (rail) {
      var card = rail.closest('.feature-card');
      var bg = card ? card.querySelector('.feature-card-bg') : null;
      var chips = Array.prototype.slice.call(rail.querySelectorAll('.feature-vendor-chip'));
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
          if (bg && chip.dataset.bg) bg.style.backgroundImage = 'url(' + chip.dataset.bg + ')';
        });
      });
    });
  }

  function initRails() {
    var rails = Array.prototype.slice.call(document.querySelectorAll('.tile-grid.rail'));
    rails.forEach(function (rail) {
      var panel = rail.closest('.panel');
      var prevBtn = panel ? panel.querySelector('.rail-arrow-prev') : null;
      var nextBtn = panel ? panel.querySelector('.rail-arrow-next') : null;

      function updateArrows() {
        var maxScroll = rail.scrollWidth - rail.clientWidth;
        if (prevBtn) prevBtn.disabled = rail.scrollLeft <= 4;
        if (nextBtn) nextBtn.disabled = maxScroll <= 4 || rail.scrollLeft >= maxScroll - 4;
      }
      if (prevBtn) prevBtn.addEventListener('click', function () { rail.scrollBy({ left: -rail.clientWidth * 0.9, behavior: 'smooth' }); });
      if (nextBtn) nextBtn.addEventListener('click', function () { rail.scrollBy({ left: rail.clientWidth * 0.9, behavior: 'smooth' }); });
      rail.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      updateArrows();

      // 滑鼠可直接按住拖曳橫向捲動（觸控裝置原生滑動已可用，這裡補上桌機滑鼠操作）。
      var dragging = false;
      var startX = 0;
      var startScroll = 0;
      rail.addEventListener('mousedown', function (e) {
        dragging = true;
        rail.classList.add('dragging');
        startX = e.pageX;
        startScroll = rail.scrollLeft;
      });
      window.addEventListener('mouseup', function () {
        if (!dragging) return;
        dragging = false;
        rail.classList.remove('dragging');
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        e.preventDefault();
        rail.scrollLeft = startScroll - (e.pageX - startX);
      });
    });
  }

  /* 收藏：以 localStorage 保存，事件代理掛在 document 上,
     讓 tab 切換重繪卡片後仍然有效。 */
  var FAV_KEY = 'cms-v4-favorites';
  function favIds() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; }
  }
  function saveFavIds(ids) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); } catch (e) {}
  }
  function initFavorites() {
    var ids = favIds();
    Array.prototype.slice.call(document.querySelectorAll('.game-tile-fav')).forEach(function (btn) {
      var on = ids.indexOf(btn.getAttribute('data-fav-id')) !== -1;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.game-tile-fav');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var id = btn.getAttribute('data-fav-id');
      if (!id) return;
      var list = favIds();
      var idx = list.indexOf(id);
      if (idx === -1) list.push(id); else list.splice(idx, 1);
      saveFavIds(list);
      btn.classList.toggle('is-active', idx === -1);
      btn.setAttribute('aria-pressed', String(idx === -1));
      applyListingTab();
    });
  }

  /* 分類頁「廠商 / 收藏」頁簽：收藏頁只顯示已收藏的卡片。 */
  function applyListingTab() {
    var grid = document.getElementById('listingGrid');
    if (!grid) return;
    var active = document.querySelector('.listing-tab.active');
    var mode = active ? active.getAttribute('data-listing-tab') : 'all';
    var ids = favIds();
    var shown = 0;
    Array.prototype.slice.call(grid.querySelectorAll('.game-tile')).forEach(function (tile) {
      var btn = tile.querySelector('.game-tile-fav');
      var id = btn ? btn.getAttribute('data-fav-id') : '';
      var show = mode !== 'fav' || ids.indexOf(id) !== -1;
      tile.hidden = !show;
      if (show) shown++;
    });
    var empty = document.getElementById('listingEmpty');
    if (empty) empty.hidden = shown !== 0;
  }
  function initListingTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.listing-tab'));
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        applyListingTab();
      });
    });
    applyListingTab();
  }

  /* 分類頁搜尋：即時過濾卡片名稱（前台靜態站無後端,純前端比對）。 */
  function initListingSearch() {
    var wrap = document.querySelector('.listing-search');
    var grid = document.getElementById('listingGrid');
    if (!wrap || !grid) return;
    var input = wrap.querySelector('input');
    var btn = wrap.querySelector('button');
    function run() {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      /* .game-tile 用卡片名稱比對;.match-card（體育賽事）沒有單一名稱欄位,
         改比對 data-search（聯賽+雙方隊伍）。 */
      Array.prototype.slice.call(grid.querySelectorAll('.game-tile, .match-card')).forEach(function (card) {
        var name = card.classList.contains('match-card')
          ? (card.getAttribute('data-search') || '')
          : ((card.querySelector('.game-tile-name') || {}).textContent || '');
        var show = !q || name.toLowerCase().indexOf(q) !== -1;
        card.hidden = !show;
        if (show) shown++;
      });
      var empty = document.getElementById('listingEmpty');
      if (empty) empty.hidden = shown !== 0;
    }
    input.addEventListener('input', run);
    if (btn) btn.addEventListener('click', run);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
  }

  /* ── 登入機制:前端模擬,無真實後端驗證 ──
     登入狀態存 localStorage（同源跨頁、跨 ../site/ ../studio/ 資料夾共用），
     任何非空用戶名即視為登入成功。header-auth 依狀態動態渲染,取代原本
     「首頁固定訪客態、會員頁固定登入態」的寫死版面;會員限定頁在未登入
     時直接導回首頁。 */
  var AUTH_KEY = 'cms-v4-auth';
  var DEFAULT_BALANCE = '₩1,000,000,000';
  var MEMBER_PAGES = ['account.html', 'deposit.html', 'withdrawal.html', 'betting-record.html',
    'deposit-record.html', 'withdrawal-record.html', 'account-record.html', 'profit-loss.html',
    'personal-info.html', 'security.html', 'change-password.html'];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; });
  }
  function currentPage() { return location.pathname.split('/').pop() || 'index.html'; }
  /* i18n.js 需在 site.js 之前載入,見各頁 <head>；tr() 只是薄包裝,
     萬一漏載入也不會整頁壞掉,退回原始中文。 */
  function tr(key, fallback) { return window.CMS_I18N ? window.CMS_I18N.t(key) : fallback; }
  function loadAuth() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch (e) { return null; }
  }
  function saveAuth(user) {
    try { if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user)); else localStorage.removeItem(AUTH_KEY); } catch (e) {}
  }
  function isLoggedIn() { return !!loadAuth(); }

  function guestAuthHtml() {
    return '<button type="button" class="btn-gold quiet" data-auth-open="register">' + tr('auth.registerNow', '立即註冊') + '</button>' +
      '<input class="header-input" type="text" placeholder="' + tr('auth.usernamePlaceholder', '用戶名') + '" data-auth-username />' +
      '<input class="header-input" type="password" placeholder="' + tr('auth.passwordPlaceholder', '密碼') + '" data-auth-password />' +
      '<span class="header-forgot">' + tr('auth.forgot', '忘記密碼') + '</span>' +
      '<button type="button" class="btn-gold" data-auth-open="login">' + tr('auth.login', '登錄') + '</button>';
  }
  function memberAuthHtml(user) {
    return '<a href="account.html" class="header-nav-link" style="gap:8px">' + USER_ICON + escapeHtml(user.name) + '</a>' +
      '<span class="header-forgot">' + tr('auth.balancePrefix', '餘額：') + escapeHtml(user.balance) + '</span>' +
      '<button type="button" class="btn-gold quiet" data-logout>' + tr('auth.logout', '登出') + '</button>';
  }
  /* 依登入狀態重繪 header-auth,取代原本每頁寫死的訪客/會員版面。
     訪客態的「登錄」直接讀 header 上的用戶名輸入框,有填就直接登入,
     沒填才開登入彈窗（與立即註冊一致，皆為彈窗）。 */
  function renderHeaderAuth() {
    var bar = document.querySelector('.header-auth');
    if (!bar) return;
    var user = loadAuth();
    bar.innerHTML = user ? memberAuthHtml(user) : guestAuthHtml();
    if (!user) {
      var loginBtn = bar.querySelector('[data-auth-open="login"]');
      var usernameInput = bar.querySelector('[data-auth-username]');
      on(loginBtn, 'click', function () {
        var name = (usernameInput && usernameInput.value || '').trim();
        if (name) doLogin(name); else openAuthModal('login');
      });
      on(bar.querySelector('[data-auth-open="register"]'), 'click', function () { openAuthModal('register'); });
    }
  }
  // header-auth 是常駐可見的動態區塊,換語系時要立即重繪；其餘彈窗/選單
  // 本來就是每次開啟才重新產生 HTML,下次開啟自然是當前語系,不需另外處理。
  on(document, 'cms-v4:locale-changed', function () { renderHeaderAuth(); });
  function doLogin(name) {
    saveAuth({ name: name || '會員', balance: DEFAULT_BALANCE });
    renderHeaderAuth();
  }
  function doLogout() {
    saveAuth(null);
    if (MEMBER_PAGES.indexOf(currentPage()) !== -1) { location.href = 'index.html'; return; }
    renderHeaderAuth();
  }
  /* 會員限定頁在未登入時直接導回首頁;訪客可瀏覽的頁面不受影響。
     在 studio 的 iframe 預覽中略過此導向,否則設計後台無法預覽會員頁。 */
  function initAuthGuard() {
    if (window !== window.top) return;
    if (MEMBER_PAGES.indexOf(currentPage()) !== -1 && !isLoggedIn()) location.href = 'index.html';
  }
  /* 登出按鈕散落在會員頁 header／安全中心／手機選單,事件代理掛在
     document,手機選單是點擊 hamburger 後才動態插入 DOM,逐一綁定會
     抓不到後來才出現的登出按鈕。 */
  function initMemberLogout() {
    on(document, 'click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-logout]');
      if (!btn) return;
      doLogout();
    });
  }

  /* 全螢幕/遮罩型 overlay 開啟時鎖住背景捲動。計數器管理,避免多個
     overlay 疊開時互相解鎖;實際捲動的是 document.scrollingElement(=<html>),
     只鎖 body 蓋不住。 */
  var scrollLockCount = 0;
  function lockScroll() {
    if (scrollLockCount === 0) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    scrollLockCount++;
  }
  function unlockScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }

  var USER_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  /* ── 手機版全螢幕選單:header 漢堡鍵跟底部 tabbar「選單」鍵是兩個各自
     獨立目的的選單,不是同一顆——漢堡鍵開的是主要遊戲分類導覽（複製桌面
     .header-nav,避免另外維護一份重複資料）；tabbar「選單」開的是「我的
     帳戶」會員專區捷徑清單,icon 沿用 .member-sidebar-link／FAQ 連結既有
     的 svg path。兩者共用同一套 overlay/footer 渲染邏輯,只有 nav 清單
     內容不同。 ── */
  var MEMBER_MENU_ITEMS = [
    { href: 'account.html', label: '帳戶總覽', icon: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>' },
    { href: 'betting-record.html', label: '投注紀錄', icon: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>' },
    { href: 'deposit-record.html', label: '儲值紀錄', icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>' },
    { href: 'profit-loss.html', label: '損益報表', icon: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>' },
    { href: 'withdrawal-record.html', label: '提款紀錄', icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>' },
    { href: 'account-record.html', label: '帳戶紀錄', icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>' },
    { href: 'personal-info.html', label: '個人資料', icon: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { href: 'security.html', label: '安全中心', icon: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>' },
    { href: 'about.html?tab=faq', label: '常見問題', icon: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8"/><path d="M12 17h.01"/>' },
  ];
  var mobileMenuRoot = null;
  function closeMobileMenu() { if (mobileMenuRoot) { mobileMenuRoot.remove(); mobileMenuRoot = null; unlockScroll(); } }
  function openMobileOverlay(navHtml) {
    closeMobileMenu();
    var mobileUser = loadAuth();
    var footHtml = mobileUser
      ? '<div class="mobile-menu-account">' + USER_ICON + '<span>' + escapeHtml(mobileUser.name) + '・' + tr('auth.balancePrefix', '餘額：') + escapeHtml(mobileUser.balance) + '</span></div>' +
        '<button type="button" class="btn-gold quiet" style="width:100%" data-logout>' + tr('auth.logout', '登出') + '</button>'
      : '<button type="button" class="btn-gold quiet" style="width:100%;margin-bottom:8px" data-mobile-login>' + tr('auth.login', '登錄') + '</button>' +
        '<button type="button" class="btn-gold" style="width:100%" data-mobile-register>' + tr('auth.registerNow', '立即註冊') + '</button>';
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="mobile-menu-overlay" data-mobile-overlay>' +
      '<div class="mobile-menu-panel">' +
      '<div class="mobile-menu-head"><img src="logo.png" alt="Bet100" class="mobile-menu-logo">' +
      '<button type="button" class="mobile-menu-close" aria-label="關閉選單" data-mobile-close><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<nav class="mobile-menu-nav">' + navHtml + '</nav>' +
      '<div class="mobile-menu-foot">' + footHtml + '</div>' +
      '</div></div>';
    mobileMenuRoot = wrap.firstElementChild;
    document.body.appendChild(mobileMenuRoot);
    lockScroll();
    on(mobileMenuRoot, 'click', function (e) { if (e.target === mobileMenuRoot) closeMobileMenu(); });
    on(mobileMenuRoot.querySelector('[data-mobile-close]'), 'click', closeMobileMenu);
    var loginBtn = mobileMenuRoot.querySelector('[data-mobile-login]');
    var registerBtn = mobileMenuRoot.querySelector('[data-mobile-register]');
    if (loginBtn) on(loginBtn, 'click', function () { closeMobileMenu(); openAuthModal('login'); });
    if (registerBtn) on(registerBtn, 'click', function () { closeMobileMenu(); openAuthModal('register'); });
  }
  function openHeaderMenu() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.header-nav .header-nav-link'));
    var navHtml = navLinks.map(function (a) {
      return '<a href="' + a.getAttribute('href') + '" class="mobile-menu-link' + (a.classList.contains('active') ? ' active' : '') + '">' + a.innerHTML + '</a>';
    }).join('');
    openMobileOverlay(navHtml);
  }
  function openMemberMenu() {
    var page = currentPage();
    var navHtml = '<div class="mobile-menu-section">我的帳戶</div>' +
      MEMBER_MENU_ITEMS.map(function (item) {
        var active = item.href.split('?')[0] === page;
        return '<a href="' + item.href + '" class="mobile-menu-link' + (active ? ' active' : '') + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + item.icon + '</svg><span>' + item.label + '</span></a>';
      }).join('');
    openMobileOverlay(navHtml);
  }
  function initHeaderMobileMenu() {
    on(document.querySelector('.header-menu-trigger'), 'click', openHeaderMenu);
    Array.prototype.slice.call(document.querySelectorAll('.mobile-tabbar-menu')).forEach(function (btn) {
      on(btn, 'click', openMemberMenu);
    });
  }

  /* ── 登入／註冊彈窗:前端模擬,不檢查密碼是否正確,送出即視為登入成功
     （與 header 上的即時登入共用 doLogin）。 ── */
  var authModalRoot = null;
  function closeAuthModal() { if (authModalRoot) { authModalRoot.remove(); authModalRoot = null; unlockScroll(); } }
  function authModalBodyHtml(mode) {
    var isRegister = mode === 'register';
    return (
      '<div class="auth-modal-tabs">' +
      '<button type="button" class="auth-modal-tab' + (isRegister ? '' : ' active') + '" data-auth-switch="login">' + tr('auth.login', '登錄') + '</button>' +
      '<button type="button" class="auth-modal-tab' + (isRegister ? ' active' : '') + '" data-auth-switch="register">' + tr('auth.register', '註冊') + '</button>' +
      '</div>' +
      '<div class="form-field"><label class="form-label">' + tr('auth.usernameLabel', '用戶名') + '</label><input type="text" class="form-input" placeholder="' + tr('auth.usernameInputPlaceholder', '請輸入用戶名') + '" data-auth-username></div>' +
      '<div class="form-field"><label class="form-label">' + tr('auth.passwordLabel', '密碼') + '</label><input type="password" class="form-input" placeholder="' + tr('auth.passwordInputPlaceholder', '請輸入密碼') + '"></div>' +
      (isRegister ? '<div class="form-field"><label class="form-label">' + tr('auth.confirmPasswordLabel', '確認密碼') + '</label><input type="password" class="form-input" placeholder="' + tr('auth.confirmPasswordPlaceholder', '請再次輸入密碼') + '"></div>' : '') +
      '<a href="#" class="btn-gold auth-modal-submit" data-auth-submit>' + (isRegister ? tr('auth.register', '註冊') : tr('auth.login', '登錄')) + '</a>'
    );
  }
  function openAuthModal(mode) {
    closeAuthModal();
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="auth-modal-overlay" data-auth-overlay>' +
      '<div class="auth-modal-box">' +
      '<div class="auth-modal-head"><h3 class="auth-modal-title" data-auth-title></h3>' +
      '<button type="button" class="auth-modal-close" aria-label="關閉" data-auth-close><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<div class="auth-modal-body" data-auth-body></div>' +
      '</div></div>';
    authModalRoot = wrap.firstElementChild;
    document.body.appendChild(authModalRoot);
    lockScroll();
    on(authModalRoot, 'click', function (e) { if (e.target === authModalRoot) closeAuthModal(); });
    on(authModalRoot.querySelector('[data-auth-close]'), 'click', closeAuthModal);
    function render(m) {
      authModalRoot.querySelector('[data-auth-title]').textContent = m === 'register' ? tr('auth.register', '註冊') : tr('auth.login', '登錄');
      var body = authModalRoot.querySelector('[data-auth-body]');
      body.innerHTML = authModalBodyHtml(m);
      Array.prototype.slice.call(body.querySelectorAll('[data-auth-switch]')).forEach(function (tab) {
        on(tab, 'click', function () { render(tab.getAttribute('data-auth-switch')); });
      });
      on(body.querySelector('[data-auth-submit]'), 'click', function (e) {
        e.preventDefault();
        var nameInput = body.querySelector('[data-auth-username]');
        doLogin(nameInput && nameInput.value);
        closeAuthModal();
      });
    }
    render(mode || 'login');
  }

  /* ── 客服彈窗 ── */
  var csModalRoot = null;
  function closeCsModal() { if (csModalRoot) { csModalRoot.remove(); csModalRoot = null; unlockScroll(); } }
  function openCsModal() {
    if (csModalRoot) return;
    var rows = [
      { icon: '<path d="M21 12c0 4.4-4 8-9 8a10 10 0 0 1-3.6-.7L3 21l1.4-4.5A8 8 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z"/>', title: tr('cs.liveChatTitle', '線上客服'), desc: tr('cs.liveChatDesc', '24 小時即時支援') },
      { icon: '<path d="m22 2-7 20-4-9-9-4Z"/>', title: tr('cs.telegramTitle', 'Telegram 頻道'), desc: tr('cs.telegramDesc', '最新活動與公告') },
      { icon: '<path d="M4 6h16v12H4zM4 7l8 6 8-6"/>', title: tr('cs.emailTitle', 'Email 信箱'), desc: 'support@bet100.gg' },
    ];
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="cs-modal-overlay" data-cs-overlay>' +
      '<div class="cs-modal-box">' +
      '<div class="cs-modal-head"><h3 class="cs-modal-title">' + tr('cs.title', '聯絡客服') + '</h3>' +
      '<button type="button" class="cs-modal-close" aria-label="關閉" data-cs-close><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<div class="cs-modal-body">' +
      rows.map(function (r) {
        return '<a href="#" class="cs-opt"><span class="cs-opt-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + r.icon + '</svg></span>' +
          '<span class="cs-opt-text"><strong>' + r.title + '</strong><small>' + r.desc + '</small></span></a>';
      }).join('') +
      '</div></div></div>';
    csModalRoot = wrap.firstElementChild;
    document.body.appendChild(csModalRoot);
    lockScroll();
    on(csModalRoot, 'click', function (e) { if (e.target === csModalRoot) closeCsModal(); });
    on(csModalRoot.querySelector('[data-cs-close]'), 'click', closeCsModal);
  }
  function initCsTriggers() {
    /* [data-cs-open]：任何元素只要掛這個屬性都能開客服彈窗（首頁公告列
       「線上客服」連結即用此屬性),不綁定特定 class。 */
    Array.prototype.slice.call(document.querySelectorAll('.quick-rail-btn[aria-label="線上客服"], [data-cs-open]')).forEach(function (btn) {
      on(btn, 'click', function (e) { e.preventDefault(); openCsModal(); });
    });
  }

  /* 關於我們頁：頁籤切換 + FAQ 手風琴。支援 ?tab= 帶入指定分頁,
     讓其他頁面（如首頁公告列「常見問題」）可以直接連到對應分頁。 */
  function initAboutTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.about-tab'));
    if (!tabs.length) return;
    function activate(tab) {
      tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
      var target = tab.getAttribute('data-about-tab');
      Array.prototype.slice.call(document.querySelectorAll('.about-panel')).forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-about-panel') !== target;
      });
    }
    tabs.forEach(function (tab) { on(tab, 'click', function () { activate(tab); }); });
    var wanted = new URLSearchParams(location.search).get('tab');
    var match = wanted && tabs.filter(function (t) { return t.getAttribute('data-about-tab') === wanted; })[0];
    if (match) activate(match);
  }
  function initFaqAccordion() {
    Array.prototype.slice.call(document.querySelectorAll('.faq-trigger')).forEach(function (btn) {
      on(btn, 'click', function () { btn.closest('.faq-card').classList.toggle('open'); });
    });
  }

  /* 儲值／提款頁：付款方式頁籤 + 金額快選按鈕。兩頁共用同一套 class
     （pay-tabs/pay-amount-grid/pay-field），金額輸入框在標記中緊接於金額
     grid 之後，用 nextElementSibling 取得對應欄位。 */
  function initPayTabs() {
    Array.prototype.slice.call(document.querySelectorAll('.pay-tabs')).forEach(function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('.pay-tab'));
      tabs.forEach(function (tab) {
        on(tab, 'click', function () {
          tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        });
      });
    });
  }
  function initPayAmount() {
    Array.prototype.slice.call(document.querySelectorAll('.pay-amount-grid')).forEach(function (grid) {
      var btns = Array.prototype.slice.call(grid.querySelectorAll('.pay-amount-btn'));
      var field = grid.nextElementSibling;
      if (!field || !field.classList.contains('pay-field')) field = null;
      btns.forEach(function (btn) {
        on(btn, 'click', function () {
          btns.forEach(function (b) { b.classList.toggle('selected', b === btn); });
          if (field) field.value = '₩ ' + btn.textContent.trim();
        });
      });
    });
  }

  /* 通用結果/表單彈窗:外殼沿用 .auth-modal-* class(純容器樣式,登入彈窗與
     這裡的儲值/提款流程共用,不含 auth 專屬邏輯)。 */
  var payModalRoot = null;
  function closePayModal() { if (payModalRoot) { payModalRoot.remove(); payModalRoot = null; unlockScroll(); } }
  function openPayModal(title, bodyHtml) {
    closePayModal();
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="auth-modal-overlay" data-pay-overlay>' +
      '<div class="auth-modal-box">' +
      '<div class="auth-modal-head"><h3 class="auth-modal-title">' + title + '</h3>' +
      '<button type="button" class="auth-modal-close" aria-label="關閉" data-pay-close><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<div class="auth-modal-body">' + bodyHtml + '</div>' +
      '</div></div>';
    payModalRoot = wrap.firstElementChild;
    document.body.appendChild(payModalRoot);
    lockScroll();
    on(payModalRoot, 'click', function (e) { if (e.target === payModalRoot) closePayModal(); });
    on(payModalRoot.querySelector('[data-pay-close]'), 'click', closePayModal);
    return payModalRoot;
  }
  function simplePayModal(title, message) {
    var root = openPayModal(title, '<p class="about-text">' + message + '</p><button type="button" class="btn-gold" style="width:100%">確定</button>');
    on(root.querySelector('.auth-modal-body .btn-gold'), 'click', closePayModal);
    return root;
  }

  /* 儲值送出流程:銀行卡先給轉帳資訊、LinePay/USDT 先給收款位址,使用者按
     「已完成」才算成功——純前端模擬,不接真實金流。 */
  var PAY_ADDR = { linepay: 'https://line.example/pay/8f3c1a92b7d4e05f', trc20: 'TXk9YmR2pQ7sN3vB1cE6hK8jL0tUw', erc20: '0x8f3c1a92b7d4e05fA1cE6hK8jL0tUw12' };
  function payMethodId(root) {
    var act = (root || document).querySelector('.pay-tabs .pay-tab.active');
    var label = act ? act.textContent.trim() : '銀行卡';
    if (/LinePay/i.test(label)) return 'linepay';
    if (/TRC20/i.test(label)) return 'trc20';
    if (/ERC20/i.test(label)) return 'erc20';
    return 'bank';
  }
  function depositSuccessModal() {
    simplePayModal('儲值成功', '您的儲值申請已送出，請至「儲值紀錄」查看處理進度。');
  }
  /* 示意用 QR Code:固定 seed 產生,只求視覺像 QR(三個定位角 + 隨機模組),
     不編碼真實內容,純介面展示。 */
  function fakeQrModules() {
    var s = '', seed = 7;
    function finder(x, y) {
      return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#0b0e13"></rect><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"></rect><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#0b0e13"></rect>';
    }
    s += finder(0, 0) + finder(22, 0) + finder(0, 22);
    for (var y = 0; y < 29; y++) for (var x = 0; x < 29; x++) {
      if ((x < 8 && y < 8) || (x > 20 && y < 8) || (x < 8 && y > 20)) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if ((seed >> 16) % 100 < 46) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#0b0e13"></rect>';
    }
    return s;
  }
  function depositStepModal(methodId, amountVal) {
    var isBank = methodId === 'bank';
    var body;
    if (isBank) {
      body =
        '<div class="bank-row"><span>收款銀行</span><strong style="margin-left:auto">國民銀行</strong></div>' +
        '<div class="bank-row"><span>收款帳號</span><strong class="mono" style="margin-left:auto">881-234-567890</strong></div>' +
        '<div class="bank-row"><span>儲值金額</span><strong style="margin-left:auto">' + escapeHtml(amountVal) + '</strong></div>' +
        '<p class="pay-note">完成轉帳後請點擊下方按鈕，系統將盡快為您確認入帳。</p>' +
        '<button type="button" class="btn-gold" style="width:100%" data-pay-done>我已完成轉帳</button>';
    } else {
      var addr = PAY_ADDR[methodId] || PAY_ADDR.linepay;
      var addrLabel = methodId === 'linepay' ? '付款網址' : '收款地址';
      body =
        '<p class="about-text">請使用手機掃描下方 QR Code，或複製' + addrLabel + '完成付款。</p>' +
        '<div style="text-align:center;margin-bottom:14px"><svg width="176" height="176" viewBox="0 0 29 29" shape-rendering="crispEdges" role="img" aria-label="付款 QR Code"><rect width="29" height="29" fill="#fff"></rect>' + fakeQrModules() + '</svg></div>' +
        '<label class="member-panel-title" style="font-size:12.5px;margin-bottom:6px;display:block">' + addrLabel + '</label>' +
        '<div style="display:flex;gap:8px">' +
        '<input class="pay-field" style="width:auto;flex:1" value="' + escapeHtml(addr) + '" readonly />' +
        '<button type="button" class="btn-gold" style="padding:0 16px" data-pay-copy>複製</button>' +
        '</div>' +
        '<p class="pay-note">此為示意用 QR Code 與' + addrLabel + '，僅供介面展示。</p>' +
        '<button type="button" class="btn-gold" style="width:100%" data-pay-done>我已完成付款</button>';
    }
    var root = openPayModal(isBank ? '轉帳資訊' : '掃碼付款', body);
    var copyBtn = root.querySelector('[data-pay-copy]');
    if (copyBtn) on(copyBtn, 'click', function () {
      try { navigator.clipboard.writeText(PAY_ADDR[methodId] || ''); } catch (e) {}
      var original = copyBtn.textContent; copyBtn.textContent = '已複製';
      setTimeout(function () { copyBtn.textContent = original; }, 1500);
    });
    on(root.querySelector('[data-pay-done]'), 'click', depositSuccessModal);
  }

  /* 提款帳戶管理:localStorage 模擬已綁定的收款帳戶清單,「提款」頁籤沒有
     任何帳戶時停用送出按鈕,呼應真實產品「先綁定收款帳戶才能提款」的流程。 */
  var WD_ACCOUNTS_KEY = 'cms-v4-withdraw-accounts';
  var WD_TYPE_LABEL = { bank: '銀行卡', trc20: 'USDT-TRC20', erc20: 'USDT-ERC20' };
  var WD_TYPE_ICON = {
    bank: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    trc20: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    erc20: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  };
  function loadWdAccounts() {
    var list;
    try { list = JSON.parse(localStorage.getItem(WD_ACCOUNTS_KEY)); } catch (e) { list = null; }
    if (!Array.isArray(list)) {
      // 預設帶一筆既有銀行卡,對齊此頁原本寫死的示範資料,避免剛上線就是空清單。
      list = [{ type: 'bank', bankName: '國民銀行', holder: '', account: '**** **** **** 1234' }];
      try { localStorage.setItem(WD_ACCOUNTS_KEY, JSON.stringify(list)); } catch (e2) {}
    }
    return list;
  }
  function saveWdAccounts(list) {
    try { localStorage.setItem(WD_ACCOUNTS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function wdAccountLabel(acc) {
    if (acc.type === 'bank') return escapeHtml(acc.account || '') + '（' + escapeHtml(acc.bankName || '') + '）';
    return WD_TYPE_LABEL[acc.type] + '：' + escapeHtml(acc.account || '');
  }
  function wdAccountRowHtml(acc, idx, withRemove) {
    return '<div class="bank-row"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (WD_TYPE_ICON[acc.type] || WD_TYPE_ICON.bank) + '</svg> <span>' + wdAccountLabel(acc) + '</span>' +
      (withRemove ? '<button type="button" class="auth-modal-close" aria-label="刪除" style="margin-left:auto" data-wd-remove="' + idx + '"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>' : '') +
      '</div>';
  }
  function renderWdAccounts() {
    var accounts = loadWdAccounts();
    var listBox = document.querySelector('[data-wd-account-list]');
    if (listBox) {
      listBox.innerHTML = accounts.length
        ? accounts.map(function (acc, idx) { return wdAccountRowHtml(acc, idx, true); }).join('')
        : '<p class="pay-note">尚未綁定任何提款帳戶。</p>';
    }
    var current = document.querySelector('[data-wd-current-account]');
    var submitBtn = document.querySelector('.pay-submit');
    if (currentPage() !== 'withdrawal.html') return;
    if (current) {
      current.innerHTML = accounts.length
        ? wdAccountRowHtml(accounts[0], 0, false)
        : '<p class="pay-note">尚未綁定提款帳戶,請先至「帳戶管理」新增。</p>';
    }
    if (submitBtn) submitBtn.disabled = accounts.length === 0;
  }

  /* 提款頁頂層「提款／帳戶管理」頁籤,做法同 initAboutTabs:切換 active +
     顯示對應 data-wd-panel。 */
  function initWithdrawalTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-wd-tab]'));
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      on(tab, 'click', function () {
        tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        var target = tab.getAttribute('data-wd-tab');
        Array.prototype.slice.call(document.querySelectorAll('[data-wd-panel]')).forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-wd-panel') !== target;
        });
      });
    });
    renderWdAccounts();
  }
  function initWithdrawalAccountForm() {
    var typeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-wd-add-type] .pay-tab'));
    if (!typeBtns.length) return;
    var bankFields = document.querySelector('[data-wd-fields="bank"]');
    var cryptoFields = document.querySelector('[data-wd-fields="crypto"]');
    typeBtns.forEach(function (btn) {
      on(btn, 'click', function () {
        var type = btn.getAttribute('data-wd-type');
        if (bankFields) bankFields.hidden = type !== 'bank';
        if (cryptoFields) cryptoFields.hidden = type === 'bank';
      });
    });
    var submitBtn = document.querySelector('[data-wd-add-submit]');
    if (!submitBtn) return;
    on(submitBtn, 'click', function () {
      var type = (document.querySelector('[data-wd-add-type] .pay-tab.active') || {}).getAttribute
        ? document.querySelector('[data-wd-add-type] .pay-tab.active').getAttribute('data-wd-type')
        : 'bank';
      var acc = { type: type };
      if (type === 'bank') {
        var bankName = (document.querySelector('[data-wd-field="bankName"]') || {}).value || '';
        var holder = (document.querySelector('[data-wd-field="holder"]') || {}).value || '';
        var account = (document.querySelector('[data-wd-field="account"]') || {}).value || '';
        if (!bankName.trim() || !holder.trim() || !account.trim()) { simplePayModal('提示', '請完整填寫銀行名稱、收款人姓名與銀行卡號。'); return; }
        acc.bankName = bankName.trim(); acc.holder = holder.trim(); acc.account = account.trim();
      } else {
        var address = (document.querySelector('[data-wd-field="address"]') || {}).value || '';
        if (!address.trim()) { simplePayModal('提示', '請填寫收款錢包地址。'); return; }
        acc.account = address.trim();
      }
      var accounts = loadWdAccounts();
      accounts.push(acc);
      saveWdAccounts(accounts);
      Array.prototype.slice.call(document.querySelectorAll('[data-wd-add-type] input, [data-wd-fields] input')).forEach(function (i) { i.value = ''; });
      renderWdAccounts();
      simplePayModal('新增成功', '提款帳戶已新增，可於「提款」頁籤選用。');
    });
    on(document, 'click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-wd-remove]');
      if (!btn) return;
      var idx = Number(btn.getAttribute('data-wd-remove'));
      var accounts = loadWdAccounts();
      accounts.splice(idx, 1);
      saveWdAccounts(accounts);
      renderWdAccounts();
    });
  }

  /* 儲值／提款頁的「確認」送出按鈕:依目前頁面分流,兩者共用同一顆
     .pay-submit,行為完全不同,用 currentPage() 判斷比另外掛 data 屬性省事。 */
  function initPaySubmitHandlers() {
    var btn = document.querySelector('.pay-submit');
    if (!btn) return;
    var page = currentPage();
    on(btn, 'click', function () {
      if (btn.disabled) return;
      if (page === 'withdrawal.html') {
        var pwField = document.querySelector('[data-wd-panel="withdraw"] .pay-field[type="password"]');
        if (pwField && !pwField.value.trim()) { pwField.focus(); simplePayModal('提示', '請先輸入提款密碼。'); return; }
        simplePayModal('提款成功', '您的提款申請已送出，將於 1–24 小時內處理完成，請至「提款紀錄」查看進度。');
      } else if (page === 'deposit.html') {
        depositStepModal(payMethodId(), (document.querySelector('.pay-field') || {}).value || '');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    safe(initAuthGuard);
    safe(renderHeaderAuth);
    safe(initHero);
    safe(initFeatureCarousel);
    safe(initVendorSelect);
    safe(initRails);
    safe(initFavorites);
    safe(initListingTabs);
    safe(initListingSearch);
    safe(initMemberLogout);
    safe(initHeaderMobileMenu);
    safe(initCsTriggers);
    safe(initAboutTabs);
    safe(initFaqAccordion);
    safe(initPayTabs);
    safe(initPayAmount);
    safe(initWithdrawalTabs);
    safe(initWithdrawalAccountForm);
    safe(initPaySubmitHandlers);
    safe(applyStudioSections);
    safe(applyStudioSiteName);
    safe(applyStudioSkin);
    safe(applyStudioLayout);
  });
})();
