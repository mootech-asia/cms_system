// A fixed-camera atlas keeps the dust evolving instead of rotating a flat decal.
export function createRevealVortex(canvas, dialog, single, stage, source) {
  if (!canvas || !source) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const image = new Image(), reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let requested = false, ready = false, raf = 0, phase = 0, last = 0, visible = true;
  canvas.width = canvas.height = 480;
  function draw() {
    if (!ready) return;
    const frame = (phase / 200) % 16, index = Math.floor(frame), mix = frame-index;
    const cell = image.naturalWidth / 4;
    ctx.clearRect(0,0,480,480);
    for (const [i, alpha] of [[index,1-mix],[(index+1)%16,mix]]) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(image,(i%4)*cell,Math.floor(i/4)*cell,cell,cell,0,0,480,480);
    }
    ctx.globalAlpha = 1;
  }
  function load() {
    if (requested) return;
    requested = true;
    image.onload = () => { ready = true; canvas.dataset.ready = 'true'; resume(); };
    image.onerror = () => { canvas.hidden = true; };
    image.src = source;
  }
  function active() { return !dialog.hidden && !single.hidden && visible && !document.hidden; }
  function tick(now) {
    raf = 0;
    if (!active() || reduced.matches) return;
    if (now-last >= 1000/24) { phase += Math.min(now-last,100); last=now; draw(); }
    raf = requestAnimationFrame(tick);
  }
  function resume() {
    cancelAnimationFrame(raf); raf = 0;
    if (!active()) return;
    load(); if (!ready) return;
    if (reduced.matches) phase = 0;
    draw(); last = performance.now();
    if (!reduced.matches) raf = requestAnimationFrame(tick);
  }
  const mutations = new MutationObserver(resume);
  mutations.observe(dialog,{attributes:true,attributeFilter:['hidden']});
  mutations.observe(single,{attributes:true,attributeFilter:['hidden']});
  const intersection = new IntersectionObserver(entries => { visible=entries[0].isIntersecting; resume(); });
  intersection.observe(canvas);
  stage.addEventListener('pointerdown',load,{once:true,passive:true});
  stage.addEventListener('keydown',load,{once:true});
  document.addEventListener('visibilitychange',resume);
  reduced.addEventListener('change',resume);
}
