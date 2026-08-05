// CMS_前台_v4 — 純靜態站 vanilla JS 行為層（無框架、無 build）。
(function () {
  'use strict';

  function safe(fn) { try { fn(); } catch (e) { /* 避免單一功能失敗拖垮整頁 */ } }

  function initHero() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var len = slides.length;
    if (!len) return;
    var idx = 0;
    var timer = null;

    function apply() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    function resetAuto() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { idx = (idx + 1) % len; apply(); }, 6000);
    }
    function goTo(i) { idx = i; apply(); resetAuto(); }

    var prevBtn = hero.querySelector('.hero-arrow.prev');
    var nextBtn = hero.querySelector('.hero-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo((idx - 1 + len) % len); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo((idx + 1) % len); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    resetAuto();
  }

  function initFeatureCarousel() {
    var carousel = document.getElementById('featureCarousel');
    if (!carousel) return;
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.feature-card'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.feature-dot'));
    var len = slides.length;
    if (!len) return;
    var idx = 0;
    var timer = null;

    function apply() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    function resetAuto() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { idx = (idx + 1) % len; apply(); }, 5000);
    }
    function goTo(i) { idx = i; apply(); resetAuto(); }

    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    resetAuto();
  }

  function initVendorSelect() {
    var rails = Array.prototype.slice.call(document.querySelectorAll('.vendor-rail'));
    rails.forEach(function (rail) {
      var chips = Array.prototype.slice.call(rail.querySelectorAll('.feature-vendor-chip'));
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
        });
      });
    });
  }

  function initRails() {
    var rails = Array.prototype.slice.call(document.querySelectorAll('.tile-grid.rail'));
    rails.forEach(function (rail) {
      var panel = rail.closest('.panel');
      var prevBtn = panel ? panel.querySelector('.rail-arrow-prev') : null;
      var nextBtn = panel ? panel.querySelector('.rail-arrow-next') : null;

      function updateArrows() {
        var maxScroll = rail.scrollWidth - rail.clientWidth;
        if (prevBtn) prevBtn.disabled = rail.scrollLeft <= 4;
        if (nextBtn) nextBtn.disabled = maxScroll <= 4 || rail.scrollLeft >= maxScroll - 4;
      }
      if (prevBtn) prevBtn.addEventListener('click', function () { rail.scrollBy({ left: -rail.clientWidth * 0.9, behavior: 'smooth' }); });
      if (nextBtn) nextBtn.addEventListener('click', function () { rail.scrollBy({ left: rail.clientWidth * 0.9, behavior: 'smooth' }); });
      rail.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      updateArrows();

      // 滑鼠可直接按住拖曳橫向捲動（觸控裝置原生滑動已可用，這裡補上桌機滑鼠操作）。
      var dragging = false;
      var startX = 0;
      var startScroll = 0;
      rail.addEventListener('mousedown', function (e) {
        dragging = true;
        rail.classList.add('dragging');
        startX = e.pageX;
        startScroll = rail.scrollLeft;
      });
      window.addEventListener('mouseup', function () {
        if (!dragging) return;
        dragging = false;
        rail.classList.remove('dragging');
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        e.preventDefault();
        rail.scrollLeft = startScroll - (e.pageX - startX);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    safe(initHero);
    safe(initFeatureCarousel);
    safe(initVendorSelect);
    safe(initRails);
  });
})();
