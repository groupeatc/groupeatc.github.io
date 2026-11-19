// Responsibility: agency hotspots over the presence map, on every page that
// has one (home, agences). Data lives in data/agencies.js — never invent
// coordinates. The animated network on top is js/network.js.
//
// Each hotspot links to its agency card: <container data-hotspot-href="…">
// gives the page holding the cards ("" = this page).

import { agencies } from "../data/agencies.js";

export const agencySlug = (country) =>
  "agence-" +
  country
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

document.querySelectorAll("[data-hotspots-map]").forEach((container) => {
  const base = container.dataset.hotspotHref ?? "";

  agencies.forEach((agency, index) => {
    const marker = document.createElement("a");
    marker.href = `${base}#${agencySlug(agency.country)}`;
    marker.className = agency.isHub ? "hotspot hotspot--hub" : "hotspot";
    marker.dataset.country = agency.country;
    marker.style.setProperty("--echo-i", index);
    marker.style.top = agency.position.top;
    marker.style.left = agency.position.left;
    marker.setAttribute(
      "aria-label",
      agency.isHub
        ? `Société mère · ${agency.country} — voir l'agence`
        : `${agency.country} — voir l'agence`
    );

    const dot = document.createElement("span");
    dot.className = "hotspot__dot";
    dot.setAttribute("aria-hidden", "true");
    marker.appendChild(dot);

    if (agency.isHub) {
      const hubLabel = document.createElement("span");
      hubLabel.className = "hotspot__hub-label";
      hubLabel.setAttribute("aria-hidden", "true");
      hubLabel.textContent = `Société mère · ${agency.country}`;
      marker.appendChild(hubLabel);
    }

    const tooltip = document.createElement("span");
    tooltip.className = "hotspot__tooltip";
    tooltip.setAttribute("role", "tooltip");

    const title = document.createElement("strong");
    title.className = "hotspot__country";
    title.textContent = agency.country;
    tooltip.appendChild(title);

    [agency.address, agency.phone, agency.email].forEach((value) => {
      if (!value) return;
      const line = document.createElement("span");
      line.className = "hotspot__line";
      line.textContent = value;
      tooltip.appendChild(line);
    });

    marker.appendChild(tooltip);
    container.appendChild(marker);
  });
});
