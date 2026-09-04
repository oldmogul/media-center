(async function () {
  const host = document.getElementById("umc-off");
  if (!host) return;
  const shadow = host.attachShadow({ mode: "open" });

  const [css, html] = await Promise.all([
    fetch("css/history-official.css").then((r) => r.text()),
    fetch("partials/history-official.html").then((r) => r.text()),
  ]);

  shadow.innerHTML =
    `<style>
      :host { display: block; background: hsl(var(--background)); color: hsl(var(--foreground)); }
      ${css}
    </style>` + html;

  const buttons = [...shadow.querySelectorAll('nav[aria-label="Timeline chapters"] button')];
  const eras = [...shadow.querySelectorAll("[data-era-index]")];

  function setActive(i) {
    buttons.forEach((b, n) => {
      const on = n === i;
      b.style.borderColor = on ? "rgb(217, 0, 0)" : "";
      b.classList.toggle("text-foreground", on);
      b.classList.toggle("text-muted-foreground", !on);
    });
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const era = shadow.getElementById("era-" + i);
      if (era) era.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(i);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!vis) return;
      const i = Number(vis.target.getAttribute("data-era-index"));
      if (!Number.isNaN(i)) setActive(i);
    },
    { root: null, rootMargin: "-30% 0px -50% 0px", threshold: [0.15, 0.4] }
  );
  eras.forEach((e) => io.observe(e));
  setActive(0);
})();
