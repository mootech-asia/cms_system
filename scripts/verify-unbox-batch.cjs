const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const base = process.env.CHECK_BASE || 'http://127.0.0.1:8900';
const packCycle = 'event_20261118_card_pack_secret_cycle';

async function createPage(browser, type, secretAt = 50) {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  await page.addInitScript(({type, secretAt, packCycle}) => {
    sessionStorage.setItem('event-mock-tools', 'on');
    if (type === 'card_pack') {
      localStorage.setItem(packCycle, JSON.stringify({total:0,nextAt:secretAt}));
      // Keep the next secret draw outside this wave's pagination fixture.
      Math.random = () => .99;
    }
    window.requests = [];
    window.EVENT_RESOLVE = request => {
      requests.push(request);
      if (window.rejectAt === requests.length) throw new Error('test network error');
      const prizes = EVENT_CONFIG.defaultContent.prizes;
      const prize = window.retryAt === requests.length ? prizes.find(p=>p.type==='empty') : prizes.find(p=>p.rarity==='epic');
      return request.edition === 'secret' ? [prize,prize,prize] : [prize];
    };
  }, {type, secretAt, packCycle});
  await page.goto(base + '/event/20261118_' + type + '/');
  await page.locator('#loading').waitFor({state:'hidden'});
  return page;
}
const chance = async p => Number(await p.locator('#chances').innerText());
const drawn = p => p.evaluate(() => requests.map(r => r.selection));
const label = p => p.locator('#pickLabel').innerText();
const action = p => p.locator('#actionText').innerText();

async function openBatch(p, count, screenshot) {
  await p.locator('#btnAction').click();
  await p.locator('#stage[data-state="opening"]').waitFor();
  assert.equal(await p.locator('#stage').evaluate(el=>el.classList.contains('is-batch-opening')), true);
  assert.equal((await drawn(p)).length, count);
  if (screenshot) {
    await p.waitForTimeout(850);
    await p.screenshot({path:screenshot});
  }
  await p.locator('#reveal').waitFor();
}

async function main() {
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const boxes = await createPage(browser,'blind_box');
    assert.equal(await chance(boxes),20);
    assert.match(await label(boxes),/01 \/ 10$/);
    assert.equal(await action(boxes),'Open 10 boxes');
    await boxes.evaluate(() => {
      window.countCueCalls = 0;
      window.countBuffers = 0;
      const play = EventSound.play;
      EventSound.play = function (name, ...args) {
        if (name === 'count') countCueCalls++;
        return play(name, ...args);
      };
      const start = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) {
        if (Math.abs((this.buffer?.duration ?? 0) - .209773) < .001) countBuffers++;
        return start.apply(this, args);
      };
    });
    await boxes.keyboard.press('Control+Alt+ArrowUp');
    assert.equal(await boxes.evaluate(() => countCueCalls),0);
    await boxes.locator('#panelLess').click();
    assert.equal(await chance(boxes),19);
    await boxes.keyboard.press('Control+Alt+ArrowUp');
    assert.equal(await chance(boxes),20);
    await boxes.waitForFunction(() => countBuffers === 2);
    assert.equal(await boxes.evaluate(() => countCueCalls),2);
    assert.match(await boxes.evaluate(() => EVENT_CONFIG.sounds.count),/click01\.wav$/);
    await boxes.locator('#panelClose').click();
    await openBatch(boxes,10,process.env.CHECK_SHOTS && '/tmp/boxes-batch-view.png');
    assert.equal(await chance(boxes),10);
    assert.equal(await boxes.locator('#revealGrid > li').count(),10);
    if (process.env.CHECK_SHOTS) await boxes.screenshot({path:'/tmp/boxes-batch-rewards.png'});
    await boxes.locator('#btnReveal').click();
    assert.match(await label(boxes),/01 \/ 10$/);
    assert.equal(await action(boxes),'Open all (10)');
    await openBatch(boxes,20);
    assert.equal(new Set(await drawn(boxes)).size,20);
    await boxes.locator('#btnReveal').click();
    assert.equal(await chance(boxes),0);
    assert(await boxes.locator('#btnAction').isDisabled());
    await boxes.reload();
    await boxes.locator('#loading').waitFor({state:'hidden'});
    assert.equal(await chance(boxes),0);
    await boxes.close();
    console.log('PASS boxes: 20 → 10 → 0 with two waves and no repeated selections; count audio plays once per change');

    const packs = await createPage(browser,'card_pack',2);
    await packs.locator('#panelClose').click();
    await packs.locator('#btnNext').click();
    await packs.locator('#scene').press('Enter');
    await packs.locator('#btnAction').click();
    await packs.locator('#revealCard').click();
    await packs.locator('#btnReveal').click();
    assert.equal(await chance(packs),19);
    assert.match(await label(packs),/01 \/ 19$/);
    assert.equal((await drawn(packs))[0],1);
    await openBatch(packs,11,process.env.CHECK_SHOTS && '/tmp/packs-batch-view.png');
    assert.equal(await chance(packs),9);
    assert.equal(new Set(await drawn(packs)).size,11);
    assert.equal(await packs.locator('#secretFan button').count(),3);
    for (let i=0;i<4;i++) await packs.locator('#btnReveal').click();
    assert.equal(await packs.locator('#revealGrid > li').count(),10);
    assert.equal(await packs.locator('#revealCount').innerText(),'Page 1 of 2');
    await packs.locator('#btnReveal').click();
    assert.equal(await packs.locator('#revealGrid > li').count(),2);
    assert.equal(await packs.locator('#revealCount').innerText(),'Page 2 of 2');
    await packs.locator('#btnPrevPage').click();
    assert.equal(await packs.locator('#revealGrid > li').count(),10);
    await packs.locator('#btnReveal').click();
    await packs.locator('#btnReveal').click();
    assert.equal(await action(packs),'Open all (9)');
    await packs.close();
    console.log('PASS packs: remove selected pack, preserve hidden pack fan, paginate 12 rewards');

    const partial = await createPage(browser,'blind_box');
    await partial.evaluate(() => { window.rejectAt=3; window.retryAt=1; });
    await partial.locator('#panelClose').click();
    await openBatch(partial,3);
    assert.equal(await chance(partial),19);
    assert.equal(await partial.locator('#revealGrid > li').count(),2);
    assert.match(await partial.locator('#revealCount').innerText(),/Opened 2/);
    assert.equal(await partial.locator('.ev-record').count(),2);
    await partial.locator('#btnReveal').click();
    assert.match(await label(partial),/01 \/ 8$/);
    assert.equal(await action(partial),'Open these 8 boxes');
    await partial.close();
    console.log('PASS partial batch retains unopened boxes and grants Again once per draw');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode=1; });
