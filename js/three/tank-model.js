// Responsibility: the storage tank as a 3D blueprint, built by one GSAP
// timeline with a label per stage (s0 → s4): fond, robe (ring by ring), toit
// lowered on the crane cable, en service (helical stair, product level,
// outlet pipe). Returns the group and the paused timeline; the caller owns
// the renderer, camera and rotation. Used by js/pages/kordian-3d.js and the
// home hero (js/hero-3d.js).

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { THREE, WHITE, ORANGE, SEG, lineMat, skinMat, circle, segments, fadeables, setFade } from "./blueprint.js";

const R = 1; // shell radius
const RING_H = 0.32;
const RINGS = 5;
const SHELL_H = RING_H * RINGS;

export function buildTank() {
  const tank = new THREE.Group();

  // --- Stage 1: foundation, bottom plate, first ring -------------------------
  const base = new THREE.Group();
  const foundation = new THREE.Mesh(new THREE.RingGeometry(R, R * 1.12, SEG), skinMat(WHITE, 0.12));
  foundation.rotation.x = -Math.PI / 2;
  foundation.position.y = 0.01;
  base.add(foundation);
  base.add(new THREE.LineLoop(circle(R * 1.12, 0.012), lineMat(WHITE, 0.6)));
  base.add(new THREE.LineLoop(circle(R, 0.02), lineMat(ORANGE, 1)));
  const plateSkin = new THREE.Mesh(new THREE.CircleGeometry(R, SEG), skinMat(ORANGE, 0.1));
  plateSkin.rotation.x = -Math.PI / 2;
  plateSkin.position.y = 0.018;
  base.add(plateSkin);
  tank.add(base);
  const baseMats = fadeables(base);

  // --- Stages 1–2: the shell, ring by ring -----------------------------------
  const rings = [];
  for (let i = 0; i < RINGS; i++) {
    const ring = new THREE.Group();
    const skin = new THREE.Mesh(new THREE.CylinderGeometry(R, R, RING_H, SEG, 1, true), skinMat(WHITE, 0.1));
    skin.position.y = RING_H / 2;
    ring.add(skin);
    ring.add(new THREE.LineLoop(circle(R, 0), lineMat(WHITE, 0.9)));
    ring.add(new THREE.LineLoop(circle(R, RING_H), lineMat(WHITE, 0.9)));
    // Vertical plate seams, staggered course to course like a real shell.
    const seams = [];
    for (let k = 0; k < 8; k++) {
      const a = ((k + (i % 2) * 0.5) / 8) * Math.PI * 2;
      const x = Math.cos(a) * R;
      const z = Math.sin(a) * R;
      seams.push([new THREE.Vector3(x, 0, z), new THREE.Vector3(x, RING_H, z)]);
    }
    ring.add(new THREE.LineSegments(segments(seams), lineMat(WHITE, 0.35)));
    ring.userData.y = i * RING_H;
    ring.position.y = ring.userData.y;
    tank.add(ring);
    rings.push({ obj: ring, mats: fadeables(ring) });
  }

  // --- Stage 3: the roof, lowered on the crane cable -------------------------
  const roof = new THREE.Group();
  const ROOF_H = 0.3;
  const cone = new THREE.Mesh(new THREE.ConeGeometry(R * 1.02, ROOF_H, SEG, 1, true), skinMat(WHITE, 0.09));
  cone.position.y = ROOF_H / 2;
  roof.add(cone);
  const apex = new THREE.Vector3(0, ROOF_H, 0);
  const rafters = [];
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    rafters.push([apex, new THREE.Vector3(Math.cos(a) * R * 1.02, 0, Math.sin(a) * R * 1.02)]);
  }
  roof.add(new THREE.LineSegments(segments(rafters), lineMat(WHITE, 0.45)));
  roof.add(new THREE.LineLoop(circle(R * 1.02, 0), lineMat(WHITE, 0.9)));
  const roofMats = fadeables(roof);
  const crane = new THREE.Group();
  crane.add(new THREE.Line(segments([[new THREE.Vector3(0, ROOF_H + 0.08, 0), new THREE.Vector3(0, 6, 0)]]), lineMat(ORANGE, 1)));
  const hook = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.12), new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true }));
  hook.position.y = ROOF_H + 0.06;
  crane.add(hook);
  roof.add(crane);
  const craneMats = fadeables(crane);
  roof.userData.y = SHELL_H;
  tank.add(roof);

  // --- Stage 4: helical stair, product level, outlet -------------------------
  const STEPS = 22;
  const a0 = Math.PI * 0.15;
  const turn = Math.PI * 1.05;
  const helix = (r, lift) => {
    const pts = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS;
      const a = a0 + turn * t;
      pts.push(new THREE.Vector3(Math.cos(a) * r, t * SHELL_H + lift, Math.sin(a) * r));
    }
    return pts;
  };
  const inner = helix(R + 0.02, 0);
  const outer = helix(R + 0.14, 0);
  const rail = helix(R + 0.14, 0.12);
  const stair = new THREE.Group();
  const stringer = new THREE.Line(new THREE.BufferGeometry().setFromPoints(outer), lineMat(WHITE, 0.95));
  const handrail = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail), lineMat(WHITE, 0.6));
  const treads = new THREE.LineSegments(segments(inner.map((p, i) => [p, outer[i]])), lineMat(WHITE, 0.7));
  stair.add(stringer, handrail, treads);
  tank.add(stair);

  const LEVEL = SHELL_H * 0.72;
  const fillGeo = new THREE.CylinderGeometry(R * 0.985, R * 0.985, 1, SEG, 1, false);
  fillGeo.translate(0, 0.5, 0);
  const fill = new THREE.Mesh(fillGeo, skinMat(ORANGE, 0.09));
  fill.position.y = 0.02;
  tank.add(fill);
  const level = new THREE.LineLoop(circle(R * 0.985, 0), lineMat(ORANGE, 1));
  tank.add(level);

  const pipe = new THREE.Line(
    segments([[new THREE.Vector3(R, 0.14, 0), new THREE.Vector3(R + 0.6, 0.14, 0)], [new THREE.Vector3(R + 0.6, 0.14, 0), new THREE.Vector3(R + 0.6, 0.01, 0)]]),
    lineMat(ORANGE, 1)
  );
  pipe.rotation.y = -Math.PI * 0.25;
  tank.add(pipe);

  // --- State driven by the timeline ------------------------------------------
  const st = { base: 0, r0: 0, r1: 0, r2: 0, r3: 0, r4: 0, roof: 0, crane: 0, stair: 0, fill: 0, pipe: 0 };
  const apply = () => {
    setFade(baseMats, st.base);
    base.scale.setScalar(0.7 + 0.3 * st.base);
    rings.forEach((r, i) => {
      const k = st[`r${i}`];
      setFade(r.mats, k);
      r.obj.visible = k > 0.001;
      r.obj.position.y = r.obj.userData.y + (1 - k) * 0.9;
    });
    setFade(roofMats, st.roof > 0 ? 1 : 0);
    roof.visible = st.roof > 0.001;
    roof.position.y = roof.userData.y + (1 - st.roof) * 1.8;
    setFade(craneMats, st.crane);
    crane.visible = st.crane > 0.001;
    const n = Math.round(st.stair * (STEPS + 1));
    stringer.geometry.setDrawRange(0, n);
    handrail.geometry.setDrawRange(0, n);
    treads.geometry.setDrawRange(0, n * 2);
    stair.visible = n > 0;
    fill.visible = level.visible = st.fill > 0.001;
    fill.scale.y = Math.max(0.001, st.fill * LEVEL);
    level.position.y = 0.02 + st.fill * LEVEL;
    pipe.visible = st.pipe > 0.001;
    pipe.scale.setScalar(Math.max(0.001, st.pipe));
  };

  const tl = gsap.timeline({ paused: true, onUpdate: apply, defaults: { ease: "power3.out" } });
  tl.addLabel("s0")
    .to(st, { base: 1, duration: 0.9 })
    .to(st, { r0: 1, duration: 0.7 }, "-=0.3")
    .addLabel("s1")
    .to(st, { r1: 1, duration: 0.6 })
    .to(st, { r2: 1, duration: 0.6 }, "-=0.35")
    .to(st, { r3: 1, duration: 0.6 }, "-=0.35")
    .to(st, { r4: 1, duration: 0.6 }, "-=0.35")
    .addLabel("s2")
    .set(st, { crane: 1 })
    .to(st, { roof: 1, duration: 1.4, ease: "power2.inOut" })
    .addLabel("s3")
    .to(st, { crane: 0, duration: 0.4, ease: "none" })
    .to(st, { stair: 1, duration: 1.1, ease: "power1.inOut" }, "<")
    .to(st, { fill: 1, duration: 1.4, ease: "power2.out" }, "<0.2")
    .to(st, { pipe: 1, duration: 0.5 }, "<0.3")
    .addLabel("s4");
  apply();

  // Framing hints for the caller's camera.
  return { group: tank, tl, height: SHELL_H + 0.3, focusY: 0.85 };
}
