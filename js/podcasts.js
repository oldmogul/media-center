(function () {
  const KEY = "umc-radio-v2";
  const root = document.body.getAttribute("data-root") || ".";

  const SHOWS = [
    { id: "bulletin", name: "The National Bulletin", host: "Alan Kasujja", cover: root + "/img/alan-kasujja.jpg" },
    { id: "health", name: "Health Line Uganda", host: "Sarah Nanteza Kyobe", cover: root + "/img/hospital.jpg" },
    { id: "farmers", name: "Eddoboozi ly’Abalimi", host: "Obed Katureebe", cover: root + "/img/agriculture.jpg" },
    { id: "citizen", name: "Citizen Line", host: "Charles Serugga Matovu", cover: root + "/img/team-charles.jpg" },
    { id: "kiswahili", name: "Kiswahili Leo", host: "David Serumaga", cover: root + "/img/explore-banner.jpg" },
    { id: "youth", name: "Youth Now", host: "Kevin Seguya", cover: root + "/img/campus.jpg" },
    { id: "pdm", name: "PDM Pulse", host: "Joseph Okumu", cover: root + "/img/wealth.jpg" },
    { id: "faith", name: "Faith & Nation", host: "Josepha Jabo", cover: root + "/img/team-josepha.jpg" }
  ];

  const BED = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  ];

  const DEFAULT_LIVE = {
    show: "bulletin",
    title: "Live press briefing",
    host: "Alan Kasujja",
    blurb: "Cabinet and ministry statements, live from the Uganda Media Centre.",
    lang: "English",
    audio: BED[0],
    cover: root + "/img/alan-speaking.jpg"
  };

  const SEED_EPISODES = [
    { id: "e1", show: "bulletin", title: "The National Bulletin — 142", date: "2026-09-02", duration: "32:14", lang: "English", audio: BED[0], blurb: "Cabinet, AFCON and NIN as TIN." },
    { id: "e2", show: "health", title: "Health Line: after Ebola", date: "2026-09-01", duration: "28:40", lang: "English", audio: BED[1], blurb: "42-day close-out and 0800-100-066." },
    { id: "e3", show: "farmers", title: "Eddoboozi — markets & rains", date: "2026-08-31", duration: "24:05", lang: "Luganda", audio: BED[2], blurb: "Second rains and maize prices." },
    { id: "e4", show: "citizen", title: "Citizen Line: land disputes", date: "2026-08-28", duration: "41:12", lang: "English", audio: BED[3], blurb: "New national standard for land conflicts." },
    { id: "e5", show: "kiswahili", title: "Kiswahili Leo — EAC", date: "2026-08-11", duration: "26:50", lang: "Kiswahili", audio: BED[0], blurb: "Kongamano la viwanda 2026." },
    { id: "e6", show: "youth", title: "Youth Now: skilling", date: "2026-08-14", duration: "22:18", lang: "English", audio: BED[1], blurb: "Presidential Skilling Centres." },
    { id: "e7", show: "pdm", title: "PDM Pulse — week in review", date: "2026-08-22", duration: "19:44", lang: "English", audio: BED[2], blurb: "SACCOs and Teso inspections." },
    { id: "e8", show: "faith", title: "Faith & Nation", date: "2026-08-30", duration: "18:02", lang: "English", audio: BED[3], blurb: "Inter-faith Sunday reflection." },
    { id: "e9", show: "bulletin", title: "The National Bulletin — 141", date: "2026-08-30", duration: "31:08", lang: "English", audio: BED[1], blurb: "Envoys and CMA at 30." },
    { id: "e10", show: "health", title: "Health Line: rains season", date: "2026-08-26", duration: "27:11", lang: "English", audio: BED[2], blurb: "Malaria and hygiene in the second rains." },
    { id: "e11", show: "citizen", title: "Citizen Line: PDM", date: "2026-08-20", duration: "38:00", lang: "English", audio: BED[3], blurb: "Parish SACCOs take callers’ questions." },
    { id: "e12", show: "youth", title: "Youth Now: AFCON jobs", date: "2026-08-13", duration: "21:40", lang: "English", audio: BED[0], blurb: "Hoima and stadium opportunities." }
  ];

  function uid() { return "p" + Math.random().toString(36).slice(2, 9); }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.episodes)) {
          if (!data.live) data.live = Object.assign({}, DEFAULT_LIVE);
          return data;
        }
      }
    } catch (e) { /* seed */ }
    return { live: Object.assign({}, DEFAULT_LIVE), episodes: SEED_EPISODES.slice() };
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("umc-studio", { detail: data }));
  }

  function showById(id) {
    return SHOWS.find((s) => s.id === id) || SHOWS[0];
  }

  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  const audio = new Audio();
  audio.preload = "metadata";
  let now = null;

  function setPlayLabel(el, paused) {
    if (!el) return;
    el.textContent = paused ? "▶" : "❚❚";
  }

  function playItem(item) {
    now = item;
    audio.src = item.audio;
    audio.play().catch(() => {});
    renderDock();
    document.querySelectorAll(".ep-card").forEach((r) => {
      r.classList.toggle("is-playing", r.getAttribute("data-id") === item.id);
    });
    document.getElementById("live-stage")?.classList.toggle("is-live", !!item.live);
    setPlayLabel(document.getElementById("live-listen"), !(item.live && !audio.paused));
  }

  function playLive() {
    const live = load().live || DEFAULT_LIVE;
    const show = showById(live.show);
    if (now && now.live && !audio.paused) {
      audio.pause();
      return;
    }
    playItem({ id: "live", ...live, cover: live.cover || show.cover, live: true });
  }

  function togglePlay() {
    if (!audio.src) {
      playLive();
      return;
    }
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  function renderDock() {
    const dock = document.getElementById("pod-dock");
    if (!dock || !now) return;
    dock.classList.add("on");
    const show = showById(now.show);
    dock.querySelector("[data-dock-art]").src = now.cover || show.cover;
    dock.querySelector("[data-dock-title]").textContent = now.title;
    dock.querySelector("[data-dock-sub]").textContent = (now.live ? "LIVE PRESS BRIEFING · " : "") + show.name;
    setPlayLabel(dock.querySelector("[data-dock-play]"), audio.paused);
    setPlayLabel(document.getElementById("live-listen"), !(now.live) || audio.paused);
  }

  audio.addEventListener("timeupdate", () => {
    const seek = document.getElementById("pod-seek");
    const tEl = document.getElementById("pod-time");
    if (seek && audio.duration) seek.value = String((audio.currentTime / audio.duration) * 100);
    if (tEl) tEl.textContent = fmtTime(audio.currentTime) + " / " + fmtTime(audio.duration || 0);
    setPlayLabel(document.querySelector("[data-dock-play]"), audio.paused);
    if (now && now.live) setPlayLabel(document.getElementById("live-listen"), audio.paused);
  });
  audio.addEventListener("play", renderDock);
  audio.addEventListener("pause", renderDock);

  function paintPublic() {
    const data = load();
    const stage = document.getElementById("live-stage");
    if (!stage) return;
    const live = data.live || DEFAULT_LIVE;
    const show = showById(live.show);
    stage.classList.add("is-live");
    stage.querySelector("[data-live-art]").src = live.cover || show.cover;
    const badge = stage.querySelector("[data-live-badge]");
    if (badge) badge.innerHTML = "<i></i> Live press briefing";
    stage.querySelector("[data-live-kicker]").textContent = show.name + " · " + (live.lang || "English");
    stage.querySelector("[data-live-title]").textContent = live.title || "Live press briefing";
    stage.querySelector("[data-live-blurb]").textContent = live.blurb || ("On air with " + (live.host || show.host));
    stage.querySelector("[data-live-host]").textContent = "Host · " + (live.host || show.host);
    const strip = document.querySelector("[data-strip-title]");
    if (strip) strip.textContent = (live.title || "Live press briefing") + " — " + (live.host || show.host);

    const rail = document.getElementById("show-rail");
    if (rail && !rail.dataset.ready) {
      rail.dataset.ready = "1";
      rail.innerHTML = `<button class="on" data-show="all" type="button">All shows</button>` +
        SHOWS.map((s) => `<button data-show="${s.id}" type="button">${s.name}</button>`).join("");
      rail.addEventListener("click", (e) => {
        const b = e.target.closest("[data-show]");
        if (!b) return;
        rail.querySelectorAll("button").forEach((c) => c.classList.toggle("on", c === b));
        renderEps(b.getAttribute("data-show"));
      });
    }
    renderEps(document.querySelector("#show-rail button.on")?.getAttribute("data-show") || "all");
  }

  function renderEps(filter) {
    const data = load();
    const list = document.getElementById("ep-list");
    if (!list) return;
    const rows = data.episodes.filter((e) => filter === "all" || e.show === filter);
    list.innerHTML = rows.map((e) => {
      const show = showById(e.show);
      return `<button class="ep-card" type="button" data-id="${e.id}">
        <div class="ep-cover">
          <img src="${e.cover || show.cover}" alt="">
          <span class="play-xl" aria-hidden="true">▶</span>
        </div>
        <div class="txt">
          <small>${show.name}</small>
          <h3>${e.title}</h3>
          <p>${e.duration} · ${e.lang} · ${e.date}</p>
        </div>
      </button>`;
    }).join("") || `<p class="muted">No episodes in this show yet.</p>`;
    list.querySelectorAll(".ep-card").forEach((row) => {
      row.addEventListener("click", () => {
        const ep = load().episodes.find((x) => x.id === row.getAttribute("data-id"));
        if (!ep) return;
        const show = showById(ep.show);
        playItem({ ...ep, cover: ep.cover || show.cover, live: false });
      });
    });
  }

  function initPublic() {
    paintPublic();
    document.getElementById("live-listen")?.addEventListener("click", (e) => { e.stopPropagation(); playLive(); });
    document.getElementById("live-listen-2")?.addEventListener("click", playLive);
    document.querySelector("[data-dock-play]")?.addEventListener("click", togglePlay);
    document.getElementById("pod-seek")?.addEventListener("input", (e) => {
      if (audio.duration) audio.currentTime = (Number(e.target.value) / 100) * audio.duration;
    });
    window.addEventListener("storage", (ev) => { if (ev.key === KEY) paintPublic(); });
    window.addEventListener("umc-studio", paintPublic);
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2800);
  }

  function initAdmin() {
    const showSel = document.getElementById("live-show");
    if (showSel) showSel.innerHTML = SHOWS.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    const epShow = document.getElementById("ep-show");
    if (epShow) epShow.innerHTML = SHOWS.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");

    document.getElementById("go-live")?.addEventListener("click", () => {
      const show = document.getElementById("live-show").value;
      const s = showById(show);
      const data = load();
      data.live = {
        show,
        title: document.getElementById("live-title").value.trim() || "Live press briefing",
        host: document.getElementById("live-host").value.trim() || s.host,
        blurb: document.getElementById("live-blurb").value.trim(),
        lang: document.getElementById("live-lang").value,
        audio: document.getElementById("live-audio").value.trim() || BED[0],
        cover: s.cover,
        started: new Date().toISOString()
      };
      save(data);
      paintAdmin();
      toast("Live press briefing is on air.");
    });

    document.getElementById("end-live")?.addEventListener("click", () => {
      const data = load();
      if (!data.live) return toast("Nothing is live");
      const live = data.live;
      if (document.getElementById("archive-live")?.checked) {
        data.episodes.unshift({
          id: uid(),
          show: live.show,
          title: live.title,
          date: new Date().toISOString().slice(0, 10),
          duration: "Live",
          lang: live.lang,
          audio: live.audio,
          cover: live.cover,
          blurb: live.blurb || "Recorded live press briefing."
        });
      }
      data.live = Object.assign({}, DEFAULT_LIVE);
      save(data);
      paintAdmin();
      toast("Session ended. Default briefing restored.");
    });

    document.getElementById("ep-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = load();
      const id = document.getElementById("ep-id").value || uid();
      const show = document.getElementById("ep-show").value;
      const rec = {
        id,
        show,
        title: document.getElementById("ep-title").value.trim(),
        date: document.getElementById("ep-date").value || new Date().toISOString().slice(0, 10),
        duration: document.getElementById("ep-dur").value.trim() || "30:00",
        lang: document.getElementById("ep-lang").value,
        audio: document.getElementById("ep-audio").value.trim() || BED[0],
        blurb: document.getElementById("ep-blurb").value.trim(),
        cover: showById(show).cover
      };
      const i = data.episodes.findIndex((x) => x.id === id);
      if (i >= 0) data.episodes[i] = rec;
      else data.episodes.unshift(rec);
      save(data);
      e.target.reset();
      document.getElementById("ep-id").value = "";
      paintAdmin();
      toast("Episode saved");
    });

    document.getElementById("reset-lib")?.addEventListener("click", () => {
      if (!confirm("Reset the library to the original UMC seed?")) return;
      localStorage.removeItem(KEY);
      paintAdmin();
      toast("Library reset");
    });

    paintAdmin();
  }

  function paintAdmin() {
    const data = load();
    const live = data.live;
    const status = document.getElementById("live-status");
    if (status) {
      status.className = live ? "pill-live" : "pill-off";
      status.textContent = live ? "LIVE · " + live.title : "Off-air";
    }
    if (live) {
      const el = (id) => document.getElementById(id);
      if (el("live-show")) el("live-show").value = live.show;
      if (el("live-title")) el("live-title").value = live.title;
      if (el("live-host")) el("live-host").value = live.host || "";
      if (el("live-blurb")) el("live-blurb").value = live.blurb || "";
      if (el("live-lang")) el("live-lang").value = live.lang || "English";
      if (el("live-audio")) el("live-audio").value = live.audio || "";
    }
    const box = document.getElementById("ep-admin-list");
    if (!box) return;
    box.innerHTML = data.episodes.map((e) => {
      const s = showById(e.show);
      return `<div class="ep-admin" data-id="${e.id}">
        <img src="${e.cover || s.cover}" alt="">
        <div><strong>${e.title}</strong><p class="muted">${s.name} · ${e.date} · ${e.duration}</p></div>
        <div style="display:flex;gap:6px">
          <button class="btn-outline" type="button" data-edit="${e.id}">Edit</button>
          <button class="danger" type="button" data-del="${e.id}">Delete</button>
        </div>
      </div>`;
    }).join("");
    box.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => {
      const ep = load().episodes.find((x) => x.id === b.getAttribute("data-edit"));
      if (!ep) return;
      document.getElementById("ep-id").value = ep.id;
      document.getElementById("ep-show").value = ep.show;
      document.getElementById("ep-title").value = ep.title;
      document.getElementById("ep-date").value = ep.date;
      document.getElementById("ep-dur").value = ep.duration || "";
      document.getElementById("ep-lang").value = ep.lang || "English";
      document.getElementById("ep-audio").value = ep.audio;
      document.getElementById("ep-blurb").value = ep.blurb || "";
      window.scrollTo({ top: document.getElementById("ep-form").offsetTop - 80, behavior: "smooth" });
    }));
    box.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("Delete this episode?")) return;
      const data2 = load();
      data2.episodes = data2.episodes.filter((x) => x.id !== b.getAttribute("data-del"));
      save(data2);
      paintAdmin();
    }));
  }

  const page = document.body.getAttribute("data-page");
  if (page === "radio") initPublic();
  if (page === "studio") initAdmin();
})();
