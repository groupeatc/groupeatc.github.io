// Responsibility: generic status/category filter bars — reused by the
// projects listing and (later) job listings. Markup contract:
//   <div data-filter-group="<CSS selector for the items>"
//        data-filter-status="<optional selector of a role=status element>">
//     <button data-filter="all|<value>" aria-pressed="true|false">
//       Label <span data-filter-count></span>
//     </button>
//   </div>
// Items are matched against their own [data-status] attribute.

document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const buttons = group.querySelectorAll("[data-filter]");
  const items = Array.from(document.querySelectorAll(group.dataset.filterGroup));
  const status = group.dataset.filterStatus
    ? document.querySelector(group.dataset.filterStatus)
    : null;

  const matches = (item, value) => value === "all" || item.dataset.status === value;

  buttons.forEach((button) => {
    const count = button.querySelector("[data-filter-count]");
    if (count) count.textContent = items.filter((item) => matches(item, button.dataset.filter)).length;
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.filter;
      let visible = 0;

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      items.forEach((item) => {
        const show = matches(item, value);
        item.hidden = !show;
        if (show) {
          visible += 1;
          // Items revealed by the filter should not wait for a scroll reveal.
          item.classList.add("is-revealed");
        }
      });

      if (status) {
        status.textContent = `${visible} projet${visible > 1 ? "s" : ""} affiché${visible > 1 ? "s" : ""}`;
      }
    });
  });
});
