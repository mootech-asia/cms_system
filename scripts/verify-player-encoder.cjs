const vm=require('node:vm');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const sandbox={window:{},document:{addEventListener(){}}};
vm.runInNewContext(fs.readFileSync('event/shared/event-runtime.js','utf8'),sandbox);
const encode=sandbox.window.createPlayerEncoder();
let player={version:'v1',chances:20,slots:[0,1,2],wave:3,records:[]};
function verify(){assert.deepEqual(JSON.parse(encode(player)),JSON.parse(JSON.stringify(player)))}
verify();
for(let i=0;i<1000;i++){
 player.chances=i%20;player.slots=[i%20];player.records.push({name:{en:'Prize "'+i,zh:'獎品\\'+i},time:'2026/11/19',drawNumber:i});verify();
}
player.records.push(undefined);verify();
player.records.length+=2;verify();
player.records.length=5;verify();
player={version:'v2',chances:10,records:[]};verify();
player.records=[{type:'coin',name:'new array',rarity:'epic'}];verify();
player.records.push({type:'coin',name:'next',rarity:'epic'});verify();
console.log('PASS encoder matches JSON at every draw; Unicode, sparse entries, shrink, reset, array replacement and inventory fields');
