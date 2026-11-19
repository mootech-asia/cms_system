const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8900';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
for(const type of ['card_pack','blind_box']){
 const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:390,height:844},reducedMotion:'reduce'});
 await p.clock.install();
 await p.addInitScript(()=>{
  localStorage.setItem('event_20261118_card_pack_secret_cycle',JSON.stringify({total:0,nextAt:50}));
  Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});window.EVENT_CONTENT={...cfg.defaultContent,freeOpens:1};}});
  window.EVENT_RESOLVE=()=>[EVENT_CONFIG.defaultContent.prizes.find(p=>p.rarity==='epic')];
 });
 await p.goto(`${base}/event/20261118_${type}/`);
 await p.locator('#loading').waitFor({state:'hidden'});
 await p.locator('#scene').press('Enter');await p.locator('#btnAction').click();
 await p.locator('#reveal').waitFor({state:'visible'});
 if(type==='card_pack')await p.locator('#revealCard').click();
 await p.locator('#btnReveal').click();
 const hint=p.locator('#pickHint');
 assert.equal(await p.locator('#chances').innerText(),'0');
 assert(await hint.isVisible());assert(await p.locator('#btnAction').isDisabled());
 assert.equal(await p.locator('#pickHintText').innerText(),type==='card_pack'?'No packs left':'No boxes left');
 assert(await p.locator('.ev-pick-hint-icon').isHidden());
 await p.clock.fastForward(30000);
 assert(await hint.isVisible());assert.equal(await hint.getAttribute('aria-hidden'),null);
 await p.screenshot({path:`/tmp/depleted-hint-${type}.png`});
 await p.keyboard.press('Control+Alt+ArrowUp');
 assert.equal(await p.locator('#chances').innerText(),'1');
 assert(await p.locator('.ev-pick-hint-icon').isVisible());
 assert(!(await hint.getAttribute('class')).includes('is-empty'));
 await p.clock.fastForward(10000);
 assert(await hint.evaluate(e=>e.classList.contains('is-faded')));
 await p.reload();await p.locator('#loading').waitFor({state:'hidden'});
 assert.equal(await p.locator('#chances').innerText(),'1');await p.close();
 console.log('PASS',type,'last item opened, persistent empty hint, disabled action, refill resumes 10-second cycle');
 for(const locale of ['en','ko','th','zh']){
  const q=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:360,height:640}});
  await q.addInitScript(()=>{Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});window.EVENT_CONTENT={...cfg.defaultContent,freeOpens:0};}})});
  await q.goto(`${base}/event/20261118_${type}/?lang=${locale}`);
  await q.locator('#loading').waitFor({state:'hidden'});
  if(locale==='zh')await q.keyboard.press('Control+Alt+L');
  if(locale==='en')await q.screenshot({path:`/tmp/depleted-initial-${type}.png`});
  assert(await q.locator('#pickHint').isVisible());
  assert.equal(await q.locator('#pickHintText').innerText(),await q.evaluate(()=>EventI18n.t('toast.noChances')));
  if(locale==='zh')assert.equal(await q.locator('#pickHintText').innerText(),type==='card_pack'?'已無卡包':'已無寶箱');
  assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await q.close();
 }
 console.log('PASS',type,'initial zero inventory, en/ko/th and internal Chinese, 360px');
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
