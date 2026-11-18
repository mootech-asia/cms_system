// Registered artwork layers share the same bottom-aligned projection as the stage.
export function createDesertDepth(stage, sources) {
  if (!sources || Object.values(sources).some(src => !src)) return null;
  const root = document.createElement('div');
  root.className = 'ev-depth-scene'; root.hidden = true;
  root.setAttribute('aria-hidden', 'true');
  const settings = [
    ['desert', 4.2, .39, 0, .35, .6],
    ['floor', .65, .28, 2.1, .05, .18],
    ['columns', 2.1, .53, 1.3, .08, .75],
    ['curtain', 1.15, .67, 3.4, .04, .42]
  ];
  let disposed = false;
  const layers = settings.map(([name, blur, speed, phase, min, range]) => {
    const layer = document.createElement('span'); layer.className = 'ev-depth-layer ev-depth-' + name;
    const soft = document.createElement('span'); soft.className = 'ev-depth-soft';
    const url = new URL(sources[name], document.baseURI).href;
    layer.style.backgroundImage = soft.style.backgroundImage = 'url(' + JSON.stringify(url) + ')';
    soft.style.filter = 'blur(' + blur + 'px)';
    layer.append(soft); root.append(layer);
    return { name, soft, speed, phase, min, range, url };
  });
  stage.prepend(root);
  Promise.all(layers.map(({url}) => new Promise((resolve, reject) => {
    const image = new Image(); image.onload = resolve; image.onerror = reject; image.src = url;
  }))).then(() => {
    if (disposed) return;
    root.hidden = false; stage.classList.add('has-depth-scene');
  }).catch(() => { root.remove(); });
  return {
    update(t) {
      layers.forEach(({soft, speed, phase, min, range}) => {
        const focus = .5 + .5 * Math.sin(t * speed + phase + Math.sin(t * .17) * .65);
        soft.style.opacity = String(min + range * focus);
      });
      stage.style.setProperty('--ev-depth-mist', String(.035 + (.5 + .5 * Math.sin(t * .48)) * .1));
    },
    destroy() { disposed = true; root.remove(); stage.classList.remove('has-depth-scene'); }
  };
}
