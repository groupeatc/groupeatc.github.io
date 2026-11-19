import "./navigation.js";
import "./animations.js";
import "./counters.js";
import "./gallery.js";
import "./filters.js";
import "./forms.js";
import "./presence-map.js";
import "./network.js";
import "./footer-network.js";
import "./transitions.js";

const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = new Date().getFullYear();
