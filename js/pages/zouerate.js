// Responsibility: Zouerate — the network map (Mali → Mauritania), drawn
// once on screen.

import { points, hub, arc } from "../network.js";

// Mémoire du site: Mali (parent company) → Mauritania, drawn once on screen,
// with the same arc and the same real coordinates as the home map.
const whereMap = document.querySelector("[data-where-map]");
const mauritanie = points.find((p) => p.country === "Mauritanie");

if (whereMap && hub && mauritanie) {
  const NS = "http://www.w3.org/2000/svg";
  const make = (name, attrs) => {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };
  const g = make("g", { class: "where__net" });
  g.append(
    make("path", { class: "where__route", d: arc(hub, mauritanie, 0.35), pathLength: "1" }),
    make("circle", { class: "where__pulse", cx: hub.x, cy: hub.y, r: "16" }),
    make("circle", { class: "where__hub", cx: hub.x, cy: hub.y, r: "11" }),
    make("circle", { class: "where__node", cx: mauritanie.x, cy: mauritanie.y, r: "13" })
  );
  const label = (x, y, text, anchor) => {
    const t = make("text", { class: "where__label", x, y, "text-anchor": anchor });
    t.textContent = text;
    return t;
  };
  g.append(label(mauritanie.x, mauritanie.y - 26, "Mauritanie", "middle"));
  whereMap.append(g);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        whereMap.classList.add("is-on");
      },
      { threshold: 0.4 }
    ).observe(whereMap);
  } else {
    whereMap.classList.add("is-on");
  }
}
