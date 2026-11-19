// Responsibility: home hero — two slides (photo + copy), every size.
// Auto-advances every DURATION ms (not under reduced motion); pauses while
// the pointer or keyboard focus is in the hero, when the tab is hidden or
// the hero is off screen, and with the pause button (WCAG 2.2.2). The active
// tab's bar shows the time left. Listeners get the new index (used by the
// 3D plan panel, js/hero-3d.js).

const DURATION = 10000;

export function initHeroSlider(hero, onChange) {
  const slides = Array.from(hero.querySelectorAll("[data-slide]"));
  const medias = Array.from(hero.querySelectorAll("[data-slide-media]"));
  const tabs = Array.from(hero.querySelectorAll("[data-slide-tab]"));
  const pause = hero.querySelector("[data-slide-pause]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let elapsed = 0;
  let userPaused = reduce;
  let hover = false;
  let focus = false;
  let visible = true;
  let last = performance.now();

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    elapsed = 0;
    slides.forEach((s, k) => {
      const on = k === index;
      s.classList.toggle("is-active", on);
      s.inert = !on;
      s.setAttribute("aria-hidden", String(!on));
    });
    medias.forEach((m, k) => m.classList.toggle("is-active", k === index));
    tabs.forEach((t, k) => {
      t.setAttribute("aria-pressed", String(k === index));
      t.style.setProperty("--p", "0");
    });
    onChange?.(index);
  };

  const setPaused = (on) => {
    userPaused = on;
    pause.setAttribute("aria-pressed", String(on));
    pause.setAttribute("aria-label", on ? "Reprendre le défilement des diapositives" : "Mettre en pause le défilement des diapositives");
    hero.classList.toggle("is-paused", on);
  };

  tabs.forEach((t, k) => t.addEventListener("click", () => go(k)));
  pause.addEventListener("click", () => setPaused(!userPaused));
  hero.addEventListener("pointerenter", () => (hover = true));
  hero.addEventListener("pointerleave", () => (hover = false));
  hero.addEventListener("focusin", () => (focus = true));
  hero.addEventListener("focusout", (e) => (focus = hero.contains(e.relatedTarget)));
  new IntersectionObserver((entries) => (visible = entries.some((e) => e.isIntersecting))).observe(hero);

  const loop = (now) => {
    const dt = Math.min(now - last, 100);
    last = now;
    if (!userPaused && !hover && !focus && visible && document.visibilityState === "visible") {
      elapsed += dt;
      tabs[index].style.setProperty("--p", String(Math.min(1, elapsed / DURATION)));
      if (elapsed >= DURATION) go(index + 1);
    }
    window.requestAnimationFrame(loop);
  };

  // The other photos are fetched once the page has loaded (see home.css).
  const fetchRest = () => hero.classList.add("has-second-photo");
  if (document.readyState === "complete") fetchRest();
  else window.addEventListener("load", fetchRest, { once: true });

  setPaused(userPaused);
  hero.classList.add("has-slider");
  go(0);
  window.requestAnimationFrame(loop);

  return {
    get index() {
      return index;
    },
  };
}
