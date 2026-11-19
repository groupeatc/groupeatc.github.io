// Responsibility: the site lighting around the steel frame (night « en
// service »): four floodlight masts with their beams, the light bands along
// the walls, the ground glow. switchOn(true) lights them one by one;
// switchOn(false) puts them out. Used by js/finale-3d.js and js/process-3d.js.

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { THREE, ORANGE, WHITE, lineMat, segments, v3 } from "./blueprint.js";

export const WARM = 0xff9a4a;

export function buildSiteLights({ HALF_W, FRAMES, COL_H }) {
  const zMax = FRAMES.at(-1);
  const group = new THREE.Group();
  // Additive: light adds up on the blue instead of greying it.
  const glow = (color, opacity) =>
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });

  const masts = [];
  const MX = HALF_W + 0.32;
  const MZ = zMax + 0.3;
  const MH = 1.55;
  [[MX, MZ], [-MX, MZ], [-MX, -MZ], [MX, -MZ]].forEach(([x, z]) => {
    const g = new THREE.Group();
    const pole = new THREE.Line(segments([[v3(0, 0, 0), v3(0, MH, 0)]]), lineMat(WHITE, 0.7));
    g.add(pole);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.08), new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.6 }));
    head.position.y = MH;
    g.add(head);
    // The beam: a cone from the lamp toward the hall (opens along -y).
    const len = Math.hypot(x, z, MH - 0.2);
    const beamGeo = new THREE.ConeGeometry(0.3, len, 24, 1, true);
    beamGeo.translate(0, -len / 2, 0);
    const beam = new THREE.Mesh(beamGeo, glow(WARM, 0));
    beam.position.y = MH;
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(-x, 0.2 - MH, -z).normalize());
    g.add(beam);
    g.position.set(x, 0, z);
    group.add(g);
    masts.push({ head, beam, pole });
  });
  const bands = [-HALF_W - 0.002, HALF_W + 0.002].map((x) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(zMax * 2 - 0.3, 0.06), glow(ORANGE, 0));
    m.rotation.y = Math.PI / 2;
    m.position.set(x, COL_H * 0.62, 0);
    group.add(m);
    return m;
  });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(2.1, 64), glow(WARM, 0));
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = 0.004;
  group.add(pool);

  let tl = null;
  return {
    group,
    // Masts visible or not (e.g. hidden until the site is built).
    showMasts(k) {
      masts.forEach((m) => {
        m.pole.material.opacity = 0.7 * k;
        m.head.material.opacity = 0.9 * k;
      });
    },
    switchOn(on) {
      tl?.kill();
      tl = gsap.timeline();
      masts.forEach((m, i) => {
        // The lamp changes colour; its visibility is showMasts()'s business.
        tl.to(m.beam.material, { opacity: on ? 0.12 : 0, duration: on ? 0.25 : 0.4 }, on ? i * 0.3 : 0).call(
          () => m.head.material.color.set(on ? WARM : WHITE),
          null,
          on ? i * 0.3 : 0
        );
      });
      tl.to(bands.map((b) => b.material), { opacity: on ? 0.9 : 0, duration: 0.8 }, on ? 1.2 : 0).to(pool.material, { opacity: on ? 0.12 : 0, duration: 1.2 }, on ? 1.2 : 0);
      return tl;
    },
  };
}
