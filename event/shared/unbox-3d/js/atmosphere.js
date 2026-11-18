export function createAtmosphere(stage, type) {
  const canvas=document.createElement('canvas');canvas.className='ev-atmosphere';canvas.setAttribute('aria-hidden','true');stage.prepend(canvas);
  const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
  const desert=type==='blind-box', reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let width=1,height=1,visible=true,raf=0,last=0,phase=0;
  const particles=Array.from({length:desert?46:44},(_,i)=>({x:((i*73+19)%101)/101,y:((i*47+31)%97)/97,size:1+(i%4)*.45,speed:.015+(i%5)*.004,phase:i*2.13}));
  const resize=new ResizeObserver(()=>{const r=stage.getBoundingClientRect();width=r.width;height=r.height;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);draw(phase);});resize.observe(stage);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();});observer.observe(stage);
  function draw(t){
    ctx.clearRect(0,0,width,height);
    if(desert){
      // The lower layer follows the floor; petals cross the space above the chests.
      particles.forEach((p,i)=>{const x=((p.x+t*p.speed)%1.2-.1)*width;
        if(i<13){const y=(.2+(p.y+t*p.speed*.32)% .55)*height+Math.sin(t+p.phase)*10;ctx.save();ctx.translate(x,y);ctx.rotate(p.phase+t*.8);ctx.scale(1,Math.max(.3,Math.abs(Math.cos(t*.7+p.phase))));ctx.fillStyle=i%2?'rgba(244,145,169,.65)':'rgba(255,208,188,.62)';ctx.beginPath();ctx.moveTo(-5,0);ctx.bezierCurveTo(-3,-6,6,-4,6,0);ctx.bezierCurveTo(3,5,-2,5,-5,0);ctx.fill();ctx.restore();}
        else{const y=(.55+p.y*.37)*height+Math.sin(t*.7+p.phase)*7;ctx.strokeStyle='rgba(246,206,138,.22)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+15,y-4,x+25+p.size*3,y-2);ctx.stroke();}
      });
      for(let i=0;i<3;i++){const y=(.66+i*.09)*height+Math.sin(t*.3+i)*10;const g=ctx.createLinearGradient(0,0,width,0);g.addColorStop(0,'transparent');g.addColorStop(.5,'rgba(238,191,115,.11)');g.addColorStop(1,'transparent');ctx.strokeStyle=g;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-20,y);ctx.bezierCurveTo(width*.3,y-18,width*.6,y+15,width+20,y-9);ctx.stroke();}
    }else{
      particles.forEach(p=>{const a=.18+(Math.sin(t*1.4+p.phase)+1)*.3,x=p.x*width,y=(.18+p.y*.62)*height;ctx.fillStyle=`rgba(210,241,255,${a})`;ctx.beginPath();ctx.arc(x,y,p.size*.6,0,Math.PI*2);ctx.fill();if(p.size>2){ctx.strokeStyle=`rgba(209,234,255,${a*.7})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-p.size*2,y);ctx.lineTo(x+p.size*2,y);ctx.moveTo(x,y-p.size*2);ctx.lineTo(x,y+p.size*2);ctx.stroke();}});
      for(let v=0;v<2;v++){ctx.save();ctx.translate(width*(v?.78:.18),height*(v?.61:.39));ctx.scale(1,.46);ctx.rotate(t*(v?-.09:.08));for(let arm=0;arm<3;arm++){ctx.beginPath();for(let j=0;j<75;j++){const a=j*.065+arm*Math.PI*2/3,r=8+j*.9,x=Math.cos(a)*r,y=Math.sin(a)*r;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=v?'rgba(201,121,255,.14)':'rgba(119,227,255,.16)';ctx.lineWidth=2;ctx.stroke();}ctx.restore();}
    }
  }
  function frame(now){raf=0;if(document.hidden||!visible||reduced.matches)return;if(now-last>=40){phase+=Math.min((now-last)/1000,.08);last=now;draw(phase);}raf=requestAnimationFrame(frame);}
  function resume(){if(raf)cancelAnimationFrame(raf);raf=0;last=performance.now();if(reduced.matches){draw(0);return;}if(!document.hidden&&visible)raf=requestAnimationFrame(frame);}
  document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);resume();
  return ()=>{cancelAnimationFrame(raf);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);canvas.remove();};
}
