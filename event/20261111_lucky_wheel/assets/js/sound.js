/*
 * 音效與背景音樂。config.sounds 有填音檔就播音檔，沒填就用 Web Audio 合成。
 * 每套皮一組合成音色（profiles），依 config.activeSkin 選用：
 *   broadway：大樂隊搖擺——小鼓滾奏／大鼓＋鈸、鈴聲琶音＋小號；BGM 走路低音＋刷鼓＋鋼琴和弦＋弱音小號旋律。
 *   survival：冷冽電子——加速滴答＋上升音牆／重低音＋金屬撞擊、合成器琶音；BGM 低音持續音＋音樂盒旋律＋時鐘＋心跳鼓。
 * 瀏覽器規定音訊必須由使用者操作啟動：AudioContext 與 BGM 在第一次 pointerdown／keydown 時才建立。
 * 抽獎期間到開獎彈窗關閉前 BGM 會壓低（duck），避免蓋住鼓聲與獎賞聲。
 */
window.EventSound = (function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var KEY = 'event_20261111_lucky_wheel_sound';
  var ctx = null;
  var noiseBuf = null;
  var sfxBus = null;
  var bgmBus = null;
  var enabled = true;
  var playing = [];
  var BGM_LEVEL = 0.22;
  var BGM_DUCK = 0.06;

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
      sfxBus = ctx.createGain();
      sfxBus.connect(ctx.destination);
      bgmBus = ctx.createGain();
      bgmBus.gain.value = BGM_LEVEL;
      bgmBus.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function profile() {
    return profiles[cfg.activeSkin] || profiles.broadway;
  }

  function track(node) { playing.push(node); return node; }

  /* ---------- 共用合成元件（out 省略時進音效匯流排） ---------- */

  function noise(t, dur, gain, type, freq, out, q) {
    var src = track(ctx.createBufferSource());
    src.buffer = noiseBuf;
    var f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    if (q) f.Q.value = q;
    var g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(out || sfxBus);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur);
  }

  function kick(t, out, gain, hi, lo) {
    var o = track(ctx.createOscillator());
    var g = ctx.createGain();
    o.frequency.setValueAtTime(hi || 140, t);
    o.frequency.exponentialRampToValueAtTime(lo || 45, t + 0.3);
    g.gain.setValueAtTime(gain || 0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g).connect(out || sfxBus);
    o.start(t);
    o.stop(t + 0.5);
  }

  // 敲擊型單音：快速起音、指數衰減（鈴、音樂盒、鋼琴感）
  function bell(t, freq, dur, gain, type, out) {
    var o = track(ctx.createOscillator());
    var g = ctx.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out || sfxBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // 持續型單音：鋸齒波過低通（銅管、合成器 pad）
  function brass(t, freq, dur, gain, out, cutoff, type) {
    var o = track(ctx.createOscillator());
    var f = ctx.createBiquadFilter();
    var g = ctx.createGain();
    o.type = type || 'sawtooth';
    o.frequency.setValueAtTime(freq, t);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(cutoff || 2600, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.04);
    g.gain.setValueAtTime(gain, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(out || sfxBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // 低音單音：三角波帶短起音（走路低音、合成低音）
  function bass(t, freq, dur, gain, out, type) {
    var o = track(ctx.createOscillator());
    var g = ctx.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.setValueAtTime(gain, t + dur * 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out || sfxBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function playFile(src, loop) {
    var a = new Audio(src);
    if (loop) a.loop = true;
    playing.push(a);
    a.play().catch(function () { /* 被瀏覽器擋下時靜默略過 */ });
    return a;
  }

  var N = { C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98, A2: 110, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196, A3: 220, Bb3: 233.08, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5,
    E6: 1318.5, G6: 1567.98, A1: 55, E1: 41.2, G1: 49, F1: 43.65 };

  /* ---------- 皮：broadway（大樂隊搖擺） ---------- */

  var broadway = {
    drumroll: function (ms) {
      var t0 = ctx.currentTime + 0.02;
      var end = t0 + ms / 1000;
      for (var t = t0, i = 0; t < end; t += 0.045, i++) {
        var p = (t - t0) / (end - t0);
        noise(t, 0.06, 0.06 + 0.3 * p, 'bandpass', i % 2 ? 2100 : 1800);
        if (i % 11 === 0) kick(t);
      }
    },
    finale: function (isLose) {
      var t = ctx.currentTime + 0.01;
      kick(t);
      if (!isLose) {
        noise(t, 0.9, 0.35, 'highpass', 5000);
        noise(t, 0.3, 0.25, 'bandpass', 3000);
      }
    },
    // 中獎＝上行鈴聲琶音 → 小號和弦收尾 → 閃亮高音；未中獎＝兩個柔和下行音
    reward: function (isLose) {
      var t = ctx.currentTime + 0.02;
      if (isLose) {
        bell(t, N.C5, 0.6, 0.55, 'sine');
        bell(t + 0.24, N.G4, 0.8, 0.5, 'sine');
        return;
      }
      [N.C5, N.E5, N.G5, N.C6].forEach(function (f, i) {
        bell(t + i * 0.09, f, 0.9, 0.6);
        bell(t + i * 0.09, f * 2, 0.5, 0.15, 'sine');
      });
      [N.C5, N.E5, N.G5].forEach(function (f) { brass(t + 0.38, f, 0.9, 0.16); });
      bell(t + 0.4, N.E6, 1.2, 0.4);
      bell(t + 0.4, N.G6, 1.2, 0.3);
      for (var k = 0; k < 6; k++) noise(t + 0.45 + k * 0.07, 0.12, 0.08, 'highpass', 7000);
    },
    bgm: {
      bpm: 132,
      swing: 0.62,      // 八分音符搖擺比例（第一個八分佔一拍的 62%）
      stepsPerBar: 8,   // 以八分音符為步
      bars: 8,
      // 走路低音：每小節四個四分音符（C6 → A7 → Dm7 → G7 循環）
      bassLine: [
        [N.C2, N.E2, N.G2, N.A2], [N.A2, N.G2, N.E2, N.C3],
        [N.D2, N.F2, N.A2, N.C3], [N.G2, N.B2, N.D3, N.F3],
        [N.C2, N.E2, N.G2, N.A2], [N.A2, N.G2, N.E2, N.C3],
        [N.D2, N.F2, N.G2, N.B2], [N.C2, N.G2, N.C2, N.G2]
      ],
      chords: [
        [N.E4, N.G4, N.A4, N.C5], [N.A3, N.C4, N.E4, N.G4],
        [N.D4, N.F4, N.A4, N.C5], [N.G3, N.B3, N.D4, N.F4],
        [N.E4, N.G4, N.A4, N.C5], [N.A3, N.C4, N.E4, N.G4],
        [N.D4, N.F4, N.G4, N.B4], [N.C4, N.E4, N.G4, N.C5]
      ],
      // 弱音小號旋律：每小節 8 步，0＝休止
      melody: [
        [N.G4, 0, N.A4, N.C5, 0, N.A4, N.G4, 0],
        [N.E4, 0, 0, N.G4, N.A4, 0, 0, 0],
        [N.F4, 0, N.A4, N.C5, 0, N.D5, N.C5, 0],
        [N.B4, 0, 0, N.D5, 0, N.B4, N.G4, 0],
        [N.G4, 0, N.A4, N.C5, 0, N.E5, N.D5, 0],
        [N.C5, 0, 0, N.A4, N.G4, 0, 0, 0],
        [N.A4, 0, N.C5, N.D5, 0, N.E5, 0, N.D5],
        [N.C5, 0, 0, 0, 0, 0, 0, 0]
      ],
      step: function (bar, s, t, stepDur, out) {
        var b = this;
        // 刷鼓：每個八分輕刷，2、4 拍重；大鼓 1、3 拍輕點
        noise(t, 0.05, s % 2 ? 0.05 : 0.08, 'highpass', 8000, out);
        if (s === 2 || s === 6) noise(t, 0.12, 0.16, 'bandpass', 1800, out, 1.2);
        if (s === 0 || s === 4) kick(t, out, 0.28, 110, 50);
        if (s % 2 === 0) bass(t, b.bassLine[bar][s / 2], stepDur * 1.7, 0.5, out);
        // 鋼琴和弦：第 2 拍後半與第 4 拍
        if (s === 3 || s === 6) b.chords[bar].forEach(function (f) { bell(t, f, 0.35, 0.09, 'triangle', out); });
        var m = b.melody[bar][s];
        if (m) brass(t, m, stepDur * 0.9, 0.11, out, 1400, 'square');
      }
    }
  };

  /* ---------- 皮：survival（冷冽電子） ---------- */

  function tick(t, out, gain, freq) {
    var o = track(ctx.createOscillator());
    var g = ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(freq || 1400, t);
    g.gain.setValueAtTime(gain || 0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    o.connect(g).connect(out || sfxBus);
    o.start(t);
    o.stop(t + 0.04);
  }

  // 金屬撞擊：帶通雜訊＋不協和雙音
  function clank(t, gain, out) {
    noise(t, 0.5, gain, 'bandpass', 2600, out, 6);
    bell(t, 1870, 0.7, gain * 0.35, 'sine', out);
    bell(t, 2510, 0.5, gain * 0.25, 'sine', out);
  }

  var survival = {
    // 滴答逐漸加速 ＋ 鋸齒波上升音牆 ＋ 每秒一次重低音脈衝
    drumroll: function (ms) {
      var t0 = ctx.currentTime + 0.02;
      var len = ms / 1000;
      var end = t0 + len;
      var gap = 0.16;
      for (var t = t0; t < end; t += gap) {
        var p = (t - t0) / len;
        tick(t, sfxBus, 0.22 + 0.25 * p, 1200 + 600 * p);
        gap = 0.16 - 0.11 * p;
      }
      var o = track(ctx.createOscillator());
      var f = ctx.createBiquadFilter();
      var g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(N.A2, t0);
      o.frequency.exponentialRampToValueAtTime(N.A4, end);
      f.type = 'lowpass';
      f.frequency.setValueAtTime(300, t0);
      f.frequency.exponentialRampToValueAtTime(5000, end);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.4);
      g.gain.setValueAtTime(0.22, end - 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, end + 0.05);
      o.connect(f).connect(g).connect(sfxBus);
      o.start(t0);
      o.stop(end + 0.1);
      for (var k = t0; k < end - 0.4; k += 1) kick(k, sfxBus, 0.5, 90, 40);
    },
    finale: function (isLose) {
      var t = ctx.currentTime + 0.01;
      kick(t, sfxBus, 1, 120, 32);
      noise(t, 0.6, 0.3, 'lowpass', 400);
      if (isLose) {
        brass(t + 0.05, N.A2, 0.6, 0.3, sfxBus, 900, 'square');
      } else {
        clank(t, 0.45);
        noise(t + 0.05, 0.8, 0.2, 'highpass', 6000);
      }
    },
    // 中獎＝A 小調轉 A 大調的合成器琶音＋閃亮雜訊；未中獎＝低頻蜂鳴＋兩個下行音
    reward: function (isLose) {
      var t = ctx.currentTime + 0.02;
      if (isLose) {
        brass(t, N.A2, 0.45, 0.22, sfxBus, 700, 'square');
        brass(t, N.Bb3 / 2, 0.45, 0.14, sfxBus, 700, 'square');
        bell(t + 0.5, N.E4, 0.5, 0.3, 'sine');
        bell(t + 0.75, N.C4, 0.8, 0.28, 'sine');
        return;
      }
      [N.A4, N.C5, N.E5, N.A5, N.C6, N.E6].forEach(function (f, i) {
        brass(t + i * 0.07, f, 0.5, 0.16, sfxBus, 3500, 'square');
        bell(t + i * 0.07, f * 2, 0.4, 0.05, 'sine');
      });
      [N.A4, 554.37, N.E5, N.A5].forEach(function (f) { brass(t + 0.5, f, 1.0, 0.08, sfxBus, 2200); });
      bell(t + 0.52, 1108.73, 1.3, 0.18);
      bell(t + 0.52, N.E6, 1.3, 0.14);
      for (var k = 0; k < 8; k++) noise(t + 0.55 + k * 0.06, 0.1, 0.06, 'highpass', 8000);
    },
    bgm: {
      bpm: 96,
      swing: 0.5,
      stepsPerBar: 8,
      bars: 8,
      // 音樂盒旋律（A 小調）：每小節 8 步，0＝休止
      melody: [
        [N.A4, 0, N.C5, 0, N.E5, 0, N.C5, 0],
        [N.A4, 0, N.C5, 0, N.E5, 0, 0, 0],
        [N.G4, 0, N.B4, 0, N.D5, 0, N.B4, 0],
        [N.E5, 0, 0, 0, N.D5, 0, N.B4, 0],
        [N.F4, 0, N.A4, 0, N.C5, 0, N.A4, 0],
        [N.E4, 0, N.G4, 0, N.B4, 0, 0, 0],
        [N.A4, 0, N.B4, 0, N.C5, 0, N.B4, 0],
        [N.A4, 0, 0, 0, 0, 0, 0, 0]
      ],
      drone: [N.A1, N.A1, N.G1, N.G1, N.F1, N.E1, N.A1, N.A1],
      step: function (bar, s, t, stepDur, out) {
        var b = this;
        if (s === 0) bass(t, b.drone[bar], stepDur * 8.2, 0.55, out, 'sine');
        // 時鐘：每拍一下，第 1 拍較重
        if (s % 2 === 0) tick(t, out, s === 0 ? 0.3 : 0.18, 1100);
        // 心跳：每兩小節一次雙擊
        if (bar % 2 === 0 && (s === 0 || s === 1)) kick(t, out, s === 0 ? 0.5 : 0.35, 80, 36);
        // 每四小節一次遠處金屬聲
        if (bar % 4 === 3 && s === 6) clank(t, 0.08, out);
        var m = b.melody[bar][s];
        if (m) {
          bell(t, m, 1.1, 0.26, 'sine', out);
          bell(t, m * 4, 0.35, 0.05, 'sine', out);
        }
      }
    }
  };

  var profiles = { broadway: broadway, survival: survival };

  /* ---------- 背景音樂排程（lookahead） ---------- */

  var bgm = { timer: null, next: 0, index: 0, file: null, started: false };
  var LOOKAHEAD = 0.3;

  function bgmStop() {
    if (bgm.timer) clearInterval(bgm.timer);
    bgm.timer = null;
    if (bgm.file) { try { bgm.file.pause(); } catch (e) { /* 已停止 */ } bgm.file = null; }
    bgm.started = false;
  }

  function bgmStart() {
    if (!enabled || bgm.started) return;
    if (cfg.sounds.bgm) {
      bgm.file = playFile(cfg.sounds.bgm, true);
      bgm.file.volume = 0.5;
      bgm.started = true;
      return;
    }
    if (!ensure()) return;
    var def = profile().bgm;
    var beat = 60 / def.bpm;
    var stepsPerBeat = def.stepsPerBar / 4;
    bgm.started = true;
    bgm.index = 0;
    bgm.next = ctx.currentTime + 0.05;
    bgm.timer = setInterval(function () {
      while (bgm.next < ctx.currentTime + LOOKAHEAD) {
        var total = def.bars * def.stepsPerBar;
        var i = bgm.index % total;
        var bar = Math.floor(i / def.stepsPerBar);
        var s = i % def.stepsPerBar;
        var even = beat / stepsPerBeat;
        var dur = stepsPerBeat === 2 ? (s % 2 === 0 ? beat * def.swing : beat * (1 - def.swing)) : even;
        def.step(bar, s, bgm.next, dur, bgmBus);
        bgm.next += dur;
        bgm.index += 1;
      }
    }, 80);
  }

  function bgmDuck(on) {
    if (bgm.file) { bgm.file.volume = on ? 0.15 : 0.5; return; }
    if (!bgmBus) return;
    var t = ctx.currentTime;
    bgmBus.gain.cancelScheduledValues(t);
    bgmBus.gain.setValueAtTime(bgmBus.gain.value, t);
    bgmBus.gain.linearRampToValueAtTime(on ? BGM_DUCK : BGM_LEVEL, t + 0.25);
  }

  // 第一次使用者操作就開始 BGM（瀏覽器自動播放限制）
  function onFirstGesture() {
    document.removeEventListener('pointerdown', onFirstGesture, true);
    document.removeEventListener('keydown', onFirstGesture, true);
    bgmStart();
  }
  document.addEventListener('pointerdown', onFirstGesture, true);
  document.addEventListener('keydown', onFirstGesture, true);

  // 分頁切到背景時暫停整個音訊，回來再繼續（排程器以 ctx.currentTime 為準，暫停期間不會累積）
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (enabled) ctx.resume();
  });

  /* ---------- 對外 ---------- */

  function drumroll(ms) {
    if (!enabled) return;
    bgmDuck(true);
    if (cfg.sounds.drumroll) { playFile(cfg.sounds.drumroll); return; }
    if (!ensure()) return;
    profile().drumroll(ms);
  }

  function finale(isLose) {
    if (!enabled) return;
    var file = isLose ? cfg.sounds.lose : cfg.sounds.win;
    if (file) { playFile(file); return; }
    if (!ensure()) return;
    profile().finale(isLose);
  }

  function reward(isLose) {
    if (!enabled) return;
    var file = isLose ? cfg.sounds.rewardLose : cfg.sounds.reward;
    if (file) { playFile(file); return; }
    if (!ensure()) return;
    profile().reward(isLose);
  }

  function stopAll() {
    bgmStop();
    playing.forEach(function (n) {
      try { if (n.pause) n.pause(); else n.stop(); } catch (e) { /* 已停止的節點 */ }
    });
    playing = [];
  }

  function setEnabled(v) {
    enabled = v;
    if (!v) stopAll(); else bgmStart();
    try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch (e) { /* 同上 */ }
  }

  return {
    drumroll: drumroll,
    finale: finale,
    reward: reward,
    bgmDuck: bgmDuck,
    setEnabled: setEnabled,
    isEnabled: function () { return enabled; }
  };
})();
