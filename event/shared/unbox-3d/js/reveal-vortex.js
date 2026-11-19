// Sample a continuous flow field over the original sand texture at 12 fps.
function createSandFlow(canvas, image) {
  const gl = canvas.getContext('webgl', { depth: false, antialias: false });
  if (!gl) return null;
  const program = gl.createProgram();
  const shaders = [
    [gl.VERTEX_SHADER, `attribute vec2 point; varying vec2 uv;
      void main() { uv = vec2(point.x, -point.y); gl_Position = vec4(point, 0., 1.); }`],
    [gl.FRAGMENT_SHADER, `precision highp float;
      uniform sampler2D sand;
      uniform float phase;
      varying vec2 uv;
      void main() {
        vec2 p = uv / .94;
        float radius = length(p);
        float angle = atan(p.y, p.x);
        float flow = angle - phase + .18 * sin(radius * 9. + phase) * sin(phase * .5) * sin(phase * .5);
        float ripple = radius + .028 * (sin(3. * angle - 2. * phase + radius * 10.)
                                     - sin(3. * angle + radius * 10.));
        vec2 sampleAt = .5 + .5 * ripple * vec2(cos(flow), sin(flow));
        vec4 color = texture2D(sand, sampleAt);
        gl_FragColor = color * (1. - smoothstep(.92, 1.02, ripple));
      }`]
  ];
  for (const [type, code] of shaders) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const vertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program, 'point');
  gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  const phase = gl.getUniformLocation(program, 'phase');
  return function draw(frame) {
    const size = Math.min(image.naturalWidth, Math.max(1, Math.ceil(canvas.clientWidth * devicePixelRatio)));
    if (canvas.width !== size) canvas.width = canvas.height = size;
    gl.viewport(0, 0, size, size);
    gl.uniform1f(phase, frame * Math.PI / 72);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}

export function createRevealVortex(canvas, dialog, single, stage, source) {
  if (!canvas || !source) return;
  const image = new Image();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const frameMs = 1000 / 12;
  let requested = false, visible = false, timer = 0, start = 0, draw;
  function active() {
    return !dialog.hidden && !single.hidden && visible && !document.hidden;
  }
  function tick() {
    if (!active() || reduced.matches || !draw) return;
    const elapsed = performance.now() - start;
    const frame = Math.floor(elapsed / frameMs);
    draw(frame % 144);
    canvas.dataset.frame = String(frame % 144);
    timer = setTimeout(tick, (frame + 1) * frameMs - elapsed);
  }
  function sync() {
    clearTimeout(timer);
    if (!active()) return;
    load();
    if (draw && !reduced.matches) {
      start = performance.now();
      tick();
    } else if (draw) {
      draw(0);
      canvas.dataset.frame = '0';
    }
  }
  function showPoster() {
    canvas.style.background = 'url("' + image.src + '") center / 94% 94% no-repeat';
  }
  function load() {
    if (requested) return;
    requested = true;
    image.onload = function () {
      draw = createSandFlow(canvas, image);
      if (!draw) showPoster();
      canvas.dataset.ready = 'true';
      sync();
    };
    image.src = source;
  }
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    clearTimeout(timer);
    draw = null;
    showPoster();
  });
  const mutations = new MutationObserver(sync);
  mutations.observe(dialog, {attributes:true, attributeFilter:['hidden']});
  mutations.observe(single, {attributes:true, attributeFilter:['hidden']});
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(canvas);
  stage.addEventListener('pointerdown', load, {once:true, passive:true});
  stage.addEventListener('keydown', load, {once:true});
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
}
