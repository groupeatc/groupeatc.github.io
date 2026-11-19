// Responsibility: a steel portal-frame hall as a 3D blueprint — Groupe ATC's
// first trade, construction métallique. A schematic, not a given building.
// One GSAP timeline, a label per stage (s0 → s4):
//   s1  slab outline and base plates, the columns rise
//   s2  the lattice trusses are lowered one by one on the crane cable
//   s3  purlins and eave beams run along, bracing crosses the end bays
//   s4  cladding and roof sheets close the hall (translucent)
// Returns the group and the paused timeline; the caller owns the renderer.
// Used by the home hero (js/hero-3d.js).

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { THREE, WHITE, ORANGE, lineMat, skinMat, segments, v3, fadeables, setFade } from "./blueprint.js";

const HALF_W = 1.15; // half span (x)
const FRAMES = [-1.35, -0.45, 0.45, 1.35]; // frame positions (z)
const COL_H = 1.05; // eave height
const RIDGE_H = 1.5;
const COL = 0.05; // column section (schematic)

// One column (schematic box section, base plate), its foot at the origin.
export function makeColumn() {
  const col = new THREE.Group();
  const box = new THREE.BoxGeometry(COL, COL_H, COL);
  box.translate(0, COL_H / 2, 0);
  col.add(new THREE.LineSegments(new THREE.EdgesGeometry(box), lineMat(WHITE, 0.95)));
  col.add(new THREE.Mesh(box, skinMat(WHITE, 0.12)));
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), skinMat(WHITE, 0.35));
  plate.rotation.x = -Math.PI / 2;
  plate.position.y = 0.02;
  col.add(plate);
  return col;
}

// One lattice truss (top and bottom chords, web), in the x–y plane at z = 0.
export function makeTruss() {
  const g = new THREE.Group();
  const top = [v3(-HALF_W, COL_H, 0), v3(0, RIDGE_H, 0), v3(HALF_W, COL_H, 0)];
  const drop = 0.16;
  const bottom = [v3(-HALF_W, COL_H - drop, 0), v3(0, RIDGE_H - drop * 1.6, 0), v3(HALF_W, COL_H - drop, 0)];
  const chords = [[top[0], top[1]], [top[1], top[2]], [bottom[0], bottom[1]], [bottom[1], bottom[2]], [top[0], bottom[0]], [top[2], bottom[2]]];
  const web = [];
  const N = 6;
  for (const side of [0, 1]) {
    for (let i = 0; i < N; i++) {
      const t0 = i / N;
      const t1 = (i + 1) / N;
      const a = new THREE.Vector3().lerpVectors(top[side], top[side + 1], i % 2 ? t1 : t0);
      const b = new THREE.Vector3().lerpVectors(bottom[side], bottom[side + 1], i % 2 ? t0 : t1);
      web.push([a, b]);
    }
  }
  g.add(new THREE.LineSegments(segments(chords), lineMat(WHITE, 0.95)));
  g.add(new THREE.LineSegments(segments(web), lineMat(WHITE, 0.5)));
  return g;
}

export const FRAME_DIMS = { HALF_W, FRAMES, COL_H, RIDGE_H };

