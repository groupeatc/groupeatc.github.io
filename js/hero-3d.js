// Responsibility: home hero — the 3D plan drawn over each slide's photo
// (wide screens), « le plan flotte sur le chantier »: no panel, the model in
// white and orange lines on its plan footprint, a soft dark halo behind it
// (CSS) for legibility. One renderer, one scene, two models: the steel
// frame (slide 1, js/three/frame-model.js) and the storage tank (slide 2,
// js/three/tank-model.js). Showing a slide fades the plan, swaps the model
// and plays its construction; the model turns slowly. Rendering stops when
// the hero is off screen. Loaded after the hero photo by js/pages/home.js.

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { THREE, blueprintScene, footprint, fadeables, setFade } from "./three/blueprint.js";
import { buildFrame } from "./three/frame-model.js";
import { buildTank } from "./three/tank-model.js";

export function createHero3D(panel) {
  const stage = panel.querySelector("[data-plan3d-stage]");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = "hero-plan__canvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.append(canvas);

  const scene = blueprintScene({ panel: false });
  const ground = footprint(1.55);
  scene.add(ground);
  const groundMats = fadeables(ground);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  // Per model: camera distance / height and the point looked at.
  const models = [
    { ...buildFrame(), view: { dist: 5.3, y: 2.5, look: 0.7 } },
    { ...buildTank(), view: { dist: 5.0, y: 2.2, look: 0.85 } },
  ];
  models.forEach((m) => {
    m.group.visible = false;
    scene.add(m.group);
  });

  let current = null;
  const target = new THREE.Vector3();
  const frame = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h || !current) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const { dist, y, look } = current.view;
    camera.position.set(0, y, dist / Math.min(1, camera.aspect) ** 0.5);
    target.set(0, look, 0);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(frame).observe(stage);

  const tick = (_, dt) => {
    if (!current) return;
    current.group.rotation.y += (Math.min(dt, 50) / 1000) * 0.16;
    ground.rotation.y = current.group.rotation.y;
    renderer.render(scene, camera);
  };
  let running = false;
  new IntersectionObserver((entries) => {
    const on = entries.some((e) => e.isIntersecting);
    if (on === running) return;
    running = on;
    on ? gsap.ticker.add(tick) : gsap.ticker.remove(tick);
  }).observe(panel);

  const swap = (i) => {
    if (current) current.group.visible = false;
    current = models[i];
    current.group.visible = true;
    current.group.rotation.y = 0.55;
    frame();
    current.tl.pause(0);
    // The footprint is drawn first, then the model is built on it.
    const o = { k: 0 };
    gsap.to(o, { k: 1, duration: 0.6, ease: "power1.out", onUpdate: () => setFade(groundMats, o.k) });
    gsap.delayedCall(0.35, () => current === models[i] && current.tl.play());
    panel.dataset.model = String(i);
  };

  let first = true;
  return {
    // Show slide i's model: fade the panel out, swap, fade in and build.
    show(i) {
      if (first) {
        first = false;
        swap(i);
        panel.classList.add("is-ready");
        return;
      }
      panel.classList.add("is-switching");
      gsap.delayedCall(0.35, () => {
        swap(i);
        panel.classList.remove("is-switching");
      });
    },
  };
}
