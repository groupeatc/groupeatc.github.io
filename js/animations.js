// Responsibility: IntersectionObserver-based reveal animations, scroll-triggered UI.
// Must respect prefers-reduced-motion.

// Reveal styles only apply under .js, so content stays visible if scripts fail.
document.documentElement.classList.add("js");

/* ----- Signature reveal: "le trait" ------------------------------------------
   One transition, reused for every section heading on the site: the orange
   construction line is drawn first, then the title rises from it — like a
   structure lifted onto its baseline. Headings are tagged automatically so
   pages need no extra markup. */

const signatureLines = ".section-accent, .split-heading__divider";
const signatureTitles = ".section-title, .split-heading__title, .cta-band__title";

document.querySelectorAll(signatureLines).forEach((el) => el.classList.add("sig-line", "js-reveal-sig"));
document.querySelectorAll(signatureTitles).forEach((el) => el.classList.add("sig-title", "js-reveal-sig"));
document.querySelectorAll(".hero__eyebrow, .cta-band__eyebrow").forEach((el) => el.classList.add("sig-eyebrow", "js-reveal-sig"));

const backToTop = document.querySelector(".js-back-to-top");

if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 600);
  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });

  backToTop.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

// Elements revealed when they (or, for clipped titles, their parent) enter the
// viewport. A fully clip-path'd title never reports as intersecting, so the
// observer watches its container instead.
const revealEls = document.querySelectorAll(".js-reveal, .js-reveal-sig");

if (revealEls.length) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const targets = new Map();
    revealEls.forEach((el) => {
      const trigger = el.classList.contains("sig-title") ? el.parentElement : el;
      if (!targets.has(trigger)) targets.set(trigger, []);
      targets.get(trigger).push(el);
    });

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const group = targets.get(entry.target) || [];
          group.forEach((el) => el.classList.add("is-revealed"));
          if (entry.target.classList.contains("js-reveal") || entry.target.classList.contains("js-reveal-sig")) {
            entry.target.classList.add("is-revealed");
          }
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((_, trigger) => revealObserver.observe(trigger));
  }
}

const parallaxEls = document.querySelectorAll("[data-parallax]");
const parallaxAllowed =
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  window.matchMedia("(min-width: 768px)").matches;

if (parallaxEls.length && parallaxAllowed) {
  let parallaxTicking = false;

  // Measure the untransformed container, never the moving element itself
  // (reading its own translated rect feeds back into the offset). The hero's
  // 8 slides share one anchor, so it is measured once per frame.
  const anchorOf = (el) => el.closest("[data-hero]") || el.parentElement;

  const updateParallax = () => {
    const rects = new Map();
    parallaxEls.forEach((el) => {
      const anchor = anchorOf(el);
      if (!rects.has(anchor)) rects.set(anchor, anchor.getBoundingClientRect());
      const rect = rects.get(anchor);
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      el.style.transform = `translateY(${rect.top * speed}px)`;
    });
    parallaxTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(updateParallax);
    },
    { passive: true }
  );

  updateParallax();
}

/* ----- The trait, always present: reading progress under the header -------
   A thin orange line under the sticky header grows with the scroll. Injected
   here so every page gets it without extra markup; skipped on short pages. */

const siteHeader = document.querySelector("[data-header]");

if (siteHeader) {
  const bar = document.createElement("span");
  bar.className = "read-progress";
  bar.setAttribute("aria-hidden", "true");
  siteHeader.appendChild(bar);

  let progressTicking = false;
  const updateProgress = () => {
    progressTicking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const enabled = max > window.innerHeight * 0.6;
    bar.hidden = !enabled;
    if (enabled) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4)})`;
  };
  const queue = () => {
    if (progressTicking) return;
    progressTicking = true;
    requestAnimationFrame(updateProgress);
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  window.addEventListener("load", queue);
  updateProgress();
}
