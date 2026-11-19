(function () {
  'use strict';

  // Records are append-only; replacing or shortening the array starts a new cache.
  window.createPlayerEncoder = function () {
    var records = null, count = 0, encoded = '[]';
    return function (player) {
      if (records !== player.records || player.records.length < count) {
        encoded = JSON.stringify(player.records);
        records = player.records;
        count = records.length;
      } else if (records.length > count) {
        var extra = Array.from(records.slice(count), function (record) { return JSON.stringify(record) || 'null'; }).join(',');
        encoded = encoded.slice(0, -1) + (count ? ',' : '') + extra + ']';
        count = records.length;
      }
      var state = Object.assign({}, player);
      delete state.records;
      var header = JSON.stringify(state);
      return header.slice(0, -1) + (header.length > 2 ? ',' : '') + '"records":' + encoded + '}';
    };
  };

  document.addEventListener('DOMContentLoaded', function () {
    var info = document.querySelector('.ev-info');
    if (!info || !window.EventI18n) return;
    var button = document.createElement('button');
    button.id = 'btnBackTop';
    button.type = 'button';
    button.hidden = true;
    button.setAttribute('data-i18n-aria', 'navigation.top');
    document.body.appendChild(button);
    var belowStage = false;
    function label() {
      var text = window.EventI18n.t('navigation.top');
      button.setAttribute('aria-label', text);
      button.title = text;
    }
    function update() {
      var hidden = !(belowStage && window.scrollY > 8);
      if (button.hidden !== hidden) button.hidden = hidden;
    }
    var observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      belowStage = entry.isIntersecting || entry.boundingClientRect.top < 0;
      update();
    }, {rootMargin:'0px 0px -64px 0px'});
    observer.observe(info);
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('pageshow', update);
    document.addEventListener('ev:locale', label);
    button.addEventListener('click', function () {
      window.scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
    label();
  }, {once:true});
})();
