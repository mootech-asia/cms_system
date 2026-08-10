// CMS_前台_v4 — 語系切換（vanilla，無框架、無 build）。
// 範圍：僅共用介面文字（導覽／登入註冊登出／頁尾／公告／客服／合作廠商標題），
// 不含各頁面獨有內容（首頁文案、遊戲/表格資料等），與 site.js 約定：
//   - 靜態 HTML 文字：加 data-i18n="key" 由 applyLocale() 掃描替換 textContent。
//   - site.js 動態產生的區塊（header-auth／手機選單／登入註冊彈窗／客服彈窗）：
//     直接呼叫 window.CMS_I18N.t(key) 取字串,渲染時就是當前語系,不需另外掃描。
(function () {
  'use strict';

  var LOCALE_KEY = 'cms-v4:locale';
  var DEFAULT_LOCALE = 'zh';
  var LOCALES = [
    { id: 'zh', label: '中文' },
    { id: 'en', label: 'English' },
    { id: 'ko', label: '한국어' },
    { id: 'th', label: 'ไทย' },
  ];

  var STRINGS = {
    'nav.lobby': { zh: '大廳', en: 'Lobby', ko: '로비', th: 'ล็อบบี้' },
    'nav.slots': { zh: '老虎機', en: 'Slots', ko: '슬롯', th: 'สล็อต' },
    'nav.live': { zh: '真人娛樂', en: 'Live Casino', ko: '라이브 카지노', th: 'คาสิโนสด' },
    'nav.electronic': { zh: '電子遊戲', en: 'Electronic Games', ko: '전자 게임', th: 'เกมอิเล็กทรอนิกส์' },
    'nav.fish': { zh: '捕魚達人', en: 'Fishing Master', ko: '낚시의 달인', th: 'เซียนยิงปลา' },
    'nav.sport': { zh: '體育', en: 'Sports', ko: '스포츠', th: 'กีฬา' },
    'nav.promotion': { zh: '優惠活動', en: 'Promotions', ko: '프로모션', th: 'โปรโมชั่น' },
    'nav.deposit': { zh: '儲值', en: 'Deposit', ko: '충전', th: 'เติมเงิน' },
    'nav.member': { zh: '會員', en: 'Account', ko: '계정', th: 'บัญชี' },
    'nav.menu': { zh: '選單', en: 'Menu', ko: '메뉴', th: 'เมนู' },

    'auth.registerNow': { zh: '立即註冊', en: 'Register Now', ko: '지금 가입', th: 'ลงทะเบียนเลย' },
    'auth.usernamePlaceholder': { zh: '用戶名', en: 'Username', ko: '사용자명', th: 'ชื่อผู้ใช้' },
    'auth.passwordPlaceholder': { zh: '密碼', en: 'Password', ko: '비밀번호', th: 'รหัสผ่าน' },
    'auth.forgot': { zh: '忘記密碼', en: 'Forgot?', ko: '비밀번호를 잊으셨나요?', th: 'ลืมรหัสผ่าน' },
    'auth.login': { zh: '登錄', en: 'Login', ko: '로그인', th: 'เข้าสู่ระบบ' },
    'auth.register': { zh: '註冊', en: 'Register', ko: '가입하기', th: 'ลงทะเบียน' },
    'auth.logout': { zh: '登出', en: 'Logout', ko: '로그아웃', th: 'ออกจากระบบ' },
    'auth.balancePrefix': { zh: '餘額：', en: 'Balance: ', ko: '잔액: ', th: 'ยอดเงิน: ' },
    'auth.usernameLabel': { zh: '用戶名', en: 'Username', ko: '사용자명', th: 'ชื่อผู้ใช้' },
    'auth.usernameInputPlaceholder': { zh: '請輸入用戶名', en: 'Enter your username', ko: '사용자명을 입력하세요', th: 'กรุณากรอกชื่อผู้ใช้' },
    'auth.passwordLabel': { zh: '密碼', en: 'Password', ko: '비밀번호', th: 'รหัสผ่าน' },
    'auth.passwordInputPlaceholder': { zh: '請輸入密碼', en: 'Enter your password', ko: '비밀번호를 입력하세요', th: 'กรุณากรอกรหัสผ่าน' },
    'auth.confirmPasswordLabel': { zh: '確認密碼', en: 'Confirm Password', ko: '비밀번호 확인', th: 'ยืนยันรหัสผ่าน' },
    'auth.confirmPasswordPlaceholder': { zh: '請再次輸入密碼', en: 'Re-enter your password', ko: '비밀번호를 다시 입력하세요', th: 'กรุณากรอกรหัสผ่านอีกครั้ง' },

    'notice.message': {
      zh: '公告：系統將於今日凌晨進行例行維護，期間下注功能將暫停使用，造成不便敬請見諒。',
      en: 'Notice: The system will undergo scheduled maintenance early this morning. Betting will be temporarily unavailable during this time. We apologize for the inconvenience.',
      ko: '공지: 시스템은 오늘 새벽 정기 점검을 진행합니다. 점검 기간 동안 베팅 기능이 일시 중단되니 이용에 불편을 드려 죄송합니다.',
      th: 'ประกาศ: ระบบจะทำการปรับปรุงตามปกติในช่วงเช้าตรู่ของวันนี้ ฟังก์ชันการเดิมพันจะถูกระงับชั่วคราวในช่วงเวลาดังกล่าว ขออภัยในความไม่สะดวก',
    },
    'notice.faq': { zh: '常見問題', en: 'FAQ', ko: '자주 묻는 질문', th: 'คำถามที่พบบ่อย' },
    'notice.liveChat': { zh: '線上客服', en: 'Live Chat', ko: '실시간 상담', th: 'แชทสด' },

    'cs.title': { zh: '聯絡客服', en: 'Contact Support', ko: '고객센터 문의', th: 'ติดต่อฝ่ายบริการลูกค้า' },
    'cs.liveChatTitle': { zh: '線上客服', en: 'Live Chat', ko: '실시간 상담', th: 'แชทสด' },
    'cs.liveChatDesc': { zh: '24 小時即時支援', en: '24/7 instant support', ko: '24시간 실시간 지원', th: 'บริการด่วน 24 ชม.' },
    'cs.telegramTitle': { zh: 'Telegram 頻道', en: 'Telegram Channel', ko: 'Telegram 채널', th: 'ช่อง Telegram' },
    'cs.telegramDesc': { zh: '最新活動與公告', en: 'Latest promos & announcements', ko: '최신 이벤트 및 공지', th: 'โปรโมชันและประกาศล่าสุด' },
    'cs.emailTitle': { zh: 'Email 信箱', en: 'Email', ko: '이메일', th: 'อีเมล' },

    'footer.disclaimer1': {
      zh: '博彩可能造成成癮，請理性遊玩。如需支援資訊，請前往責任博彩協助頁面。',
      en: 'Gambling can be addictive. Please play responsibly. For support resources, please visit the responsible gambling help page.',
      ko: '도박은 중독될 수 있습니다. 책임감 있게 즐겨주세요. 지원 정보가 필요하시면 책임감 있는 게임 도움 페이지를 방문해주세요.',
      th: 'การพนันอาจก่อให้เกิดการเสพติด กรุณาเล่นอย่างมีความรับผิดชอบ หากต้องการข้อมูลช่วยเหลือ กรุณาไปที่หน้าช่วยเหลือการพนันอย่างมีความรับผิดชอบ',
    },
    'footer.disclaimer2': {
      zh: '當您存取、繼續使用或瀏覽本站，即表示您同意我們使用部分瀏覽器 Cookie，以改善您的使用體驗。',
      en: 'By accessing, continuing to use, or browsing this site, you agree to our use of certain browser cookies to improve your experience.',
      ko: '본 사이트에 접속, 계속 이용 또는 열람하시면 더 나은 이용 경험을 위해 일부 브라우저 쿠키를 사용하는 것에 동의하시는 것으로 간주됩니다.',
      th: 'การเข้าถึง ใช้งานต่อ หรือเข้าชมเว็บไซต์นี้ ถือว่าคุณยินยอมให้เราใช้คุกกี้บางส่วนของเบราว์เซอร์เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ',
    },
    'footer.copyright': {
      zh: '© 2026 Bet100 版權所有，受法律保護。本站僅供介面展示，不涉及任何實際投注行為。',
      en: '© 2026 Bet100. All rights reserved. This site is for interface demonstration purposes only and does not involve any real wagering.',
      ko: '© 2026 Bet100. 모든 권리 보유. 본 사이트는 인터페이스 시연 용도로만 제공되며, 실제 베팅 행위와는 무관합니다.',
      th: '© 2026 Bet100 สงวนสิทธิ์ทุกประการ เว็บไซต์นี้ใช้เพื่อสาธิตอินเทอร์เฟซเท่านั้น ไม่มีการพนันจริงเกิดขึ้น',
    },
    'footer.backToHub': { zh: '回到 CMS 統一預覽', en: 'Back to CMS Overview', ko: 'CMS 통합 미리보기로 돌아가기', th: 'กลับไปที่ภาพรวม CMS' },

    'vendor.title': { zh: '合作廠商', en: 'Our Partners', ko: '제휴 파트너', th: 'พันธมิตรของเรา' },

    'lang.label': { zh: '語言', en: 'Language', ko: '언어', th: 'ภาษา' },
  };

  function getLocale() {
    var saved;
    try { saved = localStorage.getItem(LOCALE_KEY); } catch (e) { saved = null; }
    return LOCALES.some(function (l) { return l.id === saved; }) ? saved : DEFAULT_LOCALE;
  }
  function setLocale(id) {
    if (!LOCALES.some(function (l) { return l.id === id; })) return;
    try { localStorage.setItem(LOCALE_KEY, id); } catch (e) {}
    applyLocale();
  }
  function t(key) {
    var entry = STRINGS[key];
    if (!entry) return key;
    var locale = getLocale();
    return entry[locale] || entry[DEFAULT_LOCALE] || key;
  }

  function applyLocale() {
    var locale = getLocale();
    document.documentElement.setAttribute('lang', locale === 'zh' ? 'zh-Hant' : locale);
    Array.prototype.slice.call(document.querySelectorAll('[data-i18n]')).forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    Array.prototype.slice.call(document.querySelectorAll('[data-i18n-placeholder]')).forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    var currentLabelEls = document.querySelectorAll('[data-lang-current]');
    Array.prototype.slice.call(currentLabelEls).forEach(function (el) {
      var found = LOCALES.filter(function (l) { return l.id === locale; })[0];
      el.textContent = found ? found.label : locale;
    });
    Array.prototype.slice.call(document.querySelectorAll('[data-lang-option]')).forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang-option') === locale);
    });
    // 讓 site.js 重繪目前已掛載的動態區塊（header-auth 等）跟著換語系；
    // 尚未開啟的彈窗/選單本來就會在下次渲染時透過 t() 取得當前語系,不需另外處理。
    document.dispatchEvent(new CustomEvent('cms-v4:locale-changed', { detail: { locale: locale } }));
  }

  function closeLangMenu(root) {
    var menu = root.querySelector('[data-lang-menu]');
    var trigger = root.querySelector('[data-lang-trigger]');
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
  function initLangSwitcher() {
    Array.prototype.slice.call(document.querySelectorAll('[data-lang-root]')).forEach(function (root) {
      var trigger = root.querySelector('[data-lang-trigger]');
      var menu = root.querySelector('[data-lang-menu]');
      if (!trigger || !menu) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = !menu.hidden;
        // 同一頁可能有桌機/手機兩份切換器,開一個要把其他關起來。
        Array.prototype.slice.call(document.querySelectorAll('[data-lang-root]')).forEach(function (r) { closeLangMenu(r); });
        menu.hidden = isOpen;
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
      Array.prototype.slice.call(menu.querySelectorAll('[data-lang-option]')).forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          setLocale(btn.getAttribute('data-lang-option'));
          closeLangMenu(root);
        });
      });
    });
    document.addEventListener('click', function () {
      Array.prototype.slice.call(document.querySelectorAll('[data-lang-root]')).forEach(function (r) { closeLangMenu(r); });
    });
  }

  window.CMS_I18N = { t: t, getLocale: getLocale, setLocale: setLocale, LOCALES: LOCALES, applyLocale: applyLocale };

  document.addEventListener('DOMContentLoaded', function () {
    applyLocale();
    initLangSwitcher();
  });
})();
