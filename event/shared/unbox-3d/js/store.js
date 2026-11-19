/*
 * 活動內容由後台提供：在載入本檔之前宣告 window.EVENT_CONTENT（或改成 fetch 後台 API），
 * 沒有提供時使用 config.js 的 defaultContent（mock 用）。格式：
 *   {
 *     period: '2026/11/18 – 2026/12/31',
 *     freeOpens: 5,                    // 可開次數
 *     packCount: 20,                   // 卡包可開啟數量（最多 20）；盲盒使用 boxCount
 *     perOpen: 3,                      // 每次開出幾個獎品（卡包 1～5；盲盒通常 1）
 *     prizes: [ { name: { en, ko, th, zh }, icon: '圖片網址', rarity: 'common|rare|epic|legendary', weight: 10 }, ... ],
 *     // 空獎：{ type: 'empty', name: { en: 'Better luck next time', ko, th, zh }, weight: 15 }；仍消耗一次。
 *     winners: [ { name: 'pl***88', prize: 0 }, ... ],   // 跑馬燈；prize 為獎項索引或 { en, ko, th, zh }，名字請先遮罩
 *     rulesTitle: { en, ko, th, zh },
 *     rules: { en: ['…'], ko: ['…'], th: ['…'], zh: ['…'] },
 *     updatedAt: '內容版本；變動時前台會重發次數'
 *   }
 * 文字欄位 ko / th 留空時前台顯示 en；zh 只在內部預覽（Ctrl+Alt+L）顯示。en / ko / th 不得含中文，需由後台把關。
 *
 * 正式上線時開獎必須由後端決定：宣告 window.EVENT_RESOLVE = async ({ type, selection, count }) => [獎項索引或獎項物件, ...]，
 * 由後端檢查資格、扣次數並回傳結果（請帶冪等請求 ID，避免斷線重試重複扣次數）。沒有宣告時用本檔的 mock 權重抽獎。
 */
window.EventStore = (function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var RARITIES = ['common', 'rare', 'epic', 'legendary'];

  function load() {
    var c = window.EVENT_CONTENT || JSON.parse(JSON.stringify(cfg.defaultContent));
    if (!c.updatedAt) c.updatedAt = 'default';
    return c;
  }

  // 內容不完整時前台顯示「尚未設定獎項」而不是壞掉的流程。
  function isValid(c) {
    var prizes = c && Array.isArray(c.prizes) ? c.prizes : [];
    if (!prizes.length) return false;
    var total = 0;
    for (var i = 0; i < prizes.length; i++) {
      var p = prizes[i] || {};
      var w = Number(p.weight);
      if (!p.name || !String(p.name.en || '').trim() || !(w >= 0)) return false;
      total += w;
    }
    return total > 0;
  }

  function isEmpty(p) { return !!p && p.type === 'empty'; }

  function rarityRank(p) {
    var r = RARITIES.indexOf(p && p.rarity);
    return r < 0 ? 0 : r;
  }

  function pickIndex(prizes) {
    var total = prizes.reduce(function (s, p) { return s + Number(p.weight); }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < prizes.length; i++) {
      r -= Number(prizes[i].weight);
      if (r < 0) return i;
    }
    return prizes.length - 1;
  }

  // 回傳獎項物件陣列，依稀有度由低到高排序，最好的留到最後揭曉。
  function resolve(content, request) {
    var prizes = content.prizes;
    var secret = request.edition === 'secret';
    if (secret) request = Object.assign({}, request, { count: 3 });
    var secretPrizes = secret ? prizes.filter(function (p) { return !isEmpty(p) && rarityRank(p) >= 2 && Number(p.weight) > 0; }) : [];
    if (secret && typeof window.EVENT_RESOLVE !== 'function' && !secretPrizes.length) return Promise.reject(new Error('No eligible secret reward'));
    var run = typeof window.EVENT_RESOLVE === 'function'
      ? Promise.resolve().then(function () { return window.EVENT_RESOLVE(request); })
      : new Promise(function (done) {
        setTimeout(function () {
          var out = [];
          for (var i = 0; i < request.count; i++) out.push(secret ? secretPrizes[pickIndex(secretPrizes)] : pickIndex(prizes));
          done(out);
        }, 300);
      });
    return run.then(function (list) {
      if (!Array.isArray(list) || !list.length) throw new Error('Invalid reward response');
      var rewards = list.map(function (x) { return typeof x === 'number' ? prizes[x] : x; });
      if (rewards.some(function (r) { return !r || !r.name; })) throw new Error('Invalid reward response');
      if (secret && (rewards.length !== 3 || rewards.some(function (r) { return isEmpty(r) || rarityRank(r) < 2; }))) throw new Error('Secret packs require three EPIC or better prizes');
      return rewards.slice().sort(function (a, b) { return rarityRank(a) - rarityRank(b); });
    });
  }

  return { RARITIES: RARITIES, load: load, isValid: isValid, resolve: resolve, rarityRank: rarityRank, isEmpty: isEmpty };
})();
