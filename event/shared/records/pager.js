(function () {
  'use strict';
  window.createRecordPager = function (list, t, render) {
    var page = 0, count = -1;
    var nav = document.createElement('nav');
    nav.className = 'ev-record-pagination';
    var previous = document.createElement('button');
    var next = document.createElement('button');
    var label = document.createElement('span');
    previous.type = next.type = 'button';
    previous.dataset.recordsPage = 'previous';
    next.dataset.recordsPage = 'next';
    label.setAttribute('aria-live', 'polite');
    nav.append(previous, label, next);
    list.after(nav);
    previous.addEventListener('click', function () { page--; render(); list.scrollIntoView({block:'nearest'}); });
    next.addEventListener('click', function () { page++; render(); list.scrollIntoView({block:'nearest'}); });
    return {
      slice: function (records) {
        if (count !== records.length) page = 0;
        count = records.length;
        var pages = Math.max(1, Math.ceil(count / 10));
        page = Math.max(0, Math.min(pages - 1, page));
        nav.hidden = count <= 10;
        nav.setAttribute('aria-label', t('records.title'));
        previous.textContent = t('records.previous');
        next.textContent = t('records.next');
        previous.disabled = page === 0;
        next.disabled = page === pages - 1;
        label.textContent = (page + 1) + ' / ' + pages;
        return records.slice(page * 10, (page + 1) * 10);
      }
    };
  };
})();
