/* deposit.html / withdrawal.html 共用的多步驟流程。比照 v2/site 桌機版
   site.js 的 initDepositFlow()/showDepositTransferStep()/showDepositQrStep()
   與 initWithdrawalForms()：儲值分「選通路→選付款方式+輸入金額→轉帳明細
   （銀行卡）或掃碼付款（LinePay/USDT）→完成」；提款則是「選帳戶+輸入
   金額與交易密碼→驗證→完成」。QR 圖案沿用桌機版同一套假圖案演算法
   （seed 雜湊決定黑白格），不是真的可掃 QR，純示意。 */
(function () {
  'use strict';
  var D = window.WIN100_DATA || {};

  function t(key) { return window.__v2mT ? window.__v2mT(key) : key; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function currentLocale() { try { return localStorage.getItem('win100-locale') || 'zh'; } catch (e) { return 'zh'; } }

  /* ============================== QR 假圖案（比照桌機版）============== */
  var QR_SIZE = 21;
  var QR_FINDERS = [{ x: 0, y: 0 }, { x: QR_SIZE - 7, y: 0 }, { x: 0, y: QR_SIZE - 7 }];
  function qrIsFinderZone(x, y) { return QR_FINDERS.some(function (p) { return x >= p.x && x < p.x + 7 && y >= p.y && y < p.y + 7; }); }
  function qrSeededModules(seed) {
    var hash = 0, i;
    for (i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    var cells = [];
    for (var y = 0; y < QR_SIZE; y += 1) {
      for (var x = 0; x < QR_SIZE; x += 1) {
        if (qrIsFinderZone(x, y)) continue;
        hash = (hash * 1103515245 + 12345) >>> 0;
        if (((hash >>> 16) & 1) === 1) cells.push({ x: x, y: y });
      }
    }
    return cells;
  }
  function qrSvgHtml(seed, altText) {
    var parts = ['<svg viewBox="-2 -2 25 25" class="w-full h-full" role="img" aria-label="' + esc(altText) + '">',
      '<rect x="-2" y="-2" width="25" height="25" fill="#ffffff"></rect>'];
    QR_FINDERS.forEach(function (p) {
      parts.push('<rect x="' + p.x + '" y="' + p.y + '" width="7" height="7" fill="#000000"></rect>');
      parts.push('<rect x="' + (p.x + 1) + '" y="' + (p.y + 1) + '" width="5" height="5" fill="#ffffff"></rect>');
      parts.push('<rect x="' + (p.x + 2) + '" y="' + (p.y + 2) + '" width="3" height="3" fill="#000000"></rect>');
    });
    qrSeededModules(seed).forEach(function (c) {
      parts.push('<rect x="' + c.x + '" y="' + c.y + '" width="1" height="1" fill="#000000"></rect>');
    });
    parts.push('</svg>');
    return parts.join('');
  }

  /* ============================== 通用完成畫面 ============================== */
  function doneStepHTML(successMsgKey, recordHref, recordLabelKey) {
    return (
      '<div class="flex flex-col items-center text-center py-10 px-2">' +
      '<span class="h-16 w-16 grid place-items-center rounded-full bg-accent-soft text-accent mb-4">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>' +
      '</span>' +
      '<p class="text-[16px] font-bold text-text mb-1.5">' + t('payment.successTitle') + '</p>' +
      '<p class="text-[13px] text-text-mid mb-6">' + t(successMsgKey) + '</p>' +
      '<a href="' + recordHref + '" class="w-full h-11 rounded-xl bg-accent text-text-on-accent text-[14px] font-bold grid place-items-center mb-2.5">' + t(recordLabelKey) + '</a>' +
      '<a href="index.html" class="w-full h-11 rounded-xl border border-line-hi text-text text-[14px] font-bold grid place-items-center">' + t('payment.backHome') + '</a>' +
      '</div>'
    );
  }

  /* ============================== Deposit ============================== */
  var DP_METHODS = [
    { id: 'bank', key: 'deposit.methodBank' },
    { id: 'linepay', key: 'deposit.methodLinepay' },
    { id: 'trc20', key: 'deposit.methodTrc20' },
    { id: 'erc20', key: 'deposit.methodErc20' },
  ];

  function initDepositFlow() {
    var flow = document.getElementById('dp-flow');
    if (!flow) return;
    var channelStep = flow.querySelector('[data-dp-step="channel"]');
    var selectedGateway = null;
    var selectedMethodId = 'bank';

    function showOnly(el) {
      Array.prototype.forEach.call(flow.children, function (c) { c.classList.add('hidden'); });
      el.classList.remove('hidden');
    }

    function methodStepHTML(methodCount) {
      var methods = DP_METHODS.slice(0, methodCount || DP_METHODS.length);
      var tabs = methods.map(function (m, i) {
        return '<button type="button" class="flex-none rounded-full px-4 py-2 text-[13px] font-semibold' +
          (i === 0 ? ' bg-accent text-text-on-accent' : ' bg-bg-card text-text-mid border border-line') +
          '" data-dp-method="' + m.id + '">' + t(m.key) + '</button>';
      }).join('');
      return (
        '<button type="button" class="flex items-center gap-1 text-[13px] font-semibold text-text-mid mb-4" data-dp-back>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>' + t('deposit.back') + '</button>' +
        '<div class="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4" data-dp-method-tabs>' + tabs + '</div>' +
        '<label class="block text-[12px] text-text-dim mb-1.5">' + t('deposit.amount') + '</label>' +
        '<input type="number" placeholder="' + t('deposit.amountPh') + '" class="w-full h-12 rounded-xl border border-line bg-bg-card px-4 text-[14px] text-text mb-4" id="dp-amount">' +
        '<button type="button" class="w-full h-12 rounded-xl bg-accent text-text-on-accent text-[14px] font-bold" data-dp-next>' + t('deposit.next') + '</button>'
      );
    }

    function transferStepHTML(amountVal) {
      return (
        '<div class="rounded-2xl border border-line bg-bg-card p-4">' +
        '<p class="inline-block rounded-full bg-accent-soft px-3 py-1 text-[12px] font-bold text-accent mb-4">' + t('deposit.transferPill') + '</p>' +
        '<div class="flex items-center justify-between py-2 border-b border-line text-[13px]"><span class="text-text-dim">' + t('deposit.amount') + '</span><span class="font-bold text-text">' + esc(amountVal) + '</span></div>' +
        '<div class="flex items-center justify-between py-2 border-b border-line text-[13px]"><span class="text-text-dim">' + t('deposit.transferAccountLabel') + '</span><span class="font-bold text-text">wururu1234</span></div>' +
        '<p class="text-[11.5px] text-text-dim leading-relaxed mt-3">' + t('deposit.transferNote') + '</p>' +
        '</div>' +
        '<button type="button" class="w-full h-12 rounded-xl bg-accent text-text-on-accent text-[14px] font-bold mt-4" data-dp-complete>' + t('deposit.complete') + '</button>'
      );
    }

    function qrStepHTML(methodId) {
      var qrData = D.DEPOSIT_QR || {};
      var loc = qrData[currentLocale()] || qrData.en || {};
      var addr = (qrData.addresses || {})[methodId] || (qrData.addresses || {}).linepay || '';
      return (
        '<div class="rounded-2xl border border-line bg-bg-card p-4">' +
        '<p class="inline-block rounded-full bg-accent-soft px-3 py-1 text-[12px] font-bold text-accent mb-3">' + esc(loc.pill || 'Scan to Pay') + '</p>' +
        '<p class="text-[12px] text-text-mid mb-4">' + esc(loc.hint || '') + '</p>' +
        '<div class="w-40 h-40 mx-auto mb-4">' + qrSvgHtml(methodId + '|' + addr, loc.altText || 'QR') + '</div>' +
        '<label class="block text-[11.5px] text-text-dim mb-1.5">' + esc(loc.addressLabel || 'Address') + '</label>' +
        '<div class="flex items-center gap-2">' +
        '<input class="flex-1 h-11 rounded-xl border border-line bg-bg px-3 text-[12.5px] text-text truncate" value="' + esc(addr) + '" readonly>' +
        '<button type="button" class="flex-none h-11 px-3.5 rounded-xl border border-line-hi text-[12.5px] font-semibold text-text" data-dp-copy="' + esc(addr) + '">' + esc(loc.copy || 'Copy') + '</button>' +
        '</div>' +
        '<p class="text-[11px] text-text-dim mt-3">' + esc(loc.note || '') + '</p>' +
        '</div>' +
        '<div class="flex items-center gap-2.5 mt-4">' +
        '<button type="button" class="flex-1 h-12 rounded-xl border border-line-hi text-text text-[14px] font-bold" data-dp-back>' + esc(loc.back || t('deposit.back')) + '</button>' +
        '<button type="button" class="flex-1 h-12 rounded-xl bg-accent text-text-on-accent text-[14px] font-bold" data-dp-qr-next>' + esc(loc.confirm || t('deposit.next')) + '</button>' +
        '</div>'
      );
    }

    function bindBackButtons(step) {
      var backBtn = step.querySelector('[data-dp-back]');
      if (backBtn) backBtn.addEventListener('click', function () { showOnly(channelStep); });
    }

    function goMethodStep() {
      var step = flow.querySelector('[data-dp-step="method"]');
      if (!step) {
        step = document.createElement('div');
        step.setAttribute('data-dp-step', 'method');
        flow.appendChild(step);
      }
      step.innerHTML = methodStepHTML(selectedGateway ? selectedGateway.methods : 4);
      selectedMethodId = 'bank';
      step.querySelectorAll('[data-dp-method]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectedMethodId = btn.getAttribute('data-dp-method');
          step.querySelectorAll('[data-dp-method]').forEach(function (b) {
            var active = b === btn;
            b.classList.toggle('bg-accent', active);
            b.classList.toggle('text-text-on-accent', active);
            b.classList.toggle('bg-bg-card', !active);
            b.classList.toggle('text-text-mid', !active);
            b.classList.toggle('border', !active);
            b.classList.toggle('border-line', !active);
          });
        });
      });
      bindBackButtons(step);
      var amountInput = step.querySelector('#dp-amount');
      step.querySelector('[data-dp-next]').addEventListener('click', function () {
        var amountVal = (amountInput && amountInput.value) ? amountInput.value : '10,000';
        if (selectedMethodId === 'bank') goTransferStep(amountVal);
        else goQrStep(selectedMethodId, amountVal);
      });
      showOnly(step);
    }

    function goTransferStep(amountVal) {
      var step = flow.querySelector('[data-dp-step="transfer"]');
      if (!step) { step = document.createElement('div'); step.setAttribute('data-dp-step', 'transfer'); flow.appendChild(step); }
      step.innerHTML = transferStepHTML(amountVal);
      step.querySelector('[data-dp-complete]').addEventListener('click', function () { goDoneStep(); });
      showOnly(step);
    }

    function goQrStep(methodId, amountVal) {
      var step = flow.querySelector('[data-dp-step="qr"]');
      if (!step) { step = document.createElement('div'); step.setAttribute('data-dp-step', 'qr'); flow.appendChild(step); }
      step.innerHTML = qrStepHTML(methodId);
      bindBackButtons(step);
      var copyBtn = step.querySelector('[data-dp-copy]');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          var addr = copyBtn.getAttribute('data-dp-copy');
          try {
            var p = navigator.clipboard.writeText(addr);
            if (p && p.catch) p.catch(function () { /* clipboard 權限被拒，demo 流程靜默略過 */ });
          } catch (e) { /* clipboard 不可用，demo 流程靜默略過 */ }
        });
      }
      step.querySelector('[data-dp-qr-next]').addEventListener('click', function () {
        if (methodId === 'linepay') goTransferStep(amountVal);
        else goDoneStep();
      });
      showOnly(step);
    }

    function goDoneStep() {
      var step = flow.querySelector('[data-dp-step="done"]');
      if (!step) { step = document.createElement('div'); step.setAttribute('data-dp-step', 'done'); flow.appendChild(step); }
      step.innerHTML = doneStepHTML('deposit.successMsg', 'deposit-record.html', 'deposit.viewRecord');
      showOnly(step);
    }

    channelStep.querySelectorAll('[data-dp-gateway]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedGateway = { id: btn.getAttribute('data-dp-gateway'), methods: parseInt(btn.getAttribute('data-dp-methods'), 10) || 4 };
        goMethodStep();
      });
    });
  }

  /* ============================== Withdrawal ============================== */
  function initWithdrawalFlow() {
    var flow = document.getElementById('wd-flow');
    if (!flow) return;
    var formStep = flow.querySelector('[data-wd-step="form"]');
    var submitBtn = document.getElementById('wd-submit');
    var errorEl = document.getElementById('wd-error');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function () {
      var account = flow.querySelector('input[name="wd-account"]:checked');
      var amount = document.getElementById('wd-amount');
      var password = document.getElementById('wd-password');
      if (!account || !amount.value.trim() || !password.value.trim()) {
        if (errorEl) errorEl.classList.remove('hidden');
        return;
      }
      if (errorEl) errorEl.classList.add('hidden');
      var step = flow.querySelector('[data-wd-step="done"]');
      if (!step) { step = document.createElement('div'); step.setAttribute('data-wd-step', 'done'); flow.appendChild(step); }
      step.innerHTML = doneStepHTML('withdrawal.successMsg', 'withdrawal-record.html', 'withdrawal.viewRecord');
      formStep.classList.add('hidden');
      step.classList.remove('hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDepositFlow();
    initWithdrawalFlow();
  });
})();
