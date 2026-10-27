/* account.html：比照 v2/site 桌機版 initAccountBankCarousel() /
   initAccountWalletCard()。銀行卡與加密錢包都讀桌機版同一份
   D.BANK_ACCOUNTS / D.WALLET_ACCOUNTS（記憶體內，重新整理即還原）；
   每張卡可刪除（確認彈窗 → 成功彈窗），錢包地址可複製（1.5 秒顯示已複製）。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};

  function tx(en) { return window.__v2mTx ? window.__v2mTx(en) : en; }
  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function modal(opts) { if (window.__v2mModal) window.__v2mModal(opts); }
  function currentLocale() { return window.__v2mLocale ? window.__v2mLocale() : 'en'; }
  function walletMask(addr) { addr = addr || ''; return addr.length > 12 ? addr.slice(0, 6) + '...' + addr.slice(-4) : addr; }

  var TRASH = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>';
  var COPY = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
  var CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  /* 比照桌機版 account.html 的 Banking Details 面板：卡號列（含刪除）＋銀行名稱列，
     一次顯示一張，用左右鍵或左右滑動切換。 */
  function bankPanelHtml(a, i) {
    return '<div class="flex items-center gap-3 border-b border-border-soft pb-2.5 text-[13px] text-text">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-none text-text-3" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>' +
      '<span class="flex-1 font-mono text-[12.5px] tracking-wider">' + esc(a.num) + '</span>' +
      '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-text-3" data-acct-bank-del="' + i + '" aria-label="' + esc(tx('Delete bank account')) + '">' + TRASH + '</button></div>' +
      '<div class="flex items-center gap-3 pt-2.5 text-[13px] text-text">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-none text-text-3" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path></svg>' +
      '<span class="flex-1 font-semibold">' + esc(a.bank) + '</span></div>';
  }

  function init() {
    var bankWrap = document.querySelector('[data-acct-banks]');
    var walletWrap = document.querySelector('[data-acct-wallet]');
    if (!bankWrap || !walletWrap) return;
    var banks = D.BANK_ACCOUNTS = D.BANK_ACCOUNTS || [];
    var wallets = D.WALLET_ACCOUNTS = D.WALLET_ACCOUNTS || [];

    var bankIdx = 0;
    var bankPrev = document.querySelector('[data-acct-bank-prev]');
    var bankNext = document.querySelector('[data-acct-bank-next]');
    var bankCount = document.querySelector('[data-acct-bank-count]');
    function renderBanks() {
      if (bankIdx >= banks.length) bankIdx = Math.max(0, banks.length - 1);
      bankWrap.innerHTML = banks.length
        ? bankPanelHtml(banks[bankIdx], bankIdx)
        : '<div class="flex flex-col items-center gap-2 py-3 text-[12.5px] text-text-3">' + esc(tx('No bank account')) + '</div>';
      if (bankCount) bankCount.textContent = banks.length ? (bankIdx + 1) + '/' + banks.length : '0/0';
      if (bankPrev) bankPrev.disabled = banks.length < 2;
      if (bankNext) bankNext.disabled = banks.length < 2;
    }
    function stepBank(d) {
      if (banks.length < 2) return;
      bankIdx = (bankIdx + d + banks.length) % banks.length;
      renderBanks();
    }
    if (bankPrev) bankPrev.addEventListener('click', function () { stepBank(-1); });
    if (bankNext) bankNext.addEventListener('click', function () { stepBank(1); });
    var swipeX = null, swipeY = 0;
    bankWrap.addEventListener('pointerdown', function (e) { swipeX = e.clientX; swipeY = e.clientY; });
    bankWrap.addEventListener('pointerup', function (e) {
      if (swipeX === null) return;
      var dx = e.clientX - swipeX, dy = e.clientY - swipeY;
      swipeX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) stepBank(dx < 0 ? 1 : -1);
    });
    bankWrap.addEventListener('pointercancel', function () { swipeX = null; });
    function renderWallet() {
      if (!wallets.length) {
        walletWrap.innerHTML = '<div class="flex flex-col items-center gap-2 py-3 text-[12.5px] text-text-3"><span class="grid h-11 w-11 place-items-center rounded-full border border-border text-[18px]">₿</span>' + esc(tx('Empty wallet list')) + '</div>';
        return;
      }
      var w = wallets[0];
      walletWrap.innerHTML =
        '<div class="flex items-center gap-3 border-b border-border-soft pb-2.5 text-[13px] text-text">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-none text-text-3" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>' +
        '<span class="flex-1 font-semibold">' + esc(w.type) + '</span>' +
        '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-text-3" data-acct-wallet-del aria-label="' + esc(tx('Delete wallet')) + '">' + TRASH + '</button></div>' +
        '<div class="flex items-center gap-3 pt-2.5 text-[13px] text-text">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-none text-text-3" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-4M12 8v8"></path></svg>' +
        '<span class="flex-1 font-mono text-[12.5px]">' + esc(walletMask(w.address)) + '</span>' +
        '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-text-3" data-acct-wallet-copy aria-label="' + esc(copyLabel()) + '">' + COPY + '</button></div>';
    }
    function qrText() { var q = D.DEPOSIT_QR || {}; return q[currentLocale()] || q.en || {}; }
    function copyLabel() { return qrText().copy || 'Copy'; }

    bankWrap.addEventListener('click', function (e) {
      var del = e.target.closest('[data-acct-bank-del]');
      if (!del) return;
      var i = +del.getAttribute('data-acct-bank-del');
      modal({
        type: 'danger', subject: banks[i] ? banks[i].bank : '',
        onConfirm: function () {
          banks.splice(i, 1);
          renderBanks();
          modal({ type: 'success', message: tx('Bank account deleted successfully.') });
        }
      });
    });
    walletWrap.addEventListener('click', function (e) {
      var copyBtn = e.target.closest('[data-acct-wallet-copy]');
      if (copyBtn) {
        try {
          var pr = navigator.clipboard.writeText(wallets[0].address);
          if (pr && pr.catch) pr.catch(function () { /* clipboard 權限被拒，示範流程靜默略過 */ });
        } catch (err) { /* clipboard 不可用，示範流程靜默略過 */ }
        copyBtn.innerHTML = CHECK;
        copyBtn.classList.add('text-primary');
        copyBtn.setAttribute('aria-label', qrText().copied || 'Copied');
        setTimeout(function () {
          copyBtn.innerHTML = COPY;
          copyBtn.classList.remove('text-primary');
          copyBtn.setAttribute('aria-label', copyLabel());
        }, 1500);
        return;
      }
      if (e.target.closest('[data-acct-wallet-del]')) {
        modal({
          type: 'danger', subject: wallets[0] ? wallets[0].type : '',
          onConfirm: function () {
            wallets.splice(0, 1);
            renderWallet();
            modal({ type: 'success', message: tx('Wallet deleted successfully.') });
          }
        });
      }
    });

    renderBanks();
    renderWallet();
    countUp();
  }

  /* 會員卡數字由 0 跳到實際值（約 0.9 秒、ease-out），保留原字串的前後綴、千分位與
     小數位數；系統設定減少動態時直接顯示最終值。 */
  function countUp() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Array.prototype.forEach.call(document.querySelectorAll('[data-count-up]'), function (el) {
      var m = (el.textContent || '').trim().match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
      if (!m || reduce) return;
      var prefix = m[1], raw = m[2], suffix = m[3];
      var target = parseFloat(raw.replace(/,/g, ''));
      if (!target) return;
      var decimals = (raw.split('.')[1] || '').length;
      var grouped = raw.indexOf(',') !== -1;
      function fmt(v) {
        var str = v.toFixed(decimals);
        if (grouped) { var parts = str.split('.'); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); str = parts.join('.'); }
        return prefix + str + suffix;
      }
      var start = null, dur = 900, delay = 250;
      el.textContent = fmt(0);
      function step(ts) {
        if (start === null) start = ts + delay;
        var k = Math.min(1, Math.max(0, (ts - start) / dur));
        el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
