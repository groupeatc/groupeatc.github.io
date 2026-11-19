// Responsibility: home — end of the story, « l'ouvrage est en service ».
// The steel frame built in the hero (js/three/frame-model.js) comes back in
// the closing band: it finishes (purlins, bracing, cladding), then takes the
// real time in Bamako (head office, data/agencies.js): by day it stays
// clear; by night its four floodlights come on one by one, the light bands
// and the ground glow. Re-checked every minute. Preview either state with
// ?bamako=jour or ?bamako=nuit. Rendering stops off screen.
// Loaded by js/pages/home.js when the band comes near.

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { THREE, WHITE, blueprintScene, footprint } from "./three/blueprint.js";
import { buildFrame } from "./three/frame-model.js";
import { buildSiteLights } from "./three/site-lights.js";

// Day in Bamako from 6:30 to 18:45 (local time, UTC+0 all year) — a simple
// rule for the lights, not an astronomical sunset.
const isNight = (h, m) => h * 60 + m < 6 * 60 + 30 || h * 60 + m >= 18 * 60 + 45;

export function createFinale3D(root, { timeZone }) {
  const stage = root.querySelector("[data-finale-stage]");
  const label = root.querySelector("[data-finale-label]");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = "cta-band__site-canvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.append(canvas);

  const scene = blueprintScene({ panel: false });
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  const world = new THREE.Group();
  scene.add(world);
  world.add(footprint(1.5));
  const { group: hall, tl, dims } = buildFrame();
  world.add(hall);

  // The model's white lines are dimmed at night so the light reads: their
  // colour is scaled (their opacity belongs to the build timeline).
  const whites = [];
  hall.traverse((o) => o.material?.color?.getHex() === WHITE && whites.push(o.material));
  const dim = (k) => whites.forEach((m) => m.color.setScalar(k));

  // --- Night: floodlights, light bands, ground glow (js/three/site-lights.js)
  const lights = buildSiteLights(dims);
  world.add(lights.group);

  const frame = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(0, 2.5, 6.6 / Math.min(1, camera.aspect) ** 0.6);
    camera.lookAt(0, 0.65, 0);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(frame).observe(stage);
  frame();

  world.rotation.y = 0.6;
  const tick = (_, dt) => {
    world.rotation.y += (Math.min(dt, 50) / 1000) * 0.12;
    renderer.render(scene, camera);
  };
  let running = false;
  new IntersectionObserver((entries) => {
    const on = entries.some((e) => e.isIntersecting);
    if (on === running) return;
    running = on;
    on ? gsap.ticker.add(tick) : gsap.ticker.remove(tick);
  }).observe(root);

  // --- Day / night from the real time in Bamako ----------------------------
  const forced = new URLSearchParams(window.location.search).get("bamako");
  const clock = new Intl.DateTimeFormat("fr-FR", { timeZone, hour: "numeric", minute: "numeric", hourCycle: "h23" });
  const nightNow = () => {
    if (forced === "nuit") return true;
    if (forced === "jour") return false;
    const parts = Object.fromEntries(clock.formatToParts(new Date()).map((p) => [p.type, p.value]));
    return isNight(Number(parts.hour), Number(parts.minute));
  };

  let night = null;
  const light = (on) => {
    if (on === night) return;
    night = on;
    root.dataset.time = on ? "nuit" : "jour";
    label.textContent = `Ouvrage en service · ${on ? "Nuit" : "Jour"} à Bamako`;
    const k = { v: on ? 1 : 0.62 };
    gsap.to(k, { v: on ? 0.62 : 1, duration: 1, onUpdate: () => dim(k.v) });
    lights.switchOn(on);
  };

  return {
    // The band is on screen: finish the frame, then light it for the hour.
    play() {
      tl.progress(tl.labels.s2 / tl.duration()).play();
      gsap.delayedCall(Math.max(0, tl.duration() - tl.labels.s2) + 0.2, () => light(nightNow()));
      window.setInterval(() => light(nightNow()), 60000);
    },
  };
}
