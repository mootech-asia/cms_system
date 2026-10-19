/* v2 獨立手機版共用行為層。刻意不去動 ../site/assets/js/site.js——
   登入狀態(win100-logged-in)、收藏(win100-static-favorites)、語言
   (win100-locale)、外觀 skin(win100-static-skin)四把 key 跟桌機版共用
   同一份 localStorage，同源自動同步；skin 清單／名稱／排序取自桌機版
   data.js 的 THEME_KEYS／THEME_LABELS，studio「公開皮膚」
   (win100-public-config.publicSkins)的限縮也一併套用，兩邊是同一套。 */
(function () {
  'use strict';

  /* ============================== 外觀 skin（與桌機版共用）=========== */
  var SKIN_KEY = 'win100-static-skin';
  var SKIN_SWATCH = {
    win100: '#98e7d2', aurora: '#c9a6ff', noir: '#e8c67a',
    'fashion-blue': '#5da9ff', 'rose-graphite': '#f29ab8', 'cosmic-pink': '#ff8ad6'
  };
  var SKINS = (function () {
    var D = window.WIN100_DATA || {};
    var keys = D.THEME_KEYS || Object.keys(SKIN_SWATCH);
    var labels = D.THEME_LABELS || {};
    var cfg = null;
    try { cfg = JSON.parse(localStorage.getItem('win100-public-config') || 'null'); } catch (e) {}
    var pub = (cfg && cfg.publicSkins) || [];
    var visible = pub.length ? keys.filter(function (k) { return pub.indexOf(k) !== -1; }) : keys;
    return (visible.length ? visible : keys).map(function (k) {
      return { id: k, label: labels[k] || k, swatch: SKIN_SWATCH[k] || 'transparent' };
    });
  })();
  var currentSkinId = 'win100';

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

  /* 頂列餘額：數值與行為比照 v3 —— site.js initBalanceFloat（登入時每 5.5 秒
     小幅浮動）與 v3/site-mobile/assets/mobile.js 的縮寫（整數 ≥12 位縮成
     123.46B 並加閃爍「!」，點擊數字彈出完整金額）。 */
  var BALANCE_UNITS = [{ value: 1e12, suffix: 'T' }, { value: 1e9, suffix: 'B' }, { value: 1e6, suffix: 'M' }, { value: 1e3, suffix: 'k' }];
  function fmtFull(n) { return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function abbreviate(n) {
    for (var i = 0; i < BALANCE_UNITS.length; i++) {
      if (Math.abs(n) >= BALANCE_UNITS[i].value) return (n / BALANCE_UNITS[i].value).toFixed(2) + BALANCE_UNITS[i].suffix;
    }
    return fmtFull(n);
  }
  function initHeaderBalance() {
    var el = document.querySelector('[data-m-balance]');
    if (!el) return;
    var raw = parseFloat(el.getAttribute('data-raw')) || 0;
    var alert = document.createElement('span');
    alert.className = 'ml-0.5 font-bold text-accent animate-pulse';
    alert.textContent = '!';
    function closeTip() {
      var tip = document.querySelector('[data-m-balance-tip]');
      if (tip) tip.remove();
    }
    function render() {
      var isAbbrev = Math.max(1, Math.floor(Math.abs(raw))).toString().length >= 12;
      el.textContent = isAbbrev ? abbreviate(raw) : fmtFull(raw);
      el.setAttribute('data-raw', String(raw));
      ['cursor-pointer', 'underline', 'decoration-dotted', 'underline-offset-2'].forEach(function (c) { el.classList.toggle(c, isAbbrev); });
      if (isAbbrev) el.parentNode.insertBefore(alert, el.nextSibling);
      else if (alert.parentNode) alert.remove();
    }
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!el.classList.contains('cursor-pointer')) return;
      if (document.querySelector('[data-m-balance-tip]')) { closeTip(); return; }
      var tip = document.createElement('span');
      tip.setAttribute('data-m-balance-tip', '');
      tip.className = 'absolute right-0 top-[calc(100%+6px)] z-50 whitespace-nowrap rounded-lg border border-line-hi bg-bg-elev px-2 py-1 text-[11px] font-bold text-text shadow-card';
      tip.textContent = fmtFull(raw);
      el.parentNode.appendChild(tip);
    });
    document.addEventListener('click', closeTip);
    render();
    setInterval(function () {
      if (!readLogin()) return;
      raw = +(raw + (Math.random() * 4 - 1.7)).toFixed(2);
      render();
      var tip = document.querySelector('[data-m-balance-tip]');
      if (tip) tip.textContent = fmtFull(raw);
    }, 5500);
  }

  /* ============================================================
   * 每日簽到（check-in.html）與推薦中心（referral.html）。
   * 簽到：月曆可切上／下個月，已簽到日期蓋章、未簽到留白；連續天數依前一天
   * 是否有簽到逐日累計，漏簽即從 Day 1 重算。簽到歷史為相對「今天」產生的
   * 示範資料，今日簽到寫入 localStorage。
   * 推薦中心：推薦碼（4–12 位英數，寫入 localStorage）＋推薦連結（複製）＋
   * 推薦好友列表（示範資料；帳號中間以 *** 遮蔽，獎勵千分位）。
   * ========================================================== */
  var CR_CHECKIN_KEY = 'cms_v2m_checkin_added';
  var CR_REFERRAL_KEY = 'cms_v2m_referral_code';
  var CR_CHECKIN_MISSED = [9, 24, 31, 32, 33];
  var CR_CHECKIN_SPAN = 45;
  var CR_REFERRAL_DEFAULT = 'pro003';
  var CR_REFERRAL_BASE = 'https://www.100.gg/?partnercode=';
  var CR_REFERRAL_RE = /^[A-Za-z0-9]{4,12}$/;
  var CR_FRIENDS = [
    { reg: '2026-10-12 21:08', account: 'kimminjun88', login: '2026-10-15 22:41', done: true, reward: 10000 },
    { reg: '2026-10-09 14:32', account: 'luckystar07', login: '2026-10-14 09:15', done: true, reward: 25000 },
    { reg: '2026-10-05 18:47', account: 'parkjiho', login: '2026-10-05 19:02', done: false, reward: 0 },
    { reg: '2026-09-28 11:20', account: 'winnerlee', login: '2026-10-13 23:58', done: true, reward: 150000 },
    { reg: '2026-09-21 09:55', account: 'choiyuna22', login: '2026-09-22 10:31', done: false, reward: 0 },
    { reg: '2026-09-14 16:03', account: 'jackpotking', login: '2026-10-11 20:17', done: true, reward: 1250000 },
    { reg: '2026-09-02 13:44', account: 'hanseoyeon', login: '2026-09-02 13:50', done: false, reward: 0 }
  ];
  var CR_CLS = {
    stats: 'flex flex-col gap-1.5',
    stat: 'flex items-center justify-between gap-3 rounded-2xl border border-line bg-bg-card py-2.5 px-3.5',
    statLabel: 'text-[12px] font-semibold text-text-dim',
    statVal: 'text-[15px] font-bold text-accent whitespace-nowrap [font-variant-numeric:tabular-nums]',
    panel: 'rounded-2xl border border-line bg-bg-card p-3.5',
    panelTitle: 'm-0 mb-3 text-[14px] font-bold text-text',
    sectionTitle: 'm-0 -mb-1 text-[14px] font-bold text-text',
    calHead: 'flex flex-wrap items-center gap-2.5 mb-3',
    calTitle: 'm-0 flex-1 min-w-0 text-center text-[14px] font-bold text-text',
    navBtn: 'h-9 w-9 grid place-items-center shrink-0 rounded-xl border border-line-hi text-text-mid',
    checkinBtn: 'h-11 px-5 rounded-xl bg-accent text-text-on-accent text-[13.5px] font-bold whitespace-nowrap disabled:opacity-60 w-full',
    checkinBtnDone: 'h-11 px-5 rounded-xl bg-accent text-text-on-accent text-[13.5px] font-bold whitespace-nowrap disabled:opacity-60 w-full',
    calGrid: 'grid grid-cols-7 gap-1',
    wd: 'py-1 text-center text-[10.5px] font-semibold text-text-dim',
    day: 'relative min-h-14 py-0.75 px-1 rounded-lg border bg-bg-card border-line',
    dayToday: 'relative min-h-14 py-0.75 px-1 rounded-lg border bg-bg-card border-accent',
    dayEmpty: 'min-h-14',
    dayNum: 'text-[10.5px] leading-[1.2] font-semibold text-text-mid [font-variant-numeric:tabular-nums]',
    stamp: 'absolute inset-x-0 top-6 bottom-1 flex items-center justify-center text-accent',
    stampRing: 'grid place-items-center w-5 h-5 rounded-full border-[1.5px] border-current bg-accent-soft -rotate-12 [&_svg]:w-3 [&_svg]:h-3',
    stampText: 'hidden',
    note: 'mt-3 mb-0 text-[11.5px] text-text-dim',
    tableWrap: 'rounded-2xl border border-line bg-bg-card overflow-hidden',
    tableInner: 'overflow-x-auto',
    table: 'w-full border-collapse',
    thead: '',
    tbody: '',
    th: 'whitespace-nowrap py-2.5 px-3.5 text-left text-[11.5px] font-bold text-text-mid bg-bg-card-hi',
    thNum: 'whitespace-nowrap py-2.5 px-3.5 text-right text-[11.5px] font-bold text-text-mid bg-bg-card-hi',
    td: 'whitespace-nowrap border-t border-line py-3 px-3.5 text-[12.5px] text-text',
    tdNum: 'whitespace-nowrap border-t border-line py-3 px-3.5 text-[12.5px] text-text text-right [font-variant-numeric:tabular-nums]',
    pillOk: 'inline-block rounded-full py-1 px-2 text-[11px] leading-none font-bold bg-accent-soft text-accent',
    pillPend: 'inline-block rounded-full py-1 px-2 text-[11px] leading-none font-bold bg-bg-card-hi text-text-mid',
    rfRowFirst: 'flex flex-col gap-2 pb-3',
    rfRow: 'flex flex-col gap-2 pt-3 border-t border-line',
    rfLabel: 'text-[12px] font-semibold text-text-mid',
    rfField: 'flex gap-2 min-w-0',
    input: 'flex-1 min-w-0 h-11 rounded-xl border border-line-hi bg-bg px-3.5 text-[14px] text-text outline-none focus:border-accent',
    saveBtn: 'h-11 px-5 rounded-xl border border-line-hi bg-bg text-text text-[13.5px] font-bold whitespace-nowrap disabled:opacity-50 flex-none min-w-19',
    copyBtn: 'h-11 px-5 rounded-xl bg-accent text-text-on-accent text-[13.5px] font-bold whitespace-nowrap disabled:opacity-60 flex-none min-w-19',
    error: 'm-0 text-[11px] text-[#ef4444]'
  };
  function crT(key, fallback) {
    var v = window.__v2mT ? window.__v2mT(key) : null;
    return v && v !== key ? v : fallback;
  }
  function crLocale() {
    try { return localStorage.getItem('win100-locale') || 'zh'; } catch (e) { return 'zh'; }
  }
  function crOnLocaleChange() {}
  function crEsc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function crFmt(path, fallback, n) { return crT(path, fallback).replace('{n}', n); }
  function crDayKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function crAddDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function crReward(streakDay) {
    var cycleDay = ((streakDay - 1) % 7) + 1;
    return cycleDay === 7 ? 100 : cycleDay * 10;
  }
  function crIntlLang() {
    var map = { zh: 'zh-Hant', en: 'en', ko: 'ko', th: 'th' };
    return (map[crLocale()] || 'en') + '-u-ca-gregory';
  }

  function initCheckinPage() {
    var root = document.getElementById('ci-root');
    if (!root) return;
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var todayKey = crDayKey(today);
    var checked = {};
    for (var i = 1; i <= CR_CHECKIN_SPAN; i++) {
      if (CR_CHECKIN_MISSED.indexOf(i) === -1) checked[crDayKey(crAddDays(today, -i))] = true;
    }
    var added = [];
    try { added = JSON.parse(localStorage.getItem(CR_CHECKIN_KEY) || '[]') || []; } catch (e) { added = []; }
    added.forEach(function (k) { checked[k] = true; });
    var view = { y: today.getFullYear(), m: today.getMonth() };

    function computeEntries() {
      var keys = Object.keys(checked).sort();
      var byKey = {};
      keys.forEach(function (k, idx) {
        var p = k.split('-');
        var d = new Date(+p[0], +p[1] - 1, +p[2]);
        var prev = byKey[crDayKey(crAddDays(d, -1))];
        var streak = prev ? prev.streak + 1 : 1;
        byKey[k] = { key: k, date: d, streak: streak, reward: crReward(streak), reset: streak === 1 && idx > 0 };
      });
      return byKey;
    }

    function render() {
      var lang = crIntlLang();
      var byKey = computeEntries();
      var keys = Object.keys(byKey);
      var totalReward = keys.reduce(function (sum, k) { return sum + byKey[k].reward; }, 0);
      var cur = byKey[todayKey] || byKey[crDayKey(crAddDays(today, -1))];
      var doneToday = !!checked[todayKey];

      var stat = function (label, val) {
        return '<div class="' + CR_CLS.stat + '"><div class="' + CR_CLS.statLabel + '">' + crEsc(label) + '</div><div class="' + CR_CLS.statVal + '">' + crEsc(val) + '</div></div>';
      };
      var summary = '<div class="' + CR_CLS.stats + '">' +
        stat(crT('checkin.totalDays', 'Total Check-in Days'), crFmt('checkin.days', '{n} days', keys.length)) +
        stat(crT('checkin.streak', 'Current Streak'), crFmt('checkin.days', '{n} days', cur ? cur.streak : 0)) +
        stat(crT('checkin.totalRewards', 'Total Check-in Rewards'), crFmt('checkin.points', '{n} Points', totalReward.toLocaleString('en-US'))) +
        '</div>';

      var monthTitle = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long' }).format(new Date(view.y, view.m, 1));
      var wdFmt = new Intl.DateTimeFormat(lang, { weekday: 'short' });
      var wd = '';
      for (var w = 0; w < 7; w++) wd += '<div class="' + CR_CLS.wd + '">' + crEsc(wdFmt.format(new Date(2023, 0, 1 + w))) + '</div>';
      var first = new Date(view.y, view.m, 1);
      var daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
      var cells = '';
      for (var b = 0; b < first.getDay(); b++) cells += '<div class="' + CR_CLS.dayEmpty + '"></div>';
      var stampLabel = crT('checkin.stampLabel', 'Completed Attendance');
      for (var dd = 1; dd <= daysInMonth; dd++) {
        var k = crDayKey(new Date(view.y, view.m, dd));
        var stamp = checked[k]
          ? '<span class="' + CR_CLS.stamp + '" role="img" aria-label="' + crEsc(stampLabel) + '"><span class="' + CR_CLS.stampRing + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"></path></svg></span><small class="' + CR_CLS.stampText + '">' + crEsc(crT('checkin.stamp', 'Done')) + '</small></span>'
          : '';
        cells += '<div class="' + (k === todayKey ? CR_CLS.dayToday : CR_CLS.day) + '"><span class="' + CR_CLS.dayNum + '">' + dd + '</span>' + stamp + '</div>';
      }
      var arrow = function (dir) {
        var path = dir === 'prev' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6';
        var label = dir === 'prev' ? crT('checkin.prevMonth', 'Previous month') : crT('checkin.nextMonth', 'Next month');
        return '<button type="button" class="' + CR_CLS.navBtn + '" data-ci-nav="' + dir + '" aria-label="' + crEsc(label) + '" title="' + crEsc(label) + '"><svg width="16" height="16" viewBox="0 0 24 24"><path d="' + path + '" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>';
      };
      var actionBtn = doneToday
        ? '<button type="button" class="' + CR_CLS.checkinBtnDone + '" disabled>' + crEsc(crT('checkin.checkedIn', 'Checked in today')) + '</button>'
        : '<button type="button" class="' + CR_CLS.checkinBtn + '" data-ci-checkin>' + crEsc(crT('checkin.checkInNow', 'Check in now')) + '</button>';
      var calendar = '<div class="' + CR_CLS.panel + '">' +
        '<div class="' + CR_CLS.calHead + '">' + arrow('prev') + '<h2 class="' + CR_CLS.calTitle + '">' + crEsc(monthTitle) + '</h2>' + arrow('next') + actionBtn + '</div>' +
        '<div class="' + CR_CLS.calGrid + '">' + wd + cells + '</div>' +
        '<p class="' + CR_CLS.note + '">' + crEsc(crT('checkin.rule', 'Missing a day resets your streak — your next check-in starts again from Day 1.')) + '</p>' +
        '</div>';

      var tier = crT('checkin.tierUnranked', 'Unranked');
      var monthKeys = keys.filter(function (key) { var e = byKey[key]; return e.date.getFullYear() === view.y && e.date.getMonth() === view.m; }).sort().reverse();
      var rows = monthKeys.map(function (key) {
        var e = byKey[key];
        var remark = e.reset ? crT('checkin.remarkReset', 'Streak reset after a missed day · Day 1')
          : (((e.streak - 1) % 7) + 1 === 7 ? crT('checkin.remarkBonus', '7-day streak bonus') : crFmt('checkin.remarkStreak', 'Streak Day {n}', e.streak));
        return '<tr><td class="' + CR_CLS.td + '">' + crEsc(key) + '</td><td class="' + CR_CLS.td + '">' + crEsc(tier) + '</td><td class="' + CR_CLS.td + '">' + crEsc(crFmt('checkin.points', '{n} Points', e.reward)) + '</td><td class="' + CR_CLS.td + '">' + crEsc(remark) + '</td></tr>';
      }).join('');
      if (!rows) rows = '<tr><td class="' + CR_CLS.td + '" colspan="4">' + crEsc(crT('checkin.noRecords', 'No check-in records this month.')) + '</td></tr>';
      var th = function (path, fb) { return '<th class="' + CR_CLS.th + '">' + crEsc(crT(path, fb)) + '</th>'; };
      var records = '<h2 class="' + CR_CLS.sectionTitle + '">' + crEsc(crT('checkin.records', 'Check-in Records')) + ' · ' + crEsc(monthTitle) + '</h2>' +
        '<div class="' + CR_CLS.tableWrap + '"><div class="' + CR_CLS.tableInner + '"><table class="' + CR_CLS.table + '"><thead class="' + CR_CLS.thead + '"><tr>' +
        th('checkin.colDate', 'Date') + th('checkin.colLevel', 'Member Level') + th('checkin.colReward', 'Reward') + th('checkin.colRemark', 'Remark') +
        '</tr></thead><tbody class="' + CR_CLS.tbody + '">' + rows + '</tbody></table></div></div>';

      root.innerHTML = summary + calendar + records;
    }

    root.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-ci-nav]');
      if (nav) {
        view.m += nav.getAttribute('data-ci-nav') === 'prev' ? -1 : 1;
        if (view.m < 0) { view.m = 11; view.y--; }
        if (view.m > 11) { view.m = 0; view.y++; }
        render();
        return;
      }
      if (e.target.closest('[data-ci-checkin]') && !checked[todayKey]) {
        checked[todayKey] = true;
        added.push(todayKey);
        try { localStorage.setItem(CR_CHECKIN_KEY, JSON.stringify(added)); } catch (err) {}
        view = { y: today.getFullYear(), m: today.getMonth() };
        render();
      }
    });
    crOnLocaleChange(render);
    render();
  }

  function crMaskAccount(name) {
    if (name.length <= 4) return name.charAt(0) + '***';
    return name.slice(0, 2) + '***' + name.slice(-2);
  }
  function initReferralPage() {
    var root = document.getElementById('rf-root');
    if (!root) return;
    var code = CR_REFERRAL_DEFAULT;
    try { code = localStorage.getItem(CR_REFERRAL_KEY) || CR_REFERRAL_DEFAULT; } catch (e) {}

    function render() {
      var draft = root.querySelector('#rf-code');
      var draftVal = draft ? draft.value : code;
      var rows = CR_FRIENDS.map(function (f) {
        var pill = f.done
          ? '<span class="' + CR_CLS.pillOk + '">' + crEsc(crT('referral.statusDone', 'Completed')) + '</span>'
          : '<span class="' + CR_CLS.pillPend + '">' + crEsc(crT('referral.statusPending', 'Not completed')) + '</span>';
        return '<tr><td class="' + CR_CLS.td + '">' + crEsc(f.reg) + '</td><td class="' + CR_CLS.td + '">' + crEsc(crMaskAccount(f.account)) + '</td><td class="' + CR_CLS.td + '">' + crEsc(f.login) + '</td>' +
          '<td class="' + CR_CLS.td + '">' + pill + '</td><td class="' + CR_CLS.tdNum + '">' + crEsc(f.reward.toLocaleString('en-US')) + '</td></tr>';
      }).join('');
      var th = function (path, fb, cls) { return '<th class="' + (cls || CR_CLS.th) + '">' + crEsc(crT(path, fb)) + '</th>'; };
      root.innerHTML =
        '<div class="' + CR_CLS.panel + '">' +
          '<h2 class="' + CR_CLS.panelTitle + '">' + crEsc(crT('referral.settings', 'Referral Code Settings')) + '</h2>' +
          '<div class="' + CR_CLS.rfRowFirst + '">' +
            '<label class="' + CR_CLS.rfLabel + '" for="rf-code">' + crEsc(crT('referral.code', 'Referral Code')) + '</label>' +
            '<div class="' + CR_CLS.rfField + '"><input id="rf-code" class="' + CR_CLS.input + '" maxlength="12" autocomplete="off" spellcheck="false" value="' + crEsc(draftVal) + '">' +
            '<button type="button" class="' + CR_CLS.saveBtn + '" data-rf-save disabled>' + crEsc(crT('referral.save', 'Save')) + '</button></div>' +
            '<p class="' + CR_CLS.error + '" data-rf-error hidden>' + crEsc(crT('referral.codeRule', 'Referral code must be 4–12 letters or numbers.')) + '</p>' +
          '</div>' +
          '<div class="' + CR_CLS.rfRow + '">' +
            '<label class="' + CR_CLS.rfLabel + '" for="rf-link">' + crEsc(crT('referral.link', 'Referral Link')) + '</label>' +
            '<div class="' + CR_CLS.rfField + '"><input id="rf-link" class="' + CR_CLS.input + '" readonly value="' + crEsc(CR_REFERRAL_BASE + code) + '">' +
            '<button type="button" class="' + CR_CLS.copyBtn + '" data-rf-copy>' + crEsc(crT('referral.copy', 'Copy')) + '</button></div>' +
          '</div>' +
        '</div>' +
        '<h2 class="' + CR_CLS.sectionTitle + '">' + crEsc(crT('referral.friends', 'Referred Friends')) + '</h2>' +
        '<div class="' + CR_CLS.tableWrap + '"><div class="' + CR_CLS.tableInner + '"><table class="' + CR_CLS.table + '"><thead class="' + CR_CLS.thead + '"><tr>' +
          th('referral.colReg', 'Registration Date') + th('referral.colAccount', 'Friend Account') + th('referral.colLogin', 'Last Login Date') + th('referral.colStatus', 'Status') + th('referral.colReward', 'Referral Reward', CR_CLS.thNum) +
        '</tr></thead><tbody class="' + CR_CLS.tbody + '">' + rows + '</tbody></table></div></div>';
      bind();
    }

    function bind() {
      var codeInput = root.querySelector('#rf-code');
      var linkInput = root.querySelector('#rf-link');
      var saveBtn = root.querySelector('[data-rf-save]');
      var copyBtn = root.querySelector('[data-rf-copy]');
      var errEl = root.querySelector('[data-rf-error]');
      function syncSave() {
        var v = codeInput.value.trim();
        var valid = CR_REFERRAL_RE.test(v);
        errEl.hidden = valid || v === '';
        saveBtn.disabled = !valid || v === code;
      }
      codeInput.addEventListener('input', syncSave);
      saveBtn.addEventListener('click', function () {
        var v = codeInput.value.trim();
        if (!CR_REFERRAL_RE.test(v)) return;
        code = v;
        codeInput.value = v;
        try { localStorage.setItem(CR_REFERRAL_KEY, v); } catch (e) {}
        linkInput.value = CR_REFERRAL_BASE + v;
        syncSave();
        var o = saveBtn.textContent; saveBtn.textContent = crT('referral.saved', 'Saved'); setTimeout(function () { saveBtn.textContent = o; }, 1500);
      });
      copyBtn.addEventListener('click', function () {
        var fallback = function () { linkInput.select(); try { document.execCommand('copy'); } catch (err) {} };
        try {
          var p = navigator.clipboard.writeText(linkInput.value);
          if (p && p.catch) p.catch(fallback);
        } catch (e) { fallback(); }
        var o = copyBtn.textContent; copyBtn.textContent = crT('referral.copied', 'Copied'); setTimeout(function () { copyBtn.textContent = o; }, 1500);
      });
      syncSave();
    }

    crOnLocaleChange(render);
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    restoreSkin();
    initSkinSwitcher();
    applyAuthUI();
    initAuthTriggers();
    initBottomNav();
    initAboutTabs();
    initRecordCards();
    initHeaderBalance();
    initCheckinPage();
    initReferralPage();
  });

  window.__v2mOpenMenuDrawer = openMenuDrawer;
  window.__v2mCloseMenuDrawer = closeMenuDrawer;
})();
