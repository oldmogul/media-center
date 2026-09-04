(function () {
  const tabs = [...document.querySelectorAll("[data-path-tab]")];
  const panels = [...document.querySelectorAll("[data-path-panel]")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-path-tab");
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      panels.forEach((p) => {
        const on = p.getAttribute("data-path-panel") === id;
        p.hidden = !on;
        p.classList.toggle("on", on);
      });
    });
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const v = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(v);
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1600);
      } catch {
        btn.textContent = "Copy";
      }
    });
  });

  const form = document.getElementById("acc-form");
  if (!form) return;
  const panes = [...form.querySelectorAll("[data-pane]")];
  const rail = [...form.querySelectorAll("[data-rail]")];
  const back = form.querySelector("[data-wiz-back]");
  const next = form.querySelector("[data-wiz-next]");
  const submit = form.querySelector("[data-wiz-submit]");
  const review = form.querySelector("[data-review]");
  const success = form.querySelector("[data-success]");
  const refEl = form.querySelector("[data-ref]");
  const nav = form.querySelector(".acc-wiz-nav");
  let step = 0;

  function pathway() {
    return form.querySelector('input[name="pathway"]:checked')?.value || "";
  }

  function showDocs() {
    const foreign = pathway() === "foreign";
    const localBox = form.querySelector("[data-docs-local]");
    const foreignBox = form.querySelector("[data-docs-foreign]");
    if (localBox) localBox.hidden = foreign;
    if (foreignBox) foreignBox.hidden = !foreign;
  }

  function setStep(n) {
    step = Math.max(0, Math.min(3, n));
    panes.forEach((p) => {
      const on = Number(p.getAttribute("data-pane")) === step;
      p.hidden = !on;
      p.classList.toggle("on", on);
    });
    rail.forEach((r) => r.classList.toggle("on", Number(r.getAttribute("data-rail")) <= step));
    if (back) back.disabled = step === 0;
    if (next) next.hidden = step === 3;
    if (submit) submit.hidden = step !== 3;
    if (step === 2) showDocs();
    if (step === 3) fillReview();
  }

  function fillReview() {
    if (!review) return;
    const fd = new FormData(form);
    const path = pathway() === "foreign" ? "Foreign journalist" : "Local journalist";
    const rows = [
      ["Pathway", path],
      ["Name", fd.get("name") || "—"],
      ["Email", fd.get("email") || "—"],
      ["Media house", fd.get("media") || "—"],
      ["Role", fd.get("role") || "—"],
      ["Notes", fd.get("notes") || "—"],
    ];
    review.innerHTML = rows
      .map(([k, v]) => `<div><small>${k}</small><b>${String(v).replace(/</g, "")}</b></div>`)
      .join("");
  }

  function valid() {
    if (step === 0) return Boolean(pathway());
    if (step === 1) {
      const name = form.querySelector("#aname");
      const email = form.querySelector("#aemail");
      const media = form.querySelector("#media");
      return name.reportValidity() && email.reportValidity() && media.reportValidity();
    }
    return true;
  }

  next?.addEventListener("click", () => {
    if (!valid()) return;
    setStep(step + 1);
  });
  back?.addEventListener("click", () => setStep(step - 1));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valid()) return;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const ref = `UMC-AC-${y}${m}${d}-${rand}`;
    if (refEl) refEl.textContent = ref;
    const track = document.querySelector("#ref");
    if (track) track.value = ref;
    panes.forEach((p) => (p.hidden = true));
    if (nav) nav.hidden = true;
    if (success) success.hidden = false;
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = `Application queued. Reference ${ref}.`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4200);
    }
  });

  form.querySelector("[data-wiz-again]")?.addEventListener("click", () => {
    form.reset();
    if (success) success.hidden = true;
    if (nav) nav.hidden = false;
    setStep(0);
  });

  setStep(0);
})();
