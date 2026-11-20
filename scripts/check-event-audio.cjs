const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});try{
for(const event of ['20261111_lucky_wheel','20261111_survival_spin']){
 const page=await browser.newPage({ignoreHTTPSErrors:true,reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.clips=[];window.stops=[];const decode=BaseAudioContext.prototype.decodeAudioData;BaseAudioContext.prototype.decodeAudioData=function(...args){return decode.apply(this,args).then(b=>{b.provided=true;return b;});};const start=AudioBufferSourceNode.prototype.start,stop=AudioBufferSourceNode.prototype.stop;AudioBufferSourceNode.prototype.start=function(...a){if(this.buffer?.provided)window.clips.push({duration:this.buffer.duration,node:this});return start.apply(this,a);};AudioBufferSourceNode.prototype.stop=function(...a){if(this.buffer?.provided)window.stops.push(this.buffer.duration);return stop.apply(this,a);};});
 await page.goto(`${process.env.AUDIO_BASE||'http://127.0.0.1:8000/'}event/${event}/`);await page.locator('#loading').waitFor({state:'hidden'});
 for(const [method,arg,key] of [['click',null,'click'],['hover',null,'hover'],['reward',false,'reward'],['reward',true,'rewardLose']]){
 const n=await page.evaluate(()=>clips.length);await page.evaluate(([m,a])=>EventSound[m](a),[method,arg]);await page.waitForFunction(n=>clips.length>n,n);
 const duration=await page.evaluate(()=>clips.at(-1).duration);assert(duration>0);console.log(`PASS ${event} ${key}: decoded and played ${duration.toFixed(3)}s`);
 }
 await page.evaluate(()=>EventSound.stopReward());assert((await page.evaluate(()=>stops.length))>=3);
 await page.evaluate(()=>EventSound.setEnabled(false));const n=await page.evaluate(()=>clips.length);await page.evaluate(()=>{EventSound.click();EventSound.hover();EventSound.reward(false);});await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>clips.length),n);
 await page.evaluate(()=>EventSound.setEnabled(true));await page.locator('#btnSpin').click();await page.locator('#resultModal').waitFor({state:'visible'});await page.locator('#btnClose').click();assert.deepEqual(errors,[]);console.log(`PASS ${event}: replacement, stop, mute, draw, close`);await page.close();
 const failure=await browser.newPage({ignoreHTTPSErrors:true,reducedMotion:'reduce'});const failures=[];failure.on('pageerror',e=>failures.push(e.message));await failure.route('**/assets/sounds/*.mp3',r=>r.abort());await failure.goto(`${process.env.AUDIO_BASE||'http://127.0.0.1:8000/'}event/${event}/`);await failure.locator('#loading').waitFor({state:'hidden'});await failure.locator('#btnSpin').click();await failure.locator('#resultModal').waitFor({state:'visible'});assert.deepEqual(failures,[]);console.log(`PASS ${event}: failed audio download does not block draw`);await failure.close();
}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
