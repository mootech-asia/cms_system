const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const previousApp=process.env.COMPARE_BASELINE?execFileSync('git',['show',process.env.COMPARE_BASELINE+':event/shared/unbox-3d/js/app.js'],{encoding:'utf8'}):null;
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
for(const type of ['card_pack','blind_box']){
 const results=[];
 for(const previous of (previousApp?[true,false]:[false])){
  const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.clock.install();
  if(previous)await p.route('**/app.js?*',r=>r.fulfill({contentType:'text/javascript',body:previousApp}));
  await p.goto('http://127.0.0.1:8900/event/20261118_'+type+'/');await p.locator('#loading').waitFor({state:'hidden'});
  await p.evaluate(()=>document.querySelector('.ev-info').scrollIntoView({block:'start'}));await p.locator('#btnBackTop').waitFor({state:'visible'});await p.waitForTimeout(100);
  await p.evaluate(()=>{window.hintMutations=0;new MutationObserver(ms=>hintMutations+=ms.length).observe(document.getElementById('pickHint'),{attributes:true,attributeFilter:['class']})});
  for(let i=0;i<3;i++)await p.clock.fastForward(10000);
  const changes=await p.evaluate(()=>hintMutations);results.push(changes);if(!previous)assert.equal(changes,0);
  await p.locator('#btnBackTop').click();await p.waitForFunction(()=>scrollY===0);await p.waitForTimeout(100);await p.clock.fastForward(10000);
  if(!previous){
   assert(await p.locator('#pickHint').evaluate(e=>e.classList.contains('is-faded')));
   await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));hintMutations=0});
   for(let i=0;i<3;i++)await p.clock.fastForward(10000);
   assert.equal(await p.evaluate(()=>hintMutations),0);
   await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});
   assert(await p.locator('#pickHint').isVisible());
  }
  await p.close();
 }
 if(previousApp)assert(results[0]>0);console.log('PASS off-screen hint mutations over 30s',type,results.join(' → '),'; tab-hidden pause and resume');
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await p.addInitScript(()=>{
  Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});window.EVENT_CONTENT={...cfg.defaultContent,freeOpens:1};}});
  window.EVENT_RESOLVE=()=>[EVENT_CONFIG.defaultContent.prizes.find(p=>p.rarity==='epic')];
 });
 await p.goto('http://127.0.0.1:8900/event/20261118_'+type+'/');await p.locator('#loading').waitFor({state:'hidden'});
 await p.locator('#scene').press('Enter');await p.locator('#btnBack').waitFor({state:'visible'});
 await p.evaluate(()=>{document.getElementById('btnAction').click();document.querySelector('.ev-info').scrollIntoView({block:'start'})});
 await p.locator('#reveal').waitFor({state:'visible',timeout:7000});
 assert.equal(await p.locator('.ev-record').count(),1);assert.equal(await p.locator('#chances').innerText(),'0');
 console.log('PASS off-screen single opening settles once without resuming WebGL',type);await p.close();
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
