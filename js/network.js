// Responsibility: the "network" — Groupe ATC's recurring visual thread.
//
// The same orange line that underlines every heading (see the signature
// reveal in animations.js) becomes, on the presence map, the structure of the
// group: Groupe ATC logo → parent company in Mali → interconnected subsidiaries.
//
// Geometry comes from data/agencies.js (real hotspot coordinates of the live
// site, in % of the 1536×1499 presence map) — nothing is invented.

import { agencies } from "../data/agencies.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const MAP_W = 1536;
const MAP_H = 1499;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const points = agencies.map((agency) => ({
  country: agency.country,
  isHub: Boolean(agency.isHub),
  x: (parseFloat(agency.position.left) / 100) * MAP_W,
  y: (parseFloat(agency.position.top) / 100) * MAP_H,
}));
export const hub = points.find((p) => p.isHub);

// Gentle arc bowing "upward" so routes read as trajectories, not a wiring diagram.
export function arc(from, to, bow = 0.28) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  return `M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${mx.toFixed(1)} ${(my - dist * bow).toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/* ----- 1. Presence map: Groupe ATC → Mali → subsidiaries --------------------
   The structure of the group, told without words:
     · the Groupe ATC logo (printed on the map image, whose own faint lines
       converge on it) is tied to the parent company in Mali;
     · Mali is tied to every subsidiary;
     · the subsidiaries are interconnected with each other.
   Sequence: the logo's source point lights, a flux runs logo → Mali and the
   parent company lights; routes then leave Mali one by one (nearest first),
   each carrying a flux that lights its country; finally the subsidiaries'
   mesh is woven. The network then stays alive with an occasional flux, with
   no reset or loop restart.
   Everything lives in the map's own 1536×1499 viewBox, so routes stay aligned
   with the %-positioned hotspots at every size. */

const map = document.querySelector("[data-hotspots-map]");

// Logo anchor, in image pixels: where the map image's own connection lines
// converge, in the white space left of the "Groupe ATC" logo.
const ORIGIN = { x: 814, y: 522, country: null };

// Each subsidiary is meshed with its nearest siblings (deduplicated), which
// reads as "interconnected" without drawing all 28 possible links.
const MESH_NEIGHBOURS = 2;

if (map && hub) {
  const compact = window.matchMedia("(max-width: 767px)").matches;
  const timing = {
    originDelay: 150,             // the logo's source point appears first
    parentRoute: 700,             // logo → Mali
    firstSpoke: 2300,             // then Mali → subsidiaries
    step: compact ? 600 : 480,    // next spoke starts
    flux: compact ? 1500 : 1300,  // travel time of one flux
    meshStep: 90,                 // stagger of the mesh links
    idle: compact ? 5200 : 2800,  // pause between fluxes once the network is up
  };

  const svg = el("svg", {
    class: "network network--map",
    viewBox: `0 0 ${MAP_W} ${MAP_H}`,
    "aria-hidden": "true",
    focusable: "false",
  });

  const subsidiaries = points
    .filter((p) => p !== hub)
    .sort((a, b) => Math.hypot(a.x - hub.x, a.y - hub.y) - Math.hypot(b.x - hub.x, b.y - hub.y));

  // Routes, keyed by id. `from` / `to` are kept so a flux can run either way.
  const routes = new Map();
  const addRoute = (id, from, to, kind, bow) => {
    const path = el("path", {
      d: arc(from, to, bow),
      pathLength: "1",
      class: `network__route network__route--${kind}`,
    });
    routes.set(id, { id, from, to, kind, bow, path });
    return path;
  };

  const meshLayer = el("g", { class: "network__mesh" });
  const spokeLayer = el("g", { class: "network__spokes" });

  const meshKeys = new Set();
  subsidiaries.forEach((a) => {
    subsidiaries
      .filter((b) => b !== a)
      .sort((b, c) => Math.hypot(b.x - a.x, b.y - a.y) - Math.hypot(c.x - a.x, c.y - a.y))
      .slice(0, MESH_NEIGHBOURS)
      .forEach((b) => {
        const key = [a.country, b.country].sort().join("|");
        if (meshKeys.has(key)) return;
        meshKeys.add(key);
        meshLayer.appendChild(addRoute(`mesh:${key}`, a, b, "mesh", 0.12));
      });
  });

  spokeLayer.appendChild(addRoute("parent", ORIGIN, hub, "parent", 0.2));
  subsidiaries.forEach((s) => spokeLayer.appendChild(addRoute(`spoke:${s.country}`, hub, s, "spoke", 0.22)));

  const fluxLayer = el("g", { class: "network__fluxes" });
  const origin = el("g", { class: "network__origin" });
  origin.append(
    el("circle", { cx: ORIGIN.x, cy: ORIGIN.y, r: 34, class: "network__origin-halo" }),
    el("circle", { cx: ORIGIN.x, cy: ORIGIN.y, r: 11, class: "network__origin-core" })
  );
  svg.append(meshLayer, spokeLayer, fluxLayer, origin);
  map.appendChild(svg);

  const meshRoutes = Array.from(routes.values()).filter((r) => r.kind === "mesh");
  const linksOf = (country) =>
    Array.from(routes.values()).filter((r) => r.from.country === country || r.to.country === country);

  // Hotspots are rendered by js/pages/home.js, which may run after this
  // module: always look them up lazily.
  const hotspotOf = (country) =>
    Array.from(map.querySelectorAll(".hotspot")).find((spot) => spot.dataset.country === country);

  const inFlight = new Set();
  let introDone = false;
  let inView = false;

  function light(country, withPing) {
    const spot = country && hotspotOf(country);
    if (!spot) return;
    spot.classList.add("is-on");
    if (!withPing) return;
    spot.classList.remove("is-reached");
    void spot.offsetWidth; // restart the arrival ping
    spot.classList.add("is-reached");
  }

  // One flux: a dot with a short trail following the route exactly (SMIL
  // animateMotion on the route's own geometry, no per-frame JS). `reverse`
  // runs it from the route's end to its start.
  function sendFlux(id, reverse = false) {
    const route = routes.get(id);
    if (!route || inFlight.has(id)) return;
    inFlight.add(id);

    const [from, to] = reverse ? [route.to, route.from] : [route.from, route.to];
    // The arc always bows towards the top of the map, so swapping its ends
    // gives the very same curve, travelled the other way.
    const d = arc(from, to, route.bow);
    const dur = `${timing.flux}ms`;
    const trailLength = 0.16;
    const ease = { calcMode: "spline", keyTimes: "0;1", keySplines: "0.45 0 0.2 1" };

    const group = el("g", { class: `network__flux network__flux--${route.kind}`, opacity: "0" });
    const trail = el("path", {
      d,
      pathLength: "1",
      class: "network__flux-trail",
      "stroke-dasharray": `${trailLength} 2`,
      "stroke-dashoffset": trailLength,
    });
    const halo = el("circle", { r: 20, class: "network__flux-halo" });
    const core = el("circle", { r: 7, class: "network__flux-core" });

    const animations = [
      el("animate", { attributeName: "opacity", values: "0;1;1;0", keyTimes: "0;0.12;0.82;1", dur, begin: "indefinite", fill: "freeze" }),
      el("animate", { attributeName: "stroke-dashoffset", values: `${trailLength};${trailLength - 1}`, dur, begin: "indefinite", fill: "freeze", ...ease }),
      el("animateMotion", { path: d, keyPoints: "0;1", dur, begin: "indefinite", fill: "freeze", ...ease }),
      el("animateMotion", { path: d, keyPoints: "0;1", dur, begin: "indefinite", fill: "freeze", ...ease }),
    ];
    group.appendChild(animations[0]);
    trail.appendChild(animations[1]);
    halo.appendChild(animations[2]);
    core.appendChild(animations[3]);
    group.append(trail, halo, core);
    fluxLayer.appendChild(group);
    animations.forEach((animation) => animation.beginElement());

    window.setTimeout(() => light(to.country, true), timing.flux * 0.9);
    window.setTimeout(() => {
      group.remove();
      inFlight.delete(id);
    }, timing.flux + 60);
  }

  const draw = (id) => routes.get(id).path.classList.add("is-drawn");

  function playIntro() {
    window.setTimeout(() => origin.classList.add("is-on"), timing.originDelay);
    window.setTimeout(() => draw("parent"), timing.parentRoute);
    window.setTimeout(() => sendFlux("parent"), timing.parentRoute + 260);

    subsidiaries.forEach((s, index) => {
      const start = timing.firstSpoke + index * timing.step;
      window.setTimeout(() => draw(`spoke:${s.country}`), start);
      window.setTimeout(() => sendFlux(`spoke:${s.country}`), start + 260);
    });

    const meshStart = timing.firstSpoke + (subsidiaries.length - 1) * timing.step + 260 + timing.flux;
    meshRoutes.forEach((r, index) => window.setTimeout(() => draw(r.id), meshStart + index * timing.meshStep));

    const end = meshStart + meshRoutes.length * timing.meshStep + 900;
    window.setTimeout(() => {
      points.forEach((p) => light(p.country, false));
      origin.classList.add("is-on");
      map.classList.remove("network-pending");
      map.classList.add("is-drawn");
      introDone = true;
      keepAlive();
    }, end);
  }

  // Stable state: mostly Mali → a subsidiary, sometimes between two
  // subsidiaries, sometimes logo → Mali. Never the same route twice in a row,
  // only while the map is on screen.
  function keepAlive() {
    let last = null;
    const pickRoute = () => {
      const roll = Math.random();
      const pool =
        roll < 0.6 ? subsidiaries.map((s) => `spoke:${s.country}`)
        : roll < 0.9 ? meshRoutes.map((r) => r.id)
        : ["parent"];
      const choices = pool.filter((id) => id !== last && !inFlight.has(id));
      return choices[Math.floor(Math.random() * choices.length)];
    };
    const tick = () => {
      if (inView && !document.hidden) {
        const id = pickRoute();
        if (id) {
          last = id;
          sendFlux(id, routes.get(id).kind === "mesh" && Math.random() < 0.5);
        }
      }
      window.setTimeout(tick, timing.idle + Math.random() * 1200);
    };
    window.setTimeout(tick, timing.idle);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    // Static network: every route and hotspot visible, nothing travels.
    map.classList.add("is-drawn");
  } else {
    map.classList.add("network-pending");
    let started = false;
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (!started && entry.intersectionRatio >= 0.35) {
            started = true;
            playIntro();
          }
        });
      },
      { threshold: [0, 0.35] }
    ).observe(map);
  }

  // Hover / focus: a subsidiary shows its link to Mali and to its siblings;
  // Mali shows its link to the group and to every subsidiary. The rest steps
  // back, and once the network is up a flux is sent from Mali.
  let activeCountry = null;
  const setActive = (country) => {
    if (country === activeCountry) return;
    activeCountry = country;
    const active = new Set(country ? linksOf(country).map((r) => r.id) : []);
    routes.forEach((route) => route.path.classList.toggle("is-active", active.has(route.id)));
    map.classList.toggle("has-active-route", active.size > 0);
    if (!country || !introDone || reduceMotion) return;
    sendFlux(country === hub.country ? "parent" : `spoke:${country}`);
  };
  ["mouseover", "focusin"].forEach((type) =>
    map.addEventListener(type, (event) => {
      const hotspot = event.target.closest(".hotspot");
      setActive(hotspot ? hotspot.dataset.country : null);
    })
  );
  ["mouseleave", "focusout"].forEach((type) => map.addEventListener(type, () => setActive(null)));

  // Other components (agency cards on the agences page) can light a country.
  map.addEventListener("network:focus", (event) => setActive(event.detail?.country ?? null));
}
