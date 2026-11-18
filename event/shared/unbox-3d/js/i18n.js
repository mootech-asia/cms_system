/*
 * 語系：前台選單只有 en / ko / th（預設 en）。zh 只供內部預覽，不在選單內，
 * 以 Ctrl+Alt+L（Mac：Control+Option+L）切換；旗標存在 sessionStorage，關分頁即失效。
 * 焦點在輸入框時不觸發，避免 AltGr（= Ctrl+Alt）鍵盤打字時誤切。缺翻譯一律退回 en，絕不退回 zh。
 * 共用字串在 STRINGS；各活動的名稱、按鈕文字等寫在 config.strings，皮可再用 skins.<名稱>.strings 覆寫。
 */
window.EventI18n = (function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var LOCALES = [
    { id: 'en', label: 'EN' },
    { id: 'ko', label: '한국어' },
    { id: 'th', label: 'ไทย' }
  ];
  var DEFAULT_LOCALE = 'en';
  var LOCALE_KEY = cfg.storageKey + '_locale';
  var ZH_PREVIEW_KEY = 'event-zh-preview';
  var URL_LOCALE = null;

  var STRINGS = {
    'lang.aria': { en: 'Language', ko: '언어', th: 'ภาษา', zh: '語言' },
    'sound.off': { en: 'Turn sound off', ko: '사운드 끄기', th: 'ปิดเสียง', zh: '關閉音效' },
    'sound.on': { en: 'Turn sound on', ko: '사운드 켜기', th: 'เปิดเสียง', zh: '開啟音效' },
    'loading.title': { en: 'Loading…', ko: '로딩 중…', th: 'กำลังโหลด…', zh: '載入中…' },
    'period': { en: 'Event period: {p}', ko: '이벤트 기간: {p}', th: 'ระยะเวลากิจกรรม: {p}', zh: '活動期間：{p}' },
    'prev': { en: 'Previous', ko: '이전', th: 'ก่อนหน้า', zh: '上一個' },
    'next': { en: 'Next', ko: '다음', th: 'ถัดไป', zh: '下一個' },
    'status.select': { en: 'Drag left or right to choose, or use the arrows.', ko: '좌우로 드래그하거나 화살표로 고르세요.', th: 'ลากซ้ายขวาเพื่อเลือก หรือใช้ปุ่มลูกศร', zh: '左右拖曳挑選，也可以使用箭頭按鈕' },
    'status.loading': { en: 'Getting your result…', ko: '결과를 불러오는 중…', th: 'กำลังรับผลลัพธ์…', zh: '正在取得獎品結果…' },
    'status.error': { en: 'Could not get a result. Please try again later.', ko: '결과를 받지 못했습니다. 잠시 후 다시 시도해 주세요.', th: 'ไม่สามารถรับผลลัพธ์ได้ กรุณาลองใหม่ภายหลัง', zh: '暫時無法取得結果，請稍後再試。' },
    'status.no3d': { en: '3D is not available on this device. You can still tap to play.', ko: '이 기기에서는 3D를 사용할 수 없지만, 눌러서 계속 참여할 수 있습니다.', th: 'อุปกรณ์นี้ไม่รองรับ 3D แต่ยังแตะเพื่อเล่นต่อได้', zh: '此裝置無法啟用 3D，仍可點選完成體驗。' },
    'action.back': { en: 'Choose another', ko: '다른 것 고르기', th: 'เลือกอันอื่น', zh: '換一個' },
    'action.skip': { en: 'Skip animation', ko: '애니메이션 건너뛰기', th: 'ข้ามแอนิเมชัน', zh: '跳過動畫' },
    'treasure.count': { en: 'Treasure discovered · {n} / {total}', ko: '보물 발견 · {n} / {total}', th: 'ค้นพบสมบัติ · {n} / {total}', zh: '發現寶物 · {n} / {total}' },
    'reveal.tap': { en: 'Tap the card to reveal', ko: '카드를 눌러 확인하세요', th: 'แตะการ์ดเพื่อเปิด', zh: '點擊卡片揭曉' },
    'reveal.count': { en: 'Revealed {n} / {total}', ko: '{n} / {total} 공개', th: 'เปิดแล้ว {n} / {total}', zh: '已揭曉 {n} / {total}' },
    'reveal.flip': { en: 'Reveal', ko: '공개하기', th: 'เปิดดู', zh: '揭曉' },
    'reveal.next': { en: 'Next', ko: '다음', th: 'ถัดไป', zh: '揭曉下一張' },
    'reveal.seeAll': { en: 'See all', ko: '전체 보기', th: 'ดูทั้งหมด', zh: '查看全部' },
    'reveal.all': { en: 'Reveal all', ko: '모두 공개', th: 'เปิดทั้งหมด', zh: '全部揭曉' },
    'reveal.summary': { en: 'Your haul', ko: '이번 획득 보상', th: 'รางวัลที่ได้รับ', zh: '這次的驚喜' },
    'reveal.done': { en: 'Collect', ko: '받기', th: 'รับรางวัล', zh: '收下獎勵' },
    'rarity.common': { en: 'Common', ko: '일반', th: 'ธรรมดา', zh: '普通' },
    'rarity.rare': { en: 'Rare', ko: '레어', th: 'หายาก', zh: '稀有' },
    'rarity.epic': { en: 'Super Rare', ko: '슈퍼 레어', th: 'หายากมาก', zh: '超稀有' },
    'rarity.legendary': { en: 'Legendary', ko: '레전더리', th: 'ตำนาน', zh: '傳說' },
    'info.aria': { en: 'Event details', ko: '이벤트 안내', th: 'รายละเอียดกิจกรรม', zh: '活動說明' },
    'rules.title': { en: 'Event Rules', ko: '이벤트 규칙', th: 'กติกากิจกรรม', zh: '活動規則' },
    'rules.empty': { en: 'Event rules from the back office will appear here.', ko: '관리자에서 입력한 이벤트 규칙이 여기에 표시됩니다.', th: 'กติกากิจกรรมจากระบบหลังบ้านจะแสดงที่นี่', zh: '後台填寫的活動規則會顯示在這裡。' },
    'records.title': { en: 'My Prizes', ko: '나의 획득 내역', th: 'รางวัลของฉัน', zh: '我的獲得紀錄' },
    'ticker.label': { en: 'Winners', ko: '당첨자', th: 'ผู้โชคดี', zh: '中獎名單' },
    'ticker.item': { en: '{name} got {prize}', ko: '{name}님 {prize} 획득', th: '{name} ได้รับ {prize}', zh: '{name} 獲得 {prize}' },
    'empty.prizes': { en: 'No prizes have been set up yet', ko: '아직 상품이 설정되지 않았습니다', th: 'ยังไม่ได้ตั้งค่ารางวัล', zh: '活動尚未設定獎項' },
    'mock.reset': { en: 'Reset chances', ko: '횟수 초기화', th: 'รีเซ็ตสิทธิ์', zh: '重設次數' },
    'mock.perOpen': { en: 'Prizes per open', ko: '회당 상품 수', th: 'รางวัลต่อครั้ง', zh: '每次獎品數' },
    'mock.labels': { en: 'Asset labels', ko: '에셋 라벨', th: 'ป้ายภาพ', zh: '換圖標籤' },
    'mock.on': { en: 'On', ko: '켜짐', th: 'เปิด', zh: '開' },
    'mock.off': { en: 'Off', ko: '꺼짐', th: 'ปิด', zh: '關' },
    'toast.reset': { en: 'Reset to {n}', ko: '{n}회로 초기화했습니다', th: 'รีเซ็ตเป็น {n} ครั้งแล้ว', zh: '已重設為 {n} 次' },
    'toast.perOpen': { en: 'Preview: {n} prizes per open', ko: '미리보기: 회당 상품 {n}개', th: 'ตัวอย่าง: {n} รางวัลต่อครั้ง', zh: '預覽：每次 {n} 個獎品' },
    'share.button': { en: 'Share this event', ko: '이벤트 공유하기', th: 'แชร์กิจกรรมนี้', zh: '分享活動' },
    'share.title': { en: 'Share with friends', ko: '친구에게 공유하기', th: 'แชร์ให้เพื่อน', zh: '分享給朋友' },
    'share.close': { en: 'Close', ko: '닫기', th: 'ปิด', zh: '關閉' },
    'share.copy': { en: 'Copy link', ko: '링크 복사', th: 'คัดลอกลิงก์', zh: '複製連結' },
    'share.copied': { en: 'Link copied', ko: '링크를 복사했습니다', th: 'คัดลอกลิงก์แล้ว', zh: '已複製連結' },
    'share.copyFailed': { en: 'Could not copy. Please copy the link manually.', ko: '복사하지 못했습니다. 링크를 직접 복사해 주세요.', th: 'คัดลอกไม่สำเร็จ กรุณาคัดลอกลิงก์ด้วยตนเอง', zh: '無法複製，請手動複製連結。' },
    'share.more': { en: 'More sharing options', ko: '다른 방법으로 공유', th: 'ตัวเลือกการแชร์เพิ่มเติม', zh: '更多分享方式' },
    'share.urlLabel': { en: 'Event link', ko: '이벤트 링크', th: 'ลิงก์กิจกรรม', zh: '活動連結' },
    'rotate.hint': { en: 'Please turn your phone upright to play.', ko: '휴대폰을 세로로 돌려서 플레이해 주세요.', th: 'กรุณาหมุนโทรศัพท์เป็นแนวตั้งเพื่อเล่น', zh: '請將手機轉為直向再遊玩' }
  };

  function merge(src) { if (src) Object.keys(src).forEach(function (k) { STRINGS[k] = src[k]; }); }
  merge(cfg.strings);
  var skin = cfg.skins && cfg.skins[cfg.activeSkin];
  if (skin) merge(skin.strings);

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

  // CMS 各站以 <iframe id="luckyWheelFrame"> 嵌入（與轉盤共用同一套嵌入頁）時，語系跟著上層網站的 <html lang>
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
    document.title = t('title.alt');
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
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
    DEFAULT_LOCALE: DEFAULT_LOCALE,
    t: t,
    pick: pick,
    getLocale: getLocale,
    setLocale: setLocale,
    applyLocale: applyLocale,
    renderSwitcher: renderSwitcher
  };
})();
