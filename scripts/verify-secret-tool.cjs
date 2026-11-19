const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const p=await b.newPage({viewport:{width:390,height:844}});
 await p.addInitScript(()=>{sessionStorage.setItem('event-mock-tools','on');window.EVENT_RESOLVE=()=>[EVENT_CONFIG.defaultContent.prizes.find(p=>p.type==='empty')]});
 await p.goto((process.env.CHECK_BASE||'http://127.0.0.1:8900')+'/event/20261118_card_pack/');
 await p.locator('#loading').waitFor({state:'hidden'});
 const before=Number(await p.locator('#chances').textContent());
 await p.locator('#btnSecret').click();
 await p.waitForFunction(()=>document.querySelector('#stage').dataset.state==='ready');
 assert.equal(Number(await p.locator('#chances').textContent()),before);
 let cycle=await p.evaluate(()=>JSON.parse(localStorage.getItem('event_20261118_card_pack_secret_cycle')));
 assert.equal(cycle.nextAt,cycle.total+1);
 assert.equal(await p.locator('.ev-record').count(),0);
 await p.evaluate(()=>{window.EVENT_RESOLVE=request=>{window.secretRequest=request;const prize=EVENT_CONFIG.defaultContent.prizes.find(p=>p.rarity==='epic');return [prize,prize,prize]}});
 await p.locator('#btnAction').click();await p.locator('#btnSkip').click();await p.locator('#reveal').waitFor();
 assert.equal(await p.evaluate(()=>secretRequest.count),3);
 assert.equal(Number(await p.locator('#chances').textContent()),before-1);
 for(let i=0;i<3;i++){
  await p.locator('#btnReveal').click();
  assert.equal(await p.locator('#revealCard').getAttribute('data-edition'),'secret');
  assert.equal(await p.locator('#revealCard').getAttribute('data-rarity'),'epic');
  assert((await p.locator('#revealCount').textContent()).includes(`${i+1} / 3`));
  await p.locator('#btnReveal').click();
 }
 assert.equal(await p.locator('#revealGrid .ev-prize-card').count(),3);
 await p.screenshot({path:'/tmp/secret-three-epic.png'});
 await p.locator('#btnReveal').click();
 assert.equal(await p.locator('.ev-record').count(),3);
 cycle=await p.evaluate(()=>JSON.parse(localStorage.getItem('event_20261118_card_pack_secret_cycle')));
 assert.equal(cycle.total,1);
 console.log('PASS secret tool refunds invalid response; awards 3 EPIC cards for 1 chance and 1 cumulative draw');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
