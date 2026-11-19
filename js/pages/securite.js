// Responsibility: sécurité — "contrôle EPI". On reveal, the camera closes in
// on the agent, then a control line runs down from head to feet and ticks each
// protective equipment as it passes. Then a chip (or its pin on the photo) spotlights that equipment and
// says its role; choosing it again releases the spotlight.

const epi = document.querySelector("[data-epi-check]");

if (epi) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frame = epi.querySelector(".epi__frame");
  const pins = Array.from(epi.querySelectorAll(".epi__pin"));
  const chips = Array.from(epi.querySelectorAll(".epi__chip"));
  const count = epi.querySelector("[data-epi-count]");
  const info = epi.querySelector("[data-epi-info]");
  const intro = info.innerHTML;
  const ZOOM_MS = 1200;
  const SCAN_MS = 2600;
  let selected = null;

  const tick = (key) => {
    epi.querySelectorAll(`[data-epi="${key}"]`).forEach((el) => el.classList.add("is-checked"));
    count.textContent = String(epi.querySelectorAll(".epi__chip.is-checked").length);
  };

  const select = (key) => {
    selected = selected === key ? null : key;
    const pin = pins.find((p) => p.dataset.epi === selected);
    epi.classList.toggle("is-focused", Boolean(pin));
    if (pin) {
      frame.style.setProperty("--fx", pin.style.getPropertyValue("--x"));
      frame.style.setProperty("--fy", pin.style.getPropertyValue("--y"));
    }
    pins.forEach((p) => p.classList.toggle("is-active", p.dataset.epi === selected));
    chips.forEach((c) => {
      const on = c.dataset.epi === selected;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", String(on));
    });
    const chip = chips.find((c) => c.dataset.epi === selected);
    if (chip) info.textContent = `${chip.textContent.trim().replace(/^\d+/, "")} — ${chip.dataset.text}`;
    else info.innerHTML = intro;
  };

  [...pins, ...chips].forEach((el) => el.addEventListener("click", () => select(el.dataset.epi)));

  const checkAll = () => chips.forEach((c) => tick(c.dataset.epi));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    checkAll();
    epi.classList.add("is-done");
  } else {
    new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        // Close in on the agent, then scan.
        epi.classList.add("is-zoomed");
        window.setTimeout(() => {
          epi.classList.add("is-scanning");
          // Each equipment is ticked when the line (top → bottom) reaches it.
          pins.forEach((pin) => {
            const y = parseFloat(pin.style.getPropertyValue("--y")) / 100;
            window.setTimeout(() => tick(pin.dataset.epi), 250 + y * SCAN_MS);
          });
          window.setTimeout(() => epi.classList.add("is-done"), 250 + SCAN_MS);
        }, ZOOM_MS);
      },
      { threshold: 0.5 }
    ).observe(epi);
  }
}
