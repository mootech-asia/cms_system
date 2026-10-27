/* 手機版共用 UI，比照 v2/site 桌機版 site.js：
   - showMemberModal() → window.__v2mModal：成功／警告／確認／刪除確認彈窗
   - openCsModal()：[data-cs-open] 一律開客服彈窗（Live Chat / Telegram / Email）
   - openChatWidget()：[data-chat-open] 開右下角模擬對話視窗（無真實客服後端，
     送出後固定延遲回一則罐頭訊息，與桌機版相同）
   - .qr-rail 右側浮動列：Live Chat / Promo Channel / FAQ
   文案以英文原文查桌機版翻譯（window.__v2mTx）。 */
(function () {
  'use strict';

  function tx(en) { return window.__v2mTx ? window.__v2mTx(en) : en; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lock() { document.documentElement.classList.add('overflow-hidden'); }
  function unlock() { document.documentElement.classList.remove('overflow-hidden'); }

  /* ============================== 彈窗 ============================== */
  var modalRoot = null;
  function closeModal() { if (modalRoot) { modalRoot.remove(); modalRoot = null; unlock(); } }
  var ICON = {
    success: { d: '<path d="M20 6 9 17l-5-5"></path>', w: 3, cls: 'bg-primary/16 text-primary' },
    warning: { d: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>', w: 2, cls: 'bg-gold/16 text-gold' },
    danger: { d: '<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 15H6L5 6"></path><path d="M10 11v5M14 11v5"></path>', w: 2.2, cls: 'bg-danger/16 text-danger' },
    confirm: { d: '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>', w: 2.4, cls: 'bg-primary/16 text-primary' }
  };
  function showModal(opts) {
    closeModal();
    var type = opts.type || 'success';
    var title = opts.title || tx(type === 'warning' ? 'Warning' : type === 'confirm' ? 'Confirmation' : type === 'danger' ? 'Delete Account?' : 'Success!');
    var message = opts.message != null ? opts.message : (type === 'success' ? tx('Profile updated successfully.') : '');
    var confirmText = opts.confirmText || tx(type === 'confirm' ? 'Yes' : type === 'danger' ? 'Delete' : 'Got It');
    var cancelText = opts.cancelText || tx(type === 'danger' ? 'Cancel' : 'No');
    var ic = ICON[type] || ICON.success;
    var msgHtml = type === 'danger'
      ? '<p class="mt-2 text-[13px] leading-relaxed text-text-2">' + esc(tx('Are you sure you want to remove')) + ' <strong class="text-text">' + esc(opts.subject || '') + '</strong>' + esc(tx('? This action cannot be undone.')) + '</p>'
      : (message ? '<p class="mt-2 text-[13px] leading-relaxed text-text-2">' + esc(message) + '</p>' : '');
    var wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 z-[80] grid place-items-center bg-black/60 p-6';
    wrap.innerHTML =
      '<div class="w-full max-w-[320px] rounded-2xl border border-border bg-surface p-5 text-center shadow-card" role="dialog" aria-modal="true">' +
      '<span class="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full ' + ic.cls + '"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + ic.w + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ic.d + '</svg></span>' +
      '<h3 class="text-[16px] font-bold text-text">' + esc(title) + '</h3>' + msgHtml +
      '<button type="button" class="mt-5 h-11 w-full rounded-xl text-[14px] font-bold ' + (type === 'danger' ? 'bg-danger text-white' : 'bg-[image:var(--g-primary)] text-on-primary') + '" data-modal-confirm>' + esc(confirmText) + '</button>' +
      ((type === 'confirm' || type === 'danger') ? '<button type="button" class="mt-2 h-11 w-full rounded-xl border border-border text-[14px] font-bold text-text" data-modal-cancel>' + esc(cancelText) + '</button>' : '') +
      '</div>';
    document.body.appendChild(wrap);
    modalRoot = wrap;
    lock();
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) { closeModal(); return; }
      if (e.target.closest('[data-modal-confirm]')) { closeModal(); if (opts.onConfirm) opts.onConfirm(); return; }
      if (e.target.closest('[data-modal-cancel]')) { closeModal(); if (opts.onCancel) opts.onCancel(); }
    });
  }

  /* ============================== 客服彈窗 ============================== */
  var csRoot = null;
  function closeCs() { if (csRoot) { csRoot.remove(); csRoot = null; unlock(); } }
  function openCs() {
    if (csRoot) return;
    var rows = [
      { href: '#', strong: 'Live Chat Support', small: '24/7 instant help from our team', chat: true,
        icon: '<path d="M21 12c0 4.4-4 8-9 8a10 10 0 0 1-3.6-.7L3 21l1.4-4.5A8 8 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z"></path>' },
      { href: 'https://t.me/win100kor', strong: 'Telegram Channel', small: 'Promotions & announcements', fill: true,
        icon: '<path d="M21.05 3.4 2.7 10.5c-1.1.45-1.1 1.1-.2 1.4l4.6 1.45 1.8 5.7c.2.55.4.75.8.75.4 0 .55-.18.75-.4l2.3-2.3 4.7 3.45c.85.5 1.45.25 1.65-.8L21.95 4.6c.3-1.4-.45-2-1.5-1.55Z"></path>' },
      { href: '#', strong: 'Email Us', small: 'support@win100.gg · reply within 24h',
        icon: '<path d="M4 6h16v12H4zM4 7l8 6 8-6"></path>' }
    ];
    csRoot = document.createElement('div');
    csRoot.className = 'fixed inset-0 z-[80] flex items-end bg-black/60';
    csRoot.innerHTML =
      '<div class="w-full rounded-t-3xl bg-surface p-5 pb-[max(20px,env(safe-area-inset-bottom,0px))]" role="dialog" aria-modal="true">' +
      '<div class="mb-4 flex items-center justify-between">' +
      '<div class="flex items-center gap-2.5"><span class="grid h-8 w-8 place-items-center rounded-full bg-primary/16 text-primary"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2v-7h5M4 12v4a3 3 0 0 0 3 3h2v-7H4"></path></svg></span>' +
      '<h3 class="text-[16px] font-bold text-text">' + esc(tx('Customer Service')) + '</h3></div>' +
      '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-text-2" data-cs-close aria-label="' + esc(tx('Close')) + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button>' +
      '</div>' +
      '<p class="mb-2.5 text-[12.5px] font-semibold text-text-3">' + esc(tx('Select a channel')) + '</p>' +
      '<div class="flex flex-col gap-2">' +
      rows.map(function (r) {
        return '<a href="' + r.href + '"' + (r.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + (r.chat ? ' data-chat-open' : '') +
          ' class="flex items-center gap-3 rounded-2xl border border-border-soft bg-bg p-3.5">' +
          '<span class="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary/16 text-primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="' + (r.fill ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true">' + r.icon + '</svg></span>' +
          '<span class="min-w-0 flex-1"><strong class="block text-[13.5px] font-bold text-text">' + esc(tx(r.strong)) + '</strong><small class="block truncate text-[11.5px] text-text-3">' + esc(tx(r.small)) + '</small></span>' +
          '<span class="text-[18px] text-text-3" aria-hidden="true">›</span></a>';
      }).join('') +
      '</div></div>';
    csRoot.addEventListener('click', function (e) {
      if (e.target === csRoot || e.target.closest('[data-cs-close]')) { closeCs(); return; }
      if (e.target.closest('[data-chat-open]')) closeCs();
    });
    document.body.appendChild(csRoot);
    lock();
  }

  /* ============================== Live Chat ============================== */
  var chatRoot = null;
  function chatBody() { return chatRoot && chatRoot.querySelector('[data-chat-body]'); }
  function appendMsg(kind, text) {
    var body = chatBody();
    if (!body) return;
    var row = document.createElement('div');
    row.className = 'flex items-end gap-2 ' + (kind === 'bot' ? '' : 'justify-end');
    row.innerHTML = (kind === 'bot' ? '<img src="../logo.png" class="h-6 w-6 flex-none rounded-full bg-bg object-contain" alt="">' : '') +
      '<div class="max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-snug ' + (kind === 'bot' ? 'bg-surface-2 text-text' : 'bg-[image:var(--g-primary)] text-on-primary') + '"></div>';
    row.lastElementChild.textContent = text;
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }
  function openChat() {
    if (chatRoot) { chatRoot.querySelector('[data-chat-panel]').classList.remove('hidden'); return; }
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="fixed inset-x-3 bottom-[calc(max(12px,env(safe-area-inset-bottom,0px))+76px)] z-[70] overflow-hidden rounded-2xl border border-border bg-surface shadow-card" data-chat-widget>' +
      '<div class="flex items-center gap-2.5 border-b border-border-soft px-3.5 py-2.5">' +
      '<img src="../logo.png" class="h-8 w-8 rounded-full bg-bg object-contain" alt="">' +
      '<div class="min-w-0 flex-1"><strong class="block text-[13.5px] font-bold text-text">' + esc(tx('Live Chat')) + '</strong>' +
      '<span class="flex items-center gap-1 text-[11px] text-text-3"><i class="h-1.5 w-1.5 rounded-full bg-success"></i>' + esc(tx('Online')) + '</span></div>' +
      '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-[18px] text-text-2" data-chat-min aria-label="' + esc(tx('Minimize')) + '">–</button>' +
      '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-text-2" data-chat-close aria-label="' + esc(tx('Close')) + '"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg></button>' +
      '</div>' +
      '<div data-chat-panel>' +
      '<div class="flex h-64 flex-col gap-2.5 overflow-y-auto p-3.5" data-chat-body></div>' +
      '<form class="flex items-center gap-2 border-t border-border-soft p-2.5" data-chat-form>' +
      '<input type="text" class="h-10 min-w-0 flex-1 rounded-xl border border-border-soft bg-bg px-3 text-[13px] text-text" data-chat-input placeholder="' + esc(tx('Type a message…')) + '" autocomplete="off">' +
      '<button type="submit" class="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[image:var(--g-primary)] text-on-primary" aria-label="' + esc(tx('Send')) + '"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 9-18 9 4-9Z"></path></svg></button>' +
      '</form></div></div>';
    chatRoot = wrap.firstElementChild;
    document.body.appendChild(chatRoot);
    appendMsg('bot', tx('Hi there! How can we help? A support agent will reply shortly.'));
    chatRoot.querySelector('[data-chat-close]').addEventListener('click', function () { chatRoot.remove(); chatRoot = null; });
    chatRoot.querySelector('[data-chat-min]').addEventListener('click', function () { chatRoot.querySelector('[data-chat-panel]').classList.toggle('hidden'); });
    chatRoot.querySelector('[data-chat-form]').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = chatRoot.querySelector('[data-chat-input]');
      var text = input.value.trim();
      if (!text) return;
      appendMsg('user', text);
      input.value = '';
      setTimeout(function () { appendMsg('bot', tx('Thanks for your message — a support agent will reply shortly.')); }, 700);
    });
  }

  /* ============================== 右側浮動列 ============================== */
  /* 桌機版 .qr-rail 在手機寬度固定展開，會蓋住右側的按鈕與金額；手機版改成
     右緣一個小把手，預設展開 Live Chat / Promo Channel / FAQ，點把手可收起／再展開。 */
  function initRail() {
    if (document.querySelector('[data-qr-rail]')) return;
    var rail = document.createElement('div');
    rail.setAttribute('data-qr-rail', '');
    rail.className = 'fixed right-0 top-1/2 z-30 flex -translate-y-1/2 items-center';
    var btn = 'grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-primary';
    rail.innerHTML =
      '<button type="button" class="grid h-12 w-5 place-items-center rounded-l-xl border border-r-0 border-border bg-surface/90 text-text-2 shadow-card backdrop-blur-sm" data-qr-rail-toggle aria-expanded="true" aria-label="' + esc(tx('Customer Service')) + '">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="rotate-180 transition-transform" data-qr-rail-chevron aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button>' +
      '<div class="flex flex-col items-center gap-2.5 rounded-l-3xl border border-r-0 border-border bg-surface/90 px-1.5 py-2 shadow-card backdrop-blur-sm" data-qr-rail-items>' +
      '<a href="#" class="' + btn + '" data-chat-open aria-label="' + esc(tx('Live Chat')) + '"><img src="../logo.png" alt="" class="w-7 object-contain"></a>' +
      '<a href="https://t.me/win10096cs" target="_blank" rel="noopener noreferrer" class="' + btn + '" aria-label="' + esc(tx('Promo Channel')) + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg></a>' +
      '<a href="about.html?tab=faq" class="' + btn + '" aria-label="' + esc(tx('FAQ')) + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg></a>' +
      '</div>';
    /* 把手可上下拖動：位移超過 6px 才算拖動（不觸發展開），放開後把位置
       （中心點佔視窗高度的比例）記在 localStorage，換頁、重新整理沿用。
       範圍限制在頁首下緣到底部導覽列上方之間。 */
    var POS_KEY = 'win100-qr-rail-y';
    var handle = rail.querySelector('[data-qr-rail-toggle]');
    handle.style.touchAction = 'none';
    function clampY(y) {
      var half = rail.offsetHeight / 2;
      /* 上限是頁首（sticky，大廳頁含會員卡）的下緣，不能拖到頁首上面 */
      var header = document.querySelector('header');
      var headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      var min = headerBottom + 8 + half;
      var max = window.innerHeight - 96 - half;
      return Math.max(min, Math.min(max, y));
    }
    function placeAt(y) { rail.style.top = clampY(y) + 'px'; }
    var drag = null;
    var justDragged = false;
    handle.addEventListener('pointerdown', function (e) {
      drag = { startY: e.clientY, startTop: rail.getBoundingClientRect().top + rail.offsetHeight / 2, moved: false };
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dy = e.clientY - drag.startY;
      if (!drag.moved && Math.abs(dy) < 6) return;
      drag.moved = true;
      placeAt(drag.startTop + dy);
    });
    function endDrag() {
      if (!drag) return;
      if (drag.moved) {
        justDragged = true;
        var center = rail.getBoundingClientRect().top + rail.offsetHeight / 2;
        try { localStorage.setItem(POS_KEY, String(center / window.innerHeight)); } catch (err) { /* storage unavailable */ }
      }
      drag = null;
    }
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', function () {
      var saved = null;
      try { saved = parseFloat(localStorage.getItem(POS_KEY)); } catch (err) { /* ignore */ }
      if (saved) placeAt(saved * window.innerHeight);
    });

    handle.addEventListener('click', function () {
      if (justDragged) { justDragged = false; return; }
      var toggle = this;
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      var items = rail.querySelector('[data-qr-rail-items]');
      items.classList.toggle('hidden', !open);
      items.classList.toggle('flex', open);
      rail.querySelector('[data-qr-rail-chevron]').classList.toggle('rotate-180', open);
      /* 展開後變高，重新夾在可用範圍內，避免被 header 或底部導覽蓋住 */
      if (rail.style.top) placeAt(parseFloat(rail.style.top));
    });
    document.body.appendChild(rail);
    /* 會員卡由 mobile.js 在同一個 DOMContentLoaded 之後才顯示，頁首高度會變，
       等這一輪跑完再定位／夾範圍；沒存過位置時也要夾（預設置中可能落在頁首內） */
    setTimeout(function () {
      var saved = null;
      try { saved = parseFloat(localStorage.getItem(POS_KEY)); } catch (err) { /* ignore */ }
      placeAt(saved ? saved * window.innerHeight : rail.getBoundingClientRect().top + rail.offsetHeight / 2);
    }, 0);
  }

  /* ============================== 區塊收合 ============================== */
  /* [data-collapse-toggle] 放在區塊標題裡：標題所在的那一層（section 的直接子元素）
     之後的所有兄弟元素就是區塊內容，點標題一起收起／展開。首頁、帳戶頁共用。 */
  function toggleCollapse(btn) {
    var section = btn.closest('section');
    if (!section) return;
    var head = btn;
    while (head.parentElement && head.parentElement !== section) head = head.parentElement;
    var open = btn.getAttribute('aria-expanded') !== 'false';
    btn.setAttribute('aria-expanded', String(!open));
    /* 用 inline display 而不是 hidden class：內容元素本身常帶 flex／inline-flex／grid，
       同層的 display utility 會蓋過 hidden */
    for (var el = head.nextElementSibling; el; el = el.nextElementSibling) el.style.display = open ? 'none' : '';
    var chev = btn.querySelector('[data-collapse-chevron]');
    if (chev) chev.classList.toggle('-rotate-90', open);
  }

  document.addEventListener('click', function (e) {
    /* 整張卡片可點（會員卡 → 帳戶總覽），卡片內本身就有動作的連結／按鈕照常各自運作 */
    var card = e.target.closest('[data-card-link]');
    if (card && !e.target.closest('a, button, input, select, label')) { location.href = card.getAttribute('data-card-link'); return; }
    var col = e.target.closest('[data-collapse-toggle]');
    if (col) { toggleCollapse(col); return; }
    if (e.target.closest('[data-cs-open]')) { e.preventDefault(); openCs(); return; }
    if (e.target.closest('[data-chat-open]')) { e.preventDefault(); openChat(); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-card-link]')) {
      e.preventDefault();
      location.href = e.target.getAttribute('data-card-link');
      return;
    }
    if (e.key !== 'Escape') return;
    closeSheet();
    closeModal();
    closeCs();
  });
  /* ============================== 語言切換（大廳頁 header）============================== */
  /* 桌機版 header 右上角的語言下拉；手機版放在換膚鈕左邊。選項跟選單抽屜裡
     的語言列一樣是 [data-locale-option]，點選與樣式由 i18n.js 處理。 */
  var LOCALES = [['en', 'EN', 'English'], ['ko', '한국어', '한국어'], ['th', 'ไทย', 'ภาษาไทย'], ['zh', '中文', '中文']];
  function initHeaderLocale() {
    var skinWrap = document.querySelector('.m-skin-wrap');
    if (!skinWrap || document.querySelector('[data-locale-wrap]')) return;
    var cur = window.__v2mLocale ? window.__v2mLocale() : 'en';
    var short = (LOCALES.filter(function (l) { return l[0] === cur; })[0] || LOCALES[0])[1];
    var wrap = document.createElement('div');
    wrap.className = 'relative';
    wrap.setAttribute('data-locale-wrap', '');
    wrap.innerHTML =
      '<button type="button" class="flex h-9 items-center gap-1 rounded-xl border border-border px-2 text-[12px] font-semibold text-text-2" data-locale-trigger aria-haspopup="listbox" aria-expanded="false">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20"></path></svg>' +
      '<span>' + esc(short) + '</span></button>' +
      '<div class="absolute right-0 top-[calc(100%+8px)] z-50 hidden w-40 flex-col gap-1 rounded-2xl border border-border bg-surface p-1.5 shadow-card" data-locale-menu>' +
      LOCALES.map(function (l) { return '<button type="button" class="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold" data-locale-option="' + l[0] + '">' + esc(l[2]) + '</button>'; }).join('') +
      '</div>';
    skinWrap.parentElement.insertBefore(wrap, skinWrap);
    if (window.__v2mApplyLocale) window.__v2mApplyLocale(wrap);
    var trigger = wrap.querySelector('[data-locale-trigger]');
    var menu = wrap.querySelector('[data-locale-menu]');
    function setOpen(open) {
      menu.classList.toggle('hidden', !open);
      menu.classList.toggle('flex', open);
      trigger.setAttribute('aria-expanded', String(open));
    }
    trigger.addEventListener('click', function () { setOpen(menu.classList.contains('hidden')); });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) setOpen(false); });
  }

  /* ============================== 底部選單（取代原生 <select>）============================== */
  /* 原生 <select> 在手機瀏覽器（尤其 iOS／桌機模擬）彈出的清單很小、難點。
     select 本身保留在 DOM（藏起來）當資料來源與表單值，旁邊插一顆跟輸入框
     等高的按鈕；點按鈕從底部滑出大列表（每列 56px），選了寫回 select.value
     並觸發 input/change，既有的篩選、送出 gate 邏輯不用改。 */
  var sheetRoot = null;
  function closeSheet() { if (sheetRoot) { sheetRoot.remove(); sheetRoot = null; unlock(); } }
  var CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
  function openSheet(select, title, trigger) {
    closeSheet();
    /* 空值的「請選擇…」是提示文字，不列成可選項目 */
    var opts = Array.prototype.slice.call(select.options).filter(function (o) { return o.value !== ''; });
    sheetRoot = document.createElement('div');
    sheetRoot.className = 'fixed inset-0 z-[85] flex items-end bg-black/60';
    sheetRoot.innerHTML =
      '<div class="w-full rounded-t-3xl bg-surface pb-[max(16px,env(safe-area-inset-bottom,0px))]" role="dialog" aria-modal="true">' +
      '<div class="flex items-center justify-between px-5 pb-2 pt-4">' +
      '<h3 class="text-[16px] font-bold text-text">' + esc(title) + '</h3>' +
      '<button type="button" class="grid h-10 w-10 place-items-center rounded-xl text-text-2" data-sheet-close aria-label="' + esc(tx('Close')) + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button>' +
      '</div>' +
      '<div class="max-h-[60vh] overflow-y-auto px-3" role="listbox">' +
      opts.map(function (o) {
        var on = o.value === select.value;
        return '<button type="button" role="option" aria-selected="' + on + '" class="flex h-14 w-full items-center justify-between rounded-2xl px-4 text-left text-[15px] font-semibold ' +
          (on ? 'bg-primary/16 text-primary' : 'text-text') + '" data-sheet-value="' + esc(o.value) + '"><span>' + esc(o.textContent) + '</span>' + (on ? CHECK : '') + '</button>';
      }).join('') +
      '</div></div>';
    sheetRoot.addEventListener('click', function (e) {
      if (e.target === sheetRoot || e.target.closest('[data-sheet-close]')) { closeSheet(); trigger.focus(); return; }
      var opt = e.target.closest('[data-sheet-value]');
      if (!opt) return;
      select.value = opt.getAttribute('data-sheet-value');
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      closeSheet();
      trigger.focus();
    });
    document.body.appendChild(sheetRoot);
    lock();
  }
  function enhanceSelect(select, title) {
    if (!select || select.hasAttribute('data-sheet-enhanced')) return;
    select.setAttribute('data-sheet-enhanced', '');
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = select.className.replace(/\bhidden\b/, '') + ' flex items-center justify-between gap-2 text-left';
    trigger.setAttribute('aria-haspopup', 'listbox');
    if (select.getAttribute('aria-label')) trigger.setAttribute('aria-label', select.getAttribute('aria-label'));
    var label = document.createElement('span');
    label.className = 'truncate';
    trigger.appendChild(label);
    trigger.insertAdjacentHTML('beforeend', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-none text-text-3" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>');
    function sync() {
      var o = select.options[select.selectedIndex];
      label.textContent = o ? o.textContent : '';
      label.classList.toggle('text-text-3', !select.value && !!select.querySelector('option[value=""]'));
    }
    select.addEventListener('change', sync);
    select.addEventListener('input', sync);
    trigger.addEventListener('click', function () { openSheet(select, title || label.textContent, trigger); });
    select.classList.add('hidden');
    select.setAttribute('tabindex', '-1');
    select.parentNode.insertBefore(trigger, select.nextSibling);
    sync();
  }
  window.__v2mSheetSelect = enhanceSelect;

  document.addEventListener('DOMContentLoaded', initRail);
  document.addEventListener('DOMContentLoaded', initHeaderLocale);

  window.__v2mModal = showModal;
  window.__v2mOpenCs = openCs;
})();
