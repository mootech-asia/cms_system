const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8895',out=process.env.CHECK_OUTPUT||'/tmp/event-loaders';fs.mkdirSync(out,{recursive:true});
const events=['20261111_lucky_wheel','20261111_survival_spin','20261118_card_pack','20261118_blind_box'];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const rows=[];try{
for(const event of events)for(const lang of ['en','ko','th'])for(const width of [360,390,1440]){
 const p=await b.newPage({viewport:{width,height:width===360?640:844},ignoreHTTPSErrors:base.startsWith('https')});let release;const gate=new Promise(r=>release=r),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+':'+r.url())});await p.route('**/stage-bg.webp*',async route=>{await gate;await route.continue().catch(()=>{})});
 await p.goto(`${base}/event/${event}/?lang=${lang}`,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.querySelector('.ev-loading-art img').naturalWidth>0);await p.waitForFunction(()=>Number(document.querySelector('#loadingProgress').getAttribute('aria-valuenow'))>0);assert(await p.locator('#loading').isVisible());const before=await p.locator('#loadingProgress').getAttribute('aria-valuenow');assert(Number(before)<100);assert.equal(await p.locator('#loadingPct').innerText(),before+'%');assert.equal(await p.locator('html').getAttribute('lang'),lang);assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 const box=await p.locator('.ev-loading-box').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=width&&box.y+box.height<=(width===360?640:844));await p.waitForTimeout(300);await p.screenshot({path:`${out}/${event}-${lang}-${width}.png`});
 await p.emulateMedia({reducedMotion:'reduce'});assert(await p.locator('.ev-loading-art img').evaluate(e=>getComputedStyle(e).animationName==='none'));release();await p.locator('#loading').waitFor({state:'hidden'});assert.deepEqual(errors,[]);rows.push({event,lang,width,progress:Number(before),localized:true,artDecoded:true,released:true});await p.close();
}
for(const event of events){
 const p=await b.newPage();await p.route('**/stage-bg.webp*',()=>{});await p.goto(`${base}/event/${event}/`,{waitUntil:'domcontentloaded'});await p.locator('#loading').waitFor({state:'hidden',timeout:12500});rows.push({event,stalledAssetReleased:true});await p.close();
 const f=await b.newPage();await f.route('**/loading-emblem.webp*',route=>route.abort());await f.goto(`${base}/event/${event}/`,{waitUntil:'domcontentloaded'});await f.locator('#loading').waitFor({state:'hidden',timeout:12500});rows.push({event,failedEmblemReleased:true});await f.close();
}
fs.writeFileSync(out+'/report.json',JSON.stringify(rows,null,2));console.log('PASS: 36 themed locale/viewport loading flows; four stalled and four failed-image entries');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
