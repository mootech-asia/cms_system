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

  /* studio 父頁（同源）在 iframe load 後或任何控制項變動時直接呼叫這個函式，
     即時把草稿反映到畫面上，不經過 localStorage、不需重整。 */
  window.__cmsV4StudioApply = function (draft) {
    if (!draft) return;
    if (draft.sections) applySections(draft.sections);
    if ('sitename' in draft) applySiteName(draft.sitename);
    if (draft.skin) applySkin(draft.skin);
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

  /* ── 手機版全螢幕選單:導覽連結直接複製桌面版 .header-nav,
     避免另外維護一份重複資料。 ── */
  var mobileMenuRoot = null;
  function closeMobileMenu() { if (mobileMenuRoot) { mobileMenuRoot.remove(); mobileMenuRoot = null; unlockScroll(); } }
  function openMobileMenu() {
    closeMobileMenu();
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.header-nav .header-nav-link'));
    var navHtml = navLinks.map(function (a) {
      return '<a href="' + a.getAttribute('href') + '" class="mobile-menu-link' + (a.classList.contains('active') ? ' active' : '') + '">' + a.innerHTML + '</a>';
    }).join('');
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
  function initHeaderMobileMenu() {
    Array.prototype.slice.call(document.querySelectorAll('.header-menu-trigger')).forEach(function (btn) {
      on(btn, 'click', openMobileMenu);
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
    Array.prototype.slice.call(document.querySelectorAll('.quick-rail-btn[aria-label="線上客服"], .mobile-account-view-btn[data-cs-open]')).forEach(function (btn) {
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
    safe(applyStudioSections);
    safe(applyStudioSiteName);
    safe(applyStudioSkin);
  });
})();
