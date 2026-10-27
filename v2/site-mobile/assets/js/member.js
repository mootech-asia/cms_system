/* 會員頁行為，比照 v2/site 桌機版 site.js：
   - personal-info：Submit → 成功彈窗（initPersonalInfoPage）
   - change-password：兩欄都填才能 Submit；長度 5-16（?type=txn 時限可見 ASCII
     5-16）、兩次不一致跳警告，成功後清空（initChangePasswordPage）；密碼眼睛切換
   - security：Logout 列登出並回首頁（initSecurityPage） */
(function () {
  'use strict';

  function tx(en) { return window.__v2mTx ? window.__v2mTx(en) : en; }
  function modal(opts) { if (window.__v2mModal) window.__v2mModal(opts); }

  function initPersonalInfo() {
    var btn = document.querySelector('[data-pi-submit]');
    if (btn) btn.addEventListener('click', function () { modal({ type: 'success', message: tx('Profile updated successfully.') }); });
  }

  function initChangePassword() {
    var newPw = document.querySelector('[data-pw-new]');
    var confirmPw = document.querySelector('[data-pw-confirm]');
    var btn = document.querySelector('[data-pw-submit]');
    if (!newPw || !confirmPw || !btn) return;
    var isTxn = /type=txn/.test(location.search);
    var VISIBLE_ASCII = /^[\x21-\x7E]{5,16}$/;
    function gate() {
      var ok = newPw.value.trim() !== '' && confirmPw.value.trim() !== '';
      btn.disabled = !ok;
      ['bg-[image:var(--g-primary)]', 'text-on-primary'].forEach(function (c) { btn.classList.toggle(c, ok); });
      ['bg-surface-2', 'text-text-3'].forEach(function (c) { btn.classList.toggle(c, !ok); });
    }
    [newPw, confirmPw].forEach(function (i) { i.addEventListener('input', gate); });
    gate();
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      var a = newPw.value;
      if (isTxn && !VISIBLE_ASCII.test(a)) { modal({ type: 'warning', message: tx('Use 5-16 visible ASCII characters (letters, numbers, symbols).') }); return; }
      if (!isTxn && (a.length < 5 || a.length > 16)) { modal({ type: 'warning', message: tx('Length must be 5-16 characters.') }); return; }
      if (a !== confirmPw.value) { modal({ type: 'warning', message: tx('The two passwords do not match.') }); return; }
      modal({ type: 'success', onConfirm: function () { newPw.value = ''; confirmPw.value = ''; gate(); } });
    });
    document.querySelectorAll('[data-pw-eye]').forEach(function (eye) {
      eye.addEventListener('click', function () {
        var input = eye.parentElement.querySelector('input');
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    });
  }

  function initSecurity() {
    var row = document.querySelector('[data-security-logout]');
    if (!row) return;
    row.addEventListener('click', function () {
      try { localStorage.removeItem('win100-logged-in'); } catch (e) { /* storage unavailable */ }
      location.href = 'index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPersonalInfo();
    initChangePassword();
    initSecurity();
  });
})();
