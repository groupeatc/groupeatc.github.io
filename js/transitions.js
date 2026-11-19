// Responsibility: the signature page transitions (see "Page transitions" in
// components.css): a project card's photo becomes the hero of the project
// page. Only the clicked card is named, so names stay unique. The "du plan
// au terrain" sweep and its plotter trait are CSS only.

const SHARED_NAME = "project-media";

document.addEventListener("click", (event) => {
  const card = event.target.closest("a.card[data-status]");
  if (!card || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const media = card.querySelector(".card__media");
  if (media) media.style.viewTransitionName = SHARED_NAME;
});

// Coming back from the bfcache, the old name would still be set and collide
// with the next card clicked.
window.addEventListener("pageshow", () => {
  document.querySelectorAll(".card__media").forEach((media) => {
    media.style.viewTransitionName = "";
  });
});

