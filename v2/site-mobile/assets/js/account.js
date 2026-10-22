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
  function currentLocale() { try { return localStorage.getItem('win100-locale') || 'zh'; } catch (e) { return 'zh'; } }
  function walletMask(addr) { addr = addr || ''; return addr.length > 12 ? addr.slice(0, 6) + '...' + addr.slice(-4) : addr; }

  var TRASH = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>';
  var COPY = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
  var CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  function bankCardHtml(a, i) {
    return '<div class="relative flex-none w-64">' +
      '<div class="relative overflow-hidden rounded-2xl p-4 bg-surface border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_14px_24px_-12px_rgba(0,0,0,.8)]">' +
      '<span class="pointer-events-none absolute inset-x-0 top-0 h-[52px] rounded-br-[40px] bg-[linear-gradient(120deg,color-mix(in_srgb,rgb(var(--c-primary))_55%,white),rgb(var(--c-primary))_55%,color-mix(in_srgb,rgb(var(--c-primary))_70%,black))] shadow-[inset_0_1px_0_rgba(255,255,255,.5)]" aria-hidden="true"></span>' +
      '<div class="relative flex items-center justify-between">' +
      '<p class="text-[12px] font-bold text-on-primary">' + esc(a.bank) + '</p>' +
      '<button type="button" class="grid h-7 w-7 place-items-center rounded-lg bg-black/15 text-on-primary" data-acct-bank-del="' + i + '" aria-label="' + esc(tx('Delete bank account')) + '">' + TRASH + '</button>' +
      '</div>' +
      '<p class="relative mt-4 text-[15px] font-bold tracking-widest text-text">' + esc(a.num) + '</p>' +
      '<div class="relative mt-3 flex items-center justify-between text-[11px] text-text-3">' +
      '<span>' + esc(a.holder) + '</span><span>' + esc(t('account.bound')) + ' ' + esc(a.bindDate) + '</span>' +
      '</div></div></div>';
  }

  function init() {
    var bankWrap = document.querySelector('[data-acct-banks]');
    var walletWrap = document.querySelector('[data-acct-wallet]');
    if (!bankWrap || !walletWrap) return;
    var banks = D.BANK_ACCOUNTS = D.BANK_ACCOUNTS || [];
    var wallets = D.WALLET_ACCOUNTS = D.WALLET_ACCOUNTS || [];

    function renderBanks() {
      bankWrap.innerHTML = banks.length
        ? banks.map(bankCardHtml).join('')
        : '<div class="flex w-full flex-col items-center gap-2 rounded-2xl border border-border-soft bg-surface py-6 text-[12.5px] text-text-3">' + esc(tx('No bank account')) + '</div>';
    }
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
  }

  document.addEventListener('DOMContentLoaded', init);
})();
