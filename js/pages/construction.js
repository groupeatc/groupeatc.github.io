// Responsibility: Construction — "le cordon de soudure". On reveal, the arc
// strikes in the dim workshop and a glowing bead runs along the flange rim to
// the welder's torch, then cools to steel. Afterwards the pointer becomes the
// torch (hover with a mouse, tap on touch): light, sparks and a bead that
// cools and fades. The canvas only animates while something is alive.

const weld = document.querySelector("[data-weld]");

if (weld && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const frame = weld.querySelector(".weld__frame");
  const canvas = weld.querySelector(".weld__canvas");
  const ctx = canvas.getContext("2d");

  // Flange rim in photo coordinates (1400 × 933): ellipse fitted on the photo.
  const IMG_W = 1400;
  const IMG_H = 933;
  const RIM = { cx: 1075, cy: 425, rx: 290, ry: 322, rot: (-6 * Math.PI) / 180 };
  const rimPoint = (t) => {
    const x = RIM.rx * Math.cos(t);
    const y = RIM.ry * Math.sin(t);
    return {
      x: (RIM.cx + x * Math.cos(RIM.rot) - y * Math.sin(RIM.rot)) / IMG_W,
      y: (RIM.cy + x * Math.sin(RIM.rot) + y * Math.cos(RIM.rot)) / IMG_H,
    };
  };
  // From the upper right of the rim, over the top, down to the torch (left).
  const SEAM_FROM = -1.05;
  const SEAM_TO = -Math.PI;
  const SEAM_MS = 3600;

  let w = 0;
  let h = 0;
  let scale = 1;
  let frameId = 0;
  let last = 0;
  let story = null; // { start }
  let torch = null; // { x, y } in 0–1, or null when the arc is off
  let interactive = false;
  const beads = []; // { x, y, t, stroke, persist }
  const sparks = [];
  let strokeId = 0;

  const resize = () => {
    const r = frame.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    scale = w / 640;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!frameId) draw(performance.now());
  };

  const setLight = (p, radius) => {
    if (!p) {
      frame.style.setProperty("--lr", "0px");
      return;
    }
    frame.style.setProperty("--lx", `${p.x * 100}%`);
    frame.style.setProperty("--ly", `${p.y * 100}%`);
    frame.style.setProperty("--lr", `${radius}px`);
  };

  const emit = (p, count) => {
    for (let i = 0; i < count; i++) {
      // Mostly outward and downward, like a real spray.
      const angle = Math.PI * (0.15 + Math.random() * 1.1) - (Math.random() < 0.3 ? Math.PI * 0.6 : 0);
      const speed = (120 + Math.random() * 320) * scale;
      sparks.push({
        x: p.x * w,
        y: p.y * h,
        vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
        vy: Math.sin(angle) * speed - 60 * scale,
        life: 0,
        max: 0.35 + Math.random() * 0.6,
      });
    }
  };

  const deposit = (p, persist) => {
    beads.push({ x: p.x, y: p.y, t: performance.now(), stroke: strokeId, persist });
  };

  // Bead colour by age: white-hot → yellow → orange → dull red → steel.
  const beadStyle = (age, persist) => {
    const stops = [
      [0, [255, 248, 224]],
      [0.25, [255, 196, 90]],
      [0.7, [255, 110, 30]],
      [1.4, [140, 50, 20]],
      [2.4, [128, 130, 138]],
    ];
    let c = stops[stops.length - 1][1];
    for (let i = 0; i < stops.length - 1; i++) {
      const [a, ca] = stops[i];
      const [b, cb] = stops[i + 1];
      if (age <= b) {
        const k = (age - a) / (b - a);
        c = ca.map((v, j) => Math.round(v + (cb[j] - v) * k));
        break;
      }
    }
    const alpha = persist ? 0.85 : Math.max(0, 1 - Math.max(0, age - 1.6) / 1.2);
    return { rgb: c, alpha, hot: Math.max(0, 1 - age / 0.9) };
  };

  const draw = (now) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);

    // Story: the torch travels along the rim.
    if (story) {
      const k = Math.min(1, (now - story.start) / SEAM_MS);
      const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      torch = rimPoint(SEAM_FROM + (SEAM_TO - SEAM_FROM) * eased);
      deposit(torch, true);
      if (k >= 1) {
        story = null;
        window.setTimeout(endStory, 700);
      }
    }

    // Bead.
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = beads.length - 1; i >= 0; i--) {
      const b = beads[i];
      if (!b.persist && (now - b.t) / 1000 > 2.8) beads.splice(i, 1);
    }
    for (let i = 1; i < beads.length; i++) {
      const a = beads[i - 1];
      const b = beads[i];
      if (a.stroke !== b.stroke) continue;
      const { rgb, alpha, hot } = beadStyle((now - b.t) / 1000, b.persist);
      if (alpha <= 0) continue;
      ctx.strokeStyle = `rgba(${rgb.join(",")}, ${alpha})`;
      ctx.lineWidth = 3.2 * scale;
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();
      if (hot > 0) {
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `rgb(255 140 40 / ${hot * 0.35})`;
        ctx.lineWidth = 10 * scale;
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // Arc glow + light on the photo.
    if (torch) {
      const flicker = 0.75 + Math.random() * 0.25;
      const x = torch.x * w;
      const y = torch.y * h;
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(x, y, 0, x, y, 70 * scale * flicker);
      g.addColorStop(0, "rgb(255 255 255 / 0.95)");
      g.addColorStop(0.12, "rgb(200 225 255 / 0.7)");
      g.addColorStop(0.4, "rgb(120 170 255 / 0.18)");
      g.addColorStop(1, "rgb(120 170 255 / 0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - 80 * scale, y - 80 * scale, 160 * scale, 160 * scale);
      ctx.globalCompositeOperation = "source-over";
      setLight(torch, 190 * scale * flicker);
      emit(torch, Math.random() < 0.6 ? 2 : 1);
    } else {
      setLight(null);
    }

    // Sparks: short streaks with gravity.
    ctx.globalCompositeOperation = "lighter";
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life += dt;
      if (s.life > s.max) {
        sparks.splice(i, 1);
        continue;
      }
      s.vy += 900 * scale * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = s.life / s.max;
      ctx.strokeStyle = `rgb(255 ${Math.round(230 - 120 * k)} ${Math.round(150 - 130 * k)} / ${1 - k})`;
      ctx.lineWidth = 1.4 * scale;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 0.025, s.y - s.vy * 0.025);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";

    // Keep animating while anything is alive (hot or fading bead, sparks, arc).
    const fading = beads.some((b) => (now - b.t) / 1000 < (b.persist ? 2.4 : 2.8));
    frameId = torch || story || sparks.length || fading ? window.requestAnimationFrame(draw) : 0;
    if (!frameId) last = 0;
  };

  const wake = () => {
    if (!frameId) frameId = window.requestAnimationFrame(draw);
  };

  const endStory = () => {
    torch = null;
    weld.classList.add("is-done");
    interactive = true;
    wake();
  };

  const fromEvent = (event) => {
    const r = frame.getBoundingClientRect();
    return { x: (event.clientX - r.left) / r.width, y: (event.clientY - r.top) / r.height };
  };

  frame.addEventListener("pointermove", (event) => {
    if (!interactive || event.pointerType === "touch") return;
    torch = fromEvent(event);
    deposit(torch, false);
    weld.classList.add("is-torch");
    wake();
  });
  frame.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch") return;
    torch = null;
    strokeId++;
    weld.classList.remove("is-torch");
  });
  // Touch: a tap strikes the arc briefly at that point.
  let tapTimer = 0;
  frame.addEventListener("pointerdown", (event) => {
    if (!interactive || event.pointerType !== "touch") return;
    strokeId++;
    torch = fromEvent(event);
    emit(torch, 24);
    weld.classList.add("is-torch");
    wake();
    window.clearTimeout(tapTimer);
    tapTimer = window.setTimeout(() => {
      torch = null;
      weld.classList.remove("is-torch");
    }, 600);
  });

  new ResizeObserver(resize).observe(frame);

  new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      weld.classList.add("is-striking");
      window.setTimeout(() => {
        story = { start: performance.now() };
        wake();
      }, 700);
    },
    { threshold: 0.5 }
  ).observe(weld);
}
