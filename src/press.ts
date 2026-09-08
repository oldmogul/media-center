(function () {
function init(): void {
  if (document.body.getAttribute("data-page") !== "press") return;

  const archive = UMC_PRESS_ARCHIVE || [];
  const indexEl = document.getElementById("press-index");
  const filterEl = document.getElementById("press-filters");
  const sortEl = document.getElementById("press-sort") as HTMLSelectElement;
  let cat = "all";

  function esc(s: string): string {
    return String(s || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c] as string));
  }

  function catLabel(key: string): string {
    if (key === "foreign-affairs") return "Foreign affairs";
    if (key === "public notice") return "Public notice";
    if (key === "communiqué") return "Communiqué";
    return key ? key.charAt(0).toUpperCase() + key.slice(1) : "National";
  }

  function t(key: string): string {
    return (window.UMC && window.UMC.t(key)) || "";
  }

  const counts: Record<string, number> = {};
  archive.forEach((r) => {
    counts[r.cat] = (counts[r.cat] || 0) + 1;
  });
  const catOrder = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));

  if (filterEl) {
    filterEl.innerHTML = [
      `<button class="filter active" type="button" data-filter="all">All ${archive.length}</button>`,
      ...catOrder.map((k) => `<button class="filter" type="button" data-filter="${esc(k)}">${esc(catLabel(k))} ${counts[k]}</button>`)
    ].join("");
    filterEl.addEventListener("click", (e) => {
      const btn = e.target instanceof Element ? e.target.closest("[data-filter]") : null;
      if (!btn) return;
      cat = btn.getAttribute("data-filter") || "all";
      filterEl.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("active", b === btn));
      renderList();
    });
  }

  document.querySelectorAll("[data-press-total]").forEach((el) => {
    el.textContent = String(archive.length);
  });

  function renderList() {
    if (!indexEl) return;
    const newest = !sortEl || sortEl.value !== "old";
    const rows = archive
      .filter((r) => cat === "all" || r.cat === cat)
      .slice()
      .sort((a, b) => newest ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    const nEl = document.querySelector("[data-press-n]");
    if (nEl) nEl.textContent = String(rows.length);
    const read = t("press.read") || "Read";
    indexEl.innerHTML = rows.map((r) => {
      const cover = r.img
        ? `<div class="press-row-cover"><img src="${esc(r.img)}" alt="" loading="lazy" onerror="this.closest('.press-row').classList.add('no-img');this.parentNode.remove()"></div>`
        : "";
      return `<a class="press-row${r.img ? "" : " no-img"}" data-cat="${esc(r.cat)}" href="${esc(r.href)}">
        ${cover}
        <div class="txt">
          <div class="press-row-meta">
            <time>${esc(r.date)}</time>
            <span class="press-cat">${esc(r.cat)}</span>
            <span class="press-min">${esc(r.ministry)}</span>
          </div>
          <h3>${esc(r.title)}</h3>
          ${r.p ? `<p>${esc(r.p)}</p>` : ""}
          <span class="press-read">${esc(read)} →</span>
        </div>
      </a>`;
    }).join("") || `<p class="muted">No press releases match your filters.</p>`;
  }

  sortEl?.addEventListener("change", renderList);
  document.addEventListener("umc:lang", renderList);
  renderList();
  document.getElementById("releases")?.classList.add("in");
  window.UMC?.applyI18n();


  const CHANNEL = "UCobG6xQoAv_uULa4W7zA1gA";
  const FALLBACK = {
    id: "J_7bkyMV1Cg",
    title: "Press conference | Return and funeral arrangements for King Oyo",
    date: "2026-09-03T11:40:19+00:00"
  };
  const RSS = "https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL;
  const PROXY = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(RSS);

  function hoursAgo(iso) {
    const t = new Date(iso).getTime();
    if (!isFinite(t)) return 999;
    return (Date.now() - t) / 36e5;
  }

  function setPlayer(id, title, live) {
    const frame = document.getElementById("yt-player");
    const tEl = document.getElementById("yt-title");
    const bEl = document.getElementById("yt-blurb");
    const open = document.getElementById("yt-open");
    const strip = document.getElementById("strip-title");
    const badges = [document.getElementById("strip-badge"), document.getElementById("yt-badge")];
    if (frame) {
      frame.src = live
        ? "https://www.youtube.com/embed/live_stream?channel=" + CHANNEL
        : "https://www.youtube.com/embed/" + id;
    }
    if (tEl) tEl.textContent = live ? "Live press briefing" : title;
    if (bEl) {
      bEl.textContent = live
        ? "The official desk is live on YouTube. Watch here, or join on Facebook, X and Instagram."
        : title + " — latest from the official Uganda Media Centre channel.";
    }
    if (open) open.href = live
      ? "https://www.youtube.com/@ugandamediacentre/live"
      : "https://www.youtube.com/watch?v=" + id;
    if (strip) {
      strip.textContent = live
        ? "Live now on YouTube · @ugandamediacentre"
        : title;
    }
    badges.forEach((el) => {
      if (!el) return;
      el.innerHTML = live ? "<i></i> Live press briefing" : "<i></i> Latest briefing";
      el.classList.toggle("is-latest", !live);
    });
    if (live && localStorage.getItem("umc-live-notify") === "1" && "Notification" in window && Notification.permission === "granted") {
      const key = "umc-live-ping-" + (id || "live");
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        try {
          new Notification("Uganda Media Centre — live", {
            body: title || "A press briefing is live on YouTube.",
            icon: "img/coat.svg"
          });
        } catch (e) { /* ignore */ }
      }
    }
  }

  async function loadFeed() {
    try {
      const res = await fetch(PROXY);
      const data = await res.json();
      const item = data && data.items && data.items[0];
      if (!item) throw new Error("empty");
      const id = (item.guid || item.link || "").replace(/^.*v=/, "").replace(/^yt:video:/, "");
      const title = item.title || FALLBACK.title;
      const pub = item.pubDate || item.published || "";
      const live = hoursAgo(pub) < 10 || /live/i.test(title);
      setPlayer(id || FALLBACK.id, title, live);
    } catch (e) {
      const live = hoursAgo(FALLBACK.date) < 10;
      setPlayer(FALLBACK.id, FALLBACK.title, live);
    }
  }

  document.getElementById("notify-live")?.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      const toast = document.getElementById("toast");
      if (toast) { toast.textContent = "Notifications are not available in this browser."; toast.classList.add("show"); }
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      localStorage.setItem("umc-live-notify", "1");
      new Notification("Uganda Media Centre", { body: "You will be notified when a press briefing goes live." });
      const btn = document.getElementById("notify-live");
      if (btn) btn.textContent = "Notifications on";
    }
  });
  if (localStorage.getItem("umc-live-notify") === "1") {
    const btn = document.getElementById("notify-live");
    if (btn) btn.textContent = "Notifications on";
  }

  loadFeed();
}

init();
})();
