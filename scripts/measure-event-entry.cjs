const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const rows=[];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
for(const event of ['20261111_lucky_wheel','20261111_survival_spin','20261118_card_pack','20261118_blind_box']){
const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const c=await p.context().newCDPSession(p);const errors=[];p.on('pageerror',e=>errors.push(e.message));
await c.send('Network.enable');await c.send('Network.setCacheDisabled',{cacheDisabled:true});await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});await c.send('Emulation.setCPUThrottlingRate',{rate:6});await c.send('Performance.enable');
await p.goto('http://127.0.0.1:8900/event/'+event+'/',{waitUntil:'domcontentloaded',timeout:60000});await p.locator('#loading').waitFor({state:'hidden',timeout:30000});
const row=await p.evaluate(()=>({domReadyMs:Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd),loadingMaskClearedMs:Math.round(performance.now()),resourceBytesAtMaskClear:performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.encodedBodySize,0),resourcesAtMaskClear:performance.getEntriesByType('resource').length}));
const metrics=Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));row.taskMsAtMaskClear=Math.round(metrics.TaskDuration*1000);row.event=event;
await p.screenshot({path:'/tmp/entry-performance-'+event+'.png'});
await p.evaluate(()=>EventSound.setEnabled(false));await p.locator('.ev-info').evaluate(e=>e.scrollIntoView({block:'start'}));await p.locator('#btnBackTop').waitFor({state:'visible'});await p.locator('#btnBackTop').click();await p.waitForFunction(()=>scrollY===0);assert.deepEqual(errors,[]);
rows.push(row);console.log(JSON.stringify(row));await p.close();
}
}finally{await b.close()}
if(process.env.MEASURE_OUT)fs.writeFileSync(process.env.MEASURE_OUT,JSON.stringify({conditions:{viewport:'390x844',cpuSlowdown:6,latencyMs:150,downloadBitsPerSecond:1600000,uploadBitsPerSecond:750000,coldCache:true,reducedMotion:true,note:'Measures loading-mask dismissal, not proof that every background asset has finished downloading; browser simulation is not a device guarantee.'},rows},null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
