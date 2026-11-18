import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const base=process.env.EVENT_3D_BASE || 'http://127.0.0.1:8011/';
const out=process.env.EVENT_3D_REPORT || '/tmp/event-3d-verification';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
for(const [name,count] of [['card_pack',3],['blind_box',1]]) {
 for(const width of [320,390,1440]) {
 const page=await browser.newPage({viewport:{width,height:width===320?568:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(base+`event/20261118_${name}/`);assert.equal(response.status(),200);
 await page.locator('canvas').waitFor();
 const rect=await page.locator('body').boundingBox();assert.equal(rect.width,Math.min(width,480));assert.equal(rect.x,(width-rect.width)/2);
 const btn=await page.locator('[data-action]').boundingBox();assert(btn.y+btn.height<=page.viewportSize().height);
 await page.screenshot({path:`${out}/${name}-${width}.png`});
 await page.locator('[data-next]').click();await page.locator('[data-action]').click();await page.locator('[data-action]').dblclick();
 await page.locator('[data-skip]').click();for(let i=0;i<count;i++)await page.locator('[data-action]').click();
 assert.equal(await page.locator('.reward').count(),count);
 await page.screenshot({path:`${out}/${name}-${width}-results.png`});
 await page.locator('[data-reset]').click();await page.locator('canvas').waitFor();
 await page.locator('header a').nth(1).click();await page.locator('canvas').waitFor();assert.deepEqual(errors,[]);
 console.log('PASS',name,width,'HTTP 200, H5 size, select/open/reveal/reset/switch');await page.close();
 }
 const page=await browser.newPage();await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};});
 await page.goto(base+`event/20261118_${name}/`);await page.getByText('此裝置無法啟用 3D，仍可使用下方按鈕完成體驗。').waitFor();
 await page.locator('[data-action]').click();await page.locator('[data-action]').click();await page.locator('[data-skip]').click();await page.locator('[data-action]').click();assert.equal(await page.locator('.reward').count(),1);
 console.log('PASS',name,'WebGL unavailable: button fallback reveals reward');await page.close();
}
}finally{await browser.close();}
