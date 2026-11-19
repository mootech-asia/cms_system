const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8900';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
for(const event of ['20261111_lucky_wheel','20261111_survival_spin','20261118_card_pack','20261118_blind_box'])for(const [width,height] of [[360,640],[1440,900]]){
const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width,height},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(`${base}/event/${event}/`);await p.locator('#loading').waitFor({state:'hidden'});
const top=p.locator('#btnBackTop');await top.waitFor({state:'attached'});assert(await top.isHidden());
await p.locator('#rulesList').scrollIntoViewIfNeeded();await top.waitFor({state:'visible'});
const r=await top.boundingBox();assert(r.x>=0&&r.y>=0&&r.x+r.width<=width&&r.y+r.height<=height);
for(const locale of ['ko','th','en']){await p.evaluate(l=>EventI18n.setLocale(l),locale);assert.equal(await top.getAttribute('aria-label'),await p.evaluate(()=>EventI18n.t('navigation.top')))}
assert.equal(await top.evaluate(e=>getComputedStyle(e,'::before').width),'36px');
await p.screenshot({path:`/tmp/back-top-${event}-${width}.png`});
await top.click();await p.waitForFunction(()=>scrollY===0);await top.waitFor({state:'hidden'});
assert.deepEqual(errors,[]);assert.equal(await p.locator('.ev-record').count(),0);await p.close();console.log('PASS rules show Back to top; themed 36px art; locale; return/hide; no accidental draws',event,width);
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
