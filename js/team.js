(function () {
  const host = document.getElementById("umc-off");
  if (!host) return;

  const nodes = [...host.childNodes];
  const shadow = host.attachShadow({ mode: "open" });

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/history-official.css";
  shadow.appendChild(link);

  const extra = document.createElement("style");
  extra.textContent = `
    :host { display: block; background: hsl(var(--background)); color: hsl(var(--foreground)); }
    article[hidden] { display: none !important; }
  `;
  shadow.appendChild(extra);
  nodes.forEach((n) => shadow.appendChild(n));

  const search = shadow.querySelector("[data-team-search]");
  const filters = shadow.querySelector("[data-team-filters]");
  const cards = [...shadow.querySelectorAll("[data-person]")];
  const count = shadow.querySelector("[data-team-count]");
  if (!cards.length) return;

  cards.forEach((card) => {
    if (!card.getAttribute("data-hay")) {
      card.setAttribute("data-hay", card.textContent.toLowerCase());
    }
  });

  let desk = "all";
  const onCls = ["on", "border-[#0A0A0B]", "bg-[#0A0A0B]", "text-white"];
  const offCls = ["border-border", "bg-background"];

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
      filters.querySelectorAll("[data-filter]").forEach((b) => {
        const active = b === btn;
        onCls.forEach((c) => b.classList.toggle(c, active));
        offCls.forEach((c) => b.classList.toggle(c, !active));
      });
      apply();
    });
  });
  search?.addEventListener("input", apply);
})();
