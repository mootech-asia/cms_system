/*
 * 音效：config.sounds 有填音檔路徑就播音檔，留空時用 Web Audio 即時合成。
 * 名稱：click（按鈕）、move（切換選項）、tear（撕封條／開蓋）、flip（翻卡）、
 * reveal（揭曉，依稀有度 0～3 升調）、reward（全部揭曉）。音效開關存在 localStorage。
 * iOS 靜音鍵會把 Web Audio 一起靜音：第一次使用者操作時播一段無聲 <audio> 解除。
 */
window.EventSound = (function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var KEY = cfg.storageKey + '_sound';
  var levels = cfg.soundLevels || {};
  var enabled = true;
  try { enabled = localStorage.getItem(KEY) !== 'off'; } catch (e) { /* 預設開啟 */ }
  var ctx = null;
  var buffers = {};
  var unlocked = false;

  function audio() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    try {
      var el = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
      el.setAttribute('playsinline', '');
      el.play().catch(function () {});
    } catch (e) { /* 不支援時略過 */ }
    audio();
    Object.keys(cfg.sounds).forEach(loadFile);
  }
  ['pointerdown', 'keydown'].forEach(function (type) {
    document.addEventListener(type, unlock, { once: true, capture: true });
  });

  function loadFile(name) {
    var src = cfg.sounds[name];
    if (!src || buffers[name] || !window.fetch) return;
    var c = audio();
    if (!c) return;
    buffers[name] = 'loading';
    fetch(src).then(function (r) { return r.arrayBuffer(); })
      .then(function (data) { return new Promise(function (ok, fail) { c.decodeAudioData(data, ok, fail); }); })
      .then(function (buf) { buffers[name] = buf; }, function () { delete buffers[name]; });
  }

  function playFile(name, rate) {
    var buf = buffers[name];
    if (!buf || buf === 'loading') return false;
    var c = audio();
    var src = c.createBufferSource();
    var gain = c.createGain();
    src.buffer = buf;
    src.playbackRate.value = rate || 1;
    gain.gain.value = levels[name] != null ? levels[name] : 1;
    src.connect(gain).connect(c.destination);
    src.start();
    return true;
  }

  function tone(freq, start, dur, type, vol, slideTo) {
    var c = audio();
    if (!c) return;
    var t0 = c.currentTime + start;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise(start, dur, vol, from, to) {
    var c = audio();
    if (!c) return;
    var t0 = c.currentTime + start;
    var len = Math.ceil(c.sampleRate * dur);
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource();
    var filter = c.createBiquadFilter();
    var gain = c.createGain();
    src.buffer = buf;
    filter.type = 'bandpass';
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(from, t0);
    filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(t0);
  }

  var SYNTH = {
    click: function () { tone(880, 0, 0.08, 'triangle', 0.25, 520); },
    move: function () { tone(640, 0, 0.06, 'sine', 0.16, 760); },
    tear: function () { noise(0, 0.45, 0.55, 900, 4200); noise(0.08, 0.3, 0.3, 2400, 6000); },
    flip: function () { noise(0, 0.16, 0.35, 1600, 5200); },
    reveal: function (rank) {
      var base = [523.25, 587.33, 659.25, 783.99][rank] || 523.25;
      [1, 1.25, 1.5, 2].slice(0, 2 + rank).forEach(function (m, i) { tone(base * m, i * 0.07, 0.5, 'triangle', 0.22); });
      if (rank >= 2) tone(base * 3, 0.3, 0.9, 'sine', 0.12);
    },
    reward: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.09, 0.6, 'triangle', 0.24); }); }
  };

  function play(name, arg) {
    if (!enabled) return;
    if (cfg.sounds[name]) {
      loadFile(name);
      if (playFile(name, name === 'reveal' ? 1 + (arg || 0) * 0.06 : 1)) return;
    }
    if (SYNTH[name]) SYNTH[name](arg);
  }

  return {
    play: play,
    isEnabled: function () { return enabled; },
    setEnabled: function (on) {
      enabled = on;
      try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* 只在本次頁面生效 */ }
    }
  };
})();
