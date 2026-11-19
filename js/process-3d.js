// Responsibility: home — « Du plan au réel », the five steps of the process
// told on one 3D steel frame (the hero's, js/three/frame-model.js), each
// step proven by a real Groupe ATC photo (markup, CSS). Driven by the
// existing step observer (js/pages/home.js → goTo(step)), both ways:
//   0 Ingénierie       the plan only — the hall in dashed lines, dimension
//                      ticks, seen from above
//   1 Fabrication      the parts laid flat and sorted on the workshop floor
//   2 Logistique       a truck brings the bundle along the road
//   3 Montage          the truck parks, columns rise, trusses come down on
//                      the crane cable, purlins and bracing
//   4 Mise en service  cladding closes, the site lights come on
// Rendering stops off screen. Loaded on demand by js/pages/home.js.

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { THREE, WHITE, ORANGE, blueprintScene, footprint, lineMat, skinMat, segments, v3, fadeables, setFade } from "./three/blueprint.js";
import { buildFrame, makeColumn, makeTruss, FRAME_DIMS } from "./three/frame-model.js";
import { buildSiteLights } from "./three/site-lights.js";

const { HALF_W, FRAMES, COL_H } = FRAME_DIMS;
const zMax = FRAMES.at(-1);

// A group whose materials fade together (base opacity kept per material).
const fading = (obj) => {
  const mats = fadeables(obj);
  return (k) => {
    obj.visible = k > 0.001;
    setFade(mats, k);
  };
};

// The plan (step 0): a full hall redrawn in dashed lines, its meshes hidden.
function buildPlan() {
  const { group, tl } = buildFrame();
  tl.progress(1);
  group.traverse((o) => {
    if (o.isMesh) o.visible = false;
    if (o.isLine) {
      const orange = o.material.color.getHex() === ORANGE;
      o.material = new THREE.LineDashedMaterial({ color: orange ? ORANGE : WHITE, transparent: true, opacity: orange ? 0.7 : 0.55, dashSize: 0.05, gapSize: 0.04 });
      o.computeLineDistances();
    }
  });
  // Dimension lines: span and length, with end ticks (no figures: a plan, not data).
  const d = 0.45;
  const t = 0.08;
  const cote = new THREE.LineSegments(
    segments([
      [v3(-HALF_W, 0.01, zMax + d), v3(HALF_W, 0.01, zMax + d)],
      [v3(-HALF_W, 0.01, zMax + d - t), v3(-HALF_W, 0.01, zMax + d + t)],
      [v3(HALF_W, 0.01, zMax + d - t), v3(HALF_W, 0.01, zMax + d + t)],
      [v3(HALF_W + d, 0.01, -zMax), v3(HALF_W + d, 0.01, zMax)],
      [v3(HALF_W + d - t, 0.01, -zMax), v3(HALF_W + d + t, 0.01, -zMax)],
      [v3(HALF_W + d - t, 0.01, zMax), v3(HALF_W + d + t, 0.01, zMax)],
    ]),
    lineMat(ORANGE, 1)
  );
  group.add(cote);
  return group;
}

// The workshop (step 1): columns and trusses laid flat, sorted.
function buildParts() {
  const g = new THREE.Group();
  const floor = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([v3(-1.5, 0.006, -1.2), v3(1.5, 0.006, -1.2), v3(1.5, 0.006, 1.2), v3(-1.5, 0.006, 1.2)]),
    new THREE.LineDashedMaterial({ color: WHITE, transparent: true, opacity: 0.4, dashSize: 0.06, gapSize: 0.05 })
  );
  floor.computeLineDistances();
  g.add(floor);
  const pieces = [];
  for (let i = 0; i < 8; i++) {
    const c = makeColumn();
    c.rotation.z = -Math.PI / 2; // lying along x
    c.position.set(-1.35, 0.03, -0.95 + i * 0.13); // a row of columns, left
    g.add(c);
    pieces.push(c);
  }
  for (let i = 0; i < 4; i++) {
    const tr = makeTruss();
    tr.rotation.x = -Math.PI / 2; // lying flat
    tr.scale.setScalar(0.62);
    tr.position.set(0.6, 0.02, -0.75 + i * 0.45); // the trusses side by side, right
    g.add(tr);
    pieces.push(tr);
  }
  return { group: g, pieces: pieces.map((p) => ({ obj: p, fade: fading(p) })) };
}

