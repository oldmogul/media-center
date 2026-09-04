(function () {
  const search = document.querySelector("[data-team-search]");
  const filters = document.querySelector("[data-team-filters]");
  const cards = [...document.querySelectorAll("[data-person]")];
  const count = document.querySelector("[data-team-count]");
  if (!cards.length) return;

  let desk = "all";

  function apply() {
    const q = (search?.value || "").trim().toLowerCase();
    let n = 0;
    cards.forEach((card) => {
      const hay = (card.getAttribute("data-hay") || card.textContent).toLowerCase();
      const cat = card.getAttribute("data-desk") || "";
      const okDesk = desk === "all" || cat.split(" ").includes(desk);
      const okQ = !q || hay.includes(q);
      const on = okDesk && okQ;
      card.hidden = !on;
      if (on) n += 1;
    });
    if (count) count.textContent = String(n);
  }

  filters?.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      desk = btn.getAttribute("data-filter") || "all";
      filters.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("on", b === btn));
      apply();
    });
  });
  search?.addEventListener("input", apply);
})();
