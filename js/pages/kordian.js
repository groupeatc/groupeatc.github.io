// Responsibility: réservoirs de dépôt pétrolier — "un réservoir, virole après
// virole". Four stages (fond → robe → toit → en service) told on the plan
// beside the matching real photo. Plays once when on screen, then the visitor
// picks a stage.
// The plan is a 3D blueprint (js/pages/kordian-3d.js, Three.js + GSAP, loaded
// on demand) when WebGL is available; otherwise — or with reduced motion —
// the SVG plan (CSS transitions on data-stage). Without JS: finished tank.

const tank = document.querySelector("[data-tank]");

if (tank) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plan = tank.querySelector(".tank__plan");
  const steps = Array.from(tank.querySelectorAll("[data-step]"));
  const photos = Array.from(tank.querySelectorAll("[data-photo]"));
  let scene = null; // 3D scene once loaded
  let userActed = false;
  let timers = [];

  const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  const stopStory = () => {
    timers.forEach(window.clearTimeout);
    timers = [];
  };

  // Buttons, photo and the SVG plan follow the stage.
  const show = (n) => {
    tank.dataset.stage = String(n);
    steps.forEach((s) => {
      const k = Number(s.dataset.step);
      s.setAttribute("aria-pressed", String(k === n));
      s.classList.toggle("is-done", k < n);
    });
    photos.forEach((p) => {
      const on = Number(p.dataset.photo) === n;
      p.classList.toggle("is-active", on);
      p.setAttribute("aria-hidden", String(!on));
    });
  };

  const go = (n, onDone) => {
    show(n);
    if (scene) scene.goTo(n, onDone);
    else if (onDone) later(onDone, [0, 1500, 1900, 1700, 0][n]);
  };

  steps.forEach((s) =>
    s.addEventListener("click", () => {
      userActed = true;
      stopStory();
      go(Number(s.dataset.step));
    })
  );

  // Story: the four stages once, with a short hold on each.
  const story = () => {
    const next = (n) => {
      if (userActed || n > 4) return;
      go(n, () => later(() => next(n + 1), n === 4 ? 0 : 450));
    };
    next(1);
  };

  const whenVisible = (el, fn, options) => {
    new IntersectionObserver((entries, observer) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      fn();
    }, options).observe(el);
  };

  const hasWebGL = () => {
    try {
      const c = document.createElement("canvas");
      return Boolean(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      return false;
    }
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    show(4);
  } else {
    show(0);
    let ready = Promise.resolve();
    if (hasWebGL()) {
      // Load Three.js only when the scene approaches the screen.
      ready = new Promise((resolve) =>
        whenVisible(
          tank,
          () =>
            import("./kordian-3d.js")
              .then(({ createTank3D }) => {
                scene = createTank3D(plan);
                plan.classList.add("is-3d");
                if (userActed) scene.goTo(Number(tank.dataset.stage));
              })
              .catch(() => {}) // SVG plan stays
              .finally(resolve),
          { rootMargin: "400px 0px" }
        )
      );
    }
    whenVisible(tank, () => ready.then(() => !userActed && story()), { threshold: 0.45 });
  }
}
