/*
 * 3D 選擇區：可配置數量的包裝排成環形，可拖曳或用箭頭切換；選定後播放撕封條／開蓋動畫。
 * 包裝表面全部是圖片槽（config.images），側面色與燈光色讀 theme.css 的 --ev-3d-* 色票，
 * 換主題只要換圖或換色票，不用改程式。WebGL 無法啟動時回傳 null，由 app.js 改用 2D 圖片。
 */
import * as THREE from '../vendor/three.min.js?v=20261118-vortex1';



function token(name, fallback) {
  var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// 接地陰影由程式畫（素材不畫地面陰影），顏色取 --ev-3d-shadow。
function shadowTexture(grounded) {
  var c = document.createElement('canvas');
  c.width = 256;
  c.height = grounded ? 256 : 128;
  var g = c.getContext('2d');
  if (grounded) {
    var contact = g.createRadialGradient(128, 128, 22, 128, 128, 128);
    contact.addColorStop(0, 'rgba(255,255,255,1)');
    contact.addColorStop(0.52, 'rgba(255,255,255,0.85)');
    contact.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = contact;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
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
  var chest = box && opts.shape === 'chest';
  var capacity = Math.max(6, Math.min(40, Number(opts.capacity || opts.count) || 6));
  var COUNT = opts.capacity ? Math.max(1, Math.min(capacity, opts.count)) : capacity;
  var STEP = Math.PI * 2 / COUNT;
  // Keep foil faces separated on the expanded, single carousel ring.
  function carouselRadius(count) { return box ? 2.65 : Math.max(1.8, 5.2 * count / capacity); }
  var RADIUS = carouselRadius(COUNT);
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
  camera.position.set(0, box ? 2.3 : (opts.carouselCameraY || 2.5), 7.6);
  camera.lookAt(0, 0.3, 0);
  if (chest) scene.fog = { isFog: true, color: new THREE.Color(token('--ev-3d-haze', '#b58a65')), near: 8.5, far: 20 };

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
    texture(src, function (tex) { material.map = tex; material.needsUpdate = true; invalidate(); });
    return material;
  }

  var surface = opts.material || {};
  function art(src) {
    return mapped(keep(new THREE.MeshStandardMaterial({
      color: 0xffffff, metalness: surface.metalness != null ? surface.metalness : 0.2, roughness: surface.roughness != null ? surface.roughness : 0.35
    })), src);
  }
  function geo(w, h, d) { return keep(new THREE.BoxGeometry(w, h, d)); }

  var foilGeos = {};
  function foilGeometry(low) {
    var detail = low ? "far" : "near";
    if (foilGeos[detail]) return foilGeos[detail];
    var foil = foilGeos[detail] = keep(new THREE.BoxGeometry(1.48, 2.22, .028, low ? 12 : 32, low ? 16 : 40, 2));
    var position = foil.attributes.position;
    for (var vertex = 0; vertex < position.count; vertex++) {
      var x = position.getX(vertex), y = position.getY(vertex), z = position.getZ(vertex);
      var nx = x / .74, ny = y / 1.11;
      // The filled pouch tapers into a thin welded perimeter, including both seals.
      var across = Math.pow(Math.max(0, Math.cos(nx * Math.PI / 2)), .65);
      var along = Math.pow(Math.max(0, Math.cos(ny * Math.PI / 2)), .55);
      var fullness = across * along;
      var pleat = .004 * Math.sin(ny * Math.PI * 7 + Math.abs(nx) * 9) * Math.pow(Math.abs(nx), 6) * along * across;
      position.setX(vertex, x * (1 + .018 * along - .012 * Math.pow(Math.abs(ny), 12)));
      position.setZ(vertex, z + Math.sign(z) * (.125 * fullness + pleat));
    }
    position.needsUpdate = true;
    foil.computeVertexNormals();
    return foil;
  }

  var sealGeo;
  function sealGeometry() {
    if (sealGeo) return sealGeo;
    sealGeo = keep(new THREE.BoxGeometry(1.462, .18, .028, 80, 4, 1));
    var points = sealGeo.attributes.position;
    for (var v = 0; v < points.count; v++) {
      var x = points.getX(v), y = points.getY(v), z = points.getZ(v);
      var fold = Math.cos((x / 1.48 + .5) * Math.PI * 80);
      points.setZ(v, z + Math.sign(z) * (.002 + .002 * fold));
      if (Math.abs(y) > .08) points.setY(v, y + Math.sign(y) * .004 * fold);
    }
    points.needsUpdate = true; sealGeo.computeVertexNormals(); return sealGeo;
  }
  var images = opts.images;
  var fronts = [].concat(images.front).filter(Boolean);
  var shadowTex = keep(shadowTexture(chest));
  var contactTex = null;
  if (chest) {
    var contactCanvas = document.createElement('canvas');
    contactCanvas.width = contactCanvas.height = 256;
    var contactCtx = contactCanvas.getContext('2d');
    contactCtx.shadowColor = 'white'; contactCtx.shadowBlur = 12;
    contactCtx.fillStyle = 'white';
    contactCtx.beginPath(); contactCtx.roundRect(18, 18, 220, 220, 12); contactCtx.fill();
    contactTex = keep(new THREE.CanvasTexture(contactCanvas));
  }
  var shadowGeo = keep(new THREE.PlaneGeometry(chest ? 3.0 : box ? 2.6 : 2.2, chest ? 2.0 : box ? 1.3 : 0.9));
  var tinted = [];
  var items = [];
  // 尺寸對應設計稿比例：卡包正面 2:3（512×768）、盲盒正立方（512×512），封條 512×64、盒蓋側邊 512×80
  // 寶箱（opts.shape === 'chest'）：箱身 1.6×1.0×1.1（正面 chest-front 512×320），半圓拱蓋沿寬度方向，
  // 蓋子以後上緣為軸掀開；拱面貼 chest-lid（512×512，由前緣繞到後緣），兩端半圓貼 chest-lid-end。
  var CW = 1.6, CH = 1.0, CD = 1.1;
  var LID_Y = chest ? CH / 2 : box ? 0.895 : 1.2;
  world.position.y = chest ? -1.32 : 0;
  var FLOOR_Y = chest ? -CH / 2 + 0.008 : box ? -1.05 : -1.45;

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

  for (var i = 0; i < capacity; i++) {
    var group = new THREE.Group();
    var body = new THREE.Group();
    group.add(body);
    // Foil packs may be tinted; chest surfaces retain one consistent gold finish.
    var side = (chest || !box) ? art(images.side) : mapped(keep(new THREE.MeshStandardMaterial({ metalness: 0.48, roughness: 0.3 })), images.side);
    if (box && !chest) tinted.push(side);
    var base, lid, pivot = null, contents = null;
    if (chest) {
      var cFront = art(images.front && fronts[i % fronts.length]);
      var lining = mapped(keep(new THREE.MeshStandardMaterial({ color:0xffffff, metalness:.06, roughness:.85 })), images.interior || images.side);
      var rim = keep(new THREE.MeshStandardMaterial({ color:token('--ev-3d-rim', '#d9a647'), metalness:.65, roughness:.32 }));
      var wall = .065;
      base = new THREE.Group();
      var frontWall = new THREE.Mesh(geo(CW, CH, wall), [side, side, rim, rim, cFront, lining]);
      frontWall.position.z = (CD - wall) / 2;
      var rearWall = new THREE.Mesh(geo(CW, CH, wall), [side, side, rim, rim, lining, side]);
      rearWall.position.z = -(CD - wall) / 2;
      var leftWall = new THREE.Mesh(geo(wall, CH, CD - wall * 2), [lining, side, rim, rim, rim, rim]);
      leftWall.position.x = -(CW - wall) / 2;
      var rightWall = new THREE.Mesh(geo(wall, CH, CD - wall * 2), [side, lining, rim, rim, rim, rim]);
      rightWall.position.x = (CW - wall) / 2;
      var floor = new THREE.Mesh(geo(CW - wall * 2, wall, CD - wall * 2), [rim, rim, lining, side, rim, rim]);
      floor.position.y = -CH / 2 + wall / 2;
      base.add(frontWall, rearWall, leftWall, rightWall, floor);
      var arc = chestLidGeometry();
      var lidTopC = art(images.lid);
      lidTopC.side = THREE.DoubleSide;
      var lidEnd = art(images.lidSide);
      lidEnd.side = THREE.DoubleSide;
      lid = new THREE.Mesh(arc, [lidTopC, lidEnd, lidEnd]);
      lid.rotation.z = Math.PI / 2;
      // 轉軸在箱身後上緣，蓋子中心距軸 CD/2
      pivot = new THREE.Group();
      pivot.position.set(0, CH / 2, -CD / 2);
      lid.position.set(0, 0, CD / 2);
      pivot.add(lid);
      // The half-cylinder has no underside; a solid inner board remains visible as the lid opens.
      var innerBoard = new THREE.Mesh(geo(CW, 0.035, CD), [rim, rim, lining, lining, rim, rim]);
      innerBoard.position.set(0, -0.018, CD / 2);
      pivot.add(innerBoard);
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
      base = new THREE.Mesh(foilGeometry(), [side, side, side, side, face, back]);
      contents = [];
      var cardArt = art(images.rewardBack || images.back);
      var cardEdge = keep(new THREE.MeshStandardMaterial({ color:token('--ev-3d-card-edge', '#e8d9b8'), metalness:.15, roughness:.6 }));
      for (var n = 0; n < 3; n++) {
        var card = new THREE.Mesh(geo(1.28, 1.9, .018), [cardEdge, cardEdge, cardEdge, cardEdge, cardArt, cardArt]);
        card.position.set((n - 1) * .012, 0, -.015 + n * .022);
        body.add(card); contents.push(card);
      }
      var crimp = art(images.crimp);
      lid = new THREE.Mesh(keep(sealGeometry().clone()), [side, side, side, side, crimp, crimp]);
      var bottom = new THREE.Mesh(sealGeometry(), [side, side, side, side, crimp, crimp]);
      bottom.position.y = -LID_Y;
      body.add(bottom);
    }
    if (pivot) body.add(base, pivot);
    else {
      lid.position.y = LID_Y;
      body.add(base, lid);
    }

    var shadowMat = keep(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: chest ? 0.32 : 0.35 }));
    var shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = FLOOR_Y;
    if (chest) { shadow.position.x = 0.18; shadow.position.z = -0.22; }
    group.add(shadow);
    var contactMat = null;
    if (chest) {
      contactMat = keep(new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false, opacity: 0.7 }));
      var contact = new THREE.Mesh(keep(new THREE.PlaneGeometry(CW * 1.05, CD * 1.1)), contactMat);
      contact.rotation.x = -Math.PI / 2;
      contact.position.y = FLOOR_Y + 0.002;
      group.add(contact);
    }

    var a = i * STEP;
    group.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS - RADIUS);
    group.rotation.y = a;
    group.visible = i < COUNT;
    ring.add(group);
    items.push({ group: group, body: body, lid: lid, pivot: pivot, contents: contents, base: base, normalMaterials: !box ? base.material : null, normalContent: !box ? contents[0].material[4] : null, secret:false, sealRest: !box ? lid.geometry.attributes.position.array.slice() : null, shadow: shadowMat, contact: contactMat });
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
    mascotPlane.position.set(opts.mascot.offsetX || 0, FLOOR_Y + MH / 2 - MH * 0.024, opts.mascot.offsetZ ?? -RADIUS);
    world.add(mascotPlane);
  }
  function placeMascot() {
    if (!mascotPlane) return;
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
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
    invalidate();
    tinted.forEach(function (m, k) {
      var slot = box && !chest ? Math.floor(k / 2) : k;
      m.color.set(token('--ev-3d-item-' + (slot % COUNT + 1), '#b8b4f3'));
    });
    accent.color.set(token('--ev-3d-accent', '#d4aaff'));
    hemi.groundColor.set(token('--ev-3d-ground', '#8589af'));
    var shadowColor = token('--ev-3d-shadow', '#27364a');
    items.forEach(function (it) { it.shadow.color.set(shadowColor); if (it.contact) it.contact.color.set(shadowColor); });
  }
  applyTokens();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  stage.prepend(renderer.domElement);
  var resize = new ResizeObserver(function () {
    var r = stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    if (chest) {
      const backdrop = stage.closest('.ev-stage').getBoundingClientRect();
      const cover = Math.max(backdrop.width / 750, backdrop.height / (opts.sceneArt?.height || 1000));
      const horizon = opts.sceneArt?.horizonFraction != null ? r.height * opts.sceneArt.horizonFraction : backdrop.top + backdrop.height - (opts.sceneArt?.horizonFromBottom || 535) * cover - r.top;
      const focal = r.height / (2 * Math.tan(camera.fov * Math.PI / 360));
      camera.position.y = .05;
      camera.lookAt(0, .05 - (r.height / 2 - horizon) / focal * 7.6, 0);
    }
    camera.updateProjectionMatrix();
    placeMascot();
    invalidate();
  });
  resize.observe(stage);
  if (box) resize.observe(stage.closest('.ev-stage'));

  var secretActive = false, secretMaterials = null;
  function setSecret(active) {
    if (box || !opts.secretImages) return;
    secretActive = active; invalidate();
    if (active && !secretMaterials) secretMaterials = {front:art(opts.secretImages.front),side:art(opts.secretImages.side),back:art(opts.secretImages.back)};
  }
  var mode = 'select';
  var zoom = 0, zoomTarget = 0, focusDone = null;
  var selected = 0;
  var hovered = -1, jellyIndex = -1, jellyStart = 0;
  var jellyDuration = box ? 520 : 520 / 3;
  var angle = 0;
  var target = 0;
  var startX = null, startY = null, gestureStart = 0;
  var inspectAngle = 0, inspectStart = 0, gestureMode = '';
  var sealCue = stage.querySelector('#packSealCue');
  function onSeal(x,y) {
    var r = renderer.domElement.getBoundingClientRect();
    var body = items[selected].body;
    body.updateWorldMatrix(true, false);
    var points = [-.74,.74].flatMap(function (edge) {
      return [-.14,.14].map(function (z) {
        var p = new THREE.Vector3(edge,LID_Y,z).applyMatrix4(body.matrixWorld).project(camera);
        return { x:r.left+(p.x+1)*r.width/2, y:r.top+(1-p.y)*r.height/2 };
      });
    });
    // A generous screen-space seal band remains usable when the foil is edge-on.
    var minX = Math.min.apply(null,points.map(function(p){return p.x;}));
    var maxX = Math.max.apply(null,points.map(function(p){return p.x;}));
    var minY = Math.min.apply(null,points.map(function(p){return p.y;}));
    var maxY = Math.max.apply(null,points.map(function(p){return p.y;}));
    var below = Math.max(44,Math.min(76,r.height*.17));
    return x >= minX-32 && x <= maxX+32 && y >= minY-26 && y <= maxY+below;
  }
  var drag = 0, dragY = 0;
  var progress = 0;
  var openMs = 1800;
  var openDone = null;
  var abort = new AbortController();
  var on = function (el, name, fn) { el.addEventListener(name, fn, { signal: abort.signal }); };

  function move(n) {
    if (mode !== 'select' || COUNT < 2) return;
    invalidate();
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
    invalidate();
    var k = ((i - selected) % COUNT + COUNT) % COUNT;
    if (k > COUNT / 2) k -= COUNT;
    if (k) move(-k);
    return k !== 0;
  }

  on(stage, 'pointerdown', function (e) {
    if (mode !== 'select' && mode !== 'ready') return;
    if (e.target !== renderer.domElement) return;
    gestureMode = !box && mode === 'ready' ? (onSeal(e.clientX,e.clientY) ? 'tear' : 'rotate') : '';
    inspectStart = inspectAngle;
    jellyIndex = -1; hovered = -1; invalidate();
    startX = e.clientX; startY = e.clientY; gestureStart = performance.now();
    drag = 0; dragY = 0;
    stage.setPointerCapture(e.pointerId);
  });
  on(stage, 'pointermove', function (e) {
    if (startX === null) {
      // 滑鼠移到包裝上顯示手指游標，表示可以點選
      if (e.pointerType === 'mouse' && mode === 'select' && e.target === renderer.domElement) {
        var hit = pick(e.clientX, e.clientY);
        renderer.domElement.style.cursor = hit >= 0 ? 'pointer' : '';
        if (hit !== hovered && hit >= 0) {
          if (opts.onHover) opts.onHover();
          if (!reduced.matches) { jellyIndex = hit; jellyStart = performance.now(); invalidate(); }
        }
        hovered = hit;
      }
      return;
    }
    drag = e.clientX - startX; dragY = e.clientY - startY;
    if (mode === 'select' && COUNT > 1) angle = target + drag * 0.004;
    else if (!box && mode === 'ready' && gestureMode === 'rotate') { inspectAngle = inspectStart + drag*.018; invalidate(); }
  });
  on(stage, 'pointerup', function (e) {
    if (startX === null) return;
    if (mode === 'select' && Math.abs(drag) > 25) move(drag > 0 ? 1 : -1);
    else if (mode === 'ready' && (box ? dragY < -55 && Math.abs(dragY) > Math.abs(drag) : gestureMode === 'tear' && Math.abs(drag) > 55 && Math.abs(drag) > Math.abs(dragY)*1.2) && opts.onSwipeOpen) opts.onSwipeOpen({ speed: Math.abs(drag) / Math.max(16, performance.now()-gestureStart) });
    else if (mode === 'select' && Math.abs(drag) < 8 && opts.onPick) {
      // 沒有拖曳＝點選：點到哪一包就選哪一包
      var i = pick(e.clientX, e.clientY);
      if (i >= 0) opts.onPick(i);
    }
    startX = null; startY = null;
  });
  on(stage, 'pointerleave', function () { hovered = -1; renderer.domElement.style.cursor = ''; });
  on(stage, 'pointercancel', function () { startX = null; startY = null; });
  on(document, 'ev:skin', applyTokens);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var last = performance.now();
  var raf = 0;
  var disposed = false;
  var visible = true;
  var dirty = true;
  var renderReady = false, rendering = false;
  function invalidate() {
    dirty = true;
    if (renderReady && !rendering && !raf && !disposed && visible && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  var observer = new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    resume();
  });
  observer.observe(stage);
  on(document, 'visibilitychange', resume);
  on(reduced, 'change', function () { invalidate(); resume(); });
  Promise.all(pending).then(function () { invalidate(); });

  function resume() {
    cancelAnimationFrame(raf);
    raf = 0;
    last = performance.now();
    if (!disposed && visible && !document.hidden) invalidate();
  }

  function finishOpen() {
    progress = 1;
    mode = 'opened';
    invalidate();
    var cb = openDone;
    openDone = null;
    if (cb) cb();
  }

  function frame(now) {
    raf = 0;
    if (disposed || !visible || document.hidden) return;
    if (now - last < 1000 / 30) { raf = requestAnimationFrame(frame); return; }
    rendering = true;
    var jellyActive = mode === 'select' && !reduced.matches && jellyIndex >= 0 && now - jellyStart < jellyDuration;
    if (!jellyActive && jellyIndex >= 0) { jellyIndex = -1; invalidate(); }
    var changing = jellyActive || mode === 'opening' || Math.abs(zoomTarget - zoom) > .001 || Math.abs(target - angle) > .0001 || startX !== null;
    var animate = changing;
    if (!dirty && !animate) { last = now; rendering = false; return; }
    dirty = false;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    zoom += (zoomTarget - zoom) * (reduced.matches ? 1 : Math.min(1, dt * 9));
    if (Math.abs(zoomTarget - zoom) < .002) {
      zoom = zoomTarget;
      if (focusDone) { var focused = focusDone; focusDone = null; focused(); }
    }
    if (!box && mode === 'opening') inspectAngle *= Math.max(0,1-dt*12);
    if (mode === 'opening') {
      progress += dt / ((reduced.matches ? 300 : openMs) / 1000);
      if (progress >= 1) finishOpen();
    }
    if (startX === null || mode !== 'select') angle += (target - angle) * (reduced.matches ? 1 : Math.min(1, dt * 8));
    if (!chest) {
      ring.rotation.y = angle;
      ring.position.x = RADIUS * Math.sin(angle);
      ring.position.z = RADIUS * (Math.cos(angle) - 1);
    }
    items.forEach(function (it, k) {
      if (k >= COUNT) return;
      if (chest) {
        // Compress the carousel depth, not the meshes, to keep every chest on the visible floor.
        var orbit = k * STEP + angle;
        it.group.position.set(Math.sin(orbit) * RADIUS, 0, (Math.cos(orbit) - 1) * RADIUS * .85);
        it.group.rotation.y = orbit;
      }
      var mine = k === selected, sx = 1, sy = 1;
      if (jellyActive && k === jellyIndex) {
        var t = (now - jellyStart) / jellyDuration;
        var keys = [[0,1,1],[.35,1.10,.94],[.68,.98,1.05],[1,1,1]];
        var segment = t < .35 ? 0 : t < .68 ? 1 : 2;
        var a = keys[segment], b = keys[segment + 1];
        var u = (t - a[0]) / (b[0] - a[0]);
        u = segment === 1 ? u*u*(3-2*u) : 1-(1-u)*(1-u);
        sx = a[1] + (b[1]-a[1])*u; sy = a[2] + (b[2]-a[2])*u;
      }

      if (!box) {
        var isSecret = secretActive && mine && !!(secretMaterials && secretMaterials.front.map && secretMaterials.side.map && secretMaterials.back.map);
        if (it.secret !== isSecret) {
          it.secret = isSecret;
          it.base.material = isSecret ? [secretMaterials.side,secretMaterials.side,secretMaterials.side,secretMaterials.side,secretMaterials.front,secretMaterials.back] : it.normalMaterials;
          it.contents.forEach(function(card) {card.material[4] = card.material[5] = isSecret ? secretMaterials.back : it.normalContent;});
        }
        it.base.geometry = foilGeometry(!mine);
        var focusScale = 1 + (mine ? zoom * .14 : 0);
        it.group.scale.set(focusScale*sx, focusScale*sy, focusScale);
        it.group.position.y = (mine ? zoom * .08 : 0) + (sy-1)*1.11;
      }
      if (box) {
        it.body.scale.set(sx, sy, 1);
        it.body.position.y = (sy - 1) * (chest ? CH / 2 : .775);
      }
      it.group.visible = mode === 'select' || mine;
      var p = mine ? Math.min(progress, 1) : 0;
      if (it.contents) {
        var stageOpen = Math.max(0, Math.min(1, (p - .64) / .32));
        var lift = stageOpen * stageOpen * (3 - 2 * stageOpen);
        it.body.scale.setScalar(1 - lift * .32);
        it.body.position.y = -lift * .55;
        it.contents.forEach(function (card, index) {
          card.visible = p > .64;
          card.position.y = lift * (index === 2 ? 2.1 : .35 - index * .035);
          card.position.z = -.015 + index * .022 + (index === 2 ? lift * .24 : 0);
          card.rotation.y = index === 2 ? Math.sin(lift * Math.PI) * -.15 : 0;
        });
      }
      // 前 20%：包裝抖動蓄力；之後封條／盒蓋飛出
      var shake = mine && mode === 'opening' && p < 0.2 && !reduced.matches ? Math.sin(now * 0.08) * 0.04 : 0;
      var fly = Math.max(0, (p - 0.2) / 0.8);
      var ease = 1 - Math.pow(1 - fly, 3);
      it.body.rotation.z = chest ? 0 : shake;
      it.body.rotation.y = box ? (mode !== 'select' && mine ? 0.15 : 0) : (mine ? inspectAngle : 0);
      if (it.pivot) {
        it.pivot.rotation.x = -ease * 1.7;
      } else if (!box && it.lastTear !== p && (mine || it.lastTear)) {
        it.lastTear = p;
        var tear = Math.min(1, p / .64);
        var release = Math.max(0, Math.min(1, (p - .64) / .22));
        var attr = it.lid.geometry.attributes.position;
        for (var vertex = 0; vertex < attr.count; vertex++) {
          var offset = vertex * 3, sx = it.sealRest[offset], sy = it.sealRest[offset + 1], sz = it.sealRest[offset + 2];
          var u = (sx + .74) / 1.48;
          var peeled = Math.pow(Math.max(0, (tear - u) / Math.max(tear, .001)), .7);
          attr.setXYZ(vertex, sx + peeled * .06, sy + peeled * .46, sz + Math.sin(peeled * Math.PI) * .22);
        }
        attr.needsUpdate = true;
        it.lid.geometry.computeVertexNormals();
        it.lid.position.set(release * .8, LID_Y + release * 1.2, release * .15);
        it.lid.rotation.z = -release * .65;
      } else if (box) {
        it.lid.position.y = LID_Y + ease * 2;
        it.lid.position.x = 0;
        it.lid.rotation.z = ease * -.4;
      }
    });
    if (!document.hidden && stage.offsetParent !== null) {
      renderer.render(scene, camera);
      if (sealCue) {
        sealCue.hidden = mode !== 'ready';
        if (!sealCue.hidden) {
          var sealPoint = new THREE.Vector3(0, LID_Y, 0).applyMatrix4(items[selected].body.matrixWorld).project(camera);
          sealCue.style.left = ((sealPoint.x + 1) * stage.clientWidth / 2) + 'px';
          sealCue.style.top = ((1 - sealPoint.y) * stage.clientHeight / 2) + 'px';
        }
      }
    }
    rendering = false;
    if (!disposed) raf = requestAnimationFrame(frame);
  }
  renderReady = true;
  raf = requestAnimationFrame(frame);

  return {
    ready: Promise.all(pending),
    selected: function () { return selected; },
    move: move,
    setCount: function (count) {
      if (!opts.capacity || mode !== 'select') return;
      COUNT = Math.max(1, Math.min(capacity, count));
      STEP = Math.PI * 2 / COUNT;
      RADIUS = carouselRadius(COUNT);
      angle = target = selected = 0;
      hovered = jellyIndex = -1;
      items.forEach(function (item, i) {
        var orbit = i * STEP;
        item.group.visible = i < COUNT;
        item.group.position.set(Math.sin(orbit) * RADIUS, 0, Math.cos(orbit) * RADIUS - RADIUS);
        item.group.rotation.y = orbit;
      });
      invalidate();
    },
    goTo: goTo,
    setSecret: setSecret,
    focus: function () {
      mode = 'focusing'; inspectAngle = 0; zoomTarget = 1; invalidate();
      return new Promise(function (done) { focusDone = done; });
    },
    setMode: function (m) {
      invalidate();
      mode = m;
      if (m === 'select') { inspectAngle = 0; progress = 0; openDone = null; zoomTarget = 0; focusDone = null; }
    },
    open: function (ms) {
      openMs = ms || openMs;
      invalidate();
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
      observer.disconnect();
      disposables.forEach(function (d) { d.dispose(); });
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}
