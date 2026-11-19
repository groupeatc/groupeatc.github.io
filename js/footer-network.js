// Responsibility: the footer map — the site ends where the home page began.
// The same network (parent company in Mali → each subsidiary, same arcs and
// same real coordinates as js/network.js) draws itself once when the footer
// comes on screen.

import { points, hub, arc } from "./network.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const svg = document.querySelector("[data-footer-network]");

if (svg && hub) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "footer-map__network");

  // Spokes, nearest subsidiary first, like on the home map.
  const spokes = points
    .filter((p) => !p.isHub)
    .sort((a, b) => Math.hypot(a.x - hub.x, a.y - hub.y) - Math.hypot(b.x - hub.x, b.y - hub.y));

  spokes.forEach((p, i) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", arc(hub, p, 0.22));
    path.setAttribute("pathLength", "1");
    path.setAttribute("class", "footer-map__route");
    path.style.setProperty("--i", i);
    g.append(path);

    const node = document.createElementNS(SVG_NS, "circle");
    node.setAttribute("cx", p.x.toFixed(1));
    node.setAttribute("cy", p.y.toFixed(1));
    node.setAttribute("r", "14");
    node.setAttribute("class", "footer-map__node");
    node.style.setProperty("--i", i);
    g.append(node);
  });

  const pulse = document.createElementNS(SVG_NS, "circle");
  pulse.setAttribute("cx", hub.x.toFixed(1));
  pulse.setAttribute("cy", hub.y.toFixed(1));
  pulse.setAttribute("r", "18");
  pulse.setAttribute("class", "footer-map__pulse");
  const core = pulse.cloneNode();
  core.setAttribute("class", "footer-map__hub");
  g.append(pulse, core);
  svg.append(g);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        svg.classList.add("is-on");
      },
      { threshold: 0.4 }
    ).observe(svg);
  } else {
    svg.classList.add("is-on");
  }
}
