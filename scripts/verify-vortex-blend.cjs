const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
 for(const [outcome,width,reduce] of [['rare',390,false],['empty',360,false],['rare',1440,true]]){
  const p=await b.newPage({viewport:{width,height:844},deviceScaleFactor:width<500?2:1,reducedMotion:reduce?'reduce':'no-preference'});
  const errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(kind=>{window.EVENT_RESOLVE=()=>[EVENT_CONFIG.defaultContent.prizes.find(p=>kind==='empty'?p.type==='empty':p.rarity==='rare')]},outcome);
  await p.goto((process.env.CHECK_BASE||'http://localhost:8900')+'/event/20261118_blind_box/');
  await p.locator('#loading').waitFor({state:'hidden'});
  const spirit=p.locator('canvas.ev-mascot');
  if(!reduce){
   await spirit.waitFor({state:'visible'});
   await p.waitForFunction(()=>Number(document.querySelector('canvas.ev-mascot')?.dataset.frame)>2);
   if(width===390) await p.screenshot({path:'/tmp/genie-live-390.png'});
  }
  await p.locator('#scene').press('Enter');
  await p.locator('#btnAction').click();
  await p.locator('#btnSkip').click();
  await p.locator('#reveal').waitFor({state:'visible'});
  await spirit.waitFor({state:'hidden'});
  const vortex=p.locator('#revealVortex');
  if(outcome==='rare'){
   await p.waitForFunction(()=>document.querySelector('#revealVortex')?.dataset.frame!==undefined);
   if(reduce) assert.equal(await vortex.getAttribute('data-frame'),'0');
   else{
    await p.waitForFunction(()=>Number(document.querySelector('#revealVortex')?.dataset.frame)>3);
    await p.screenshot({path:'/tmp/vortex-live-390.png'});
    const frame=await vortex.getAttribute('data-frame');
    await p.waitForFunction(frame=>document.querySelector('#revealVortex').dataset.frame!==frame,frame);
   }
  }
  await p.locator('#btnReveal').click();
  await p.waitForFunction(name=>document.querySelector('#mascot').dataset.state===name,outcome==='empty'?'lose':'celebrate');
  if(!reduce) await spirit.waitFor({state:'visible'});
  assert.deepEqual(errors,[]);
  console.log('PASS',outcome,width,reduce?'reduced motion':'12 fps renderer resumes after reveal');
  await p.close();
 }
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
