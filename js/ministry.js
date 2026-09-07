(function () {
  const root = document.body.getAttribute("data-root") || ".";
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const mins = window.UMC_MINISTRIES || [];
  const releases = window.UMC_RELEASES || [];
  const min = mins.find((m) => m.id === id);
  const mount = document.querySelector("[data-min-desk]");
  if (!mount) return;
  if (!min) {
    location.replace(root + "/ministries.html");
    return;
  }

  const items = releases.filter((r) => r.min === min.id);
  const live = items.filter((r) => r.urg === "critical" || r.urg === "important");
  const related = mins.filter((m) => m.cat === min.cat && m.id !== min.id).slice(0, 3);
  const catLabel = {
    communications: "Communications",
    regional: "Regional",
    economic: "Economic",
    security: "Security",
    social: "Social Services",
    governance: "Governance",
    infrastructure: "Infrastructure"
  }[min.cat] || min.cat;

  document.title = min.name + " — Uganda Media Centre";

  function card(r) {
    return `<a class="min-release" href="${r.href}">
      <img src="${r.img}" alt="">
      <div>
        <p class="voice-meta"><span class="urg ${r.urg}">${r.urg}</span><time>${r.date}</time><span>${r.cat}</span></p>
        <h3>${r.title}</h3>
        <p>${r.p}</p>
        <p class="voice-ch">${(r.ch || []).map((c) => `<span>${c}</span>`).join("")}</p>
      </div>
    </a>`;
  }

  const liveHtml = live.length
    ? live.map(card).join("")
    : items.slice(0, 2).map(card).join("") || `<p class="muted">No live announcements on this desk yet. Press releases are listed below.</p>`;

  const pressHtml = items.length
    ? items.map(card).join("")
    : `<div class="min-empty">
        <p>No press releases filed on this desk yet.</p>
        <a class="btn-outline" href="${root}/news.html">Browse the Press Room</a>
      </div>`;

  const toastForm = (form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = form.getAttribute("data-toast") || "Sent.";
        toast.classList.add("show");
        form.reset();
        setTimeout(() => toast.classList.remove("show"), 3200);
      }
    });
  };

  mount.innerHTML = `
    <section class="page-hero min-desk-hero">
      <div class="wrap">
        <p class="crumb"><a href="${root}/ministries.html">All ministries</a> · ${catLabel}</p>
        <div class="min-desk-top">
          <img src="${root}/img/coat-of-arms.png" alt="">
          <div>
            <p class="kicker-off">${catLabel}</p>
            <h1>${min.name}</h1>
            <p class="lede">Led by ${min.lead}</p>
          </div>
        </div>
        <div class="min-desk-stats">
          <div><b>${min.year}</b><span>Established</span></div>
          <div><b>${items.length}</b><span>Releases</span></div>
          <div><b>${live.length}</b><span>Live alerts</span></div>
        </div>
      </div>
    </section>
    <div class="flag-stripe"></div>
    <section class="section">
      <div class="wrap min-desk-grid">
        <div>
          <p class="kicker-off">About &amp; mandate</p>
          <h2 class="off-h2" style="font-size:clamp(28px,4vw,40px);margin:8px 0 16px">What this desk does</h2>
          <p class="lede">${min.mandate}</p>
          <dl class="min-facts">
            <div><dt>Established</dt><dd>${min.year}</dd></div>
            <div><dt>Reports to</dt><dd>${min.reports}</dd></div>
            <div><dt>Sector</dt><dd>${catLabel}</dd></div>
          </dl>
        </div>
        <aside class="min-side">
          <p class="kicker-off">Direct contact</p>
          <ul>
            <li><a href="${min.web}" ${min.web.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${min.web.replace(/^https?:\/\//, "")}</a></li>
            <li><a href="mailto:${min.email}">${min.email}</a></li>
            <li><a href="tel:${min.phone.replace(/\\s/g, "")}">${min.phone}</a></li>
          </ul>
          <p class="muted">Office hours Mon–Fri 08:00–17:00</p>
          <a class="btn-gold" href="${root}/accreditation.html">Request a briefing</a>
        </aside>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <p class="kicker-off">Live message feed</p>
        <h2 class="off-h2" style="font-size:clamp(28px,4vw,40px);margin:8px 0 18px">Announcements from this ministry</h2>
        <div class="min-feed">${liveHtml}</div>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <p class="kicker-off">Recent press releases</p>
        <h2 class="off-h2" style="font-size:clamp(28px,4vw,40px);margin:8px 0 18px">${items.length} on the record</h2>
        <div class="min-feed">${pressHtml}</div>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <p class="kicker-off">Same sector</p>
        <h2 class="off-h2" style="font-size:clamp(24px,3vw,32px);margin:8px 0 18px">Other ${catLabel.toLowerCase()} desks</h2>
        <div class="min-related">
          ${related.map((m) => `<a href="${root}/ministry.html?id=${m.id}"><span class="badge">${m.code}</span><strong>${m.name}</strong><small>${m.lead}</small></a>`).join("")}
        </div>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap min-desk-grid">
        <form class="min-fb" data-toast="Message routed to ${min.name}. Response within 48 hours.">
          <p class="kicker-off">Send feedback</p>
          <h2 class="off-h2" style="font-size:clamp(24px,3vw,32px);margin:8px 0 12px">Write to this ministry</h2>
          <p class="muted">Your message goes directly to ${min.name}.</p>
          <label>Subject<input name="subject" required></label>
          <label>Urgency
            <select name="urg">
              <option>Low — general concern</option>
              <option selected>Medium — needs attention</option>
              <option>High — urgent / safety</option>
            </select>
          </label>
          <label>Describe the issue<textarea name="msg" required rows="5"></textarea></label>
          <button class="btn-gold" type="submit">Submit feedback</button>
        </form>
        <aside class="min-side">
          <p class="kicker-off">Press</p>
          <p>Accredited journalists may request a one-on-one briefing with the ministry spokesperson.</p>
          <a class="btn-outline" href="${root}/accreditation.html">Begin accreditation →</a>
        </aside>
      </div>
    </section>
  `;
  mount.querySelectorAll("form[data-toast]").forEach(toastForm);
})();
