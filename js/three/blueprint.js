// Responsibility: the shared "3D blueprint" language (Three.js) — white lines
// and translucent skins on brand blue, orange for what matters, a plan grid
// fading into a blue fog. Used by the tank (projet-kordian, home hero) and
// the steel frame (home hero).

import * as THREE from "/js/vendor/three/three.module.min.js";

export { THREE };
export const WHITE = 0xffffff;
export const ORANGE = 0xe45204;
export const BLUE = 0x00235a;
export const SEG = 64;

export const lineMat = (color = WHITE, opacity = 0.9) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });
export const skinMat = (color = WHITE, opacity = 0.07) =>
  new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false });

export const circle = (r, y, n = SEG) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
};

export const segments = (pairs) => new THREE.BufferGeometry().setFromPoints(pairs.flat());
export const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

// Fade helper: every material under an object, from its own base opacity.
export const fadeables = (obj) => {
  const mats = [];
  obj.traverse((o) => o.material && mats.push(o.material));
  mats.forEach((m) => (m.userData.base = m.opacity));
  return mats;
};
export const setFade = (mats, k) => mats.forEach((m) => (m.opacity = m.userData.base * k));

// A scene with the plan grid on the ground and the brand-blue fog (for a
// blue panel). Over a photo, pass { panel: false }: no fog, no grid.
export function blueprintScene({ panel = true } = {}) {
  const scene = new THREE.Scene();
  if (!panel) return scene;
  scene.fog = new THREE.Fog(BLUE, 5.5, 10);
  const grid = new THREE.GridHelper(14, 56, WHITE, WHITE);
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  scene.add(grid);
  return scene;
}

// The plan's footprint on the ground, for a model drawn over a photo:
// dashed dimension circles, the two axes with orange ticks at their ends.
export function footprint(r = 1.5) {
  const g = new THREE.Group();
  [r, r * 1.32].forEach((radius, i) => {
    const loop = new THREE.LineLoop(circle(radius, 0.005, 96), new THREE.LineDashedMaterial({ color: WHITE, transparent: true, opacity: i ? 0.22 : 0.5, dashSize: 0.06, gapSize: 0.05 }));
    loop.computeLineDistances();
    g.add(loop);
  });
  const L = r * 1.45;
  g.add(new THREE.LineSegments(segments([[v3(-L, 0.005, 0), v3(L, 0.005, 0)], [v3(0, 0.005, -L), v3(0, 0.005, L)]]), lineMat(WHITE, 0.28)));
  const t = 0.09;
  const ticks = [];
  [[L, 0], [-L, 0], [0, L], [0, -L]].forEach(([x, z]) => {
    ticks.push(x ? [v3(x, 0.005, -t), v3(x, 0.005, t)] : [v3(-t, 0.005, z), v3(t, 0.005, z)]);
  });
  g.add(new THREE.LineSegments(segments(ticks), lineMat(ORANGE, 1)));
  return g;
}
