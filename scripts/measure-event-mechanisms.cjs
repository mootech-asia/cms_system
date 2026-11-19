const {chromium}=require('playwright');
const fs=require('node:fs');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8900';
const rows=[];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});try{
for(const event of ['20261111_lucky_wheel','20261111_survival_spin','20261118_card_pack','20261118_blind_box']){
 const wheel=event.includes('20261111');
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const c=await p.context().newCDPSession(p);await c.send('Performance.enable');await c.send('Emulation.setCPUThrottlingRate',{rate:6});
 await p.addInitScript(()=>Object.defineProperty(window,'EVENT_CONFIG',{configurable:true,set(cfg){
  Object.defineProperty(window,'EVENT_CONFIG',{value:cfg});
  const records=Array.from({length:10000},(_,i)=>({name:{en:'Prize '+i},type:'coin',rarity:'epic',time:'2026/11/19 12:00',drawNumber:i+1}));
  localStorage.setItem(cfg.storageKey?cfg.storageKey+'_player':'event_20261111_lucky_wheel_player',JSON.stringify({version:cfg.defaultContent.updatedAt,chances:20,records}));
 }}));
 await p.goto(base+'/event/'+event+'/');await p.locator('#loading').waitFor({state:'hidden'});
 await p.evaluate(()=>{
  window.reverseVisits=0;const reverse=Array.prototype.reverse;
  Array.prototype.reverse=function(...args){reverseVisits+=this.length;return reverse.apply(this,args)};
 });
 const metrics=async()=>Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
 const before=await metrics();
 const paging=await p.evaluate(()=>{
  const start=performance.now();
  for(let i=0;i<20;i++)document.querySelector(`[data-records-page="${i%2?'previous':'next'}"]`).click();
  return {wallMs:performance.now()-start,reverseVisits};
 });
 const after=await metrics();
 const row={event,paging20Ms:Math.round(paging.wallMs),pagingTaskMs:Math.round((after.TaskDuration-before.TaskDuration)*1000),reversedElements:paging.reverseVisits};
 if(wheel){
  await p.evaluate(()=>{
   EventSound.setEnabled(false);window.recordAdds=0;window.recordRemoves=0;
   new MutationObserver(ms=>ms.forEach(m=>{recordAdds+=Array.from(m.addedNodes).filter(n=>n.classList?.contains('ev-record')).length;recordRemoves+=Array.from(m.removedNodes).filter(n=>n.classList?.contains('ev-record')).length})).observe(document.getElementById('recordList'),{childList:true});
   window.batchStarted=0;window.batchEnded=0;
   new MutationObserver(()=>{if(!document.getElementById('resultModal').hidden)batchEnded=performance.now()}).observe(document.getElementById('resultModal'),{attributes:true,attributeFilter:['hidden']});
  });
  const before=await metrics();
  await p.evaluate(()=>{batchStarted=performance.now();document.getElementById('btnAutoSpin').click();document.getElementById('btnSkipSpin').click()});
  await p.locator('#resultModal').waitFor({state:'visible'});
  const after=await metrics();
  Object.assign(row,await p.evaluate(()=>({skipBatchMs:Math.round(batchEnded-batchStarted),recordAdds,recordRemoves,totalRecords:JSON.parse(localStorage.getItem('event_20261111_lucky_wheel_player')).records.length})));
  row.skipTaskMs=Math.round((after.TaskDuration-before.TaskDuration)*1000);
 }
 rows.push(row);console.log(JSON.stringify(row));await p.close();
}
for(const event of ['20261111_lucky_wheel','20261111_survival_spin']){
 const p=await b.newPage({viewport:{width:390,height:844}});
 await p.addInitScript(()=>{
  window.audioWeakRefs=[];window.probeAudio=false;
  for(const method of ['createOscillator','createBufferSource']){
   const original=AudioContext.prototype[method];
   AudioContext.prototype[method]=function(...args){const node=original.apply(this,args);if(probeAudio)audioWeakRefs.push(new WeakRef(node));return node};
  }
 });
 await p.goto(base+'/event/'+event+'/');await p.locator('#loading').waitFor({state:'hidden'});
 await p.evaluate(()=>{EventSound.setEnabled(true);probeAudio=true;for(let i=0;i<12;i++)EventSound.drumroll(2000);EventSound.stopSpin();probeAudio=false});
 await p.waitForTimeout(500);const c=await p.context().newCDPSession(p);await c.send('HeapProfiler.collectGarbage');await c.send('HeapProfiler.collectGarbage');
 const row=await p.evaluate(()=>({event:EVENT_CONFIG.type||document.title,audioNodesCreated:audioWeakRefs.length,audioNodesRetained:audioWeakRefs.filter(w=>w.deref()).length}));row.event=event;rows.push(row);console.log(JSON.stringify(row));await p.close();
}
}finally{await b.close()}
if(process.env.MEASURE_OUT)fs.writeFileSync(process.env.MEASURE_OUT,JSON.stringify({conditions:{viewport:'390x844',cpuSlowdown:6,history:10000,network:'local HTTP; no network throttling',note:'Audio node retention measured after 12 scheduled rolls, stop and forced GC; not a real-device guarantee.'},rows},null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
