const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8900';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
const sites=['v1.5/site','v2/site','v2/site-mobile','v3/site','v3/site-mobile','v4/site','v5/site','v6/site'];
const routes=sites.flatMap(s=>['lucky-wheel','survival-spin','card-pack','blind-box'].map(e=>s+'/'+e+'.html'));
for(let i=0;i<routes.length;i+=2)await Promise.all(routes.slice(i,i+2).map(async route=>{
const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
try{
await p.addInitScript(()=>Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){
Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});
const key=cfg.storageKey?cfg.storageKey+'_player':'event_20261111_lucky_wheel_player';
localStorage.setItem(key,JSON.stringify({version:cfg.defaultContent.updatedAt,chances:20,records:Array.from({length:23},(_,i)=>({name:{en:'Reward '+i},type:'coin',rarity:'epic',time:'2026/11/19 12:00',drawNumber:i+1}))}));
}}));
await p.goto(base+'/'+route);const frame=p.frameLocator('#luckyWheelFrame');await frame.locator('#loading').waitFor({state:'hidden'});
assert.equal(await frame.locator('.ev-record').count(),10);
await frame.locator('[data-records-page="next"]').click();assert.equal(await frame.locator('.ev-record').count(),10);
await frame.locator('[data-records-page="next"]').click();assert.equal(await frame.locator('.ev-record').count(),3);
console.log('PASS 10/10/3 embedded records',route);
}finally{await p.close()}
}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