export function buildFrame() {
  const hall = new THREE.Group();
  const zMin = FRAMES[0];
  const zMax = FRAMES.at(-1);

  // --- s1: slab outline, base plates, columns --------------------------------
  const base = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.PlaneGeometry(HALF_W * 2 + 0.3, zMax - zMin + 0.3), skinMat(ORANGE, 0.08));
  slab.rotation.x = -Math.PI / 2;
  slab.position.y = 0.01;
  base.add(slab);
  const sx = HALF_W + 0.15;
  const sz = (zMax - zMin) / 2 + 0.15;
  base.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([v3(-sx, 0.015, -sz), v3(sx, 0.015, -sz), v3(sx, 0.015, sz), v3(-sx, 0.015, sz)]), lineMat(ORANGE, 1)));
  hall.add(base);
  const baseMats = fadeables(base);

  const columns = [];
  FRAMES.forEach((z) =>
    [-HALF_W, HALF_W].forEach((x) => {
      const col = makeColumn();
      col.position.set(x, 0, z);
      hall.add(col);
      columns.push({ obj: col, mats: fadeables(col) });
    })
  );

  // --- s2: lattice trusses, lowered on the crane -----------------------------
  const trusses = FRAMES.map((z) => {
    const g = makeTruss();
    // Crane cable and hook above the ridge, shown while it is lowered.
    const cable = new THREE.Group();
    cable.add(new THREE.Line(segments([[v3(0, RIDGE_H + 0.06, 0), v3(0, 6, 0)]]), lineMat(ORANGE, 1)));
    const hook = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.1), new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true }));
    hook.position.y = RIDGE_H + 0.04;
    cable.add(hook);
    g.add(cable);
    g.position.z = z;
    hall.add(g);
    return { obj: g, mats: fadeables(g), cable, cableMats: fadeables(cable) };
  });

  // --- s3: purlins, eave beams, bracing ---------------------------------------
  const along = [];
  [0, 0.33, 0.66, 1].forEach((t) =>
    [-1, 1].forEach((side) => {
      const x = side * HALF_W * (1 - t);
      const y = COL_H + (RIDGE_H - COL_H) * t;
      along.push([v3(x, y, zMin), v3(x, y, zMax)]);
    })
  );
  const purlins = new THREE.LineSegments(segments(along), lineMat(WHITE, 0.75));
  hall.add(purlins);
  const brace = [];
  for (const z0 of [[zMin, FRAMES[1]], [FRAMES[2], zMax]]) {
    for (const x of [-HALF_W, HALF_W]) {
      brace.push([v3(x, 0.05, z0[0]), v3(x, COL_H, z0[1])], [v3(x, COL_H, z0[0]), v3(x, 0.05, z0[1])]);
    }
    brace.push([v3(-HALF_W, COL_H, z0[0]), v3(0, RIDGE_H, z0[1])], [v3(0, RIDGE_H, z0[0]), v3(-HALF_W, COL_H, z0[1])]);
    brace.push([v3(HALF_W, COL_H, z0[0]), v3(0, RIDGE_H, z0[1])], [v3(0, RIDGE_H, z0[0]), v3(HALF_W, COL_H, z0[1])]);
  }
  const bracing = new THREE.LineSegments(segments(brace), lineMat(ORANGE, 0.85));
  hall.add(bracing);

  // --- s4: cladding and roof sheets ------------------------------------------
  const skin = new THREE.Group();
  const len = zMax - zMin;
  const wall = (x) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, COL_H), skinMat(WHITE, 0.1));
    m.rotation.y = Math.PI / 2;
    m.position.set(x, COL_H / 2, 0);
    return m;
  };
  skin.add(wall(-HALF_W), wall(HALF_W));
  const slope = Math.hypot(HALF_W, RIDGE_H - COL_H);
  const pitch = Math.atan2(RIDGE_H - COL_H, HALF_W);
  [-1, 1].forEach((side) => {
    // A flat sheet, then pitched about the hall's long axis (up toward the ridge).
    const m = new THREE.Mesh(new THREE.PlaneGeometry(slope, len), skinMat(WHITE, 0.13));
    m.rotation.x = -Math.PI / 2;
    const pane = new THREE.Group();
    pane.add(m);
    pane.rotation.z = -side * pitch;
    pane.position.set((side * HALF_W) / 2, (COL_H + RIDGE_H) / 2, 0);
    skin.add(pane);
  });
  // Sheet ribs on the roof: the plan's hatching.
  const ribs = [];
  for (let i = 1; i < 12; i++) {
    const z = zMin + (len * i) / 12;
    ribs.push([v3(-HALF_W, COL_H, z), v3(0, RIDGE_H, z)], [v3(0, RIDGE_H, z), v3(HALF_W, COL_H, z)]);
  }
  skin.add(new THREE.LineSegments(segments(ribs), lineMat(WHITE, 0.25)));
  hall.add(skin);
  const skinMats = fadeables(skin);

  // --- State driven by the timeline ------------------------------------------
  const st = { base: 0, purlins: 0, bracing: 0, skin: 0 };
  columns.forEach((_, i) => (st[`c${i}`] = 0));
  trusses.forEach((_, i) => {
    st[`t${i}`] = 0;
    st[`k${i}`] = 0;
  });

  const apply = () => {
    setFade(baseMats, st.base);
    base.scale.setScalar(0.8 + 0.2 * st.base);
    columns.forEach((c, i) => {
      const k = st[`c${i}`];
      setFade(c.mats, Math.min(1, k * 2));
      c.obj.visible = k > 0.001;
      c.obj.scale.y = Math.max(0.001, k);
    });
    trusses.forEach((t, i) => {
      const k = st[`t${i}`];
      setFade(t.mats, k > 0 ? 1 : 0);
      t.obj.visible = k > 0.001;
      t.obj.position.y = (1 - k) * 1.6;
      setFade(t.cableMats, st[`k${i}`]);
      t.cable.visible = st[`k${i}`] > 0.001;
    });
    purlins.visible = st.purlins > 0.001;
    purlins.scale.z = Math.max(0.001, st.purlins);
    bracing.visible = st.bracing > 0.001;
    bracing.material.opacity = 0.85 * st.bracing;
    setFade(skinMats, st.skin);
    skin.visible = st.skin > 0.001;
  };

  const tl = gsap.timeline({ paused: true, onUpdate: apply, defaults: { ease: "power3.out" } });
  tl.addLabel("s0").to(st, { base: 1, duration: 0.7 });
  columns.forEach((_, i) => tl.to(st, { [`c${i}`]: 1, duration: 0.55 }, 0.35 + i * 0.09));
  tl.addLabel("s1");
  trusses.forEach((_, i) => {
    const at = `s1+=${i * 0.55}`;
    tl.set(st, { [`k${i}`]: 1 }, at)
      .to(st, { [`t${i}`]: 1, duration: 0.9, ease: "power2.inOut" }, at)
      .to(st, { [`k${i}`]: 0, duration: 0.35, ease: "none" }, `${at}+=0.95`);
  });
  tl.addLabel("s2")
    .to(st, { purlins: 1, duration: 0.9, ease: "power2.inOut" })
    .to(st, { bracing: 1, duration: 0.6, ease: "none" }, "-=0.3")
    .addLabel("s3")
    .to(st, { skin: 1, duration: 1.0, ease: "power1.inOut" })
    .addLabel("s4");
  apply();

  return { group: hall, tl, height: RIDGE_H, focusY: 0.75, dims: FRAME_DIMS };
}
