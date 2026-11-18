const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.CHECK_BASE || 'http://127.0.0.1:8895';
const out = process.env.CHECK_OUTPUT || '/tmp/unbox-audio';
fs.mkdirSync(out, { recursive: true });

async function instrument(page) {
  await page.addInitScript(() => {
    window.audioEvidence = { decoded: [], starts: [], stops: 0, media: [], pauses: [] };
    const pause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.pause = function (...args) { audioEvidence.pauses.push({ src:this.src, hidden:document.hidden, stack:new Error().stack }); return pause.apply(this,args); };
    const fetchOriginal = window.fetch;
    window.fetch = async (...args) => {
      const response = await fetchOriginal(...args);
      const arrayBuffer = response.arrayBuffer.bind(response);
      response.arrayBuffer = async () => {
        const data = await arrayBuffer();
        data.audioURL = String(args[0]);
        return data;
      };
      return response;
    };
    const decode = BaseAudioContext.prototype.decodeAudioData;
    BaseAudioContext.prototype.decodeAudioData = function (data, success, failure) {
      return decode.call(this, data, buffer => {
        buffer.audioURL = data.audioURL;
        audioEvidence.decoded.push(buffer.audioURL);
        if (success) success(buffer);
      }, failure);
    };
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (target, ...args) {
      if (target === this.context.destination) {
        if (!this.context.audioMeter) this.context.audioMeter = this.context.createAnalyser();
        connect.call(this, this.context.audioMeter);
        window.audioMeter = this.context.audioMeter;
      }
      return connect.call(this, target, ...args);
    };
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) {
      audioEvidence.starts.push({ url: this.buffer?.audioURL, duration: this.buffer?.duration, rate: this.playbackRate.value });
      return start.apply(this, args);
    };
    const stop = AudioBufferSourceNode.prototype.stop;
    AudioBufferSourceNode.prototype.stop = function (...args) { audioEvidence.stops++; return stop.apply(this, args); };
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (!audioEvidence.media.includes(this)) audioEvidence.media.push(this);
      return play.apply(this, args);
    };
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const report = [];
  try {
    for (const type of ['blind_box', 'card_pack']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await instrument(page);
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${base}/event/20261118_${type}/`);
      await page.locator('#loading').waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => audioEvidence.media.length), 0);
      await page.bringToFront();
      await page.mouse.click(5, 5);
      await page.waitForFunction(() => Object.values(EVENT_CONFIG.sounds).filter(Boolean).filter(s => s !== EVENT_CONFIG.sounds.bgm).every(s => audioEvidence.decoded.includes(s)));
      await page.waitForFunction(() => audioEvidence.media.some(m => m.src.includes('/bgm.mp3') && m.currentTime > .1 && !m.paused)).catch(async e => { console.log(await page.evaluate(() => ({hidden:document.hidden, enabled:EventSound.isEnabled(), pauses:audioEvidence.pauses}))); console.log(await page.evaluate(() => audioEvidence.media.map(m => ({src:m.src,paused:m.paused,ready:m.readyState,error:m.error?.message,time:m.currentTime})))); throw e; });
      const cues = ['click', 'move', 'select', 'tear', 'collect', 'reward', 'error'];
      if (type === 'card_pack') cues.push('flip', 'secret');
      const samples = [];
      for (const [name, arg] of [...cues.map(n => [n, n === 'tear' ? 900 : undefined]), ...[0, 1, 2, 3].map(n => ['reveal', n])]) {
        const result = await page.evaluate(async ([name, arg]) => {
          EventSound.play(name, arg);
          const clip = audioEvidence.starts.at(-1);
          await new Promise(r => setTimeout(r, 65));
          const data = new Float32Array(audioMeter.fftSize);
          audioMeter.getFloatTimeDomainData(data);
          const rms = Math.sqrt(data.reduce((sum, n) => sum + n * n, 0) / data.length);
          return { name, arg, clip, rms };
        }, [name, arg]);
        const expected = await page.evaluate(([n, a]) => EVENT_CONFIG.sounds[n === 'reveal' ? 'reveal-' + ['common', 'rare', 'epic', 'legendary'][a] : n], [name, arg]);
        assert.equal(result.clip.url, expected);
        assert(result.rms > .00001, `silent output: ${type} ${name}`);
        if (name === 'tear' && type === 'card_pack') assert(Math.abs(result.clip.duration / result.clip.rate - .9) < .03);
        samples.push(result);
        await page.waitForTimeout(250);
      }
      if (type === 'card_pack') {
        await page.evaluate(() => EventSound.play('tear', 1700));
        const slow = await page.evaluate(() => audioEvidence.starts.at(-1));
        assert(Math.abs(slow.duration / slow.rate - 1.7) < .03);
      }
      await page.evaluate(() => EventSound.setEnabled(false));
      const count = await page.evaluate(() => audioEvidence.starts.length);
      await page.evaluate(() => { EventSound.play('tear', 900); EventSound.play('reveal', 3); });
      assert.equal(await page.evaluate(() => audioEvidence.starts.length), count);
      assert(await page.evaluate(() => audioEvidence.stops > 0 && audioEvidence.media.find(m => m.src.includes('/bgm.mp3')).paused));
      await page.evaluate(() => EventSound.setEnabled(true));
      await page.waitForFunction(() => !audioEvidence.media.find(m => m.src.includes('/bgm.mp3')).paused);
      const looped = await page.evaluate(async () => {
        const m = audioEvidence.media.find(m => m.src.includes('/bgm.mp3'));
        m.currentTime = m.duration - .15;
        await new Promise(r => setTimeout(r, 600));
        return m.loop && !m.paused && m.currentTime < 2;
      });
      assert(looped);
      await page.evaluate(() => EventStore.resolve = () => Promise.resolve([EVENT_CONFIG.defaultContent.prizes.find(p => p.rarity === 'rare')]));
      await page.locator('#scene').press('Enter');
      await page.locator('#btnAction').click();
      assert.equal(await page.evaluate(() => audioEvidence.media.find(m => m.src.includes('/bgm.mp3')).volume), .1);
      await page.locator('#reveal').waitFor();
      if (type === 'card_pack') await page.locator('#btnReveal').click();
      await page.waitForTimeout(300);
      assert((await page.evaluate(() => audioEvidence.starts)).some(s => s.url?.includes('reveal-rare.mp3')));
      await page.screenshot({ path: `${out}/${type}-result.png` });
      await page.locator('#btnReveal').click();
      await page.locator('#reveal').waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => audioEvidence.media.find(m => m.src.includes('/bgm.mp3')).volume), .35);
      assert((await page.evaluate(() => audioEvidence.starts.at(-1).url)).includes('collect.mp3'));
      assert.deepEqual(errors, []);
      report.push({ type, samples, noAutoplay: true, looped, muteStops: true, fastSlowTear: type === 'card_pack', openedAndCollected: true, duckRestored: true, errors });
      await page.close();
      const failure = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await failure.route('**/*.mp3*', r => r.abort());
      await failure.goto(`${base}/event/20261118_${type}/`);
      await failure.locator('#loading').waitFor({ state: 'hidden' });
      await failure.locator('#scene').press('Enter');
      await failure.locator('#btnAction').click();
      await failure.locator('#reveal').waitFor();
      if (type === 'card_pack') await failure.locator('#btnReveal').click();
      await failure.locator('#btnReveal').click();
      await failure.locator('#reveal').waitFor({ state: 'hidden' });
      report.push({ type, allAudioBlockedStillCollects: true });
      await failure.close();
    }
    fs.writeFileSync(`${out}/audio.json`, JSON.stringify(report, null, 2));
    console.log('PASS: both supplied soundtracks and SFX decode, output signal, looping, mute, adaptive tear, ducking, actual reveal/collect, failed-download gameplay');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
