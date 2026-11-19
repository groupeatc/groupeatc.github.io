// Responsibility: homepage-only behavior (client logos loop, process stage,
// video, the plan lens of the opening). The presence map hotspots are
// rendered by js/presence-map.js.

import { clients, SHOW_PLACEHOLDERS } from "../../data/clients.js";
import { initHeroSlider } from "../hero-slider.js";
import { agencies } from "../../data/agencies.js";

// Client / partner logos — data/clients.js. The band stays hidden when there
// is nothing to show, so no empty slot is ever published.
const clientsBand = document.querySelector("[data-clients]");
const clientsList = clientsBand?.querySelector("[data-clients-list]");
const shownClients = clients.filter((client) => !client.placeholder || SHOW_PLACEHOLDERS);

if (clientsBand && clientsList && shownClients.length) {
  shownClients.forEach((client) => {
    const item = document.createElement("li");
    item.className = "clients__item";

    const img = document.createElement("img");
    img.src = client.logo;
    img.alt = client.name;
    img.width = client.width;
    img.height = client.height;
    img.loading = "lazy";
    img.decoding = "async";
    item.appendChild(img);

    clientsList.appendChild(item);
  });
  clientsBand.hidden = false;

  // Endless loop: a second, hidden copy of the list follows the first, and
  // the track slides by exactly one list width. Static grid under reduced
  // motion.
  const track = clientsBand.querySelector("[data-clients-track]");
  const allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (track && allowMotion) {
    const copy = clientsList.cloneNode(true);
    copy.removeAttribute("data-clients-list");
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("img").forEach((img) => { img.alt = ""; });
    track.appendChild(copy);
    track.style.setProperty("--loop-duration", `${shownClients.length * 5}s`);
    clientsBand.classList.add("is-looping");
  }
}

// "De l'étude à la mise en service" — the step crossing the middle of the
// viewport drives the sticky illustration (styles in css/pages/home.css).
// Without IntersectionObserver the markup's final state is kept.
const processStage = document.querySelector("[data-process-stage]");
const processList = document.querySelector("[data-process-steps]");

// Very old browsers: no stage logic — show the drawing as it is.
if (processStage && !("IntersectionObserver" in window)) processStage.classList.add("is-drawing", "is-ready");

if (processStage && processList && "IntersectionObserver" in window) {
  const steps = Array.from(processList.querySelectorAll(".process__step"));
  const indexEl = processStage.querySelector("[data-process-index]");
  const labelEl = processStage.querySelector("[data-process-label]");

  const setStage = (current) => {
    processStage.dataset.stage = String(current);
    for (let i = 1; i < steps.length; i += 1) {
      processStage.classList.toggle(`reached-${i}`, i <= current);
    }
    steps.forEach((step, i) => {
      step.classList.toggle("is-reached", i <= current);
      step.classList.toggle("is-passed", i < current);
      step.classList.toggle("is-active", i === current);
    });
    if (indexEl) indexEl.textContent = String(current + 1).padStart(2, "0");
    if (labelEl) labelEl.textContent = steps[current].querySelector(".process__title").textContent;
    showProof(current);
    process3d?.goTo(current);
    processStage.classList.add("is-ready");
  };

  // « Du plan au réel »: the 3D frame (js/process-3d.js) replaces the drawing
  // when WebGL is available, and a real photo proves each step.
  let process3d = null;
  const proof = processStage.querySelector("[data-process-proof]");
  const proofs = proof ? Array.from(proof.querySelectorAll("[data-proof]")) : [];
  const proofCaption = proof?.querySelector("[data-proof-caption]");
  function showProof(current) {
    if (!proof || proof.hidden) return;
    proofs.forEach((p, i) => p.classList.toggle("is-active", i === current));
    if (proofCaption) proofCaption.textContent = proofs[current]?.dataset.caption ?? "";
  }
  const glOk = (() => {
    try {
      return Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      return false;
    }
  })();
  if (glOk && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Decided now, long before the section is seen: the drawing never shows
    // first; it only comes back if the 3D can't load.
    processStage.classList.add("is-3d");
    new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        import("../process-3d.js")
          .then(({ createProcess3D }) => {
            process3d = createProcess3D(processStage);
            if (proof) proof.hidden = false;
            const now = Number(processStage.dataset.stage);
            const step = Number.isFinite(now) ? now : 0;
            showProof(step);
            process3d.goTo(step);
          })
          .catch(() => {
            processStage.classList.remove("is-3d");
            processStage.classList.add("is-drawing"); // the drawing comes back
          });
      },
      { rootMargin: "500px 0px" }
    ).observe(processStage);
  } else {
    processStage.classList.add("is-drawing");
  }

  setStage(0);
  processList.dataset.ready = "";

  // Keep the stage covered until it is actually seen, so the plotter sweep at
  // "Ingénierie" plays in front of the visitor rather than off screen.
  processStage.dataset.stage = "pre";
  const stageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (processStage.dataset.stage === "pre") setStage(0);
        stageObserver.disconnect();
      });
    },
    { threshold: 0.4 }
  );
  stageObserver.observe(processStage);

  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setStage(steps.indexOf(entry.target));
      });
    },
    { rootMargin: "-50% 0px -45% 0px" }
  );
  steps.forEach((step) => stepObserver.observe(step));
}

