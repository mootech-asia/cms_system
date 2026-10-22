/* withdrawal.html：比照 v2/site 桌機版 initWithdrawalBankCarousel() /
   initWithdrawalForms()。
   - 主分頁 Withdraw / Account Management；Withdraw 內再分 Bank Card / Crypto Wallet。
   - 銀行卡輪播（上一張／下一張、卡面「+」跳到管理頁並展開新增表單）、
     Refresh、主錢包與流水資訊、Detail 連到 withdrawal-detail.html。
   - 金額＋交易密碼都填才能 Submit（密碼可切換顯示），送出跳成功彈窗。
   - 管理頁：已登記銀行帳戶（最多 5）與錢包（最多 1）清單、刪除確認、
     「+ 新增」展開表單，欄位填齊才能送出，新增後清單與輪播同步。
   帳戶資料跟桌機版同一份 D.BANK_ACCOUNTS / D.WALLET_ACCOUNTS（記憶體內，
   重新整理即還原，與桌機版相同）。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};

  function tx(en) { return window.__v2mTx ? window.__v2mTx(en) : en; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function modal(opts) { if (window.__v2mModal) window.__v2mModal(opts); }
  function walletMask(addr) { addr = addr || ''; return addr.length > 12 ? addr.slice(0, 6) + '...' + addr.slice(-4) : addr; }
  function acctTail(num) { var d = (num || '').replace(/\D/g, ''); return '＊＊＊＊' + (d.slice(-4) || '0000'); }
  function acctMask(num) { var d = (num || '').replace(/\D/g, ''); return '********' + (d.slice(-4) || '0000'); }
  function today() { return new Date().toISOString().slice(0, 10); }

  var TAB = 'h-10 flex-1 rounded-xl text-[13px] font-bold';
  var TAB_ON = ['bg-[image:var(--g-primary)]', 'text-on-primary'];
  var TAB_OFF = ['bg-surface', 'text-text-2'];
  var FIELD = 'h-12 w-full rounded-xl border border-border-soft bg-bg px-4 text-[14px] text-text';
  var LABEL = 'mb-1.5 mt-3 block text-[12px] font-semibold text-text-2';
  var H2 = 'mb-3 border-l-[3px] border-primary pl-2.5 text-[14.5px] font-bold text-primary';
  var BTN_IDLE = ['bg-surface-2', 'text-text-3'];
  var BTN_READY = ['bg-[image:var(--g-primary)]', 'text-on-primary'];
  var TRASH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>';
  var EYE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  var BANK_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M7 15h4"></path></svg>';
  var COIN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 8h3.8a2.2 2.2 0 0 1 0 4.4H9.5z"></path><path d="M9.5 12.4h4.2a2.3 2.3 0 0 1 0 4.6H9.5z"></path><path d="M9.5 6v12M11 4.5V6M14 4.5V6M11 18v1.5M14 18v1.5"></path></svg>';

  function setOn(el, on, onCls, offCls) {
    onCls.forEach(function (c) { el.classList.toggle(c, on); });
    offCls.forEach(function (c) { el.classList.toggle(c, !on); });
  }
  function pwField(placeholder) {
    return '<div class="relative"><input type="password" class="' + FIELD + ' pr-12" placeholder="' + esc(placeholder) + '" data-wd-field>' +
      '<button type="button" class="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-text-3" data-wd-eye aria-label="' + esc(tx('Show password')) + '">' + EYE + '</button></div>';
  }
  function submitBtn(attr) {
    return '<button type="button" class="mt-5 h-12 w-full rounded-xl bg-surface-2 text-[14px] font-bold text-text-3" disabled ' + attr + '>' + esc(tx('Submit')) + '</button>';
  }
  function rolloverRow(cls) {
    return '<div class="mt-3 grid grid-cols-2 gap-3 text-center text-[12px]">' +
      '<div><p class="text-danger">' + esc(tx('*Rollover Achieved')) + '</p><p class="font-semibold text-danger">' + esc(tx('amount: ₩0.00')) + (cls ? ' <a href="withdrawal-detail.html" class="ml-1 inline-block rounded-full border border-danger px-2 py-px text-[10.5px] font-bold text-danger">' + esc(tx('Detail')) + '</a>' : '') + '</p></div>' +
      '<div><p class="text-danger">' + esc(tx('Target amount:')) + '</p><p class="font-semibold text-danger">₩0.00</p></div></div>';
  }

  function init() {
    var root = document.getElementById('wd-app');
    if (!root) return;
    var banks = D.BANK_ACCOUNTS = D.BANK_ACCOUNTS || [];
    var wallets = D.WALLET_ACCOUNTS = D.WALLET_ACCOUNTS || [];
    var idx = 0;

    root.innerHTML =
      '<div class="mb-3 flex gap-2 rounded-2xl bg-surface p-1">' +
      '<button type="button" class="' + TAB + '" data-wd-mode="withdraw">' + esc(tx('Withdraw')) + '</button>' +
      '<button type="button" class="' + TAB + '" data-wd-mode="management">' + esc(tx('Account Management')) + '</button></div>' +

      /* ---------- Withdraw ---------- */
      '<div data-wd-panel="withdraw">' +
      '<div class="mb-3 grid grid-cols-2 gap-2">' +
      '<button type="button" class="flex h-12 items-center justify-center gap-2 rounded-xl border text-[13px] font-bold" data-wd-method="bank">' + BANK_SVG + esc(tx('Bank Card')) + '</button>' +
      '<button type="button" class="flex h-12 items-center justify-center gap-2 rounded-xl border text-[13px] font-bold" data-wd-method="crypto">' + COIN_SVG + esc(tx('Crypto Wallet')) + '</button></div>' +

      '<section class="rounded-2xl border border-border-soft bg-surface p-4" data-wd-section="bank">' +
      '<div class="mb-3 flex items-center justify-center gap-3">' +
      '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-text-2" data-wd-prev aria-label="Previous"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button>' +
      '<h2 class="text-[14px] font-bold text-text">' + esc(tx('My Bank Accounts')) + ' <span class="text-text-3" data-wd-count></span></h2>' +
      '<button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-text-2" data-wd-next aria-label="Next"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg></button></div>' +
      '<div class="relative overflow-hidden rounded-2xl border border-border bg-[linear-gradient(135deg,rgb(var(--c-surface-2)),rgb(var(--c-bg)))] p-4" data-wd-card>' +
      '<button type="button" class="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[image:var(--g-primary)] text-on-primary" data-wd-card-add aria-label="' + esc(tx('Add bank account')) + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button>' +
      '<span class="inline-block rounded-md bg-bg px-2 py-1 text-[11px] font-bold text-text" data-wd-bank></span>' +
      '<p class="mt-3 text-center text-[11px] text-text-3">' + esc(tx('Account number')) + '</p>' +
      '<p class="text-center text-[20px] font-bold tracking-widest text-text" data-wd-num></p>' +
      '<div class="mt-3 flex items-end justify-between"><span class="text-[12px] font-bold text-gold" data-wd-holder></span>' +
      '<span class="text-right text-[10.5px] text-text-3">' + esc(tx('Bind Date')) + '<br><b class="text-[12px] text-text" data-wd-date></b></span></div></div>' +
      '<button type="button" class="mt-2 flex items-center gap-1.5 text-[12.5px] text-text-2" data-wd-refresh><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"></path><path d="M21 3v5h-5"></path></svg>' + esc(tx('Refresh')) + '</button>' +
      '<h3 class="mt-4 text-center text-[14px] font-bold text-text">' + esc(tx('Main Wallet')) + '</h3>' +
      '<p class="mt-1 text-center text-[26px] font-extrabold text-text">₩ 0.00</p>' +
      rolloverRow(true) +
      '<h2 class="mt-5 ' + H2 + '">' + esc(tx('Withdrawal Amount & Password')) + '</h2>' +
      '<input type="text" inputmode="numeric" class="' + FIELD + '" placeholder="₩ 10,000 ~ ₩ 9,000,000" data-wd-field>' +
      '<div class="mt-3">' + pwField('* * * * * *') + '</div>' +
      rolloverRow(false) +
      submitBtn('data-wd-submit="bank"') +
      '</section>' +

      '<section class="hidden rounded-2xl border border-border-soft bg-surface p-4" data-wd-section="crypto">' +
      '<h2 class="' + H2 + '">' + esc(tx('Crypto Wallet')) + '</h2>' +
      '<div data-wd-wallet-panel></div>' +
      '<div class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl bg-bg p-3 text-[12.5px]"><span class="text-text-3">' + esc(tx('Central Wallet:')) + '</span><strong class="text-right text-text">0.00</strong><span class="text-text-3">' + esc(tx('Available Amount:')) + '</span><strong class="text-right text-text">0.00</strong></div>' +
      '<h2 class="mt-5 ' + H2 + '">' + esc(tx('Withdrawal Amount & Password')) + '</h2>' +
      '<label class="' + LABEL + '">' + esc(tx('Wallet type:')) + '</label><select class="' + FIELD + '" data-wd-field><option value="">' + esc(tx('Please select wallet type')) + '</option><option>USDT TRC20</option></select>' +
      '<label class="' + LABEL + '">' + esc(tx('Wallet address:')) + '</label><input class="' + FIELD + '" placeholder="' + esc(tx('Please fill in wallet address')) + '" data-wd-field>' +
      '<label class="' + LABEL + '">' + esc(tx('Withdrawal Amount:')) + '</label><input class="' + FIELD + '" inputmode="numeric" placeholder="100,000 ~ 20,000,000" data-wd-field>' +
      '<label class="' + LABEL + '">' + esc(tx('Transaction Password:')) + '</label>' + pwField(tx('Please fill in the transaction password')) +
      submitBtn('data-wd-submit="crypto"') +
      '</section>' +
      '</div>' +

      /* ---------- Account Management ---------- */
      '<div class="hidden" data-wd-panel="management">' +
      '<div class="mb-3 grid grid-cols-2 gap-2">' +
      '<button type="button" class="flex h-12 items-center justify-center gap-2 rounded-xl border text-[13px] font-bold" data-wd-mgmt-tab="bank">' + BANK_SVG + esc(tx('Bank Account')) + '</button>' +
      '<button type="button" class="flex h-12 items-center justify-center gap-2 rounded-xl border text-[13px] font-bold" data-wd-mgmt-tab="crypto">' + COIN_SVG + esc(tx('Crypto Wallet')) + '</button></div>' +
      '<section class="rounded-2xl border border-border-soft bg-surface p-4" data-wd-mgmt="bank">' +
      '<h2 class="' + H2 + '">' + esc(tx('Registered Withdrawal Accounts')) + ' <span data-wd-mgmt-count></span></h2>' +
      '<div class="flex flex-col gap-2" data-wd-mgmt-list></div>' +
      '<button type="button" class="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/50 text-[13px] font-bold text-primary" data-wd-add="bank" aria-expanded="false"><span class="text-[18px] leading-none">+</span>' + esc(tx('Add bank account')) + '</button>' +
      '<div class="hidden" data-wd-form="bank">' +
      '<label class="' + LABEL + '">' + esc(tx('Select Bank:')) + '</label><select class="' + FIELD + '" data-wd-field><option value="">' + esc(tx('Please Select a Bank')) + '</option><option>Shinhan Bank</option><option>KB Bank</option></select>' +
      '<label class="' + LABEL + '">' + esc(tx('Name on Card:')) + '</label><input class="' + FIELD + ' opacity-60" value="T***" disabled>' +
      '<label class="' + LABEL + '">' + esc(tx('Account Number:')) + '</label><input class="' + FIELD + '" inputmode="numeric" placeholder="' + esc(tx('Please Enter Account/Card/Phone number')) + '" data-wd-field>' +
      '<label class="' + LABEL + '">' + esc(tx('Transaction Password:')) + '</label>' + pwField(tx('Please Fill in the Transaction Password')) +
      submitBtn('data-wd-submit="mgmt-bank"') +
      '</div></section>' +
      '<section class="hidden rounded-2xl border border-border-soft bg-surface p-4" data-wd-mgmt="crypto">' +
      '<h2 class="' + H2 + '">' + esc(tx('Bound wallet')) + ' <span data-wd-wallet-count></span></h2>' +
      '<div data-wd-mgmt-wallet></div>' +
      '<button type="button" class="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/50 text-[13px] font-bold text-primary" data-wd-add="crypto" aria-expanded="false"><span class="text-[18px] leading-none">+</span>' + esc(tx('Add wallet')) + '</button>' +
      '<div class="hidden" data-wd-form="crypto">' +
      '<label class="' + LABEL + '">' + esc(tx('Wallet type:')) + '</label><select class="' + FIELD + '" data-wd-field><option value="">' + esc(tx('Please select wallet type')) + '</option><option>USDT TRC20</option></select>' +
      '<label class="' + LABEL + '">' + esc(tx('Wallet address:')) + '</label><input class="' + FIELD + '" placeholder="' + esc(tx('Please fill in wallet address')) + '" data-wd-field>' +
      '<label class="' + LABEL + '">' + esc(tx('Transaction Password:')) + '</label>' + pwField(tx('Please Fill in the Transaction Password')) +
      submitBtn('data-wd-submit="mgmt-crypto"') +
      '</div></section>' +
      '</div>';

    var q = function (sel) { return root.querySelector(sel); };
    var qa = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

    /* ----- 銀行卡輪播 ----- */
    function renderCard() {
      var a = banks[idx];
      q('[data-wd-count]').textContent = banks.length ? (idx + 1) + ' / ' + banks.length : '0 / 0';
      q('[data-wd-bank]').textContent = a ? a.bank : '-';
      q('[data-wd-num]').textContent = a ? acctTail(a.num) : '-';
      q('[data-wd-holder]').textContent = a ? a.holder : '';
      q('[data-wd-date]').textContent = a ? a.bindDate : '-';
    }
    q('[data-wd-prev]').addEventListener('click', function () { if (banks.length) { idx = (idx - 1 + banks.length) % banks.length; renderCard(); } });
    q('[data-wd-next]').addEventListener('click', function () { if (banks.length) { idx = (idx + 1) % banks.length; renderCard(); } });
    q('[data-wd-refresh]').addEventListener('click', function () {
      var card = q('[data-wd-card]');
      card.classList.remove('animate-pulse');
      void card.offsetWidth; /* 強制 reflow，連按時動畫從頭播 */
      card.classList.add('animate-pulse');
      setTimeout(function () { card.classList.remove('animate-pulse'); }, 1200);
      renderCard();
    });

    /* ----- 錢包（Withdraw 的 Crypto 面板 + 管理頁）----- */
    function walletCardHtml(w, withDelete) {
      return '<div class="flex items-center gap-3 rounded-xl border border-border-soft bg-bg p-3">' +
        '<span class="grid h-10 w-10 flex-none place-items-center rounded-full bg-primary/16 font-bold text-primary">₿</span>' +
        '<div class="min-w-0 flex-1"><strong class="block text-[13px] text-text">' + esc(w.type) + '</strong><span class="block truncate text-[11.5px] text-text-3">' + esc(walletMask(w.address)) + '</span><span class="block text-[11px] text-text-3">' + esc(w.bindDate || '') + '</span></div>' +
        (withDelete ? '<button type="button" class="grid h-9 w-9 place-items-center rounded-lg text-text-3" data-wd-wallet-del aria-label="' + esc(tx('Delete')) + '">' + TRASH + '</button>' : '') + '</div>';
    }
    function emptyWallet(withAdd) {
      return '<div class="flex flex-col items-center gap-2 rounded-xl bg-bg py-6 text-[12.5px] text-text-3"><span class="grid h-12 w-12 place-items-center rounded-full border border-border text-[20px]">₿</span>' + esc(tx('Empty wallet list')) +
        (withAdd ? '<button type="button" class="mt-1 flex h-9 items-center gap-1 rounded-lg border border-dashed border-primary/50 px-3 font-bold text-primary" data-wd-goto-add-wallet><span class="text-[16px] leading-none">+</span>' + esc(tx('Add wallet')) + '</button>' : '') + '</div>';
    }
    function renderWallets() {
      q('[data-wd-wallet-panel]').innerHTML = wallets.length ? walletCardHtml(wallets[0], false) : emptyWallet(true);
      q('[data-wd-mgmt-wallet]').innerHTML = wallets.length ? walletCardHtml(wallets[0], true) : emptyWallet(false);
      q('[data-wd-wallet-count]').textContent = '(' + wallets.length + '/1)';
    }
    function renderBankList() {
      q('[data-wd-mgmt-count]').textContent = '(' + banks.length + '/5)';
      q('[data-wd-mgmt-list]').innerHTML = banks.map(function (a, i) {
        return '<div class="flex items-center gap-3 rounded-xl border border-border-soft bg-bg p-3">' +
          '<span class="grid h-10 w-10 flex-none place-items-center rounded-lg bg-surface-2 text-center text-[9px] font-bold leading-tight text-text">' + esc(a.bank) + '</span>' +
          '<div class="min-w-0 flex-1"><strong class="block text-[13px] text-text">' + esc(a.bank) + '</strong><span class="block text-[11.5px] text-text-3">' + acctMask(a.num) + '</span><span class="block text-[11px] text-text-3">' + esc(a.bindDate || '') + '</span></div>' +
          '<button type="button" class="grid h-9 w-9 place-items-center rounded-lg text-text-3" data-wd-bank-del="' + i + '" aria-label="' + esc(tx('Delete')) + '">' + TRASH + '</button></div>';
      }).join('');
    }

    /* ----- 分頁 ----- */
    var mode = 'withdraw';
    var method = 'bank';
    var mgmtTab = 'bank';
    function sync() {
      qa('[data-wd-mode]').forEach(function (b) { setOn(b, b.getAttribute('data-wd-mode') === mode, TAB_ON, TAB_OFF); });
      qa('[data-wd-panel]').forEach(function (p) { p.classList.toggle('hidden', p.getAttribute('data-wd-panel') !== mode); });
      qa('[data-wd-method]').forEach(function (b) {
        setOn(b, b.getAttribute('data-wd-method') === method, ['border-transparent', 'bg-[image:var(--g-primary)]', 'text-on-primary'], ['border-border-soft', 'bg-surface', 'text-text']);
      });
      qa('[data-wd-section]').forEach(function (s) { s.classList.toggle('hidden', s.getAttribute('data-wd-section') !== method); });
      qa('[data-wd-mgmt-tab]').forEach(function (b) {
        setOn(b, b.getAttribute('data-wd-mgmt-tab') === mgmtTab, ['border-transparent', 'bg-[image:var(--g-primary)]', 'text-on-primary'], ['border-border-soft', 'bg-surface', 'text-text']);
      });
      qa('[data-wd-mgmt]').forEach(function (s) { s.classList.toggle('hidden', s.getAttribute('data-wd-mgmt') !== mgmtTab); });
    }
    function openAddForm(kind) {
      var form = q('[data-wd-form="' + kind + '"]');
      var btn = q('[data-wd-add="' + kind + '"]');
      form.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
    }

    /* ----- 送出鈕 gate：區塊內所有可填欄位都有值才啟用 ----- */
    function scopeOf(btn) { return btn.closest('[data-wd-form]') || btn.closest('[data-wd-section]'); }
    function fieldsOf(btn) { return Array.prototype.slice.call(scopeOf(btn).querySelectorAll('[data-wd-field]')); }
    function gate(btn) {
      var ok = fieldsOf(btn).every(function (f) { return (f.value || '').trim() !== ''; });
      btn.disabled = !ok;
      setOn(btn, ok, BTN_READY, BTN_IDLE);
    }
    var submits = qa('[data-wd-submit]');
    root.addEventListener('input', function () { submits.forEach(gate); });
    root.addEventListener('change', function () { submits.forEach(gate); });

    root.addEventListener('click', function (e) {
      var t = e.target;
      var b;
      if ((b = t.closest('[data-wd-mode]'))) { mode = b.getAttribute('data-wd-mode'); sync(); return; }
      if ((b = t.closest('[data-wd-method]'))) { method = b.getAttribute('data-wd-method'); sync(); return; }
      if ((b = t.closest('[data-wd-mgmt-tab]'))) { mgmtTab = b.getAttribute('data-wd-mgmt-tab'); sync(); return; }
      if ((b = t.closest('[data-wd-eye]'))) {
        var input = b.parentElement.querySelector('input');
        input.type = input.type === 'password' ? 'text' : 'password';
        return;
      }
      if ((b = t.closest('[data-wd-add]'))) {
        var kind = b.getAttribute('data-wd-add');
        var form = q('[data-wd-form="' + kind + '"]');
        var open = form.classList.contains('hidden');
        form.classList.toggle('hidden', !open);
        b.setAttribute('aria-expanded', String(open));
        return;
      }
      if (t.closest('[data-wd-card-add]')) { mode = 'management'; mgmtTab = 'bank'; sync(); openAddForm('bank'); return; }
      if (t.closest('[data-wd-goto-add-wallet]')) { mode = 'management'; mgmtTab = 'crypto'; sync(); return; }
      if ((b = t.closest('[data-wd-bank-del]'))) {
        var i = +b.getAttribute('data-wd-bank-del');
        var a = banks[i];
        modal({
          type: 'danger', subject: a ? a.bank : '',
          onConfirm: function () {
            banks.splice(i, 1);
            if (idx >= banks.length) idx = Math.max(0, banks.length - 1);
            renderBankList(); renderCard();
            modal({ type: 'success', message: tx('Bank account deleted successfully.') });
          }
        });
        return;
      }
      if (t.closest('[data-wd-wallet-del]')) {
        modal({
          type: 'danger', subject: wallets[0] ? wallets[0].type : '',
          onConfirm: function () {
            wallets.splice(0, 1);
            renderWallets();
            modal({ type: 'success', message: tx('Wallet deleted successfully.') });
          }
        });
        return;
      }
      if ((b = t.closest('[data-wd-submit]'))) {
        if (b.disabled) return;
        var which = b.getAttribute('data-wd-submit');
        var fields = fieldsOf(b);
        if (which === 'bank') {
          modal({ type: 'success', message: tx('Withdrawal request submitted successfully.') });
          return;
        }
        if (which === 'mgmt-bank') {
          banks.push({ bank: fields[0].value, num: fields[1].value, holder: 'M＊＊＊＊＊＊＊', bindDate: today() });
          renderBankList(); renderCard();
        } else if (which === 'mgmt-crypto') {
          if (wallets.length >= 1) { modal({ type: 'warning', message: tx('Only 1 wallet can be bound at a time.') }); return; }
          wallets.push({ type: fields[0].value, address: fields[1].value, bindDate: today() });
          renderWallets();
        }
        if (which !== 'crypto') fields.forEach(function (f) { f.value = ''; });
        gate(b);
        modal({ type: 'success', message: tx('Your request has been submitted successfully.') });
      }
    });

    renderCard();
    renderWallets();
    renderBankList();
    submits.forEach(gate);
    if (new URLSearchParams(location.search).get('tab') === 'management') mode = 'management';
    sync();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
