// Responsibility: étude de projet — "Du plan au chantier". Three study types
// (tabs). For each, the plotter draws the plan on the left of the handle, then
// the handle glides to reveal the real ATC installation on the right. The
// visitor can drag the handle (an invisible range input over the frame).
// Until a tab is picked, the three sheets follow one another on their own,
// only while the frame is on screen.

const frame = document.querySelector("[data-drafting]");
const tabs = Array.from(document.querySelectorAll(".drafting__tab"));

if (frame && tabs.length) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const range = frame.querySelector("[data-compare-range]");
  const drawings = new Map(Array.from(frame.querySelectorAll("[data-drawing]"), (g) => [g.dataset.drawing, g]));
  const photos = new Map(Array.from(frame.querySelectorAll("[data-photo]"), (p) => [p.dataset.photo, p]));
  const captions = new Map(Array.from(document.querySelectorAll("[data-caption]"), (c) => [c.dataset.caption, c]));
  const titleEl = frame.querySelector("[data-sheet-title]");
  const folioEl = frame.querySelector("[data-sheet-folio]");
  let current = tabs[0].dataset.sheet;
  let timers = [];
  let auto = null;
  let visible = false;
  let userActed = false;

  const setPos = (value, glide = false) => {
    frame.classList.toggle("is-gliding", glide);
    frame.style.setProperty("--pos", `${value}%`);
    range.value = String(value);
  };

  const clearTimers = () => {
    timers.forEach(window.clearTimeout);
    timers = [];
  };

  const show = (key) => {
    const tab = tabs.find((t) => t.dataset.sheet === key);
    if (!tab) return;
    current = key;
    clearTimers();
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    frame.setAttribute("aria-labelledby", tab.id);
    drawings.forEach((g, k) => g.classList.toggle("is-active", k === key));
    photos.forEach((p, k) => p.classList.toggle("is-active", k === key));
    captions.forEach((c, k) => c.classList.toggle("is-active", k === key));
    titleEl.textContent = drawings.get(key).dataset.title;
    folioEl.textContent = `0${tabs.indexOf(tab) + 1} / 0${tabs.length}`;

    if (reduceMotion) {
      setPos(50);
      frame.classList.add("is-drafting");
      return;
    }
    // Plan full width while it is drawn, then the handle reveals reality.
    setPos(100);
    frame.classList.remove("is-drafting");
    void frame.offsetWidth;
    frame.classList.add("is-drafting");
    timers.push(window.setTimeout(() => setPos(50, true), 2300));
  };

  const next = () => {
    const i = tabs.findIndex((t) => t.dataset.sheet === current);
    show(tabs[(i + 1) % tabs.length].dataset.sheet);
  };

  const stopAuto = () => {
    window.clearInterval(auto);
    auto = null;
  };

  const startAuto = () => {
    if (reduceMotion || userActed || auto || !visible) return;
    auto = window.setInterval(next, 7000);
  };

  const userTakesOver = () => {
    userActed = true;
    stopAuto();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      userTakesOver();
      show(tab.dataset.sheet);
    });
    tab.addEventListener("keydown", (event) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!dir) return;
      event.preventDefault();
      const target = tabs[(i + dir + tabs.length) % tabs.length];
      target.focus();
      target.click();
    });
  });

  range.addEventListener("input", () => {
    userTakesOver();
    clearTimers();
    setPos(Number(range.value));
  });

  if ("IntersectionObserver" in window) {
    let first = true;
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (visible && first) {
            first = false;
            show(current);
          }
          visible ? startAuto() : stopAuto();
        });
      },
      { threshold: 0.4 }
    ).observe(frame);
  } else {
    frame.classList.add("is-drafting");
  }
}

// Field-shot viewfinder: once the scan has locked onto the technician, the
// lens follows the pointer (mouse hover, or a tap on touch screens). When the
// pointer leaves, it returns to the technician and the point is "relevé" again.
const shot = document.querySelector(".field-shot");
const viewfinder = shot?.querySelector(".field-shot__frame");

if (viewfinder) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rest = { x: 48, y: 34 };
  const pos = { ...rest };
  let target = { ...rest };
  let frameId = 0;

  const apply = () => {
    viewfinder.style.setProperty("--fx", `${pos.x}%`);
    viewfinder.style.setProperty("--fy", `${pos.y}%`);
  };

  // Ease the lens towards its target (instant when motion is reduced).
  const step = () => {
    const k = reduceMotion ? 1 : 0.16;
    pos.x += (target.x - pos.x) * k;
    pos.y += (target.y - pos.y) * k;
    apply();
    const done = Math.abs(target.x - pos.x) < 0.05 && Math.abs(target.y - pos.y) < 0.05;
    frameId = done ? 0 : window.requestAnimationFrame(step);
  };

  const aimAt = (x, y) => {
    target = { x, y };
    if (!frameId) frameId = window.requestAnimationFrame(step);
  };

  const fromEvent = (event) => {
    const r = viewfinder.getBoundingClientRect();
    const clamp = (v) => Math.min(100, Math.max(0, v));
    return [clamp(((event.clientX - r.left) / r.width) * 100), clamp(((event.clientY - r.top) / r.height) * 100)];
  };

  const enable = () => {
    if (shot.classList.contains("is-tracking")) return;
    apply();
    shot.classList.add("is-tracking");

    viewfinder.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      shot.classList.add("is-aiming");
      aimAt(...fromEvent(event));
    });
    viewfinder.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") return;
      shot.classList.add("is-aiming");
      aimAt(...fromEvent(event));
    });
    const back = () => {
      shot.classList.remove("is-aiming");
      aimAt(rest.x, rest.y);
    };
    viewfinder.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "touch") back();
    });
    // On touch, the lens goes back to the technician a moment after the tap.
    let backTimer = 0;
    viewfinder.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "touch") return;
      window.clearTimeout(backTimer);
      backTimer = window.setTimeout(back, 1800);
    });
  };

  viewfinder.addEventListener("animationend", (event) => {
    if (event.animationName === "scope-scan") enable();
  });
  if (reduceMotion) enable();
}
