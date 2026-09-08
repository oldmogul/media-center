(function () {
function init(): void {
  const root = document.getElementById("release-root");
  if (!root) return;

  const archive = UMC_PRESS_ARCHIVE || [];
  const slug = new URLSearchParams(location.search).get("slug") || "";
  const item = archive.find((r) => r.slug === slug);

  function t(key: string): string {
    return (window.UMC && window.UMC.t(key)) || "";
  }

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

  function tagClass(cat: string): string {
    if (cat === "health") return "red";
    if (cat === "security") return "ink";
    return "gold";
  }

  function prettyDate(iso: string): string {
    const d = new Date(iso + "T12:00:00");
    if (!isFinite(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function readMins(body: string): number {
    const words = (body || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  function refCode(r: PressArchiveItem): string {
    const day = (r.date || "").replace(/-/g, "");
    const code = (r.slug || "release").replace(/[^a-z0-9]+/gi, "-").toUpperCase();
    return "UMC/" + code + "/" + day;
  }

  function isHeading(line: string): boolean {
    return /^\d+\.\d+\s+\S/.test(line) ||
      (/^[A-Z0-9][A-Z0-9 .,'’&()/-]{8,90}$/.test(line) && line.length < 90);
  }

  function isShortItem(line: string): boolean {
    const words = line.split(/\s+/).length;
    return line.length <= 78 && words <= 12 && !isHeading(line) && !/^FOR GOD AND MY COUNTRY/i.test(line);
  }

  function formatBody(raw: string): string {
    if (!raw) return "";
    const blocks = raw.replace(/\r\n/g, "\n").trim().split(/\n{2,}/)
      .map((b) => b.split("\n").map((l) => l.trim()).filter(Boolean))
      .filter((lines) => lines.length);
    const out: string[] = [];
    let shortRun: string[] = [];
    function flushShort() {
      if (!shortRun.length) return;
      if (shortRun.length === 1) out.push(`<p>${esc(shortRun[0])}</p>`);
      else out.push(`<ul>${shortRun.map((i) => `<li>${esc(i.replace(/^[-*•]\s+/, "").replace(/^\d+[\.)]\s+/, ""))}</li>`).join("")}</ul>`);
      shortRun = [];
    }
    for (const lines of blocks) {
      const first = lines[0];
      if (/^FOR GOD AND MY COUNTRY/i.test(first)) {
        flushShort();
        out.push(`<p class="rel-signoff">${esc(first)}</p>`);
        if (lines.length > 1) out.push(`<p class="rel-sig">${lines.slice(1).map(esc).join("<br>")}</p>`);
        continue;
      }
      if (lines.length === 1 && isHeading(first)) {
        flushShort();
        out.push(`<h2>${esc(first)}</h2>`);
        continue;
      }
      const short = lines.every((l) => l.length <= 140);
      const looksList = lines.length >= 2 && short && lines.every((l) =>
        /^[-*•]/.test(l) || /^\d+[\.)]/.test(l) || l.length < 110
      );
      if (looksList) {
        flushShort();
        const items = lines.map((l) => l.replace(/^[-*•]\s+/, "").replace(/^\d+[\.)]\s+/, ""));
        out.push(`<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`);
        continue;
      }
      if (lines.length === 1 && isShortItem(first)) {
        shortRun.push(first);
        continue;
      }
      flushShort();
      out.push(`<p>${lines.map(esc).join("<br>")}</p>`);
    }
    flushShort();
    return out.join("");
  }

  function toast(msg: string) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2200);
  }

  if (!item) {
    root.innerHTML = `<div class="wrap rel-missing">
      <p class="kicker-off">${esc(t("press.record") || "Official record")}</p>
      <h1>${esc(t("press.notfound") || "This release is not in the archive.")}</h1>
      <p class="hero-actions"><a class="btn-gold" href="news.html">${esc(t("press.back") || "Back to Press Room")}</a></p>
    </div>`;
    window.UMC?.applyI18n();
    return;
  }

  const mins = readMins(item.body || item.p || "");
  const ref = refCode(item);
  const dateLabel = prettyDate(item.date);
  const related = archive
    .filter((r) => r.slug !== item.slug && (r.ministry === item.ministry || r.cat === item.cat))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 3);
  const ordered = archive.slice().sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.slug || "").localeCompare(b.slug || ""));
  const idx = ordered.findIndex((r) => r.slug === item.slug);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;
  const pageUrl = location.href.split("#")[0];
  const cite = `${item.ministry}. (${item.date}). ${item.title}. Uganda Media Centre. ${pageUrl}`;

  document.title = item.title + " — Uganda Media Centre";
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", (item.p || item.title).slice(0, 180));

  function relatedCard(r: PressArchiveItem): string {
    const img = r.img ? `<div class="rel-more-cover"><img src="${esc(r.img)}" alt="" loading="lazy"></div>` : "";
    return `<a class="rel-more-card" href="${esc(r.href)}">
      ${img}
      <div>
        <small>${esc(r.date)} · ${esc(catLabel(r.cat))}</small>
        <h3>${esc(r.title)}</h3>
        <span>${esc(r.ministry)}</span>
      </div>
    </a>`;
  }

  root.innerHTML = `
    <div class="wrap">
      <div class="rel-tools">
        <a class="btn-outline" href="news.html#releases">${esc(t("press.all") || "All releases")}</a>
        <button class="btn-outline" type="button" id="rel-print">${esc(t("press.print") || "Print / PDF")}</button>
        <button class="btn-outline" type="button" id="rel-copy">${esc(t("press.copy") || "Copy link")}</button>
        <button class="btn-outline" type="button" id="rel-share">${esc(t("press.share") || "Share")}</button>
      </div>

      <div class="rel-mast">
        <img src="img/coat.svg" alt="Coat of arms of Uganda">
        <div>
          <strong>${esc(t("press.official") || "Uganda Media Centre · Official Record")}</strong>
          <small>${esc(t("press.ref") || "Reference")}: ${esc(ref)}</small>
        </div>
      </div>

      <div class="article">
        <article>
          <p class="crumb"><a href="index.html">Command Centre</a> / <a href="news.html">Press Room</a> / ${esc(catLabel(item.cat))}</p>
          <span class="tag ${tagClass(item.cat)}">${esc(catLabel(item.cat))}</span>
          <p class="rel-kicker">${esc(dateLabel)} · ${mins} ${esc(t("press.minread") || "min read")}</p>
          <h1>${esc(item.title)}</h1>
          <p class="byline">${esc(t("press.issued") || "Issued by")} ${esc(item.ministry)}</p>
          ${item.img ? `<div class="article-hero"><img src="${esc(item.img)}" alt="${esc(item.title)}"></div>` : ""}
          <div class="prose rel-prose">${formatBody(item.body || item.p || "")}</div>
        </article>
        <aside>
          <div class="panel rel-side">
            <h3>${esc(t("press.issued") || "Issued by")}</h3>
            <p>${esc(item.ministry)}</p>
            <p class="muted">${esc(dateLabel)}</p>
            <p class="muted">${mins} ${esc(t("press.minread") || "min read")}</p>
          </div>
          <div class="panel rel-side">
            <h3>${esc(t("press.ref") || "Reference")}</h3>
            <p class="rel-refcode">${esc(ref)}</p>
          </div>
          <div class="panel rel-side">
            <h3>${esc(t("press.save") || "Save this statement")}</h3>
            <p class="muted">${esc(t("press.save.p") || "Use your browser’s print dialog to save an official copy with the masthead and reference number.")}</p>
            <p class="hero-actions" style="margin-top:12px">
              <button class="btn-gold" type="button" id="rel-print-2">${esc(t("press.print") || "Print / PDF")}</button>
            </p>
          </div>
          <div class="panel rel-side">
            <h3>${esc(t("press.cite") || "Cite this release")}</h3>
            <p class="rel-cite">${esc(cite)}</p>
            <button class="btn-outline" type="button" id="rel-cite">${esc(t("press.copy") || "Copy link")}</button>
          </div>
        </aside>
      </div>

      <div class="rel-pager">
        ${prev ? `<a class="rel-page-link" href="${esc(prev.href)}"><small>Previous</small><span>${esc(prev.title)}</span></a>` : "<span></span>"}
        ${next ? `<a class="rel-page-link next" href="${esc(next.href)}"><small>Next</small><span>${esc(next.title)}</span></a>` : "<span></span>"}
      </div>

      ${related.length ? `<section class="rel-related">
        <p class="kicker-off">${esc(t("press.record") || "Official record")}</p>
        <h2>${esc(t("press.related") || "More from the official record")}</h2>
        <div class="rel-more">${related.map(relatedCard).join("")}</div>
      </section>` : ""}
    </div>
  `;

  function copyText(text: string, ok: string) {
    const done = () => toast(ok);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => done());
    } else {
      done();
    }
  }

  document.getElementById("rel-print")?.addEventListener("click", () => window.print());
  document.getElementById("rel-print-2")?.addEventListener("click", () => window.print());
  document.getElementById("rel-copy")?.addEventListener("click", () => copyText(pageUrl, t("press.copied") || "Link copied"));
  document.getElementById("rel-cite")?.addEventListener("click", () => copyText(cite, t("press.copied") || "Link copied"));
  document.getElementById("rel-share")?.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, url: pageUrl, text: item.title });
        return;
      } catch (e) { /* cancelled */ }
    }
    copyText(pageUrl, t("press.copied") || "Link copied");
  });

  window.UMC?.applyI18n();
}

init();
})();
