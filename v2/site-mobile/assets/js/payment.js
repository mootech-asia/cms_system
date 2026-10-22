/* deposit.html 的儲值流程（流程說明見下方 initDepositFlow）。QR 圖案沿用桌機版
   同一套假圖案演算法（seed 雜湊決定黑白格），不是真的可掃 QR，純示意。 */
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

  /* ============================== Deposit ============================== */
  /* 比照桌機版 initDepositFlow()：通道決定可用付款方式數量（D.DEPOSIT_GATEWAYS
     的 methodCount），快速金額按鈕帶入金額欄，選了優惠才能按下一步；銀行卡
     直接到轉帳明細，LinePay/USDT 先到掃碼步驟（LinePay 掃完再到轉帳明細，
     USDT 直接送出）。送出結果用成功彈窗，與桌機版 showMemberModal 相同。 */
  function tx(en) { return window.__v2mTx ? window.__v2mTx(en) : en; }
  function modal(opts) { if (window.__v2mModal) window.__v2mModal(opts); }
  var TAB_ON = ['bg-primary', 'text-on-primary'];
  var TAB_OFF = ['bg-surface', 'text-text-2', 'border', 'border-border-soft'];
  var METHOD_ON = ['border-transparent', 'bg-[image:var(--g-primary)]', 'text-on-primary'];
  var METHOD_OFF = ['border-border-soft', 'bg-surface', 'text-text'];
  var CHIP_ON = ['border-primary/40', 'bg-primary/16', 'text-primary'];
  var CHIP_OFF = ['border-border-soft', 'bg-bg', 'text-text'];
  function setOn(el, on, onCls, offCls) {
    onCls.forEach(function (c) { el.classList.toggle(c, on); });
    offCls.forEach(function (c) { el.classList.toggle(c, !on); });
  }

  function initDepositFlow() {
    var flow = document.getElementById('dp-flow');
    if (!flow) return;
    var form = flow.querySelector('[data-dp-step="form"]');
    var gatewayBtns = Array.prototype.slice.call(flow.querySelectorAll('[data-dp-gateway]'));
    var methodBtns = Array.prototype.slice.call(flow.querySelectorAll('[data-dp-method]'));
    var chips = Array.prototype.slice.call(flow.querySelectorAll('[data-dp-quick]'));
    var promos = Array.prototype.slice.call(flow.querySelectorAll('[data-dp-promo]'));
    var amountInput = flow.querySelector('[data-dp-amount]');
    var nextBtn = flow.querySelector('[data-dp-next]');
    var methodId = 'bank';

    function selectMethod(btn) {
      methodId = btn.getAttribute('data-dp-method');
      methodBtns.forEach(function (b) { setOn(b, b === btn, METHOD_ON, METHOD_OFF); });
    }
    gatewayBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        gatewayBtns.forEach(function (b) { setOn(b, b === btn, TAB_ON, TAB_OFF); });
        var count = parseInt(btn.getAttribute('data-dp-methods'), 10) || methodBtns.length;
        methodBtns.forEach(function (m, i) { m.classList.toggle('hidden', i >= count); });
        var active = methodBtns.filter(function (m) { return m.getAttribute('data-dp-method') === methodId; })[0];
        if (!active || active.classList.contains('hidden')) selectMethod(methodBtns[0]);
      });
    });
    methodBtns.forEach(function (btn) { btn.addEventListener('click', function () { selectMethod(btn); }); });
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { setOn(c, c === chip, CHIP_ON, CHIP_OFF); });
        amountInput.value = '₩ ' + chip.getAttribute('data-dp-quick');
      });
    });
    promos.forEach(function (card) {
      card.addEventListener('click', function () {
        promos.forEach(function (c) {
          var on = c === card;
          c.setAttribute('aria-pressed', String(on));
          c.classList.toggle('border-primary', on);
          c.classList.toggle('border-border-soft', !on);
          var radio = c.querySelector('[data-dp-radio]');
          radio.classList.toggle('border-primary', on);
          radio.classList.toggle('border-border', !on);
          radio.innerHTML = on ? '<span class="h-2.5 w-2.5 rounded-full bg-primary"></span>' : '';
        });
        nextBtn.disabled = false;
        setOn(nextBtn, true, ['bg-[image:var(--g-primary)]', 'text-on-primary'], ['bg-surface-2', 'text-text-3']);
      });
    });

    function stepEl(name) {
      var el = flow.querySelector('[data-dp-step="' + name + '"]');
      if (!el) { el = document.createElement('div'); el.setAttribute('data-dp-step', name); flow.appendChild(el); }
      return el;
    }
    function show(el) {
      Array.prototype.forEach.call(flow.children, function (c) { c.classList.toggle('hidden', c !== el); });
      window.scrollTo(0, 0);
    }
    function amountText() { return amountInput.value || '₩ 10,000'; }

    function goTransfer() {
      var el = stepEl('transfer');
      el.innerHTML =
        '<div class="rounded-2xl border border-border-soft bg-surface p-4">' +
        '<p class="mb-4 inline-block rounded-full bg-primary/16 px-3 py-1 text-[12px] font-bold text-primary">' + esc(tx('Transfer Details')) + '</p>' +
        '<div class="flex items-center justify-between border-b border-border-soft py-2.5 text-[13px]"><span class="text-text-3">' + esc(tx('Deposit Amount')) + '</span><span class="font-bold text-primary">' + esc(amountText()) + '</span></div>' +
        '<div class="flex items-center justify-between border-b border-border-soft py-2.5 text-[13px]"><span class="text-text-3">' + esc(tx('Deposit Account')) + '</span><span class="font-bold text-text">wururu1234</span></div>' +
        '<p class="mt-3 text-[12px] leading-relaxed text-text-2">' + esc(tx('Once the transfer is complete, please click the "Complete" button below. Should you have any questions, please feel free to contact our Customer Service team.')) + '</p>' +
        '<p class="mt-2 text-[12.5px]"><a href="#" class="font-bold text-primary underline" data-cs-open>' + esc(tx('Customer Service')) + '</a></p>' +
        '</div>' +
        '<button type="button" class="mt-4 h-12 w-full rounded-xl bg-[image:var(--g-primary)] text-[14px] font-bold text-on-primary" data-dp-complete>' + esc(tx('Complete')) + '</button>';
      el.querySelector('[data-dp-complete]').addEventListener('click', function () {
        modal({ type: 'success', message: tx('Your deposit application has been submitted.') });
      });
      show(el);
    }

    function goQr(id) {
      var qrData = D.DEPOSIT_QR || {};
      var loc = qrData[currentLocale()] || qrData.en || {};
      var addr = (qrData.addresses || {})[id] || (qrData.addresses || {}).linepay || '';
      var isAddress = id === 'trc20' || id === 'erc20';
      var el = stepEl('qr');
      el.innerHTML =
        '<div class="rounded-2xl border border-border-soft bg-surface p-4">' +
        '<p class="mb-3 inline-block rounded-full bg-primary/16 px-3 py-1 text-[12px] font-bold text-primary">' + esc(loc.pill || 'Scan to Pay') + '</p>' +
        '<p class="mb-4 text-[12px] text-text-2">' + esc(loc.hint || '') + '</p>' +
        '<div class="mx-auto mb-4 h-44 w-44 rounded-xl bg-white p-2">' + qrSvgHtml(id + '|' + addr, loc.altText || 'QR') + '</div>' +
        '<label class="mb-1.5 block text-[11.5px] text-text-3">' + esc(isAddress ? (loc.addressLabel || 'Payment Address') : (loc.linkLabel || 'Payment Link')) + '</label>' +
        '<div class="flex items-center gap-2">' +
        '<input class="h-11 min-w-0 flex-1 truncate rounded-xl border border-border-soft bg-bg px-3 text-[12.5px] text-text" value="' + esc(addr) + '" readonly>' +
        '<button type="button" class="h-11 flex-none rounded-xl border border-border px-3.5 text-[12.5px] font-semibold text-text" data-dp-copy>' + esc(loc.copy || 'Copy') + '</button>' +
        '</div>' +
        '<p class="mt-3 text-[11px] text-text-3">' + esc(loc.note || '') + '</p>' +
        '</div>' +
        '<div class="mt-4 flex items-center gap-2.5">' +
        '<button type="button" class="h-12 flex-1 rounded-xl border border-border text-[14px] font-bold text-text" data-dp-back>' + esc(loc.back || 'Back') + '</button>' +
        '<button type="button" class="h-12 flex-1 rounded-xl bg-[image:var(--g-primary)] text-[14px] font-bold text-on-primary" data-dp-qr-next>' + esc(loc.confirm || 'Next') + '</button>' +
        '</div>';
      var copyBtn = el.querySelector('[data-dp-copy]');
      copyBtn.addEventListener('click', function () {
        try {
          var pr = navigator.clipboard.writeText(addr);
          if (pr && pr.catch) pr.catch(function () { /* clipboard 權限被拒，示範流程靜默略過 */ });
        } catch (e) { /* clipboard 不可用，示範流程靜默略過 */ }
        copyBtn.textContent = loc.copied || 'Copied';
        setTimeout(function () { copyBtn.textContent = loc.copy || 'Copy'; }, 1500);
      });
      el.querySelector('[data-dp-back]').addEventListener('click', function () { show(form); });
      el.querySelector('[data-dp-qr-next]').addEventListener('click', function () {
        if (id === 'linepay') { goTransfer(); return; }
        show(form);
        modal({ type: 'success', message: tx('Your deposit application has been submitted.') });
      });
      show(el);
    }

    nextBtn.addEventListener('click', function () {
      if (nextBtn.disabled) return;
      if (methodId === 'bank') goTransfer();
      else goQr(methodId);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDepositFlow();
  });
})();
