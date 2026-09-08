import { UMC_MINISTRIES, UMC_RELEASES, UMC_EVENTS } from "./ministries-data.js";
import { UMC_I18N } from "./i18n.js";
function init() {
    const root = document.body.getAttribute("data-root") || ".";
    const mins = UMC_MINISTRIES;
    const releases = UMC_RELEASES;
    const events = UMC_EVENTS;
    const mount = document.querySelector("[data-min-desk]");
    if (!mount)
        return;
    const CAT = {
        communications: "Communications",
        regional: "Regional",
        economic: "Economic",
        security: "Security",
        social: "Social Services",
        governance: "Governance",
        infrastructure: "Infrastructure"
    };
    function lang() {
        const q = new URLSearchParams(location.search).get("lang");
        if (q && ["en", "lg", "sw"].includes(q))
            return q;
        const saved = localStorage.getItem("umc-lang");
        return ["en", "lg", "sw"].includes(saved) ? saved : "en";
    }
    function t(key) {
        const I = UMC_I18N;
        const L = lang();
        return (I[L] && I[L][key]) || (I.en && I.en[key]) || "";
    }
    function esc(s) {
        return String(s || "").replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
    }
    function webHref(web) {
        if (!web)
            return "#";
        if (web.startsWith("http") || web.includes(".html"))
            return web;
        return root + "/" + web;
    }
    function webLabel(web) {
        if (!web)
            return "";
        if (web === "languages.html")
            return t("nav.languages") || "Languages Desk";
        return web.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }
    function telHref(phone) {
        return "tel:" + String(phone || "").replace(/\s/g, "");
    }
    function render() {
        const id = new URLSearchParams(location.search).get("id");
        const min = mins.find((m) => m.id === id);
        if (!min) {
            location.replace(root + "/ministries.html");
            return;
        }
        const items = releases.filter((r) => r.min === min.id);
        const live = items.filter((r) => r.urg === "critical" || r.urg === "important");
        const evs = events.filter((e) => e.min === min.id);
        const related = mins.filter((m) => m.cat === min.cat && m.id !== min.id).slice(0, 3);
        const idx = mins.findIndex((m) => m.id === min.id);
        const prev = mins[idx - 1];
        const next = mins[idx + 1];
        const catLabel = CAT[min.cat] || min.cat;
        const hq = min.hq || "Postel Building, Clement Hill Rd, Kampala";
        const ext = min.web && min.web.startsWith("http");
        document.title = min.name + " — Uganda Media Centre";
        const liveHtml = live.length
            ? live.map((r) => `<a class="desk-story" href="${esc(r.href)}">
          <img src="${esc(r.img)}" alt="">
          <div>
            <p class="voice-meta"><span class="urg ${esc(r.urg)}">${esc(r.urg)}</span><time>${esc(r.date)}</time><span>${esc(r.cat)}</span></p>
            <h3>${esc(r.title)}</h3>
            <p>${esc(r.p)}</p>
            <p class="voice-ch">${(r.ch || []).map((c) => `<span>${esc(c)}</span>`).join("")}</p>
          </div>
        </a>`).join("")
            : `<div class="desk-empty">
          <span class="desk-empty-ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
          </span>
          <p>${t("desk.live.empty")}</p>
        </div>`;
        const pressHtml = items.length
            ? items.map((r) => `<a class="desk-press-row" href="${esc(r.href)}">
          <span>${t("desk.announcement")} · ${esc(r.date)}</span>
          <strong>${esc(r.title)}</strong>
        </a>`).join("")
            : `<div class="desk-empty slim">
          <p>${t("desk.press.empty")}</p>
          <a class="btn-outline" href="${root}/news.html">${t("desk.browse")}</a>
        </div>`;
        const evHtml = evs.length
            ? `<div class="desk-events">${evs.map((e) => `<article>
          <time>${esc(e.date)}</time>
          <h3>${esc(e.title)}</h3>
          <p>${esc(e.where)}</p>
        </article>`).join("")}</div>`
            : "";
        mount.innerHTML = `
      <section class="desk-hero" data-cat="${esc(min.cat)}">
        <img class="desk-hero-arms" src="${root}/img/coat-of-arms.png" alt="">
        <div class="wrap">
          <a class="desk-back" href="${root}/ministries.html">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18 9 12l6-6"/></svg>
            ${t("desk.back")}
          </a>
          <div class="desk-hero-row">
            <div class="desk-hero-copy">
              <img class="desk-coat" src="${root}/img/coat-of-arms.png" alt="">
              <div>
                <span class="desk-badge">${esc(catLabel)}</span>
                <h1>${esc(min.name)}</h1>
                <p class="desk-led">${t("desk.led")} <b>${esc(min.lead)}</b></p>
              </div>
            </div>
            <div class="desk-stats" aria-label="${t("desk.stats")}">
              <div><b>${esc(min.year)}</b><span>${t("desk.est")}</span></div>
              <div><b>${items.length}</b><span>${t("desk.releases")}</span></div>
              <div><b>${live.length}</b><span>${t("desk.ann")}</span></div>
            </div>
          </div>
        </div>
      </section>
      <div class="flag-rule"></div>
      <section class="desk-body">
        <div class="wrap mdesk">
          <div class="desk-about">
            <h2>${t("desk.about")}</h2>
            <p>${esc(min.mandate)}</p>
            <dl class="desk-facts">
              <div><dt>${t("desk.est")}</dt><dd>${esc(min.year)}</dd></div>
              <div><dt>${t("desk.reports")}</dt><dd>${esc(min.reports)}</dd></div>
              <div><dt>${t("desk.sector")}</dt><dd>${esc(catLabel)}</dd></div>
            </dl>
          </div>
          <aside class="desk-side">
            <div class="mdesk-card">
              <p class="desk-k">${t("desk.contact")}</p>
              <ul class="desk-contact">
                <li>
                  <span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.4c.8.2 1.7.4 2.6.6a2 2 0 0 1 1.7 2.1z"/></svg></span>
                  <div><small>${t("desk.pressdesk")}</small><a href="${telHref(min.phone)}">${esc(min.phone)}</a></div>
                </li>
                <li>
                  <span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg></span>
                  <div><small>${t("desk.enq")}</small><a href="mailto:${esc(min.email)}">${esc(min.email)}</a></div>
                </li>
                <li>
                  <span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></span>
                  <div><small>${t("desk.web")}</small><a href="${webHref(min.web)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${esc(webLabel(min.web))}</a></div>
                </li>
                <li>
                  <span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg></span>
                  <div><small>${t("desk.hq")}</small><span>${esc(hq)}</span></div>
                </li>
              </ul>
            </div>
            <div class="mdesk-card">
              <p class="desk-k">${t("desk.hours")}</p>
              <p class="desk-hours">${t("desk.hours.v")}</p>
            </div>
            <div class="desk-brief">
              <p class="desk-k">${t("desk.brief")}</p>
              <p>${t("desk.brief.p")}</p>
              <a href="${root}/accreditation.html">${t("desk.brief.cta")}</a>
            </div>
          </aside>
          <div class="desk-rest">
            <div class="desk-block">
              <div class="desk-live-h">
                <div>
                  <h2>${t("desk.live")}</h2>
                  <p class="muted">${t("desk.live.sub")}</p>
                </div>
                ${live.length ? `<p class="desk-live-pill"><i></i>${t("desk.live.badge")}</p>` : ""}
              </div>
              <div class="desk-feed">${liveHtml}</div>
            </div>
            <div class="desk-block">
              <h2>${t("desk.press")}</h2>
              <div class="desk-press">${pressHtml}</div>
            </div>
            ${evHtml ? `<div class="desk-block">
              <h2>${t("desk.events")}</h2>
              ${evHtml}
            </div>` : ""}
            ${related.length ? `<div class="desk-block">
              <h2>${t("desk.related")}</h2>
              <div class="desk-related">
                ${related.map((m) => `<a href="${root}/ministry.html?id=${esc(m.id)}" data-cat="${esc(m.cat)}">
                  <span class="desk-badge sm">${esc(CAT[m.cat] || m.cat)}</span>
                  <strong>${esc(m.name)}</strong>
                  <small>${esc(m.lead)}</small>
                </a>`).join("")}
              </div>
            </div>` : ""}
            <form class="desk-fb" data-toast="${esc(t("desk.fb.toast").replace("{name}", min.name))}">
              <div class="desk-fb-top">
                <div>
                  <h2>${t("desk.fb")}</h2>
                  <p class="muted">${t("desk.fb.p")} ${esc(min.name)}.</p>
                </div>
                <dl class="desk-fb-meta">
                  <div><dt>${t("desk.fb.routed")}</dt><dd>${esc(min.name)}</dd></div>
                  <div><dt>${t("desk.fb.resp")}</dt><dd>48h</dd></div>
                </dl>
              </div>
              <label>${t("desk.fb.subject")}<input name="subject" required maxlength="160"></label>
              <label>${t("desk.fb.urg")}
                <select name="urg">
                  <option>${t("desk.fb.urg.low")}</option>
                  <option selected>${t("desk.fb.urg.mid")}</option>
                  <option>${t("desk.fb.urg.high")}</option>
                </select>
              </label>
              <label>${t("desk.fb.issue")}
                <textarea name="msg" required rows="6" maxlength="2000" data-count></textarea>
                <span class="desk-count"><b data-count-n>0</b>/2000</span>
              </label>
              <div class="desk-ident">
                <p>${t("desk.fb.details")}</p>
                <label class="desk-anon"><input type="checkbox" name="anon"> ${t("desk.fb.anon")}</label>
              </div>
              <div class="desk-ident-row">
                <input name="name" data-ident placeholder="${esc(t("desk.fb.name"))}">
                <input name="reach" data-ident placeholder="${esc(t("desk.fb.contact"))}">
                <input name="district" data-ident placeholder="${esc(t("desk.fb.district"))}">
              </div>
              <button class="desk-submit" type="submit">${t("desk.fb.submit")}</button>
            </form>
            <nav class="desk-pager">
              ${prev ? `<a href="${root}/ministry.html?id=${esc(prev.id)}"><span>${t("desk.prev")}</span><b>${esc(prev.name)}</b></a>` : "<span></span>"}
              ${next ? `<a class="next" href="${root}/ministry.html?id=${esc(next.id)}"><span>${t("desk.next")}</span><b>${esc(next.name)}</b></a>` : "<span></span>"}
            </nav>
          </div>
        </div>
      </section>
    `;
        const form = mount.querySelector("form.desk-fb");
        const toastForm = (el) => {
            el.addEventListener("submit", (e) => {
                e.preventDefault();
                const toast = document.getElementById("toast");
                if (toast) {
                    toast.textContent = el.getAttribute("data-toast") || t("desk.fb.toast").replace("{name}", min.name);
                    toast.classList.add("show");
                    el.reset();
                    const n = el.querySelector("[data-count-n]");
                    if (n)
                        n.textContent = "0";
                    el.querySelectorAll("[data-ident]").forEach((i) => { i.disabled = false; });
                    setTimeout(() => toast.classList.remove("show"), 3200);
                }
            });
        };
        if (form)
            toastForm(form);
        mount.querySelector("[data-count]")?.addEventListener("input", (e) => {
            const n = mount.querySelector("[data-count-n]");
            if (n)
                n.textContent = String(e.target.value.length);
        });
        mount.querySelector("input[name=anon]")?.addEventListener("change", (e) => {
            mount.querySelectorAll("[data-ident]").forEach((i) => { i.disabled = e.target.checked; });
        });
    }
    render();
    document.addEventListener("umc:lang", render);
}
init();
//# sourceMappingURL=ministry.js.map