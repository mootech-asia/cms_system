const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.CHECK_BASE || 'http://127.0.0.1:8900';

async function pageFor(browser, event, { chances=20, lose=false, duration=80, locale='en', width=390, empty=false }={}) {
  const page = await browser.newPage({viewport:{width,height:844}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(({chances,lose,duration,empty})=>{
    Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){
      Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});
      cfg.spinDurationMs=duration;
      cfg.resultHoldMs=40;
      window.EVENT_CONTENT={...cfg.defaultContent,freeSpins:chances,
        prizes:empty?[]:cfg.defaultContent.prizes.map(p=>({...p,weight:!!p.isLose===lose?1:0}))};
    }});
  },{chances,lose,duration,empty});
  await page.goto(`${base}/event/${event}/?lang=${locale}`);
  await page.locator('#loading').waitFor({state:'hidden'});
  await page.evaluate(()=>{
    const stop=EventSound.stopSpin;
    window.skipSoundStops=0;
    EventSound.stopSpin=()=>{ window.skipSoundStops++; stop(); };
  });
  return {page,errors};
}

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 for(const event of ['20261111_lucky_wheel','20261111_survival_spin']) {
   const {page:p,errors}=await pageFor(browser,event);
   await p.screenshot({path:`/tmp/${event}-auto-idle.png`});
   await p.locator('#btnAutoSpin').click();
   await p.locator('#resultModal').waitFor({state:'visible'});
   assert.equal(await p.locator('#autoResults li').count(),10);
   assert.equal(await p.locator('#chances').innerText(),'10');
   assert.equal(await p.locator('.ev-record').count(),10);
   assert(await p.locator('#btnSkipSpin').isHidden());
   await p.screenshot({path:`/tmp/${event}-auto-results.png`});
   await p.locator('#btnClose').click();
   await p.locator('#btnSpin').click();
   await p.locator('#btnSkipSpin').click();
   assert.equal(await p.evaluate(()=>skipSoundStops),1);
   await p.locator('#resultModal').waitFor({state:'visible'});
   assert(await p.locator('#autoResults').isHidden());
   await p.waitForTimeout(200);
   assert.equal(await p.locator('.ev-record').count(),11);
   assert.deepEqual(errors,[]); await p.close();
   console.log('PASS',event,'10 automatic spins, summary, single Skip and records');

   for(const [options,count,left] of [
     [{duration:5000},10,10],
     [{duration:5000,chances:3},3,0],
     [{duration:5000,chances:1,lose:true},10,1]
   ]) {
     const {page:q,errors}=await pageFor(browser,event,options);
     await q.locator('#btnAutoSpin').click();
     await q.locator('#btnSkipSpin').click();
     await q.locator('#resultModal').waitFor({state:'visible',timeout:5000});
     assert.equal(await q.locator('#autoResults li').count(),count);
     assert.equal(await q.locator('.ev-record').count(),count);
     assert.equal(await q.locator('#chances').innerText(),String(left));
     assert.deepEqual(errors,[]); await q.close();
   }
   console.log('PASS',event,'Skip completes remaining draws; insufficient chances; Again capped at 10');
   for(const chances of [0]) {
     const {page:q}=await pageFor(browser,event,{chances});
     assert(await q.locator('#btnAutoSpin').isDisabled());await q.close();
   }
   const {page:q}=await pageFor(browser,event,{empty:true});
   assert(await q.locator('#btnAutoSpin').isDisabled());await q.close();
   for(const [locale,width] of [['ko',360],['th',1440]]) {
     const {page:q}=await pageFor(browser,event,{locale,width});
     await q.screenshot({path:`/tmp/${event}-auto-${locale}.png`});
     assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
     assert(!/[\u3400-\u9fff]/.test(await q.locator('#btnAutoSpin').innerText()));await q.close();
   }
   console.log('PASS',event,'zero chances, no prizes, Korean 360px, Thai desktop');
 }
 } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
