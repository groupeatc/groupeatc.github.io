// Responsibility: header state, mobile drawer, desktop dropdowns.

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".js-menu-toggle");
const menuLabel = menuToggle?.querySelector("[data-menu-label]");
const nav = document.getElementById("primary-navigation");
const dropdownToggles = Array.from(document.querySelectorAll(".js-dropdown-toggle"));

// Must match the desktop breakpoint in css/components.css.
const desktopQuery = window.matchMedia("(min-width: 1200px)");
const isDesktop = () => desktopQuery.matches;

/* ----- Header elevation once the page scrolls ----- */

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* ----- Dropdowns ----- */

function closeDropdown(toggle) {
  const target = document.getElementById(toggle.getAttribute("aria-controls"));
  toggle.setAttribute("aria-expanded", "false");
  if (target) target.hidden = true;
}

function openDropdown(toggle) {
  const target = document.getElementById(toggle.getAttribute("aria-controls"));
  toggle.setAttribute("aria-expanded", "true");
  if (target) target.hidden = false;
}

// Closes every open dropdown except `keep` and its ancestors (so opening a
// nested flyout does not collapse its parent panel).
function closeAllDropdowns(keep) {
  dropdownToggles.forEach((toggle) => {
    if (!keep) return closeDropdown(toggle);
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    const isAncestor = panel && panel.contains(keep);
    if (toggle !== keep && !isAncestor) closeDropdown(toggle);
  });
}

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    closeAllDropdowns(toggle);
    if (isOpen) {
      closeDropdown(toggle);
    } else {
      openDropdown(toggle);
    }
  });

  const item = toggle.closest(".site-nav__item--dropdown");
  if (!item) return;

  let leaveTimer = null;

  item.addEventListener("mouseenter", () => {
    if (!isDesktop()) return;
    window.clearTimeout(leaveTimer);
    openDropdown(toggle);
  });

  // Small grace delay so a diagonal mouse path toward the panel doesn't close it.
  item.addEventListener("mouseleave", () => {
    if (!isDesktop()) return;
    leaveTimer = window.setTimeout(() => closeDropdown(toggle), 120);
  });

  item.addEventListener("focusout", (event) => {
    if (isDesktop() && !item.contains(event.relatedTarget)) {
      closeDropdown(toggle);
    }
  });
});

/* ----- Mobile drawer ----- */

const focusableSelector = 'a[href], button:not([disabled])';

function setMenuLabel(open) {
  if (menuLabel) menuLabel.textContent = open ? "Fermer le menu" : "Ouvrir le menu";
}

function openMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "true");
  setMenuLabel(true);
  nav.classList.add("is-open");
  document.body.classList.add("no-scroll");
  const firstFocusable = nav.querySelector(focusableSelector);
  if (firstFocusable) firstFocusable.focus({ preventScroll: true });
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  setMenuLabel(false);
  nav.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  closeAllDropdowns();
  if (restoreFocus) menuToggle.focus();
}

const isMenuOpen = () => menuToggle?.getAttribute("aria-expanded") === "true";

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    if (isMenuOpen()) {
      closeMenu({ restoreFocus: true });
    } else {
      openMenu();
    }
  });

  // Keep keyboard focus inside the drawer (toggle + visible nav items).
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !isMenuOpen()) return;
    const items = [menuToggle, ...nav.querySelectorAll(focusableSelector)].filter(
      (el) => el.offsetParent !== null
    );
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Same-page anchors don't navigate away: close the drawer explicitly.
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a") && isMenuOpen()) closeMenu();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (isMenuOpen()) {
    closeMenu({ restoreFocus: true });
    return;
  }

  const openToggle = dropdownToggles
    .filter((toggle) => toggle.getAttribute("aria-expanded") === "true")
    .pop();
  if (openToggle) {
    closeDropdown(openToggle);
    openToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = nav && nav.contains(event.target);
  const clickedToggle = menuToggle && menuToggle.contains(event.target);
  if (!clickedInsideNav && !clickedToggle) {
    closeAllDropdowns();
  }
});

desktopQuery.addEventListener("change", () => {
  if (isDesktop() && isMenuOpen()) closeMenu();
  closeAllDropdowns();
});
