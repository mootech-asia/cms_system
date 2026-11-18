export function createAtmosphere(stage, type, spriteUrl, starUrl) {
  const canvas = document.createElement('canvas');
  canvas.className = 'ev-atmosphere';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const desert = type === 'blind-box';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1, height = 1, visible = true, raf = 0, last = 0, phase = 0;
  const particles = Array.from({ length: desert ? 126 : 170 }, (_, i) => ({
    x: ((i * 73 + 19) % 137) / 137,
    y: ((i * 47 + 31) % 131) / 131,
    size: 1 + (i % 5) * .5,
    speed: .045 + (i % 7) * .012,
    phase: i * 2.13
  }));
  const sprite = new Image();
  let spriteReady = false;
  sprite.onload = () => { spriteReady = true; draw(reduced.matches ? 0 : phase); };
  if (spriteUrl) sprite.src = spriteUrl;
  const star = new Image();
  let starReady = false;
  star.onload = () => { starReady = true; draw(phase); };
  if (starUrl) star.src = starUrl;
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
    // Low drifting dust follows the floor; larger petals occupy the near plane.
    if (spriteReady) {
      for (let layer = 0; layer < 2; layer++) {
        ctx.save();
        ctx.globalAlpha = layer ? .16 : .24;
        const w = width * (layer ? 1.7 : 1.3), h = w / 3;
        const x = -width * .2 + Math.sin(t * .5 + layer * 2) * width * .25;
        const y = height * (layer ? .64 : .54) + Math.sin(t * .8 + layer) * 12;
        ctx.drawImage(sprite, x, y, w, h);
        ctx.restore();
      }
    }
    particles.forEach((p, i) => {
      const x = ((p.x + t * p.speed * (i < 36 ? .75 : 1.8)) % 1.3 - .15) * width;
      if (i < 36) {
        const y = (.24 + (p.y + t * p.speed * .12) % .48) * height + Math.sin(t * 1.1 + p.phase) * 23;
        const size = 3.5 + p.size * 1.6;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.phase + t * 1.3);
        ctx.scale(1, .28 + Math.abs(Math.cos(t + p.phase)) * .72);
        const fill = ctx.createLinearGradient(-size, -size, size, size);
        fill.addColorStop(0, i % 3 ? '#ffdfdc' : '#fff2d0');
        fill.addColorStop(.55, i % 3 ? '#ee98bb' : '#f4ca9d');
        fill.addColorStop(1, i % 3 ? '#ad416e' : '#c87c68');
        ctx.globalAlpha = i < 12 ? .9 : .65;
        ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(-size, 0);
        ctx.bezierCurveTo(-size * .6, -size, size, -size * .6, size, 0);
        ctx.bezierCurveTo(size * .5, size, -size * .5, size * .7, -size, 0); ctx.fill();
        ctx.strokeStyle = 'rgba(255,240,222,.7)'; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(-size * .7, 0); ctx.quadraticCurveTo(0, -size * .2, size * .7, 0); ctx.stroke(); ctx.restore();
      } else {
        const y = (.36 + p.y * .4) * height + Math.sin(t + p.phase) * 14;
        ctx.fillStyle = `rgba(222,169,85,${.12 + (i % 3) * .07})`;
        ctx.beginPath(); ctx.arc(x, y, .35 + p.size * .2, 0, Math.PI * 2); ctx.fill();
      }
    });
  }
  function cosmicScene(t) {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    // Match the ellipse in the 750×1000 background after center-bottom cover scaling.
    const scale = Math.max(width / 750, height / 1000);
    const cx = width / 2, cy = height - 340 * scale;
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
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw(phase);
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
    if (reduced.matches) { draw(0); return; }
    if (!document.hidden && visible) raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', resume); resume();
  return () => {
    cancelAnimationFrame(raf); resize.disconnect(); observer.disconnect();
    document.removeEventListener('visibilitychange', resume); reduced.removeEventListener('change', resume); canvas.remove();
  };
}
