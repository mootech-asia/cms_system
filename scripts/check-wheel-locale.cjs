const {chromium}=require('playwright');
const assert=require('assert');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let results=[];
for(const site of ['v1.5/site','v2/site','v2/site-mobile','v3/site','v3/site-mobile','v4/site','v5/site','v6/site'])for(const skin of ['lucky-wheel','survival-spin']){
 console.log(site,skin); const p=await b.newPage({viewport:{width:site.includes('mobile')?390:1440,height:900}});
 await p.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:8011/')+site+'/'+skin+'.html');
 await p.waitForFunction(()=>document.querySelector('#luckyWheelFrame').contentWindow.EventI18n);
 let frame=p.frames().find(f=>f.url().includes('/event/'));await frame.waitForSelector('#btnSpin');
 await frame.evaluate(()=>window.localeTestMarker=123);
 for(const lang of (site.startsWith('v1.5')?['ko','en']:['th','ko','en'])){
 if(site.startsWith('v1.5')) {
 await p.locator('[data-lang-trigger]').first().evaluate(e=>e.click()); await p.locator('[data-set-locale="'+lang+'"]').first().evaluate(e=>e.click());
 } else if(site.includes('site-mobile')) {
 await p.evaluate(l=>{document.documentElement.lang=l;},lang);
 } else if(site.startsWith('v2/')) {
 await p.locator('button').filter({hasText:/^\s*(EN|KO|TH|English|한국어|ไทย)\s*$/}).first().evaluate(e=>e.click()); await p.locator('[data-locale-option="'+lang+'"]').evaluate(e=>e.click());
 } else if(site.startsWith('v3/')) {
 await p.locator('.sb-lang').first().evaluate(e=>e.click()); await Promise.all([p.waitForEvent('load'),p.locator('.sb-lang-item[data-locale="'+lang+'"]').evaluate(e=>e.click())]); frame=p.frames().find(f=>f.url().includes('/event/'));
 } else {
 await p.locator('[data-lang-trigger]').first().evaluate(e=>e.click()); await p.locator('[data-lang-option="'+lang+'"]').first().evaluate(e=>e.click());
 }
 await frame.waitForFunction(l=>document.documentElement.lang===l,lang);
 if(site!=='v3/site') assert.equal(await frame.evaluate(()=>window.localeTestMarker),123);
 const key=await frame.locator('[data-i18n]').first().getAttribute('data-i18n');
 assert.equal(await frame.locator('[data-i18n]').first().textContent(),await frame.evaluate(k=>EventI18n.t(k),key));
 results.push({site,skin,lang,parentReload:site==='v3/site'});
 }
 await p.close();
}
await b.close();console.log('PASS '+results.length+' embedded locale transitions; v3 follows parent reload');})().catch(e=>{console.error(e);process.exit(1)});
