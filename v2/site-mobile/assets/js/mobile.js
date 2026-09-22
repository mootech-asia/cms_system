/* v2 獨立手機版共用行為層。刻意不去動 ../site/assets/js/site.js——
   登入狀態(win100-logged-in)、收藏(win100-static-favorites)、語言
   (win100-locale)三把 key 跟桌機版共用同一份 localStorage，同源自動
   同步；只有「外觀 skin」刻意獨立（見下方 SKINS），不讀也不寫桌機版
   的 win100-static-skin，避免兩邊互相蓋掉對方的選擇。 */
(function () {
  'use strict';

  /* ============================== 外觀 skin（獨立於桌機版）=========== */
  var SKIN_KEY = 'win100-mobile-skin';
  var SKINS = [
    { id: 'lucky-star', label: 'Lucky Star', swatch: '#34d179' },
    { id: 'violet-rush', label: 'Violet Rush', swatch: '#a855f7' },
    { id: 'amber-royale', label: 'Amber Royale', swatch: '#f2b134' },
  ];
  var currentSkinId = 'lucky-star';

  function findSkin(id) {
    for (var i = 0; i < SKINS.length; i++) if (SKINS[i].id === id) return SKINS[i];
    return null;
  }

  function applySkin(id, persist) {
    var skin = findSkin(id) || SKINS[0];
    document.documentElement.setAttribute('data-skin', skin.id);
    currentSkinId = skin.id;
    if (persist !== false) {
      try { localStorage.setItem(SKIN_KEY, skin.id); } catch (e) { /* storage unavailable */ }
    }
  }

  function restoreSkin() {
    var saved = null;
    try { saved = localStorage.getItem(SKIN_KEY); } catch (e) { /* ignore */ }
    applySkin(saved && findSkin(saved) ? saved : SKINS[0].id, false);
  }

  /* HTML 樣板直接寫 Tailwind utility class（真正 Tailwind 寫法，不疊
     另一份手寫 CSS 去對應 .m-skin-option 這種語意 class）；m-skin-wrap/
     m-skin-trigger/m-skin-menu/data-skin-option 純粹是 JS 事件委派用
     的 hook，本身不帶樣式。 */
  function renderSkinMenu(menu) {
    menu.className = 'm-skin-menu absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-2xl border border-line-hi bg-bg-card p-1.5 shadow-card';
    menu.innerHTML = SKINS.map(function (s) {
      var active = s.id === currentSkinId;
      return '<button type="button" class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold' +
        (active ? ' bg-accent-soft text-accent' : ' text-text-mid') +
        '" data-skin-option="' + s.id + '" role="option" aria-selected="' + active + '">' +
        '<span class="h-5 w-5 flex-none rounded-full border border-line-hi" style="background:' + s.swatch + '" aria-hidden="true"></span>' +
        '<span>' + s.label + '</span></button>';
    }).join('');
  }

  function closeSkinMenu() {
    var m = document.querySelector('.m-skin-menu');
    if (m) m.remove();
    var t = document.querySelector('.m-skin-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
  }

  function toggleSkinMenu(trigger) {
    var wrap = trigger.closest('.m-skin-wrap');
    if (!wrap) return;
    if (wrap.querySelector('.m-skin-menu')) { closeSkinMenu(); return; }
    var menu = document.createElement('div');
    menu.className = 'm-skin-menu';
    wrap.appendChild(menu);
    renderSkinMenu(menu);
    trigger.setAttribute('aria-expanded', 'true');
  }

  function initSkinSwitcher() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.m-skin-trigger');
      if (trigger) { toggleSkinMenu(trigger); return; }
      var option = e.target.closest('[data-skin-option]');
      if (option) { applySkin(option.getAttribute('data-skin-option')); closeSkinMenu(); return; }
      if (!e.target.closest('.m-skin-wrap')) closeSkinMenu();
    });
  }

  /* ============================== 底部導覽 / Menu 抽屜 ================ */
  function initBottomNav() {
    var bar = document.querySelector('.m-tabbar');
    if (!bar) return;
    var menuBtn = bar.querySelector('[data-tabbar-menu]');
    if (menuBtn) on(menuBtn, 'click', function () { toggleMenuDrawer(true); });
  }

  /* about.html 分頁鈕：目前只有單一內容區塊(3 個分頁共用同一段介紹文字，
     沒有各自獨立的公告/FAQ 內容——桌機版 about.html 有 8 個分頁的完整
     內容，手機版這裡先做視覺上可切換的精簡版)，點擊只切換 active 樣式。 */
  function initAboutTabs() {
    var tabs = document.querySelectorAll('[data-about-tab]');
    if (!tabs.length) return;
    tabs.forEach(function (btn) {
      on(btn, 'click', function () {
        tabs.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('bg-accent', active);
          b.classList.toggle('text-text-on-accent', active);
          b.classList.toggle('text-text-mid', !active);
        });
      });
    });
  }

  var menuDrawerRoot = null;
  function closeMenuDrawer() {
    if (!menuDrawerRoot) return;
    menuDrawerRoot.remove();
    menuDrawerRoot = null;
    document.documentElement.classList.remove('overflow-hidden');
  }
  function openMenuDrawer() {
    var tpl = document.getElementById('m-menu-drawer-tpl');
    if (!tpl) return;
    closeMenuDrawer();
    var wrap = document.createElement('div');
    wrap.innerHTML = tpl.innerHTML;
    menuDrawerRoot = wrap.firstElementChild;
    document.body.appendChild(menuDrawerRoot);
    document.documentElement.classList.add('overflow-hidden');
    on(menuDrawerRoot, 'click', function (e) {
      if (e.target === menuDrawerRoot || e.target.closest('[data-drawer-close]')) closeMenuDrawer();
    });
  }
  function toggleMenuDrawer(open) { if (open) openMenuDrawer(); else closeMenuDrawer(); }

  function on(el, evt, fn) { if (el) el.addEventListener(evt, fn); }

  document.addEventListener('DOMContentLoaded', function () {
    restoreSkin();
    initSkinSwitcher();
    initBottomNav();
    initAboutTabs();
  });

  window.__v2mOpenMenuDrawer = openMenuDrawer;
  window.__v2mCloseMenuDrawer = closeMenuDrawer;
})();
