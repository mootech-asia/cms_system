const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8899',out=process.env.CHECK_OUTPUT||'/tmp/unbox-layout';fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const results=[],failures=[];const equal=(ok,message)=>{if(!ok)failures.push(message)};try{
for(const [width,height,embedded] of [[360,640,false],[390,844,false],[1440,900,false],[390,844,true]])for(const lang of ['en','ko','th']){
 const pair={};for(const type of ['card_pack','blind_box']){const p=await b.newPage({viewport:{width,height},ignoreHTTPSErrors:true});const url=`${base}/event/20261118_${type}/?lang=${lang}`;let page=p;
 if(embedded){await p.setContent(`<iframe src="${url}" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>`);await p.locator('iframe').waitFor();page=await p.locator('iframe').contentFrame();}else await p.goto(url);
 await page.locator('#loading').waitFor({state:'hidden'});await p.emulateMedia({reducedMotion:'reduce'});pair[type]={};
 for(const state of ['select','ready']){if(state==='ready'){await page.locator('#scene').press('Enter');await page.locator('#btnAction').waitFor();await page.locator('#btnAction').evaluate(e=>new Promise(resolve=>{function check(){if(!e.classList.contains('is-pressing')&&getComputedStyle(e).transform==='none')resolve();else requestAnimationFrame(check)}check()}))}
 const rects=await page.locator('body').evaluate(()=>Object.fromEntries(['.ev-title','.ev-period-wrap','#scene','#btnPrev','#btnNext','#pickLabel','.ev-chances',document.querySelector('#stage').dataset.state==='select'?'#pickHint':'#btnAction','#status','#ticker','#btnShare','#btnSound'].map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return[s,{cx:r.x+r.width/2,y:r.y+scrollY,w:r.width,h:r.height}]})));pair[type][state]=rects;
 if(type==='blind_box'&&lang==='en'){await page.locator('#scene').evaluate(e=>e.blur());await p.screenshot({path:`${out}/${width}-${embedded}-${state}.png`,fullPage:!embedded})}
 }
 await p.close();}
 for(const state of ['select','ready'])for(const [key,a] of Object.entries(pair.card_pack[state])){const z=pair.blind_box[state][key];for(const axis of ['cx','y'])equal(Math.abs(a[axis]-z[axis])<1,`${width}/${height}/${embedded}/${lang}/${state}/${key}/${axis}: card=${a[axis]} box=${z[axis]}`);if(!['#pickLabel','#status'].includes(key))for(const axis of ['w','h'])equal(Math.abs(a[axis]-z[axis])<1,`${width}/${lang}/${state}/${key}/${axis}: card=${a[axis]} box=${z[axis]}`)}
 results.push({width,height,embedded,lang,select:true,ready:true});console.log('CHECK',width,embedded,lang)
}
fs.writeFileSync(out+'/report.json',JSON.stringify({results,failures},null,2));assert.deepEqual(failures,[]);console.log('PASS: 12 paired configurations, select/ready anchors match the card-pack reference');}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
