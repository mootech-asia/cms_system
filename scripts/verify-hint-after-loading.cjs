const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
for(const type of ['card_pack','blind_box']){
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:type==='blind_box'?'no-preference':'reduce'});let release;
 try{
 await p.clock.install();
 await p.route('**/slow-ready-test.webp',async r=>{await new Promise(resolve=>release=resolve);await r.fulfill({status:404,body:''}).catch(()=>{})});
 await p.addInitScript(()=>Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});cfg.images.readyProbe='assets/images/slow-ready-test.webp';cfg.loadingImages.push('readyProbe')}}));
 await p.goto('http://127.0.0.1:8900/event/20261118_'+type+'/',{waitUntil:'domcontentloaded'});
 assert(await p.locator('#loading').isVisible());
 if(type==='blind_box')assert.equal(await p.locator('#mascot').getAttribute('data-motion'),'paused');
 await p.clock.fastForward(10000);await p.locator('#loading').waitFor({state:'hidden'});
 if(type==='blind_box')assert.equal(await p.locator('#mascot').getAttribute('data-motion'),'playing');
 assert(await p.locator('#pickHint').isVisible());assert(!(await p.locator('#pickHint').getAttribute('class')).includes('is-faded'));
 await p.clock.fastForward(11000);assert((await p.locator('#pickHint').getAttribute('class')).includes('is-faded'));
 await p.clock.fastForward(10000);assert(await p.locator('#pickHint').isVisible());
 console.log('PASS slow loading does not consume the first 10-second hint; subsequent cycle works',type);
 }finally{if(release)release();await p.close()}
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
