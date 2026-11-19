// Responsibility: agences page — the living atlas.
// Pick a country (index button or map hotspot): the camera flies to it, its
// route to the group lights up (js/network.js listens to "network:focus"),
// a floating card shows its details and its live local time. An optional
// guided tour visits every agency and stops as soon as the visitor acts.

import { agencies } from "../../data/agencies.js";

const atlas = document.querySelector(".atlas");
const frame = atlas?.querySelector("[data-agencies-map]");
const map = frame?.querySelector("[data-hotspots-map]");
const panel = atlas?.querySelector("[data-atlas-panel]");
const buttons = Array.from(atlas?.querySelectorAll("[data-country]") ?? []);
const tourButton = atlas?.querySelector("[data-atlas-tour]");

if (atlas && frame && map && panel && buttons.length) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const byCountry = new Map(agencies.map((a) => [a.country, a]));
  const order = buttons.map((b) => b.dataset.country);
  let current = null;
  let tourTimer = null;

  /* ----- Live local times ------------------------------------------------- */

  const timeIn = (timeZone) =>
    new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date());

  const tickClocks = () => {
    atlas.querySelectorAll("[data-tz]").forEach((el) => {
      el.textContent = timeIn(el.dataset.tz);
    });
    if (current) panel.querySelector("[data-panel-time]").textContent = `${timeIn(byCountry.get(current).timeZone)} — heure locale`;
  };

  /* ----- Camera ----------------------------------------------------------- */
  // translate + scale from a fixed origin, so moving from one country to the
  // next is one continuous flight rather than a jump.

  const fly = (agency, scale) => {
    if (!agency) {
      frame.style.setProperty("--s", 1);
      frame.style.setProperty("--tx", 0);
      frame.style.setProperty("--ty", 0);
      return;
    }
    const px = parseFloat(agency.position.left);
    const py = parseFloat(agency.position.top);
    const clamp = (v) => Math.min(0, Math.max(100 - 100 * scale, v));
    frame.style.setProperty("--s", scale);
    frame.style.setProperty("--tx", clamp(50 - px * scale).toFixed(2));
    frame.style.setProperty("--ty", clamp(45 - py * scale).toFixed(2));
  };

  /* ----- Floating card ---------------------------------------------------- */

  const link = (href, text, extra = "") => `<a href="${href}"${extra}>${text}</a>`;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const fillPanel = (agency) => {
    const lines = [];
    if (agency.address) lines.push(`<span>${esc(agency.address)}</span>`);
    if (agency.phone) lines.push(link(`tel:+${agency.phone.replace(/\D/g, "")}`, esc(agency.phone)));
    if (agency.email) lines.push(link(`mailto:${agency.email}`, esc(agency.email)));
    if (agency.catalogue) lines.push(link(agency.catalogue, "Catalogue (PDF, nouvel onglet)", ' target="_blank" rel="noopener" class="atlas__panel-doc"'));
    if (!lines.length) lines.push("<span>Coordonnées à venir</span>");

    panel.querySelector("[data-panel-kicker]").textContent = agency.isHub ? "Société mère" : "Filiale";
    panel.querySelector("[data-panel-country]").textContent = agency.country;
    panel.querySelector("[data-panel-lines]").innerHTML = lines.join("");
    panel.classList.toggle("atlas__panel--hub", Boolean(agency.isHub));

    panel.hidden = false;
    panel.classList.remove("is-changing");
    void panel.offsetWidth; // replay the card entrance
    panel.classList.add("is-changing");
  };

  /* ----- Selection -------------------------------------------------------- */

  const select = (country, { zoom = true } = {}) => {
    const agency = byCountry.get(country);
    if (!agency) return;
    current = country;
    // List buttons are toggles (aria-pressed); map hotspots are links, whose
    // selected state is aria-current.
    buttons.forEach((b) => {
      const on = b.dataset.country === country;
      if (b.tagName === "A") on ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current");
      else b.setAttribute("aria-pressed", String(on));
    });
    if (tourTimer) reveal(buttons.find((b) => b.dataset.country === country));
    fillPanel(agency);
    tickClocks();
    if (zoom) fly(agency, agency.isHub ? 1.45 : 1.65);
    frame.classList.toggle("is-zoomed", zoom);
    map.dispatchEvent(new CustomEvent("network:focus", { detail: { country } }));
  };

  const stopTour = () => {
    if (!tourTimer) return;
    window.clearInterval(tourTimer);
    tourTimer = null;
    tourButton.setAttribute("aria-pressed", "false");
    tourButton.querySelector("[data-tour-label]").textContent = "Visite guidée du réseau";
  };

  const startTour = () => {
    let i = Math.max(0, order.indexOf(current));
    select(order[i]);
    tourTimer = window.setInterval(() => {
      i = (i + 1) % order.length;
      select(order[i]);
    }, reduceMotion ? 4000 : 3400);
    tourButton.setAttribute("aria-pressed", "true");
    tourButton.querySelector("[data-tour-label]").textContent = "Arrêter la visite";
  };

  // Keep the chosen country visible in the swipeable index (mobile) without
  // moving the page.
  const reveal = (button) => {
    const row = button.closest(".atlas__index");
    if (!row || row.scrollWidth <= row.clientWidth) return;
    const li = button.parentElement;
    row.scrollTo({ left: li.offsetLeft - row.clientWidth / 2 + li.offsetWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      stopTour();
      select(button.dataset.country);
      reveal(button);
    });
  });

  tourButton?.addEventListener("click", () => (tourTimer ? stopTour() : startTour()));

  // Map hotspots select instead of jumping to the directory.
  map.addEventListener("click", (event) => {
    const spot = event.target.closest(".hotspot");
    if (!spot) return;
    event.preventDefault();
    stopTour();
    select(spot.dataset.country);
  });

  // Hovering the map lights other routes; leaving it restores the selection.
  map.addEventListener("mouseleave", () => {
    if (current) map.dispatchEvent(new CustomEvent("network:focus", { detail: { country: current } }));
  });

  // Back to the wide view.
  atlas.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    stopTour();
    fly(null);
    frame.classList.remove("is-zoomed");
  });

  // Arriving on #agence-… (home map): select it; the directory row is the target.
  const fromHash = () => {
    const id = location.hash.slice(1);
    const row = id ? document.getElementById(decodeURIComponent(id)) : null;
    if (row?.dataset?.agency) select(row.dataset.agency);
  };
  window.addEventListener("hashchange", fromHash);

  // Start: the head office, wide view (the network intro plays first).
  select("Mali", { zoom: false });
  fromHash();
  tickClocks();
  window.setInterval(tickClocks, 15000);
}
