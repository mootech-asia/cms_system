/* 首頁「精選遊戲」橫向捲動列 + 「娛樂城」網格。遊戲名稱沿用 v2/site
   既有頁面（如 hot-games.html）的慣例——都是「遊戲名稱」佔位字＋
   pexels 圖庫圖，本站本來就是預覽用系統，不是真的遊戲資料庫，這裡
   不無中生有造新名字，維持跟桌機版一致的內容基準。廠商名稱/圖片都
   直接讀 ../site/assets/js/data.js 的 WIN100_DATA，不重複維護一份。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};
  var vendors = D.SLOT_VENDORS || ['Pragmatic Play'];
  var media = (D.VENDOR_MEDIA && D.VENDOR_MEDIA.slot) || [];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }

  function cardHTML(i, wide) {
    var m = media[i % media.length] || {};
    var provider = vendors[i % vendors.length];
    var w = wide ? 'w-[128px]' : '';
    return '<a href="hot-games.html" class="' + w + ' flex-none rounded-2xl overflow-hidden bg-bg-card border border-line">' +
      '<div class="aspect-square overflow-hidden bg-bg-elev">' +
        '<img src="' + esc(m.image || '') + '" alt="" class="h-full w-full object-cover" style="object-position:' + esc(m.focalPoint || '50% 50%') + '" loading="lazy">' +
      '</div>' +
      '<div class="p-2.5">' +
        '<p class="text-[10.5px] font-medium text-accent truncate">' + esc(t('section.casino')) + '</p>' +
        '<p class="text-[12.5px] font-bold text-text truncate">' + esc(t('game.placeholder')) + '</p>' +
        '<p class="text-[10.5px] text-text-dim truncate">' + esc(provider) + '</p>' +
      '</div>' +
    '</a>';
  }

  /* 卡片是 DOMContentLoaded 之後才塞進 DOM 的——i18n.js 的 applyLocale()
     早就跑過一輪了，這裡直接用翻好的文字組字串，不用再靠 data-i18n
     屬性事後掃描（掃了也掃不到,因為這批節點那時候根本還不存在）。 */
  function fillRail(id, count, wide) {
    var el = document.getElementById(id);
    if (!el) return;
    var html = '';
    for (var i = 0; i < count; i++) html += cardHTML(i, wide);
    el.innerHTML = html;
  }

  /* Hero 輪播：4 張 slide 都已經在靜態 HTML 裡(見 hero.mjs 產生的結構)，
     這裡只負責切換 opacity 顯示哪一張、同步 dots 樣式，不用另外組字串。
     左右箭頭跟 dot 都走同一個 goTo()，不各自維護一份切換邏輯。 */
  function initHeroCarousel() {
    var root = document.getElementById('hero-carousel');
    if (!root) return;
    var slides = root.querySelectorAll('.hero-slide');
    var dots = root.querySelectorAll('.hero-dot');
    if (!slides.length) return;
    var current = 0;

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (el, idx) {
        var active = idx === current;
        el.classList.toggle('opacity-0', !active);
        el.classList.toggle('pointer-events-none', !active);
      });
      dots.forEach(function (el, idx) {
        var active = idx === current;
        el.classList.toggle('w-4', active);
        el.classList.toggle('bg-white', active);
        el.classList.toggle('w-1.5', !active);
        el.classList.toggle('bg-white/40', !active);
      });
    }

    var prevBtn = root.querySelector('.hero-prev');
    var nextBtn = root.querySelector('.hero-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
    dots.forEach(function (el, idx) { el.addEventListener('click', function () { goTo(idx); }); });
  }

  /* 進站公告彈窗（比照 v1.5 components/PromotionModal.vue）：手機版永遠是
     窄版面，不需要桌機版那種同時多張並排，一次顯示一張、關閉後換下一張
     即可。內容/圖片跟 v2/site 桌機版共用同一份 D.PROMO_POPUP，「今天不再
     提醒」的 localStorage key 也刻意跟桌機版共用（同源），使用者在任一
     裝置勾選過，另一裝置當天就不會再彈出。
     關閉鈕疊一圈倒數環：8 秒轉完自動換下一張，不用等使用者手動點 X；
     圈圈用 inline style 直接觸發 CSS transition（stroke-dashoffset 從 0
     轉到全長），不依賴額外的 @keyframes 規則，純 Tailwind 頁面也能用。
     手動點 X 一樣立即生效，並清掉尚未跑完的倒數計時器，避免兩邊都觸發。 */
  var PROMO_POPUP_AUTO_MS = 8000;
  var PROMO_POPUP_RING_C = 75.4; // 2 * PI * r(12)

  function initPromoPopup() {
    var ALL = D.PROMO_POPUP || [];
    if (!ALL.length) return;
    function todayKey() {
      var d = new Date();
      function pad(n) { return String(n).padStart(2, '0'); }
      return 'win100-promo-popup-dismissed_' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }
    var dismissedIds = [];
    try { dismissedIds = JSON.parse(localStorage.getItem(todayKey()) || '[]'); } catch (e) {}
    var cards = ALL.filter(function (p) { return dismissedIds.indexOf(String(p.promotion_id)) === -1; });
    if (!cards.length) return;

    var loc = window.__v2mT ? (localStorage.getItem('win100-locale') || 'zh') : 'zh';
    var backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4';
    document.body.appendChild(backdrop);

    function cardHTML(promo) {
      return (
        '<div class="flex flex-col w-full max-w-[300px] h-[420px] rounded-2xl border border-line-hi bg-bg-card overflow-hidden">' +
        '<div class="flex-none flex items-center justify-between px-3.5 py-2.5 border-b border-line">' +
        '<img src="../site/logo.png" alt="logo" class="h-5 w-auto object-contain">' +
        '<button type="button" class="relative h-7 w-7 grid place-items-center rounded-full text-text-mid" data-promo-popup-close aria-label="Close">' +
        '<svg class="absolute inset-0 -rotate-90" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">' +
        '<circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" stroke-width="2" opacity=".2"></circle>' +
        '<circle data-promo-popup-ring cx="14" cy="14" r="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="' + PROMO_POPUP_RING_C + '" stroke-dashoffset="0"></circle>' +
        '</svg>' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="relative" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>' +
        '</button></div>' +
        '<div class="flex-none cursor-pointer" data-promo-popup-content>' +
        '<img src="assets/images/promo-popup/' + promo.image + '" alt="' + promo.title[loc] + '" class="w-full h-[150px] object-cover">' +
        '</div>' +
        '<div class="flex-1 min-h-0 overflow-y-auto px-3.5 py-3">' +
        '<p class="text-[13.5px] font-bold text-text mb-1.5">' + promo.title[loc] + '</p>' +
        '<div class="text-[12px] leading-relaxed text-text-mid [&_p]:mb-2 [&_p:last-child]:mb-0">' + promo.content[loc] + '</div>' +
        '</div>' +
        '<div class="flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 border-t border-line">' +
        '<input type="checkbox" data-promo-popup-remember class="h-4 w-4 accent-accent">' +
        '<span class="text-[11.5px] text-text-mid">' + t('promotion.dontRemindToday') + '</span>' +
        '</div>' +
        '</div>'
      );
    }

    function persistDismiss(id) {
      var key = todayKey();
      var list = [];
      try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
      list.push(String(id));
      localStorage.setItem(key, JSON.stringify(list));
    }

    function startRing(cardEl, onDone) {
      var timer = setTimeout(onDone, PROMO_POPUP_AUTO_MS);
      var ring = cardEl.querySelector('[data-promo-popup-ring]');
      if (ring) {
        ring.style.transition = 'none';
        ring.style.strokeDashoffset = '0';
        requestAnimationFrame(function () {
          ring.style.transition = 'stroke-dashoffset ' + (PROMO_POPUP_AUTO_MS / 1000) + 's linear';
          requestAnimationFrame(function () { ring.style.strokeDashoffset = String(PROMO_POPUP_RING_C); });
        });
      }
      return timer;
    }

    var current = 0;
    function render() {
      if (current >= cards.length) { backdrop.remove(); return; }
      var promo = cards[current];
      backdrop.innerHTML = cardHTML(promo);
      var cardEl = backdrop.firstElementChild;
      function advance() {
        clearTimeout(timer);
        current += 1;
        render();
      }
      cardEl.querySelector('[data-promo-popup-close]').addEventListener('click', function (e) {
        e.stopPropagation();
        if (cardEl.querySelector('[data-promo-popup-remember]').checked) persistDismiss(promo.promotion_id);
        advance();
      });
      cardEl.querySelector('[data-promo-popup-content]').addEventListener('click', function () {
        location.href = 'promotion.html';
      });
      var timer = startRing(cardEl, advance);
    }
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    fillRail('best-games-rail', 8, true);
    fillRail('casino-grid', 12, false);
    var bestCount = document.getElementById('best-games-count');
    if (bestCount) bestCount.textContent = '(13)';
    var casinoCount = document.getElementById('casino-count');
    if (casinoCount) casinoCount.textContent = '(' + (vendors.length * 128) + ')';
    initHeroCarousel();
    initPromoPopup();
  });
})();
