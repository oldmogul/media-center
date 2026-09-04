(function () {
  const nav = document.querySelector(".t-nav");
  const buttons = [...document.querySelectorAll("[data-chapter]")];
  const plates = [...document.querySelectorAll("[data-plate]")];
  if (!nav || !buttons.length || !plates.length) return;

  function go(id, { scroll } = { scroll: true }) {
    buttons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-chapter") === id));
    const plate = plates.find((p) => p.getAttribute("data-plate") === id);
    if (scroll && plate) {
      const y = plate.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => go(btn.getAttribute("data-chapter")));
  });

  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!vis) return;
      const id = vis.target.getAttribute("data-plate");
      buttons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-chapter") === id));
    },
    { rootMargin: "-30% 0px -50% 0px", threshold: [0.15, 0.4] }
  );
  plates.forEach((p) => io.observe(p));
})();
