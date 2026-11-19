// Responsibility: centrale thermique — "le métré du chantier". Hovering or
// focusing a work line shows its site photo beside the list (cross-fade).

const metre = document.querySelector("[data-metre]");

if (metre) {
  const img = metre.querySelector("[data-metre-img]");
  const cap = metre.querySelector("[data-metre-cap]");
  const rows = Array.from(metre.querySelectorAll(".metre__row"));

  const show = (row) => {
    rows.forEach((r) => r.classList.toggle("is-active", r === row));
    cap.textContent = row.dataset.caption;
    const src = `${row.dataset.photo}.jpg`;
    if (img.getAttribute("src") === src) return;
    metre.classList.add("is-swapping");
    const next = new Image();
    next.onload = () => {
      img.src = src;
      metre.classList.remove("is-swapping");
    };
    next.src = src;
  };

  rows.forEach((row) => {
    row.addEventListener("pointerenter", () => show(row));
    row.addEventListener("focus", () => show(row));
  });
  show(rows[0]);
}
