(async function () {
  const host = document.getElementById("umc-off");
  if (!host) return;
  const shadow = host.attachShadow({ mode: "open" });

  const [css, html] = await Promise.all([
    fetch("css/history-official.css").then((r) => r.text()),
    fetch("partials/team-official.html").then((r) => r.text()),
  ]);

  shadow.innerHTML =
    `<style>
      :host { display: block; background: hsl(var(--background)); color: hsl(var(--foreground)); }
      article[hidden] { display: none !important; }
      ${css}
    </style>` + html;

  const DESK = {
    "Obed Kamugisha Katureebe": "leadership affairs",
    "Charles Serugga Matovu": "leadership affairs",
    "Emma Belinda Were": "leadership affairs",
    "David Muwonge": "leadership digital",
    "Dennis Patrick Katungi": "leadership affairs",
    "Carolyne Muyama": "leadership affairs",
    "Mildred Akumu": "admin",
    "Moses Kitunzi": "admin",
    "Joseph Okumu": "admin",
    "Josepha Jabo": "affairs",
    "Sarah Nanteza Kyobe": "affairs digital",
    "Prince Obed Twijukye": "affairs digital",
    "David Serumaga": "affairs",
    "Jackie R.N. Kasimbi": "affairs",
    "Catherine Namuddu": "affairs",
    "Anthony Eropu": "digital",
    "Kenson Irvrico Bugembe": "digital",
    "Angela Ailo": "admin",
    "Rosette Batanda": "admin",
    "Kevin Seguya": "affairs digital",
    "Ramlah Kakumba": "digital",
    "Fortunate Akankunda": "digital",
    "Peace Ankunda": "digital",
    "Ahamed Sefu": "admin",
  };

  const grid = shadow.querySelector(".grid.grid-cols-1.gap-6");
  if (!grid) return;

  const cards = [...grid.querySelectorAll("article")];
  cards.forEach((card) => {
    const name = card.querySelector("h3")?.textContent.trim() || "";
    card.setAttribute("data-person", "");
    card.setAttribute("data-desk", DESK[name] || "");
    card.setAttribute("data-hay", card.textContent.toLowerCase());
  });

  const tools = document.createElement("div");
  tools.className = "mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center";
  tools.innerHTML = `
    <input type="search" data-team-search placeholder="Search name, desk or role…" class="w-full sm:max-w-sm rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none ring-offset-background focus:ring-1 focus:ring-[#FCDC04]">
    <div class="flex flex-wrap gap-2" data-team-filters>
      <button type="button" data-filter="all" class="on rounded-full border border-[#0A0A0B] bg-[#0A0A0B] px-4 py-2 text-sm font-semibold text-white">All</button>
      <button type="button" data-filter="leadership" class="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">Leadership</button>
      <button type="button" data-filter="affairs" class="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">Public affairs</button>
      <button type="button" data-filter="digital" class="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">Digital &amp; tech</button>
      <button type="button" data-filter="admin" class="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">Administration</button>
    </div>
  `;
  grid.parentNode.insertBefore(tools, grid);

  const countEl = [...shadow.querySelectorAll("p")].find((p) => /24 members/i.test(p.textContent || ""));
  if (countEl) countEl.innerHTML = `<span data-team-count>24</span> members`;

  const search = shadow.querySelector("[data-team-search]");
  const filters = shadow.querySelector("[data-team-filters]");
  const count = shadow.querySelector("[data-team-count]");
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
