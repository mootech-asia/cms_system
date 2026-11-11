/*
 * 活動內容由後台提供：在載入本檔之前宣告 window.EVENT_CONTENT（或改成 fetch 後台 API），
 * 沒有提供時使用 config.js 的 defaultContent（mock 用）。格式：
 *   {
 *     period: '2026/11/11 – 2026/11/30',
 *     freeSpins: 3,
 *     prizes: [ { name: { en, ko, th, zh }, icon: '圖片網址', weight: 10, isLose: false }, ... ],
 *     winners: [ { name: 'pl***88', prize: 0 }, ... ],   // 中獎跑馬燈；prize 為獎項索引或 { en, ko, th, zh }，名字請先遮罩
 *     rulesTitle: { en, ko, th, zh },
 *     rules: { en: ['…'], ko: ['…'], th: ['…'], zh: ['…'] },
 *     updatedAt: '內容版本；變動時前台會重發抽獎次數'
 *   }
 * 文字欄位 ko / th 留空時前台顯示 en；zh 只在內部預覽（Ctrl+Alt+L）顯示。
 * prizes[0] 在指針下方，其餘順時針排列；數量需在 config.prizeLimits 範圍內。
 * en / ko / th 欄位不得含中文，需由後台在儲存時把關。
 */
window.EventStore = (function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;

  function load() {
    var c = window.EVENT_CONTENT || JSON.parse(JSON.stringify(cfg.defaultContent));
    if (!c.updatedAt) c.updatedAt = 'default';
    return c;
  }

  // 內容不完整時前台顯示「尚未設定獎項」而不是壞掉的轉盤。
  function isValid(c) {
    var prizes = c && Array.isArray(c.prizes) ? c.prizes : [];
    if (prizes.length < cfg.prizeLimits.min || prizes.length > cfg.prizeLimits.max) return false;
    var total = 0;
    for (var i = 0; i < prizes.length; i++) {
      var p = prizes[i] || {};
      var w = Number(p.weight);
      if (!p.name || !String(p.name.en || '').trim() || !(w >= 0)) return false;
      total += w;
    }
    return total > 0;
  }

  return { load: load, isValid: isValid };
})();
