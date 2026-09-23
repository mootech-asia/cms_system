/**
 * CMS_Frontend_v1.5 — 行為層(vanilla JS,無框架)。
 * 對照來源 Nuxt 專案的 layouts/default.vue、layouts/usercenter.vue:
 * Navbar/Footer/BottomNavbar/SideBar(浮動客服)這幾塊每頁共用的 chrome,
 * 集中在這裡用字串模板產生、掛到每頁 <body> 裡的掛載點,避免 25 個頁面
 * 各自貼一份重複 HTML(對應原始碼「所有頁面共用同一 layout」的關係)。
 */
(function () {
  'use strict';

  var D = window.WIN15_DATA || {};
  var IMG = 'assets/images/';
  var LOCALE_KEY = 'v15-locale';
  var LOCALE_CODES = ['en', 'ko'];
  var HTML_LANG_BY_LOCALE = { ko: 'ko', en: 'en', zh: 'zh-Hant' };
  var LOGIN_KEY = 'v15-logged-in';

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function pageName() {
    var seg = (location.pathname.split('/').pop() || 'index.html');
    return seg.replace(/\.html?$/, '') || 'index';
  }
  function icon(name) { return IMG + 'icon/' + name; }
  /* 對照 layouts/usercenter.vue 覆蓋的頁面清單 */
  var USER_CENTER_PAGES = ['account', 'deposit', 'withdrawal', 'betting-record', 'deposit-record',
    'profit-loss', 'withdrawal-record', 'withdrawal-detail', 'account-record', 'banking-details',
    'personal-info', 'security', 'change-password', 'transaction-info'];
  function isUserCenterPage() { return USER_CENTER_PAGES.indexOf(pageName()) !== -1; }
  /* 對照真實網站截圖:只有儲值/提款兩個交易頁面不顯示右下角浮動客服 */
  var HIDE_QUICK_SIDEBAR_PAGES = ['deposit', 'withdrawal'];
  /* 對照真實網站截圖:側欄清單沒有「儲值/提款」項目,在這兩頁(以及其明細頁)
     時側欄一律反白「帳戶總覽」,不是完全不反白 */
  var SIDEBAR_FALLBACK_TO_ACCOUNT = ['deposit', 'withdrawal', 'transaction-info'];
  function sidebarActivePage() {
    var p = pageName();
    return SIDEBAR_FALLBACK_TO_ACCOUNT.indexOf(p) !== -1 ? 'account' : p;
  }

  /* 靜態預覽無真實後端,用 localStorage 模擬登入狀態(同源同步,對照真實網站
     首頁未登入/會員頁已登入的行為);會員中心頁面本來就進不去除非已登入,
     所以一律視為已登入 */
  function isLoggedIn() {
    if (isUserCenterPage()) return true;
    try { return localStorage.getItem(LOGIN_KEY) === 'true'; } catch (e) { return false; }
  }
  function setLoggedIn(value) {
    try { localStorage.setItem(LOGIN_KEY, value ? 'true' : 'false'); } catch (e) { /* ignore */ }
  }

  function currentLocale() {
    try {
      var saved = localStorage.getItem(LOCALE_KEY);
      return LOCALE_CODES.indexOf(saved) !== -1 ? saved : 'en';
    } catch (e) { return 'en'; }
  }
  function setLocale(code) {
    if (LOCALE_CODES.indexOf(code) === -1) return;
    try { localStorage.setItem(LOCALE_KEY, code); } catch (e) { /* ignore */ }
    applyLocale();
  }
  function t(key) {
    var dict = (D.I18N && D.I18N[currentLocale()]) || {};
    return dict[key] || key;
  }
  function applyLocale() {
    var loc = currentLocale();
    document.documentElement.setAttribute('lang', HTML_LANG_BY_LOCALE[loc] || 'en');
    qsa('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    qsa('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    qsa('[data-i18n-placeholder]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
    var entry = (D.LANGUAGES || []).filter(function (l) { return l.code === loc; })[0];
    qsa('[data-locale-label]').forEach(function (el) { el.textContent = entry ? entry.label : loc; });
    /* 切換語言不會整頁重新整理,頁面若有把翻譯後文字直接寫進動態產生的
       表格內容(例如狀態欄位),data-i18n 掃描不到,需要自行監聽這個事件
       重新 render 一次 */
    document.dispatchEvent(new CustomEvent('win15:localechange'));
  }

  /* ================================================================
   * Navbar(components/Navbar.vue)
   * ================================================================ */
  function mobileMenuItemHtml(item, isTop) {
    var hrefAttr = item.url ? ' data-nav-href="' + item.url + '"' : ' data-stub-item';
    var iconUrl = icon(item.icon);
    return (
      '<button type="button" class="group/mi h-14 flex flex-col items-center justify-center gap-1 rounded-2xl [&.is-active]:!bg-navy" data-nav-key="' + item.key + '"' + hrefAttr + '>' +
      '<span class="relative w-6 h-6">' +
      '<img src="' + iconUrl + '" alt="' + item.key + '" class="w-6 h-6 block group-[.is-active]/mi:hidden">' +
      '<span class="absolute inset-0 hidden group-[.is-active]/mi:block bg-[image:var(--g-primary)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" style="-webkit-mask-image:url(' + iconUrl + ');mask-image:url(' + iconUrl + ')"></span>' +
      '</span>' +
      '<span class="text-[14px] font-semibold text-white leading-none group-[.is-active]/mi:bg-[image:var(--g-primary)] group-[.is-active]/mi:bg-clip-text group-[.is-active]/mi:text-transparent" data-i18n="' + item.tKey + '">' + t(item.tKey) + '</span>' +
      '</button>'
    );
  }

  function headerHtml() {
    var isUserCenter = isUserCenterPage();
    /* 首頁/行銷頁預設未登入(對照真實網站首頁截圖 Login/Register 狀態);
       透過登入彈窗完成登入後改用 localStorage 記住狀態,重新整理/切換頁面
       都會維持已登入畫面,直到按登出為止 */
    var profile = isLoggedIn() ? D.MOCK_PROFILE : null;

    var mobileTop = D.MOBILE_TOP_ITEMS.map(function (i) { return mobileMenuItemHtml(i, true); }).join('');
    var mobileBottom = D.MOBILE_BOTTOM_ITEMS.map(function (i) { return mobileMenuItemHtml(i, false); }).join('');

    var mobileAccount = profile
      ? '<div class="flex items-center justify-between py-4 px-7"><div><div class="flex items-center gap-2"><span class="py-0.5 px-2 rounded-full bg-white text-navy text-[14px] font-bold">' + profile.player_level_id + '</span><span class="text-white text-[18px] font-semibold ml-2">' + profile.username + '</span></div><p class="text-yellow text-[14px] font-semibold mt-1">' + profile.balance + '</p></div>' +
        '<button type="button" data-logout><img src="' + icon('exit.svg') + '" alt="exit" class="w-6 h-6"></button></div>'
      : '<div class="flex justify-center items-center gap-3 py-4 px-7">' +
        /* main.css 的 button{padding:0;font:inherit;...} 是通用重置，
           unlayered stylesheet 優先權高於 tailwind.css 的 utilities layer，
           這裡 padding/font-weight 一律要加 ! 才蓋得過去 */
        '<button type="button" class="border-gradient-pill rounded-lg !py-2 !px-4 !font-semibold" data-open-auth="login"><span class="text-gradient block" data-i18n="auth.login">' + t('auth.login') + '</span></button>' +
        '<button type="button" class="border-gradient-pill rounded-lg !py-2 !px-4 !font-semibold" data-open-auth="register"><span class="text-gradient block" data-i18n="auth.register">' + t('auth.register') + '</span></button>' +
        '</div>';

    var desktopAccount = profile
      ? '<div class="flex items-center">' +
        '<div class="group/uid relative cursor-pointer flex items-center"><img src="' + icon('user.svg') + '" alt="user" class="w-5 h-5 mr-5"><span class="text-white group-hover/uid:text-link-hover">ID: ' + profile.username + '</span>' +
        '<div class="absolute left-[-14px] top-full z-[70] hidden group-hover/uid:block bg-black/90 border border-white/10 rounded-lg min-w-max"><button type="button" class="block w-full text-left whitespace-nowrap !py-2 !px-3 rounded-lg !text-white hover:!bg-[#404040]" data-href="deposit.html" data-i18n="userCenter.deposit">' + t('userCenter.deposit') + '</button><button type="button" class="block w-full text-left whitespace-nowrap !py-2 !px-3 rounded-lg !text-white hover:!bg-[#404040]" data-href="withdrawal.html" data-i18n="userCenter.withdrawal">' + t('userCenter.withdrawal') + '</button><button type="button" class="block w-full text-left whitespace-nowrap !py-2 !px-3 rounded-lg !text-white hover:!bg-[#404040]" data-href="account.html" data-i18n="userCenter.myAccount">' + t('userCenter.myAccount') + '</button></div>' +
        '</div>' +
        '<span class="py-0.5 px-2 rounded-full bg-white text-[#1c378e] font-bold mr-4 ml-2">' + profile.player_level_name + '</span>' +
        '<div class="flex flex-col leading-tight">' +
        '<div class="flex text-[14px]"><span class="w-15 text-white/70 mr-2" data-i18n="navbar.balance">' + t('navbar.balance') + '</span><span class="text-yellow">' + profile.balance + '</span></div>' +
        '<div class="flex text-[14px]"><span class="w-15 text-white/70 mr-2" data-i18n="navbar.points">' + t('navbar.points') + '</span><span class="text-yellow">' + profile.point_balance + '</span></div>' +
        '</div>' +
        '<button type="button" class="w-8 h-8 flex items-center justify-center ml-4" data-logout><img src="' + icon('exit.svg') + '" alt="exit" class="w-5 h-5"></button>' +
        '</div>'
      : '<div class="flex items-center gap-4">' +
        '<button type="button" class="h-10 inline-flex items-center justify-center rounded-md !border !border-white !text-white !text-[16px] !py-2 !px-3 whitespace-nowrap" data-open-auth="login" data-i18n="auth.login">' + t('auth.login') + '</button>' +
        '<button type="button" class="h-10 inline-flex items-center justify-center rounded-md !border !border-white !text-white !text-[16px] !py-2 !px-3 whitespace-nowrap" data-open-auth="register" data-i18n="auth.register">' + t('auth.register') + '</button>' +
        '</div>';

    var langSwitcherDesktop =
      '<div class="relative group/lang" data-lang-switcher>' +
      '<button type="button" class="box-border inline-flex items-center justify-center h-10 gap-1 !text-white !border !border-white rounded-md !py-2 !px-3 !text-[14px] whitespace-nowrap" data-lang-trigger>' +
      '<img src="' + icon('lang-us.svg') + '" alt="lang" class="w-6 h-6 mr-1">' +
      '<span data-locale-label>' + ((D.LANGUAGES || []).filter(function (l) { return l.code === currentLocale(); })[0] || {}).label + '</span>' +
      '</button>' +
      '<div class="absolute left-1/2 -translate-x-1/2 mt-1.5 bg-black border border-white/10 rounded-lg p-2 min-w-[130px] hidden group-[.is-open]/lang:block z-[80]">' +
      (D.LANGUAGES || []).map(function (l) {
        return '<button type="button" class="flex items-center gap-1.5 w-full h-6 rounded-xl !px-1.5 !text-white !text-[14px] hover:!bg-white/10" data-set-locale="' + l.code + '"><img src="' + icon(l.image) + '" alt="' + l.code + '" class="w-6 h-3.5"><span>' + l.label + '</span></button>';
      }).join('') +
      '</div></div>';

    /* 對照真實原始碼 Navbar.vue:桌機導覽的圖示 span 整段是註解(/-、//-),
       實際沒有渲染,只留純文字,選中項目靠 .is-active 的漸層底線區分 */
    var desktopNav = D.DESKTOP_NAV.map(function (item) {
      return '<div class="group font-normal flex items-center gap-2 pb-2 border-b-[1.3px] border-transparent [&.is-active]:[border-image:var(--g-primary-270)] [&.is-active]:[border-image-slice:1]" data-nav-key="' + item.key + '" data-nav-href="' + item.url + '">' +
        '<span class="text-[14px] text-white/50 group-hover:text-white group-[.is-active]:text-white" data-i18n="' + item.tKey + '">' + t(item.tKey) + '</span></div>';
    }).join('');

    return (
      '<header class="fixed top-0 left-0 right-0 z-[200] bg-navy">' +
      '<div class="flex items-center justify-between h-16 px-5 [body.is-usercenter_&]:hidden xl:hidden">' +
      '<a href="index.html"><img src="' + IMG + 'index/img-logo.png" alt="logo" class="h-12.5 w-auto"></a>' +
      '<button type="button" class="w-9 h-9" data-toggle-mobile-menu><img src="' + icon('menu.svg') + '" alt="menu" class="w-9 h-9"></button>' +
      '</div>' +
      '<div class="fixed left-0 right-0 top-[63px] z-[200] bg-[rgba(6,12,52,0.8)] text-white hidden [&.is-open]:block xl:!hidden" data-mobile-menu>' +
      '<div class="grid grid-cols-3 py-2 px-5 border-b border-white/30">' + mobileTop + '</div>' +
      '<div class="grid grid-cols-3 gap-y-6 py-2 px-5">' + mobileBottom + '</div>' +
      mobileAccount +
      '</div>' +
      '<div class="hidden xl:block">' +
      '<div class="h-33 flex justify-between ' + (isUserCenter ? 'px-10' : 'px-24') + '">' +
      '<div class="flex items-center"><a href="index.html"><img src="' + IMG + 'index/img-logo.png" alt="logo" class="w-60 min-w-60 cursor-pointer"></a></div>' +
      '<div class="w-full h-full flex flex-col justify-between">' +
      '<div class="flex justify-end items-center gap-4 mt-2">' + desktopAccount + langSwitcherDesktop + '</div>' +
      '<nav class="flex justify-end gap-6 pb-4 whitespace-nowrap">' + desktopNav + '</nav>' +
      '</div></div></div>' +
      '</header>'
    );
  }

  function bindHeader(root) {
    var menuBtn = qs('[data-toggle-mobile-menu]', root);
    var menuPanel = qs('[data-mobile-menu]', root);
    on(menuBtn, 'click', function () { menuPanel.classList.toggle('is-open'); });

    bindNavLinks(root);
    qsa('[data-href]', root).forEach(function (el) {
      on(el, 'click', function () { location.href = el.getAttribute('data-href'); });
    });
    qsa('[data-logout]', root).forEach(function (el) {
      on(el, 'click', function () { setLoggedIn(false); location.href = 'index.html'; });
    });
    qsa('[data-stub-item]', root).forEach(function (el) {
      on(el, 'click', function () { window.alert('此為靜態設計預覽,此功能尚未實作。'); });
    });

    qsa('[data-open-auth]', root).forEach(function (el) {
      on(el, 'click', function () { showAuthModal(el.getAttribute('data-open-auth')); });
    });
  }

  /* header(桌機)與 footer 各自有一份 .header-lang-switcher 標記(data-lang-switcher),
     兩者是各自獨立的 DOM 節點,需逐一綁定;footer 比 header 晚掛載,所以統一在
     mountChrome() 兩者都掛載完後才呼叫一次,而不是在 bindHeader() 裡面綁(那時
     footer 的節點還不存在於文件中) */
  function bindLangSwitchers(root) {
    qsa('[data-lang-switcher]', root).forEach(function (switcher) {
      if (switcher.__langBound) return;
      switcher.__langBound = true;
      var trigger = qs('[data-lang-trigger]', switcher);
      on(trigger, 'click', function (e) {
        e.stopPropagation();
        switcher.classList.toggle('is-open');
      });
      qsa('[data-set-locale]', switcher).forEach(function (el) {
        on(el, 'click', function () {
          setLocale(el.getAttribute('data-set-locale'));
          switcher.classList.remove('is-open');
        });
      });
      on(document, 'click', function () { switcher.classList.remove('is-open'); });
    });
  }

  function syncActiveNav(root) {
    var current = pageName();
    var currentType = new URLSearchParams(location.search).get('type');
    qsa('[data-nav-key]', root).forEach(function (el) {
      /* 沒有 data-nav-href 的是 stub 項目(點數商城/分享等尚未實作的功能,
         見 data-stub-item),不對應任何頁面,不能參與 active 比對——否則
         href 會被當成空字串,下面 || 'index' 的 fallback 讓它們在首頁
         時被誤判成 active */
      var href = el.getAttribute('data-nav-href');
      if (!href) { el.classList.remove('is-active'); return; }
      var hrefPage = href.split('?')[0].replace(/\.html$/, '') || 'index';
      var hrefType = href.indexOf('type=') !== -1 ? href.split('type=')[1] : null;
      var isActive = hrefPage === current && (hrefType == null || hrefType === currentType);
      el.classList.toggle('is-active', isActive);
    });
  }

  /* ================================================================
   * Footer(components/Footer.vue)
   * ================================================================ */
  function footerHtml() {
    var imgs = (D.FOOTER_PARTNERS || []).map(function (name) {
      return '<img src="' + IMG + 'footer/' + name + '" alt="footer" class="h-15 mr-10">';
    }).join('');
    return (
      '<footer class="w-full bg-navy py-4 px-6 pb-20 xl:py-8 xl:px-21">' +
      '<div class="w-full h-15 overflow-hidden flex items-center"><div class="flex shrink-0 w-max whitespace-nowrap animate-[footer-marquee_30s_linear_infinite]">' + imgs + imgs + '</div></div>' +
      '<div class="flex justify-end mt-12 xl:hidden">' +
      '<div class="relative group/lang" data-lang-switcher>' +
      '<button type="button" class="flex items-center gap-1 w-32.5 h-8 !border !border-white/60 rounded-lg !py-0 !px-2 !text-white !text-[14px]" data-lang-trigger>' +
      '<img src="' + icon('lang-us.svg') + '" alt="lang" class="w-5 h-5">' +
      '<span data-locale-label>' + ((D.LANGUAGES || []).filter(function (l) { return l.code === currentLocale(); })[0] || {}).label + '</span></button>' +
      '<div class="absolute left-1/2 -translate-x-1/2 mt-1.5 bg-black border border-white/10 rounded-lg p-2 min-w-[130px] hidden group-[.is-open]/lang:block z-[80]">' +
      (D.LANGUAGES || []).map(function (l) {
        return '<button type="button" class="flex items-center gap-1.5 w-full h-6 rounded-xl !px-1.5 !text-white !text-[14px] hover:!bg-white/10" data-set-locale="' + l.code + '"><img src="' + icon(l.image) + '" alt="' + l.code + '" class="w-6 h-3.5"><span>' + l.label + '</span></button>';
      }).join('') +
      '</div></div></div>' +
      '<div class="flex justify-start xl:justify-center"><img src="' + IMG + 'index/img-logo.png" alt="logo" class="w-31 xl:w-70"></div>' +
      '<div class="my-8 xl:text-center xl:mt-14">' +
      '<p class="text-subtitle text-[14px] m-0" data-i18n="footer.desc">' + t('footer.desc') + '</p>' +
      '<p class="text-subtitle text-[14px] m-0" data-i18n="footer.desc2">' + t('footer.desc2') + '</p>' +
      '<p class="text-[#888] text-[14px] mt-2" data-i18n="footer.copyright">' + t('footer.copyright') + '</p>' +
      '</div>' +
      '</footer>'
    );
  }

  /* ================================================================
   * 手機底部導覽(components/BottomNavbar.vue)
   * ================================================================ */
  function bottomNavHtml() {
    var items = (D.BOTTOM_NAV_ITEMS || []).map(function (item) {
      return (
        '<li><button type="button" class="group/bn w-full max-w-[84px] h-15 flex flex-col items-center justify-center gap-1.5 rounded-2xl mx-auto [&.is-active]:!bg-white" data-nav-key="' + item.key + '" data-nav-href="' + item.url + '">' +
        '<img src="' + icon(item.icon) + '" alt="' + item.key + '" class="w-7 h-7 group-[.is-active]/bn:invert">' +
        '<span class="text-[14px] font-bold text-white group-[.is-active]/bn:text-[#0a1140]" data-i18n="' + item.tKey + '">' + t(item.tKey) + '</span></button></li>'
      );
    }).join('');
    return '<nav class="fixed left-0 right-0 -bottom-px z-20 bg-navy border-t-2 border-transparent [border-image:var(--g-primary)] [border-image-slice:1] [body.usc-sidebar-open_&]:hidden xl:hidden"><ul class="max-w-[520px] mx-auto py-2 px-4 grid grid-cols-5 gap-2.5 justify-center">' + items + '</ul></nav>';
  }

  /* ================================================================
   * 浮動客服/活動 SideBar(components/SideBar.vue)
   * ================================================================ */
  function quickSidebarHtml() {
    /* 對照 components/SideBar.vue items(液晶客服/Telegram 推播頻道/常見問題,分別導向
       客服彈窗/官方 Telegram/about.html?tab=faq)。對齊其他版本統一為固定圖示
       +hover 彈出黑底標籤,不再使用點擊展開的 popover 選單與禮物收合面板。 */
    var items = [
      { icon: 'sidebar-service.svg', tKey: 'sidebar.liveChat', action: 'liveChat' },
      { icon: 'sidebar-telegram.svg', tKey: 'sidebar.promoChannel', action: 'telegram' },
      { icon: 'sidebar-helps.svg', tKey: 'about.tabs.faq', action: 'faq' },
    ];
    return '<div class="fixed top-1/2 right-2 -translate-y-1/2 z-[100] flex flex-col gap-2.5 py-2.5 px-1.5 rounded-full bg-white/[0.14] [backdrop-filter:blur(6px)] [-webkit-backdrop-filter:blur(6px)] border border-white/25 shadow-[0_18px_50px_rgba(10,17,64,0.18)] max-[720px]:right-1.5 max-[720px]:gap-2">' + items.map(function (item) {
      return (
        '<button type="button" class="group/qr relative w-11.5 h-11.5 rounded-full !bg-navy flex items-center justify-center shadow-[0_18px_50px_rgba(10,17,64,0.18)] max-[720px]:!w-10 max-[720px]:!h-10" data-quick-action="' + item.action + '" aria-label="' + t(item.tKey) + '">' +
        '<img src="' + icon(item.icon) + '" alt="" class="w-full h-full">' +
        '<span class="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 translate-x-1.5 py-2 px-3.5 rounded-full bg-black/90 text-white text-[13px] font-bold whitespace-nowrap opacity-0 pointer-events-none shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-[opacity,transform] duration-[180ms] ease group-hover/qr:opacity-100 group-hover/qr:translate-x-0 group-focus-visible/qr:opacity-100 group-focus-visible/qr:translate-x-0 max-[720px]:!opacity-0 max-[720px]:!translate-x-1.5">' + t(item.tKey) + '</span>' +
        '</button>'
      );
    }).join('') + '</div>';
  }

  function bindQuickSidebar(root) {
    qsa('[data-quick-action]', root).forEach(function (btn) {
      on(btn, 'click', function () {
        var action = btn.getAttribute('data-quick-action');
        if (action === 'telegram') {
          window.open('https://t.me/win10096cs', '_blank', 'noopener,noreferrer');
        } else if (action === 'faq') {
          location.href = 'about.html?tab=faq';
        } else {
          openChatWidget();
        }
      });
    });
  }

  /* 右下角客服對話視窗:純前端模擬,無真實客服後端。開一次後只切換顯示/
     縮小,不重複建立節點。使用者送出訊息後,固定延遲顯示一則罐頭回覆,
     模擬「客服已收到、稍後回覆」的效果。 */
  var chatWidgetRoot = null;
  function scrollChatToBottom() {
    var body = chatWidgetRoot && chatWidgetRoot.querySelector('[data-chat-body]');
    if (body) body.scrollTop = body.scrollHeight;
  }
  function appendChatMsg(kind, text) {
    var body = chatWidgetRoot.querySelector('[data-chat-body]');
    var row = document.createElement('div');
    var isBot = kind === 'bot';
    row.className = 'flex items-end gap-2 max-w-[88%]' + (isBot ? '' : ' self-end flex-row-reverse');
    row.innerHTML = (isBot ? '<img src="' + IMG + 'index/img-logo.png" class="w-5.5 h-5.5 rounded-full bg-[#f5f5f7] object-contain p-0.5 shrink-0" alt="">' : '') +
      '<div class="px-3 py-2.25 rounded-[14px] text-[13px] leading-[1.5] ' + (isBot ? 'bg-[#f5f5f7] text-navy rounded-bl-[4px]' : 'bg-[image:var(--g-primary)] text-white rounded-br-[4px]') + '" data-chat-bubble></div>';
    row.querySelector('[data-chat-bubble]').textContent = text;
    body.appendChild(row);
    scrollChatToBottom();
  }
  function openChatWidget() {
    if (chatWidgetRoot) { chatWidgetRoot.classList.remove('is-minimized'); return; }
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="fixed right-4.5 bottom-4.5 z-[1001] w-[320px] max-w-[calc(100vw-36px)] rounded-2xl bg-white text-navy shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-[520px]:right-2.5 max-[520px]:bottom-2.5 max-[520px]:w-[calc(100vw-20px)]" data-chat-widget>' +
      '<div class="flex items-center gap-2.5 p-3.5 pl-4 bg-[image:var(--g-primary)] text-white">' +
      '<img src="' + IMG + 'index/img-logo.png" class="w-8 h-8 rounded-full bg-white object-contain p-0.75 shrink-0" alt="">' +
      '<div class="flex-1 min-w-0"><strong class="block text-[14px]">' + t('sidebar.liveChat') + '</strong>' +
      '<span class="flex items-center gap-1.25 text-[11.5px] opacity-90"><i class="w-1.5 h-1.5 rounded-full bg-[#3ddc84] inline-block"></i>' + t('sidebar.chatOnline') + '</span></div>' +
      '<button type="button" class="w-6.5 h-6.5 shrink-0 grid place-items-center rounded-full hover:!bg-white/22" data-chat-min aria-label="' + t('sidebar.chatMinimize') + '">–</button>' +
      '<button type="button" class="w-6.5 h-6.5 shrink-0 grid place-items-center rounded-full hover:!bg-white/22" data-chat-close aria-label="' + t('sidebar.chatClose') + '">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '</div>' +
      '<div class="p-3.5 max-h-[320px] overflow-y-auto flex flex-col gap-2.5 [.is-minimized_&]:hidden" data-chat-body></div>' +
      '<form class="flex items-center gap-2 py-2.5 px-3 border-t border-border [.is-minimized_&]:hidden" data-chat-form>' +
      '<input type="text" class="flex-1 min-w-0 border border-border rounded-full px-3.5 py-2 !text-[13px] bg-[#f5f5f7] text-navy" data-chat-input placeholder="' + t('sidebar.chatPlaceholder') + '" autocomplete="off">' +
      '<button type="submit" class="w-8.5 h-8.5 shrink-0 rounded-full grid place-items-center !bg-[image:var(--g-primary)] !text-white" aria-label="' + t('sidebar.chatSend') + '"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 18 9-18 9 4-9Z"/></svg></button>' +
      '</form></div>';
    chatWidgetRoot = wrap.firstElementChild;
    document.body.appendChild(chatWidgetRoot);
    appendChatMsg('bot', t('sidebar.chatGreeting'));
    on(chatWidgetRoot.querySelector('[data-chat-close]'), 'click', function () { chatWidgetRoot.remove(); chatWidgetRoot = null; });
    on(chatWidgetRoot.querySelector('[data-chat-min]'), 'click', function () { chatWidgetRoot.classList.toggle('is-minimized'); });
    on(chatWidgetRoot.querySelector('[data-chat-form]'), 'submit', function (e) {
      e.preventDefault();
      var input = chatWidgetRoot.querySelector('[data-chat-input]');
      var text = input.value.trim();
      if (!text) return;
      appendChatMsg('user', text);
      input.value = '';
      setTimeout(function () {
        if (chatWidgetRoot) appendChatMsg('bot', t('sidebar.chatAutoReply'));
      }, 700);
    });
  }

  /* 點擊客服 icon 彈出的選單(液晶客服/Telegram 推播頻道二選一),取代原本
     的 window.alert 佔位提示 */
  var csModalRoot = null;
  function ensureCsModalRoot() {
    if (csModalRoot) return csModalRoot;
    csModalRoot = document.createElement('div');
    document.body.appendChild(csModalRoot);
    return csModalRoot;
  }
  function showCustomerServiceModal() {
    var root = ensureCsModalRoot();
    root.innerHTML =
      '<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(40,38,46,0.8)] p-4" data-cs-backdrop>' +
      '<div class="relative w-full max-w-[360px] rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-4 flex flex-col gap-3">' +
      '<button type="button" class="absolute -top-4 -right-4 w-8 h-8 rounded-full !bg-white !border !border-pink flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]" data-cs-close><img src="' + icon('sidebar-close.svg') + '" alt="close" class="w-3.5 h-3.5"></button>' +
      '<h3 class="m-0 pb-3 border-b border-border text-navy text-[18px] font-bold text-center">' + t('sidebar.selectCustomerService') + '</h3>' +
      '<button type="button" class="flex items-center gap-2.5 h-12 rounded-full !px-4 !bg-[image:var(--g-action)] !text-navy !text-[15px] !font-bold text-left" data-cs-action="liveChat"><img src="' + icon('sidebar-service.svg') + '" alt="" class="w-5 h-5">' + t('sidebar.liveChatCenter') + '</button>' +
      '<button type="button" class="flex items-center gap-2.5 h-12 rounded-full !px-4 !bg-[image:var(--g-action)] !text-navy !text-[15px] !font-bold text-left" data-cs-action="telegram"><img src="' + icon('sidebar-telegram.svg') + '" alt="" class="w-5 h-5">' + t('sidebar.promoAnnouncementRoom') + '</button>' +
      '</div></div>';
    function close() { root.innerHTML = ''; }
    on(qs('[data-cs-close]', root), 'click', close);
    on(qs('[data-cs-backdrop]', root), 'click', function (e) { if (e.target === e.currentTarget) close(); });
    on(qs('[data-cs-action="liveChat"]', root), 'click', function () {
      close();
      showAlert({ type: 'confirmation', confirmText: t('common.gotIt'), message: t('common.previewNotImplemented') });
    });
    on(qs('[data-cs-action="telegram"]', root), 'click', function () {
      window.open('https://t.me/win10096cs', '_blank', 'noopener,noreferrer');
      close();
    });
  }

  /* [data-nav-href] 出現在 header 導覽/手機選單/底部導覽三處,只在這裡綁一次;
     bindHeader() 只負責 header 自己專屬的 chrome(選單開關/語言/登入登出)。 */
  function bindNavLinks(root) {
    qsa('[data-nav-href]', root).forEach(function (el) {
      if (el.__navBound) return;
      el.__navBound = true;
      on(el, 'click', function () { location.href = el.getAttribute('data-nav-href'); });
    });
    syncActiveNav(root);
  }

  /* ================================================================
   * 會員中心殼 — UserNavbar.vue(手機標題列)/ UserSidebar.vue
   * ================================================================ */
  var USER_CENTER_TITLES = {
    account: 'userCenter.sidebar.accountOverview',
    deposit: 'userCenter.deposit',
    withdrawal: 'userCenter.withdrawal',
    'deposit-record': 'userCenter.sidebar.depositRecord',
    'withdrawal-record': 'userCenter.sidebar.withdrawalRecord',
    'withdrawal-detail': 'userCenter.sidebar.withdrawalDetail',
    'betting-record': 'userCenter.sidebar.bettingRecord',
    'profit-loss': 'userCenter.sidebar.profitAndLoss',
    'account-record': 'userCenter.sidebar.accountRecord',
    'banking-details': 'userCenter.bankingDetails',
    'personal-info': 'userCenter.sidebar.personalInfo',
    security: 'userCenter.sidebar.securityCenter',
  };

  function userNavbarHtml() {
    var titleKey = USER_CENTER_TITLES[pageName()] || '';
    return (
      '<header class="sticky top-0 w-full h-8 z-50 bg-white flex items-center justify-between px-4 xl:hidden">' +
      /* 會員中心頁面手機版不顯示全站 .site-header,這裡補一個回首頁的
         入口,避免使用者在這幾頁的手機版無路可回大廳 */
      '<a href="index.html" class="w-8 h-8 flex items-center justify-center" aria-label="Home">' +
      '<svg viewBox="0 0 24 24" class="w-5.5 h-5.5 text-navy"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 11 12 4l9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8Z"></path></svg></a>' +
      '<h1 class="text-navy text-[20px] text-center flex-1" data-i18n="' + titleKey + '">' + t(titleKey) + '</h1>' +
      '<button type="button" class="w-8 h-8 flex items-center justify-center" data-toggle-user-sidebar aria-label="Toggle menu">' +
      '<svg viewBox="0 0 24 24" class="w-6 h-6 text-navy"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<line x1="5" y1="6" x2="19" y2="6"></line><line x1="5" y1="12" x2="19" y2="12"></line><line x1="5" y1="18" x2="19" y2="18"></line>' +
      '</g></svg></button>' +
      '</header>'
    );
  }

  function userSidebarNavItemHtml(item) {
    var isActive = !!item.url && sidebarActivePage() === item.url.replace(/\.html$/, '');
    return (
      '<li class="px-6 mb-4 xl:px-8 xl:pl-8 xl:pr-7.5">' +
      '<button type="button" class="group/usn w-full h-9 flex items-center gap-2 !py-0 !px-2 rounded-card border-b border-white/15 !text-navy xl:gap-1 xl:!text-white [&:hover:not(.is-active)]:xl:!bg-pink-hover [&:hover:not(.is-active)]:xl:!border-transparent [&.is-active]:xl:!bg-[image:var(--g-primary)] [&.is-active]:xl:!border-transparent' + (isActive ? ' is-active' : '') + '" data-usc-item="' + item.id + '"' +
      (item.url ? ' data-nav-href="' + item.url + '"' : ' data-open-cs') + '>' +
      '<span class="w-6 h-6 shrink-0 bg-[image:var(--g-primary)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain] xl:group-[:hover:not(.is-active)]/usn:!bg-none xl:group-[:hover:not(.is-active)]/usn:!bg-white xl:group-[.is-active]/usn:!bg-none xl:group-[.is-active]/usn:!bg-navy" style="-webkit-mask-image:url(' + icon('usercenter/' + item.icon) + ');mask-image:url(' + icon('usercenter/' + item.icon) + ')"></span>' +
      '<span class="flex-1 bg-[#f4f4f4] rounded-card py-2 px-2 text-left font-semibold xl:bg-transparent xl:p-0 xl:group-[:hover:not(.is-active)]/usn:!text-white xl:group-[:hover:not(.is-active)]/usn:!bg-transparent xl:group-[.is-active]/usn:!bg-transparent xl:group-[.is-active]/usn:!text-navy" data-i18n="' + item.tKey + '">' + t(item.tKey) + '</span>' +
      '</button></li>'
    );
  }

  /* 桌機版 sidebar 頂部的 Deposit/Withdrawal 分頁指示器(pill,依目前頁面
     反白),手機版另有底部深色按鈕(.user-sidebar-mobile-actions)取代它,
     兩者分屬不同斷點,不是互斥的替代品 */
  function userSidebarToggleBtnHtml(url, tKey) {
    var isActive = pageName() === url.replace(/\.html$/, '');
    var base = 'flex-1 min-w-0 text-center !font-bold !text-[14px] !py-2 !px-1.5 rounded-card';
    return isActive
      ? '<button type="button" class="' + base + ' !bg-[image:var(--g-primary)] !text-navy" data-nav-href="' + url + '">' +
        '<span data-i18n="' + tKey + '">' + t(tKey) + '</span></button>'
      : '<button type="button" class="' + base + ' border-gradient-pill" data-nav-href="' + url + '">' +
        '<span class="text-gradient" data-i18n="' + tKey + '">' + t(tKey) + '</span></button>';
  }

  function userSidebarActionBtnHtml(url, tKey) {
    return '<button type="button" class="flex-1 !bg-navy !text-white text-center !font-bold !py-2 !px-2 rounded-card" data-nav-href="' + url + '" data-i18n="' + tKey + '">' + t(tKey) + '</button>';
  }

  function userSidebarHtml() {
    var itemsHtml = (D.USER_SIDEBAR_ITEMS || []).map(userSidebarNavItemHtml).join('');
    var toggles =
      '<div class="hidden gap-2 py-1.5 px-6 mb-4 xl:flex xl:gap-3 xl:py-0 xl:px-8">' +
      userSidebarToggleBtnHtml('deposit.html', 'userCenter.deposit') +
      userSidebarToggleBtnHtml('withdrawal.html', 'userCenter.withdrawal') +
      '</div>';
    var actions =
      '<div class="flex gap-2 px-6 pb-6 xl:!hidden">' +
      userSidebarActionBtnHtml('deposit.html', 'userCenter.deposit') +
      userSidebarActionBtnHtml('withdrawal.html', 'userCenter.withdrawal') +
      '</div>';
    return (
      '<nav class="relative w-full bg-white xl:fixed xl:top-31 xl:bottom-0 xl:left-0 xl:w-65 xl:bg-navy xl:py-4.5 xl:overflow-y-auto">' +
      '<div class="hidden fixed inset-0 top-8 z-10 bg-transparent [&.is-open]:block xl:!hidden" data-usc-overlay></div>' +
      '<ul class="hidden list-none m-0 p-0 [&.is-open]:block [&.is-open]:fixed [&.is-open]:top-8 [&.is-open]:bottom-0 [&.is-open]:right-0 [&.is-open]:w-full [&.is-open]:overflow-y-auto [&.is-open]:z-20 [&.is-open]:bg-white xl:!block xl:static xl:bg-transparent" data-usc-panel>' +
      toggles + itemsHtml + actions +
      '</ul>' +
      '</nav>'
    );
  }

  function bindUserSidebar(root) {
    var panel = qs('[data-usc-panel]', root);
    var overlay = qs('[data-usc-overlay]', root);
    var toggleBtn = qs('[data-toggle-user-sidebar]', root);
    /* account.html 是唯一同時保留 .mobile-bottom-nav 又有 .user-sidebar
       的會員中心頁面(其餘子頁 bottom-nav 直接不掛載),兩者手機版都是
       position:fixed 且 z-index 相同,side 展開時會疊在一起把底部導覽
       壓爛,所以側欄展開時額外隱藏 bottom-nav,收合時再還原 */
    function close() {
      if (panel) panel.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.classList.remove('usc-sidebar-open');
    }
    on(toggleBtn, 'click', function () {
      if (panel) panel.classList.toggle('is-open');
      if (overlay) overlay.classList.toggle('is-open');
      document.body.classList.toggle('usc-sidebar-open', panel && panel.classList.contains('is-open'));
    });
    on(overlay, 'click', close);
    qsa('[data-open-cs]', root).forEach(function (el) {
      on(el, 'click', function () { close(); showCustomerServiceModal(); });
    });
    qsa('[data-usc-item]', root).forEach(function (el) {
      on(el, 'click', close);
    });
  }

  /* ================================================================
   * 全站彈窗(components/AlertModal.vue)——success/error/confirmation 共用
   * ================================================================ */
  var alertRoot = null;
  function ensureAlertRoot() {
    if (alertRoot) return alertRoot;
    alertRoot = document.createElement('div');
    document.body.appendChild(alertRoot);
    return alertRoot;
  }
  /**
   * opts: { type: 'success'|'error'|'confirmation', message, title, confirmText, redirectUrl, onConfirm }
   */
  function showAlert(opts) {
    var root = ensureAlertRoot();
    var type = opts.type || 'success';
    var iconName = type === 'error' ? 'error.svg' : type === 'confirmation' ? 'confirmation.svg' : 'success.svg';
    var title = opts.title || t(type === 'error' ? 'common.warning' : type === 'confirmation' ? 'common.confirmation' : 'common.success');
    var confirmText = opts.confirmText || (type === 'confirmation' ? t('common.submit') : t('common.gotIt'));
    root.innerHTML =
      '<div class="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(40,38,46,0.8)] p-4"><div class="relative w-full max-w-[360px] rounded-[28px] bg-[#3a3a3a] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-[3px] border-transparent [background-image:linear-gradient(#3a3a3a,#3a3a3a),var(--g-primary)] [background-origin:border-box] [background-clip:padding-box,border-box]">' +
      '<div class="flex flex-col items-center gap-3 pt-6 px-6 pb-4">' +
      '<img src="' + icon(iconName) + '" alt="' + type + '" class="w-20 h-20">' +
      '<h3 class="text-white text-[20px] font-bold text-center m-0">' + title + '</h3>' +
      '<p class="text-white/50 text-[16px] text-center m-0">' + (opts.message || '') + '</p>' +
      '</div>' +
      '<div class="pt-0 px-6 pb-5">' +
      '<button type="button" class="w-full h-10 rounded-full !bg-[image:var(--g-primary)] !text-[rgba(6,12,52,0.8)] !text-[18px] !font-bold" data-alert-confirm>' + confirmText + '</button>' +
      (opts.cancellable && type !== 'success' ? '<button type="button" class="mt-2 w-full h-10 rounded-lg !text-white/60 !font-semibold" data-alert-cancel>' + t('common.cancel') + '</button>' : '') +
      '</div></div></div>';
    on(qs('[data-alert-confirm]', root), 'click', function () {
      root.innerHTML = '';
      if (typeof opts.onConfirm === 'function') opts.onConfirm();
      if (opts.redirectUrl) location.href = opts.redirectUrl;
    });
    on(qs('[data-alert-cancel]', root), 'click', function () { root.innerHTML = ''; });
  }

  /* ================================================================
   * 登入/註冊彈窗(components/Login.vue)——login/register/forgotPassword/
   * resetPassword 四種模式共用同一個左圖右表單版型
   * ================================================================ */
  var authRoot = null;
  function ensureAuthRoot() {
    if (authRoot) return authRoot;
    authRoot = document.createElement('div');
    document.body.appendChild(authRoot);
    return authRoot;
  }
  /* main.css 的 input{font:inherit} 是全站通用重置，unlayered stylesheet
     優先權高於 utilities layer，只有 font 相關屬性（含 font-size/line-height）
     受影響，需要 ! 蓋過去；background/border/padding/color 不受這條
     影響，不用加 !（跟 <button> 的通用重置範圍不一樣，見 header 那次
     commit 記錄的 button 版本）。 */
  var AUTH_LABEL_CLS = 'block text-white font-bold text-[14px] mb-1.5';
  var AUTH_INPUT_CLS = 'w-full h-10.5 rounded-lg border border-white/15 bg-[#1e2450] text-white px-3.5 !text-[14px] placeholder:text-white/40';
  var AUTH_PW_INPUT_CLS = 'w-full h-10.5 rounded-lg border border-white/15 bg-[#1e2450] text-white pl-3.5 pr-10.5 !text-[14px] placeholder:text-white/40';
  function authPwToggleHtml() {
    return '<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" data-auth-pw-toggle><img src="' + icon('eye.svg') + '" alt="toggle" class="w-full h-full opacity-70"></button>';
  }
  var AUTH_FIELD = {
    username: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.username') + '</label><input type="text" class="' + AUTH_INPUT_CLS + '" data-auth-field="username" placeholder="' + t('auth.usernamePlaceholder') + '">',
    password: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.password') + '</label><div class="relative"><input type="password" class="' + AUTH_PW_INPUT_CLS + '" data-auth-field="password" placeholder="' + t('auth.passwordPlaceholder') + '">' + authPwToggleHtml() + '</div>',
    confirmPassword: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.confirmPassword') + '</label><div class="relative"><input type="password" class="' + AUTH_PW_INPUT_CLS + '" data-auth-field="confirmPassword" placeholder="' + t('auth.passwordPlaceholder') + '">' + authPwToggleHtml() + '</div>',
    newPassword: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.newPassword') + '</label><div class="relative"><input type="password" class="' + AUTH_PW_INPUT_CLS + '" data-auth-field="newPassword" placeholder="' + t('auth.newPasswordPlaceholder') + '">' + authPwToggleHtml() + '</div>',
    confirmNewPassword: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.confirmPassword') + '</label><div class="relative"><input type="password" class="' + AUTH_PW_INPUT_CLS + '" data-auth-field="confirmNewPassword" placeholder="' + t('auth.newPasswordPlaceholder') + '">' + authPwToggleHtml() + '</div>',
    email: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.email') + '</label><input type="text" class="' + AUTH_INPUT_CLS + '" data-auth-field="email" placeholder="' + t('auth.emailPlaceholder') + '">',
    realName: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.realName') + '</label><input type="text" class="' + AUTH_INPUT_CLS + '" data-auth-field="realName" placeholder="' + t('auth.realNamePlaceholder') + '">',
    mobile: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.mobile') + '</label><input type="text" class="' + AUTH_INPUT_CLS + '" data-auth-field="mobile" placeholder="' + t('auth.mobilePlaceholder') + '">',
    birthday: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.birthday') + '</label><input type="text" class="' + AUTH_INPUT_CLS + '" data-auth-field="birthday" placeholder="' + t('auth.birthdayPlaceholder') + '">',
    invitationCode: '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.invitationCode') + '</label><input type="text" class="' + AUTH_INPUT_CLS + '" data-auth-field="invitationCode" placeholder="' + t('auth.invitationCodePlaceholder') + '">',
  };
  function authCaptchaField() {
    return (
      '<label class="' + AUTH_LABEL_CLS + '">' + t('auth.captcha') + '</label>' +
      '<div class="flex items-center gap-2.5"><input type="text" class="' + AUTH_INPUT_CLS + ' flex-1" data-auth-field="captcha" placeholder="' + t('auth.captchaPlaceholder') + '">' +
      '<span class="shrink-0 w-21 h-10.5 rounded-lg bg-white text-navy font-bold italic tracking-[2px] flex items-center justify-center" data-auth-captcha-code></span></div>'
    );
  }
  function randomCaptcha() {
    var s = '';
    for (var i = 0; i < 5; i++) s += Math.floor(Math.random() * 10);
    return s;
  }
  var AUTH_TITLE_CLS = 'text-gradient text-center text-[22px] font-extrabold m-0 mb-1 pb-4 border-b-2 border-transparent [border-image:var(--g-primary)] [border-image-slice:1] md:text-left md:border-0 md:pb-0';
  /* .auth-btn 原本靠 line-height:44px 讓文字垂直置中(沒有另外設 padding),
     <button> 的 unlayered 重置是 font:inherit 完整簡寫,line-height 也包含
     在內,要用 ! 蓋過去,跟 font-size/font-weight 同一組。 */
  var AUTH_BTN_CLS = 'block w-full h-11 rounded-lg mt-4 text-center !leading-11 !font-bold !text-[15px]';
  var AUTH_BTN_OUTLINE_CLS = AUTH_BTN_CLS + ' !bg-transparent !border !border-pink !text-pink';
  var AUTH_BTN_FILL_CLS = AUTH_BTN_CLS + ' !bg-[image:var(--g-primary)] !text-navy';
  var AUTH_CHECKBOX_ROW_CLS = 'flex items-center gap-2 mt-4 text-white text-[13px] font-semibold';
  /* main.css 的 a{color:inherit;text-decoration:none} 也是 unlayered 全站
     重置,套用在真的有文字顏色/底線的 <a> 上時一樣要用 ! 蓋過去。 */
  var AUTH_FORGOT_LINK_CLS = 'block text-right mt-4 !text-white text-[13px] !underline cursor-pointer';
  function authModalBody(mode) {
    if (mode === 'register') {
      return (
        '<h2 class="' + AUTH_TITLE_CLS + '">' + t('auth.register') + '</h2>' +
        '<div class="mt-4">' + AUTH_FIELD.username + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.password + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.confirmPassword + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.email + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.realName + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.mobile + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.birthday + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.invitationCode + '</div>' +
        '<div class="mt-4">' + authCaptchaField() + '</div>' +
        '<label class="' + AUTH_CHECKBOX_ROW_CLS + '"><input type="checkbox" class="w-4.5 h-4.5 accent-pink" data-auth-field="agree"><span>' + t('auth.agreeTerms') + '</span></label>' +
        '<button type="button" class="' + AUTH_BTN_OUTLINE_CLS + '" data-auth-submit>' + t('common.submit') + '</button>' +
        '<button type="button" class="' + AUTH_BTN_FILL_CLS + '" data-auth-switch="login">' + t('auth.login') + '</button>'
      );
    }
    if (mode === 'forgotPassword') {
      return (
        '<h2 class="' + AUTH_TITLE_CLS + '">' + t('auth.forgotPassword') + '</h2>' +
        '<div class="mt-4">' + AUTH_FIELD.username + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.email + '</div>' +
        '<button type="button" class="' + AUTH_BTN_OUTLINE_CLS + '" data-auth-submit>' + t('common.submit') + '</button>'
      );
    }
    if (mode === 'resetPassword') {
      return (
        '<h2 class="' + AUTH_TITLE_CLS + '">' + t('auth.resetPassword') + '</h2>' +
        '<div class="mt-4">' + AUTH_FIELD.username + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.newPassword + '</div>' +
        '<div class="mt-4">' + AUTH_FIELD.confirmNewPassword + '</div>' +
        '<button type="button" class="' + AUTH_BTN_OUTLINE_CLS + '" data-auth-submit>' + t('common.submit') + '</button>'
      );
    }
    /* login(預設) */
    return (
      '<h2 class="' + AUTH_TITLE_CLS + '">' + t('auth.login') + '</h2>' +
      '<div class="mt-4">' + AUTH_FIELD.username + '</div>' +
      '<div class="mt-4">' + AUTH_FIELD.password + '</div>' +
      '<label class="' + AUTH_CHECKBOX_ROW_CLS + '"><input type="checkbox" class="w-4.5 h-4.5 accent-pink" data-auth-field="remember"><span>' + t('auth.remember') + '</span></label>' +
      '<button type="button" class="' + AUTH_BTN_OUTLINE_CLS + '" data-auth-submit>' + t('auth.login') + '</button>' +
      '<button type="button" class="' + AUTH_BTN_FILL_CLS + '" data-auth-switch="register">' + t('auth.register') + '</button>' +
      '<button type="button" class="' + AUTH_BTN_FILL_CLS + '" data-auth-promo-channel>' + t('auth.promotionChannel') + '</button>' +
      '<a class="' + AUTH_FORGOT_LINK_CLS + '" data-auth-switch="forgotPassword">' + t('auth.forgotPassword') + '?</a>'
    );
  }
  var AUTH_BACKDROP_CLS = 'fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-5 overflow-y-auto';
  var AUTH_MODAL_CLS = 'relative w-full max-w-[360px] max-h-[calc(100vh-40px)] overflow-y-auto bg-navy rounded-[20px] pt-8 px-5 pb-6 md:max-w-[700px] md:h-[600px] md:p-0 md:flex md:rounded-3xl md:overflow-hidden';
  function showAuthModal(mode) {
    var root = ensureAuthRoot();
    root.innerHTML =
      '<div class="' + AUTH_BACKDROP_CLS + '" data-auth-backdrop><div class="' + AUTH_MODAL_CLS + '">' +
      '<button type="button" class="absolute right-4 top-4 z-[2] w-5 h-5" data-auth-close><img src="' + icon('close.svg') + '" alt="close" class="w-full h-full brightness-0 invert md:filter-none"></button>' +
      '<div class="hidden md:block md:shrink-0 md:w-[46%]"><img src="' + IMG + 'index/login.webp" alt="win10096" class="w-full h-full object-cover"></div>' +
      '<div class="flex flex-col md:flex-1 md:pt-10 md:px-9 md:pb-8 md:overflow-y-auto md:h-full">' + authModalBody(mode) + '</div>' +
      '</div></div>';
    var captchaEl = qs('[data-auth-captcha-code]', root);
    if (captchaEl) captchaEl.textContent = randomCaptcha();
    on(qs('[data-auth-close]', root), 'click', function () { root.innerHTML = ''; });
    on(qs('[data-auth-backdrop]', root), 'click', function (e) { if (e.target === e.currentTarget) root.innerHTML = ''; });
    qsa('[data-auth-switch]', root).forEach(function (el) {
      on(el, 'click', function () { showAuthModal(el.getAttribute('data-auth-switch')); });
    });
    qsa('[data-auth-pw-toggle]', root).forEach(function (btn) {
      on(btn, 'click', function () {
        var input = btn.previousElementSibling;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.querySelector('img').src = show ? icon('eye-show.svg') : icon('eye.svg');
      });
    });
    on(qs('[data-auth-promo-channel]', root), 'click', function () {
      window.open('https://t.me/win10096cs', '_blank', 'noopener,noreferrer');
    });
    on(qs('[data-auth-submit]', root), 'click', function () {
      if (mode === 'forgotPassword') {
        root.innerHTML =
          '<div class="' + AUTH_BACKDROP_CLS + '" data-auth-backdrop><div class="' + AUTH_MODAL_CLS + '">' +
          '<button type="button" class="absolute right-4 top-4 z-[2] w-5 h-5" data-auth-close><img src="' + icon('close.svg') + '" alt="close" class="w-full h-full brightness-0 invert md:filter-none"></button>' +
          '<div class="hidden md:block md:shrink-0 md:w-[46%]"><img src="' + IMG + 'index/login.webp" alt="win10096" class="w-full h-full object-cover"></div>' +
          '<div class="flex flex-col md:flex-1 md:pt-10 md:px-9 md:pb-8 md:overflow-y-auto md:h-full">' +
          '<h2 class="' + AUTH_TITLE_CLS + '">' + t('auth.forgotPassword') + '</h2>' +
          '<p class="text-white text-[14px] text-center my-5">' + t('auth.forgotPasswordSent') + '</p>' +
          '<button type="button" class="' + AUTH_BTN_OUTLINE_CLS + '" data-auth-close>' + t('common.done') + '</button>' +
          '</div></div></div>';
        on(qs('[data-auth-close]', root), 'click', function () { root.innerHTML = ''; });
        return;
      }
      root.innerHTML = '';
      if (mode === 'login' || mode === 'register') {
        setLoggedIn(true);
        window.WIN15.showAlert({
          type: 'success',
          message: t(mode === 'login' ? 'auth.loginSuccess' : 'auth.registerSuccess'),
          onConfirm: function () { location.reload(); },
        });
        return;
      }
      window.WIN15.showAlert({ type: 'success', message: t('common.profileUpdateSuccess') });
    });
  }

  /* ================================================================
   * Chrome 掛載
   * ================================================================ */
  function mountChrome() {
    var headerMount = qs('[data-mount="header"]');
    var footerMount = qs('[data-mount="footer"]');
    var bottomNavMount = qs('[data-mount="bottom-nav"]');
    var quickSidebarMount = qs('[data-mount="quick-sidebar"]');
    var userNavbarMount = qs('[data-mount="user-navbar"]');
    var userSidebarMount = qs('[data-mount="user-sidebar"]');

    /* 會員中心頁面手機版改用 .user-navbar 當頂部列,靠這個 class 讓
       CSS 隱藏重複的 .site-header-mobile(見 main.css) */
    if (isUserCenterPage()) document.body.classList.add('is-usercenter');

    if (headerMount) { headerMount.outerHTML = headerHtml(); bindHeader(document); }
    /* 對照真實網站截圖:會員中心頁面不顯示頁尾(合作夥伴/免責聲明/版權),
       只有一般前台頁面才掛載;會員中心側欄比主內容區高時,頁尾殘留會跟
       側欄下半段重疊 */
    if (footerMount) {
      if (isUserCenterPage()) {
        footerMount.remove();
      } else {
        footerMount.outerHTML = footerHtml();
        bindNavLinks(document);
      }
    }
    /* 對照 BottomNavbar.vue syncActiveByRoute():showBottomNavbar = !path.startsWith('/usercenter/'),
       只有帳戶總覽(/usercenter 本身)例外仍顯示,其餘會員中心子頁一律不掛載 */
    if (bottomNavMount) {
      if (isUserCenterPage() && pageName() !== 'account') {
        bottomNavMount.remove();
      } else {
        bottomNavMount.outerHTML = bottomNavHtml();
        bindNavLinks(document);
      }
    }
    /* 對照真實網站截圖:只有儲值/提款這兩個交易頁面不顯示右下角浮動客服
       快速選單,其餘會員中心頁面(帳戶總覽/個人資料等)仍會掛載 */
    if (quickSidebarMount) {
      if (HIDE_QUICK_SIDEBAR_PAGES.indexOf(pageName()) !== -1) {
        quickSidebarMount.remove();
      } else {
        quickSidebarMount.outerHTML = quickSidebarHtml();
        bindQuickSidebar(document);
      }
    }
    if (userNavbarMount) userNavbarMount.outerHTML = userNavbarHtml();
    if (userSidebarMount) { userSidebarMount.outerHTML = userSidebarHtml(); bindNavLinks(document); }
    if (userNavbarMount || userSidebarMount) bindUserSidebar(document);
    bindLangSwitchers(document);
  }

  /* 紀錄頁「自動刷新倒數」共用元件(withdrawalRecord/depositRecord/withdrawalDetail
     皆為同一個 .record-refresh 標記):倒數歸零自動刷新並重置為 30 秒,點擊圖示
     則立即刷新並重置倒數,避免每頁各自重寫一份計時器 */
  function initAutoRefresh(onRefresh) {
    var el = qs('.record-refresh');
    if (!el) return;
    var secondsEl = qs('strong', el);
    var seconds = 30;
    function reset() {
      seconds = 30;
      secondsEl.textContent = seconds;
    }
    setInterval(function () {
      seconds -= 1;
      if (seconds <= 0) {
        seconds = 30;
        onRefresh();
      }
      secondsEl.textContent = seconds;
    }, 1000);
    on(qs('[data-refresh-btn]', el), 'click', function () {
      reset();
      onRefresh();
    });
  }

  /* 日期範圍選擇器(對照 components/DateRangePicker.vue:PrimeVue DatePicker
     selectionMode="range" + showButtonBar 快速鍵,桌機雙月曆/手機單月曆,
     不可選未來日期)。btn 為 .record-date-btn 元素,onApply(startDate,endDate)
     於按下確認時呼叫。 */
  function initDateRangePicker(btn, onApply) {
    if (!btn) return;
    var WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    function fmt(d) {
      function pad(n) { return String(n).padStart(2, '0'); }
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }
    function sameDay(a, b) { return a && b && fmt(a) === fmt(b); }
    function parseBtnRange() {
      var m = (btn.textContent || '').trim().match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
      if (!m) return null;
      return [new Date(m[1]), new Date(m[2])];
    }
    function isoWeekStart(d) {
      var x = new Date(d);
      x.setHours(0, 0, 0, 0);
      var day = x.getDay() || 7;
      x.setDate(x.getDate() - (day - 1));
      return x;
    }

    var initial = parseBtnRange();
    var pendingStart = initial ? initial[0] : null;
    var pendingEnd = initial ? initial[1] : null;
    var viewYear = (pendingStart || today).getFullYear();
    var viewMonth = (pendingStart || today).getMonth();

    var panel = document.createElement('div');
    panel.className = 'fixed z-[260] w-[min(320px,calc(100vw-24px))] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] p-3 md:w-[552px]';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="flex gap-4"><div class="flex-1 min-w-0" data-dr-grid="0"></div><div class="flex-1 min-w-0 hidden md:block" data-dr-grid="1"></div></div>' +
      '<div class="flex flex-wrap gap-2 pt-3 mt-3 border-t border-border">' +
      '<button type="button" class="!py-1.5 !px-2.5 rounded-lg !border !border-border !text-navy !text-[12px]" data-dr-quick="today">' + t('common.dateRange.today') + '</button>' +
      '<button type="button" class="!py-1.5 !px-2.5 rounded-lg !border !border-border !text-navy !text-[12px]" data-dr-quick="yesterday">' + t('common.dateRange.yesterday') + '</button>' +
      '<button type="button" class="!py-1.5 !px-2.5 rounded-lg !border !border-border !text-navy !text-[12px]" data-dr-quick="thisWeek">' + t('common.dateRange.thisWeek') + '</button>' +
      '<button type="button" class="!py-1.5 !px-2.5 rounded-lg !border !border-border !text-navy !text-[12px]" data-dr-quick="lastWeek">' + t('common.dateRange.lastWeek') + '</button>' +
      '<button type="button" class="!py-1.5 !px-2.5 rounded-lg !border !border-border !text-navy !text-[12px]" data-dr-quick="lastMonth">' + t('common.dateRange.lastMonth') + '</button>' +
      '</div>' +
      '<div class="flex justify-end gap-2 mt-3 pt-3 border-t border-border">' +
      '<button type="button" class="h-8.5 rounded-lg !px-4 !font-bold !text-[13px] !text-navy !border !border-border" data-dr-clear>' + t('common.reset') + '</button>' +
      '<button type="button" class="h-8.5 rounded-lg !px-4 !font-bold !text-[13px] !bg-[image:var(--g-primary)] !text-navy" data-dr-apply>' + t('common.confirm') + '</button>' +
      '</div>';
    document.body.appendChild(panel);

    function monthCaption(y, m) { return y + '.' + String(m + 1).padStart(2, '0'); }

    function buildGrid(y, m) {
      var first = new Date(y, m, 1);
      var startOffset = (first.getDay() || 7) - 1; /* 週一為第一天 */
      var gridStart = new Date(y, m, 1 - startOffset);
      var cells = [];
      for (var i = 0; i < 42; i++) {
        var d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        cells.push(d);
      }
      return cells;
    }

    /* 導覽箭頭對照真實雙月曆呈現方式,附著在各自月曆頭部(左月曆左上/右
       月曆右上),而非合併成單一橫列;gridIndex 0 額外補一顆手機專用的
       「下一月」箭頭(桌機隱藏),讓手機只顯示一個月曆時仍能雙向翻頁 */
    function renderGrid(gridEl, y, m, gridIndex) {
      var cells = buildGrid(y, m);
      var navCls = 'w-7 h-7 rounded-lg !text-navy !font-bold shrink-0 hover:!bg-[#f2f2f2]';
      var titleCls = 'flex-1 text-center text-navy font-bold text-[13px]';
      var head = gridIndex === 0
        ? '<button type="button" class="' + navCls + '" data-dr-prev>‹</button><span class="' + titleCls + '">' + monthCaption(y, m) + '</span><button type="button" class="' + navCls + ' visible md:invisible" data-dr-next>›</button>'
        : '<span class="' + titleCls + '">' + monthCaption(y, m) + '</span><button type="button" class="' + navCls + '" data-dr-next>›</button>';
      var html = '<div class="flex items-center justify-between mb-1.5">' + head + '</div>' +
        '<div class="grid grid-cols-7 gap-0.5">' + WEEKDAYS.map(function (w) { return '<span class="text-center text-[#9ca3af] text-[11px] py-1">' + w + '</span>'; }).join('') + '</div>' +
        '<div class="grid grid-cols-7 gap-0.5">' + cells.map(function (d) {
          var isCurrentMonth = d.getMonth() === m;
          var isDisabled = d.getTime() > today.getTime();
          var isRangeEdge = (pendingStart && sameDay(d, pendingStart)) || (pendingEnd && sameDay(d, pendingEnd));
          var isInRange = pendingStart && pendingEnd && d.getTime() > pendingStart.getTime() && d.getTime() < pendingEnd.getTime();
          var stateCls;
          if (isRangeEdge) {
            stateCls = '!bg-navy !text-white !font-bold';
          } else if (isInRange) {
            stateCls = '!bg-[#e7e7e7] !text-[#334155] !rounded-none';
          } else if (isDisabled) {
            stateCls = '!text-[#e5e7eb] !cursor-not-allowed';
          } else if (!isCurrentMonth) {
            stateCls = '!text-[#d1d5db] hover:!bg-[#f2f2f2]';
          } else {
            stateCls = '!text-navy hover:!bg-[#f2f2f2]';
          }
          var cls = 'aspect-square w-full rounded-lg !text-[12px] ' + stateCls;
          return '<button type="button" class="' + cls + '" data-dr-day="' + fmt(d) + '"' + (isDisabled ? ' disabled' : '') + '>' + d.getDate() + '</button>';
        }).join('') + '</div>';
      gridEl.innerHTML = html;
      qsa('[data-dr-day]:not([disabled])', gridEl).forEach(function (dayBtn) {
        on(dayBtn, 'click', function () {
          var d = new Date(dayBtn.getAttribute('data-dr-day'));
          if (!pendingStart || (pendingStart && pendingEnd)) {
            pendingStart = d;
            pendingEnd = null;
          } else if (d.getTime() < pendingStart.getTime()) {
            pendingEnd = pendingStart;
            pendingStart = d;
          } else {
            pendingEnd = d;
          }
          renderPanel();
        });
      });
      qsa('[data-dr-prev]', gridEl).forEach(function (btn) {
        on(btn, 'click', function () {
          viewMonth -= 1;
          if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
          renderPanel();
        });
      });
      qsa('[data-dr-next]', gridEl).forEach(function (btn) {
        on(btn, 'click', function () {
          viewMonth += 1;
          if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
          renderPanel();
        });
      });
    }

    function renderPanel() {
      renderGrid(qs('[data-dr-grid="0"]', panel), viewYear, viewMonth, 0);
      var nextY = viewMonth + 1 > 11 ? viewYear + 1 : viewYear;
      var nextM = viewMonth + 1 > 11 ? 0 : viewMonth + 1;
      renderGrid(qs('[data-dr-grid="1"]', panel), nextY, nextM, 1);
    }

    function setRange(start, end) {
      pendingStart = start;
      pendingEnd = end;
      viewYear = start.getFullYear();
      viewMonth = start.getMonth();
      renderPanel();
    }

    on(qs('[data-dr-quick="today"]', panel), 'click', function () { setRange(new Date(today), new Date(today)); });
    on(qs('[data-dr-quick="yesterday"]', panel), 'click', function () {
      var d = new Date(today); d.setDate(d.getDate() - 1);
      setRange(d, new Date(d));
    });
    on(qs('[data-dr-quick="thisWeek"]', panel), 'click', function () {
      var start = isoWeekStart(today);
      var end = new Date(start); end.setDate(end.getDate() + 6);
      setRange(start, end.getTime() > today.getTime() ? new Date(today) : end);
    });
    on(qs('[data-dr-quick="lastWeek"]', panel), 'click', function () {
      var thisStart = isoWeekStart(today);
      var start = new Date(thisStart); start.setDate(start.getDate() - 7);
      var end = new Date(start); end.setDate(end.getDate() + 6);
      setRange(start, end);
    });
    on(qs('[data-dr-quick="lastMonth"]', panel), 'click', function () {
      var firstThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      var start = new Date(firstThisMonth.getFullYear(), firstThisMonth.getMonth() - 1, 1);
      var end = new Date(firstThisMonth.getFullYear(), firstThisMonth.getMonth(), 0);
      setRange(start, end);
    });
    on(qs('[data-dr-clear]', panel), 'click', function () {
      pendingStart = null;
      pendingEnd = null;
      renderPanel();
    });
    on(qs('[data-dr-apply]', panel), 'click', function () {
      if (pendingStart) {
        var end = pendingEnd || pendingStart;
        btn.textContent = fmt(pendingStart) + ' ~ ' + fmt(end);
        if (typeof onApply === 'function') onApply(pendingStart, end);
      }
      closePanel();
    });

    function positionPanel() {
      var r = btn.getBoundingClientRect();
      var panelWidth = panel.offsetWidth || 320;
      var left = Math.min(r.left, window.innerWidth - panelWidth - 12);
      panel.style.top = (r.bottom + 6) + 'px';
      panel.style.left = Math.max(12, left) + 'px';
    }
    function openPanel() {
      renderPanel();
      panel.hidden = false;
      positionPanel();
      document.addEventListener('click', onOutsideClick, true);
    }
    function closePanel() {
      panel.hidden = true;
      document.removeEventListener('click', onOutsideClick, true);
    }
    function onOutsideClick(e) {
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      closePanel();
    }
    on(btn, 'click', function (e) {
      e.stopPropagation();
      if (panel.hidden) openPanel();
      else closePanel();
    });
    window.addEventListener('resize', function () { if (!panel.hidden) positionPanel(); }, { passive: true });
  }

  window.WIN15 = {
    t: t,
    currentLocale: currentLocale,
    setLocale: setLocale,
    applyLocale: applyLocale,
    pageName: pageName,
    icon: icon,
    IMG: IMG,
    qs: qs,
    qsa: qsa,
    on: on,
    showAlert: showAlert,
    showAuthModal: showAuthModal,
    initAutoRefresh: initAutoRefresh,
    initDateRangePicker: initDateRangePicker,
  };

  document.addEventListener('DOMContentLoaded', function () {
    mountChrome();
    applyLocale();
    if (typeof window.WIN15_PAGE_INIT === 'function') window.WIN15_PAGE_INIT();
  });
})();
