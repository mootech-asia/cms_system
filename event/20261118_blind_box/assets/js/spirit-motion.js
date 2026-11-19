// Native-resolution mesh animation; each pose is rendered from the original texture.
function createSpiritRig(canvas, source) {
  const gl = canvas.getContext('webgl', {alpha:true, premultipliedAlpha:true, antialias:true});
  if (!gl) throw new Error('WebGL unavailable');
  const vs = `attribute vec2 point; varying vec2 uv; uniform float phase; uniform float mood;
  float gate(float a,float b,float v){return smoothstep(a,b,v);}
  vec2 turn(vec2 p,vec2 pivot,float a){float c=cos(a),s=sin(a);p-=pivot;return pivot+mat2(c,s,-s,c)*p;}
  float featureMask(vec2 local, vec2 inner, vec2 outer) {
    vec2 d = abs(local);
    return (1. - smoothstep(inner.x, outer.x, d.x))
         * (1. - smoothstep(inner.y, outer.y, d.y));
  }
  float eyeShape(vec2 point, vec2 center, float width, float amount) {
    vec2 eye = point - center;
    eye.y += .31 * eye.x;
    return eye.y * amount * featureMask(eye, vec2(width - 6., 8.), vec2(width, 20.));
  }
  void main(){
    uv=(point+vec2(161.,450.))/vec2(1500.,1875.); vec2 p=point;
    float time = phase / 6.2831853;
    float wave = sin(phase);
    float breath = (1. - cos(phase)) * .5;
    float gesture = smoothstep(.02, .27, time) * (1. - smoothstep(.61, .98, time));
    float torso = gate(260., 370., point.y) * (1. - gate(560., 670., point.y));
    float core = gate(330., 475., point.x) * (1. - gate(755., 885., point.x));
    float head = (1. - gate(265., 335., point.y)) * gate(350., 430., point.x)
                 * (1. - gate(755., 825., point.x));
    float armBand = gate(270., 369., point.y) * (1. - gate(626., 696., point.y));
    float left = (1. - gate(390., 505., point.x)) * armBand;
    float right = gate(738., 860., point.x) * armBand;
    float leftLift = .045 * wave;
    float rightLift = -.045 * wave;
    float nod = .023 * wave;
    vec2 shift = vec2(5. * wave, -13. * breath);
    float smokeTravel = 27.;
    float blink = smoothstep(.49, .56, time) * (1. - smoothstep(.56, .63, time));
    float leftEye = -.93 * blink;
    float rightEye = leftEye;
    float browLift = 1.5 * breath;
    float mouthOpen = -.16 * breath;
    float smileWidth = 0.;
    float smileCorner = 0.;

    if (mood > 2.5) {
      // Lean toward the chest and draw both hands inward.
      leftLift = -.29 * gesture;
      rightLift = .28 * gesture;
      p.x += (625. - point.x) * .19 * gesture * max(left, right);
      nod = .20 * gesture;
      shift = vec2(32., 33.) * gesture;
      smokeTravel = 37.;
      leftEye = .35 * gesture;
      rightEye = .33 * gesture;
      browLift = 7.5 * gesture;
      mouthOpen = -.62 * gesture;
      smileWidth = -.08 * gesture;
    } else if (mood > 1.5) {
      // Tilt the head and beckon twice with one hand.
      leftLift = -.17 * gesture;
      rightLift = (-.49 + .16 * sin(phase * 3.)) * gesture;
      nod = (-.17 + .045 * sin(phase * 2.)) * gesture;
      shift = vec2(-39., 13.) * gesture;
      smokeTravel = 36.;
      float wink = smoothstep(.20, .32, time) * (1. - smoothstep(.49, .60, time));
      leftEye = -.93 * wink;
      rightEye = -.13 * gesture;
      browLift = 3. * gesture;
      mouthOpen = -.42 * gesture;
      smileCorner = 5. * gesture;
    } else if (mood > .5) {
      // Raise both hands, with a second upward bounce before landing.
      float bounce = gesture * (.8 + .2 * cos(phase * 2.));
      leftLift = .52 * bounce;
      rightLift = -.55 * bounce;
      nod = -.11 * bounce;
      shift = vec2(2., -43.) * bounce;
      smokeTravel = 49.;
      leftEye = -.37 * bounce;
      rightEye = -.35 * bounce;
      browLift = 4. * bounce;
      mouthOpen = .30 * bounce;
      smileWidth = .18 * bounce;
    }

    p.x += (point.x - 625.) * .022 * breath * torso * core;
    p = mix(p, turn(p, vec2(445., 355.), leftLift), left);
    p = mix(p, turn(p, vec2(785., 355.), rightLift), right);
    // Apply face deformation in the original portrait coordinates before the head turn.
    // Keep the eyelid contours anchored while both irises follow the same target.
    vec2 gaze = vec2(-7., 2.);
    if (mood > 2.5) gaze += vec2(1., 5.) * gesture;
    float nearIris = featureMask(point - vec2(573., 132.), vec2(8., 6.), vec2(19., 12.));
    float farIris = featureMask(point - vec2(622., 117.), vec2(6., 5.), vec2(11., 10.));
    p += gaze * nearIris * (1. + min(0., leftEye));
    p += gaze * .65 * farIris * (1. + min(0., rightEye));
    p.y += eyeShape(point, vec2(571., 132.), 25., leftEye)
         + eyeShape(point, vec2(622., 117.), 18., rightEye);
    vec2 leftBrow = point - vec2(559., 111.);
    leftBrow.y += .45 * leftBrow.x;
    vec2 rightBrow = point - vec2(615., 91.);
    rightBrow.y += .28 * rightBrow.x;
    p.y -= browLift * max(featureMask(leftBrow, vec2(18., 5.), vec2(28., 16.)),
                          featureMask(rightBrow, vec2(12., 5.), vec2(20., 14.)));
    vec2 lip = point - vec2(615., 175.);
    lip.y += .27 * lip.x;
    float lipMask = featureMask(lip, vec2(24., 14.), vec2(36., 30.));
    p.x += lip.x * lipMask * smileWidth;
    p.y += lipMask * (lip.y * mouthOpen - smileCorner * smoothstep(6., 25., lip.x));
    p = mix(p, turn(p, vec2(625., 305.), nod), head);
    p += shift * (1. - gate(571., 782., point.y));
    float smoke = gate(599., 710., point.y) * (1. - gate(990., 1104., point.y));
    p.x += smoke * smokeTravel * (sin(phase + point.y * .006) - sin(point.y * .006));
    p.y += smoke * 12. * (cos(phase + point.x * .004) - cos(point.x * .004));
    vec2 outp=(p+vec2(161.,450.))/vec2(1500.,1875.);
    gl_Position=vec4(outp.x*2.-1.,1.-outp.y*2.,0.,1.);
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
  const columns = gridAxis(523, 675);
  const rows = gridAxis(70, 218);
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
