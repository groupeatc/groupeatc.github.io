// Responsibility: réservoirs de dépôt pétrolier — the tank as a 3D blueprint
// (Three.js), its construction driven by one GSAP timeline with a label per
// stage (s0 → s4): fond, robe, toit lowered on the crane cable, en service
// (helical stair, product level, outlet pipe). After that it turns slowly;
// the visitor can turn it by dragging (horizontal only, page scroll stays
// free). Rendering stops when the scene is off screen.
// Model: js/three/tank-model.js. Loaded on demand by js/pages/kordian.js;
// the SVG plan is the fallback.

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { THREE, blueprintScene } from "../three/blueprint.js";
import { buildTank } from "../three/tank-model.js";

export function createTank3D(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = "tank__canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  // Plan grid + brand-blue fog; the tank and its construction timeline.
  const scene = blueprintScene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  const target = new THREE.Vector3(0, 0.85, 0);
  const { group: tank, tl } = buildTank();
  scene.add(tank);

  // --- Camera, rotation, drag ------------------------------------------------
  let spin = 0.7; // current angle (rad)
  let autoSpeed = 0; // rad/s, enabled once in service
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  let interacted = false;

  const frame = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the whole tank in frame whatever the panel's shape.
    const dist = camera.aspect < 1 ? 5.4 / Math.max(camera.aspect, 0.6) ** 0.6 : 4.9;
    camera.position.set(0, 2.1, dist);
    // Narrow panels: aim a little higher so the tank sits below the chip.
    target.y = camera.aspect < 1 ? 1.15 : 0.85;
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(frame).observe(host);
  frame();

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    interacted = true;
    host.classList.add("is-dragging", "was-dragged");
    lastX = e.clientX;
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    velocity = dx * 0.01;
    spin += velocity;
  });
  const release = () => {
    dragging = false;
    host.classList.remove("is-dragging");
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  const tick = (_, dt) => {
    const s = Math.min(dt, 50) / 1000;
    if (!dragging) {
      velocity *= 0.92;
      spin += velocity + autoSpeed * s;
    }
    tank.rotation.y = spin;
    renderer.render(scene, camera);
  };

  let running = false;
  const run = (on) => {
    if (on === running) return;
    running = on;
    on ? gsap.ticker.add(tick) : gsap.ticker.remove(tick);
  };
  new IntersectionObserver((entries) => run(entries.some((e) => e.isIntersecting))).observe(host);

  return {
    // Animate to a stage; forward plays the construction, backward rewinds fast.
    goTo(n, onDone) {
      const label = `s${n}`;
      const forward = tl.labels[label] >= tl.time();
      gsap.killTweensOf(tl);
      const vars = forward ? { ease: "none", onComplete: onDone } : { duration: 0.8, ease: "power2.inOut", onComplete: onDone };
      tl.tweenTo(label, vars);
      autoSpeed = n === 4 ? 0.18 : 0;
    },
    get interacted() {
      return interacted;
    },
  };
}
