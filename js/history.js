(function () {
  const buttons = [...document.querySelectorAll("[data-chapter]")];
  const eras = [...document.querySelectorAll(".era")];
  if (!buttons.length || !eras.length) return;

  function setActive(id) {
    buttons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-chapter") === id));
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-chapter");
      const era = document.getElementById("era-" + id);
      if (era) era.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!vis) return;
      setActive(vis.target.getAttribute("data-era"));
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.4, 0.6] }
  );
  eras.forEach((e) => io.observe(e));
})();
