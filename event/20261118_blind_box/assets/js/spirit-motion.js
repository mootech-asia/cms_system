// Native-resolution mesh animation; each pose is rendered from the original texture.
function createSpiritRig(canvas, source) {
  const gl = canvas.getContext('webgl', {alpha:true, premultipliedAlpha:true, antialias:true});
  if (!gl) throw new Error('WebGL unavailable');
  const vs = `attribute vec2 point;
uniform float phase;
uniform float mood;
const vec2 leftShoulder = vec2(458., 355.);
const vec2 rightShoulder = vec2(794., 355.);
const vec2 leftEye = vec2(597., 162.);
const vec2 rightEye = vec2(659., 162.);
const vec2 leftBrow = vec2(596., 140.);
const vec2 rightBrow = vec2(661., 140.);
const vec2 mouth = vec2(628., 215.);
const float waist = 651.;
const float smokeEnd = 1049.;
varying vec2 uv;

float mask(vec2 p, vec2 center, vec2 core, vec2 spread) {
  vec2 d = abs(p - center);
  return (1. - smoothstep(core.x, spread.x, d.x)) *
         (1. - smoothstep(core.y, spread.y, d.y));
}
vec2 turn(vec2 p, vec2 pivot, float angle) {
  float c = cos(angle), s = sin(angle);
  return pivot + mat2(c, s, -s, c) * (p - pivot);
}

void main() {
  uv = (point + vec2(161.,450.)) / vec2(1500.,1875.);
  vec2 p = point;
  float excited = step(2.5, mood);
  float celebration = step(.5, mood) * (1. - step(1.5, mood));
  float encourage = step(1.5, mood) * (1. - step(2.5, mood));
  float time = phase / 6.283185307;
  float breath = .5 - .5 * cos(phase);
  float ready = excited * smoothstep(.02, .25, time) * (1. - smoothstep(.71, .98, time));
  float gesture = smoothstep(.02, .24, time) * (1. - smoothstep(.69, .98, time));
  float cheer = celebration * gesture * (.8 + .2 * cos(phase * 2.));
  float waveHand = encourage * gesture * (.36 + .12 * sin(phase * 3.));
  float arms = smoothstep(leftShoulder.y - 65., leftShoulder.y + 50., point.y)
    * (1. - smoothstep(waist + 25., waist + 100., point.y));
  float left = (1. - smoothstep(leftShoulder.x - 50., leftShoulder.x + 53., point.x)) * arms;
  float right = smoothstep(rightShoulder.x - 53., rightShoulder.x + 50., point.x) * arms;
  float upper = 1. - smoothstep(waist - 65., waist + 125., point.y);
  float center = (leftShoulder.x + rightShoulder.x) * .5;
  float chest = smoothstep(leftShoulder.y - 75., leftShoulder.y + 35., point.y) * upper;
  float sway = sin(phase) * (1. - excited);
  p.x += (point.x - center) * chest * (.022 * breath + .037 * ready);
  p.y -= upper * (11. * breath + 12. * ready + 37. * cheer);
  p.x += upper * 8. * sway;
  p = mix(p, turn(p, leftShoulder, .034 * sway - .23 * ready + .46 * cheer), left);
  p = mix(p, turn(p, rightShoulder, .034 * sway + .23 * ready - .46 * cheer - waveHand), right);
  p.x += (center - point.x) * .12 * ready * max(left, right);
  p.y += 10. * ready * max(left, right);

  float head = 1. - smoothstep(240., 302., point.y);
  vec2 faceCenter = (leftEye + rightEye) * .5;
  p += (point - faceCenter) * (.042 * ready) * head;
  float blink = smoothstep(.47, .53, time) * (1. - smoothstep(.53, .59, time));
  blink *= 1. - excited;
  float eyeOpen = .28 * ready - .92 * blink;
  float wink = encourage * smoothstep(.2, .34, time) * (1. - smoothstep(.49, .63, time));
  // Center the lid movements on each iris to retain eye contact.
  p.y += (point.y - leftEye.y) * (eyeOpen - .92 * wink - .24 * cheer) * mask(point,leftEye,vec2(11.,7.),vec2(24.,18.));
  p.y += (point.y - rightEye.y) * (eyeOpen - .25 * cheer) * mask(point,rightEye,vec2(11.,7.),vec2(24.,18.));
  p.y -= (7.5 * ready + 1.7 * breath + 5. * cheer) * max(
    mask(point,leftBrow,vec2(15.,4.),vec2(29.,13.)),
    mask(point,rightBrow,vec2(15.,4.),vec2(29.,13.))
  );
  float lip = mask(point,mouth,vec2(32.,12.),vec2(51.,31.));
  p.x += (point.x - mouth.x) * (.14 * ready + .12 * cheer) * lip;
  p.y += (point.y - mouth.y) * (.28 * ready - .10 * breath + .42 * cheer - .16 * encourage * gesture) * lip;
  float hum = smoothstep(waist + 10., waist + 100., point.y) *
    (1. - smoothstep(smokeEnd - 145., smokeEnd, point.y));
  float strand = point.y * .012;
  p.x += hum * (17. + 18. * ready + 30. * cheer) * (sin(strand + phase) - sin(strand));
  p.y += hum * 10. * (cos(strand + phase) - cos(strand));
  vec2 outp = (p + vec2(161., 450.)) / vec2(1500., 1875.);
  gl_Position = vec4(outp.x * 2. - 1., 1. - outp.y * 2., 0., 1.);
}`;
  const fs=`precision mediump float; varying vec2 uv; uniform sampler2D art;
  void main(){vec4 c=texture2D(art,uv);gl_FragColor=c;}`;
  function compile(type, code) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  const program = gl.createProgram();
  for (const shader of [compile(gl.VERTEX_SHADER, vs), compile(gl.FRAGMENT_SHADER, fs)]) {
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  // Use smaller triangles around the eyes and lips without increasing the whole mesh density.
  function gridAxis(faceStart, faceEnd) {
    const marks = [];
    for (let v = 0; v < faceStart; v += 14) marks.push(v);
    for (let v = faceStart; v < faceEnd; v += 3) marks.push(v);
    for (let v = faceEnd; v < 1254; v += 14) marks.push(v);
    marks.push(1254);
    return marks;
  }
  const columns = gridAxis(552, 707);
  const rows = gridAxis(123, 248);
  const stride = columns.length;
  const vertices = [];
  const indices = [];
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < stride; x++) {
      vertices.push(columns[x], rows[y]);
      if (x === stride - 1 || y === rows.length - 1) continue;
      const i = y * stride + x;
      indices.push(i, i + 1, i + stride, i + 1, i + stride + 1, i + stride);
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program, 'point');
  gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

  const phase = gl.getUniformLocation(program, 'phase');
  const mood = gl.getUniformLocation(program, 'mood');
  const poses = {idle: 0, celebrate: 1, encourage: 2, anticipate: 3};
  return function draw(frame, pose) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(phase, (frame % 24) * Math.PI * 2 / 23);
    gl.uniform1f(mood, poses[pose]);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  };
}

