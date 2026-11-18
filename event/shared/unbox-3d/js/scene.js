/*
 * 3D 選擇區：六個包裝排成環形，可拖曳或用箭頭切換；選定後播放撕封條／開蓋動畫。
 * 包裝表面全部是圖片槽（config.images），側面色與燈光色讀 theme.css 的 --ev-3d-* 色票，
 * 換主題只要換圖或換色票，不用改程式。WebGL 無法啟動時回傳 null，由 app.js 改用 2D 圖片。
 */
import * as THREE from '../vendor/three.min.js?v=20261118d';

var STEP = Math.PI / 3;
var RADIUS = 2.65;
var COUNT = 6;

function token(name, fallback) {
  var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// 接地陰影由程式畫（素材不畫地面陰影），顏色取 --ev-3d-shadow。
function shadowTexture() {
  var c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  var g = c.getContext('2d');
  var grad = g.createRadialGradient(128, 64, 4, 128, 64, 124);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.setTransform(1, 0, 0, 0.5, 0, 32);
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export function createScene(stage, opts) {
  var box = opts.type === 'blind-box';
  // 先用測試畫布確認有 WebGL，避免 Three.js 建立失敗時在 console 印錯誤
  // 失敗原因寫在 console.info，回報「3D 無法啟用」時用來判斷是瀏覽器不支援 WebGL2、完全沒有 WebGL 還是建立時出錯
  var probe = document.createElement('canvas');
  var gl2 = !!(window.WebGL2RenderingContext && probe.getContext('webgl2'));
  if (!gl2) {
    var gl1 = !!(window.WebGLRenderingContext && document.createElement('canvas').getContext('webgl'));
    console.info('[unbox-3d] 2D fallback: ' + (gl1 ? 'WebGL2 unavailable (WebGL1 only)' : 'WebGL unavailable'));
    return null;
  }
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    console.info('[unbox-3d] 2D fallback: renderer failed: ' + (e && e.message));
    return null;
  }

  var disposables = [];
  var keep = function (x) { disposables.push(x); return x; };
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 2.3, 7.6);
  camera.lookAt(0, 0.3, 0);

  var hemi = new THREE.HemisphereLight(0xffffff, 0x8589af, 2);
  var key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(-3, 6, 5);
  var accent = new THREE.PointLight(0xd4aaff, 35);
  accent.position.set(4, 2, 1);
  scene.add(hemi, key, accent);

  // world：整個環形（含吉祥物遮擋面）一起縮放，config.sceneScale 調整包裝在畫面上的大小
  var world = new THREE.Group();
  world.scale.setScalar(opts.scale || 1);
  scene.add(world);
  var ring = new THREE.Group();
  world.add(ring);

  // 同一張圖只載一次；全部載完（成功或失敗）時 ready 才 resolve，給 loading 畫面計算進度。
  var loader = new THREE.TextureLoader();
  var cache = {};
  var pending = [];
  function texture(src, onLoad) {
    if (!src) return;
    if (!cache[src]) {
      cache[src] = { tex: null, cbs: [] };
      pending.push(new Promise(function (done) {
        loader.load(src, function (tex) {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          keep(tex);
          cache[src].tex = tex;
          cache[src].cbs.splice(0).forEach(function (cb) { cb(tex); });
          done(true);
        }, undefined, function () { done(false); });
      }));
    }
    if (cache[src].tex) onLoad(cache[src].tex);
    else cache[src].cbs.push(onLoad);
  }
  function mapped(material, src) {
    texture(src, function (tex) { material.map = tex; material.needsUpdate = true; });
    return material;
  }

  var surface = opts.material || {};
  function art(src) {
    return mapped(keep(new THREE.MeshStandardMaterial({
      color: 0xffffff, metalness: surface.metalness != null ? surface.metalness : 0.2, roughness: surface.roughness != null ? surface.roughness : 0.35
    })), src);
  }
  function geo(w, h, d) { return keep(new THREE.BoxGeometry(w, h, d)); }

  var images = opts.images;
  var fronts = [].concat(images.front).filter(Boolean);
  var shadowTex = keep(shadowTexture());
  var shadowGeo = keep(new THREE.PlaneGeometry(box ? 2.6 : 2.2, box ? 1.3 : 0.9));
  var tinted = [];
  var items = [];
  // 尺寸對應設計稿比例：卡包正面 2:3（512×768）、盲盒正立方（512×512），封條 512×64、盒蓋側邊 512×80
  // 寶箱（opts.shape === 'chest'）：箱身 1.6×1.0×1.1（正面 chest-front 512×320），半圓拱蓋沿寬度方向，
  // 蓋子以後上緣為軸掀開；拱面貼 chest-lid（512×512，由前緣繞到後緣），兩端半圓貼 chest-lid-end。
  var chest = box && opts.shape === 'chest';
  var CW = 1.6, CH = 1.0, CD = 1.1;
  var LID_Y = chest ? CH / 2 : box ? 0.895 : 1.2;
  var FLOOR_Y = chest ? -0.75 : box ? -1.05 : -1.45;

  // 半圓拱蓋：圓柱 θ 0～π（旋轉後在上方）。貼圖座標改寫成設計稿好畫的方向——
  // 拱面 chest-lid：u 沿箱子寬度（左→右）、v 由前緣（下緣 0）繞到後緣（上緣 1）；
  // 兩端 chest-lid-end（512×256）：半圓平邊在下緣、圓頂在上緣，兩端共用同一張圖。
  var lidGeo = null;
  function chestLidGeometry() {
    if (lidGeo) return lidGeo;
    var r = CD / 2;
    lidGeo = keep(new THREE.CylinderGeometry(r, r, CW, 32, 1, false, 0, Math.PI));
    var pos = lidGeo.attributes.position, nor = lidGeo.attributes.normal, uv = lidGeo.attributes.uv;
    for (var v = 0; v < pos.count; v++) {
      var x = pos.getX(v), y = pos.getY(v), z = pos.getZ(v), ny = nor.getY(v);
      if (Math.abs(ny) > 0.99) {
        var u = (z / r + 1) / 2;
        uv.setXY(v, ny > 0 ? 1 - u : u, Math.max(0, x / r));
      } else {
        uv.setXY(v, 0.5 - y / CW, Math.atan2(Math.max(0, x), z) / Math.PI);
      }
    }
    uv.needsUpdate = true;
    return lidGeo;
  }

  for (var i = 0; i < COUNT; i++) {
    var group = new THREE.Group();
    var body = new THREE.Group();
    group.add(body);
    // 側面貼圖乘上該位置的色票，讓六個包裝顏色不同；正面圖保留原色
    var side = mapped(keep(new THREE.MeshStandardMaterial({ metalness: 0.48, roughness: 0.3 })), images.side);
    tinted.push(side);
    var base, lid, pivot = null;
    if (chest) {
      var cFront = art(images.front && fronts[i % fronts.length]);
      base = new THREE.Mesh(geo(CW, CH, CD), [side, side, side, side, cFront, side]);
      var arc = chestLidGeometry();
      var lidTopC = art(images.lid);
      var lidEnd = art(images.lidSide);
      lid = new THREE.Mesh(arc, [lidTopC, lidEnd, lidEnd]);
      lid.rotation.z = Math.PI / 2;
      // 轉軸在箱身後上緣，蓋子中心距軸 CD/2
      pivot = new THREE.Group();
      pivot.position.set(0, CH / 2, -CD / 2);
      lid.position.set(0, 0, CD / 2);
      pivot.add(lid);
    } else if (box) {
      var front = art(images.front && fronts[i % fronts.length]);
      base = new THREE.Mesh(geo(1.55, 1.55, 1.55), [side, side, side, side, front, side]);
      var lidTop = art(images.lid);
      var lidSide = mapped(keep(new THREE.MeshStandardMaterial({ metalness: 0.48, roughness: 0.3 })), images.lidSide);
      tinted.push(lidSide);
      lid = new THREE.Mesh(geo(1.65, 0.24, 1.65), [lidSide, lidSide, lidTop, lidSide, lidSide, lidSide]);
    } else {
      var face = art(fronts[i % fronts.length]);
      var back = art(images.back);
      base = new THREE.Mesh(geo(1.48, 2.22, 0.065), [side, side, side, side, face, back]);
      var crimp = art(images.crimp);
      lid = new THREE.Mesh(geo(1.48, 0.18, 0.07), [side, side, side, side, crimp, crimp]);
      var bottom = new THREE.Mesh(geo(1.48, 0.18, 0.07), [side, side, side, side, crimp, crimp]);
      bottom.position.y = -LID_Y;
      body.add(bottom);
    }
    if (pivot) body.add(base, pivot);
    else {
      lid.position.y = LID_Y;
      body.add(base, lid);
    }

    var shadowMat = keep(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.35 }));
    var shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = FLOOR_Y;
    group.add(shadow);

    var a = i * STEP;
    group.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS - RADIUS);
    group.rotation.y = a;
    ring.add(group);
    items.push({ group: group, body: body, lid: lid, pivot: pivot, shadow: shadowMat });
  }

  // 吉祥物站在環形圓心（世界座標 0, 地板, -RADIUS）。角色本身是 <img>（動態 WebP），放在透明畫布後層；
  // 這裡在圓心放一片只寫深度、不畫顏色的剪影面（用 poster 的透明度裁切），轉到後排的包裝會被它擋住，
  // 前排包裝照常畫在角色前面。剪影固定用 poster，動作幅度大的手腳邊緣可能有少許誤差。
  var mascotPlane = null;
  var mascotImg = opts.mascot && opts.mascot.img;
  if (mascotImg && opts.mascot.poster) {
    var MH = opts.mascot.height || 3.2;
    var mGeo = keep(new THREE.PlaneGeometry(MH * 0.8, MH));
    var mMat = keep(new THREE.MeshBasicMaterial({ transparent: false, alphaTest: 0.5, colorWrite: false }));
    texture(opts.mascot.poster, function (tex) { mMat.map = tex; mMat.needsUpdate = true; });
    mascotPlane = new THREE.Mesh(mGeo, mMat);
    // 素材腳底在畫布下緣上方 12/500
    mascotPlane.position.set(0, FLOOR_Y + MH / 2 - MH * 0.024, -RADIUS);
    world.add(mascotPlane);
  }
  function placeMascot() {
    if (!mascotPlane) return;
    scene.updateMatrixWorld(true);
    var w = mGeo.parameters.width / 2, h = mGeo.parameters.height / 2;
    var pts = [[-w, -h], [w, -h], [-w, h], [w, h]].map(function (c) {
      var v = new THREE.Vector3(c[0], c[1], 0);
      mascotPlane.localToWorld(v);
      return v.project(camera);
    });
    var r = stage.getBoundingClientRect();
    var xs = pts.map(function (v) { return (v.x + 1) / 2 * r.width; });
    var ys = pts.map(function (v) { return (1 - v.y) / 2 * r.height; });
    var left = Math.min.apply(null, xs), top = Math.min.apply(null, ys);
    mascotImg.style.left = left + 'px';
    mascotImg.style.top = top + 'px';
    mascotImg.style.width = (Math.max.apply(null, xs) - left) + 'px';
    mascotImg.style.height = (Math.max.apply(null, ys) - top) + 'px';
  }

  function applyTokens() {
    tinted.forEach(function (m, k) {
      var slot = box && !chest ? Math.floor(k / 2) : k;
      m.color.set(token('--ev-3d-item-' + (slot % COUNT + 1), '#b8b4f3'));
    });
    accent.color.set(token('--ev-3d-accent', '#d4aaff'));
    hemi.groundColor.set(token('--ev-3d-ground', '#8589af'));
    var shadowColor = token('--ev-3d-shadow', '#27364a');
    items.forEach(function (it) { it.shadow.color.set(shadowColor); });
  }
  applyTokens();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  stage.prepend(renderer.domElement);
  var resize = new ResizeObserver(function () {
    var r = stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    placeMascot();
  });
  resize.observe(stage);

  var mode = 'select';
  var selected = 0;
  var angle = 0;
  var target = 0;
  var startX = null;
  var drag = 0;
  var progress = 0;
  var openMs = 1800;
  var openDone = null;
  var abort = new AbortController();
  var on = function (el, name, fn) { el.addEventListener(name, fn, { signal: abort.signal }); };

  function move(n) {
    if (mode !== 'select') return;
    target += n * STEP;
    selected = ((Math.round(-target / STEP) % COUNT) + COUNT) % COUNT;
    if (opts.onSelect) opts.onSelect(selected);
  }

  // 點選：用射線找出指到的是哪一包（看得見的包裝才算），回傳索引；沒點到回傳 -1
  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  function pick(clientX, clientY) {
    var r = renderer.domElement.getBoundingClientRect();
    pointer.set((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    var hit = raycaster.intersectObjects(items.filter(function (it) { return it.group.visible; }).map(function (it) { return it.body; }), true)[0];
    if (!hit) return -1;
    for (var k = 0; k < items.length; k++) {
      var o = hit.object;
      while (o && o !== items[k].body) o = o.parent;
      if (o) return k;
    }
    return -1;
  }
  // 轉到指定的那一包（走最短方向）
  function goTo(i) {
    var k = ((i - selected) % COUNT + COUNT) % COUNT;
    if (k > COUNT / 2) k -= COUNT;
    if (k) move(-k);
    return k !== 0;
  }

  on(stage, 'pointerdown', function (e) {
    if (mode !== 'select' && mode !== 'ready') return;
    if (e.target !== renderer.domElement) return;
    startX = e.clientX;
    drag = 0;
    stage.setPointerCapture(e.pointerId);
  });
  on(stage, 'pointermove', function (e) {
    if (startX === null) {
      // 滑鼠移到包裝上顯示手指游標，表示可以點選
      if (e.pointerType === 'mouse' && mode === 'select' && e.target === renderer.domElement) {
        renderer.domElement.style.cursor = pick(e.clientX, e.clientY) >= 0 ? 'pointer' : '';
      }
      return;
    }
    drag = e.clientX - startX;
    if (mode === 'select') angle = target + drag * 0.004;
  });
  on(stage, 'pointerup', function (e) {
    if (startX === null) return;
    if (mode === 'select' && Math.abs(drag) > 25) move(drag > 0 ? 1 : -1);
    else if (mode === 'ready' && Math.abs(drag) > 55 && opts.onSwipeOpen) opts.onSwipeOpen();
    else if (mode === 'select' && Math.abs(drag) < 8 && opts.onPick) {
      // 沒有拖曳＝點選：點到哪一包就選哪一包
      var i = pick(e.clientX, e.clientY);
      if (i >= 0) opts.onPick(i);
    }
    startX = null;
  });
  on(stage, 'pointercancel', function () { startX = null; });
  on(document, 'ev:skin', applyTokens);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var last = performance.now();
  var raf = 0;
  var disposed = false;

  function finishOpen() {
    progress = 1;
    mode = 'opened';
    var cb = openDone;
    openDone = null;
    if (cb) cb();
  }

  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (mode === 'opening') {
      progress += dt / ((reduced.matches ? 300 : openMs) / 1000);
      if (progress >= 1) finishOpen();
    }
    if (startX === null || mode !== 'select') angle += (target - angle) * (reduced.matches ? 1 : Math.min(1, dt * 8));
    ring.rotation.y = angle;
    ring.position.x = RADIUS * Math.sin(angle);
    ring.position.z = RADIUS * (Math.cos(angle) - 1);
    items.forEach(function (it, k) {
      var mine = k === selected;
      it.group.visible = mode === 'select' || mine;
      var p = mine ? Math.min(progress, 1) : 0;
      // 前 20%：包裝抖動蓄力；之後封條／盒蓋飛出
      var shake = mine && mode === 'opening' && p < 0.2 && !reduced.matches ? Math.sin(now * 0.08) * 0.04 : 0;
      var fly = Math.max(0, (p - 0.2) / 0.8);
      var ease = 1 - Math.pow(1 - fly, 3);
      it.body.rotation.z = (mode === 'select' && !reduced.matches ? Math.sin(now * 0.0008 + k) * 0.025 : 0) + shake;
      it.body.rotation.y = mode !== 'select' && box && mine ? 0.15 : 0;
      if (it.pivot) {
        it.pivot.rotation.x = -ease * 1.7;
      } else {
        it.lid.position.y = LID_Y + ease * 2;
        it.lid.position.x = box ? 0 : ease * 1.5;
        it.lid.rotation.z = ease * (box ? -0.4 : -1);
      }
    });
    if (!document.hidden && stage.offsetParent !== null) renderer.render(scene, camera);
    if (!disposed) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    ready: Promise.all(pending),
    selected: function () { return selected; },
    move: move,
    goTo: goTo,
    setMode: function (m) {
      mode = m;
      if (m === 'select') { progress = 0; openDone = null; }
    },
    open: function (ms) {
      openMs = ms || openMs;
      mode = 'opening';
      progress = 0;
      return new Promise(function (done) { openDone = done; });
    },
    skip: function () { if (mode === 'opening') finishOpen(); },
    destroy: function () {
      disposed = true;
      cancelAnimationFrame(raf);
      abort.abort();
      resize.disconnect();
      disposables.forEach(function (d) { d.dispose(); });
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}
