// CMS_設計後台_v4 — 靜態版行為層（vanilla，無框架、無 build）。
// 左側是「草稿」狀態，只有按下「套用到本站」才寫入 localStorage，
// 讓 ../site/ 的 site.js（applyStudioSections / applyStudioSiteName）讀取套用。
// 同源（同一個網域）localStorage 才會共用，不受 studio/ 與 site/ 資料夾路徑影響。
(function () {
  'use strict';

  var SECTIONS_KEY = 'cms-v4-studio-sections';
  var SITENAME_KEY = 'cms-v4-studio-sitename';

  var SECTIONS = [
    { key: 'hot-games', label: '熱門遊戲' },
    { key: 'mini-games', label: '迷你遊戲' },
    { key: 'live', label: '真人娛樂' },
    { key: 'electronic', label: '電子遊戲' },
    { key: 'fish', label: '捕魚達人' },
  ];

  var PAGES = [
    { path: 'index.html', label: '首頁' },
    { path: 'hot-games.html', label: '熱門遊戲' },
    { path: 'slot.html', label: '老虎機' },
    { path: 'live.html', label: '真人娛樂' },
    { path: 'fish.html', label: '捕魚達人' },
    { path: 'sport.html', label: '體育' },
    { path: 'mini-games.html', label: '迷你遊戲' },
    { path: 'promotion.html', label: '優惠活動' },
    { path: 'account.html', label: '會員 - 帳戶總覽' },
    { path: 'deposit.html', label: '會員 - 儲值' },
    { path: 'withdrawal.html', label: '會員 - 提款' },
    { path: 'betting-record.html', label: '會員 - 投注紀錄' },
    { path: 'deposit-record.html', label: '會員 - 儲值紀錄' },
    { path: 'withdrawal-record.html', label: '會員 - 提款紀錄' },
    { path: 'account-record.html', label: '會員 - 帳戶紀錄' },
    { path: 'profit-loss.html', label: '會員 - 損益報表' },
    { path: 'personal-info.html', label: '會員 - 個人資料' },
    { path: 'security.html', label: '會員 - 安全中心' },
    { path: 'change-password.html', label: '會員 - 修改密碼' },
    { path: 'about.html', label: '關於我們' },
    { path: 'ui-kit.html', label: 'UI Kit' },
  ];

  // ---- 草稿狀態：只存在記憶體/畫面上，按「套用」才寫進 localStorage ----
  var draft = { sections: {}, sitename: '' };

  function loadApplied() {
    var sections = {};
    try { sections = JSON.parse(localStorage.getItem(SECTIONS_KEY)) || {}; } catch (e) {}
    var sitename = '';
    try { sitename = localStorage.getItem(SITENAME_KEY) || ''; } catch (e) {}
    return { sections: sections, sitename: sitename };
  }

  function isApplied() {
    try { return !!localStorage.getItem(SECTIONS_KEY) || !!localStorage.getItem(SITENAME_KEY); } catch (e) { return false; }
  }

  function renderSections() {
    var ul = document.getElementById('st-sections');
    ul.innerHTML = '';
    SECTIONS.forEach(function (s) {
      var on = draft.sections[s.key] !== false;
      var li = document.createElement('li');
      li.className = 'st-section-row';
      li.innerHTML =
        '<span class="st-section-name">' + s.label + '</span>' +
        '<button type="button" role="switch" class="st-switch' + (on ? ' is-on' : '') + '" aria-checked="' + on + '" data-section-switch="' + s.key + '"><span class="st-switch-knob"></span></button>';
      ul.appendChild(li);
    });
    document.getElementById('st-summary-sections').textContent = SECTIONS.filter(function (s) { return draft.sections[s.key] !== false; }).length + ' / ' + SECTIONS.length + ' 個顯示中';
    Array.prototype.slice.call(ul.querySelectorAll('[data-section-switch]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-section-switch');
        var next = draft.sections[key] === false; // 目前是 false（關）→ 打開；否則關掉
        draft.sections[key] = next;
        renderSections();
      });
    });
  }

  function renderPageSelect() {
    var sel = document.getElementById('st-page');
    sel.innerHTML = PAGES.map(function (p) { return '<option value="' + p.path + '">' + p.label + '</option>'; }).join('');
    sel.addEventListener('change', function () {
      var page = PAGES.filter(function (p) { return p.path === sel.value; })[0];
      document.getElementById('st-frame').src = '../site/' + sel.value;
      document.getElementById('st-preview-label').textContent = '即時預覽 — ' + (page ? page.label : sel.value) + '（iframe 真實視口）';
      document.getElementById('st-summary-pages').textContent = page ? page.label : sel.value;
    });
  }

  function initCollapse() {
    Array.prototype.slice.call(document.querySelectorAll('[data-group-toggle]')).forEach(function (head) {
      var body = document.querySelector('[data-group-body="' + head.getAttribute('data-group-toggle') + '"]');
      var chevron = head.querySelector('.collapse-chevron');
      head.addEventListener('click', function () {
        var isOpen = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', String(!isOpen));
        body.hidden = isOpen;
        if (chevron) chevron.classList.toggle('is-open', !isOpen);
      });
    });
  }

  function initPaneSwitch() {
    var shell = document.querySelector('.st-shell');
    Array.prototype.slice.call(document.querySelectorAll('[data-pane-btn]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pane = btn.getAttribute('data-pane-btn');
        shell.setAttribute('data-pane', pane);
        Array.prototype.slice.call(document.querySelectorAll('[data-pane-btn]')).forEach(function (b) { b.classList.toggle('active', b === btn); });
      });
    });
  }

  function initWidthToggle() {
    var stage = document.getElementById('st-preview-stage');
    Array.prototype.slice.call(document.querySelectorAll('[data-width]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        stage.classList.toggle('is-mobile', btn.getAttribute('data-width') === 'mobile');
        Array.prototype.slice.call(document.querySelectorAll('[data-width]')).forEach(function (b) { b.classList.toggle('active', b === btn); });
      });
    });
  }

  function initApplyReset() {
    var applied = document.getElementById('st-applied');
    function refreshAppliedTag() { applied.hidden = !isApplied(); }
    refreshAppliedTag();

    document.getElementById('st-apply').addEventListener('click', function () {
      try {
        localStorage.setItem(SECTIONS_KEY, JSON.stringify(draft.sections));
        if (draft.sitename) localStorage.setItem(SITENAME_KEY, draft.sitename);
        else localStorage.removeItem(SITENAME_KEY);
      } catch (e) {}
      refreshAppliedTag();
      document.getElementById('st-frame').contentWindow && document.getElementById('st-frame').contentWindow.location.reload();
    });

    document.getElementById('st-reset').addEventListener('click', function () {
      try { localStorage.removeItem(SECTIONS_KEY); localStorage.removeItem(SITENAME_KEY); } catch (e) {}
      var loaded = loadApplied();
      draft = { sections: loaded.sections, sitename: loaded.sitename };
      document.getElementById('st-sitename').value = draft.sitename;
      document.getElementById('st-summary-site').textContent = draft.sitename || 'CMS_前台_v4';
      renderSections();
      refreshAppliedTag();
      document.getElementById('st-frame').contentWindow && document.getElementById('st-frame').contentWindow.location.reload();
    });
  }

  function initSiteName() {
    var input = document.getElementById('st-sitename');
    input.value = draft.sitename;
    input.addEventListener('input', function () {
      draft.sitename = input.value;
      document.getElementById('st-summary-site').textContent = draft.sitename || 'CMS_前台_v4';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var loaded = loadApplied();
    draft = { sections: loaded.sections, sitename: loaded.sitename };
    renderSections();
    renderPageSelect();
    initCollapse();
    initPaneSwitch();
    initWidthToggle();
    initApplyReset();
    initSiteName();
  });
})();
