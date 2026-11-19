import assert from 'node:assert/strict';
import {createSecretCycle} from '../event/shared/unbox-3d/js/secret-cycle.js';
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
const values=[0,.98,.42,.2,.74];let i=0;
let c=createSecretCycle('player',50,storage,()=>values[i++%values.length]);
assert(c.due());assert(c.needsNotice());c.notified();assert(!c.needsNotice());
let last=0,secrets=[];
for(let n=1;n<=500;n++) {
 const due=c.due();const r=c.commit();assert.equal(r.drawNumber,n);assert.equal(r.edition==='secret',due);
 if(due){assert(n-last<=50);secrets.push(n);last=n;}
 if(n%7===0){const total=c.total();c=createSecretCycle('player',50,storage,()=>values[i++%values.length]);assert.equal(c.total(),total);}
}
assert(secrets.some(n=>n%50!==0));assert(c.total()-last<50);
const before=storage.getItem('player');storage.setItem('refillable-player',JSON.stringify({chances:10,records:[]}));assert.equal(storage.getItem('player'),before);
const totalBeforeForce=c.total();c.forceNext();assert(c.due());assert.equal(c.total(),totalBeforeForce);assert.equal(c.commit().edition,'secret');
const bad={getItem(){throw Error('denied')},setItem(){throw Error('denied')}};assert.equal(createSecretCycle('x',50,bad,()=>0).commit().edition,'secret');
console.log('PASS: 500 draws, randomized gaps 1–50, reload persistence, refill isolation, denied storage; secret draws:',secrets.join(','));
