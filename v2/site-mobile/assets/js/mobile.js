/* v2 獨立手機版共用行為層。刻意不去動 ../site/assets/js/site.js——
   登入狀態(win100-logged-in)、收藏(win100-static-favorites)、語言
   (win100-locale)三把 key 跟桌機版共用同一份 localStorage，同源自動
   同步；只有「外觀 skin」刻意獨立（見下方 SKINS），不讀也不寫桌機版
   的 win100-static-skin，避免兩邊互相蓋掉對方的選擇。 */
(function () {
  'use strict';

  /* ============================== 外觀 skin（獨立於桌機版）=========== */
  var SKIN_KEY = 'win100-mobile-skin';
  var SKINS = [
    { id: 'lucky-star', label: 'Lucky Star', swatch: '#34d179' },
    { id: 'violet-rush', label: 'Violet Rush', swatch: '#a855f7' },
    { id: 'amber-royale', label: 'Amber Royale', swatch: '#f2b134' },
  ];
  var currentSkinId = 'lucky-star';

  function findSkin(id) {
    for (var i = 0; i < SKINS.length; i++) if (SKINS[i].id === id) return SKINS[i];
    return null;
  }

  function applySkin(id, persist) {
    var skin = findSkin(id) || SKINS[0];
    document.documentElement.setAttribute('data-skin', skin.id);
    currentSkinId = skin.id;
    if (persist !== false) {
      try { localStorage.setItem(SKIN_KEY, skin.id); } catch (e) { /* storage unavailable */ }
    }
  }

  function restoreSkin() {
    var saved = null;
    try { saved = localStorage.getItem(SKIN_KEY); } catch (e) { /* ignore */ }
    applySkin(saved && findSkin(saved) ? saved : SKINS[0].id, false);
  }

  /* HTML 樣板直接寫 Tailwind utility class（真正 Tailwind 寫法，不疊
     另一份手寫 CSS 去對應 .m-skin-option 這種語意 class）；m-skin-wrap/
     m-skin-trigger/m-skin-menu/data-skin-option 純粹是 JS 事件委派用
     的 hook，本身不帶樣式。 */
  function renderSkinMenu(menu) {
    menu.className = 'm-skin-menu absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-2xl border border-line-hi bg-bg-card p-1.5 shadow-card';
    menu.innerHTML = SKINS.map(function (s) {
      var active = s.id === currentSkinId;
      return '<button type="button" class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold' +
        (active ? ' bg-accent-soft text-accent' : ' text-text-mid') +
        '" data-skin-option="' + s.id + '" role="option" aria-selected="' + active + '">' +
        '<span class="h-5 w-5 flex-none rounded-full border border-line-hi" style="background:' + s.swatch + '" aria-hidden="true"></span>' +
        '<span>' + s.label + '</span></button>';
    }).join('');
  }

  function closeSkinMenu() {
    var m = document.querySelector('.m-skin-menu');
    if (m) m.remove();
    var t = document.querySelector('.m-skin-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
  }

  function toggleSkinMenu(trigger) {
    var wrap = trigger.closest('.m-skin-wrap');
    if (!wrap) return;
    if (wrap.querySelector('.m-skin-menu')) { closeSkinMenu(); return; }
    var menu = document.createElement('div');
    menu.className = 'm-skin-menu';
    wrap.appendChild(menu);
    renderSkinMenu(menu);
    trigger.setAttribute('aria-expanded', 'true');
  }

  function initSkinSwitcher() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.m-skin-trigger');
      if (trigger) { toggleSkinMenu(trigger); return; }
      var option = e.target.closest('[data-skin-option]');
      if (option) { applySkin(option.getAttribute('data-skin-option')); closeSkinMenu(); return; }
      if (!e.target.closest('.m-skin-wrap')) closeSkinMenu();
    });
  }

  /* ============================== 登入 / 註冊 / 會員等級 ============== */
  /* win100-logged-in 跟桌機版 v2/site 共用同一把 localStorage key（見檔頭
     說明），這裡只是幫手機版補一個真正能操作的登入/註冊彈窗——桌機版
     site.js 原本就有一套（AUTH_FIELDS/authFieldError），驗證規則直接
     對齊搬過來，避免兩邊「同一個帳號欄位、不同的合法值」。彈窗本身跟
     選單抽屜一樣是 <template> 搬運模式，見 openMenuDrawer() 的註解。 */
  var AUTH_KEY = 'win100-logged-in';
  var AUTH_FIELDS = {
    login: ['username', 'password'],
    register: ['username', 'password', 'confirm', 'email', 'realname', 'mobile'],
  };

  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  function readLogin() {
    try { return localStorage.getItem(AUTH_KEY) === '1'; } catch (e) { return false; }
  }
  function persistLogin(loggedIn) {
    try {
      if (loggedIn) localStorage.setItem(AUTH_KEY, '1');
      else localStorage.removeItem(AUTH_KEY);
    } catch (e) { /* storage unavailable */ }
  }
  function applyAuthUI() {
    var loggedIn = readLogin();
    document.querySelectorAll('[data-auth-guest]').forEach(function (el) { el.classList.toggle('hidden', loggedIn); });
    document.querySelectorAll('[data-auth-account]').forEach(function (el) { el.classList.toggle('hidden', !loggedIn); });
  }

  function authFieldError(name, values) {
    var raw = values[name] || '';
    var v = raw.trim();
    switch (name) {
      case 'username':
        if (v.length < 3 || v.length > 16) return t('auth.err.username');
        return '';
      case 'password':
        if (raw.length < 5 || raw.length > 16) return t('auth.err.password');
        return '';
      case 'confirm':
        if (raw !== values.password) return t('auth.err.confirm');
        return '';
      case 'email':
        if (!/^\S+@\S+\.\S+$/.test(v)) return t('auth.err.email');
        return '';
      case 'realname':
        if (!v) return t('auth.err.realname');
        return '';
      case 'mobile':
        if (!/^\+?[0-9][0-9 -]{6,14}$/.test(v)) return t('auth.err.mobile');
        return '';
    }
    return '';
  }

  function bindAuthPanel(panel, mode) {
    if (!panel) return;
    var submitBtn = panel.querySelector('[data-auth-submit]');
    on(submitBtn, 'click', function () {
      var fields = AUTH_FIELDS[mode];
      var values = {};
      fields.forEach(function (name) {
        var input = panel.querySelector('[data-auth-field="' + name + '"]');
        values[name] = input ? input.value : '';
      });
      var ok = true;
      fields.forEach(function (name) {
        var msg = authFieldError(name, values);
        var errEl = panel.querySelector('[data-auth-error="' + name + '"]');
        var inputEl = panel.querySelector('[data-auth-field="' + name + '"]');
        if (msg) ok = false;
        if (errEl) { errEl.textContent = msg; errEl.classList.toggle('hidden', !msg); }
        if (inputEl) inputEl.classList.toggle('border-[#ef4444]', !!msg);
      });
      if (!ok) return;
      persistLogin(true);
      closeAuthModal();
      applyAuthUI();
    });
  }

  function switchAuthTab(root, mode) {
    root.querySelectorAll('[data-auth-tab]').forEach(function (b) {
      var active = b.getAttribute('data-auth-tab') === mode;
      b.classList.toggle('bg-accent', active);
      b.classList.toggle('text-text-on-accent', active);
      b.classList.toggle('text-text-mid', !active);
    });
    root.querySelectorAll('[data-auth-panel]').forEach(function (p) {
      p.classList.toggle('hidden', p.getAttribute('data-auth-panel') !== mode);
    });
  }

  var authModalRoot = null;
  function closeAuthModal() {
    if (!authModalRoot) return;
    authModalRoot.remove();
    authModalRoot = null;
    document.documentElement.classList.remove('overflow-hidden');
  }
  function openAuthModal(mode) {
    var tpl = document.getElementById('m-auth-modal-tpl');
    if (!tpl) return;
    closeAuthModal();
    var wrap = document.createElement('div');
    wrap.innerHTML = tpl.innerHTML;
    authModalRoot = wrap.firstElementChild;
    document.body.appendChild(authModalRoot);
    if (window.__v2mApplyLocale) window.__v2mApplyLocale(authModalRoot);
    document.documentElement.classList.add('overflow-hidden');
    switchAuthTab(authModalRoot, mode || 'login');
    bindAuthPanel(authModalRoot.querySelector('[data-auth-panel="login"]'), 'login');
    bindAuthPanel(authModalRoot.querySelector('[data-auth-panel="register"]'), 'register');
    on(authModalRoot, 'click', function (e) {
      if (e.target === authModalRoot || e.target.closest('[data-auth-close]')) { closeAuthModal(); return; }
      var tabBtn = e.target.closest('[data-auth-tab]');
      if (tabBtn) switchAuthTab(authModalRoot, tabBtn.getAttribute('data-auth-tab'));
    });
  }

  function initAuthTriggers() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-action="open-signin"]');
      if (trigger) { openAuthModal(trigger.getAttribute('data-auth-mode') || 'login'); return; }
      var logoutBtn = e.target.closest('[data-action="logout"]');
      if (logoutBtn) { persistLogin(false); applyAuthUI(); }
    });
  }

  /* ============================== 底部導覽 / Menu 抽屜 ================ */
  function initBottomNav() {
    var bar = document.querySelector('.m-tabbar');
    if (!bar) return;
    var menuBtn = bar.querySelector('[data-tabbar-menu]');
    if (menuBtn) on(menuBtn, 'click', function () { toggleMenuDrawer(true); });
  }

  /* about.html 分頁鈕：目前只有單一內容區塊(3 個分頁共用同一段介紹文字，
     沒有各自獨立的公告/FAQ 內容——桌機版 about.html 有 8 個分頁的完整
     內容，手機版這裡先做視覺上可切換的精簡版)，點擊只切換 active 樣式。 */
  function initAboutTabs() {
    var tabs = document.querySelectorAll('[data-about-tab]');
    if (!tabs.length) return;
    tabs.forEach(function (btn) {
      on(btn, 'click', function () {
        tabs.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('bg-accent', active);
          b.classList.toggle('text-text-on-accent', active);
          b.classList.toggle('text-text-mid', !active);
        });
      });
    });
  }

  var menuDrawerRoot = null;
  var menuDrawerCloseTimer = null;
  var MENU_DRAWER_CLOSE_MS = 230;
  function removeMenuDrawerRoot() {
    if (menuDrawerCloseTimer) { clearTimeout(menuDrawerCloseTimer); menuDrawerCloseTimer = null; }
    if (menuDrawerRoot) { menuDrawerRoot.remove(); menuDrawerRoot = null; }
    document.documentElement.classList.remove('overflow-hidden');
  }
  function closeMenuDrawer() {
    if (!menuDrawerRoot) return;
    var root = menuDrawerRoot;
    var panel = root.querySelector('[data-drawer-panel]');
    root.classList.add('animate-[v2m-backdrop-out_.2s_ease-in]');
    if (panel) panel.classList.add('animate-[v2m-drawer-out_.22s_ease-in]');
    document.documentElement.classList.remove('overflow-hidden');
    menuDrawerRoot = null;
    if (menuDrawerCloseTimer) clearTimeout(menuDrawerCloseTimer);
    /* 抽屜滑出動畫跑完才真的移除節點，不然直接 remove() 動畫還沒播完
       就消失，等於白寫了 v2m-drawer-out。 */
    menuDrawerCloseTimer = setTimeout(function () { root.remove(); menuDrawerCloseTimer = null; }, MENU_DRAWER_CLOSE_MS);
  }
  function openMenuDrawer() {
    var tpl = document.getElementById('m-menu-drawer-tpl');
    if (!tpl) return;
    removeMenuDrawerRoot();
    var wrap = document.createElement('div');
    wrap.innerHTML = tpl.innerHTML;
    menuDrawerRoot = wrap.firstElementChild;
    menuDrawerRoot.classList.add('animate-[v2m-backdrop-in_.22s_ease-out]');
    var panel = menuDrawerRoot.querySelector('[data-drawer-panel]');
    if (panel) panel.classList.add('animate-[v2m-drawer-in_.26s_cubic-bezier(.16,1,.3,1)]');
    document.body.appendChild(menuDrawerRoot);
    /* <template> 內容在被搬進 document 之前是 inert 的，DOMContentLoaded
       當時 i18n.js 的 applyLocale() 掃過一輪時它根本不在 DOM 上，裡面的
       data-i18n 屬性當然套不到——每次挪進來都要重新跑一次翻譯，跟
       home.js/category.js/live.js 動態塞卡片同一個坑。 */
    if (window.__v2mApplyLocale) window.__v2mApplyLocale(menuDrawerRoot);
    document.documentElement.classList.add('overflow-hidden');
    on(menuDrawerRoot, 'click', function (e) {
      if (e.target === menuDrawerRoot || e.target.closest('[data-drawer-close]')) closeMenuDrawer();
    });
  }
  function toggleMenuDrawer(open) { if (open) openMenuDrawer(); else closeMenuDrawer(); }

  function on(el, evt, fn) { if (el) el.addEventListener(evt, fn); }

  /* 報表/紀錄頁的展開式卡片：預設只收合顯示關鍵欄位，點卡頭展開看其餘
     欄位。事件委派掛在 document 上，卡片本身是靜態 HTML（產生期就已經
     把 v2/site 對應頁面的完整欄位資料寫進去，不是這裡動態組的），純粹
     只負責顯示/隱藏跟箭頭旋轉。 */
  function initRecordCards() {
    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-record-toggle]');
      if (!toggle) return;
      var card = toggle.closest('[data-record-card]');
      if (!card) return;
      var detail = card.querySelector('[data-record-detail]');
      var chevron = toggle.querySelector('.record-chevron');
      var open = detail.classList.toggle('hidden') === false;
      if (chevron) chevron.classList.toggle('rotate-180', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    restoreSkin();
    initSkinSwitcher();
    applyAuthUI();
    initAuthTriggers();
    initBottomNav();
    initAboutTabs();
    initRecordCards();
  });

  window.__v2mOpenMenuDrawer = openMenuDrawer;
  window.__v2mCloseMenuDrawer = closeMenuDrawer;
})();