// The truck (step 2): a low-loader drawn as a technical plan — tractor with
// raked windscreen, side window, grille, headlamps and exhaust; chassis
// rails; deck with stakes and headboard; wheels with hubs and mudguards;
// a load of three steel I-beams, strapped. Moves along +x (cab forward).
function buildTruck() {
  const g = new THREE.Group();
  const W = 0.52; // overall width
  const edges = (geo, color = WHITE, opacity = 0.95, threshold = 25) => new THREE.LineSegments(new THREE.EdgesGeometry(geo, threshold), lineMat(color, opacity));
  const extrudeX = (pts, depth) => {
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    geo.translate(0, 0, -depth / 2);
    return geo;
  };
  const add = (...o) => g.add(...o);
  const loop = (pts, color = WHITE, opacity = 0.8) => new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), lineMat(color, opacity));

  // Tractor cab, side profile extruded across the width.
  const cabGeo = extrudeX([[1.04, 0.16], [1.62, 0.16], [1.62, 0.3], [1.58, 0.34], [1.58, 0.52], [1.5, 0.71], [1.08, 0.73], [1.04, 0.69]], W);
  add(edges(cabGeo), new THREE.Mesh(cabGeo, skinMat(WHITE, 0.1)));
  [-1, 1].forEach((side) => {
    const z = side * (W / 2 + 0.002);
    add(loop([v3(1.12, 0.47, z), v3(1.47, 0.47, z), v3(1.47, 0.66, z), v3(1.12, 0.67, z)], WHITE, 0.7)); // side window
    add(loop([v3(1.1, 0.2, z), v3(1.34, 0.2, z), v3(1.34, 0.44, z), v3(1.1, 0.44, z)], WHITE, 0.35)); // door
  });
  add(loop([v3(1.572, 0.55, -0.21), v3(1.572, 0.55, 0.21), v3(1.508, 0.69, 0.21), v3(1.508, 0.69, -0.21)], WHITE, 0.75)); // windscreen
  add(new THREE.LineSegments(segments([0.37, 0.41, 0.45].map((y) => [v3(1.585, y, -0.17), v3(1.585, y, 0.17)])), lineMat(WHITE, 0.5))); // grille
  [-0.19, 0.19].forEach((z) => {
    const lamp = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.04), new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 1, side: THREE.DoubleSide }));
    lamp.rotation.y = Math.PI / 2;
    lamp.position.set(1.623, 0.25, z);
    add(lamp);
  });
  add(new THREE.Line(segments([[v3(1.0, 0.3, 0.22), v3(1.0, 0.86, 0.22)]]), lineMat(WHITE, 0.8))); // exhaust

  // Chassis rails.
  [-0.15, 0.15].forEach((z) => add(edges(new THREE.BoxGeometry(2.72, 0.04, 0.05).translate(0.25, 0.18, z), WHITE, 0.6)));

  // Deck, stakes, headboard.
  const deck = new THREE.BoxGeometry(2.08, 0.06, W).translate(-0.12, 0.27, 0);
  add(edges(deck), new THREE.Mesh(deck, skinMat(WHITE, 0.08)));
  const stakes = [];
  for (let x = -1.1; x <= 0.86; x += 0.28) [-1, 1].forEach((side) => stakes.push([v3(x, 0.3, (side * W) / 2), v3(x, 0.43, (side * W) / 2)]));
  [-1, 1].forEach((side) => stakes.push([v3(-1.16, 0.43, (side * W) / 2), v3(0.9, 0.43, (side * W) / 2)]));
  add(new THREE.LineSegments(segments(stakes), lineMat(WHITE, 0.55)));
  const head = [[v3(0.92, 0.3, -W / 2), v3(0.92, 0.62, -W / 2)], [v3(0.92, 0.3, W / 2), v3(0.92, 0.62, W / 2)], [v3(0.92, 0.62, -W / 2), v3(0.92, 0.62, W / 2)]];
  [0.4, 0.51].forEach((y) => head.push([v3(0.92, y, -W / 2), v3(0.92, y, W / 2)]));
  add(new THREE.LineSegments(segments(head), lineMat(WHITE, 0.8)));

  // The load: three steel I-beams (orange), and two straps.
  const H = 0.07;
  const F = 0.06;
  const t = 0.012;
  const ibeam = [[-F / 2, 0], [F / 2, 0], [F / 2, t], [t / 2, t], [t / 2, H - t], [F / 2, H - t], [F / 2, H], [-F / 2, H], [-F / 2, H - t], [-t / 2, H - t], [-t / 2, t], [-F / 2, t]];
  [-0.11, 0, 0.11].forEach((z, k) => {
    const shape = new THREE.Shape(ibeam.map(([a, b]) => new THREE.Vector2(a, b)));
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.8, bevelEnabled: false });
    geo.rotateY(Math.PI / 2); // length along x
    geo.translate(-1.02, 0.305 + (k === 1 ? 0.075 : 0), z);
    add(edges(geo, ORANGE, 1, 30));
  });
  [-0.5, 0.35].forEach((x) =>
    add(loop([v3(x, 0.3, -0.18), v3(x, 0.46, -0.16), v3(x, 0.46, 0.16), v3(x, 0.3, 0.18)], WHITE, 0.6))
  );

  // Wheels: rim, hub, one orange mark (the rotation reads, quietly); mudguards.
  const wheels = [];
  const R = 0.11;
  const ring = (r, n = 24) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2;
      const a1 = ((i + 1) / n) * Math.PI * 2;
      pts.push([v3(Math.cos(a0) * r, Math.sin(a0) * r, 0), v3(Math.cos(a1) * r, Math.sin(a1) * r, 0)]);
    }
    return pts;
  };
  const guards = [];
  [1.34, 0.72, -0.62, -0.9].forEach((x) =>
    [-1, 1].forEach((side) => {
      const w = new THREE.Group();
      w.add(new THREE.LineSegments(segments(ring(R)), lineMat(WHITE, 0.95)));
      w.add(new THREE.LineSegments(segments(ring(R * 0.42, 14)), lineMat(WHITE, 0.6)));
      w.add(new THREE.Line(segments([[v3(R * 0.42, 0, 0), v3(R * 0.95, 0, 0)]]), lineMat(ORANGE, 1)));
      w.position.set(x, R, side * (W / 2 - 0.02));
      add(w);
      wheels.push(w);
      // Mudguard: a half arc over the wheel.
      const arc = [];
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * (i / 10);
        arc.push(v3(x + Math.cos(a) * R * 1.3, R + Math.sin(a) * R * 1.3, side * (W / 2 - 0.02)));
      }
      guards.push(...arc.slice(1).map((p, i) => [arc[i], p]));
    })
  );
  add(new THREE.LineSegments(segments(guards), lineMat(WHITE, 0.45)));

  g.userData.wheels = wheels;
  g.userData.radius = R;
  return g;
}

