const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.CHECK_BASE||'http://127.0.0.1:8900';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
for(const type of ['card_pack','blind_box']){
 const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const cdp=await p.context().newCDPSession(p);
 const runs=[];
 for(const [direction,delay] of [[1,90],[1,8],[-1,8]]){
  await p.goto(`${base}/event/20261118_${type}/`);await p.locator('#loading').waitFor({state:'hidden'});
  const canvas=p.locator('#scene canvas[data-engine]');await canvas.waitFor({state:'visible'});
  const r=await canvas.boundingBox();const y=r.y+r.height*.7;
  const x=direction>0?r.x+r.width*.25:r.x+r.width*.75;
  await p.evaluate(()=>{
   const label=document.getElementById('pickLabel');window.trail=[Number(label.textContent.match(/\d+/)[0])];
   new MutationObserver(()=>{const n=Number(label.textContent.match(/\d+/)[0]);if(n!==trail.at(-1))trail.push(n)}).observe(label,{childList:true,subtree:true,characterData:true});
  });
  let inputTime=Date.now()/1000;
  const touch=async(type,x)=>cdp.send('Input.dispatchTouchEvent',{type,timestamp:inputTime,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{x,y,radiusX:2,radiusY:2,force:.7}]});
  await touch('touchStart',x);
  for(let i=1;i<=8;i++){await p.waitForTimeout(delay);inputTime+=delay/1000;await touch('touchMove',x+direction*r.width*.35*i/8)}
  inputTime+=.008;
  await touch('touchEnd',x+direction*r.width*.35);
  const beforeRelease=await p.evaluate(()=>trail.length);
  if(direction===1&&delay===8){
   await canvas.screenshot({path:`/tmp/inertia-${type}-0.png`});
   await p.waitForTimeout(300);await canvas.screenshot({path:`/tmp/inertia-${type}-1.png`});
   await p.waitForTimeout(600);await canvas.screenshot({path:`/tmp/inertia-${type}-2.png`});
   await p.waitForTimeout(800);
  }else await p.waitForTimeout(1700);
  const trail=await p.evaluate(()=>trail),count=type==='card_pack'?20:10;
  let distance=0;for(let i=1;i<trail.length;i++){let d=trail[i]-trail[i-1];if(d>count/2)d-=count;if(d< -count/2)d+=count;distance+=d;}
  runs.push({direction,delay,distance,coastingChanges:trail.length-beforeRelease});
  assert.equal(await p.locator('#stage').getAttribute('data-state'),'select');
  assert.equal(await p.locator('.ev-record').count(),0);
 }
 console.log('swipes',type,JSON.stringify(runs));
 assert(runs[1].distance<0,'right swipe follows finger');assert(runs[2].distance>0,'left swipe follows finger');
 assert(Math.abs(runs[1].distance)>Math.abs(runs[0].distance),'fast swipe travels farther');
 assert(runs[1].coastingChanges>0,'keeps moving after release');
 await p.screenshot({path:`/tmp/inertia-${type}.png`});console.log('PASS touch direction, release inertia, speed-dependent distance and no accidental open',type,JSON.stringify(runs));
 await p.close();
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
