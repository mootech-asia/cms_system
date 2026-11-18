/*
 * 音效：config.sounds 有填音檔路徑就播音檔，留空時用 Web Audio 即時合成（背景音樂沒有合成版，未交付就不播）。
 * 特效音名稱：click（按鈕）、move（環形轉一格）、select（點選一包／一箱）、tear（撕封條／開箱）、flip（翻卡）、
 * reveal-common／reveal-rare／reveal-epic／reveal-legendary（揭曉，依稀有度；沒有分檔時用 reveal 並依稀有度升調）、
 * reward（多張總覽）、collect（收下獎勵）、error（次數不足、尚無獎項）。
 * 背景音樂 bgm：循環播放，開封與揭曉期間壓低到 soundLevels.bgmDuck，音效關閉或分頁隱藏時暫停。
 * 音效開關存在 localStorage。iOS 靜音鍵會把 Web Audio 一起靜音：第一次使用者操作時播一段無聲 <audio> 解除。
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
    Object.keys(cfg.sounds).forEach(function (k) { if (k !== 'bgm') loadFile(k); });
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
    reward: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.09, 0.6, 'triangle', 0.24); }); },
    select: function () { tone(988, 0, 0.12, 'triangle', 0.22); tone(1318.5, 0.06, 0.2, 'sine', 0.14); },
    collect: function () { [783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.08, 0.4, 'triangle', 0.2); }); },
    error: function () { tone(220, 0, 0.18, 'sine', 0.2, 180); }
  };
  var RARITY = ['common', 'rare', 'epic', 'legendary'];

  function play(name, arg) {
    if (!enabled) return;
    if (name === 'reveal' && cfg.sounds['reveal-' + RARITY[arg || 0]]) {
      var own = 'reveal-' + RARITY[arg || 0];
      loadFile(own);
      if (playFile(own, 1)) return;
    }
    if (cfg.sounds[name]) {
      loadFile(name);
      if (playFile(name, name === 'reveal' ? 1 + (arg || 0) * 0.06 : 1)) return;
    }
    if (SYNTH[name]) SYNTH[name](arg);
  }

  // 背景音樂：用 <audio> 循環（長檔不必整段解碼），音量由 soundLevels.bgm／bgmDuck 控制
  var bgmEl = null;
  var ducked = false;
  function bgmVolume() { return ducked ? (levels.bgmDuck != null ? levels.bgmDuck : 0.1) : (levels.bgm != null ? levels.bgm : 0.35); }
  function bgmPlay() {
    if (!unlocked || !enabled || !cfg.sounds.bgm || document.hidden) return;
    if (!bgmEl) {
      bgmEl = new Audio(cfg.sounds.bgm);
      bgmEl.loop = true;
      bgmEl.preload = 'auto';
      bgmEl.setAttribute('playsinline', '');
    }
    bgmEl.volume = bgmVolume();
    var r = bgmEl.play();
    if (r && r.catch) r.catch(function () { /* 尚未取得使用者操作時瀏覽器會拒絕，下一次操作再試 */ });
  }
  function bgmPause() { if (bgmEl) bgmEl.pause(); }
  ['pointerdown', 'keydown'].forEach(function (type) {
    document.addEventListener(type, function () { if (bgmEl ? bgmEl.paused : true) bgmPlay(); }, { capture: true });
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) bgmPause(); else bgmPlay(); });

  return {
    play: play,
    duck: function (on) { ducked = on; if (bgmEl) bgmEl.volume = bgmVolume(); },
    isEnabled: function () { return enabled; },
    setEnabled: function (on) {
      enabled = on;
      try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* 只在本次頁面生效 */ }
      if (on) bgmPlay(); else bgmPause();
    }
  };
})();
