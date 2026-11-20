// Hero 3D: planta eléctrica estilizada construida con primitivas (sin Blender disponible).
// Se importa dinámicamente (lazy) desde main.js, así el texto/CTAs del hero salen al instante.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const YELLOW = 0xffc800;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); }
  return t;
}

export async function initHero3D({ canvas, stage, labelsEl }) {
  try { await document.fonts.load('800 64px "Big Shoulders Display Variable"'); } catch { /* sin fuente: usa fallback */ }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

  // Luces de estudio (3 puntos)
  const key = new THREE.DirectionalLight(0xfff4e0, 2.4); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(YELLOW, 2.2); rim.position.set(-5, 3, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x8fa4ff, 0.5); fill.position.set(-4, 1, 4); scene.add(fill);
  const glowLight = new THREE.PointLight(YELLOW, 0, 6, 1.6); scene.add(glowLight);

  // ---------- Materiales ----------
  const noise = canvasTex(256, 256, (g, w, h) => {
    const d = g.createImageData(w, h);
    for (let i = 0; i < d.data.length; i += 4) { const v = 120 + Math.random() * 70; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    g.putImageData(d, 0, 0);
  }, 3);
  noise.colorSpace = THREE.NoColorSpace;
  const mYellow = new THREE.MeshPhysicalMaterial({ color: YELLOW, metalness: 0.3, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.25, bumpMap: noise, bumpScale: 0.35, transparent: true });
  const mBlack = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.6, roughness: 0.5 });
  const mDark = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, metalness: 0.5, roughness: 0.6, bumpMap: noise, bumpScale: 0.2 });
  const mSteel = new THREE.MeshStandardMaterial({ color: 0xa5abb2, metalness: 1, roughness: 0.32 });
  const mEngine = new THREE.MeshStandardMaterial({ color: 0x44484e, metalness: 0.85, roughness: 0.42, bumpMap: noise, bumpScale: 0.3 });
  const mCopper = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1, roughness: 0.3 });
  const mRed = new THREE.MeshStandardMaterial({ color: 0xe10600, roughness: 0.35, metalness: 0.2, emissive: 0xe10600, emissiveIntensity: 0.1 });
  const mRubber = new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.95 });
  const mGlow = new THREE.MeshBasicMaterial({ color: YELLOW, toneMapped: false });
  const mScreen = new THREE.MeshBasicMaterial({ color: 0x20382a, toneMapped: false });

  const box = (w, h, d, m, r = 0.02) => new THREE.Mesh(r ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d), m);
  const cyl = (rt, rb, h, m, seg = 32) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };

  // ---------- Modelo ----------
  const root = new THREE.Group(); scene.add(root);
  const parts = {};
  const mk = (name, explode, anchor) => {
    const g = new THREE.Group(); g.userData = { explode: new THREE.Vector3(...explode), anchor: new THREE.Vector3(...anchor), base: new THREE.Vector3() };
    parts[name] = g; root.add(g); return g;
  };

  // Chasis + ruedas + manillar
  const chassis = mk('chassis', [0, -0.55, 0], [0, 0, 0]);
  chassis.add(at(box(3.3, 0.14, 1.75, mDark, 0.03), 0, 0.2, 0));
  [-0.7, 0.7].forEach((z) => chassis.add(at(box(3.4, 0.1, 0.12, mBlack, 0.02), 0, 0.12, z)));
  [1.3, -1.3].forEach((x) => [-0.8, 0.8].forEach((z) => chassis.add(at(box(0.18, 0.08, 0.18, mRubber, 0.02), x, 0.08, z))));
  [-1, 1].forEach((s) => {
    const w = cyl(0.3, 0.3, 0.2, mRubber, 28); w.rotation.x = Math.PI / 2; chassis.add(at(w, 1.35, 0.3, s * 0.98));
    const hub = cyl(0.12, 0.12, 0.24, mSteel, 20); hub.rotation.x = Math.PI / 2; chassis.add(at(hub, 1.35, 0.3, s * 0.98));
    const bar = cyl(0.025, 0.025, 1.0, mSteel, 10); bar.rotation.z = Math.PI / 2 - 0.5; chassis.add(at(bar, -1.9, 0.55, s * 0.7));
  });
  const cross = cyl(0.03, 0.03, 1.5, mBlack, 10); cross.rotation.x = Math.PI / 2; chassis.add(at(cross, -2.25, 0.86, 0));

  // Cabina insonorizada
  const canopy = mk('canopy', [0, 1.8, -0.25], [1.1, 0.85, 0]);
  const body = box(3.0, 1.5, 1.5, mYellow, 0.1); canopy.add(at(body, 0, 1.08, 0));
  const lip = box(3.06, 0.08, 1.56, mBlack, 0.03); canopy.add(at(lip, 0, 0.36, 0));
  canopy.add(at(box(0.02, 1.0, 1.0, mBlack, 0), 1.505, 1.05, 0));
  for (let i = 0; i < 7; i++) canopy.add(at(box(0.03, 0.045, 0.9, mYellow, 0.01), 1.52, 0.7 + i * 0.12, 0));
  for (let i = 0; i < 5; i++) canopy.add(at(box(0.7, 0.012, 0.05, mBlack, 0), -0.4 + (i % 2) * 0.0, 1.833, -0.55 + i * 0.28));
  [-0.55, 0.65].forEach((x) => canopy.add(at(box(0.014, 1.15, 0.01, mBlack, 0), x, 1.1, 0.752)));
  const stack = cyl(0.09, 0.11, 0.55, mSteel, 18); canopy.add(at(stack, -1.0, 2.1, -0.4));
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.022, 8, 20), mSteel); hook.rotation.x = Math.PI / 2; canopy.add(at(hook, 0, 1.87, 0));
  // placa de marca
  const plateTex = canvasTex(512, 160, (g, w, h) => {
    g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffc800'; g.fillRect(0, 0, w, 8); g.fillRect(0, h - 8, w, 8);
    g.font = '800 96px "Big Shoulders Display Variable", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('EUROPOWER', w / 2, h / 2 + 4);
  });
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.3), new THREE.MeshBasicMaterial({ map: plateTex, toneMapped: false }));
  canopy.add(at(plate, -0.85, 1.55, 0.756));
  const plateB = plate.clone(); plateB.rotation.y = Math.PI; canopy.add(at(plateB, 0.6, 1.55, -0.756));
  // rayo (emblema)
  const bs = new THREE.Shape();
  [[0.1, 0.5], [-0.14, 0.04], [0, 0.04], [-0.08, -0.5], [0.16, 0.08], [0.02, 0.08], [0.14, 0.5]].forEach(([x, y], i) => (i ? bs.lineTo(x, y) : bs.moveTo(x, y)));
  bs.closePath();
  const bolt = new THREE.Mesh(new THREE.ExtrudeGeometry(bs, { depth: 0.04, bevelEnabled: false }), mRed);
  bolt.scale.setScalar(0.95); canopy.add(at(bolt, -0.85, 0.95, 0.755));

  // Tablero + ATS
  const tablero = mk('tablero', [0.9, 0.15, 1.9], [0.3, 0.1, 0.1]);
  tablero.position.set(0.55, 0, 0);
  tablero.add(at(box(1.0, 0.9, 0.12, mBlack, 0.03), 0.3, 1.08, 0.79));
  tablero.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.26), mScreen), 0.12, 1.28, 0.855));
  const led = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.03), mGlow); tablero.add(at(led, 0.12, 1.28, 0.857));
  [[0.52, 1.3, mRed], [0.52, 1.14, mGlow]].forEach(([x, y, m]) => { const k = cyl(0.045, 0.045, 0.05, m, 16); k.rotation.x = Math.PI / 2; tablero.add(at(k, x, y, 0.86)); });
  [0.0, 0.2, 0.4].forEach((x) => tablero.add(at(box(0.1, 0.18, 0.06, mSteel, 0.01), x + 0.0, 0.95, 0.86)));
  const atsTex = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#ffc800'; g.fillRect(0, 0, w, h); g.fillStyle = '#000'; g.font = '800 92px "Big Shoulders Display Variable", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ATS', w / 2, h / 2 + 4); });
  tablero.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshBasicMaterial({ map: atsTex, toneMapped: false })), 0.52, 0.93, 0.862));
  tablero.userData.base.set(0, 0, 0);

  // Motor
  const engine = mk('engine', [-1.3, 0.55, 0.3], [-0.9, 0.5, 0.2]);
  engine.add(at(box(1.15, 0.62, 0.8, mEngine, 0.04), -0.7, 0.75, 0.15));
  engine.add(at(box(1.0, 0.22, 0.7, mDark, 0.03), -0.7, 1.16, 0.15));
  engine.add(at(box(0.8, 0.1, 0.5, mRed, 0.03), -0.7, 1.32, 0.15));
  for (let i = 0; i < 6; i++) engine.add(at(box(0.05, 0.5, 0.82, mSteel, 0.01), -1.05 + i * 0.14, 0.72, 0.15));
  const flywheel = cyl(0.36, 0.36, 0.14, mSteel, 32); flywheel.rotation.z = Math.PI / 2; engine.add(at(flywheel, -0.04, 0.78, 0.15));
  const exh = cyl(0.05, 0.05, 0.9, mSteel, 12); exh.rotation.z = Math.PI / 2; engine.add(at(exh, -0.75, 0.98, 0.58));
  engine.add(at(cyl(0.12, 0.12, 0.3, mDark, 20), -1.1, 1.5, 0.15));

  // Alternador
  const alt = mk('alternator', [1.25, 0.35, 0.3], [0, 0.45, 0.35]);
  const altBody = cyl(0.4, 0.4, 0.85, mDark, 36); altBody.rotation.z = Math.PI / 2; alt.add(at(altBody, 0.68, 0.78, 0.15));
  for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.025, 8, 36), mSteel); r.rotation.y = Math.PI / 2; alt.add(at(r, 0.35 + i * 0.17, 0.78, 0.15)); }
  const cap = cyl(0.3, 0.3, 0.12, mCopper, 32); cap.rotation.z = Math.PI / 2; alt.add(at(cap, 1.16, 0.78, 0.15));
  alt.add(at(box(0.36, 0.2, 0.34, mYellow, 0.02), 0.7, 1.28, 0.15));

  // Tanque
  const tank = mk('tank', [0, -0.15, -1.3], [0.9, 0.1, 0.3]);
  tank.add(at(box(2.5, 0.38, 0.52, mDark, 0.12), 0, 0.5, -0.5));
  tank.add(at(box(2.52, 0.07, 0.54, mGlow, 0.03), 0, 0.5, -0.5));
  tank.add(at(cyl(0.07, 0.07, 0.12, mRed, 16), 0.9, 0.74, -0.5));

  // Plataforma luminosa en el piso
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.7, 2.74, 96), new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.35, side: THREE.DoubleSide, toneMapped: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; root.add(ring);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.2), new THREE.MeshBasicMaterial({
    transparent: true, depthWrite: false,
    map: canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }),
  }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; root.add(shadow);

  root.position.y = 0;
  Object.values(parts).forEach((p) => p.userData.base.copy(p.position));

  // ---------- Efectos: línea de luz + partículas + destello ----------
  const sweep = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.035, 0.035), mGlow); root.add(sweep);
  const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,230,120,1)'); gr.addColorStop(0.3, 'rgba(255,200,0,.55)'); gr.addColorStop(1, 'rgba(255,200,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
  flash.position.set(-0.85, 1.05, 1.0); flash.scale.setScalar(0.1); root.add(flash);

  const N = 140;
  const pPos = new Float32Array(N * 3), pVel = new Float32Array(N * 3);
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.075, map: glowTex, color: 0xffd23a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
  const points = new THREE.Points(pGeo, pMat); points.frustumCulled = false; root.add(points);
  const resetP = (i, burst) => {
    const a = Math.random() * Math.PI * 2, r = burst ? Math.random() * 0.3 : 1 + Math.random() * 1.4;
    pPos[i * 3] = burst ? -0.85 + Math.cos(a) * r : Math.cos(a) * r * 1.2;
    pPos[i * 3 + 1] = burst ? 1.05 + Math.sin(a) * r : 0.1 + Math.random() * 0.3;
    pPos[i * 3 + 2] = burst ? 0.9 : Math.sin(a) * r * 0.8;
    const sp = burst ? 1.2 + Math.random() * 2.2 : 0.15 + Math.random() * 0.35;
    pVel[i * 3] = burst ? Math.cos(a) * sp : (Math.random() - 0.5) * 0.1;
    pVel[i * 3 + 1] = burst ? Math.sin(a) * sp : sp;
    pVel[i * 3 + 2] = burst ? Math.random() * sp * 0.8 : (Math.random() - 0.5) * 0.1;
  };
  for (let i = 0; i < N; i++) resetP(i, false);

  // ---------- Estado / interacción ----------
  const state = { size: null, target: 0, e: 0, mx: 0, my: 0, tx: 0, ty: 0, gx: 0, gy: 0, drag: 0, dragTarget: 0 };
  const isMobile = () => stage.clientWidth < 900;
  const onMove = (ev) => { if (ev.pointerType === 'mouse') { state.tx = (ev.clientX / innerWidth) * 2 - 1; state.ty = (ev.clientY / innerHeight) * 2 - 1; } };
  addEventListener('pointermove', onMove, { passive: true });
  let dragX = null;
  canvas.addEventListener('pointerdown', (ev) => { if (ev.pointerType !== 'mouse') dragX = ev.clientX; }, { passive: true });
  addEventListener('pointermove', (ev) => { if (dragX != null && ev.pointerType !== 'mouse') { state.dragTarget = Math.max(-1, Math.min(1, state.dragTarget + (ev.clientX - dragX) / 240)); dragX = ev.clientX; } }, { passive: true });
  addEventListener('pointerup', () => { dragX = null; }, { passive: true });
  const onTilt = (ev) => { if (ev.gamma == null) return; state.gx = Math.max(-1, Math.min(1, ev.gamma / 30)); state.gy = Math.max(-1, Math.min(1, (ev.beta - 50) / 35)); };
  addEventListener('deviceorientation', onTilt, { passive: true });

  // Etiquetas técnicas
  const tags = [...labelsEl.querySelectorAll('.tag')].map((el, i) => ({ el, part: parts[el.dataset.part], side: ['right', 'left', 'left', 'right', 'left'][i] || 'right', w: 0, h: 0 }));
  const v3 = new THREE.Vector3();

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    tags.forEach((t) => { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; });
    camera.updateProjectionMatrix();
    state.size = { w, h };
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // ---------- Bucle ----------
  const clock = { last: performance.now(), elapsedTime: 0, getDelta() { const n = performance.now(); const d = (n - this.last) / 1000; this.last = n; this.elapsedTime += d; return d; } };
  let t0 = null, raf = 0, visible = true, started = false, burstDone = false;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    if (t0 == null) t0 = time;
    const it = time - t0; // tiempo desde el encendido

    state.e += (state.target - state.e) * Math.min(1, dt * 5);
    state.mx += (state.tx + state.gx - state.mx) * Math.min(1, dt * 3);
    state.my += (state.ty + state.gy - state.my) * Math.min(1, dt * 3);
    state.drag += (state.dragTarget - state.drag) * Math.min(1, dt * 4);
    const e = ease(clamp01(state.e));
    const mobile = isMobile();
    if (!state.size) return;
    const { w, h } = state.size;

    // Explode
    Object.values(parts).forEach((p) => p.position.copy(p.userData.base).addScaledVector(p.userData.explode, e));
    mYellow.opacity = 1 - e * 0.72;
    mYellow.depthWrite = e < 0.2;
    ring.material.opacity = 0.35 + e * 0.2;

    // Rotación (scroll + puntero/giroscopio/arrastre)
    const idle = Math.sin(time * 0.4) * 0.05;
    root.rotation.y = -0.65 + e * 1.15 + state.mx * 0.28 + state.drag * 0.7 + idle;
    root.rotation.x = state.my * 0.05;
    flywheel.rotation.x += dt * (it > 1 ? 9 : 0);

    // Encendido: vibración, destello, línea de luz, partículas
    const on = it > 0.8;
    canopy.position.x = canopy.userData.base.x + (on && e < 0.05 ? Math.sin(time * 70) * 0.0025 : 0);
    const f = it < 0.8 ? (Math.random() < 0.3 ? Math.random() : 0.1) : 1;
    mRed.emissiveIntensity = 0.1 + (it < 0.8 ? f * 0.6 : 0.5 + Math.sin(time * 3) * 0.15);
    if (it > 0.8 && !burstDone) { burstDone = true; for (let i = 0; i < N; i++) resetP(i, true); }
    const fl = it > 0.8 ? Math.max(0, 1 - (it - 0.8) / 1.2) : 0;
    flash.material.opacity = fl; flash.scale.setScalar(0.4 + (1 - fl) * 2.2);
    glowLight.intensity = fl * 9 + 0.6 * clamp01(it - 0.8);
    glowLight.position.set(-0.85, 1.3, 1.6);
    pMat.opacity = clamp01((it - 0.7) * 2) * (0.9 - e * 0.35);
    for (let i = 0; i < N; i++) {
      pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
      if (burstDone && it > 2 && (pPos[i * 3 + 1] > 3.4 || pPos[i * 3 + 1] < 0)) resetP(i, false);
      if (it > 2.2) { pVel[i * 3] *= 0.995; }
    }
    pGeo.attributes.position.needsUpdate = true;
    // línea de luz recorriendo el perímetro frontal de la cabina (y se repite suave)
    const cyc = it < 0.9 ? -1 : ((it - 0.9) % 6) / 2.2;
    sweep.visible = cyc >= 0 && cyc <= 1 && e < 0.15;
    if (sweep.visible) {
      const u = cyc * 4; // 4 lados
      const X = 1.5, Y0 = 0.38, Y1 = 1.82, Z = 0.77;
      let x, y, rotZ = 0;
      if (u < 1) { x = -X + u * 2 * X; y = Y0; }
      else if (u < 2) { x = X; y = Y0 + (u - 1) * (Y1 - Y0); rotZ = Math.PI / 2; }
      else if (u < 3) { x = X - (u - 2) * 2 * X; y = Y1; }
      else { x = -X; y = Y1 - (u - 3) * (Y1 - Y0); rotZ = Math.PI / 2; }
      sweep.position.set(x, y + parts.canopy.position.y - parts.canopy.userData.base.y, Z + parts.canopy.position.z - parts.canopy.userData.base.z);
      sweep.rotation.z = rotZ;
    }

    // Cámara
    const fovT = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const halfW = mobile ? 2.35 : 2.9;
    const dist = Math.max(halfW / (fovT * camera.aspect), 2.6 / fovT * (mobile ? 0.92 : 1)) * (1 + e * (mobile ? 0.26 : 0.3));
    camera.position.set(0, 1.9 + e * 0.5, dist);
    camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.1);
    camera.lookAt(0, 1.05 + e * 0.7, 0);
    const ox = mobile ? 0 : -w * 0.2 * (1 - e * 0.85);
    const oy = mobile ? -h * 0.23 * (1 - e * 0.6) : 0;
    camera.setViewOffset(w, h, ox, oy, w, h);

    renderer.render(scene, camera);

    // Etiquetas
    const show = clamp01((e - 0.55) / 0.35);
    tags.forEach((t, i) => {
      const op = clamp01(show * 1.4 - i * 0.08);
      t.el.style.opacity = op.toFixed(2);
      if (op <= 0.01) return;
      v3.copy(t.part.userData.anchor); t.part.localToWorld(v3); v3.project(camera);
      const ax = (v3.x * 0.5 + 0.5) * w; // project() ya incluye el view offset
      const ay = (-v3.y * 0.5 + 0.5) * h;
      const lw = mobile ? 14 : 30;
      t.el.style.setProperty('--lw', lw + 'px');
      let x = t.side === 'left' ? ax - t.w - lw : ax + lw;
      x = Math.max(6, Math.min(w - t.w - 6, x));
      t.el.classList.toggle('is-left', t.side === 'left');
      t.el.classList.toggle('is-right', t.side === 'right');
      t.el.style.transform = `translate(${x.toFixed(1)}px, ${(ay - t.h / 2).toFixed(1)}px) translateX(${((1 - op) * (t.side === 'left' ? -14 : 14)).toFixed(1)}px)`;
    });
  }

  function loop(on) {
    if (on && !raf && visible && !document.hidden) { clock.getDelta(); frame(); }
    else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; loop(visible); }, { threshold: 0 });
  io.observe(stage);
  document.addEventListener('visibilitychange', () => loop(!document.hidden));

  renderer.render(scene, camera); // primer render (compila shaders)
  started = true;
  loop(true);

  return {
    setProgress(p) { state.target = clamp01(p); },
    ignite() { t0 = clock.elapsedTime; burstDone = false; },
    isStarted: () => started,
    dispose() { loop(false); renderer.dispose(); },
  };
}
