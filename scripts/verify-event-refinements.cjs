const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8900';
const events=['20261111_lucky_wheel','20261111_survival_spin','20261118_card_pack','20261118_blind_box'];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 for(const event of events){
  const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
  await p.addInitScript(()=>Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){
   Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});
   const key=cfg.storageKey?cfg.storageKey+'_player':'event_20261111_lucky_wheel_player';
   const records=Array.from({length:23},(_,i)=>({name:{en:'Reward '+(i+1),ko:'보상 '+(i+1),th:'รางวัล '+(i+1)},type:'coin',rarity:'epic',time:'2026/11/19 12:00',drawNumber:i+1}));
   localStorage.setItem(key,JSON.stringify({version:cfg.defaultContent.updatedAt,chances:20,records}));
  }}));
  await p.goto(`${base}/event/${event}/`);await p.locator('#loading').waitFor({state:'hidden'});
  assert.equal(await p.locator('.ev-record').count(),10);
  assert.match(await p.locator('.ev-record').first().innerText(),/Reward 23/);
  await p.locator('[data-records-page="next"]').click();assert.equal(await p.locator('.ev-record').count(),10);
  assert.match(await p.locator('.ev-record').first().innerText(),/Reward 13/);
  await p.locator('[data-records-page="next"]').click();assert.equal(await p.locator('.ev-record').count(),3);
  assert(await p.locator('[data-records-page="next"]').isDisabled());
  for(const locale of ['ko','th','en']){
   await p.evaluate(l=>EventI18n.setLocale(l),locale);
   assert.equal(await p.locator('.ev-record').count(),3);
   assert.equal(await p.locator('[data-records-page="previous"]').innerText(),await p.evaluate(()=>EventI18n.t('records.previous')));
  }
  await p.locator('[data-records-page="previous"]').click();assert.equal(await p.locator('.ev-record').count(),10);
  await p.screenshot({path:`/tmp/refinement-records-${event}.png`});await p.close();
  console.log('PASS 23 records → 10/10/3, newest first, page boundaries and locale preservation',event);
 }
 for(const event of events.slice(0,2)){
  for(const [width,height] of [[360,640],[390,844],[1440,900]]){
   const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width,height}});
   await p.goto(`${base}/event/${event}/?lang=th`);await p.locator('#loading').waitFor({state:'hidden'});
   const badge=await p.locator('.ev-chances').boundingBox(),auto=await p.locator('#btnAutoSpin').boundingBox(),skip=await p.locator('#btnSkipSpin').boundingBox(),ticker=await p.locator('#ticker').boundingBox();
   assert(badge.y+badge.height<=auto.y+1,'badge above controls');
   assert.equal(auto.y,skip.y);assert(auto.x+auto.width<skip.x);
   assert(auto.y+auto.height<=ticker.y+1,'controls above ticker');
   assert(await p.locator('#btnSkipSpin').isDisabled());
   await p.screenshot({path:`/tmp/refinement-layout-${event}-${width}.png`});await p.close();
  }
  for(const allAgain of [false,true]){
   const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
   await p.addInitScript(()=>Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});window.EVENT_CONTENT={...cfg.defaultContent,freeSpins:20,prizes:[{...cfg.defaultContent.prizes.find(p=>!p.isLose),weight:1},{...cfg.defaultContent.prizes.find(p=>p.isLose),weight:1},{...cfg.defaultContent.prizes.find(p=>!p.isLose),weight:0}]};}}));
   await p.goto(`${base}/event/${event}/`);await p.locator('#loading').waitFor({state:'hidden'});
   await p.evaluate(allAgain=>{
    EventSound.setEnabled(false);window.rewards=[];EventSound.reward=lose=>rewards.push(lose);
    const random=Math.random;let draws=0;
    Math.random=()=>new Error().stack.includes('pickIndex')?(allAgain||draws++===9?.99:0):random();
   },allAgain);
   await p.locator('#btnAutoSpin').click();await p.locator('#btnSkipSpin').click();await p.locator('#resultModal').waitFor({state:'visible'});
   assert.equal(await p.locator('#autoResults li').count(),10);
   assert.deepEqual(await p.evaluate(()=>rewards),[allAgain]);await p.close();
  }
  console.log('PASS two control rows, no overlaps at 360/390/1440; mixed-last-Again uses win sound; all-Again uses Again sound',event);
 }
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
