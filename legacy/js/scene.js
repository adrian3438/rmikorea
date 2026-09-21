/* RMI scroll-driven 3D stage — plain script, registers window.RMI3D. Requires global THREE (r128 UMD). */
(function () {
  var T = window.THREE;
  if (!T) { console.error('[RMI3D] three.js not loaded'); return; }
  if (window.RMI3D) return; // the script may be injected more than once

  var renderer, scene, camera, model, pins = [], canvas, W = 1, H = 1, frame = 0;
  var cur = { x: 0, y: 1.9, z: 0, r: 30, th: 0.85, ph: 1.06 };
  var tgt = { x: 0, y: 1.9, z: 0, r: 30, th: 0.85, ph: 1.06 };
  var dragTh = 0, dragPh = 0, dragging = false, px = 0, py = 0, spin = 0, lateral = 0, pinAmt = 0, progress = 0, bound = false;

  var STAGES = [
    { x: 0, y: 1.9, z: 0, r: 30, th: 0.85, ph: 1.06 },    // hero — whole skid
    { x: 0, y: 1.8, z: 0, r: 20, th: -0.45, ph: 1.0 },   // sales meeting room
    { x: 0, y: 2.0, z: 0, r: 17, th: 0.15, ph: 1.45 },   // snapshot — front elevation
    { x: 2.4, y: 1.6, z: 0.9, r: 6.5, th: 0.95, ph: 1.2 }, // pin issue — pump / valve bay
    { x: -3.4, y: 2.4, z: 1.4, r: 7, th: -1.0, ph: 1.05 }, // inspection — vessel module
    { x: -0.7, y: 2.3, z: 0.4, r: 9.5, th: 0.55, ph: 1.18 },  // iot — instrumentation / cabinets
    { x: 1.2, y: 1.9, z: 0, r: 14, th: -1.75, ph: 1.15 },      // digital manual — service side
    { x: 0, y: 1.9, z: 0, r: 32, th: 2.3, ph: 1.0 }        // outro
  ];

  function mat(c, m, r) { return new T.MeshStandardMaterial({ color: c, metalness: m, roughness: r }); }
  var frameM = mat(0x7b8083, 0.9, 0.42),      // galvanised structural steel
      deckM = mat(0x5f6467, 0.85, 0.55),
      cabM = mat(0xdedcd8, 0.25, 0.4),        // painted cabinet enclosures
      vesselM = mat(0xa9aeb0, 0.95, 0.25),    // machined stainless
      pipeM = mat(0xd3d98a, 0.55, 0.35),      // yellow process piping
      pipeM2 = mat(0xb9c05f, 0.55, 0.38),
      valveM = mat(0x2f62d8, 0.45, 0.32),     // blue actuators
      pumpM = mat(0x4b7f4f, 0.5, 0.38),       // green pump casing
      oliveM = mat(0x9aa05a, 0.7, 0.35),
      darkM = mat(0x33302f, 0.7, 0.5),
      boltM = mat(0x8d9093, 0.95, 0.3),
      glassM = new T.MeshStandardMaterial({ color: 0xe8eef2, metalness: 0.1, roughness: 0.08 }),
      redM = mat(0xec3013, 0.4, 0.4);

  function box(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o; }
  function cyl(r1, r2, h, m, x, y, z, rx, rz) {
    var o = new T.Mesh(new T.CylinderGeometry(r1, r2, h, 26), m);
    o.position.set(x, y, z); o.rotation.x = rx || 0; o.rotation.z = rz || 0; return o;
  }
  function boltRing(r, n, rb, m) {
    var g = new T.Group();
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      var b = new T.Mesh(new T.CylinderGeometry(rb, rb, 0.05, 6), m || boltM);
      b.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); g.add(b);
    }
    return g;
  }
  function flange(r) { // a bolted flange disc lying in the XZ plane, caller orients it
    var g = new T.Group();
    g.add(new T.Mesh(new T.CylinderGeometry(r * 1.9, r * 1.9, 0.07, 26), vesselM));
    g.add(boltRing(r * 1.48, 8, 0.028));
    return g;
  }
  function orient(obj, dir) { obj.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.clone().normalize()); return obj; }
  function pipe(a, b, r, m) {
    var A = new T.Vector3().fromArray(a), B = new T.Vector3().fromArray(b), d = new T.Vector3().subVectors(B, A);
    var o = new T.Mesh(new T.CylinderGeometry(r, r, d.length(), 18), m || pipeM);
    o.position.copy(A).addScaledVector(d, 0.5);
    return orient(o, d);
  }
  function run(pts, r, m, flanged) {
    var g = new T.Group();
    for (var i = 0; i < pts.length - 1; i++) {
      var A = new T.Vector3().fromArray(pts[i]), B = new T.Vector3().fromArray(pts[i + 1]), d = new T.Vector3().subVectors(B, A);
      g.add(pipe(pts[i], pts[i + 1], r, m));
      var j = new T.Mesh(new T.SphereGeometry(r * 1.06, 16, 12), m || pipeM);
      j.position.copy(B); g.add(j);
      if (flanged !== false && i === 0) { var f0 = flange(r); f0.position.copy(A).addScaledVector(d.clone().normalize(), r * 2.2); orient(f0, d); g.add(f0); }
      if (flanged !== false && i === pts.length - 2) { var f1 = flange(r); f1.position.copy(B).addScaledVector(d.clone().normalize(), -r * 2.2); orient(f1, d); g.add(f1); }
    }
    return g;
  }
  function valve(x, y, z, s, rot) {
    var g = new T.Group(); s = s || 1;
    g.add(box(0.36 * s, 0.3 * s, 0.28 * s, valveM, 0, 0.36 * s, 0));          // actuator body
    g.add(cyl(0.09 * s, 0.09 * s, 0.12 * s, valveM, 0, 0.55 * s, 0));         // limit switch box
    g.add(box(0.14 * s, 0.1 * s, 0.1 * s, darkM, 0.22 * s, 0.4 * s, 0));
    g.add(cyl(0.085 * s, 0.085 * s, 0.34 * s, boltM, 0, 0.1 * s, 0));         // yoke / stem
    g.add(cyl(0.2 * s, 0.2 * s, 0.1 * s, vesselM, 0, -0.06 * s, 0));          // bonnet
    var f = flange(0.13 * s); f.position.y = -0.14 * s; g.add(f);
    g.position.set(x, y, z); if (rot) g.rotation.y = rot;
    return g;
  }
  function gauge(x, y, z, ry) {
    var g = new T.Group();
    g.add(cyl(0.13, 0.13, 0.05, vesselM, 0, 0, 0, Math.PI / 2));
    var face = cyl(0.115, 0.115, 0.012, glassM, 0, 0.032, 0, Math.PI / 2); g.add(face);
    g.add(box(0.01, 0.085, 0.012, redM, 0.03, 0.04, 0.02));
    g.add(cyl(0.035, 0.035, 0.16, boltM, 0, -0.11, 0));
    g.position.set(x, y, z); if (ry) g.rotation.y = ry;
    return g;
  }
  function jbox(x, y, z, s) {
    var g = new T.Group(); s = s || 1;
    g.add(box(0.3 * s, 0.4 * s, 0.22 * s, darkM, 0, 0, 0));
    g.add(box(0.26 * s, 0.03 * s, 0.01 * s, boltM, 0, 0.12 * s, 0.12 * s));
    [-0.09, 0.09].forEach(function (o) { g.add(cyl(0.035 * s, 0.035 * s, 0.1 * s, boltM, o * s, -0.24 * s, 0)); });
    g.position.set(x, y, z); return g;
  }
  function motor(len, r, m) { // finned electric motor
    var g = new T.Group();
    g.add(cyl(r, r, len, m, 0, 0, 0, 0, Math.PI / 2));
    for (var i = -len / 2 + 0.06; i < len / 2; i += 0.075) g.add(cyl(r * 1.1, r * 1.1, 0.02, m, i, 0, 0, 0, Math.PI / 2));
    g.add(cyl(r * 0.95, r * 0.95, 0.06, darkM, len / 2 + 0.03, 0, 0, 0, Math.PI / 2));
    g.add(box(0.2, 0.16, 0.18, darkM, 0, r * 1.05, 0));                       // terminal box
    g.add(box(len * 0.9, 0.06, r * 1.8, darkM, 0, -r * 1.05, 0));             // foot
    return g;
  }

  function buildModel() {
    var g = new T.Group();

    // ================= main skid frame =================
    var legs = [-4.4, -2.2, 0, 2.2, 4.4];
    legs.forEach(function (x) {
      [-1.7, 1.7].forEach(function (z) {
        g.add(box(0.2, 0.95, 0.2, frameM, x, 0.56, z));
        g.add(box(0.36, 0.06, 0.36, darkM, x, 0.06, z));                      // base plate
        g.add(boltRing(0.12, 4, 0.025).translateX(x).translateY(0.1).translateZ(z));
      });
    });
    [-1.7, 1.7].forEach(function (z) {
      g.add(box(9.2, 0.2, 0.1, frameM, 0, 1.08, z));                          // I-beam web
      g.add(box(9.2, 0.05, 0.3, frameM, 0, 1.18, z));
      g.add(box(9.2, 0.05, 0.3, frameM, 0, 0.98, z));
      g.add(box(9.2, 0.14, 0.18, frameM, 0, 0.24, z));
    });
    legs.forEach(function (x) { g.add(box(0.16, 0.18, 3.4, frameM, x, 1.08, 0)); });
    g.add(box(9.2, 0.05, 3.4, deckM, 0, 1.0, 0));
    for (var gx = -4.3; gx < 4.4; gx += 0.28) g.add(box(0.02, 0.055, 3.38, deckM, gx, 1.03, 0)); // grating bars

    // ================= left filter / vessel module (own frame, in front) =================
    var mod = new T.Group();
    [-1.0, 1.0].forEach(function (x) {
      [-0.95, 0.95].forEach(function (z) { mod.add(box(0.14, 1.0, 0.14, frameM, x, -0.5, z)); mod.add(box(0.28, 0.05, 0.28, darkM, x, -0.98, z)); });
    });
    mod.add(box(2.45, 2.5, 2.2, vesselM, 0, 1.3, 0));
    mod.add(box(2.5, 0.1, 2.26, darkM, 0, 2.58, 0));
    mod.add(box(2.5, 0.1, 2.26, darkM, 0, 0.04, 0));
    for (var bz = -0.95; bz <= 0.95; bz += 0.38) { mod.add(cyl(0.04, 0.04, 0.06, boltM, 1.24, 2.3, bz, 0, Math.PI / 2)); mod.add(cyl(0.04, 0.04, 0.06, boltM, 1.24, 0.35, bz, 0, Math.PI / 2)); }
    mod.add(box(0.06, 1.9, 1.1, deckM, 1.25, 1.2, 0));                        // inspection door
    mod.add(box(0.1, 0.16, 0.16, boltM, 1.3, 1.2, 0.45));
    mod.add(gauge(1.32, 1.95, -0.3, Math.PI / 2));
    mod.add(cyl(0.3, 0.3, 0.26, vesselM, 0.55, 2.7, 0.45));
    mod.add(flange(0.3).translateX(0.55).translateY(2.84).translateZ(0.45));
    mod.add(cyl(0.14, 0.14, 0.5, vesselM, -0.55, 2.85, -0.35));
    mod.add(valve(-0.55, 3.08, -0.35, 0.85));
    mod.add(jbox(-1.3, 1.5, 0.4, 1.1));
    mod.add(box(0.9, 0.7, 0.5, oliveM, -0.6, 0.35, 1.2));                     // skid-side control box
    mod.position.set(-3.5, 1.0, 1.5); g.add(mod);

    // ================= control cabinets on the deck =================
    [-1.25, -0.15].forEach(function (x, i) {
      var c = new T.Group();
      c.add(box(1.0, 2.0, 0.92, cabM, 0, 1.0, 0));
      c.add(box(0.94, 1.9, 0.02, cabM, 0, 1.0, 0.47));                        // door face
      c.add(box(0.02, 1.9, 0.03, darkM, 0.45, 1.0, 0.48));                    // door seam
      c.add(cyl(0.035, 0.035, 0.09, boltM, 0.38, 1.0, 0.5, Math.PI / 2));     // handle
      c.add(box(0.5, 0.38, 0.02, darkM, -0.08, 1.48, 0.49));
      c.add(box(0.44, 0.32, 0.01, i === 0 ? glassM : redM, -0.08, 1.48, 0.5));
      [0, 1, 2].forEach(function (k) { c.add(cyl(0.032, 0.032, 0.025, k === 1 ? redM : glassM, -0.26 + k * 0.16, 1.14, 0.49, Math.PI / 2)); });
      c.add(box(0.3, 0.1, 0.01, darkM, 0.16, 1.14, 0.49));
      c.add(box(1.06, 0.07, 0.98, deckM, 0, 2.03, 0));                        // canopy
      c.add(box(0.8, 0.12, 0.1, darkM, 0, 2.12, -0.3));
      c.position.set(x, 1.03, 0.4); g.add(c);
    });
    g.add(box(2.6, 0.12, 0.16, darkM, -0.7, 2.3, -0.2));                      // cable tray over the cabinets
    for (var tx = -1.9; tx < 0.6; tx += 0.22) g.add(box(0.02, 0.1, 0.14, boltM, tx, 2.3, -0.2));

    // ================= process bay: vessels, pumps, valves =================
    [[1.5, 0.5, 1.7, oliveM], [2.7, 0.42, 1.45, vesselM]].forEach(function (v) {
      var yb = 1.03;
      g.add(cyl(v[1], v[1], v[2], v[3], v[0], yb + v[2] / 2, -0.6));
      g.add(cyl(v[1] * 1.15, v[1] * 1.15, 0.08, vesselM, v[0], yb + v[2] * 0.55, -0.6));
      g.add(boltRing(v[1] * 1.05, 10, 0.03).translateX(v[0]).translateY(yb + v[2] * 0.55 + 0.05).translateZ(-0.6));
      var dome = new T.Mesh(new T.SphereGeometry(v[1], 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), v[3]);
      dome.position.set(v[0], yb + v[2], -0.6); g.add(dome);
      g.add(cyl(v[1] * 1.2, v[1] * 1.2, 0.1, vesselM, v[0], yb + 0.05, -0.6));
      g.add(valve(v[0], yb + v[2] + v[1] * 0.8, -0.6, 0.75));
      g.add(gauge(v[0] + v[1] + 0.1, yb + v[2] * 0.7, -0.6));
      g.add(box(0.1, v[2], 0.1, frameM, v[0] + v[1] + 0.22, yb + v[2] / 2, -0.6)); // support post
    });

    // centrifugal pump set (PIN Issue focus)
    var pump = new T.Group();
    pump.add(box(1.9, 0.14, 1.0, darkM, 0, 0.07, 0));                         // baseplate
    pump.add(box(1.9, 0.06, 1.06, boltM, 0, 0.15, 0));
    var m1 = motor(0.95, 0.36, pumpM); m1.position.set(0.5, 0.55, 0); pump.add(m1);
    pump.add(cyl(0.12, 0.12, 0.22, boltM, -0.04, 0.55, 0, 0, Math.PI / 2));   // coupling
    pump.add(box(0.26, 0.3, 0.3, boltM, -0.04, 0.55, 0));                     // coupling guard
    var volute = new T.Mesh(new T.SphereGeometry(0.4, 22, 16), pumpM);
    volute.scale.set(1, 1, 0.75); volute.position.set(-0.5, 0.58, 0); pump.add(volute);
    pump.add(cyl(0.26, 0.26, 0.4, pumpM, -0.5, 1.02, 0));                     // discharge nozzle
    pump.add(flange(0.24).translateX(-0.5).translateY(1.2));
    pump.add(cyl(0.3, 0.3, 0.3, pumpM, -0.9, 0.58, 0, 0, Math.PI / 2));       // suction nozzle
    var sf = flange(0.28); sf.rotation.z = Math.PI / 2; sf.position.set(-1.06, 0.58, 0); pump.add(sf);
    pump.add(gauge(-0.5, 1.42, 0.12));
    pump.position.set(2.5, 1.06, 0.95); g.add(pump);

    // small duty pump + strainer
    var p2 = new T.Group();
    p2.add(box(1.1, 0.12, 0.7, darkM, 0, 0.06, 0));
    var m2 = motor(0.6, 0.24, oliveM); m2.position.set(0.3, 0.38, 0); p2.add(m2);
    p2.add(cyl(0.26, 0.26, 0.3, pumpM, -0.32, 0.38, 0, 0, Math.PI / 2));
    p2.add(cyl(0.16, 0.16, 0.3, vesselM, -0.32, 0.68, 0));
    p2.position.set(0.55, 1.06, -1.15); g.add(p2);

    // valve manifold on the right bay
    [[3.9, 1.5, -0.2], [3.9, 1.5, 0.5]].forEach(function (v) {
      g.add(run([[v[0], v[1], v[2] - 0.35], [v[0], v[1], v[2] + 0.35]], 0.12));
      g.add(valve(v[0], v[1] + 0.12, v[2], 0.8));
    });
    g.add(jbox(4.25, 1.7, 1.2, 1.3));
    g.add(jbox(-2.0, 1.75, 1.5, 1.1));

    // ================= piping =================
    g.add(run([[-3.5, 3.9, 1.95], [-3.5, 4.6, 1.95], [-3.5, 4.6, 0.2], [-1.0, 4.6, 0.2], [-1.0, 4.6, -0.6], [1.5, 4.6, -0.6], [1.5, 2.9, -0.6]], 0.15));
    g.add(run([[2.7, 2.65, -0.6], [2.7, 3.5, -0.6], [4.35, 3.5, -0.6], [4.35, 3.5, 1.35], [4.35, 1.95, 1.35]], 0.13, pipeM2));
    g.add(run([[4.35, 1.95, 1.35], [3.55, 1.95, 1.35], [3.55, 1.64, 1.35], [3.0, 1.64, 0.95]], 0.13, pipeM2));
    g.add(run([[1.44, 1.64, 0.95], [0.9, 1.64, 0.95], [0.9, 1.64, 1.5], [-2.0, 1.64, 1.5], [-2.0, 1.64, 2.0], [-2.6, 1.64, 2.0]], 0.14));
    g.add(run([[3.9, 1.5, 0.15], [3.9, 1.5, -0.2]], 0.12, pipeM2));
    g.add(run([[1.5, 1.7, -1.15], [1.1, 1.7, -1.15], [1.1, 1.44, -1.15]], 0.11, pipeM2));
    g.add(valve(0.3, 1.78, 1.5, 0.8));
    g.add(valve(-1.0, 4.74, -0.2, 0.8));
    g.add(valve(3.2, 3.64, -0.6, 0.8));
    g.add(gauge(-2.0, 1.95, 1.72));

    // ================= handrail, ladder, nameplate =================
    g.add(pipe([-4.4, 2.1, -1.72], [4.4, 2.1, -1.72], 0.045, frameM));
    g.add(pipe([-4.4, 1.62, -1.72], [4.4, 1.62, -1.72], 0.035, frameM));
    for (var k = -4.4; k <= 4.4; k += 1.47) g.add(pipe([k, 1.06, -1.72], [k, 2.14, -1.72], 0.045, frameM));
    var lad = new T.Group();
    lad.add(pipe([-0.2, 0, 0], [-0.2, 1.1, 0], 0.035, frameM));
    lad.add(pipe([0.2, 0, 0], [0.2, 1.1, 0], 0.035, frameM));
    for (var ry = 0.15; ry < 1.1; ry += 0.22) lad.add(pipe([-0.2, ry, 0], [0.2, ry, 0], 0.025, frameM));
    lad.position.set(-1.2, 0, 1.78); g.add(lad);
    g.add(box(0.5, 0.22, 0.02, boltM, 4.0, 1.5, 1.72));
    return g;
  }

  function pinTexture(label) {
    var c = document.createElement('canvas'); c.width = 384; c.height = 128;
    var x = c.getContext('2d');
    x.fillStyle = 'rgba(236,48,19,0.95)'; x.fillRect(0, 26, 384, 76);
    x.fillStyle = '#fff'; x.font = 'bold 40px Archivo, system-ui, sans-serif';
    x.textBaseline = 'middle'; x.fillText(label, 22, 66);
    var t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
  }
  function makePin(label, x, y, z) {
    var g = new T.Group();
    var s = new T.Sprite(new T.SpriteMaterial({ map: pinTexture(label), transparent: true, depthTest: false }));
    s.scale.set(1.3, 0.44, 1); s.position.set(0.82, 0.42, 0);
    var dot = new T.Mesh(new T.SphereGeometry(0.075, 14, 12), new T.MeshBasicMaterial({ color: 0xec3013, depthTest: false, transparent: true }));
    var ring = new T.Mesh(new T.RingGeometry(0.13, 0.155, 28), new T.MeshBasicMaterial({ color: 0xec3013, transparent: true, side: T.DoubleSide, depthTest: false }));
    g.userData = { ring: ring, sprite: s, dot: dot };
    g.add(dot); g.add(ring); g.add(s);
    g.position.set(x, y, z); g.visible = false; g.renderOrder = 10;
    return g;
  }

  function envTexture() { // simple studio equirect: bright sky, soft box, dark floor
    var c = document.createElement('canvas'); c.width = 512; c.height = 256;
    var x = c.getContext('2d');
    var grd = x.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, '#6f7a84'); grd.addColorStop(0.45, '#33373a'); grd.addColorStop(0.52, '#161413'); grd.addColorStop(1, '#0a0909');
    x.fillStyle = grd; x.fillRect(0, 0, 512, 256);
    x.fillStyle = 'rgba(255,255,255,0.8)'; x.fillRect(90, 18, 150, 56);
    x.fillStyle = 'rgba(255,255,255,0.4)'; x.fillRect(320, 30, 110, 40);
    var t = new T.CanvasTexture(c); t.mapping = T.EquirectangularReflectionMapping; return t;
  }

  function buildRenderer(el) {
    canvas = el;
    renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    resize();
  }

  function init(el, opts) {
    lateral = (opts && opts.lateral) || 0;
    if (renderer && canvas === el) { resize(); return; }
    if (renderer) { renderer.dispose(); buildRenderer(el); bindDrag(); return; }
    buildRenderer(el);

    scene = new T.Scene();
    scene.fog = new T.Fog(0x0c0b0b, 18, 44);
    camera = new T.PerspectiveCamera(30, 1, 0.1, 200);

    var pmrem = new T.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(envTexture()).texture;

    scene.add(new T.HemisphereLight(0xc3d2e0, 0x0d0b0b, 0.22));
    var key = new T.DirectionalLight(0xffffff, 1.55);
    key.position.set(8, 13, 9); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    var cam = key.shadow.camera; cam.left = -10; cam.right = 10; cam.top = 10; cam.bottom = -10; cam.far = 40;
    key.shadow.bias = -0.0009; scene.add(key);
    var rim = new T.DirectionalLight(0xec3013, 0.22); rim.position.set(-9, 5, -8); scene.add(rim);
    var fill = new T.DirectionalLight(0xa8bcd2, 0.32); fill.position.set(-6, 4, 9); scene.add(fill);

    model = buildModel();
    model.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    scene.add(model);

    var floor = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({ color: 0x080707, metalness: 0.0, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    var grid = new T.GridHelper(60, 60, 0x3d3735, 0x241f1f);
    grid.material.transparent = true; grid.material.opacity = 0.16; grid.position.y = 0.002; scene.add(grid);

    pins = [makePin('LEAK — SEAL', 2.0, 1.7, 0.95), makePin('VIBRATION', 3.1, 1.6, 0.95), makePin('GASKET', 2.7, 2.5, -0.6)];
    pins.forEach(function (p) { scene.add(p); });

    bindDrag();
    window.addEventListener('resize', resize);
    loop();
  }

  function bindDrag() {
    if (bound) return; bound = true;
    window.addEventListener('pointerdown', function (e) {
      if (!canvas || e.target !== canvas) return;
      dragging = true; px = e.clientX; py = e.clientY; canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dragTh += (e.clientX - px) * 0.006; dragPh -= (e.clientY - py) * 0.004;
      dragPh = Math.max(-0.45, Math.min(0.45, dragPh));
      px = e.clientX; py = e.clientY;
    });
    window.addEventListener('pointerup', function () { dragging = false; if (canvas) canvas.style.cursor = 'grab'; });
    canvas.style.cursor = 'grab';
  }

  function resize() {
    if (!canvas || !renderer) return;
    W = canvas.clientWidth || window.innerWidth; H = canvas.clientHeight || window.innerHeight;
    renderer.setSize(W, H, false);
    if (camera) { camera.aspect = W / H; camera.updateProjectionMatrix(); }
  }

  function setProgress(p) { progress = p; }
  function setLateral(v) { lateral = v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    requestAnimationFrame(loop);
    if (!renderer || !camera) return;
    if (++frame % 30 === 0) {
      var live = document.getElementById('rmi-canvas');
      if (live && live !== canvas) { renderer.dispose(); buildRenderer(live); canvas.style.cursor = 'grab'; }
      else resize();
    }

    var n = STAGES.length - 1;
    var p = Math.max(0, Math.min(n, progress));
    var i = Math.min(n - 1, Math.floor(p)), f = p - i, e = f * f * (3 - 2 * f);
    var a = STAGES[i], b = STAGES[i + 1];
    tgt.x = lerp(a.x, b.x, e); tgt.y = lerp(a.y, b.y, e); tgt.z = lerp(a.z, b.z, e);
    tgt.r = lerp(a.r, b.r, e); tgt.th = lerp(a.th, b.th, e); tgt.ph = lerp(a.ph, b.ph, e);

    if (!dragging) { dragTh *= 0.985; dragPh *= 0.985; }
    spin += p < 0.35 ? 0.0015 : 0.0004;

    var k = 0.09;
    cur.x = lerp(cur.x, tgt.x, k); cur.y = lerp(cur.y, tgt.y, k); cur.z = lerp(cur.z, tgt.z, k);
    cur.r = lerp(cur.r, tgt.r, k);
    cur.th = lerp(cur.th, tgt.th + dragTh + spin, k);
    cur.ph = lerp(cur.ph, Math.max(0.35, Math.min(1.5, tgt.ph + dragPh)), k);

    var look = new T.Vector3(cur.x, cur.y, cur.z);
    camera.position.set(
      look.x + cur.r * Math.sin(cur.ph) * Math.cos(cur.th),
      look.y + cur.r * Math.cos(cur.ph),
      look.z + cur.r * Math.sin(cur.ph) * Math.sin(cur.th)
    );
    camera.lookAt(look);
    if (lateral) {
      var right = new T.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      camera.lookAt(look.clone().addScaledVector(right, lateral * cur.r));
    }

    pinAmt = lerp(pinAmt, Math.max(0, 1 - Math.abs(p - 3) * 1.4), 0.12);
    var t = performance.now() * 0.001;
    pins.forEach(function (pin, idx) {
      pin.visible = pinAmt > 0.02;
      var o = Math.max(0, Math.min(1, pinAmt * 1.2 - idx * 0.12));
      pin.userData.sprite.material.opacity = o;
      pin.userData.dot.material.opacity = o;
      var r = pin.userData.ring, ph = (t * 0.7 + idx * 0.3) % 1;
      r.material.opacity = o * (0.85 - 0.6 * ph);
      var sc = 1 + 1.6 * ph; r.scale.set(sc, sc, sc);
      pin.quaternion.copy(camera.quaternion);
    });

    renderer.render(scene, camera);
  }

  window.RMI3D = {
    init: init, setProgress: setProgress, setLateral: setLateral, resize: resize,
    debug: function () { return { p: progress, cur: cur, cam: camera && camera.position.toArray(), tri: renderer && renderer.info.render.triangles }; }
  };
})();
