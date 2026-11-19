// Responsibility: Électricité & Instrumentation — "mise sous tension". On
// reveal, a control pass checks the installation; then the visitor holds the
// button (≈1 s, the ring fills) to energise the site: current runs along the
// cable trays and colour returns. Enter/Space switch at once (keyboard); a
// click when energised switches off.

const power = document.querySelector("[data-power]");

if (power) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const btn = power.querySelector("[data-power-btn]");
  const label = power.querySelector("[data-power-label]");
  const live = power.querySelector("[data-power-live]");
  const HOLD_MS = reduceMotion ? 0 : 1000;
  let holdTimer = 0;
  let on = false;
  let skipClick = false;

  const set = (state) => {
    on = state;
    power.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
    label.textContent = on ? "Couper la tension" : "Maintenir pour mettre sous tension";
    live.textContent = on ? "Installation sous tension." : "Installation hors tension.";
  };

  const cancelHold = () => {
    window.clearTimeout(holdTimer);
    power.classList.remove("is-charging");
  };

  btn.addEventListener("pointerdown", (event) => {
    skipClick = false;
    if (on || event.button !== 0) return;
    power.classList.add("is-charging");
    holdTimer = window.setTimeout(() => {
      power.classList.remove("is-charging");
      set(true);
      skipClick = true;
    }, HOLD_MS);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((type) => btn.addEventListener(type, cancelHold));
  btn.addEventListener("contextmenu", (event) => event.preventDefault());

  btn.addEventListener("click", (event) => {
    if (skipClick) {
      skipClick = false;
      return;
    }
    // Keyboard activation (detail 0) switches at once; a mouse click only
    // switches off — switching on needs the hold.
    if (on) set(false);
    else if (event.detail === 0) set(true);
  });

  const ready = () => power.classList.add("is-ready");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    power.classList.add("is-checked");
    ready();
  } else {
    new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        power.classList.add("is-checking");
        window.setTimeout(() => power.classList.add("is-checked"), 2000);
        window.setTimeout(ready, 2400);
      },
      { threshold: 0.5 }
    ).observe(power);
  }
}
