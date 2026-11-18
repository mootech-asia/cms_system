import * as THREE from 'three';
import './style.css';

export function createEvent(root, config) {
  const box = config.type === 'blind-box';
  root.classList.toggle('is-embedded', window.self !== window.top);
  root.innerHTML = `<header><a href="/">ARC / EVENTS</a><span>互動體驗 · DEMO</span><a href="${box ? '/card-pack/' : '/blind-box/'}">${box ? '拆卡包' : '拆盲盒'} ↗</a></header><main><div class="intro"><p class="eyebrow">${box ? '02 / MYSTERY OBJECTS' : '01 / COLLECT THE UNEXPECTED'}</p><h1>${box ? '驚喜，藏在裡面。' : '下一張，心動登場。'}</h1><p>${box ? '選一個盒子，打開未知的驚喜。' : '轉動卡包，讓直覺決定這一次的驚喜。'}</p></div><div class="stage" aria-label="可拖曳旋轉的 3D 選擇區"></div><div class="controls"><div class="selector"><button data-prev aria-label="上一個">←</button><span data-selection></span><button data-next aria-label="下一個">→</button></div><p data-status role="status" aria-live="polite">左右拖曳挑選，也可以使用箭頭按鈕</p><button class="primary" data-action>選擇這${box ? '個盲盒' : '包卡片'} <span>↗</span></button><button class="skip" data-skip hidden>跳過動畫</button></div><section class="results" hidden><p class="eyebrow">YOUR COLLECTION</p><h2>這次的驚喜</h2><div class="cards"></div><button class="primary" data-reset>再體驗一次 ↻</button></section></main><footer><span>✧ ${box ? 'MYSTERY SERIES' : 'PRISM COLLECTION'}</span><span>展示模式 · 不消耗次數、不發放獎品</span><span>01 — 2026</span></footer>`;
  const $ = s => root.querySelector(s), stage = $('.stage'), action = $('[data-action]'), status = $('[data-status]');
  let state = 'select', selected = 0, angle = 0, target = 0, start = null, drag = 0, progress = 0, rewards = [], revealed = 0, disposed = false;
  const textures = [], resources = [], events = new AbortController();
  const on = (el, name, fn) => el.addEventListener(name, fn, {signal: events.signal});
  const palette = config.colors || ['#a5b8ff', '#c9a5ef', '#8ed6c5', '#f2c18f', '#b8b4f3', '#9ecce9'];
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); }
  catch { stage.textContent = '此裝置無法啟用 3D，仍可使用下方按鈕完成體驗。'; }
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(0,2.3,10.8); camera.lookAt(0,.3,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x8589af,2));
  const light = new THREE.DirectionalLight(0xffffff,3); light.position.set(-3,6,5); scene.add(light);
  const pink = new THREE.PointLight(0xd4aaff,35); pink.position.set(4,2,1); scene.add(pink);
  const ring = new THREE.Group(); scene.add(ring);
  function texture(i) {
    const canvas = document.createElement('canvas'); canvas.width=512; canvas.height=768;
    const ctx=canvas.getContext('2d'); const grad=ctx.createLinearGradient(0,0,512,768);grad.addColorStop(0,palette[i%palette.length]);grad.addColorStop(.5,'#edf5ff');grad.addColorStop(1,palette[(i+1)%palette.length]);ctx.fillStyle=grad;ctx.fillRect(0,0,512,768);
    ctx.strokeStyle='#ffffff99';for(let j=0;j<8;j++){ctx.beginPath();ctx.ellipse(260,380,80+j*24,180+j*12,.6,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle='#28354c';ctx.font='22px sans-serif';ctx.fillText('A R C   /   C O L L E C T I O N',35,90);ctx.font='bold 96px serif';ctx.fillText(box?'?':'✧',210,400);ctx.font='bold 62px sans-serif';ctx.fillText(box?'MYSTERY':'PRISM',35,600);ctx.font='22px sans-serif';ctx.fillText(`SERIES 01     /     NO. 0${i+1}`,35,650);
    for(let y of [8,735]){ctx.fillStyle='#56628c';ctx.fillRect(0,y,512,20);for(let x=0;x<512;x+=8){ctx.fillStyle='#ffffff55';ctx.fillRect(x,y,2,20);}}
    const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);
    if(config.coverUrl){new THREE.TextureLoader().load(config.coverUrl, loaded=>{if(disposed){loaded.dispose();return;}loaded.colorSpace=THREE.SRGBColorSpace;textures.push(loaded);items[i].front.map=loaded;items[i].front.needsUpdate=true;},undefined,()=>{status.textContent='封面載入失敗，使用預設封面。';});}
    return tex;
  }
  function mesh(w,h,d,mat){const geo=new THREE.BoxGeometry(w,h,d);resources.push(geo);return new THREE.Mesh(geo,mat);}
  const items=[];
  for(let i=0;i<6;i++){
    const group=new THREE.Group(), body=new THREE.Group();group.add(body);
    const side=new THREE.MeshStandardMaterial({color:palette[i],metalness:.48,roughness:.3});resources.push(side);
    const front=new THREE.MeshStandardMaterial({map:texture(i),metalness:.38,roughness:.29});resources.push(front);
    const materials=[side,side,side,side,front,front];
    const base=mesh(box?1.55:1.48,box?1.5:2.35,box?1.55:.065,materials);body.add(base);
    const lid=mesh(box?1.65:1.48,box?.24:.18,box?1.65:.07,side);lid.position.y=box?.88:1.27;body.add(lid);
    const a=i*Math.PI/3;group.position.set(Math.sin(a)*2.65,0,Math.cos(a)*2.65-2.65);group.rotation.y=a;
    ring.add(group);items.push({group,body,lid,front});
  }
  const floorGeo=new THREE.CircleGeometry(14,64),floorMat=new THREE.MeshStandardMaterial({color:0xe6eaf5,metalness:.25,roughness:.24,transparent:true,opacity:.55});resources.push(floorGeo,floorMat);
  const floor=new THREE.Mesh(floorGeo,floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-1.45;scene.add(floor);
  if(renderer){renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);stage.append(renderer.domElement);}
  const resize=new ResizeObserver(()=>{if(!renderer)return;const {width,height}=stage.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=width<600?7.6:8.5;camera.updateProjectionMatrix();});resize.observe(stage);
  function label(){ $('[data-selection]').textContent=`${box?'MYSTERY BOX':'PRISM PACK'} / 0${selected+1}`; }
  function move(n){if(state!=='select')return;target+=n*Math.PI/3;selected=((Math.round(-target/(Math.PI/3))%6)+6)%6;label();}
  on($('[data-prev]'),'click',()=>move(1));on($('[data-next]'),'click',()=>move(-1));
  on(stage,'pointerdown',e=>{if(!['select','ready'].includes(state))return;start=e.clientX;drag=0;stage.setPointerCapture(e.pointerId);});
  on(stage,'pointermove',e=>{if(start===null)return;drag=e.clientX-start;if(state==='select')angle=target+drag*.004;});
  on(stage,'pointerup',()=>{if(start===null)return;if(state==='select'&&Math.abs(drag)>25)move(drag>0?1:-1);else if(state==='ready'&&Math.abs(drag)>55)open();start=null;});
  on(stage,'pointercancel',()=>{start=null;});
  on(action,'click',()=>{if(state==='select'){state='ready';status.textContent=box?'準備好揭開驚喜了嗎？':'沿著封條左右滑動，或按下方按鈕拆開';action.textContent=box?'打開盲盒 ✧':'撕開卡包 ✧';}else if(state==='ready')open();else if(state==='reveal')reveal();});
  async function open(){
    if(state!=='ready')return;state='loading';action.disabled=true;status.textContent='正在取得獎品結果…';
    try {
      const result=await config.resolveRewards({type:config.type,selection:selected});
      if(disposed)return;
      if(!Array.isArray(result)||!result.length||result.some(r=>!r||typeof r.name!=='string'))throw new Error('Invalid reward response');
      rewards=result;state='opening';progress=0;status.textContent=box?'驚喜即將揭曉…':'封條已撕開，看看你的收藏…';$('[data-skip]').hidden=false;
    }catch{if(disposed)return;state='ready';action.disabled=false;status.textContent='暫時無法取得結果，請稍後再試。';}
  }
  function finishOpening(){if(state!=='opening')return;state='reveal';$('[data-skip]').hidden=true;stage.hidden=true;$('.selector').hidden=true;$('.results').hidden=false;action.disabled=false;action.textContent='揭曉第一張 ✧';status.textContent='點擊按鈕，逐一揭曉你的獎品';$('[data-reset]').hidden=true;}
  function reveal(){if(state!=='reveal')return;const reward=rewards[revealed++];const card=document.createElement('article');card.className='reward';if(reward.imageUrl){const img=document.createElement('img');img.src=reward.imageUrl;img.alt=reward.name;card.append(img);}else{const symbol=document.createElement('div');symbol.className='symbol';symbol.textContent=reward.symbol||'✧';card.append(symbol);}const rarity=document.createElement('small');rarity.textContent=reward.rarity||'COLLECTION';const title=document.createElement('h3');title.textContent=reward.name;card.append(rarity,title);$('.cards').append(card);status.textContent=`已揭曉 ${revealed} / ${rewards.length}`;action.textContent='揭曉下一張 ✧';if(revealed===rewards.length){state='complete';action.hidden=true;$('[data-reset]').hidden=false;status.textContent='全部揭曉，收藏這一刻。';}}
  on($('[data-skip]'),'click',finishOpening);
  on($('[data-reset]'),'click',()=>{state='select';revealed=0;progress=0;rewards=[];stage.hidden=false;$('.selector').hidden=false;$('.results').hidden=true;$('.cards').replaceChildren();action.hidden=false;action.disabled=false;action.textContent=`選擇這${box?'個盲盒':'包卡片'} ↗`;status.textContent='左右拖曳挑選，也可以使用箭頭按鈕';});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let last=performance.now();
  function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(disposed)return;if(state==='opening'){progress+=dt/(reduced.matches?.05:1.8);if(progress>=1)finishOpening();}
    if(start===null)angle+=(target-angle)*(reduced.matches?1:Math.min(1,dt*8));
    ring.rotation.y=angle; // Rotate about the carousel center, keeping the chosen pack in front.
    ring.position.x=2.65*Math.sin(angle);ring.position.z=2.65*(Math.cos(angle)-1);
    items.forEach((item,i)=>{item.group.visible=state==='select'||i===selected;item.body.rotation.z=state==='select'&&!reduced.matches?Math.sin(now*.0008+i)*.025:0;const p=i===selected?Math.min(progress,1):0;item.lid.position.y=(box?.88:1.27)+p*2;item.lid.position.x=box?0:p*1.5;item.lid.rotation.z=p*(box?-.4:-1);item.body.rotation.y=state==='ready'&&box?.15:0;});
    if(renderer&&!document.hidden&&!stage.hidden)renderer.render(scene,camera);
  }
  let raf;function loop(now){frame(now);if(!disposed)raf=requestAnimationFrame(loop);}raf=requestAnimationFrame(loop);label();
  return {destroy(){disposed=true;cancelAnimationFrame(raf);events.abort();resize.disconnect();resources.forEach(r=>r.dispose());textures.forEach(t=>t.dispose());renderer?.dispose();root.replaceChildren();}};
}