/* ----- Ouverture: the plan under the pointer --------------------------------
   Once the opening is over (≈4 s, or at once without motion), the blueprint
   comes back inside a lens that follows the pointer (fine pointers only).
   The mask is expressed in the plan layer's own box, which is shifted by
   the parallax and scaled by the push-in: positions are mapped back. */

const heroEl = document.querySelector("[data-hero]");
const plan = heroEl?.querySelector("[data-hero-plan]");

if (heroEl && plan) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const goLive = () => heroEl.classList.add("is-live");
  window.setTimeout(goLive, reduce ? 0 : 4100);

  if (finePointer) {
    let frame = 0;
    let last = null;
    const update = () => {
      frame = 0;
      if (!last) return;
      const r = plan.getBoundingClientRect();
      const h = heroEl.getBoundingClientRect();
      heroEl.style.setProperty("--mx", `${((last.x - r.left) / r.width) * plan.offsetWidth}px`);
      heroEl.style.setProperty("--my", `${((last.y - r.top) / r.height) * plan.offsetHeight}px`);
      heroEl.style.setProperty("--mx-s", `${last.x - h.left}px`);
      heroEl.style.setProperty("--my-s", `${last.y - h.top}px`);
    };
    heroEl.addEventListener("pointermove", (event) => {
      if (!heroEl.classList.contains("is-live")) return;
      // Not over the copy or the buttons: the lens would hide them.
      const overCopy = event.target.closest(".hero__content > *, .hero__caption");
      heroEl.classList.toggle("is-aiming", !overCopy);
      last = { x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(update);
    });
    heroEl.addEventListener("pointerleave", () => heroEl.classList.remove("is-aiming"));
  }
}

/* ----- Hero: two slides, each with its 3D plan ------------------------------
   The slider runs at every size (js/hero-slider.js). With WebGL and without
   reduced motion, the 3D plan (js/hero-3d.js) is loaded once the page has
   loaded — the photo is never held back — and follows the slides: steel
   frame, then storage tank. From 1024 px it floats on the right; below, in
   the free space above the copy, sized to it (hidden if too cramped). */

if (heroEl) {
  const panel = heroEl.querySelector("[data-plan3d]");
  const label = panel?.querySelector("[data-plan3d-label]");
  const slides = Array.from(heroEl.querySelectorAll("[data-slide]"));
  let plan3d = null;

  const slider = initHeroSlider(heroEl, (i) => {
    if (label) label.textContent = slides[i].dataset.planLabel;
    plan3d?.show(i);
  });

  const motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const webgl = (() => {
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  })();

  // Phones / tablets: the plan takes the space above the highest copy block.
  const narrow = window.matchMedia("(max-width: 1023px)");
  const fit = () => {
    if (!narrow.matches) return;
    const top = heroEl.getBoundingClientRect().top;
    const free = Math.min(...slides.map((s) => s.getBoundingClientRect().top - top)) - 12;
    const size = Math.min(free - 8, window.innerWidth * 0.78, 340);
    panel.classList.toggle("is-cramped", size < 170);
    heroEl.style.setProperty("--plan-size", `${Math.round(size)}px`);
    heroEl.style.setProperty("--plan-top", `${Math.round(Math.max(8, (free - size) / 2))}px`);
  };

  if (panel && motion && webgl) {
    const start = () =>
      import("../hero-3d.js")
        .then(({ createHero3D }) => {
          panel.hidden = false;
          fit();
          window.addEventListener("resize", fit, { passive: true });
          plan3d = createHero3D(panel);
          plan3d.show(slider.index);
        })
        .catch(() => {
          panel.hidden = true; // photo and copy only
        });
    const idle = window.requestIdleCallback ?? ((fn) => window.setTimeout(fn, 200));
    if (document.readyState === "complete") idle(start);
    else window.addEventListener("load", () => idle(start), { once: true });
  }
}

