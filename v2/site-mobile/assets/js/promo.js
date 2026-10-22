/* promotion.html 的優惠詳情：比照 v2/site 桌機版 initPromotionDetail() /
   buildPromoDetailHtml()。點「查看詳情」在同頁切換到詳情（網址改成
   ?detail=<id>，可直接分享／重新整理），Back 回列表。資料是桌機版同一份
   D.PROMOS。「領取優惠」與桌機版一樣沒有後端可送，只是按鈕（佔位）。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};

  function tx(en) { return window.__v2mTx ? window.__v2mTx(en) : en; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var TERMS = [
    'Bonus rewards are calculated from eligible deposits and game turnover.',
    'Cancelled bets, refunds, cashouts, and invalid results are not included.',
    'Members must keep an active balance and meet rollover requirements.',
    'Each completed promotion can only be claimed once.'
  ];

  function statCard(n, label, rate) {
    return '<div class="rounded-2xl border border-white/15 bg-black/25 p-3 backdrop-blur-sm">' +
      '<span class="grid h-6 w-6 place-items-center rounded-full bg-[image:var(--g-primary)] text-[11px] font-bold text-on-primary">' + n + '</span>' +
      '<p class="mt-2 text-[12px] font-semibold text-white/85">' + esc(tx(label)) + '</p>' +
      '<strong class="mt-0.5 block text-[22px] font-extrabold text-white">' + esc(rate) + '</strong>' +
      '<span class="text-[10.5px] text-white/65">' + esc(tx('Max reward / rollover applies')) + '</span></div>';
  }

  function detailHtml(p) {
    return '<button type="button" class="mb-3 flex items-center gap-1 text-[13px] font-semibold text-text-2" data-promo-back>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>' + esc(tx('Back')) + '</button>' +
      '<div class="relative overflow-hidden rounded-3xl ring-1 ring-white/15">' +
      '<img src="' + esc(p.img) + '" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" style="object-position:' + esc(p.focalPoint) + '">' +
      '<div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black/90"></div>' +
      '<div class="relative p-4">' +
      '<img src="../site/logo.png" alt="WIN100%" class="h-7 w-auto">' +
      '<p class="mt-6 text-[12px] font-bold uppercase tracking-wide text-primary">' + esc(tx('Special Offer')) + '</p>' +
      '<h2 class="mt-1 text-[24px] font-extrabold leading-tight text-white">' + esc(tx(p.headline)) + '</h2>' +
      '<p class="mt-1 text-[13px] font-semibold text-white/80">' + esc(p.title) + '</p>' +
      '<div class="mt-4 grid grid-cols-2 gap-2.5">' + statCard(1, p.primary, p.primaryRate) + statCard(2, p.secondary, p.secondaryRate) + '</div>' +
      '</div></div>' +
      '<div class="mt-4 rounded-2xl border border-border-soft bg-surface p-4">' +
      '<h3 class="mb-2 text-[14px] font-bold text-text">' + esc(tx('Promotion Terms')) + '</h3>' +
      '<ol class="list-decimal space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-text-2">' + TERMS.map(function (x) { return '<li>' + esc(tx(x)) + '</li>'; }).join('') + '</ol>' +
      '</div>' +
      '<button type="button" class="mt-4 h-12 w-full rounded-xl bg-[image:var(--g-primary)] text-[14px] font-bold text-on-primary">' + esc(tx('Claim Promotion')) + '</button>' +
      '<p class="mt-2 text-center text-[11px] text-text-3">' + esc(tx('win100% reserves the right to adjust, pause, or end this promotion at any time.')) + '</p>';
  }

  function init() {
    var list = document.querySelector('[data-promo-list]');
    var root = document.querySelector('[data-promo-detail-root]');
    var promos = D.PROMOS || [];
    if (!list || !root || !promos.length) return;
    function byId(id) { return promos.filter(function (p) { return p.id === id; })[0]; }
    function show(id) {
      var p = byId(id) || promos[0];
      if (history.replaceState) history.replaceState(null, '', 'promotion.html?detail=' + encodeURIComponent(p.id));
      root.innerHTML = detailHtml(p);
      root.classList.remove('hidden');
      list.classList.add('hidden');
      window.scrollTo(0, 0);
    }
    function back() {
      if (history.replaceState) history.replaceState(null, '', 'promotion.html');
      root.classList.add('hidden');
      root.innerHTML = '';
      list.classList.remove('hidden');
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-promo-detail]');
      if (b) show(b.getAttribute('data-promo-detail'));
    });
    root.addEventListener('click', function (e) { if (e.target.closest('[data-promo-back]')) back(); });
    var q = new URLSearchParams(location.search).get('detail');
    if (q) show(q);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
