// Responsibility: carte de visite — the card tilts under the pointer (fine
// pointers only, not under reduced motion), a soft light follows it, and it
// settles back when the pointer leaves.

const card = document.querySelector("[data-card]");
const inner = card?.querySelector("[data-card-inner]");
const allowed =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (card && inner && allowed) {
  const MAX = 8; // degrees
  let frame = 0;
  let last = null;

  const update = () => {
    frame = 0;
    if (!last) return;
    const r = card.getBoundingClientRect();
    const x = (last.x - r.left) / r.width; // 0 → 1
    const y = (last.y - r.top) / r.height;
    inner.style.setProperty("--ry", `${(x - 0.5) * 2 * MAX}deg`);
    inner.style.setProperty("--rx", `${(0.5 - y) * 2 * MAX}deg`);
    inner.style.setProperty("--sx", `${x * 100}%`);
    inner.style.setProperty("--sy", `${y * 100}%`);
  };

  card.addEventListener("pointermove", (e) => {
    card.classList.add("is-tilting");
    last = { x: e.clientX, y: e.clientY };
    if (!frame) frame = window.requestAnimationFrame(update);
  });
  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-tilting");
    last = null;
    inner.style.setProperty("--rx", "0deg");
    inner.style.setProperty("--ry", "0deg");
  });
}

// Download button: once clicked (the download starts), it says so briefly and
// disappears; remembered in this browser so it stays hidden on a later visit.
// A browser can't tell when a download has actually finished: the click is
// the signal.
const download = document.querySelector(".vcard-only__download");

if (download) {
  const key = `carte-telechargee:${window.location.pathname}`;
  const done = () => {
    try {
      return window.localStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  };

  if (done()) {
    download.hidden = true;
  } else {
    download.addEventListener("click", () => {
      try {
        window.localStorage.setItem(key, "1");
      } catch {
        // Private mode / blocked storage: hidden for this visit only.
      }
      // Let the download start, then confirm and fade the button away.
      window.setTimeout(() => {
        download.classList.add("is-done");
        download.setAttribute("aria-live", "polite");
        download.lastChild.textContent = "Carte téléchargée";
        window.setTimeout(() => (download.hidden = true), 1800);
      }, 50);
    });
  }
}
