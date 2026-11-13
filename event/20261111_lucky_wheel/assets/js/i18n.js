/*
 * 語系：前台選單只有 en / ko / th（預設 en）。zh 只供內部編輯預覽，不在選單內，
 * 以 Ctrl+Alt+L（Mac：Control+Option+L）切換；旗標存在 sessionStorage，關分頁即失效。
 * 焦點在輸入框時不觸發，避免 AltGr（= Ctrl+Alt）鍵盤打字時誤切。
 * 缺翻譯一律退回 en，絕不退回 zh。
 */
window.EventI18n = (function () {
  'use strict';

  var LOCALES = [
    { id: 'en', label: 'EN', name: 'English' },
    { id: 'ko', label: '한국어', name: '한국어' },
    { id: 'th', label: 'ไทย', name: 'ไทย' }
  ];
  var DEFAULT_LOCALE = 'en';
  var LOCALE_KEY = 'event_20261111_lucky_wheel_locale';
  var ZH_PREVIEW_KEY = 'event-zh-preview';
  var URL_LOCALE = null;

  var STRINGS = {
    'lang.aria': { en: 'Language', ko: '언어', th: 'ภาษา', zh: '語言' },
    'sound.off': { en: 'Turn sound off', ko: '사운드 끄기', th: 'ปิดเสียง', zh: '關閉音效' },
    'sound.on': { en: 'Turn sound on', ko: '사운드 켜기', th: 'เปิดเสียง', zh: '開啟音效' },
    'stage.aria': { en: 'Wheel game', ko: '룰렛 게임', th: 'เกมวงล้อ', zh: '轉盤遊戲' },
    'title.alt': { en: 'Lucky Wheel', ko: '행운의 룰렛', th: 'วงล้อนำโชค', zh: '幸運大轉盤' },
    'period': { en: 'Event period: {p}', ko: '이벤트 기간: {p}', th: 'ระยะเวลากิจกรรม: {p}', zh: '活動期間：{p}' },
    'spin.text': { en: 'SPIN', ko: '돌리기', th: 'หมุน', zh: '抽獎' },
    'spin.aria': { en: 'Spin the wheel', ko: '룰렛 돌리기', th: 'หมุนวงล้อ', zh: '開始抽獎' },
    'chances.before': { en: 'Spins left', ko: '남은 기회', th: 'สิทธิ์หมุนคงเหลือ', zh: '剩餘抽獎次數' },
    'chances.after': { en: '', ko: '회', th: 'ครั้ง', zh: '次' },
    'wheel.empty': { en: 'No prizes have been set up yet', ko: '아직 상품이 설정되지 않았습니다', th: 'ยังไม่ได้ตั้งค่ารางวัล', zh: '活動尚未設定獎項' },
    'info.aria': { en: 'Event details', ko: '이벤트 안내', th: 'รายละเอียดกิจกรรม', zh: '活動說明' },
    'rules.title': { en: 'Event Rules', ko: '이벤트 규칙', th: 'กติกากิจกรรม', zh: '活動規則' },
    'rules.empty': { en: 'Event rules from the back office will appear here.', ko: '관리자에서 입력한 이벤트 규칙이 여기에 표시됩니다.', th: 'กติกากิจกรรมจากระบบหลังบ้านจะแสดงที่นี่', zh: '後台填寫的活動規則會顯示在這裡。' },
    'records.title': { en: 'My Prizes', ko: '나의 당첨 내역', th: 'รางวัลของฉัน', zh: '我的中獎紀錄' },
    'records.empty': { en: 'No spins yet. Give it a try!', ko: '아직 기록이 없습니다. 한번 돌려 보세요!', th: 'ยังไม่มีประวัติ ลองหมุนดูสิ!', zh: '還沒有紀錄，轉一次試試手氣。' },
    'mock.reset': { en: 'Reset spins', ko: '횟수 초기화', th: 'รีเซ็ตสิทธิ์', zh: '重設次數' },
    'mock.prizes': { en: 'Prizes', ko: '상품 수', th: 'จำนวนรางวัล', zh: '獎項數' },
    'mock.labels': { en: 'Asset labels', ko: '에셋 라벨', th: 'ป้ายภาพ', zh: '換圖標籤' },
    'mock.on': { en: 'On', ko: '켜짐', th: 'เปิด', zh: '開' },
    'mock.off': { en: 'Off', ko: '꺼짐', th: 'ปิด', zh: '關' },
    'share.button': { en: 'Share this event', ko: '이벤트 공유하기', th: 'แชร์กิจกรรมนี้', zh: '分享活動' },
    'loading.title': { en: 'Loading…', ko: '로딩 중…', th: 'กำลังโหลด…', zh: '載入中…' },
    'share.title': { en: 'Share with friends', ko: '친구에게 공유하기', th: 'แชร์ให้เพื่อน', zh: '分享給朋友' },
    'share.close': { en: 'Close', ko: '닫기', th: 'ปิด', zh: '關閉' },
    'share.copy': { en: 'Copy link', ko: '링크 복사', th: 'คัดลอกลิงก์', zh: '複製連結' },
    'share.copied': { en: 'Link copied', ko: '링크를 복사했습니다', th: 'คัดลอกลิงก์แล้ว', zh: '已複製連結' },
    'share.copyFailed': { en: 'Could not copy. Please copy the link manually.', ko: '복사하지 못했습니다. 링크를 직접 복사해 주세요.', th: 'คัดลอกไม่สำเร็จ กรุณาคัดลอกลิงก์ด้วยตนเอง', zh: '無法複製，請手動複製連結。' },
    'share.more': { en: 'More sharing options', ko: '다른 방법으로 공유', th: 'ตัวเลือกการแชร์เพิ่มเติม', zh: '更多分享方式' },
    'share.urlLabel': { en: 'Event link', ko: '이벤트 링크', th: 'ลิงก์กิจกรรม', zh: '活動連結' },
    'share.text': { en: 'Spin the Lucky Wheel and win prizes!', ko: '행운의 룰렛을 돌리고 상품을 받아 가세요!', th: 'หมุนวงล้อนำโชคแล้วรับรางวัลกันเลย!', zh: '來轉幸運大轉盤贏獎品！' },
    'rotate.hint': { en: 'Please turn your phone upright to play.', ko: '휴대폰을 세로로 돌려서 플레이해 주세요.', th: 'กรุณาหมุนโทรศัพท์เป็นแนวตั้งเพื่อเล่น', zh: '請將手機轉為直向再遊玩' },
    'ticker.label': { en: 'Winners', ko: '당첨자', th: 'ผู้โชคดี', zh: '中獎名單' },
    'ticker.item': { en: '{name} won {prize}', ko: '{name}님 {prize} 당첨', th: '{name} ได้รับ {prize}', zh: '{name} 抽中 {prize}' },
    'modal.win': { en: 'Congratulations!', ko: '축하합니다!', th: 'ยินดีด้วย!', zh: '恭喜中獎' },
    'modal.lose': { en: 'Better luck next time', ko: '다음 기회에', th: 'โชคดีครั้งหน้า', zh: '再接再厲' },
    'modal.claim': { en: 'Claim Prize', ko: '상품 받기', th: 'รับรางวัล', zh: '收下獎勵' },
    'modal.ok': { en: 'Got it', ko: '확인', th: 'ตกลง', zh: '知道了' },
    'toast.noPrizes': { en: 'No prizes have been set up yet', ko: '아직 상품이 설정되지 않았습니다', th: 'ยังไม่ได้ตั้งค่ารางวัล', zh: '活動尚未設定獎項' },
    'toast.noChances': { en: 'No spins left', ko: '남은 기회가 없습니다', th: 'สิทธิ์หมุนหมดแล้ว', zh: '抽獎次數已用完' },
    'toast.prizes': { en: 'Wheel preview: {n} prizes', ko: '룰렛 미리보기: 상품 {n}개', th: 'ตัวอย่างวงล้อ: {n} รางวัล', zh: '轉盤預覽：{n} 個獎項' },
    'toast.prizeLimit': { en: 'Prizes must be between {min} and {max}', ko: '상품 수는 {min}~{max}개입니다', th: 'จำนวนรางวัลต้องอยู่ระหว่าง {min}–{max}', zh: '獎項數需在 {min}～{max} 之間' },
    'mock.prize': { en: 'Prize {n}', ko: '상품 {n}', th: 'รางวัล {n}', zh: '獎項 {n}' },
    'toast.reset': { en: 'Reset to {n} spins', ko: '{n}회로 초기화했습니다', th: 'รีเซ็ตเป็น {n} ครั้งแล้ว', zh: '已重設為 {n} 次' },


  };

  // 皮可以覆寫文字（例：活動名稱），寫在 config.skins.<名稱>.strings，格式同上
  var SKIN = window.EVENT_CONFIG && window.EVENT_CONFIG.skins && window.EVENT_CONFIG.skins[window.EVENT_CONFIG.activeSkin];
  if (SKIN && SKIN.strings) Object.keys(SKIN.strings).forEach(function (k) { STRINGS[k] = SKIN.strings[k]; });


  function zhPreviewOn() {
    try { return sessionStorage.getItem(ZH_PREVIEW_KEY) === '1'; } catch (e) { return false; }
  }
  function setZhPreview(on) {
    try {
      if (on) sessionStorage.setItem(ZH_PREVIEW_KEY, '1');
      else sessionStorage.removeItem(ZH_PREVIEW_KEY);
    } catch (e) { /* sessionStorage 不可用時無法進入預覽 */ }
  }

  // 分享連結帶 ?lang=（en/ko/th）時，以網址為準並記住
  (function () {
    var m = /[?&]lang=([a-z]{2})\b/.exec(location.search);
    if (m && LOCALES.some(function (l) { return l.id === m[1]; })) {
      try { localStorage.setItem(LOCALE_KEY, m[1]); } catch (e) { /* 只在本次頁面生效 */ }
      URL_LOCALE = m[1];
    }
  })();

  function parentLocale() {
    try {
      if (window.parent === window || !window.frameElement || window.frameElement.id !== 'luckyWheelFrame') return null;
      var locale = (window.parent.document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
      return ['en', 'ko', 'th', 'zh'].indexOf(locale) !== -1 ? locale : 'en';
    } catch (e) { return null; }
  }

  function getLocale() {
    var inherited = parentLocale();
    if (inherited) return inherited;
    if (zhPreviewOn()) return 'zh';
    var saved = URL_LOCALE;
    if (!saved) {
      try { saved = localStorage.getItem(LOCALE_KEY); } catch (e) { /* 用預設 */ }
    }
    return LOCALES.some(function (l) { return l.id === saved; }) ? saved : DEFAULT_LOCALE;
  }

  function fill(str, params) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return params && params[k] != null ? params[k] : m;
    });
  }

  // 同一句在所有語系的版本（{ en, ko, th, zh }），給需要「多語文字物件」的資料用，例如預覽用的假獎項名稱
  function all(key, params) {
    var e = STRINGS[key] || {};
    var out = {};
    ['en', 'ko', 'th', 'zh'].forEach(function (l) { out[l] = fill(e[l] != null ? e[l] : e[DEFAULT_LOCALE], params); });
    return out;
  }

  function t(key, params) {
    var e = STRINGS[key];
    if (!e) return key;
    var v = e[getLocale()];
    return fill(v != null ? v : e[DEFAULT_LOCALE], params);
  }

  // 後台內容 { en, ko, th, zh }：目前語系沒填就退回 en。
  function pick(obj) {
    if (obj == null) return '';
    if (typeof obj !== 'object' || Array.isArray(obj)) return obj;
    var v = obj[getLocale()];
    var empty = v == null || (Array.isArray(v) ? !v.length : !String(v).trim());
    return empty ? obj[DEFAULT_LOCALE] : v;
  }

  function applyLocale() {
    var locale = getLocale();
    var switcher = document.getElementById('langSwitch');
    if (switcher && parentLocale()) switcher.hidden = true;
    document.documentElement.setAttribute('lang', locale === 'zh' ? 'zh-Hant' : locale);
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'))); });
    document.querySelectorAll('[data-lang-option]').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el.getAttribute('data-lang-option') === locale));
    });
    document.dispatchEvent(new CustomEvent('ev:locale', { detail: { locale: locale } }));
  }

  function setLocale(id) {
    if (parentLocale()) return;
    if (!LOCALES.some(function (l) { return l.id === id; })) return;
    setZhPreview(false);
    URL_LOCALE = id;
    try { localStorage.setItem(LOCALE_KEY, id); } catch (e) { /* 只在本次頁面生效 */ }
    // 網址帶 ?lang= 時同步改掉，避免重新整理後又被網址切回原語系
    if (/[?&]lang=/.test(location.search) && history.replaceState) {
      var u = new URL(location.href);
      u.searchParams.set('lang', id);
      history.replaceState(null, '', u.toString());
    }
    applyLocale();
  }

  function renderSwitcher(root) {
    if (!root) return;
    if (parentLocale()) { root.hidden = true; return; }
    root.setAttribute('role', 'group');
    root.setAttribute('data-i18n-aria', 'lang.aria');
    root.innerHTML = LOCALES.map(function (l) {
      return '<button type="button" class="ev-lang-btn" data-lang-option="' + l.id + '" lang="' + l.id + '">' + l.label + '</button>';
    }).join('');
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang-option]');
      if (b) setLocale(b.getAttribute('data-lang-option'));
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!e.ctrlKey || !e.altKey || e.metaKey || e.shiftKey || e.code !== 'KeyL') return;
    var el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    if (parentLocale()) return;
    e.preventDefault();
    setZhPreview(!zhPreviewOn());
    applyLocale();
  });

  return {
    LOCALES: LOCALES,
    DEFAULT_LOCALE: DEFAULT_LOCALE,
    t: t,
    all: all,
    pick: pick,
    getLocale: getLocale,
    setLocale: setLocale,
    applyLocale: applyLocale,
    renderSwitcher: renderSwitcher,
    zhPreviewOn: zhPreviewOn
  };
})();
