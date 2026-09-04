(function () {
  const buttons = [...document.querySelectorAll("[data-chapter]")];
  const stories = [...document.querySelectorAll("[data-story]")];
  const frames = [...document.querySelectorAll("[data-frame]")];
  if (!buttons.length || !stories.length) return;

  function show(id) {
    buttons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-chapter") === id));
    stories.forEach((s) => {
      s.hidden = s.getAttribute("data-story") !== id;
    });
    frames.forEach((f) => {
      f.hidden = f.getAttribute("data-frame") !== id;
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => show(btn.getAttribute("data-chapter")));
  });

  document.querySelectorAll("[data-hist-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = buttons.findIndex((b) => b.classList.contains("active"));
      const next = buttons[(on + 1) % buttons.length];
      if (next) show(next.getAttribute("data-chapter"));
    });
  });
  document.querySelectorAll("[data-hist-prev]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = buttons.findIndex((b) => b.classList.contains("active"));
      const prev = buttons[(on - 1 + buttons.length) % buttons.length];
      if (prev) show(prev.getAttribute("data-chapter"));
    });
  });

  show(buttons[0]?.getAttribute("data-chapter") || "1");
})();
