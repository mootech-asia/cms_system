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

  document.addEventListener('DOMContentLoaded', function () {
    fillRail('best-games-rail', 8, true);
    fillRail('casino-grid', 12, false);
    var bestCount = document.getElementById('best-games-count');
    if (bestCount) bestCount.textContent = '(13)';
    var casinoCount = document.getElementById('casino-count');
    if (casinoCount) casinoCount.textContent = '(' + (vendors.length * 128) + ')';
    initHeroCarousel();
  });
})();
