// Responsibility: home — "le réseau ATC" as a 3D globe (Three.js + GSAP),
// in place of the flat presence map (which stays as the fallback).
//
// A navy globe set on the page, land as white dots (Natural Earth 1:110m,
// assets/data/world-dots.bin), the group's 9 countries in brighter dots.
// Story, once: the globe turns from the Atlantic to Africa, the parent
// company in Mali lights, then an arc leaves Mali for each subsidiary
// (nearest first) and lights its country on arrival. Then: drag to turn it
// (it drifts back to Africa when left alone), pick a country among the pills
// below → the globe turns to it, its arc stands out, its card opens.
// Agency data and coordinates: data/agencies.js. Loaded on demand by
// js/pages/home.js.

import { gsap } from "/js/vendor/gsap/gsap.min.js";
import * as THREE from "/js/vendor/three/three.module.min.js";
import { agencies } from "../data/agencies.js";
import { agencySlug } from "./presence-map.js";

const ORANGE = new THREE.Color(0xe45204);
const DEG = Math.PI / 180;
const AFRICA = { lat: 20, lon: 0 }; // view that frames France → Côte d'Ivoire
const CODES = ["MLI", "GIN", "BFA", "SEN", "MRT", "NER", "CIV", "TUN", "FRA"]; // flags 1..9 in the .bin

const toVec = (lat, lon, r = 1) =>
  new THREE.Vector3(Math.cos(lat * DEG) * Math.sin(lon * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.cos(lon * DEG)).multiplyScalar(r);

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};