export async function mountSpiritMotion(image) {
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.className = image.className;
  canvas.setAttribute('aria-hidden', 'true');
  const draw = createSpiritRig(canvas, image);
  let pose = 'idle', started = 0, timer = 0;
  const frameMs = 1000 / 12;

  function tick() {
    const now = performance.now();
    const frame = Math.floor((now - started) / frameMs);
    const width = Math.min(1500, Math.max(576, Math.ceil(image.clientWidth * devicePixelRatio)));
    if (width !== canvas.width) {
      canvas.width = width;
      canvas.height = Math.round(width * 1.25);
    }
    draw(frame, pose);
    canvas.dataset.frame = String(frame % 24);
    timer = setTimeout(tick, started + (frame + 1) * frameMs - now);
  }

  function sync() {
    clearTimeout(timer);
    const state = image.dataset.state;
    pose = state === 'lose' ? 'encourage' : state || 'idle';
    canvas.dataset.pose = pose;
    const playing = image.dataset.motion === 'playing';
    image.style.visibility = playing ? 'hidden' : '';
    canvas.hidden = !playing;
    if (playing) {
      started = performance.now();
      tick();
    }
  }

  const observer = new MutationObserver(sync);
  observer.observe(image, {attributes:true, attributeFilter:['data-state','data-motion']});
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    observer.disconnect();
    clearTimeout(timer);
    canvas.remove();
    image.style.visibility = '';
  });
  image.after(canvas);
  sync();
}
