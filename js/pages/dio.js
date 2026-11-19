// Responsibility: DIO — "de la trémie aux silos". The three commissioning
// tests told on two real photos of the plant (markers on the equipment):
//   individuels — each machine is tested in turn (LED blinks, then on);
//   séquentiels — machines start in line order as the material reaches them;
//   en charge   — material runs through the whole line, 400 000 t/an.
// Plays once in that order when the line comes on screen, then the visitor
// picks a test.

const line = document.querySelector("[data-line]");

if (line) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tests = Array.from(line.querySelectorAll("[data-test]"));
  const eqs = Array.from(line.querySelectorAll(".spot")).sort((a, b) => a.style.getPropertyValue("--n") - b.style.getPropertyValue("--n"));
  const label = line.querySelector("[data-line-label]");
  const value = line.querySelector("[data-line-value]");
  const name = (eq) => eq.querySelector(".spot__label").textContent;
  const STEP_MS = 420;
  const SEQ_MS = 4200;
  let timers = [];
  let countFrame = 0;
  let userActed = false;

  line.style.setProperty("--seq-ms", `${SEQ_MS}ms`);

  const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  const reset = () => {
    timers.forEach(window.clearTimeout);
    timers = [];
    window.cancelAnimationFrame(countFrame);
    eqs.forEach((eq) => eq.classList.remove("is-testing", "is-ok"));
    line.classList.remove("is-flowing");
  };
  const setMode = (mode) => {
    line.dataset.mode = mode;
    tests.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.test === mode)));
  };
  const read = (l, v = "") => {
    label.textContent = l;
    value.textContent = v;
  };

  const count = (to, ms) => {
    if (reduceMotion) {
      value.textContent = `${to.toLocaleString("fr-FR")} t/an`;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / ms);
      value.textContent = `${Math.round(to * (1 - (1 - k) ** 3)).toLocaleString("fr-FR")} t/an`;
      if (k < 1) countFrame = window.requestAnimationFrame(tick);
    };
    countFrame = window.requestAnimationFrame(tick);
  };

  const run = {
    individuels(done) {
      setMode("individuels");
      if (reduceMotion) {
        eqs.forEach((eq) => eq.classList.add("is-ok"));
        read("Essais individuels", `${eqs.length} équipements testés`);
        return done?.();
      }
      eqs.forEach((eq, i) => {
        later(() => {
          eq.classList.add("is-testing");
          read("Essai individuel", name(eq));
        }, i * STEP_MS);
        later(() => eq.classList.replace("is-testing", "is-ok"), i * STEP_MS + STEP_MS * 0.85);
      });
      later(() => {
        read("Essais individuels", `${eqs.length} équipements testés`);
        done?.();
      }, eqs.length * STEP_MS + 500);
    },

    sequentiels(done) {
      setMode("sequentiels");
      if (reduceMotion) {
        line.classList.add("is-flowing");
        eqs.forEach((eq) => eq.classList.add("is-ok"));
        read("Essais séquentiels", "Ligne démarrée");
        return done?.();
      }
      void line.offsetWidth;
      line.classList.add("is-flowing");
      // Each machine starts when the material reaches it (line order).
      eqs.forEach((eq, i) => {
        later(() => {
          eq.classList.add("is-ok");
          read("Démarrage en séquence", name(eq));
        }, ((i + 0.5) / eqs.length) * SEQ_MS);
      });
      later(() => {
        read("Essais séquentiels", "Ligne démarrée");
        done?.();
      }, SEQ_MS + 500);
    },

    charge() {
      setMode("charge");
      eqs.forEach((eq) => eq.classList.add("is-ok"));
      label.textContent = "En charge";
      count(400000, 1800);
    },
  };

  const play = (mode, chain) => {
    reset();
    run[mode](chain);
  };

  tests.forEach((t) =>
    t.addEventListener("click", () => {
      userActed = true;
      play(t.dataset.test);
    })
  );

  // Story: the three tests in order, once, when the line is on screen.
  const story = () => {
    if (userActed) return;
    play("individuels", () =>
      later(() => !userActed && play("sequentiels", () => later(() => !userActed && play("charge"), 600)), 700)
    );
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    play("charge");
  } else {
    new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        story();
      },
      { threshold: 0.45 }
    ).observe(line);
  }
}
