/*
 * 分享活動網址：系統分享（navigator.share）、複製連結、各平台分享連結。
 * 分享出去的網址帶 ?lang=（en/ko/th），讓對方看到同一個語系；
 * zh 只是內部預覽，分享時一律改成 en。
 */
window.EventShare = (function () {
  'use strict';

  var I18n = window.EventI18n;
  var t = I18n.t;
  var $ = function (id) { return document.getElementById(id); };
  var sheet, lastFocus, toastFn;

  var PLATFORMS = [
    { id: 'line', name: 'LINE', url: function (u) { return 'https://social-plugins.line.me/lineit/share?url=' + u; } },
    { id: 'facebook', name: 'Facebook', url: function (u) { return 'https://www.facebook.com/sharer/sharer.php?u=' + u; } },
    { id: 'x', name: 'X', url: function (u, s) { return 'https://twitter.com/intent/tweet?url=' + u + '&text=' + s; } },
    { id: 'whatsapp', name: 'WhatsApp', url: function (u, s) { return 'https://wa.me/?text=' + s + '%20' + u; } },
    { id: 'telegram', name: 'Telegram', url: function (u, s) { return 'https://t.me/share/url?url=' + u + '&text=' + s; } }
  ];

  function shareUrl() {
    var u = new URL(location.href);
    u.hash = '';
    u.search = '';
    var locale = I18n.getLocale();
    u.searchParams.set('lang', locale === 'zh' ? I18n.DEFAULT_LOCALE : locale);
    var cfg = window.EVENT_CONFIG;
    if (cfg.activeSkin && cfg.activeSkin !== cfg.skin) u.searchParams.set('skin', cfg.activeSkin);
    return u.toString();
  }

  function shareText() {
    return t('share.text');
  }

  function renderSheet() {
    var u = encodeURIComponent(shareUrl());
    var s = encodeURIComponent(shareText());
    $('shareLinks').innerHTML = PLATFORMS.map(function (p) {
      return '<a class="ev-share-item" data-platform="' + p.id + '" href="' + p.url(u, s) + '" target="_blank" rel="noopener">' +
        '<span class="ev-share-dot ev-share-dot--' + p.id + '" aria-hidden="true">' + p.name.charAt(0) + '</span>' +
        '<span>' + p.name + '</span></a>';
    }).join('');
    $('shareUrl').value = shareUrl();
    $('btnShareNative').hidden = typeof navigator.share !== 'function';
  }

  function open() {
    lastFocus = document.activeElement;
    renderSheet();
    sheet.hidden = false;
    $('btnShareCopy').focus();
  }

  function close() {
    sheet.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function copy() {
    var url = shareUrl();
    var done = function () { toastFn(t('share.copied')); };
    var fallback = function () {
      var input = $('shareUrl');
      input.focus();
      input.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      if (ok) done();
      else toastFn(t('share.copyFailed'));
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else {
      fallback();
    }
  }

  function nativeShare() {
    navigator.share({ title: t('title.alt'), text: shareText(), url: shareUrl() })
      .catch(function () { /* 使用者取消或不支援時維持面板開啟 */ });
  }

  function init(showToast) {
    toastFn = showToast;
    sheet = $('shareSheet');
    $('btnShare').addEventListener('click', open);
    $('btnShareClose').addEventListener('click', close);
    $('btnShareCopy').addEventListener('click', copy);
    $('btnShareNative').addEventListener('click', nativeShare);
    $('shareUrl').addEventListener('focus', function (e) { e.target.select(); });
    sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });
    document.addEventListener('ev:locale', function () { if (!sheet.hidden) renderSheet(); });
  }

  return { init: init, shareUrl: shareUrl };
})();
