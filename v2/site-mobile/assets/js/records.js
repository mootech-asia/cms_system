/* 紀錄頁工具列：比照 v2/site 桌機版 site.js 的 initMemberPageBehaviors()
   狀態篩選、initDateRangeFilter() 日期區間 + Confirm、initAutoRefresh()
   30 秒倒數。各頁要哪些控制項由 [data-rec-toolbar] 的 data-status /
   data-refresh 決定，跟桌機版同頁的工具列一致。

   篩選對象是 [data-rec-list] 底下的 [data-record-card]：狀態看卡片的
   data-status，日期取卡片內第一個 YYYY-MM-DD；沒有日期的卡片（損益報表
   的遊戲類型彙總）一律保留，Confirm 在那頁等於不動作，與桌機版相同。
   兩種篩選同時生效（各自記在卡片的 data-hide-status / data-hide-date）。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};
  var STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];
  var WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }
  function currentLocale() { return window.__v2mLocale ? window.__v2mLocale() : 'en'; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function sameDay(a, b) { return !!a && !!b && fmt(a) === fmt(b); }

  function parseRange(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})\s*~\s*(\d{4})-(\d{2})-(\d{2})$/.exec((v || '').trim());
    if (!m) return null;
    var start = new Date(+m[1], +m[2] - 1, +m[3], 0, 0, 0, 0);
    var end = new Date(+m[4], +m[5] - 1, +m[6], 23, 59, 59, 999);
    if (end < start) { var tmp = start; start = end; end = tmp; }
    return { start: start, end: end };
  }
  function cardDate(card) {
    var m = /\d{4}-\d{2}-\d{2}/.exec(card.textContent || '');
    return m ? new Date(m[0] + 'T00:00:00') : null;
  }

  function cards(list) { return list ? Array.prototype.slice.call(list.querySelectorAll('[data-record-card]')) : []; }
  function syncVisibility(list) {
    cards(list).forEach(function (c) {
      c.classList.toggle('hidden', c.hasAttribute('data-hide-status') || c.hasAttribute('data-hide-date'));
    });
  }
  function applyStatus(list, status) {
    cards(list).forEach(function (c) {
      var st = c.getAttribute('data-status');
      if (st && status !== 'All' && st !== status) c.setAttribute('data-hide-status', '');
      else c.removeAttribute('data-hide-status');
    });
    syncVisibility(list);
  }
  function applyDate(list, raw) {
    var range = parseRange(raw);
    cards(list).forEach(function (c) {
      var d = cardDate(c);
      if (d && range && (d < range.start || d > range.end)) c.setAttribute('data-hide-date', '');
      else c.removeAttribute('data-hide-date');
    });
    syncVisibility(list);
  }

  var CAL_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 10h18"></path></svg>';
  var REFRESH_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"></path><path d="M21 3v5h-5"></path></svg>';

  function toolbarHtml(withStatus, withRefresh) {
    var statusHtml = withStatus
      ? '<select class="h-11 min-w-[104px] flex-none rounded-xl border border-border-soft bg-surface px-3 text-[13px] font-semibold text-text" data-rec-status data-i18n-aria="rec.status" aria-label="' + t('rec.status') + '">' +
        STATUSES.map(function (s) { return '<option value="' + s + '">' + t('rec.status' + s) + '</option>'; }).join('') +
        '</select>'
      : '';
    return (
      '<div class="flex items-center gap-2">' + statusHtml +
      '<div class="relative min-w-0 flex-1" data-rec-date-wrap>' +
      '<input type="text" readonly class="h-11 w-full rounded-xl border border-border-soft bg-surface pl-3 pr-10 text-[13px] text-text placeholder:text-text-3" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" data-rec-date aria-haspopup="dialog">' +
      '<button type="button" class="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-lg text-text-3" data-rec-date-btn data-i18n-aria="rec.chooseDate" aria-label="' + t('rec.chooseDate') + '">' + CAL_SVG + '</button>' +
      '</div></div>' +
      '<div class="mt-2 flex items-center gap-3">' +
      '<button type="button" class="h-10 flex-none rounded-xl bg-[image:var(--g-primary)] px-5 text-[13px] font-bold text-on-primary" data-rec-confirm data-i18n="rec.confirm">' + t('rec.confirm') + '</button>' +
      (withRefresh
        ? '<button type="button" class="flex items-center gap-1.5 text-[12.5px] text-text-2" data-rec-refresh><span data-rec-refresh-label></span>' + REFRESH_SVG + '</button>'
        : '') +
      '</div>'
    );
  }

  function initCalendar(input, btn, wrap, onPick) {
    var today = new Date();
    var viewYear = today.getFullYear();
    var viewMonth = today.getMonth();
    var selStart = null;
    var selEnd = null;
    var pop = document.createElement('div');
    pop.className = 'hidden absolute left-0 right-0 top-full z-30 mt-1.5 rounded-2xl border border-border bg-surface p-3 shadow-card';
    pop.setAttribute('role', 'dialog');
    wrap.appendChild(pop);

    function render() {
      var cells = [];
      var offset = new Date(viewYear, viewMonth, 1).getDay();
      var total = new Date(viewYear, viewMonth + 1, 0).getDate();
      var i;
      for (i = 0; i < offset; i++) cells.push(null);
      for (i = 1; i <= total; i++) cells.push(new Date(viewYear, viewMonth, i));
      var rs = selStart && selEnd ? (selStart < selEnd ? selStart : selEnd) : selStart;
      var re = selStart && selEnd ? (selStart < selEnd ? selEnd : selStart) : null;
      pop.innerHTML =
        '<div class="mb-2 flex items-center gap-1.5">' +
        '<button type="button" class="h-8 w-8 grid place-items-center rounded-lg text-[18px] text-text-2" data-cal-nav="-1" aria-label="Prev">‹</button>' +
        '<span class="flex-1 text-center text-[14px] font-bold text-text">' + viewYear + ' / ' + pad2(viewMonth + 1) + '</span>' +
        '<button type="button" class="h-8 w-8 grid place-items-center rounded-lg text-[18px] text-text-2" data-cal-nav="1" aria-label="Next">›</button>' +
        '<button type="button" class="h-8 w-8 grid place-items-center rounded-lg text-[14px] text-text-2" data-cal-clear aria-label="Clear">✕</button>' +
        '</div>' +
        '<div class="grid grid-cols-7">' + WEEKDAYS.map(function (w) { return '<span class="py-1 text-center text-[11px] text-text-4">' + w + '</span>'; }).join('') + '</div>' +
        '<div class="grid grid-cols-7">' +
        cells.map(function (c) {
          if (!c) return '<span class="aspect-square"></span>';
          var edge = (rs && sameDay(c, rs)) || (re && sameDay(c, re));
          var inRange = rs && re && c > rs && c < re;
          var cls = 'aspect-square grid place-items-center text-[13px] ' +
            (edge ? 'rounded-lg bg-[image:var(--g-primary)] font-bold text-on-primary'
              : inRange ? 'bg-primary/16 text-text' : 'rounded-lg text-text-2');
          return '<button type="button" class="' + cls + '" data-cal-day="' + fmt(c) + '">' + c.getDate() + '</button>';
        }).join('') +
        '</div>';
    }
    function isOpen() { return !pop.classList.contains('hidden'); }
    function open() {
      var range = parseRange(input.value);
      if (range) { viewYear = range.start.getFullYear(); viewMonth = range.start.getMonth(); }
      render();
      pop.classList.remove('hidden');
      input.setAttribute('aria-expanded', 'true');
    }
    function close() { pop.classList.add('hidden'); input.setAttribute('aria-expanded', 'false'); }

    input.addEventListener('click', function () { if (isOpen()) close(); else open(); });
    btn.addEventListener('click', function (e) { e.stopPropagation(); if (isOpen()) close(); else open(); });
    /* 用 composedPath 判斷：日曆內按鈕點下後 render() 會重繪，e.target 已脫離 DOM，
       wrap.contains(e.target) 會誤判成點在外面而關掉日曆。 */
    document.addEventListener('click', function (e) { if (isOpen() && e.composedPath().indexOf(wrap) === -1) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    pop.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-cal-nav]');
      if (nav) {
        viewMonth += +nav.getAttribute('data-cal-nav');
        if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; } else if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
        render();
        return;
      }
      if (e.target.closest('[data-cal-clear]')) {
        selStart = null; selEnd = null; input.value = '';
        onPick('');
        render();
        return;
      }
      var day = e.target.closest('[data-cal-day]');
      if (!day) return;
      var picked = new Date(day.getAttribute('data-cal-day') + 'T00:00:00');
      if (!selStart || selEnd) { selStart = picked; selEnd = null; render(); return; }
      selEnd = picked;
      if (selEnd < selStart) { var tmp = selStart; selStart = selEnd; selEnd = tmp; }
      input.value = fmt(selStart) + ' ~ ' + fmt(selEnd);
      render();
      close();
    });
  }

  function initAutoRefresh(btn, list) {
    var label = btn.querySelector('[data-rec-refresh-label]');
    var counter = 30;
    var timer = null;
    function render() {
      var tmpl = (D.AUTO_REFRESH_TMPL || {})[currentLocale()] || (D.AUTO_REFRESH_TMPL || {}).en || 'Auto refresh in {n} s';
      label.textContent = tmpl.replace('{n}', counter);
    }
    function flash() {
      if (!list) return;
      list.classList.remove('animate-pulse');
      void list.offsetWidth; /* 強制 reflow，連續觸發時動畫才會從頭播 */
      list.classList.add('animate-pulse');
      setTimeout(function () { list.classList.remove('animate-pulse'); }, 2000);
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        counter -= 1;
        if (counter <= 0) { flash(); counter = 30; }
        render();
      }, 1000);
    }
    render();
    restart();
    btn.addEventListener('click', function () { flash(); counter = 30; render(); restart(); });
  }

  function init() {
    var bar = document.querySelector('[data-rec-toolbar]');
    if (!bar) return;
    var list = document.querySelector('[data-rec-list]');
    bar.innerHTML = toolbarHtml(bar.hasAttribute('data-status'), bar.hasAttribute('data-refresh'));
    var status = bar.querySelector('[data-rec-status]');
    if (status) status.addEventListener('change', function () { applyStatus(list, status.value); });
    if (status && window.__v2mSheetSelect) window.__v2mSheetSelect(status, t('rec.status'));
    var input = bar.querySelector('[data-rec-date]');
    initCalendar(input, bar.querySelector('[data-rec-date-btn]'), bar.querySelector('[data-rec-date-wrap]'), function (v) { applyDate(list, v); });
    bar.querySelector('[data-rec-confirm]').addEventListener('click', function () { applyDate(list, input.value); });
    var refresh = bar.querySelector('[data-rec-refresh]');
    if (refresh) initAutoRefresh(refresh, list);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
