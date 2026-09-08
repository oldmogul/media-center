(function () {
function init(): void {
  const root = document.body.getAttribute("data-root") || ".";
  const page = document.body.getAttribute("data-page") || "";
  const I18N = UMC_I18N;
  const LANGS: Lang[] = ["en", "lg", "sw"];
  const LANG_META = { en: "en", lg: "lg", sw: "sw" };

  function getLang(): Lang {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.includes(q as Lang)) return q as Lang;
    const saved = localStorage.getItem("umc-lang");
    return LANGS.includes(saved as Lang) ? (saved as Lang) : "en";
  }
  let lang = getLang();

  function t(key: string): string {
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
    document.querySelectorAll("[data-lang-code]").forEach((el) => {
      el.textContent = lang.toUpperCase();
    });
  }

  function setLang(next: string | null, { toast }: { toast?: boolean } = { toast: true }): void {
    if (!next || !LANGS.includes(next as Lang) || next === lang) {
      lang = next as Lang;
      applyI18n();
      return;
    }
    lang = next as Lang;
    localStorage.setItem("umc-lang", lang);
    applyI18n();
    document.dispatchEvent(new CustomEvent("umc:lang", { detail: { lang } }));
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
    ["languages.html", "nav.pulse", "pulse"],
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

  function caretSvg() {
    return `<svg class="drop-caret" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>`;
  }

  function langDropHtml() {
    return `<div class="drop lang-drop">
      <button type="button" class="lang-drop-btn drop-trigger" aria-haspopup="true" aria-expanded="false" data-i18n-aria="nav.lang" aria-label="Language">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>
        <span data-lang-code>${lang.toUpperCase()}</span>
        ${caretSvg()}
      </button>
      <div class="drop-menu">
        <button type="button" data-set-lang="en">English</button>
        <button type="button" data-set-lang="lg">Luganda</button>
        <button type="button" data-set-lang="sw">Kiswahili</button>
      </div>
    </div>`;
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
            if (id === "pulse") {
              const pulseOn = ["languages", "radio", "engagement"].includes(page);
              return `<div class="drop">
                <a href="${root}/${h}" class="drop-trigger ${pulseOn ? "active" : ""}">
                  <span data-i18n="${key}"></span>${caretSvg()}
                </a>
                <div class="drop-menu">
                  <a href="${root}/languages.html" data-i18n="nav.languages">Languages Desk</a>
                  <a href="${root}/radio.html" data-i18n="nav.radio">Radio</a>
                  <a href="${root}/engagement.html" data-i18n="nav.engagement">Engagement</a>
                </div>
              </div>`;
            }
            if (id === "about") {
              const aboutOn = ["about", "team", "history"].includes(page);
              return `<div class="drop">
                <a href="${root}/${h}" class="drop-trigger ${aboutOn ? "active" : ""}">
                  <span data-i18n="${key}"></span>${caretSvg()}
                </a>
                <div class="drop-menu">
                  <a href="${root}/about.html" data-i18n="nav.about.centre">About Media Centre</a>
                  <a href="${root}/team.html" data-i18n="nav.about.team">Our Team</a>
                  <a href="${root}/history.html" data-i18n="nav.about.history">Ugandan History</a>
                </div>
              </div>`;
            }
            const on = page === id || (id === "ministries" && page === "ministry");
            return `<a href="${root}/${h}" class="${on ? "active" : ""}" data-i18n="${key}"></a>`;
          }).join("")}
          <div class="nav-extra">
            ${langDropHtml()}
            <a class="cta-mini" href="${root}/accreditation.html" data-i18n="cta.accredit"></a>
          </div>
        </nav>
        <div class="header-tools">
          ${langDropHtml()}
          <button class="icon-btn" id="searchBtn" data-i18n-aria="cta.search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          </button>
          <a class="cta-mini" href="${root}/accreditation.html" data-i18n="cta.accredit"></a>
          <button class="icon-btn burger" id="burger" aria-label="Menu" aria-controls="nav" aria-expanded="false">
            <svg class="ico-menu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            <svg class="ico-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
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
      <img class="foot-watermark" src="${root}/img/coat-of-arms.png" alt="">
      <div class="wrap foot-grid">
        <div class="foot-brand-col">
          <div class="foot-brand">
            <img src="${root}/img/coat.svg" alt="Coat of arms of Uganda">
            <div>
              <strong data-i18n="brand.name"></strong>
              <small data-i18n="footer.ministry">Ministry of ICT &amp; National Guidance</small>
              <small data-i18n="footer.republic">Republic of Uganda</small>
            </div>
          </div>
          <p class="foot-voice" data-i18n="footer.voice"></p>
          <div class="social">
            <a href="https://www.facebook.com/UgandaMediaCentre/" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2L17 12h-4V9c0-.6.4-1 1-1z"/></svg>
            </a>
            <a href="https://twitter.com/UgandaMediaCent/" aria-label="X">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.6l-5.2-6.8L5.4 22H2.2l7.3-8.4L1 2h6.7l4.7 6.2L18.9 2zm-1.2 18h1.8L6.4 3.9H4.5L17.7 20z"/></svg>
            </a>
            <a href="https://www.instagram.com/ugandamediacentre/" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.youtube.com/@ugandamediacentre" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.6V8.8l6.2 3.4-6.2 3.4z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 data-i18n="footer.explore"></h4>
          <ul>
            <li><a href="${root}/index.html" data-i18n="footer.command"></a></li>
            <li><a href="${root}/ministries.html" data-i18n="footer.ministries"></a></li>
            <li><a href="${root}/news.html" data-i18n="footer.press"></a></li>
            <li><a href="${root}/accreditation.html" data-i18n="footer.accredit"></a></li>
            <li><a href="${root}/languages.html" data-i18n="footer.languages"></a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n="footer.contact"></h4>
          <ul class="foot-contact">
            <li data-i18n="footer.addr">Plot 15, Nakasero Hill</li>
            <li data-i18n="footer.po">P.O. Box 7142, Kampala</li>
            <li><a href="tel:+256414254461">+256 414 254 461</a></li>
            <li><a href="tel:+256312261525">+256 312 261 525</a></li>
            <li><a href="mailto:info@mediacentre.go.ug">info@mediacentre.go.ug</a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n="footer.help"></h4>
          <ul class="foot-help">
            <li><span data-i18n="footer.help.police">Police</span><b><a href="tel:999">999</a> / <a href="tel:112">112</a></b></li>
            <li><span data-i18n="footer.help.gbv">GBV &amp; child protection</span><b><a href="tel:116">116</a></b></li>
            <li><span data-i18n="footer.help.health">Health (toll-free)</span><b><a href="tel:0800100066">0800 100 066</a></b></li>
            <li><span data-i18n="footer.help.anti">Anti-corruption</span><b><a href="tel:0800100227">0800 100 227</a></b></li>
          </ul>
        </div>
      </div>
      <div class="foot-legal">
        <div class="wrap legal">
          <span class="legal-left">
            <span data-i18n="footer.legal"></span>
            <i class="legal-pipe" aria-hidden="true"></i>
            <span data-i18n="footer.legal.mid">Uganda Media Centre · Plot 15, Nakasero Hill, Kampala</span>
          </span>
          <span data-i18n="footer.by">Website by NWT</span>
        </div>
      </div>
    </footer>
    <div class="modal" id="modal"><button class="modal-close" id="modalClose">×</button><div id="modalBody"></div></div>
    <div class="toast" id="toast"></div>
  `;

  const top = document.getElementById("site-header");
  const bot = document.getElementById("site-footer");
  if (top) top.innerHTML = header;
  if (bot) bot.innerHTML = footer;

  function closeDrops(except?: Element | null): void {
    document.querySelectorAll(".drop.open").forEach((d) => {
      if (d === except) return;
      d.classList.remove("open");
      d.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "false");
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-set-lang]") : null;
    if (!btn) return;
    e.preventDefault();
    setLang(btn.getAttribute("data-set-lang"));
    closeDrops();
    if (window.matchMedia("(max-width: 860px)").matches) setNavOpen(false);
  });

  applyI18n();
  window.UMC = { t, applyI18n, getLang: () => lang, setLang };
  document.dispatchEvent(new CustomEvent("umc:lang", { detail: { lang } }));

  const burger = document.getElementById("burger");
  const navEl = document.getElementById("nav");
  function placeMobileNav() {
    const header = document.querySelector(".header");
    if (!navEl || !header) return;
    const top = Math.round(header.getBoundingClientRect().bottom);
    navEl.style.top = top + "px";
    document.documentElement.style.setProperty("--nav-top", top + "px");
  }
  function setNavOpen(open: boolean): void {
    if (!navEl || !burger) return;
    navEl.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Menu");
    if (open) {
      placeMobileNav();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      closeDrops();
    }
  }
  if (burger && navEl) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      setNavOpen(!navEl.classList.contains("open"));
    });
    navEl.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (a.classList.contains("drop-trigger")) return;
        setNavOpen(false);
      });
    });
    window.addEventListener("resize", () => {
      if (navEl.classList.contains("open")) placeMobileNav();
      if (window.matchMedia("(min-width: 861px)").matches) setNavOpen(false);
    });
  }

  document.querySelectorAll(".drop").forEach((drop) => {
    const trigger = drop.querySelector(":scope > .drop-trigger, :scope > .lang-drop-btn");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      const mobileNav = window.matchMedia("(max-width: 860px)").matches;
      if (trigger.tagName === "A" && !mobileNav) return;
      e.preventDefault();
      const open = !drop.classList.contains("open");
      closeDrops(drop);
      drop.classList.toggle("open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".drop")) closeDrops();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeDrops();
    if (navEl?.classList.contains("open")) setNavOpen(false);
  });

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
    if (btn.closest("[data-press-filters]")) return;
    if (btn.closest(".feed-sec")) return;
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

  const feedSec = document.querySelector(".feed-sec");
  function applyFeed() {
    if (!feedSec) return;
    const urg = feedSec.querySelector("[data-feed-urg] .filter.active")?.getAttribute("data-filter") || "all";
    const lang = feedSec.querySelector("[data-feed-lang] .filter.active")?.getAttribute("data-filter") || "all";
    let n = 0;
    feedSec.querySelectorAll(".voice-item").forEach((el) => {
      const show = (urg === "all" || el.getAttribute("data-urg") === urg)
        && (lang === "all" || el.getAttribute("data-lang") === lang);
      el.hidden = !show;
      if (show) n++;
    });
    const count = feedSec.querySelector("[data-feed-n]");
    if (count) count.textContent = String(n);
  }
  feedSec?.querySelectorAll("[data-feed-urg] [data-filter], [data-feed-lang] [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.parentElement;
      group.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFeed();
    });
  });
  applyFeed();

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
      const num = rootEl.querySelector("[data-slide-now]");
      if (num) num.textContent = String(i + 1).padStart(2, "0");
      if (bar) {
        bar.style.animation = "none";
        void bar.offsetWidth;
        bar.style.animation = `slideProg ${dur}ms linear`;
      }
    }
    function go(n: number, user?: boolean) {
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
    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") go(i + 1, true);
      if (e.key === "ArrowLeft") go(i - 1, true);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(timer);
      else restart();
    });
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

  const homeDate = document.querySelector("[data-home-date]");
  if (homeDate) {
    homeDate.textContent = new Date().toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  }

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
    if (el.getBoundingClientRect().height > window.innerHeight * 0.85) {
      el.classList.add("in");
      return;
    }
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

  if (!document.querySelector(".hist-stack")) {
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
  }
}

init();
})();
