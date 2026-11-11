/*
 * 鼓聲音效。config.sounds 有填音檔就播音檔，沒填就用 Web Audio 合成：
 * 轉動期間小鼓滾奏（音量漸強）、停下時大鼓＋鈸。
 * 瀏覽器規定音訊必須由使用者操作啟動，所以 AudioContext 在第一次按抽獎時才建立。
 */
window.EventSound = (function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var KEY = 'event_20261111_lucky_wheel_sound';
  var ctx = null;
  var noiseBuf = null;
  var enabled = true;
  var playing = [];

  try { enabled = localStorage.getItem(KEY) !== 'off'; } catch (e) { /* 預設開啟 */ }

  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function track(node) { playing.push(node); return node; }

  function noise(t, dur, gain, type, freq) {
    var src = track(ctx.createBufferSource());
    src.buffer = noiseBuf;
    var f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    var g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(ctx.destination);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur);
  }

  function kick(t) {
    var o = track(ctx.createOscillator());
    var g = ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.3);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.5);
  }

  function playFile(src) {
    var a = new Audio(src);
    playing.push(a);
    a.play().catch(function () { /* 被瀏覽器擋下時靜默略過 */ });
  }

  function drumroll(ms) {
    if (!enabled) return;
    if (cfg.sounds.drumroll) { playFile(cfg.sounds.drumroll); return; }
    if (!ensure()) return;
    var t0 = ctx.currentTime + 0.02;
    var end = t0 + ms / 1000;
    for (var t = t0, i = 0; t < end; t += 0.045, i++) {
      var p = (t - t0) / (end - t0);
      noise(t, 0.06, 0.06 + 0.3 * p, 'bandpass', i % 2 ? 2100 : 1800);
      if (i % 11 === 0) kick(t);
    }
  }

  function finale(isLose) {
    if (!enabled) return;
    var file = isLose ? cfg.sounds.lose : cfg.sounds.win;
    if (file) { playFile(file); return; }
    if (!ensure()) return;
    var t = ctx.currentTime + 0.01;
    kick(t);
    if (!isLose) {
      noise(t, 1.8, 0.45, 'highpass', 5000);
      noise(t, 0.4, 0.3, 'bandpass', 3000);
    }
  }

  function stopAll() {
    playing.forEach(function (n) {
      try { if (n.pause) n.pause(); else n.stop(); } catch (e) { /* 已停止的節點 */ }
    });
    playing = [];
  }

  function setEnabled(v) {
    enabled = v;
    if (!v) stopAll();
    try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch (e) { /* 同上 */ }
  }

  return {
    drumroll: drumroll,
    finale: finale,
    setEnabled: setEnabled,
    isEnabled: function () { return enabled; }
  };
})();
