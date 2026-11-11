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

  // iOS 的靜音鍵會把 Web Audio 一起靜音；在第一次使用者操作時播一段無聲 <audio>，
  // 把音訊工作階段切成「播放」類別，之後合成音在靜音模式下也能出聲。
  var unlocked = false;
  var SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  function unlockIOS() {
    if (unlocked) return;
    unlocked = true;
    try {
      var a = new Audio(SILENT_WAV);
      a.setAttribute('playsinline', '');
      a.play().catch(function () { /* 不支援時略過 */ });
    } catch (e) { /* 同上 */ }
  }

  function ensure() {
    unlockIOS();
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
      noise(t, 0.9, 0.35, 'highpass', 5000);
      noise(t, 0.3, 0.25, 'bandpass', 3000);
    }
  }

  // 開獎彈窗出現時的獎賞音：中獎＝上行鈴聲琶音＋閃亮高音；未中獎＝兩個柔和下行音
  function bell(t, freq, dur, gain, type) {
    var o = track(ctx.createOscillator());
    var g = ctx.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function brass(t, freq, dur, gain) {
    var o = track(ctx.createOscillator());
    var f = ctx.createBiquadFilter();
    var g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq, t);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(2600, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.04);
    g.gain.setValueAtTime(gain, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function reward(isLose) {
    if (!enabled) return;
    var file = isLose ? cfg.sounds.rewardLose : cfg.sounds.reward;
    if (file) { playFile(file); return; }
    if (!ensure()) return;
    var t = ctx.currentTime + 0.02;
    if (isLose) {
      bell(t, 523.25, 0.6, 0.55, 'sine');
      bell(t + 0.24, 392, 0.8, 0.5, 'sine');
      return;
    }
    // 上行鈴聲琶音 → 小號和弦收尾 → 閃亮高音
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
      bell(t + i * 0.09, f, 0.9, 0.6);
      bell(t + i * 0.09, f * 2, 0.5, 0.15, 'sine');
    });
    [523.25, 659.25, 783.99].forEach(function (f) { brass(t + 0.38, f, 0.9, 0.16); });
    bell(t + 0.4, 1318.5, 1.2, 0.4);
    bell(t + 0.4, 1567.98, 1.2, 0.3);
    for (var k = 0; k < 6; k++) noise(t + 0.45 + k * 0.07, 0.12, 0.08, 'highpass', 7000);
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
    reward: reward,
    setEnabled: setEnabled,
    isEnabled: function () { return enabled; }
  };
})();
