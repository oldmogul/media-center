(function () {
  const root = document.body.getAttribute("data-root") || ".";
  const page = document.body.getAttribute("data-page") || "";
  const I18N = window.UMC_I18N || { en: {} };
  const LANGS = ["en", "lg", "sw"];
  const LANG_META = { en: "en", lg: "lg", sw: "sw" };

  function getLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.includes(q)) return q;
    const saved = localStorage.getItem("umc-lang");
    return LANGS.includes(saved) ? saved : "en";
  }
  let lang = getLang();

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || "";
  }

  function applyI18n() {
    document.documentElement.lang = LANG_META[lang] || "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n-html"));
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n-placeholder"));
      if (v) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n-aria"));
      if (v) el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("form[data-toast-key]").forEach((el) => {
      el.setAttribute("data-toast", t(el.getAttribute("data-toast-key")));
    });
    const titleKey = document.body.getAttribute("data-title-key");
    if (titleKey && t(titleKey)) document.title = t(titleKey);
    document.querySelectorAll("[data-set-lang]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-set-lang") === lang);
    });
  }

  function setLang(next, { toast } = { toast: true }) {
    if (!LANGS.includes(next) || next === lang) {
      lang = next;
      applyI18n();
      return;
    }
    lang = next;
    localStorage.setItem("umc-lang", lang);
    applyI18n();
    if (toast) {
      const el = document.getElementById("toast");
      if (el) {
        el.textContent = t("lang.switched");
        el.classList.add("show");
        setTimeout(() => el.classList.remove("show"), 2200);
      }
    }
  }

  const nav = [
    ["index.html", "nav.home", "home"],
    ["ministries.html", "nav.ministries", "ministries"],
    ["news.html", "nav.press", "press"],
    ["languages.html", "nav.languages", "languages"],
    ["radio.html", "nav.radio", "radio"],
    ["engagement.html", "nav.engagement", "engagement"],
    ["about.html", "nav.about", "about"],
  ];

  const ticks = [
    ["tick.1k", "tick.1"],
    ["tick.2k", "tick.2"],
    ["tick.3k", "tick.3"],
    ["tick.4k", "tick.4"],
    ["tick.5k", "tick.5"],
    ["tick.6k", "tick.6"],
  ];

  function tickerHtml() {
    const bits = ticks.concat(ticks).map(([k, v]) => `<span><b data-i18n="${k}"></b> <span data-i18n="${v}"></span></span>`).join("");
    return `<div class="ticker"><div class="ticker-track">${bits}</div></div>`;
  }

  const header = `
    <div class="flag-stripe"></div>
    <div class="util">
      <div class="wrap util-inner">
        <div class="util-left">
          <span class="live-dot" aria-hidden="true"></span>
          <span class="hide-sm" data-i18n="util.republic"></span>
          ${tickerHtml()}
        </div>
        <div class="util-right">
          <button type="button" class="text-link" data-set-lang="lg">Luganda</button>
          <button type="button" class="text-link" data-set-lang="sw">Kiswahili</button>
          <a href="${root}/accreditation.html" data-i18n="util.accredit"></a>
        </div>
      </div>
    </div>
    <header class="header">
      <div class="wrap header-inner">
        <a class="brand" href="${root}/index.html">
          <img src="${root}/img/coat.svg" alt="Coat of arms of Uganda">
          <span>
            <strong data-i18n="brand.name"></strong>
            <small data-i18n="brand.sub"></small>
          </span>
        </a>
        <nav class="nav" id="nav">
          ${nav.map(([h, key, id]) => {
            if (id === "about") {
              return `<div class="drop">
                <a href="${root}/${h}" class="${page === "about" ? "active" : ""}" data-i18n="${key}"></a>
                <div class="drop-menu">
                  <a href="${root}/about.html">About Media Centre</a>
                  <a href="${root}/team.html">Our Team</a>
                  <a href="${root}/history.html">Ugandan History</a>
                </div>
              </div>`;
            }
            return `<a href="${root}/${h}" class="${page === id ? "active" : ""}" data-i18n="${key}"></a>`;
          }).join("")}
        </nav>
        <div class="header-tools">
          <div class="lang-switch" role="group" aria-label="Language">
            <button type="button" data-set-lang="en">EN</button>
            <button type="button" data-set-lang="lg">LG</button>
            <button type="button" data-set-lang="sw">SW</button>
          </div>
          <button class="icon-btn" id="searchBtn" data-i18n-aria="cta.search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          </button>
          <a class="cta-mini" href="${root}/accreditation.html" data-i18n="cta.accredit"></a>
          <button class="icon-btn burger" id="burger" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
    </header>
    <div class="search-overlay" id="search">
      <div class="search-box">
        <input id="searchInput" type="search" data-i18n-placeholder="search.ph" placeholder="Search…">
        <div class="search-hits" id="searchHits"></div>
      </div>
    </div>
  `;

  const footer = `
    <footer class="footer">
      <div class="wrap foot-grid">
        <div>
          <div class="foot-brand">
            <img src="${root}/img/coat.svg" alt="">
            <div>
              <strong data-i18n="brand.name"></strong>
              <p class="muted" style="color:#cbbf9d;margin-top:6px;max-width:36ch" data-i18n="footer.voice"></p>
            </div>
          </div>
          <div class="social">
            <a href="https://www.facebook.com/UgandaMediaCentre/" aria-label="Facebook">f</a>
            <a href="https://twitter.com/UgandaMediaCent/" aria-label="X">𝕏</a>
            <a href="https://www.instagram.com/ugandamediacentre/" aria-label="Instagram">ig</a>
            <a href="https://www.youtube.com/@ugandamediacentre" aria-label="YouTube">▶</a>
          </div>
        </div>
        <div>
          <h4 data-i18n="footer.explore"></h4>
          <ul>
            <li><a href="${root}/index.html" data-i18n="footer.command"></a></li>
            <li><a href="${root}/ministries.html" data-i18n="footer.ministries"></a></li>
            <li><a href="${root}/news.html" data-i18n="footer.press"></a></li>
            <li><a href="${root}/gallery.html" data-i18n="footer.gallery"></a></li>
            <li><a href="${root}/videos.html" data-i18n="footer.video"></a></li>
            <li><a href="${root}/languages.html" data-i18n="footer.languages"></a></li>
            <li><a href="${root}/radio.html" data-i18n="nav.radio"></a></li>
            <li><a href="${root}/engagement.html" data-i18n="nav.engagement"></a></li>
            <li><a href="${root}/history.html">Ugandan History</a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n="footer.about"></h4>
          <ul>
            <li><a href="${root}/about.html" data-i18n="footer.centre"></a></li>
            <li><a href="${root}/team.html" data-i18n="footer.team"></a></li>
            <li><a href="${root}/accreditation.html" data-i18n="footer.accredit"></a></li>
            <li><a href="${root}/contact.html" data-i18n="footer.contact"></a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n="footer.contact"></h4>
          <ul>
            <li>Plot 36A, Nile Avenue / Clement Hill Road</li>
            <li>P.O. Box 2665, Kampala</li>
            <li>+256 414 237 141 · +256 312 261 525</li>
            <li><a href="mailto:info@mediacentre.go.ug">info@mediacentre.go.ug</a></li>
          </ul>
        </div>
      </div>
      <div class="wrap legal">
        <span data-i18n="footer.legal"></span>
        <span data-i18n="footer.std"></span>
      </div>
    </footer>
    <div class="modal" id="modal"><button class="modal-close" id="modalClose">×</button><div id="modalBody"></div></div>
    <div class="toast" id="toast"></div>
  `;

  const top = document.getElementById("site-header");
  const bot = document.getElementById("site-footer");
  if (top) top.innerHTML = header;
  if (bot) bot.innerHTML = footer;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-set-lang]");
    if (!btn) return;
    e.preventDefault();
    setLang(btn.getAttribute("data-set-lang"));
  });

  applyI18n();

  const burger = document.getElementById("burger");
  const navEl = document.getElementById("nav");
  if (burger && navEl) burger.onclick = () => navEl.classList.toggle("open");

  const search = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const searchHits = document.getElementById("searchHits");
  const searchIndex = () => ([
    { t: t("hero.1.t"), s: t("hero.1.k"), h: "articles/vision.html" },
    { t: t("card.ebola.t"), s: t("tag.health"), h: "articles/ebola.html" },
    { t: t("home.coffee.t"), s: t("tag.agri"), h: "articles/coffee.html" },
    { t: t("home.kar.t"), s: t("tag.opm"), h: "articles/karamoja.html" },
    { t: t("card.updf.t"), s: t("tag.defence"), h: "articles/updf.html" },
    { t: t("acc.h1"), s: t("cta.accredit"), h: "accreditation.html" },
    { t: t("team.h1"), s: t("footer.team"), h: "team.html" },
    { t: t("min.h1"), s: t("footer.ministries"), h: "ministries.html" },
  ]);
  function renderHits(q) {
    const qq = (q || "").toLowerCase();
    const rows = searchIndex().filter((x) => !qq || x.t.toLowerCase().includes(qq) || x.s.toLowerCase().includes(qq));
    searchHits.innerHTML = rows.slice(0, 6).map((x) => `<a href="${root}/${x.h}">${x.t}<span>${x.s}</span></a>`).join("") || `<p class="muted">${t("search.empty")}</p>`;
  }
  if (searchBtn) searchBtn.onclick = () => { search.classList.add("open"); searchInput.focus(); renderHits(""); };
  if (search) search.addEventListener("click", (e) => { if (e.target === search) search.classList.remove("open"); });
  if (searchInput) searchInput.addEventListener("input", () => renderHits(searchInput.value));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      search?.classList.remove("open");
      document.getElementById("modal")?.classList.remove("open");
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      search?.classList.add("open");
      searchInput?.focus();
    }
  });

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    if (btn.closest("[data-min-filters]")) return;
    btn.addEventListener("click", () => {
      const group = btn.closest(".filters") || btn.parentElement;
      group.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.getAttribute("data-filter");
      const scope = btn.closest("section") || document;
      scope.querySelectorAll("[data-cat]").forEach((card) => {
        if (card.classList.contains("min-card")) return;
        const show = f === "all" || card.getAttribute("data-cat") === f;
        card.style.display = show ? "" : "none";
        if (show) {
          card.classList.remove("pop");
          void card.offsetWidth;
          card.classList.add("pop");
        }
      });
    });
  });

  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  document.getElementById("modalClose")?.addEventListener("click", () => modal.classList.remove("open"));
  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const src = el.getAttribute("href") || el.querySelector("img")?.src;
      modalBody.innerHTML = `<img src="${src}" alt="">`;
      modal.classList.add("open");
    });
  });
  document.querySelectorAll("[data-video]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      modalBody.innerHTML = `<img src="${el.getAttribute("data-video")}" alt=""><p style="color:#fff;text-align:center;margin-top:10px">${t("video.clip")}</p>`;
      modal.classList.add("open");
    });
  });

  document.querySelectorAll("form[data-toast], form[data-toast-key]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const toast = document.getElementById("toast");
      toast.textContent = form.getAttribute("data-toast") || t(form.getAttribute("data-toast-key"));
      toast.classList.add("show");
      form.reset();
      setTimeout(() => toast.classList.remove("show"), 3200);
    });
  });

  /* Hero / generic sliders */
  function initSlider(rootEl) {
    if (!rootEl) return;
    const slides = [...rootEl.querySelectorAll(".slide")];
    if (!slides.length) return;
    const dotsWrap = rootEl.querySelector(".slide-dots");
    const bar = rootEl.querySelector(".slide-bar i");
    let i = slides.findIndex((s) => s.classList.contains("is-active"));
    if (i < 0) i = 0;
    let timer;
    const dur = Number(rootEl.getAttribute("data-interval") || 6500);

    if (dotsWrap && !dotsWrap.children.length) {
      slides.forEach((_, n) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Slide " + (n + 1));
        b.addEventListener("click", () => go(n, true));
        dotsWrap.appendChild(b);
      });
    }

    function paint() {
      slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
      if (dotsWrap) [...dotsWrap.children].forEach((d, n) => d.classList.toggle("active", n === i));
      if (bar) {
        bar.style.animation = "none";
        void bar.offsetWidth;
        bar.style.animation = `slideProg ${dur}ms linear`;
      }
    }
    function go(n, user) {
      i = (n + slides.length) % slides.length;
      paint();
      if (user) restart();
    }
    function next() { go(i + 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, dur);
    }
    rootEl.querySelector(".slide-prev")?.addEventListener("click", () => go(i - 1, true));
    rootEl.querySelector(".slide-next")?.addEventListener("click", () => go(i + 1, true));
    rootEl.addEventListener("mouseenter", () => clearInterval(timer));
    rootEl.addEventListener("mouseleave", restart);
    let x0 = null;
    rootEl.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
    rootEl.addEventListener("pointerup", (e) => {
      if (x0 == null) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true);
      x0 = null;
    });
    paint();
    restart();
  }
  document.querySelectorAll("[data-slider]").forEach(initSlider);

  /* Horizontal rails */
  document.querySelectorAll("[data-rail]").forEach((rail) => {
    const track = rail.querySelector(".rail-track");
    if (!track) return;
    rail.querySelector(".rail-prev")?.addEventListener("click", () => track.scrollBy({ left: -320, behavior: "smooth" }));
    rail.querySelector(".rail-next")?.addEventListener("click", () => track.scrollBy({ left: 320, behavior: "smooth" }));
  });

  /* Scroll reveal */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal, .section, .explore, .page-hero, .mosaic-card, .news-card, .min-card, .person, .video-card, .prog").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

  /* Sticky header shrink */
  const headerEl = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    headerEl?.classList.toggle("compact", window.scrollY > 24);
  }, { passive: true });

  function applyMinFilter() {
    const q = (document.querySelector("[data-min-search]")?.value || "").toLowerCase();
    const active = document.querySelector(".min-tools [data-filter].active, [data-min-filters] [data-filter].active")?.getAttribute("data-filter") || "all";
    let n = 0;
    document.querySelectorAll(".min-card").forEach((card) => {
      const text = card.textContent.toLowerCase();
      const cat = card.getAttribute("data-cat") || "";
      const show = (active === "all" || cat === active) && (!q || text.includes(q));
      card.style.display = show ? "" : "none";
      if (show) n += 1;
    });
    const count = document.querySelector("[data-min-count]");
    if (count) count.textContent = String(n);
  }
  document.querySelector("[data-min-search]")?.addEventListener("input", applyMinFilter);
  document.querySelectorAll("[data-min-filters] [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-min-filters] [data-filter]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyMinFilter();
    });
  });

  document.querySelectorAll(".stream-pills button, .lang-pills button, .chat-langs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
    });
  });

  document.querySelectorAll("[data-tabs]").forEach((rootEl) => {
    const tabs = [...rootEl.querySelectorAll("[data-tab]")];
    const panels = [...document.querySelectorAll("[data-tab-panel]")];
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.toggle("on", t === tab));
        panels.forEach((p) => p.classList.toggle("on", p.getAttribute("data-tab-panel") === tab.getAttribute("data-tab")));
      });
    });
  });

  document.querySelector("[data-play]")?.addEventListener("click", (e) => {
    const b = e.currentTarget;
    b.classList.toggle("playing");
    b.textContent = b.classList.contains("playing") ? "❚❚" : "▶";
  });

  document.querySelectorAll("[data-chapter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-chapter]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const id = btn.getAttribute("data-chapter");
      document.querySelectorAll("[data-plate]").forEach((p) => {
        p.style.display = p.getAttribute("data-plate") === id ? "" : "none";
      });
    });
  });
})();
