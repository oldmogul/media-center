(function () {
  const releases = window.UMC_RELEASES || [];
  document.querySelectorAll(".min-card[data-id]").forEach((card) => {
    const id = card.getAttribute("data-id");
    const n = releases.filter((r) => r.min === id).length;
    if (n) {
      const b = document.createElement("span");
      b.className = "min-n";
      b.textContent = n + (n === 1 ? " release" : " releases");
      card.querySelector("h3")?.after(b);
    }
    card.addEventListener("click", () => {
      location.href = "ministry.html?id=" + encodeURIComponent(id);
    });
  });
})();
