const {chromium}=require('playwright');
const fs=require('fs'), assert=require('node:assert/strict');
const output=process.env.CHECK_OUTPUT||'/tmp/event-performance';fs.mkdirSync(output,{recursive:true});
const base=process.env.CHECK_BASE||'http://127.0.0.1:8895';
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const report=[];
 try {for(const name of ['20261118_card_pack','20261118_blind_box','20261111_lucky_wheel','20261111_survival_spin']){
  const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{window.__drawCalls=0;for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext])if(C)for(const method of ['drawArrays','drawElements']){const fn=C.prototype[method];C.prototype[method]=function(...a){window.__drawCalls++;return fn.apply(this,a)}}});
  const c=await p.context().newCDPSession(p);
  await c.send('Emulation.setCPUThrottlingRate',{rate:6});await c.send('Network.enable');await c.send('Network.setCacheDisabled',{cacheDisabled:true});
  await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});await c.send('Performance.enable');
  const start=Date.now();await p.goto(`${base}/event/${name}/`,{waitUntil:'domcontentloaded'});await p.locator('#loading').waitFor({state:'hidden',timeout:120000});const loadMs=Date.now()-start;
  const resources=await p.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,bytes:r.encodedBodySize,duration:Math.round(r.duration)})));
  const metric=async()=> (await c.send('Performance.getMetrics')).metrics.find(x=>x.name==='TaskDuration').value;
  const before=await metric();const frame=await p.evaluate(()=>new Promise(resolve=>{let last=performance.now(),start=last;const times=[];function f(now){times.push(now-last);last=now;if(now-start<2000)requestAnimationFrame(f);else resolve({frames:times.length,meanMs:times.reduce((a,b)=>a+b)/times.length,maxMs:Math.max(...times)})}requestAnimationFrame(f)}));const taskMs=((await metric())-before)*1000;
  await p.screenshot({path:`${output}/${name}-initial.png`});
  let offscreenWebGLPaused=null;
  if(name.includes('20261118')){
    await p.evaluate(()=>{const spacer=document.createElement('div');spacer.id='perfSpacer';spacer.style.height='1500px';document.body.append(spacer);window.scrollTo(0,document.body.scrollHeight)});await p.waitForTimeout(500);const draws=await p.evaluate(()=>window.__drawCalls);await p.waitForTimeout(750);assert.equal(await p.evaluate(()=>window.__drawCalls),draws);offscreenWebGLPaused=true;
    await p.evaluate(()=>{document.querySelector('#perfSpacer').remove();window.scrollTo(0,0)});await p.locator('#scene').press('Enter');await p.waitForFunction(()=>document.querySelector('#stage').dataset.state==='ready');await p.locator('#btnAction').click();await p.locator('#reveal').waitFor({timeout:30000});
  }else{await p.locator('#btnSpin').click();await p.locator('#resultModal').waitFor({timeout:30000})}
  await p.screenshot({path:`${output}/${name}-result.png`});assert.deepEqual(errors,[]);
  report.push({name,loadMs,taskMs,frame,offscreenWebGLPaused,opened:true,resources,errors});await p.close();
 }}finally{await b.close()}
 fs.writeFileSync(output+'/performance.json',JSON.stringify({conditions:'Chromium SwiftShader, 390x844, CPU 6x, cold cache, 1.6 Mbps / 150 ms; not physical-device FPS',report},null,2));
 console.log(report.map(({resources,...r})=>({...r,loadedBytes:resources.reduce((s,x)=>s+x.bytes,0)})));
})().catch(e=>{console.error(e);process.exitCode=1});
