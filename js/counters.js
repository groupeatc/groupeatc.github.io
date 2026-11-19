// Responsibility: animated key-figures counters. Only wire up figures whose
// source values have been validated — see CLAUDE.md section 24.
// Progressive enhancement: the HTML always contains the final value, so the
// figure is correct without JS; the count-up only runs when it can be seen.

const counters = document.querySelectorAll("[data-counter-target]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function format(el, value) {
  const prefix = el.dataset.counterPrefix || "";
  return prefix + value.toLocaleString("fr-FR");
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counterTarget, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 4;
    el.textContent = format(el, Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
    else el.style.minWidth = ""; // final text is in place: release the reservation
  }

  requestAnimationFrame(tick);
}

if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => {
    // Reserve the final width so the layout doesn't shift while counting —
    // in em, so it follows the (fluid) font size if the viewport changes.
    // Measure the text itself (a block element spans its whole column).
    const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
    const range = document.createRange();
    range.selectNodeContents(el);
    el.style.minWidth = `${(range.getBoundingClientRect().width / fontSize).toFixed(3)}em`;
    el.textContent = format(el, 0);
    observer.observe(el);
  });
}
