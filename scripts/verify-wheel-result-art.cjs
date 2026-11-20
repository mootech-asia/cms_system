const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8902';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
for(const event of ['20261111_lucky_wheel','20261111_survival_spin'])for(const auto of [false,true]){
const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:390,height:844},reducedMotion:'reduce'});let release,requested=false;
try{
await p.route('**/*_modal-bg.webp*',async r=>{requested=true;await new Promise(resolve=>release=resolve);await r.continue().catch(()=>{})});
await p.goto(`${base}/event/${event}/`,{waitUntil:'domcontentloaded'});await p.locator('#loading').waitFor({state:'hidden'});
await p.waitForFunction(()=>document.getElementById('btnAutoSpin').textContent.length>0);
for(let i=0;i<30&&!requested;i++)await p.waitForTimeout(20);assert(requested,'preloads result background before any spin');
if(auto){await p.locator('#btnAutoSpin').click();await p.locator('#btnSkipSpin').click()}else{await p.locator('#btnSpin').click();await p.locator('#btnSkipSpin').click()}
await p.waitForFunction(()=>document.getElementById('btnSpin').getAttribute('aria-busy')==='true'&&document.getElementById('btnSkipSpin').disabled&&document.getElementById('resultModal').hidden);
assert(await p.locator('#resultModal').isHidden());
await p.locator('#btnSpin').evaluate(e=>e.click());await p.locator('#btnAutoSpin').evaluate(e=>e.click());
assert.equal(await p.locator('.ev-record').count(),auto?10:1);
release();await p.locator('#resultModal').waitFor({state:'visible'});
assert(!(await p.locator('.ev-modal-box').getAttribute('class')).includes('is-art-fallback'));
const loaded=await p.evaluate(async()=>{const img=new Image();img.src=new URL(EVENT_CONFIG.images.modalBg,document.baseURI).href;await img.decode();return img.naturalWidth>0});assert(loaded);
await p.screenshot({path:`/tmp/result-art-ready-${event}-${auto?'auto':'single'}.png`});
assert.equal(await p.locator('.ev-record').count(),auto?10:1);
console.log('PASS prefetch without blocking entry; waits for decoded art; no duplicate draws while waiting',event,auto?'auto + Skip':'single + Skip');
}finally{if(release)release();await p.close()}
}
for(const event of ['20261111_lucky_wheel','20261111_survival_spin']){
const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:390,height:844},reducedMotion:'reduce'});
await p.route('**/*_modal-bg.webp*',r=>r.abort());await p.goto(`${base}/event/${event}/`);await p.locator('#loading').waitFor({state:'hidden'});
await p.locator('#btnSpin').click();await p.locator('#btnSkipSpin').click();await p.locator('#resultModal').waitFor({state:'visible'});
assert((await p.locator('.ev-modal-box').getAttribute('class')).includes('is-art-fallback'));assert(await p.locator('#btnClose').isVisible());await p.screenshot({path:'/tmp/result-art-fallback-'+event+'.png'});await p.locator('#btnClose').click();
assert.equal(await p.locator('.ev-record').count(),1);console.log('PASS failed image uses complete readable fallback and preserves draw',event);await p.close();
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
