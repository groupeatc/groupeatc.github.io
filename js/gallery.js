// Responsibility: lightbox gallery — open, next/previous (buttons, arrow keys,
// swipe), Escape to close, focus trap and focus restoration.
// Generic: works on any set of [data-gallery-item] links sharing the same page.

const galleryLinks = Array.from(document.querySelectorAll("[data-gallery-item]"));

if (galleryLinks.length) {
  let currentIndex = 0;
  let lastFocused = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const single = galleryLinks.length === 1;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Galerie d'images");
  overlay.hidden = true;
  overlay.innerHTML = `
    <p class="lightbox__count" aria-live="polite"></p>
    <button type="button" class="lightbox__close" aria-label="Fermer la galerie">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" src="" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <span class="lightbox__spinner" aria-hidden="true"></span>
    <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Image précédente">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Image suivante">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector(".lightbox__img");
  const captionEl = overlay.querySelector(".lightbox__caption");
  const countEl = overlay.querySelector(".lightbox__count");
  const closeBtn = overlay.querySelector(".lightbox__close");
  const prevBtn = overlay.querySelector(".lightbox__nav--prev");
  const nextBtn = overlay.querySelector(".lightbox__nav--next");

  if (single) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
  }

  imgEl.addEventListener("load", () => overlay.classList.remove("is-loading"));
  imgEl.addEventListener("error", () => overlay.classList.remove("is-loading"));

  function show(index) {
    currentIndex = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[currentIndex];
    const caption = link.dataset.caption || "";
    overlay.classList.add("is-loading");
    imgEl.src = link.href;
    imgEl.alt = caption;
    captionEl.textContent = caption;
    countEl.textContent = `${currentIndex + 1} / ${galleryLinks.length}`;
    if (imgEl.complete && imgEl.naturalWidth) overlay.classList.remove("is-loading");
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    // Next frame so the opacity transition runs from the hidden state.
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    const finish = () => {
      overlay.hidden = true;
      if (lastFocused) lastFocused.focus();
    };
    if (reduceMotion) finish();
    else window.setTimeout(finish, 280);
  }

  galleryLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      open(index);
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  // Swipe left/right on touch screens.
  let touchStartX = null;
  overlay.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  overlay.addEventListener("touchend", (event) => {
    if (touchStartX === null || single) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) show(currentIndex + (delta < 0 ? 1 : -1));
    touchStartX = null;
  });

  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft" && !single) show(currentIndex - 1);
    if (event.key === "ArrowRight" && !single) show(currentIndex + 1);

    if (event.key === "Tab") {
      const focusables = [closeBtn, prevBtn, nextBtn].filter((el) => !el.hidden);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
