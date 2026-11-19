const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const window={EVENT_CONFIG:{}};
 vm.runInNewContext(fs.readFileSync('event/shared/unbox-3d/js/store.js','utf8'),{window,Math,Promise,setTimeout:fn=>fn()});
 const store=window.EventStore,content={prizes:[
  {type:'empty',name:{en:'Empty'},weight:1e9},
  {rarity:'common',name:{en:'Common'},weight:1e9},
  {rarity:'rare',name:{en:'Rare'},weight:1e9},
  {rarity:'epic',name:{en:'Epic'},weight:1},
  {rarity:'legendary',name:{en:'Legendary'},weight:1},
  {rarity:'epic',name:{en:'Disabled'},weight:0}
 ]};
 for(let i=0;i<1000;i++){
  const rewards=await store.resolve(content,{count:1,edition:'secret'});
  assert.equal(rewards.length,3);
  assert(rewards.every(r=>store.rarityRank(r)>=2&&!store.isEmpty(r)&&r.weight>0));
 }
 for(const invalid of [[3],[3,4],[3,4,3,4],[0,3,4],[1,3,4],[2,3,4]]){
  window.EVENT_RESOLVE=()=>invalid;
  await assert.rejects(store.resolve(content,{count:3,edition:'secret'}));
 }
 window.EVENT_RESOLVE=request=>{assert.equal(request.count,3);return [3,4,3]};
 assert.equal((await store.resolve(content,{count:1,edition:'secret'})).length,3);
 window.EVENT_RESOLVE=()=>[0];
 assert(store.isEmpty((await store.resolve(content,{count:1,edition:'standard'}))[0]));
 window.EVENT_RESOLVE=()=>{throw Error('Backend failure')};
 await assert.rejects(store.resolve(content,{count:3,edition:'secret'}));
 delete window.EVENT_RESOLVE;
 await assert.rejects(store.resolve({prizes:content.prizes.slice(0,3)},{count:3,edition:'secret'}));
 console.log('PASS: 1000 secret opens each award 3 EPIC+ prizes; invalid count/rarity/empty rejects; regular empty preserved');
})().catch(e=>{console.error(e);process.exit(1)});
