// Responsibility: centrale photovoltaïque — "la course du soleil". The sun
// crosses the sky once (lever → midi) when the photo comes on screen, then the
// pointer drives it (hover, or horizontal drag on touch). Light grade, glint on
// the panels and the tracker tilt follow --s (0 = east/sunrise, 1 = west).
// The glint is masked to the panels: the mask is computed from the photo
// itself (blue-dominant pixels below the horizon).

const sun = document.querySelector("[data-sun]");

if (sun) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frame = sun.querySelector(".sun__frame");
  const img = frame.querySelector("img");
  const HORIZON = 0.36; // share of the photo height above the panel field
  let pos = 0.5;
  let target = 0.5;
  let frameId = 0;
  let interactive = false;

  const apply = (s) => {
    // noon: 1 at midday, 0 at sunrise/sunset.
    const noon = 1 - Math.abs(2 * s - 1) ** 1.6;
    frame.style.setProperty("--s", s.toFixed(4));
    frame.style.setProperty("--noon", noon.toFixed(4));
    // Sun on an arc: low near the horizon, high at noon.
    frame.style.setProperty("--sx", `${8 + s * 84}%`);
    frame.style.setProperty("--sy", `${27 - noon * 19}%`);
    // Trackers face the sun: about ±50° from flat.
    frame.style.setProperty("--tilt", `${((s - 0.5) * 100).toFixed(1)}deg`);
  };

  const step = () => {
    pos += (target - pos) * (reduceMotion ? 1 : 0.12);
    apply(pos);
    frameId = Math.abs(target - pos) > 0.0005 ? window.requestAnimationFrame(step) : 0;
  };

  const aim = (s) => {
    target = Math.min(1, Math.max(0, s));
    if (!frameId) frameId = window.requestAnimationFrame(step);
  };

  // Panel mask from the photo.
  const buildMask = () => {
    try {
      const w = 350;
      const h = Math.round((w * img.naturalHeight) / img.naturalWidth);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const y = Math.floor(i / 4 / w);
        const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
        const panel = y > h * HORIZON && b > r + 22 && b >= g;
        px[i] = px[i + 1] = px[i + 2] = 0;
        px[i + 3] = panel ? 255 : 0;
      }
      ctx.putImageData(data, 0, 0);
      const url = `url(${c.toDataURL("image/png")})`;
      const glint = sun.querySelector(".sun__glint");
      glint.style.webkitMaskImage = url;
      glint.style.maskImage = url;
      sun.classList.add("has-mask");
    } catch {
      // No mask (e.g. canvas unavailable): the glint stays hidden.
    }
  };

  if (img.complete && img.naturalWidth) buildMask();
  else img.addEventListener("load", buildMask, { once: true });

  apply(reduceMotion ? 0.5 : 0);
  pos = reduceMotion ? 0.5 : 0;

  const fromEvent = (event) => {
    const r = frame.getBoundingClientRect();
    return (event.clientX - r.left) / r.width;
  };

  frame.addEventListener("pointermove", (event) => {
    if (!interactive) return;
    if (event.pointerType === "touch" && !frame.hasPointerCapture(event.pointerId)) return;
    aim(fromEvent(event));
  });
  frame.addEventListener("pointerdown", (event) => {
    if (!interactive || event.pointerType !== "touch") return;
    frame.setPointerCapture(event.pointerId);
    aim(fromEvent(event));
  });

  const enable = () => {
    interactive = true;
    sun.classList.add("is-live");
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    enable();
  } else {
    new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        // Sunrise to noon, slowly.
        const start = performance.now();
        const rise = (now) => {
          const k = Math.min(1, (now - start) / 3200);
          pos = target = 0.5 * (1 - (1 - k) ** 3);
          apply(pos);
          if (k < 1) window.requestAnimationFrame(rise);
          else enable();
        };
        window.requestAnimationFrame(rise);
      },
      { threshold: 0.5 }
    ).observe(sun);
  }
}
