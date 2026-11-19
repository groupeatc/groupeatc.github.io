// Responsibility: job offers page — renders data/jobs.js, filters (keyword,
// location, contract, remote), "show more", and opens each offer in place as
// a job sheet with a ready-to-send application e-mail. Also animates the
// site access badge of the spontaneous application.
// Swap loadJobs() for a fetch() to a jobs API/JSON when one exists.

import { jobs as localJobs, APPLY_EMAIL } from "../../data/jobs.js";

const PAGE_SIZE = 6;
// Below this many offers, filters would only add noise: they stay hidden.
const FILTERS_FROM = 6;
const list = document.querySelector("[data-job-list]");
const form = document.querySelector("[data-job-filters]");

const loadJobs = async () => localJobs;

const esc = (s = "") => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const norm = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const dateFr = (iso) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

function sheet(job) {
  const sections = job.sections.map((s) => `
        <div class="job-sheet__section">
          <h4 class="job-sheet__title">${esc(s.title)}</h4>
          ${s.text ? `<p class="job-sheet__text">${esc(s.text)}</p>` : ""}
          ${s.items ? `<ul class="job-sheet__items" role="list">${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
        </div>`).join("");
  const subject = encodeURIComponent(`Candidature — ${job.title}`);
  return `
      <div class="job-sheet" id="job-${job.id}-sheet" role="region" aria-labelledby="job-${job.id}-title" hidden>
        <span class="job-sheet__scan" aria-hidden="true"></span>
        ${sections}
        <div class="job-sheet__apply">
          <p>Pour postuler, envoyez votre CV et votre lettre de motivation à <a href="mailto:${APPLY_EMAIL}?subject=${subject}">${APPLY_EMAIL}</a>.</p>
          <a class="btn btn--primary" href="mailto:${APPLY_EMAIL}?subject=${subject}">Postuler à cette offre</a>
        </div>
      </div>`;
}

// A "fiche de poste": title and summary on the sheet, facts in the title
// block (cartouche) like an ATC technical document.
function card(job, index) {
  const cell = (label, value) => value ? `<span class="job__cell"><span class="job__cell-label">${label}</span>${value}</span>` : "";
  return `
    <li class="job" style="--i:${index}" data-job="${job.id}">
      <button type="button" class="job__head" aria-expanded="false" aria-controls="job-${job.id}-sheet">
        <span class="job__sheet">
          <span class="job__ref">Fiche de poste n°&nbsp;${String(index + 1).padStart(2, "0")}${job.domain ? ` · ${esc(job.domain)}` : ""}</span>
          <h3 class="job__title" id="job-${job.id}-title">${esc(job.title)}</h3>
          <span class="job__summary">${esc(job.summary)}</span>
        </span>
        <span class="job__cartouche">
          ${cell("Lieu", esc(job.location))}
          ${cell("Contrat", esc(job.contract || ""))}
          ${cell("Télétravail", job.remote ? "Possible" : "Non")}
          ${cell("Publiée le", `<time datetime="${job.published}">${dateFr(job.published)}</time>`)}
          <span class="job__toggle"><span class="job__toggle-label">Lire la fiche</span><span class="job__toggle-icon" aria-hidden="true"></span></span>
        </span>
      </button>
      ${sheet(job)}
    </li>`;
}

// The blank sheet after the offers: "à vous de l'écrire", leading to the
// spontaneous application.
function blank(number) {
  return `
    <li class="job job--blank">
      <a class="job__head" href="#candidature">
        <span class="job__sheet">
          <span class="job__ref">Fiche de poste n°&nbsp;${String(number).padStart(2, "0")}</span>
          <span class="job__title">À vous de l'écrire</span>
          <span class="job__summary">Votre métier n'est pas encore affiché&nbsp;? Proposez-nous votre candidature spontanée.</span>
        </span>
        <span class="job__cartouche">
          <span class="job__toggle"><span class="job__toggle-label">Candidature spontanée</span><span aria-hidden="true">→</span></span>
        </span>
      </a>
    </li>`;
}

async function init() {
  if (!list || !form) return;
  const jobs = await loadJobs();
  const count = document.querySelector("[data-jobs-count]");
  const empty = document.querySelector("[data-jobs-empty]");
  const more = document.querySelector("[data-jobs-more]");
  let shown = PAGE_SIZE;

  // Fill the selects from the data.
  const fill = (name, values) => {
    const select = form.elements[name];
    [...new Set(values.filter(Boolean))].sort().forEach((v) => select.add(new Option(v, v)));
  };
  fill("location", jobs.map((j) => j.location));
  fill("contract", jobs.map((j) => j.contract));
  if (form.elements.contract.options.length === 1) form.elements.contract.closest(".job-filters__field").hidden = true;
  form.hidden = jobs.length < FILTERS_FROM;

  const filtered = () => {
    const q = norm(form.elements.q.value.trim());
    const loc = form.elements.location.value;
    const contract = form.elements.contract.value;
    const remote = form.elements.remote.checked;
    return jobs.filter((j) => {
      const haystack = norm([j.title, j.summary, j.domain, j.location, ...j.sections.flatMap((s) => [s.text || "", ...(s.items || [])])].join(" "));
      return (!q || haystack.includes(q)) && (!loc || j.location === loc) && (!contract || j.contract === contract) && (!remote || j.remote);
    });
  };

  const render = () => {
    const result = filtered();
    const visible = result.slice(0, shown);
    list.innerHTML = visible.map(card).join("") + (visible.length ? blank(visible.length + 1) : "");
    count.textContent = `${result.length} poste${result.length > 1 ? "s" : ""} ouvert${result.length > 1 ? "s" : ""}`;
    empty.hidden = result.length > 0;
    more.hidden = result.length <= shown;
  };

  form.addEventListener("input", () => { shown = PAGE_SIZE; render(); });
  form.addEventListener("submit", (e) => e.preventDefault());
  more.addEventListener("click", () => { shown += PAGE_SIZE; render(); });
  document.querySelector("[data-jobs-reset]")?.addEventListener("click", () => { form.reset(); shown = PAGE_SIZE; render(); });

  // Open / close a job sheet in place.
  list.addEventListener("click", (event) => {
    const head = event.target.closest("button.job__head");
    if (!head) return;
    const job = head.closest(".job");
    const sheetEl = job.querySelector(".job-sheet");
    const open = head.getAttribute("aria-expanded") !== "true";
    head.setAttribute("aria-expanded", String(open));
    head.querySelector(".job__toggle-label").textContent = open ? "Fermer la fiche" : "Lire la fiche";
    job.classList.toggle("is-open", open);
    sheetEl.hidden = !open;
  });

  render();

  // Deep link: offres-emploi.html#controleur-qualite opens that offer.
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && list.querySelector(`[data-job="${CSS.escape(id)}"] .job__head`);
  if (target) {
    target.click();
    target.scrollIntoView({ block: "center" });
  }
}

init();

// "Copier l'adresse": for visitors without a mail app behind mailto links.
const copyBtn = document.querySelector("[data-copy-mail]");
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback (older browsers, clipboard permission refused).
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
};
if (copyBtn) {
  const label = copyBtn.textContent;
  const status = document.querySelector("[data-copy-status]");
  copyBtn.hidden = false;
  copyBtn.addEventListener("click", async () => {
    if (await copyText(copyBtn.dataset.copyMail)) {
      copyBtn.textContent = "Adresse copiée";
      status.textContent = "Adresse e-mail copiée dans le presse-papiers.";
    } else {
      copyBtn.textContent = "Copie impossible";
    }
    window.setTimeout(() => {
      copyBtn.textContent = label;
      status.textContent = "";
    }, 2200);
  });
}

// Site access badge (candidature spontanée): it drops on its lanyard when the
// section comes on screen, sways a little towards the pointer, and the trade
// field types the company's trades one after another.
const pass = document.querySelector("[data-pass]");
const section = document.querySelector("[data-spontaneous]");

if (pass && section) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const roleEl = pass.querySelector("[data-pass-role]");
  const TRADES = ["Soudure", "Chaudronnerie", "Tuyauterie", "Électricité", "Génie civil", "Topographie", "Qualité", "Logistique", "Ingénierie"];

  if (!reduceMotion) {
    let started = false;
    let onScreen = false;
    const type = async () => {
      const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));
      for (let i = 0; ; i = (i + 1) % TRADES.length) {
        // Paused while the section is off screen.
        while (!onScreen) await wait(400);
        const word = TRADES[i];
        for (let n = 1; n <= word.length; n++) {
          roleEl.textContent = word.slice(0, n);
          await wait(70);
        }
        await wait(1500);
        for (let n = word.length; n >= 0; n--) {
          roleEl.textContent = word.slice(0, n);
          await wait(35);
        }
        await wait(250);
      }
    };

    new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        if (!onScreen || started) return;
        started = true;
        section.classList.add("is-in");
        window.setTimeout(type, 1200);
      },
      { threshold: 0.35 }
    ).observe(section);

    // Gentle sway towards the pointer; the card tilts a little under it.
    const card = pass.querySelector(".pass__card");
    section.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const r = pass.getBoundingClientRect();
      const dx = (event.clientX - (r.left + r.width / 2)) / window.innerWidth;
      pass.style.setProperty("--sway", `${(dx * 10).toFixed(2)}deg`);
      const c = card.getBoundingClientRect();
      const inside = event.clientX >= c.left && event.clientX <= c.right && event.clientY >= c.top && event.clientY <= c.bottom;
      card.style.setProperty("--ry", inside ? `${(((event.clientX - c.left) / c.width - 0.5) * 16).toFixed(1)}deg` : "0deg");
      card.style.setProperty("--rx", inside ? `${((0.5 - (event.clientY - c.top) / c.height) * 12).toFixed(1)}deg` : "0deg");
    });
    section.addEventListener("pointerleave", () => {
      pass.style.setProperty("--sway", "0deg");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }
}