export function createProcess3D(stage) {
  const host = stage.querySelector("[data-process-3d]");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = "process__canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);

  const scene = blueprintScene({ panel: true });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  const world = new THREE.Group();
  scene.add(world);

  const ground = footprint(1.6);
  world.add(ground);
  const plan = buildPlan();
  world.add(plan);
  const parts = buildParts();
  world.add(parts.group);
  const ROAD_Z = -2.25;
  const road = new THREE.Line(segments([[v3(-6, 0.006, ROAD_Z), v3(6, 0.006, ROAD_Z)]]), new THREE.LineDashedMaterial({ color: WHITE, transparent: true, opacity: 0.35, dashSize: 0.12, gapSize: 0.1 }));
  road.computeLineDistances();
  world.add(road);
  const truck = buildTruck();
  truck.scale.setScalar(1.15);
  world.add(truck);
  const frame = buildFrame();
  world.add(frame.group);
  const lights = buildSiteLights(FRAME_DIMS);
  world.add(lights.group);

  const fadePlan = fading(plan);
  const fadeRoad = fading(road);
  const fadeTruck = fading(truck);
  const whites = [];
  frame.group.traverse((o) => o.material?.color?.getHex() === WHITE && whites.push(o.material));

  // --- State, tweened per step ----------------------------------------------
  const st = { plan: 0, parts: 0, road: 0, truck: 0, truckX: -5, dim: 1 };
  const wheels = truck.userData.wheels;
  let lastX = st.truckX;
  let rolling = 0; // recent distance, for the suspension bob
  const apply = () => {
    fadePlan(st.plan);
    parts.pieces.forEach((p, i) => {
      const k = gsap.utils.clamp(0, 1, st.parts * parts.pieces.length - i);
      p.fade(k);
    });
    parts.group.visible = st.parts > 0.001;
    fadeRoad(st.road);
    fadeTruck(st.truck);
    // Rolling: wheels turn with the distance covered (radius 0.1).
    const dx = st.truckX - lastX;
    lastX = st.truckX;
    wheels.forEach((w) => (w.rotation.z -= dx / truck.userData.radius));
    rolling = Math.min(1, rolling * 0.9 + Math.abs(dx) * 8);
    truck.position.set(st.truckX, 0, ROAD_Z);
    whites.forEach((m) => m.color.setScalar(st.dim));
  };
  apply();
  lights.showMasts(0);

  // Camera per step: plan from above, close on the workshop, wide for the
  // road, three-quarter for the assembly, a little closer in service.
  const VIEWS = [
    { x: 0, y: 7.4, z: 1.3, look: [0, 0, 0] },
    { x: 0, y: 4.3, z: 3.9, look: [0, 0, 0.1] },
    { x: -0.3, y: 3.0, z: 4.6, look: [-0.4, 0.15, -1.6] },
    { x: 0, y: 2.9, z: 5.9, look: [0, 0.65, 0] },
    { x: 0, y: 2.6, z: 5.7, look: [0, 0.6, 0] },
  ];
  const cam = { x: 0, y: 7.4, z: 1.3, lx: 0, ly: 0, lz: 0 };
  let aspectK = 1;
  const placeCamera = () => {
    camera.position.set(cam.x, cam.y, cam.z * aspectK);
    camera.lookAt(cam.lx, cam.ly, cam.lz);
  };
  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    aspectK = 1 / Math.min(1, camera.aspect) ** 0.5;
    camera.updateProjectionMatrix();
    placeCamera();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  let t = 0;
  const tick = (_, dt) => {
    t += Math.min(dt, 50) / 1000;
    world.rotation.y = 0.35 + Math.sin(t * 0.25) * 0.1; // a slow sway, never a spin
    truck.position.y = rolling > 0.02 ? Math.abs(Math.sin(t * 22)) * 0.012 * rolling : 0; // suspension while rolling
    rolling *= 0.95;
    placeCamera();
    renderer.render(scene, camera);
  };
  let running = false;
  new IntersectionObserver((entries) => {
    const on = entries.some((e) => e.isIntersecting);
    if (on === running) return;
    running = on;
    on ? gsap.ticker.add(tick) : gsap.ticker.remove(tick);
  }).observe(host);

  // Target state of each step.
  const TARGETS = [
    { plan: 1, parts: 0, road: 0, truck: 0, truckX: -5, dim: 1, frame: "s0", lit: false },
    { plan: 0.25, parts: 1, road: 0, truck: 0, truckX: -5, dim: 1, frame: "s0", lit: false },
    { plan: 0, parts: 0, road: 1, truck: 1, truckX: -0.4, dim: 1, frame: "s0", lit: false },
    { plan: 0, parts: 0, road: 0.6, truck: 0.45, truckX: 2.9, dim: 1, frame: "s3", lit: false },
    { plan: 0, parts: 0, road: 0, truck: 0, truckX: 2.9, dim: 0.62, frame: "s4", lit: true },
  ];

  let current = -1;
  return {
    goTo(step) {
      if (step === current) return;
      const back = step < current;
      current = step;
      const T = TARGETS[step];
      const v = VIEWS[step];
      gsap.to(cam, { x: v.x, y: v.y, z: v.z, lx: v.look[0], ly: v.look[1], lz: v.look[2], duration: 1.4, ease: "power3.inOut", overwrite: true });
      gsap.to(st, {
        plan: T.plan,
        parts: T.parts,
        road: T.road,
        truck: T.truck,
        truckX: T.truckX,
        dim: T.dim,
        duration: step === 2 && !back ? 2.4 : step === 1 && !back ? 1.6 : 1.2,
        ease: step === 2 && !back ? "power2.out" : "power2.inOut",
        overwrite: true,
        onUpdate: apply,
      });
      // The frame: built only from the assembly on, rewound quickly going back.
      gsap.killTweensOf(frame.tl);
      const label = frame.tl.labels[T.frame];
      if (label > frame.tl.time()) frame.tl.tweenTo(T.frame, { ease: "none" });
      else frame.tl.tweenTo(T.frame, { duration: 0.7, ease: "power2.inOut" });
      lights.showMasts(step >= 3 ? 1 : 0);
      lights.switchOn(T.lit);
    },
  };
}
