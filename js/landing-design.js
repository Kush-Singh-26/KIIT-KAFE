// ─── Landing Page Design (Three.js & Cursor) ─────────────────
let landingScene = null, landingRenderer = null, landingCamera = null, landingRequestID = null;
let floaters = [], bgRings = [], geoPlanes = [], steamWisps = [];
let mxN = 0, myN = 0; // Normalized mouse pos for parallax

function initLandingDesign() {
  // If already running, skip re-init to preserve state
  if (landingRequestID) return;

  const canvas = document.getElementById("canvas3d");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  landingRenderer = renderer;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  landingScene = scene;
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);
  landingCamera = camera;

  // Lights
  scene.add(new THREE.AmbientLight(0x52c984, 0.75));
  const dl = new THREE.DirectionalLight(0xf2ece0, 2.2);
  dl.position.set(6, 10, 7);
  scene.add(dl);
  const pl1 = new THREE.PointLight(0x35a866, 4, 28);
  pl1.position.set(-5, 3, 5);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0x7a4525, 3, 22);
  pl2.position.set(5, -2, 4);
  scene.add(pl2);
  const pl3 = new THREE.PointLight(0xe09a6a, 2.5, 20);
  pl3.position.set(0, 5, 5);
  scene.add(pl3);
  const pl4 = new THREE.PointLight(0x52c984, 2, 15);
  pl4.position.set(2, -3, -2);
  scene.add(pl4);

  // Particles
  const pg = new THREE.BufferGeometry();
  const pp = new Float32Array(900 * 3);
  for (let i = 0; i < 900 * 3; i++) pp[i] = (Math.random() - 0.5) * 50;
  pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
  const parts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x52c984, size: 0.07, transparent: true, opacity: 0.5 }));
  scene.add(parts);

  const pg2 = new THREE.BufferGeometry();
  const pp2 = new Float32Array(400 * 3);
  for (let i = 0; i < 400 * 3; i++) pp2[i] = (Math.random() - 0.5) * 40;
  pg2.setAttribute("position", new THREE.BufferAttribute(pp2, 3));
  const parts2 = new THREE.Points(pg2, new THREE.PointsMaterial({ color: 0xe09a6a, size: 0.06, transparent: true, opacity: 0.3 }));
  scene.add(parts2);

  // Grid floor
  const gridHelper = new THREE.GridHelper(60, 40, 0x1c4a2a, 0x1c4a2a);
  gridHelper.position.y = -7;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.5;
  scene.add(gridHelper);

  // Torus rings
  bgRings = [];
  const _bgM1 = new THREE.MeshBasicMaterial({ color: 0x35a866, transparent: true, opacity: 0.13, wireframe: true });
  const _bgM2 = new THREE.MeshBasicMaterial({ color: 0x7a4525, transparent: true, opacity: 0.11, wireframe: true });
  [
    { r: 4.5, x: -8, y: 3, z: -12, rx: 0.3, ry: 0.2, m: _bgM1 },
    { r: 3.8, x: 9, y: -2, z: -14, rx: -0.2, ry: 0.5, m: _bgM2 },
    { r: 6.0, x: 2, y: 5, z: -16, rx: 0.1, ry: 0.1, m: _bgM1 },
    { r: 2.8, x: -5, y: -5, z: -12, rx: 0.6, ry: -0.3, m: _bgM2 },
    { r: 5.2, x: 7, y: 6, z: -18, rx: -0.4, ry: 0.2, m: _bgM1 },
    { r: 3.2, x: -10, y: -1, z: -15, rx: 0.2, ry: 0.6, m: _bgM2 },
    { r: 7.0, x: 0, y: 0, z: -20, rx: 0.0, ry: 0.0, m: _bgM1 },
  ].forEach((d) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(d.r, 0.055, 8, 60), d.m.clone());
    ring.position.set(d.x, d.y, d.z);
    ring.rotation.set(d.rx, d.ry, 0);
    ring._ry = 0.0005 + Math.random() * 0.001;
    ring._rx = 0.0003 + Math.random() * 0.0005;
    scene.add(ring);
    bgRings.push(ring);
  });

  // Floating panels
  geoPlanes = [];
  [
    { w: 5, h: 3.5, x: -11, y: 2, z: -10, ry: 0.4, col: 0x1c5c32, op: 0.18 },
    { w: 4, h: 2.8, x: 11, y: -1, z: -11, ry: -0.35, col: 0x3a2010, op: 0.2 },
    { w: 6, h: 4, x: 1, y: -6, z: -13, ry: 0.1, col: 0x1c5c32, op: 0.15 },
    { w: 3.5, h: 5, x: -9, y: -4, z: -14, ry: 0.55, col: 0x3a2010, op: 0.18 },
    { w: 5.5, h: 3, x: 10, y: 5, z: -15, ry: -0.2, col: 0x1c5c32, op: 0.14 },
  ].forEach((d) => {
    const m = new THREE.MeshBasicMaterial({ color: d.col, transparent: true, opacity: d.op, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(d.w, d.h), m);
    plane.position.set(d.x, d.y, d.z);
    plane.rotation.y = d.ry;
    plane._off = Math.random() * Math.PI * 2;
    plane._amp = 0.15 + Math.random() * 0.2;
    scene.add(plane);
    geoPlanes.push(plane);
  });

  // Steam wisps
  steamWisps = [];
  for (let i = 0; i < 20; i++) {
    const w = new THREE.Mesh(new THREE.TorusGeometry(0.08 + Math.random() * 0.14, 0.014, 6, 20), new THREE.MeshBasicMaterial({ color: 0xede8df, transparent: true, opacity: 0.0 }));
    w.position.set((Math.random() - 0.5) * 18, -4 + Math.random() * 2, -2 - Math.random() * 5);
    w._baseX = w.position.x;
    w._speed = 0.4 + Math.random() * 0.6;
    w._phase = Math.random() * Math.PI * 2;
    w._maxOp = 0.06 + Math.random() * 0.09;
    scene.add(w);
    steamWisps.push(w);
  }

  // BOLD LETTERS
  const matG = new THREE.MeshStandardMaterial({ color: 0x3eb571, metalness: 0.5, roughness: 0.22, emissive: 0x1c4a2a, emissiveIntensity: 0.28 });
  const matAu = new THREE.MeshStandardMaterial({ color: 0xa0522d, metalness: 0.6, roughness: 0.2, emissive: 0x3d1507, emissiveIntensity: 0.25 });
  const D = 0.42;

  function bx(w, h, x, y, mat, rz = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, D), mat);
    m.position.set(x, y, 0); m.rotation.z = rz; return m;
  }
  function lK(mat) {
    const g = new THREE.Group();
    g.add(bx(0.32, 1.5, 0, 0, mat));
    g.add(bx(0.62, 0.3, 0.34, 0.48, mat, 0.52));
    g.add(bx(0.62, 0.3, 0.34, -0.48, mat, -0.52));
    return g;
  }
  function lI(mat) {
    const g = new THREE.Group();
    g.add(bx(0.6, 0.3, 0, 0.66, mat));
    g.add(bx(0.3, 1.5, 0, 0, mat));
    g.add(bx(0.6, 0.3, 0, -0.66, mat));
    return g;
  }
  function lT(mat) {
    const g = new THREE.Group();
    g.add(bx(0.95, 0.3, 0, 0.66, mat));
    g.add(bx(0.3, 1.5, 0, 0, mat));
    return g;
  }
  function lA(mat) {
    const g = new THREE.Group();
    g.add(bx(0.3, 1.5, -0.26, 0, mat, 0.22));
    g.add(bx(0.3, 1.5, 0.26, 0, mat, -0.22));
    g.add(bx(0.58, 0.28, 0, 0.02, mat));
    return g;
  }
  function lF(mat) {
    const g = new THREE.Group();
    g.add(bx(0.3, 1.5, -0.22, 0, mat));
    g.add(bx(0.8, 0.3, 0.14, 0.6, mat));
    g.add(bx(0.62, 0.28, 0.05, 0.04, mat));
    return g;
  }
  function lE(mat) {
    const g = new THREE.Group();
    g.add(bx(0.3, 1.5, -0.22, 0, mat));
    g.add(bx(0.8, 0.3, 0.14, 0.6, mat));
    g.add(bx(0.64, 0.28, 0.06, 0.02, mat));
    g.add(bx(0.8, 0.3, 0.14, -0.6, mat));
    return g;
  }

  const letterGroup = new THREE.Group();
  scene.add(letterGroup);

  const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(3.8, 64), new THREE.MeshBasicMaterial({ color: 0x0f2918, transparent: true, opacity: 0.82, side: THREE.DoubleSide }));
  glowDisc.position.set(0, 0.2, -0.65);
  letterGroup.add(glowDisc);

  const halo = new THREE.Mesh(new THREE.RingGeometry(3.4, 4.0, 64), new THREE.MeshBasicMaterial({ color: 0x35a866, transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
  halo.position.set(0, 0.2, -0.6);
  letterGroup.add(halo);

  const halo2 = new THREE.Mesh(new THREE.RingGeometry(4.1, 4.8, 64), new THREE.MeshBasicMaterial({ color: 0xb8622f, transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
  halo2.position.set(0, 0.2, -0.62);
  letterGroup.add(halo2);

  const row1 = new THREE.Group();
  const sp = 1.18;
  const k1 = lK(matG); k1.position.x = 0;
  const i1 = lI(matG); i1.position.x = sp * 1.0;
  const i2 = lI(matG); i2.position.x = sp * 1.78;
  const t1 = lT(matG); t1.position.x = sp * 2.56;
  row1.add(k1, i1, i2, t1);
  row1.position.set(-1.82, 1.2, 0);
  letterGroup.add(row1);

  const row2 = new THREE.Group();
  const k2 = lK(matAu); k2.position.x = 0;
  const a1 = lA(matAu); a1.position.x = sp * 1.0;
  const f1 = lF(matAu); f1.position.x = sp * 1.82;
  const e1 = lE(matAu); e1.position.x = sp * 2.62;
  row2.add(k2, a1, f1, e1);
  row2.position.set(-1.6, -0.72, 0);
  letterGroup.add(row2);

  // CAFE ITEMS (Simplified helpers)
  function makeCoffeeCup(cupColor) {
    const g = new THREE.Group();
    const cMat = new THREE.MeshStandardMaterial({ color: cupColor || 0xede8df, metalness: 0.05, roughness: 0.6 });
    const brMat = new THREE.MeshStandardMaterial({ color: 0x2c1206, roughness: 0.85 });
    const crMat = new THREE.MeshStandardMaterial({ color: 0xc8845a, metalness: 0.15, roughness: 0.55 });
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.55, 16), cMat));
    const cs = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.04, 16), brMat); cs.position.y = 0.24; g.add(cs);
    const fr = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 20), crMat); fr.rotation.x = Math.PI/2; fr.position.y = 0.27; g.add(fr);
    const h = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.038, 8, 20, Math.PI), cMat); h.rotation.y = Math.PI/2; h.position.set(0.26, 0, 0); g.add(h);
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.07, 20), cMat); saucer.position.set(0, -0.32, 0); g.add(saucer);
    return g;
  }
  function makeSodaCan(bodyCol, labelCol) {
    const g = new THREE.Group();
    const bMat = new THREE.MeshStandardMaterial({ color: bodyCol, metalness: 0.72, roughness: 0.18 });
    const tMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.9, roughness: 0.12 });
    const lMat = new THREE.MeshStandardMaterial({ color: labelCol || 0xffffff, transparent: true, opacity: 0.8, roughness: 0.8 });
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.72, 20), bMat));
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.206, 0.206, 0.38, 20), lMat));
    const topD = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI*2, 0, Math.PI/2.8), tMat); topD.position.y = 0.36; g.add(topD);
    const botD = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI*2, (Math.PI*2.2)/3, Math.PI/2.8), tMat); botD.position.y = -0.36; g.add(botD);
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.025, 0.14), tMat); tab.position.set(0.05, 0.49, 0); g.add(tab);
    return g;
  }
  function makeLaysPacket(bagCol) {
    const g = new THREE.Group();
    const bMat = new THREE.MeshStandardMaterial({ color: bagCol || 0xf5c518, metalness: 0.35, roughness: 0.4 });
    const rMat = new THREE.MeshStandardMaterial({ color: 0x2c1a0e, metalness: 0.12, roughness: 0.6 });
    const wMat = new THREE.MeshStandardMaterial({ color: 0xede8df, roughness: 0.75 });
    const lTop = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 0.42, 12), bMat); lTop.position.set(0, 0.22, 0); g.add(lTop);
    const lBot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.13, 0.36, 12), bMat); lBot.position.set(0, -0.2, 0); g.add(lBot);
    const lSealT = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.14, 0.1, 12), rMat); lSealT.position.set(0, 0.47, 0); g.add(lSealT);
    const lSealB = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.045, 0.09, 12), rMat); lSealB.position.set(0, -0.4, 0); g.add(lSealB);
    const ld = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 20), wMat); ld.rotation.x = Math.PI/2; ld.position.set(0, 0.04, 0.22); g.add(ld);
    return g;
  }
  function makeTeaMug() {
    const g = new THREE.Group();
    const mMat = new THREE.MeshStandardMaterial({ color: 0x2d8653, metalness: 0.08, roughness: 0.55 });
    const tMat = new THREE.MeshStandardMaterial({ color: 0x4a2008, roughness: 0.85 });
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.52, 16), mMat));
    const tea = new THREE.Mesh(new THREE.CylinderGeometry(0.228, 0.228, 0.04, 16), tMat); tea.position.y = 0.25; g.add(tea);
    const h = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.042, 8, 18, Math.PI), mMat); h.rotation.y = Math.PI/2; h.position.set(0.3, 0, 0); g.add(h);
    return g;
  }
  function makeSandwich() {
    const g = new THREE.Group();
    const breadMat = new THREE.MeshStandardMaterial({ color: 0xc8956b, roughness: 0.85 });
    const crustMat = new THREE.MeshStandardMaterial({ color: 0x8b5e2a, roughness: 0.9 });
    const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x4a7c3f, roughness: 0.8 });
    const tomatoMat = new THREE.MeshStandardMaterial({ color: 0x8b2020, roughness: 0.7 });
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xd4943a, roughness: 0.75 });
    const bBot = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.55), breadMat); bBot.position.y = -0.28; g.add(bBot);
    const bBotC = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 0.55), crustMat); bBotC.position.y = -0.39; g.add(bBotC);
    const lett = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.58), lettuceMat); lett.position.y = -0.14; g.add(lett);
    const tom1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), tomatoMat); tom1.rotation.z = Math.PI/2; tom1.position.set(-0.15, -0.06, 0); g.add(tom1);
    const tom2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16), tomatoMat); tom2.rotation.z = Math.PI/2; tom2.position.set(0.18, -0.06, 0.08); g.add(tom2);
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.05, 0.52), cheeseMat); ch.position.y = 0.02; g.add(ch);
    const bTop = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.55), breadMat); bTop.position.y = 0.18; g.add(bTop);
    const bTopC = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 8, 0, Math.PI*2, 0, Math.PI/2.2), crustMat); bTopC.scale.set(1, 0.45, 0.65); bTopC.position.y = 0.28; g.add(bTopC);
    const pick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6), new THREE.MeshStandardMaterial({ color: 0x6b3a1f })); pick.position.y = 0.35; g.add(pick);
    return g;
  }
  function makeSamosa() {
    const g = new THREE.Group();
    const doughMat = new THREE.MeshStandardMaterial({ color: 0xc8895a, roughness: 0.8 });
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x8b5020, roughness: 0.9 });
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.72, 3, 1), doughMat); body.rotation.y = Math.PI/6; g.add(body);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 3), edgeMat); base.rotation.y = Math.PI/6; base.position.y = -0.36; g.add(base);
    const seam1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 0.06), edgeMat); seam1.rotation.y = Math.PI/6; seam1.position.set(0.32, 0, 0); g.add(seam1);
    return g;
  }
  function makePastry() {
    const g = new THREE.Group();
    const pastryMat = new THREE.MeshStandardMaterial({ color: 0xc8a060, metalness: 0.05, roughness: 0.75 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x7a4a18, roughness: 0.85 });
    const body = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.14, 10, 24, Math.PI*1.3), pastryMat); body.rotation.x = Math.PI/2; g.add(body);
    for (let i = 0; i < 4; i++) {
      const ridge = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.025, 6, 20, Math.PI*1.3), darkMat); ridge.rotation.x = Math.PI/2; ridge.position.y = 0.04*(i+1); g.add(ridge);
    }
    return g;
  }
  function makeDonut() {
    const g = new THREE.Group();
    const doughMat = new THREE.MeshStandardMaterial({ color: 0xd4a96a, metalness: 0.05, roughness: 0.7 });
    const icingMat = new THREE.MeshStandardMaterial({ color: 0x8b2040, metalness: 0.1, roughness: 0.45 });
    const dough = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.17, 14, 32), doughMat); g.add(dough);
    const icing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.16, 8, 32), icingMat); icing.scale.y = 0.45; icing.position.y = 0.1; g.add(icing);
    return g;
  }

  const itemDefs = [
    { fn: () => makeCoffeeCup(0xede8df), name: "Hot Coffee ☕" },
    { fn: () => makeSodaCan(0x8b1a1a, 0xede8df), name: "Coca-Cola 🥤" },
    { fn: () => makeLaysPacket(0xa0522d), name: "Lays Classic 🥔" },
    { fn: () => makeSandwich(), name: "Club Sandwich 🥪" },
    { fn: () => makeSamosa(), name: "Samosa 🫓" },
    { fn: () => makePastry(), name: "Croissant 🥐" },
    { fn: () => makeDonut(), name: "Glazed Donut 🍩" },
    { fn: () => makeCoffeeCup(0xc8a882), name: "Cappuccino ☕" },
    { fn: () => makeSodaCan(0x1a3a5c, 0xede8df), name: "Pepsi 🥤" },
    { fn: () => makeLaysPacket(0x7a3010), name: "Lays Paprika 🌶️" },
    { fn: () => makeTeaMug(), name: "Masala Chai 🍵" },
    { fn: () => makeSandwich(), name: "Veggie Sandwich 🥪" },
    { fn: () => makeSamosa(), name: "Aloo Samosa 🫓" },
    { fn: () => makeDonut(), name: "Choco Donut 🍩" },
    { fn: () => makePastry(), name: "Butter Croissant 🥐" },
    { fn: () => makeSodaCan(0x1a4a2a, 0xc8845a), name: "7UP 🥤" },
    { fn: () => makeCoffeeCup(0x8b6340), name: "Latte ☕" },
    { fn: () => makeLaysPacket(0x2d5a3a), name: "Lays Cream & Onion 🥔" },
    { fn: () => makeDonut(), name: "Chocolate Donut 🍩" },
    { fn: () => makeTeaMug(), name: "Green Tea 🍵" },
  ];

  const positions = [
    [-5.8, 2.8, -3.5], [-4.2, -3.0, -2.5], [-7.0, -0.8, -4.5], [6.2, 3.0, -3.5], [5.4, -2.5, -2.8],
    [7.2, 0.4, -4.2], [-3.5, 4.5, -3.8], [4.8, 4.6, -3.5], [-7.8, 1.2, -5.0], [7.0, -3.8, -5.0],
    [-0.8, -5.0, -3.2], [0.8, 5.5, -4.2], [-6.5, 5.5, -5.5], [8.5, 1.8, -5.5], [3.0, -5.5, -4.8],
    [-2.5, 6.2, -6.0], [6.5, 5.5, -6.0], [-8.5, -2.5, -6.0], [0.0, 7.0, -6.5], [-5.0, -5.5, -5.5],
  ];

  floaters = [];
  positions.forEach((pos, i) => {
    const def = itemDefs[i % itemDefs.length];
    const item = def.fn();
    item.position.set(...pos);
    item.rotation.set(Math.random()*0.6, Math.random()*Math.PI*2, Math.random()*0.4);
    const sc = 0.75 + Math.random()*0.45; item.scale.setScalar(sc);
    item._baseScale = sc; item._baseY = pos[1]; item._off = Math.random()*Math.PI*2;
    item._rs = { x: (Math.random()-0.5)*0.008, y: (Math.random()-0.5)*0.013, z: (Math.random()-0.5)*0.006 };
    item._name = def.name;
    scene.add(item);
    floaters.push(item);
  });

  const ray = new THREE.Raycaster();
  const mVec = new THREE.Vector2();
  let hoveredItem = null;

  function onMouseMove(e) {
    mVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    mVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mxN = (e.clientX / window.innerWidth - 0.5) * 2;
    myN = -(e.clientY / window.innerHeight - 0.5) * 2;

    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      tooltip.style.left = e.clientX + 20 + "px";
      tooltip.style.top = e.clientY - 16 + "px";
    }
  }

  function onClick() {
    if (hoveredItem) {
      const tooltip = document.getElementById("tooltip");
      if (tooltip) tooltip.style.fontWeight = "bold";
      setTimeout(() => { if (tooltip) tooltip.style.fontWeight = "normal"; }, 400);
      hoveredItem._rs.y += 0.08;
    }
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("click", onClick);

  function animate(t) {
    landingRequestID = requestAnimationFrame(animate);

    // Parallax
    camera.position.x += (mxN * 0.4 - camera.position.x) * 0.05;
    camera.position.y += (myN * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Update rings
    bgRings.forEach((r) => { r.rotation.y += r._ry; r.rotation.x += r._rx; });

    // Update panels
    geoPlanes.forEach((p) => { p.position.y += Math.sin(t * 0.001 + p._off) * 0.003; });

    // Update steam
    steamWisps.forEach((w) => {
      w.position.y += w._speed * 0.02;
      w.position.x = w._baseX + Math.sin(t * 0.001 + w._phase) * 0.25;
      w.rotation.z += 0.01;
      const life = (w.position.y + 4) / 8;
      w.material.opacity = life < 0.2 ? life * 5 * w._maxOp : life > 0.8 ? (1 - life) * 5 * w._maxOp : w._maxOp;
      if (w.position.y > 4) { w.position.y = -4; w.material.opacity = 0; }
    });

    // Update items
    ray.setFromCamera(mVec, camera);
    let topInt = null;
    floaters.forEach((it) => {
      it.position.y = it._baseY + Math.sin(t * 0.001 + it._off) * 0.18;
      it.rotation.x += it._rs.x; it.rotation.y += it._rs.y; it.rotation.z += it._rs.z;

      const intersects = ray.intersectObjects(it.children, true);
      if (intersects.length > 0) topInt = it;
    });

    const tooltip = document.getElementById("tooltip");
    if (topInt) {
      if (hoveredItem !== topInt) {
        hoveredItem = topInt;
        if (tooltip) {
          tooltip.innerText = hoveredItem._name;
          tooltip.style.opacity = 1;
        }
      }
      topInt.scale.lerp(new THREE.Vector3().setScalar(topInt._baseScale * 1.3), 0.1);
    } else {
      hoveredItem = null;
      if (tooltip) tooltip.style.opacity = 0;
      floaters.forEach((it) => it.scale.lerp(new THREE.Vector3().setScalar(it._baseScale), 0.1));
    }

    renderer.render(scene, camera);
  }
  animate(0);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function stopLandingDesign() {
  if (landingRequestID) cancelAnimationFrame(landingRequestID);
  landingRequestID = null;
  // Further cleanup if necessary
}
