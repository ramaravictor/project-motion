// Rama voxel (v2): komponen Three.js r128. Pakai:
//   const rv = RamaVoxel.create(420);            // ukuran kanvas (px)
//   el.appendChild(rv.canvas);
//   rv.render({ t, vol, viseme, blink, pose, fromPose, k, look });
// pose: 'present' | 'point' | 'thumbs' | 'shocked'. fromPose + k (0..1) = transisi antar-pose.
// look: -1 (menoleh ke kiri layar) .. 1 (kanan layar). Semua deterministik dari argumen.
window.RamaVoxel = (() => {
  const MO = { v0: [20, 2.5], v1: [22, 7], v2: [11, 8], v3: [15, 12], v4: [21, 15], v5: [15, 21] };
  // Lengan: sz = buka ke samping, sx = maju (bahu); ez, ex = siku. Vektor tangan [keluar, atas, depan].
  const ARM = {
    rest:    { sz: 0.06, sx: -0.1, ez: 0.0, ex: -0.35, fing: [0.05, -1, 0.2], palm: [-0.6, 0, 0.8], hand: 'open' },
    present: { sz: 0.3, sx: -0.55, ez: 0.55, ex: -1.0, fing: [0.7, 0.25, 0.65], palm: [0, 1, 0.1], hand: 'open', talk: 1 },
    // lengan atas serong ke luar-bawah, lengan bawah tegak ke atas di samping wajah
    point:   { sz: 0.9, sx: -0.15, ez: 2.24, ex: 0.0, fing: [0, 1, 0.12], palm: [0, 0, 1], hand: 'point', index: [0, 1, 0.08] },
    // kepalan di samping dada, buku jari ke depan, jempol ke atas
    thumbs:  { sz: 0.7, sx: -0.5, ez: 2.1, ex: 0.0, fing: [0.15, 0, 1], palm: [-1, 0, 0], hand: 'fist', thumb: [0, 1, 0] },
    shock:   { sz: 2.65, sx: -0.25, ez: 0.65, ex: 0.0, fing: [-0.15, 1, 0.15], palm: [0, 0, 1], hand: 'open', thumb: [-1, 0.35, 0.3] },
  };
  const SET = { present: { R: 'present', L: 'rest' }, point: { R: 'point', L: 'rest' }, thumbs: { R: 'thumbs', L: 'rest' }, shocked: { R: 'shock', L: 'shock' } };
  const C = { white: 0xffffff, gold: 0xc9a24b, navy: 0x1b2650, skin: 0xf2c29b, skinD: 0xd9976e, hair: 0x16161a, frame: 0x0b0b0d, lens: 0x9fb3c8, mouth: 0x5b1f22 };

  function create(size) {
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1); r.setSize(size, size);
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 100); cam.position.set(0, -0.7, 12); cam.lookAt(0, -0.9, 0);
    sc.add(new THREE.HemisphereLight(0xffffff, 0x334477, 0.7));
    const dl = new THREE.DirectionalLight(0xffffff, 0.85); dl.position.set(3, 4, 5); sc.add(dl);
    const rim = new THREE.DirectionalLight(0xff7a3a, 0.7); rim.position.set(-4, 2, -3); sc.add(rim);
    const EDGE = new THREE.LineBasicMaterial({ color: 0x0a0a0c });
    const MAT = {}; const mat = c => MAT[c] || (MAT[c] = new THREE.MeshLambertMaterial({ color: c }));
    const box = (g, w, h, d, c, x, y, z) => {
      const geo = new THREE.BoxGeometry(w, h, d), m = new THREE.Mesh(geo, mat(c));
      m.position.set(x, y, z); m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), EDGE)); g.add(m); return m;
    };
    const grp = (parent, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };

    // badan
    const bodyG = grp(sc, 0, 0, 0);
    box(bodyG, 3.2, 2.5, 1.6, C.white, 0, -3.25, 0);
    box(bodyG, 0.9, 0.12, 1.62, C.gold, -1.15, -2.05, 0); box(bodyG, 0.9, 0.12, 1.62, C.gold, 1.15, -2.05, 0);
    box(bodyG, 0.8, 0.14, 0.1, C.navy, 0, -2.08, 0.81);
    box(bodyG, 0.26, 0.26, 0.06, C.gold, 0.75, -2.45, 0.82);
    box(bodyG, 0.7, 1.1, 0.7, C.skinD, 0, -1.5, 0); // leher sampai dagu, kepala tidak melayang

    // lengan (s = -1: kanan Rama = kiri layar)
    function arm(s) {
      const sh = grp(bodyG, s * 1.78, -2.2, 0);
      box(sh, 0.62, 0.62, 0.62, C.white, 0, 0, 0);
      box(sh, 0.56, 0.7, 0.56, C.white, 0, -0.42, 0);
      box(sh, 0.58, 0.1, 0.58, C.gold, 0, -0.75, 0);
      box(sh, 0.42, 0.26, 0.42, C.skin, 0, -0.92, 0);
      const el = grp(sh, 0, -1.02, 0);
      box(el, 0.42, 0.76, 0.42, C.skin, 0, -0.38, 0);
      const hand = grp(el, 0, -0.78, 0);
      box(hand, 0.46, 0.36, 0.22, C.skin, 0, -0.18, 0);
      const open = grp(hand, 0, 0, 0);
      [-0.17, -0.057, 0.057, 0.17].forEach(x => box(open, 0.1, 0.3, 0.18, C.skin, x, -0.5, 0));
      const fist = box(hand, 0.46, 0.18, 0.3, C.skin, 0, -0.42, 0.06);
      const three = box(hand, 0.34, 0.18, 0.3, C.skin, -s * 0.06, -0.42, 0.06);
      const index = grp(hand, s * 0.17, -0.36, 0); box(index, 0.11, 0.34, 0.13, C.skin, 0, -0.17, 0);
      const thumb = grp(hand, s * 0.25, -0.1, 0.04); box(thumb, 0.13, 0.26, 0.14, C.skin, 0, -0.13, 0);
      return { s, sh, el, hand, open, fist, three, index, thumb };
    }
    const ARMS = { R: arm(-1), L: arm(1) };

    // kepala
    const head = grp(sc, 0, -1.55, 0);
    const H = (w, h, d, c, x, y, z) => box(head, w, h, d, c, x, y + 1.55, z);
    H(2, 2, 2, C.skin, 0, 0, 0);
    H(2.12, 0.5, 2.12, C.hair, 0, 1.2, -0.02);
    H(0.92, 0.42, 0.16, C.hair, -0.56, 0.8, 1.02); H(0.92, 0.42, 0.16, C.hair, 0.56, 0.8, 1.02);
    H(0.14, 1.0, 1.9, C.hair, -1.04, 0.55, -0.05); H(0.14, 1.0, 1.9, C.hair, 1.04, 0.55, -0.05);
    H(0.22, 0.4, 0.4, C.skin, -1.12, 0, 0); H(0.22, 0.4, 0.4, C.skin, 1.12, 0, 0);
    [-0.48, 0.48].forEach(x => { H(0.78, 0.56, 0.08, C.frame, x, 0.05, 1.03); H(0.56, 0.34, 0.08, C.lens, x, 0.05, 1.06); });
    const eyes = [-0.48, 0.48].map(x => H(0.26, 0.09, 0.06, C.hair, x, 0.04, 1.11));
    H(0.2, 0.08, 0.08, C.frame, 0, 0.12, 1.05);
    const brows = [-0.48, 0.48].map(x => H(0.6, 0.08, 0.06, C.hair, x, 0.48, 1.03));
    H(0.18, 0.26, 0.2, C.skinD, 0, -0.32, 1.08);
    H(0.6, 0.08, 0.06, C.hair, 0, -0.56, 1.03);
    const mouth = H(0.46, 0.14, 0.04, C.mouth, 0, -0.76, 1.02);

    // orientasi tangan/jari dalam ruang badan
    const V = (a, s) => new THREE.Vector3(s * a[0], a[1], a[2]).normalize();
    const fq = new THREE.Quaternion(), pq = new THREE.Quaternion();
    function setWorld(obj, wq) { obj.parent.updateMatrixWorld(true); obj.parent.getWorldQuaternion(pq); obj.quaternion.copy(pq.invert().multiply(wq)); }
    function orient(obj, fing, palm) {
      const y = fing.clone().negate(), z = palm.clone(); z.sub(y.clone().multiplyScalar(z.dot(y))).normalize();
      const x = new THREE.Vector3().crossVectors(y, z);
      const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
      setWorld(obj, fq.clone().multiply(q));
    }
    function aim(obj, dir) { setWorld(obj, fq.clone().multiply(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir))); }
    const lerp = (a, b, k) => a + (b - a) * k;
    const lerpV = (a, b, k, s) => V(a, s).lerp(V(b, s), k).normalize();

    function applyArm(A, a, b, k, t, vol) {
      const s = A.s, m = key => lerp(a[key], b[key], k);
      const talk = (b.talk ? vol * 0.18 * Math.sin(t * 5) : 0) * k;
      A.sh.rotation.set(m('sx'), 0, s * m('sz'));
      A.el.rotation.set(m('ex') + talk, 0, s * m('ez'));
      sc.updateMatrixWorld(true); bodyG.getWorldQuaternion(fq);
      orient(A.hand, lerpV(a.fing, b.fing, k, s), lerpV(a.palm, b.palm, k, s));
      const P = k < 0.5 ? a : b;
      A.open.visible = P.hand === 'open'; A.fist.visible = P.hand === 'fist';
      A.three.visible = A.index.visible = P.hand === 'point';
      if (P.hand === 'point') aim(A.index, V(P.index, s));
      if (P.thumb) aim(A.thumb, V(P.thumb, s)); else A.thumb.rotation.set(0, 0, s * 0.45);
    }

    function render(st) {
      const t = st.t || 0, vol = st.vol || 0, pose = SET[st.pose] ? st.pose : 'present';
      const from = SET[st.fromPose] ? st.fromPose : pose, k = st.k == null ? 1 : Math.max(0, Math.min(1, st.k));
      const look = st.look || 0;
      const [w, h] = MO[st.viseme] || MO.v0;
      mouth.scale.set(w / 18, Math.max(0.3, h / 6), 1);
      eyes.forEach(e => { e.scale.y = st.blink ? 0.3 : 1; });
      const shockK = (from === 'shocked' ? 1 - k : 0) + (pose === 'shocked' ? k : 0);
      brows.forEach(b => { b.position.y = 0.48 + 1.55 + shockK * 0.14; });
      head.rotation.set(vol > 0.15 ? -Math.abs(Math.sin(t * 18)) * 0.06 * vol : 0,
        look * 0.35 + Math.sin(t * 1.4) * 0.12, Math.sin(t * 2.2) * 0.04 * (1 + vol));
      bodyG.rotation.y = look * 0.35 * 0.35;
      for (const side of ['R', 'L']) applyArm(ARMS[side], ARM[SET[from][side]], ARM[SET[pose][side]], k, t, vol);
      r.render(sc, cam);
    }
    return { canvas: r.domElement, render };
  }

  // lip-sync & kedip (rumus AGENTS.md bagian 4)
  const PAT = ['v3', 'v4', 'v1', 'v3', 'v2', 'v4', 'v0', 'v3', 'v1', 'v4', 'v2', 'v3'];
  function viseme(frameIdx, vol, pose) {
    if (vol < 0.14) return 'v0';
    const step = Math.floor(frameIdx / 2);
    if (vol < 0.32) return step % 2 === 0 ? 'v2' : 'v1';
    const p = PAT[step % PAT.length];
    return pose === 'shocked' && p === 'v4' && vol > 0.72 ? 'v5' : p;
  }
  const blink = t => ((t + 1.2) % 3.4) < 0.13;
  return { create, viseme, blink, POSES: Object.keys(SET) };
})();
