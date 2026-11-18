import { createDesertDepth } from './desert-depth.js?v=20261118-hover1';
export function createAtmosphere(stage, type, spriteUrl, starUrl, scenery = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'ev-atmosphere';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const desert = type === 'blind-box';
  const depth = desert ? createDesertDepth(stage, scenery.depthLayers) : null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1, height = 1, visible = true, raf = 0, last = 0, phase = 0;
  const particles = Array.from({ length: desert ? 240 : 170 }, (_, i) => ({
    x: ((i * 73 + 19) % 137) / 137,
    y: ((i * 47 + 31) % 131) / 131,
    size: 1 + (i % 5) * .5,
    speed: .045 + (i % 7) * .012,
    phase: i * 2.13
  }));
  const sprite = new Image();
  let spriteReady = false;
  sprite.onload = () => { spriteReady = true; if (visible && !document.hidden) draw(reduced.matches ? 0 : phase); };
  if (spriteUrl) sprite.src = spriteUrl;
  const star = new Image();
  let starReady = false;
  star.onload = () => { starReady = true; if (visible && !document.hidden) draw(phase); };
  if (starUrl) star.src = starUrl;
  const layers = {};
  ['flowers', 'palm', 'circle'].forEach(key => {
    if (!scenery[key]) return;
    const img = new Image(); img.onload = () => { layers[key] = img; if (visible && !document.hidden) draw(phase); }; img.src = scenery[key];
  });
  const petals = ['#e797bd', '#ffd5d9', '#f7ca98'].map(color => {
    const tile = document.createElement('canvas'); tile.width = tile.height = 48;
    const g = tile.getContext('2d'); g.translate(24,24);
    const fill = g.createLinearGradient(-20,-20,20,20);
    fill.addColorStop(0,'#ffe5d5'); fill.addColorStop(.45,color); fill.addColorStop(1,'#a84374');
    g.fillStyle=fill; g.beginPath(); g.moveTo(-20,0); g.bezierCurveTo(-12,-20,20,-12,20,0); g.bezierCurveTo(10,20,-10,14,-20,0); g.fill();
    g.strokeStyle='rgba(255,240,222,.45)';g.lineWidth=1;g.beginPath();g.moveTo(-14,0);g.quadraticCurveTo(0,-4,14,0);g.stroke();return tile;
  });
  const glowCache = new Map();
  function glow(x, y, radius, color) {
    const key = radius + color;
    let tile = glowCache.get(key);
    if (!tile) {
      tile = document.createElement('canvas');
      tile.width = tile.height = Math.ceil(radius * 2);
      const paint = tile.getContext('2d');
      const fill = paint.createRadialGradient(radius, radius, 0, radius, radius, radius);
      fill.addColorStop(0, color); fill.addColorStop(1, 'transparent');
      paint.fillStyle = fill; paint.fillRect(0, 0, tile.width, tile.height);
      glowCache.set(key, tile);
    }
    ctx.drawImage(tile, x - radius, y - radius);
  }
  function desertScene(t) {
    if (depth) depth.update(t);
    const scale = Math.max(width / 750, height / 1000);
    const ox = (width - 750 * scale) / 2, oy = height - 1000 * scale;
    const wind = Math.sin(t * .75) * .035 + Math.sin(t * 1.7) * .012;
    if (layers.flowers) {
      ctx.save(); ctx.translate(-35 * scale, oy + 248 * scale); ctx.rotate(wind);
      ctx.transform(1, 0, Math.sin(t * .75) * .035, 1, 0, 0);
      ctx.drawImage(layers.flowers, -16 * scale, -65 * scale, 225 * scale, 225 * scale); ctx.restore();
    }
    if (layers.palm) {
      ctx.save(); ctx.translate(-25 * scale, oy + 500 * scale); ctx.rotate(wind * 1.3);
      ctx.drawImage(layers.palm, -35 * scale, -115 * scale, 175 * scale, 140 * scale); ctx.restore();
    }
    // Keep dust near the ground; petal gusts cross the scene at several depths.
    if (spriteReady) {
      for (let layer = 0; layer < 2; layer++) {
        ctx.save();
        ctx.globalAlpha = layer ? .2 : .32;
        const w = width * (layer ? 1.7 : 1.3), h = w / 3;
        const x = -width * .2 + Math.sin(t * .5 + layer * 2) * width * .25;
        const y = height * (layer ? .64 : .54) + Math.sin(t * .8 + layer) * 12;
        ctx.drawImage(sprite, x, y, w, h);
        ctx.restore();
      }
    }
    const gustTime = t * 1.5 + Math.sin(t * .7) * .45;
    particles.forEach((p, i) => {
      const x = ((p.x + gustTime * p.speed * (i < 104 ? 1.3 : 1.8)) % 1.3 - .15) * width;
      if (i < 104) {
        const y = (.18 + (p.y + t * p.speed * .1) % .58) * height + Math.sin(t * 1.5 + p.phase) * (i < 28 ? 45 : 24);
        const size = i < 18 ? 7 + p.size * 1.8 : 2.4 + p.size * 1.3;
        const inFocus = x > width * .28 && x < width * .72 && y > height * .44 && y < height * .73;
        ctx.save();ctx.translate(x,y);ctx.rotate(p.phase+t*(i%2?1.7:-1.1));
        ctx.scale(1,.25+Math.abs(Math.cos(t*1.3+p.phase))*.75);
        ctx.globalAlpha = inFocus ? .38 : i < 18 ? .85 : .66;
        ctx.drawImage(petals[i%3],-size,-size,size*2,size*2);ctx.restore();
      } else {
        const y = (.48 + p.y * .25) * height + Math.sin(t + p.phase) * 12;
        ctx.fillStyle = `rgba(222,169,85,${.12 + (i % 3) * .07})`;
        ctx.beginPath(); ctx.arc(x,y,.35+p.size*.2,0,Math.PI*2);ctx.fill();
      }
    });
  }

  function cosmicScene(t) {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    // Match the ellipse in the 750×1000 background after center-bottom cover scaling.
    const scale = Math.max(width / 750, height / 1000);
    const cx = width / 2, cy = height - 340 * scale;
    if (layers.circle) {
      ctx.save(); ctx.translate(cx,cy); ctx.scale(1,.19);ctx.rotate(t*.055);
      ctx.globalAlpha = .68 + Math.sin(t*1.4)*.13;
      const diameter=730*scale;ctx.drawImage(layers.circle,-diameter/2,-diameter/2,diameter,diameter);ctx.restore();
    }
    if (spriteReady) {
      ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, 307 * scale, 48 * scale, 0, 0, Math.PI * 2); ctx.clip();
      for (let layer = 0; layer < 2; layer++) {
        ctx.save(); ctx.globalAlpha = layer ? .28 : .78;
        ctx.translate(cx, cy); ctx.scale(1, .22);
        ctx.rotate(t * (layer ? -.09 : .13));
        const diameter = (layer ? 420 : 630) * scale;
        ctx.drawImage(sprite, -diameter / 2, -diameter / 2, diameter, diameter);
        ctx.restore();
      }
      ctx.restore();
    }
    particles.forEach((p, i) => {
      const a = .22 + (Math.sin(t * (1 + i % 3 * .2) + p.phase) + 1) * .36;
      const x = p.x * width, y = (.12 + p.y * .64) * height;
      ctx.globalAlpha = a;
      if (i % 9 === 0 && starReady) {
        const size = 21 + p.size * 7;
        ctx.drawImage(star, x - size / 2, y - size / 2, size, size);
      } else {
        ctx.fillStyle = i % 2 ? '#c0ddff' : '#f0dbff'; ctx.beginPath(); ctx.arc(x, y, .3 + p.size * .23, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.restore();
  }
  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    if (desert) desertScene(t); else cosmicScene(t);
  }
  const resize = new ResizeObserver(() => {
    const rect = stage.getBoundingClientRect(); width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    glowCache.clear();
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); if (visible && !document.hidden) draw(phase);
  });
  resize.observe(stage);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume(); });
  observer.observe(stage);
  function frame(now) {
    raf = 0;
    if (document.hidden || !visible || reduced.matches) return;
    if (now - last >= 40) { phase += Math.min((now - last) / 1000, .08); last = now; draw(phase); }
    raf = requestAnimationFrame(frame);
  }
  function resume() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; last = performance.now();
    if (reduced.matches) { if (visible && !document.hidden) draw(0); return; }
    if (!document.hidden && visible) raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', resume); resume();
  return () => {
    cancelAnimationFrame(raf); resize.disconnect(); observer.disconnect();
    document.removeEventListener('visibilitychange', resume); reduced.removeEventListener('change', resume); canvas.remove(); if (depth) depth.destroy();
  };
}