/* ----- End of the story: « l'ouvrage est en service » ------------------------
   The closing band shows the hero's steel frame finished, lit by the real
   time in Bamako (js/finale-3d.js). Same conditions as the hero plan; loaded
   when the band comes near; the band stays as it is otherwise. */

const finale = document.querySelector("[data-finale]");
if (finale && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const hub = agencies.find((agency) => agency.isHub);
  const gl = (() => {
    try {
      return Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      return false;
    }
  })();
  const near = (fn, options) =>
    new IntersectionObserver((entries, observer) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      fn();
    }, options).observe(finale.closest(".cta-band"));

  if (gl && hub?.timeZone) {
    near(() =>
      import("../finale-3d.js")
        .then(({ createFinale3D }) => {
          finale.hidden = false;
          const site = createFinale3D(finale, { timeZone: hub.timeZone });
          near(() => site.play(), { threshold: 0.5 });
        })
        .catch(() => {
          finale.hidden = true;
        }),
      { rootMargin: "600px 0px" }
    );
  }
}

/* ----- End of the page: live time at the head office ----------------------- */

const hqClock = document.querySelector("[data-hq-clock]");
const hq = agencies.find((agency) => agency.isHub);

if (hqClock && hq?.timeZone) {
  const timeEl = hqClock.querySelector("[data-hq-time]");
  const format = new Intl.DateTimeFormat("fr-FR", { timeZone: hq.timeZone, hour: "2-digit", minute: "2-digit" });
  const tick = () => {
    const now = new Date();
    timeEl.textContent = format.format(now).replace(":", " h ");
    timeEl.dateTime = now.toISOString();
  };
  tick();
  hqClock.hidden = false;
  // Next minute boundary, then every minute.
  window.setTimeout(() => {
    tick();
    window.setInterval(tick, 60000);
  }, 60000 - (Date.now() % 60000));
}

// Le réseau en globe 3D (js/globe.js) — phones only (< 768 px): on wider
// screens the flat presence map (js/network.js) stays as it is. Loaded when
// the About section comes near, only with WebGL and without reduced motion.
// Resizing across the breakpoint switches between the two.
const globeRoot = document.querySelector("[data-globe]");
const phone = window.matchMedia("(max-width: 767px)");

if (globeRoot && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const webgl = (() => {
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  })();

  if (webgl) {
    const media = globeRoot.closest(".about__media");
    const once = (fn, options) =>
      new IntersectionObserver((entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        fn();
      }, options).observe(media);

    // On phones the globe's place is taken at once (a navy disc stands in
    // while it loads), so the flat map never shows first.
    let loading = null;
    let failed = false;
    const apply = () => {
      const on = !failed && phone.matches;
      media.classList.toggle("has-globe", on);
      globeRoot.hidden = !on;
    };
    const load = () => {
      loading ??= new Promise((resolve) =>
        once(() => {
          import("../globe.js")
            .then(({ createGlobe }) => createGlobe(globeRoot))
            .then((globe) => once(() => globe.play(), { threshold: 0.4 }))
            .catch(() => {
              failed = true; // the flat map comes back
              apply();
            })
            .finally(resolve);
        }, { rootMargin: "500px 0px" })
      );
    };

    apply();
    if (phone.matches) load();
    phone.addEventListener("change", () => {
      if (phone.matches) load();
      apply();
    });
  }
}
