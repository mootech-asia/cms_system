const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8896',out=process.env.CHECK_OUTPUT||'/tmp/desert-spirit';fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const results=[];try{
for(const rarity of ['common','rare']){
 const p=await b.newPage({viewport:{width:390,height:844}});await p.addInitScript(r=>{window.EVENT_CONTENT={freeOpens:3,prizes:[{name:{en:'Test treasure'},rarity:r,weight:1}],rules:{en:[]}}},rarity);
 await p.goto(base+'/event/20261118_blind_box/');await p.locator('#loading').waitFor({state:'hidden'});await p.waitForFunction(()=>document.querySelector('#mascot').dataset.state==='idle');
 assert.equal(await p.locator('.ev-depth-layer').count(),2);assert.equal(await p.locator('.ev-depth-columns,.ev-depth-curtain').count(),0);
 const a=await p.locator('.ev-depth-soft').evaluateAll(es=>es.map(e=>e.style.opacity));await p.waitForTimeout(900);const z=await p.locator('.ev-depth-soft').evaluateAll(es=>es.map(e=>e.style.opacity));assert(z.every((v,i)=>v!==a[i]));assert.notEqual(z[0],z[1]);
 await p.screenshot({path:out+'/'+rarity+'-idle.png'});await p.locator('#scene').press('Enter');await p.waitForFunction(()=>document.querySelector('#mascot').dataset.state==='anticipate');await p.screenshot({path:out+'/'+rarity+'-excited.png'});
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.querySelector('#mascot').src.includes('poster.webp'));await p.emulateMedia({reducedMotion:'no-preference'});
 await p.locator('#btnAction').click();await p.locator('#btnSkip').click();await p.locator('#reveal').waitFor();assert.equal(await p.locator('#mascot').getAttribute('data-motion'),'paused');await p.locator('#btnReveal').click();
 await p.waitForFunction(s=>document.querySelector('#mascot').dataset.state===s,rarity==='rare'?'celebrate':'lose');
 await p.evaluate(()=>window.scrollTo(0,0));for(let i=0;i<4;i++){await p.waitForTimeout(250);await p.screenshot({path:`${out}/${rarity}-reaction-${i}.png`})}
 await p.waitForFunction(()=>document.querySelector('#mascot').dataset.state==='idle');await p.evaluate(()=>{const e=document.createElement('div');e.style.height='1800px';document.body.append(e);scrollTo(0,document.body.scrollHeight)});await p.waitForTimeout(300);assert.equal(await p.locator('#mascot').getAttribute('data-motion'),'paused');results.push({rarity,idle:true,anticipate:true,reaction:rarity==='rare'?'celebrate':'lose',reduced:true,offscreen:true,independentDesertLayers:2});await p.close();
}
const p=await b.newPage();await p.route('**/mascot/spirit/*.webp?*',r=>r.request().url().includes('poster')?r.continue():r.abort());await p.goto(base+'/event/20261118_blind_box/');await p.locator('#loading').waitFor({state:'hidden'});await p.locator('#scene').press('Enter');await p.waitForTimeout(500);assert(await p.locator('#mascot').evaluate(e=>e.complete&&e.naturalWidth>0&&e.src.includes('poster')));results.push({animationFailureKeepsPoster:true});await p.close();
fs.writeFileSync(out+'/report.json',JSON.stringify(results,null,2));console.log('PASS',results);
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
