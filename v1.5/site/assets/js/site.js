/**
 * CMS_前台_v1.5 — 行為層(vanilla JS,無框架)。
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
  var LOCALE_CODES = ['ko', 'en'];

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function pageName() {
    var seg = (location.pathname.split('/').pop() || 'index.html');
    return seg.replace(/\.html?$/, '') || 'index';
  }
  function icon(name) { return IMG + 'icon/' + name; }

  function currentLocale() {
    try {
      var saved = localStorage.getItem(LOCALE_KEY);
      return LOCALE_CODES.indexOf(saved) !== -1 ? saved : 'ko';
    } catch (e) { return 'ko'; }
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
    document.documentElement.setAttribute('lang', loc === 'ko' ? 'ko' : 'en');
    qsa('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    qsa('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    var entry = (D.LANGUAGES || []).filter(function (l) { return l.code === loc; })[0];
    qsa('[data-locale-label]').forEach(function (el) { el.textContent = entry ? entry.label : loc; });
  }

  /* ================================================================
   * Navbar(components/Navbar.vue)
   * ================================================================ */
  function mobileMenuItemHtml(item, isTop) {
    return (
      '<button type="button" class="mobile-menu-item" data-nav-key="' + item.key + '" data-nav-href="' + item.url + '">' +
      '<img src="' + icon(item.icon) + '" alt="' + item.key + '">' +
      '<span data-i18n="' + item.tKey + '">' + t(item.tKey) + '</span>' +
      '</button>'
    );
  }

  function headerHtml() {
    var profile = D.MOCK_PROFILE;
    var isUserCenter = /^\/v1\.5\/site\/(account|deposit|withdrawal|betting-record|deposit-record|profit-loss|withdrawal-record|withdrawal-detail|account-record|banking-details|personal-info|security|change-password|transaction-info)/.test(location.pathname) || ['account', 'deposit', 'withdrawal', 'betting-record', 'deposit-record', 'profit-loss', 'withdrawal-record', 'withdrawal-detail', 'account-record', 'banking-details', 'personal-info', 'security', 'change-password', 'transaction-info'].indexOf(pageName()) !== -1;

    var mobileTop = D.MOBILE_TOP_ITEMS.map(function (i) { return mobileMenuItemHtml(i, true); }).join('');
    var mobileBottom = D.MOBILE_BOTTOM_ITEMS.map(function (i) { return mobileMenuItemHtml(i, false); }).join('');

    var mobileAccount = profile
      ? '<div class="mobile-menu-account"><div><div style="display:flex;align-items:center;gap:8px"><span class="lv-badge">' + profile.player_level_id + '</span><span class="username">' + profile.username + '</span></div><p class="balance">' + profile.balance + '</p></div>' +
        '<button type="button" data-logout><img src="' + icon('exit.svg') + '" alt="exit" style="width:24px;height:24px"></button></div>'
      : '<div class="mobile-menu-auth">' +
        '<button type="button" class="pill-outline-btn border-gradient-pill" data-open-auth="login"><span class="text-gradient" data-i18n="auth.login">' + t('auth.login') + '</span></button>' +
        '<button type="button" class="pill-outline-btn border-gradient-pill" data-open-auth="register"><span class="text-gradient" data-i18n="auth.register">' + t('auth.register') + '</span></button>' +
        '</div>';

    var desktopAccount = profile
      ? '<div class="header-user-block">' +
        '<div class="header-user-id"><img src="' + icon('user.svg') + '" alt="user"><span>ID: ' + profile.username + '</span>' +
        '<div class="header-user-dropdown"><button type="button" data-href="deposit.html" data-i18n="userCenter.deposit">' + t('userCenter.deposit') + '</button><button type="button" data-href="withdrawal.html" data-i18n="userCenter.withdrawal">' + t('userCenter.withdrawal') + '</button><button type="button" data-href="account.html" data-i18n="userCenter.myAccount">' + t('userCenter.myAccount') + '</button></div>' +
        '</div>' +
        '<span class="header-level-badge">' + profile.player_level_name + '</span>' +
        '<div class="header-balance-block">' +
        '<div class="header-balance-row"><span class="label" data-i18n="navbar.balance">' + t('navbar.balance') + '</span><span class="value">' + profile.balance + '</span></div>' +
        '<div class="header-balance-row"><span class="label" data-i18n="navbar.points">' + t('navbar.points') + '</span><span class="value">' + profile.point_balance + '</span></div>' +
        '</div>' +
        '<button type="button" class="header-logout-btn" data-logout><img src="' + icon('exit.svg') + '" alt="exit"></button>' +
        '</div>'
      : '<div class="header-auth-buttons">' +
        '<button type="button" class="header-auth-btn" data-open-auth="login" data-i18n="auth.login">' + t('auth.login') + '</button>' +
        '<button type="button" class="header-auth-btn" data-open-auth="register" data-i18n="auth.register">' + t('auth.register') + '</button>' +
        '</div>';

    var langSwitcherDesktop =
      '<div class="header-lang-switcher" data-lang-switcher>' +
      '<button type="button" class="header-lang-trigger" data-lang-trigger>' +
      '<img src="' + icon('lang-us.svg') + '" alt="lang" style="width:16px;height:16px">' +
      '<span data-locale-label>' + ((D.LANGUAGES || []).filter(function (l) { return l.code === currentLocale(); })[0] || {}).label + '</span>' +
      '<img src="' + icon('arrowDown.svg') + '" alt="" style="width:12px;height:12px"></button>' +
      '<div class="header-lang-panel">' +
      (D.LANGUAGES || []).map(function (l) {
        return '<button type="button" data-set-locale="' + l.code + '"><img src="' + icon(l.image) + '" alt="' + l.code + '"><span>' + l.label + '</span></button>';
      }).join('') +
      '</div></div>';

    var desktopNav = D.DESKTOP_NAV.map(function (item) {
      return '<div class="header-nav-link" data-nav-key="' + item.key + '" data-nav-href="' + item.url + '"><span data-i18n="' + item.tKey + '">' + t(item.tKey) + '</span></div>';
    }).join('');

    return (
      '<header class="site-header">' +
      '<div class="site-header-mobile">' +
      '<a href="index.html" class="brand-link"><img src="' + IMG + 'index/img-logo.png" alt="logo" class="brand-logo"></a>' +
      '<button type="button" class="header-menu-btn" data-toggle-mobile-menu><img src="' + icon('menu.svg') + '" alt="menu"></button>' +
      '</div>' +
      '<div class="mobile-menu-panel" data-mobile-menu>' +
      '<div class="mobile-menu-top">' + mobileTop + '</div>' +
      '<div class="mobile-menu-bottom-grid">' + mobileBottom + '</div>' +
      mobileAccount +
      '</div>' +
      '<div class="site-header-desktop">' +
      '<div class="site-header-desktop-inner' + (isUserCenter ? ' is-usercenter' : '') + '">' +
      '<div class="header-logo-col"><a href="index.html"><img src="' + IMG + 'index/img-logo.png" alt="logo"></a></div>' +
      '<div class="header-main-col">' +
      '<div class="header-account-row">' + desktopAccount + langSwitcherDesktop + '</div>' +
      '<nav class="header-nav-row">' + desktopNav + '</nav>' +
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
      on(el, 'click', function () { location.href = 'index.html'; });
    });

    var langSwitcher = qs('[data-lang-switcher]', root);
    var langTrigger = qs('[data-lang-trigger]', root);
    on(langTrigger, 'click', function (e) {
      e.stopPropagation();
      langSwitcher.classList.toggle('is-open');
    });
    qsa('[data-set-locale]', root).forEach(function (el) {
      on(el, 'click', function () {
        setLocale(el.getAttribute('data-set-locale'));
        langSwitcher.classList.remove('is-open');
      });
    });
    on(document, 'click', function () { if (langSwitcher) langSwitcher.classList.remove('is-open'); });

    qsa('[data-open-auth]', root).forEach(function (el) {
      on(el, 'click', function () { window.alert('此為靜態設計預覽,登入/註冊表單尚未實作。'); });
    });
  }

  function syncActiveNav(root) {
    var current = pageName();
    var currentType = new URLSearchParams(location.search).get('type');
    qsa('[data-nav-key]', root).forEach(function (el) {
      var href = el.getAttribute('data-nav-href') || '';
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
      return '<img src="' + IMG + 'footer/' + name + '" alt="footer">';
    }).join('');
    return (
      '<footer class="site-footer">' +
      '<div class="footer-marquee"><div class="footer-marquee-track">' + imgs + imgs + '</div></div>' +
      '<div class="footer-lang">' +
      '<div class="header-lang-switcher" data-lang-switcher>' +
      '<button type="button" class="footer-lang-trigger" data-lang-trigger>' +
      '<img src="' + icon('lang-us.svg') + '" alt="lang" style="width:20px;height:20px">' +
      '<span data-locale-label>' + ((D.LANGUAGES || []).filter(function (l) { return l.code === currentLocale(); })[0] || {}).label + '</span></button>' +
      '<div class="header-lang-panel">' +
      (D.LANGUAGES || []).map(function (l) {
        return '<button type="button" data-set-locale="' + l.code + '"><img src="' + icon(l.image) + '" alt="' + l.code + '"><span>' + l.label + '</span></button>';
      }).join('') +
      '</div></div></div>' +
      '<div class="footer-logo-row"><img src="' + IMG + 'index/img-logo.png" alt="logo"></div>' +
      '<div class="footer-copy">' +
      '<p data-i18n="footer.desc">' + t('footer.desc') + '</p>' +
      '<p data-i18n="footer.desc2">' + t('footer.desc2') + '</p>' +
      '<p class="copyright" data-i18n="footer.copyright">' + t('footer.copyright') + '</p>' +
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
        '<li><button type="button" class="mobile-bottom-nav-item" data-nav-key="' + item.key + '" data-nav-href="' + item.url + '">' +
        '<img src="' + icon(item.icon) + '" alt="' + item.key + '">' +
        '<span data-i18n="' + item.tKey + '">' + t(item.tKey) + '</span></button></li>'
      );
    }).join('');
    return '<nav class="mobile-bottom-nav"><ul class="mobile-bottom-nav-list">' + items + '</ul></nav>';
  }

  /* ================================================================
   * 浮動客服/活動 SideBar(components/SideBar.vue)
   * ================================================================ */
  function quickSidebarHtml() {
    var rightItems = [
      { icon: 'sidebar-service.svg', menu: ['문의(라이브채팅)'] },
      { icon: 'sidebar-telegram.svg', menu: ['문의(텔레그램)'] },
      { icon: 'sidebar-helps.svg', menu: ['자주 묻는 질문'] },
    ];
    var rightHtml = rightItems.map(function (item, i) {
      return (
        '<div class="quick-sidebar-item" data-quick-item="' + i + '">' +
        '<button type="button" class="quick-sidebar-btn"><img src="' + icon(item.icon) + '" alt=""></button>' +
        '<div class="quick-sidebar-popover">' + item.menu.map(function (m) { return '<button type="button">' + m + '</button>'; }).join('') + '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="quick-sidebar-right"><div class="quick-sidebar-right-inner">' + rightHtml + '</div></div>' +
      '<div class="quick-sidebar-left" data-quick-left>' +
      '<button type="button" class="quick-toggle-btn" data-quick-toggle><img src="' + icon('sidebar-up.svg') + '" alt="toggle"></button>' +
      '<div class="quick-left-items"><img src="' + IMG + 'icon/sidebar-gifts.png" alt="gift"></div>' +
      '<button type="button" class="quick-toggle-btn" data-quick-close><img src="' + icon('sidebar-close.svg') + '" alt="close"></button>' +
      '</div>'
    );
  }

  function bindQuickSidebar(root) {
    qsa('[data-quick-item]', root).forEach(function (item) {
      on(item, 'mouseenter', function () { item.classList.add('is-open'); });
      on(item, 'mouseleave', function () { item.classList.remove('is-open'); });
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
   * Chrome 掛載
   * ================================================================ */
  function mountChrome() {
    var headerMount = qs('[data-mount="header"]');
    var footerMount = qs('[data-mount="footer"]');
    var bottomNavMount = qs('[data-mount="bottom-nav"]');
    var quickSidebarMount = qs('[data-mount="quick-sidebar"]');

    if (headerMount) { headerMount.outerHTML = headerHtml(); bindHeader(document); }
    if (footerMount) { footerMount.outerHTML = footerHtml(); bindNavLinks(document); }
    if (bottomNavMount) { bottomNavMount.outerHTML = bottomNavHtml(); bindNavLinks(document); }
    if (quickSidebarMount) { quickSidebarMount.outerHTML = quickSidebarHtml(); bindQuickSidebar(document); }
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
  };

  document.addEventListener('DOMContentLoaded', function () {
    mountChrome();
    applyLocale();
    if (typeof window.WIN15_PAGE_INIT === 'function') window.WIN15_PAGE_INIT();
  });
})();
