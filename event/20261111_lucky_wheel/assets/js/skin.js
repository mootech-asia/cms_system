/*
 * 套用皮（config.skin，或網址 ?skin=<名稱>）：把該皮的圖片槽覆蓋到 config.images、
 * 載入該皮的色票檔，並在 <html> 標上 data-skin。要在 wheel.js 之前執行。
 */
(function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var m = /[?&]skin=([a-z0-9-]+)/.exec(location.search);
  var name = m && cfg.skins[m[1]] ? m[1] : cfg.skin;
  var skin = cfg.skins[name];
  cfg.activeSkin = skin ? name : 'broadway';
  document.documentElement.setAttribute('data-skin', cfg.activeSkin);
  if (!skin) return;

  Object.keys(skin.images || {}).forEach(function (k) { cfg.images[k] = skin.images[k]; });
  if (skin.mascot) Object.keys(skin.mascot).forEach(function (k) { cfg.mascot[k] = skin.mascot[k]; });
  if (skin.sounds) Object.keys(skin.sounds).forEach(function (k) { cfg.sounds[k] = skin.sounds[k]; });
  if (skin.css) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = skin.css;
    // 盤面扇區顏色是程式讀色票畫的，色票檔載入完要通知 wheel.js 重畫
    link.onload = function () { document.dispatchEvent(new Event('ev:skin')); };
    document.head.appendChild(link);
  }
})();