export async function createGlobe(root) {
  const res = await fetch("/assets/data/world-dots.bin");
  if (!res.ok) throw new Error("world-dots");
  const bin = new DataView(await res.arrayBuffer());

  // ----- DOM: stage (canvas + labels), card, pills -------------------------
  root.innerHTML = "";
  const stage = el("div", "globe__stage");
  const labels = el("div", "globe__labels");
  labels.setAttribute("aria-hidden", "true");
  const card = el("div", "globe__card");
  card.setAttribute("aria-live", "polite");
  const pills = el("ul", "globe__pills");
  pills.setAttribute("role", "list");
  pills.setAttribute("aria-label", "Nos 9 pays d'implantation");
  stage.append(labels);
  root.append(stage, pills);
  const wide = window.matchMedia("(min-width: 640px)");
  const placeCard = () => (wide.matches ? stage.append(card) : root.append(card));
  wide.addEventListener("change", placeCard);
  placeCard();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = "globe__canvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  const FAR = 4.35; // whole globe
  const NEAR = 2.45; // zoomed on a country
  const zoom = { z: FAR };
  camera.position.set(0, 0, FAR);
  const globe = new THREE.Group();
  scene.add(globe);

  // ----- Sphere: navy, lit from the top left, darker at the limb -----------
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.995, 96, 64),
    new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vN; void main(){
        float light = clamp(dot(vN, normalize(vec3(-0.45, 0.55, 0.7))), 0.0, 1.0);
        vec3 deep = vec3(0.0, 0.086, 0.235), lit = vec3(0.04, 0.2, 0.46);
        vec3 c = mix(deep, lit, light * 0.85);
        c += vec3(0.05, 0.1, 0.2) * pow(1.0 - vN.z, 3.0); // thin rim
        gl_FragColor = vec4(c, 1.0); }`,
    })
  );
  globe.add(sphere);

  // Graticule every 20°: the plan language, very faint.
  const grat = [];
  for (let lat = -80; lat <= 80; lat += 20) for (let lon = -180; lon < 180; lon += 4) grat.push(toVec(lat, lon, 1.001), toVec(lat, lon + 4, 1.001));
  for (let lon = -180; lon < 180; lon += 20) for (let lat = -88; lat < 88; lat += 4) grat.push(toVec(lat, lon, 1.001), toVec(lat + 4, lon, 1.001));
  globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grat), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 })));

  // ----- Land dots ----------------------------------------------------------
  const n = bin.byteLength / 5;
  const pos = new Float32Array(n * 3);
  const flag = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const v = toVec(bin.getInt16(i * 5, true) / 100, bin.getInt16(i * 5 + 2, true) / 100, 1.004);
    pos.set([v.x, v.y, v.z], i * 3);
    flag[i] = bin.getUint8(i * 5 + 4);
  }
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  dotsGeo.setAttribute("aFlag", new THREE.BufferAttribute(flag, 1));
  // Per-country orange glow (key = flag). A plain object so GSAP can tween
  // its keys; copied into the shader's uniform array every frame.
  const lit = Object.fromEntries(Array.from({ length: 10 }, (_, k) => [k, 0]));
  const litUniform = new Array(10).fill(0);
  const dotsMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uLit: { value: litUniform }, uSize: { value: 2.4 }, uDpr: { value: renderer.getPixelRatio() }, uOrange: { value: ORANGE } },
    vertexShader: `attribute float aFlag; uniform float uLit[10]; uniform float uSize; uniform float uDpr;
      varying float vLit; varying float vMine; varying float vFade;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float l = 0.0; int f = int(aFlag + 0.5);
        for (int k = 0; k < 10; k++) { if (k == f) l = uLit[k]; }
        vLit = l; vMine = step(0.5, aFlag);
        vec3 nrm = normalize(normalMatrix * position);
        vFade = clamp(dot(nrm, normalize(-mv.xyz)) * 1.8 + 0.05, 0.0, 1.0);
        gl_PointSize = uSize * uDpr * (1.0 + vMine * 0.3 + l * 0.5) * pow(4.35 / -mv.z, 0.7); // grows less than the zoom
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uOrange; varying float vLit; varying float vMine; varying float vFade;
      void main(){
        float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.3, d) * vFade * (0.34 + vMine * 0.56 + vLit * 0.1);
        gl_FragColor = vec4(mix(vec3(1.0), uOrange, vLit), a); }`,
  });
  globe.add(new THREE.Points(dotsGeo, dotsMat));

  // ----- Agencies: markers, arcs --------------------------------------------
  const hubAgency = agencies.find((a) => a.isHub);
  const hubPos = toVec(hubAgency.geo.lat, hubAgency.geo.lon);
  const nodes = agencies.map((a) => {
    const p = toVec(a.geo.lat, a.geo.lon);
    const marker = new THREE.Mesh(
      new THREE.CircleGeometry(a.isHub ? 0.022 : 0.013, 24),
      new THREE.MeshBasicMaterial({ color: a.isHub ? ORANGE : 0xffffff, transparent: true, opacity: 0 })
    );
    marker.position.copy(p).multiplyScalar(1.006);
    marker.lookAt(p.clone().multiplyScalar(2));
    globe.add(marker);
    return { agency: a, p, marker, flagIndex: CODES.indexOf(a.iso) + 1, dist: p.angleTo(hubPos) };
  });
  const hubNode = nodes.find((x) => x.agency.isHub);

  // Pulse ring on the parent company.
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.026, 0.032, 40), new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0 }));
  pulse.position.copy(hubNode.marker.position);
  pulse.lookAt(hubNode.p.clone().multiplyScalar(2));
  globe.add(pulse);

  const TUBE = 72;
  const RADIAL = 6;
  const spokes = nodes
    .filter((x) => !x.agency.isHub)
    .sort((a, b) => a.dist - b.dist)
    .map((node) => {
      const pts = [];
      const lift = 0.04 + node.dist * 0.32;
      for (let i = 0; i <= 32; i++) {
        const t = i / 32;
        const v = new THREE.Vector3().copy(hubPos).lerp(node.p, t).normalize();
        pts.push(v.multiplyScalar(1.006 + lift * Math.sin(Math.PI * t)));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, TUBE, 0.0042, RADIAL, false);
      geo.setDrawRange(0, 0);
      const mat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 1 });
      globe.add(new THREE.Mesh(geo, mat));
      return { node, curve, geo, mat, draw: 0 };
    });
  const setDraw = (s, k) => {
    s.draw = k;
    s.geo.setDrawRange(0, Math.floor(k * TUBE) * RADIAL * 6);
  };

  // Flux: a bright bead running along a spoke now and then.
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
  globe.add(bead);
  const runFlux = (s) => {
    const o = { t: 0 };
    gsap.timeline()
      .set(bead.material, { opacity: 1 })
      .to(o, { t: 1, duration: 1.3, ease: "power1.inOut", onUpdate: () => bead.position.copy(s.curve.getPointAt(o.t)) })
      .to(bead.material, { opacity: 0, duration: 0.3 }, "-=0.25")
      .add(() => gsap.fromTo(lit, { [s.node.flagIndex]: 0.8 }, { [s.node.flagIndex]: 0, duration: 1.2, ease: "power2.out" }));
  };

  // ----- Labels (projected HTML): parent company + active country ---------
  // Each label sits on the side of its point that keeps West Africa legible
  // once zoomed in (neighbours are close): offset applied after projection.
  const OFFSET = {
    top: "translate(-50%, calc(-100% - 10px))",
    right: "translate(10px, -50%)",
    bottom: "translate(-50%, 10px)",
    left: "translate(calc(-100% - 10px), -50%)",
  };
  const SIDE = { "Sénégal": "left", Mauritanie: "left", "Guinée": "left", "Côte d'Ivoire": "bottom", "Burkina Faso": "bottom", Niger: "right", Tunisie: "right", France: "right" };
  const hubLabel = el("span", "globe__label globe__label--hub", `Société mère · ${hubAgency.country}`);
  hubLabel.dataset.offset = OFFSET.top;
  labels.append(hubLabel);
  nodes.forEach((node) => {
    if (node.agency.isHub) return;
    node.label = el("span", "globe__label", node.agency.country);
    node.label.dataset.offset = OFFSET[SIDE[node.agency.country] ?? "right"];
    labels.append(node.label);
  });

  // ----- Card + pills ---------------------------------------------------------
  let active = null;
  const clock = (tz) => new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
  const renderCard = (node) => {
    card.innerHTML = "";
    if (!node) {
      card.append(el("p", "globe__card-kicker", "Le réseau Groupe ATC"), el("p", "globe__card-title", "9 pays, une société mère au Mali"), el("p", "globe__card-line", "Choisissez un pays pour voir son agence."));
      return;
    }
    const a = node.agency;
    card.append(el("p", "globe__card-kicker", a.isHub ? "Société mère" : "Filiale"), el("p", "globe__card-title", a.country));
    if (a.address) card.append(el("p", "globe__card-line", a.address));
    const time = el("p", "globe__card-line globe__card-time");
    time.dataset.tz = a.timeZone;
    time.textContent = `Heure locale ${clock(a.timeZone)}`;
    card.append(time);
    const link = el("a", "link-arrow globe__card-link", "Voir l'agence ");
    link.href = `/nos-agences/#${agencySlug(a.country)}`;
    const arrow = el("span", "link-arrow__icon", "→");
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);
    card.append(link);
    const back = el("button", "globe__back", "Vue d'ensemble");
    back.type = "button";
    back.addEventListener("click", () => select(null));
    card.append(back);
  };
  window.setInterval(() => {
    const t = card.querySelector("[data-tz]");
    if (t) t.textContent = `Heure locale ${clock(t.dataset.tz)}`;
  }, 30000);

  const pillButtons = nodes.map((node) => {
    const li = el("li");
    const b = el("button", "globe__pill", node.agency.country);
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    if (node.agency.isHub) b.classList.add("globe__pill--hub");
    b.addEventListener("click", () => select(active === node ? null : node));
    li.append(b);
    pills.append(li);
    return { node, b };
  });

  // ----- View: rotation, drag, idle drift -----------------------------------
  const view = { lat: 8, lon: -62 }; // starts over the Atlantic
  let base = { ...AFRICA };
  let mode = "story"; // story | idle | drag | focus
  let lastUserAt = 0;
  let vel = { lat: 0, lon: 0 };
  const clampLat = (v) => Math.max(-25, Math.min(50, v));

  const turnTo = (target, duration = 1.4) => {
    mode = "focus";
    gsap.to(view, {
      lat: target.lat,
      lon: view.lon + ((((target.lon - view.lon) % 360) + 540) % 360) - 180,
      duration,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        base = { ...target };
        mode = "idle";
      },
    });
  };

  const highlight = (node) => {
    spokes.forEach((s) => gsap.to(s.mat, { opacity: !node || node.agency.isHub || s.node === node ? 1 : 0.22, duration: 0.4, overwrite: true }));
    nodes.forEach((x) => gsap.to(x.marker.scale, { x: x === node ? 1.6 : 1, y: x === node ? 1.6 : 1, duration: 0.4, overwrite: true }));
    nodes.forEach((x) => x.label?.classList.toggle("is-active", x === node));
  };

  function select(node) {
    active = node;
    pillButtons.forEach(({ node: x, b }) => b.setAttribute("aria-pressed", String(x === node)));
    highlight(node);
    renderCard(node);
    if (node) {
      const s = spokes.find((sp) => sp.node === node);
      if (s) runFlux(s);
      turnTo({ lat: clampLat(node.agency.geo.lat), lon: node.agency.geo.lon });
    } else turnTo(AFRICA);
    gsap.to(zoom, { z: node ? NEAR : FAR, duration: 1.5, ease: "power3.inOut", overwrite: true });
    stage.classList.toggle("is-zoomed", Boolean(node));
  }

  // Picking: the agency nearest to the clicked point of the globe.
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(sphere)[0];
    if (!hit) return undefined; // outside the globe
    const p = globe.worldToLocal(hit.point.clone()).normalize();
    let best = null;
    let bestAngle = (zoom.z < 3.4 ? 4 : 7) * DEG;
    nodes.forEach((x) => {
      const a = p.angleTo(x.p);
      if (a < bestAngle) {
        best = x;
        bestAngle = a;
      }
    });
    return best;
  };
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && active) select(null);
  });

  let dragging = false;
  let last = { x: 0, y: 0 };
  let down = null;
  canvas.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY };
    dragging = true;
    mode = "drag";
    gsap.killTweensOf(view);
    last = { x: e.clientX, y: e.clientY };
    vel = { lat: 0, lon: 0 };
    stage.classList.add("is-dragging");
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) {
      if (e.pointerType === "mouse") stage.classList.toggle("is-pointing", Boolean(pick(e)));
      return;
    }
    const k = (180 / stage.clientWidth) * ((zoom.z - 1) / (FAR - 1));
    vel = { lon: -(e.clientX - last.x) * k, lat: e.pointerType === "touch" ? 0 : (e.clientY - last.y) * k };
    last = { x: e.clientX, y: e.clientY };
    view.lon += vel.lon;
    view.lat = clampLat(view.lat + vel.lat);
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    lastUserAt = performance.now();
  };
  canvas.addEventListener("pointerup", (e) => {
    const moved = down ? Math.hypot(e.clientX - down.x, e.clientY - down.y) : 99;
    release();
    if (moved > 6) return;
    const node = pick(e);
    if (node) select(node);
    else if (node === null && active) select(null); // ocean: back out
  });
  canvas.addEventListener("pointercancel", release);

  // ----- Frame + render loop -------------------------------------------------
  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  const project = (v, out) => {
    const w = v.clone().applyMatrix4(globe.matrixWorld);
    const facing = w.clone().normalize().dot(camera.position.clone().sub(w).normalize());
    w.project(camera);
    const x = ((w.x + 1) / 2) * stage.clientWidth;
    const y = ((1 - w.y) / 2) * stage.clientHeight;
    // Near an edge, a side label flips to the other side of its point.
    let offset = out.dataset.offset;
    if (offset === OFFSET.right && x > stage.clientWidth - out.offsetWidth - 16) offset = OFFSET.left;
    else if (offset === OFFSET.left && x < out.offsetWidth + 16) offset = OFFSET.right;
    out.style.transform = `translate(${x}px, ${y}px) ${offset}`;
    out.style.opacity = facing > 0.25 ? String(Math.min(1, (facing - 0.25) * 4)) : "0";
  };

  let clockT = 0;
  const tick = (time, dt) => {
    clockT += Math.min(dt, 50) / 1000;
    if (mode === "drag" && !dragging) {
      // Inertia, then drift back after a pause.
      vel.lon *= 0.92;
      vel.lat *= 0.92;
      view.lon += vel.lon;
      view.lat = clampLat(view.lat + vel.lat);
      if (performance.now() - lastUserAt > 2600) turnTo(active ? { lat: clampLat(active.agency.geo.lat), lon: active.agency.geo.lon } : AFRICA, 1.8);
    } else if (mode === "idle") {
      // Gentle breathing around the current focus.
      const amp = active ? 1.2 : 14;
      view.lon += (base.lon + Math.sin(clockT * 0.22) * amp - view.lon) * 0.02;
      view.lat += (base.lat - view.lat) * 0.02;
    }
    for (let k = 0; k < 10; k++) litUniform[k] = lit[k];
    globe.rotation.set(view.lat * DEG, -view.lon * DEG, 0);
    globe.updateMatrixWorld();
    camera.position.z = zoom.z;
    project(hubNode.p.clone().multiplyScalar(1.01), hubLabel);
    // Zoomed in on a wide globe, every agency in view is named; otherwise (and
    // on phones, where West Africa stays too tight) only the chosen one.
    const zoomed = zoom.z < 3.2 && stage.clientWidth >= 420;
    nodes.forEach((x) => {
      if (!x.label) return;
      if (zoomed || x === active) project(x.p.clone().multiplyScalar(1.01), x.label);
      else x.label.style.opacity = "0";
    });
    renderer.render(scene, camera);
  };
  let running = false;
  new IntersectionObserver((entries) => {
    const on = entries.some((e) => e.isIntersecting);
    if (on === running) return;
    running = on;
    on ? gsap.ticker.add(tick) : gsap.ticker.remove(tick);
  }).observe(stage);

  // ----- Story ----------------------------------------------------------------
  renderCard(null);
  const story = gsap.timeline({ paused: true });
  story
    .fromTo(globe.scale, { x: 0.94, y: 0.94, z: 0.94 }, { x: 1, y: 1, z: 1, duration: 2.2, ease: "power3.out" }, 0)
    .to(view, { lat: AFRICA.lat, lon: AFRICA.lon, duration: 2.4, ease: "power3.inOut" }, 0)
    .to(hubNode.marker.material, { opacity: 1, duration: 0.4 }, 1.7)
    .fromTo(lit, { [hubNode.flagIndex]: 1 }, { [hubNode.flagIndex]: 0, duration: 1.6, ease: "power2.out" }, 1.7)
    .add(() => gsap.fromTo(pulse.scale, { x: 1, y: 1 }, { x: 2.6, y: 2.6, duration: 1.8, repeat: -1, ease: "power1.out" }), 1.8)
    .add(() => gsap.fromTo(pulse.material, { opacity: 0.8 }, { opacity: 0, duration: 1.8, repeat: -1, ease: "power1.out" }), 1.8);
  spokes.forEach((s, i) => {
    const at = 2.3 + i * 0.32;
    const o = { k: 0 };
    story
      .to(o, { k: 1, duration: 0.9, ease: "power2.inOut", onUpdate: () => setDraw(s, o.k) }, at)
      .to(s.node.marker.material, { opacity: 1, duration: 0.3 }, at + 0.8)
      .fromTo(lit, { [s.node.flagIndex]: 1 }, { [s.node.flagIndex]: 0, duration: 1.4, ease: "power2.out", immediateRender: false }, at + 0.8);
  });
  story.add(() => {
    if (mode === "story") {
      base = { ...AFRICA };
      mode = "idle";
    }
    // The network stays alive: a flux from Mali now and then.
    gsap.delayedCall(2.4, function loop() {
      if (running && !dragging) runFlux(spokes[Math.floor(Math.random() * spokes.length)]);
      gsap.delayedCall(3.2, loop);
    });
  });
  story.add(() => hubLabel.classList.add("is-on"), 2.0);

  return {
    play() {
      story.play(0);
    },
  };
}
