(function () {
  const LANGS = [
    { id: "en", name: "English", native: "English", region: "official", code: "en" },
    { id: "sw", name: "Kiswahili", native: "Kiswahili", region: "official", code: "sw" },
    { id: "lg", name: "Luganda", native: "Oluganda", region: "central", code: "lg" },
    { id: "xog", name: "Lusoga", native: "Lusoga", region: "central", code: "lg" },
    { id: "gwr", name: "Lugwere", native: "Lugwere", region: "central", code: "lg" },
    { id: "nuj", name: "Lunyole", native: "Olunyole", region: "central", code: "lg" },
    { id: "lsm", name: "Lusamia", native: "Olusamia", region: "central", code: "lg" },
    { id: "lke", name: "Lukenyi", native: "Olukenyi", region: "central", code: "lg" },
    { id: "nyn", name: "Runyankore", native: "Runyankore", region: "western", code: "rw" },
    { id: "cgg", name: "Rukiga", native: "Rukiga", region: "western", code: "rw" },
    { id: "nyo", name: "Runyoro", native: "Runyoro", region: "western", code: "rw" },
    { id: "ttj", name: "Rutooro", native: "Rutooro", region: "western", code: "rw" },
    { id: "koo", name: "Lhukonzo", native: "Rukonjo", region: "western", code: "rw" },
    { id: "kin", name: "Rufumbira", native: "Rufumbira", region: "western", code: "rw" },
    { id: "rwm", name: "Rwamba", native: "Kwamba", region: "western", code: "rw" },
    { id: "ruc", name: "Ruruli", native: "Ruruli", region: "western", code: "rw" },
    { id: "tlz", name: "Lubwisi", native: "Lubwisi", region: "western", code: "rw" },
    { id: "nla", name: "Lusongora", native: "Lusongora", region: "western", code: "rw" },
    { id: "teo", name: "Ateso", native: "Ateso", region: "eastern", code: "en" },
    { id: "myx", name: "Lumasaba", native: "Lugisu", region: "eastern", code: "lg" },
    { id: "kpz", name: "Kupsabiny", native: "Sebei", region: "eastern", code: "en" },
    { id: "adh", name: "Dhopadhola", native: "Japadhola", region: "eastern", code: "en" },
    { id: "kdi", name: "Kumam", native: "Kumam", region: "eastern", code: "en" },
    { id: "laj", name: "Leb Lango", native: "Lëblaŋo", region: "northern", code: "en" },
    { id: "ach", name: "Leb Acholi", native: "Leb Acholi", region: "northern", code: "en" },
    { id: "alz", name: "Alur", native: "Dho Alur", region: "westnile", code: "en" },
    { id: "kdj", name: "Ngakarimojong", native: "ŋaKarimojoŋ", region: "karamoja", code: "en" },
    { id: "pko", name: "Pökoot", native: "Pökoot", region: "karamoja", code: "en" },
    { id: "kdj-jie", name: "Jie", native: "ŋaJie", region: "karamoja", code: "en" },
    { id: "kdj-dod", name: "Dodoth", native: "ŋaDodoth", region: "karamoja", code: "en" },
    { id: "ikx", name: "Ik", native: "Icé-tód", region: "karamoja", code: "en" },
    { id: "soo", name: "Tepeth", native: "Soo", region: "karamoja", code: "en" },
    { id: "lgg", name: "Lugbara", native: "Lugbarati", region: "westnile", code: "en" },
    { id: "snm", name: "Ma’di", native: "Ma’di", region: "westnile", code: "en" },
    { id: "keo", name: "Kakwa", native: "Kakwa", region: "westnile", code: "en" },
    { id: "luc", name: "Aringa", native: "Aringa", region: "westnile", code: "en" },
    { id: "kbo", name: "Keliko", native: "Keliko", region: "westnile", code: "en" },
    { id: "kiv", name: "Kinubi", native: "Kinubi", region: "westnile", code: "ar" },
    { id: "kku", name: "Kuku", native: "Kuku", region: "westnile", code: "en" },
    { id: "laj-lab", name: "Labwor", native: "Labwor", region: "northern", code: "en" },
    { id: "cgg-hor", name: "Hororo", native: "Ruhororo", region: "western", code: "rw" }
  ];

  const REGIONS = {
    official: "Official",
    central: "Central",
    western: "Western",
    eastern: "Eastern",
    northern: "Northern",
    westnile: "West Nile",
    karamoja: "Karamoja"
  };

  const PROVERBS = [
    { q: "Umoja ni nguvu, utengano ni udhaifu.", en: "Unity is strength, division is weakness.", lang: "Kiswahili" },
    { q: "Gavumenti emu, eddoboozi limu.", en: "One government, one voice.", lang: "Luganda" },
    { q: "For God and my Country.", en: "The national motto of the Republic.", lang: "English" },
    { q: "Agali awamu, ge galuma ennyama.", en: "Teeth that stay together are the ones that chew the meat.", lang: "Luganda" },
    { q: "Haraka haraka haina baraka.", en: "Hurry hurry has no blessing.", lang: "Kiswahili" }
  ];

  const GLOSSARY = [
    ["Mwananchi", "Citizen"], ["Katiba", "Constitution"], ["Maendeleo", "Development"],
    ["Uchaguzi", "Election"], ["Serikali", "Government"], ["Bunge", "Parliament"],
    ["Amani", "Peace"], ["Huduma", "Service"], ["Kodi", "Tax"],
    ["Elimu", "Education"], ["Afya", "Health"], ["Haki", "Justice"],
    ["Gavumenti", "Government (Luganda)"], ["Eggwanga", "Nation"]
  ];

  function byId(id) { return LANGS.find((l) => l.id === id); }

  function fillSelects() {
    const from = document.getElementById("lang-from");
    const to = document.getElementById("lang-to");
    if (!from || !to) return;
    const opts = LANGS.map((l) => `<option value="${l.id}">${l.name} — ${l.native}</option>`).join("");
    from.innerHTML = `<option value="auto">Detect language</option>` + opts;
    to.innerHTML = opts;
    from.value = "en";
    to.value = "sw";
  }

  function renderMosaic(region) {
    const box = document.getElementById("lang-mosaic");
    if (!box) return;
    const rows = LANGS.filter((l) => region === "all" || l.region === region);
    const count = document.getElementById("lang-count");
    if (count) count.textContent = String(rows.length);
    box.innerHTML = rows.map((l) => `<button class="lang-tile" type="button" data-lang="${l.id}">
      <small>${REGIONS[l.region]}</small>
      <strong>${l.name}</strong>
      <span>${l.native}</span>
    </button>`).join("");
    box.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const to = document.getElementById("lang-to");
        if (to) to.value = btn.getAttribute("data-lang");
        document.getElementById("translator")?.scrollIntoView({ behavior: "smooth", block: "start" });
        box.querySelectorAll(".lang-tile").forEach((t) => t.classList.toggle("on", t === btn));
      });
    });
  }

  async function googleTranslate(text, sl, tl) {
    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
      encodeURIComponent(sl) + "&tl=" + encodeURIComponent(tl) + "&dt=t&q=" + encodeURIComponent(text);
    const res = await fetch(url);
    if (!res.ok) throw new Error("gtx");
    const data = await res.json();
    return (data[0] || []).map((row) => row[0]).join("");
  }

  async function memoryTranslate(text, sl, tl) {
    const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text.slice(0, 500)) +
      "&langpair=" + encodeURIComponent(sl) + "|" + encodeURIComponent(tl);
    const res = await fetch(url);
    if (!res.ok) throw new Error("memory");
    const data = await res.json();
    const t = data && data.responseData && data.responseData.translatedText;
    if (!t) throw new Error("empty");
    return t;
  }

  function engineCode(lang) {
    if (!lang) return "en";
    if (lang.id === "en" || lang.id === "sw" || lang.id === "lg") return lang.code;
    if (lang.code === "rw" || lang.code === "ar") return lang.code;
    return "sw";
  }

  async function translateText(text, fromId, toId) {
    const from = fromId === "auto" ? { id: "auto", code: "auto" } : byId(fromId);
    const to = byId(toId);
    if (!to) throw new Error("language");
    const sl = from.code || "auto";
    const tl = engineCode(to);
    const note = (tl !== to.code || (to.code === "en" && to.id !== "en"))
      ? to.name + " is verified by the Languages Desk. First pass in the closest live engine:"
      : "";
    const run = async (a, b) => {
      try { return await googleTranslate(text, a, b); }
      catch (e) { return await memoryTranslate(text, a === "auto" ? "en" : a, b); }
    };
    try {
      const result = await run(sl, tl);
      return { text: result, note };
    } catch (e2) {
      if (sl !== "en" && tl !== "en") {
        const mid = await googleTranslate(text, sl, "en");
        const result = await googleTranslate(mid, "en", tl);
        return { text: result, note };
      }
      throw e2;
    }
  }

  function setStatus(msg) {
    const el = document.getElementById("xlate-status");
    if (el) el.textContent = msg;
  }

  async function runTranslate() {
    const src = document.getElementById("xlate-src");
    const out = document.getElementById("xlate-out");
    const from = document.getElementById("lang-from");
    const to = document.getElementById("lang-to");
    const text = (src.value || "").trim();
    if (!text) {
      out.textContent = "Type something first.";
      return;
    }
    if (text.length > 4500) {
      out.textContent = "Please keep text under 4,500 characters.";
      return;
    }
    out.textContent = "Translating…";
    setStatus("Working…");
    try {
      const result = await translateText(text, from.value, to.value);
      out.textContent = (result.note ? result.note + "\n\n" : "") + (result.text || "No translation returned.");
      const dest = byId(to.value);
      setStatus("Done · " + (dest ? dest.name : ""));
    } catch (err) {
      out.textContent = "Translation is taking a moment. Try English ↔ Kiswahili, or email kiswahili@mediacentre.go.ug for a human officer.";
      setStatus("Desk fallback");
    }
  }

  function init() {
    if (document.body.getAttribute("data-page") !== "languages") return;
    fillSelects();
    renderMosaic("all");
    const n = document.querySelector(".lang-strip-count b");
    if (n) n.textContent = String(LANGS.length);
    document.getElementById("region-pills")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-region]");
      if (!b) return;
      document.querySelectorAll("#region-pills button").forEach((x) => x.classList.toggle("on", x === b));
      renderMosaic(b.getAttribute("data-region"));
    });
    document.getElementById("xlate-go")?.addEventListener("click", runTranslate);
    document.getElementById("xlate-swap")?.addEventListener("click", () => {
      const from = document.getElementById("lang-from");
      const to = document.getElementById("lang-to");
      const src = document.getElementById("xlate-src");
      const out = document.getElementById("xlate-out");
      if (from.value === "auto") { from.value = to.value; return; }
      const a = from.value;
      from.value = to.value;
      to.value = a;
      const t = src.value;
      src.value = out.textContent === "Translation will appear here." ? "" : out.textContent;
      out.textContent = t || "Translation will appear here.";
    });
    document.getElementById("xlate-copy")?.addEventListener("click", async () => {
      const out = document.getElementById("xlate-out");
      try {
        await navigator.clipboard.writeText(out.textContent || "");
        setStatus("Copied");
      } catch (e) { setStatus("Copy failed"); }
    });
    document.getElementById("xlate-speak")?.addEventListener("click", () => {
      const out = document.getElementById("xlate-out");
      const to = byId(document.getElementById("lang-to").value);
      const u = new SpeechSynthesisUtterance(out.textContent || "");
      u.lang = to && to.code === "sw" ? "sw-KE" : "en-GB";
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    });
    const p = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
    const pq = document.getElementById("proverb-q");
    const pe = document.getElementById("proverb-en");
    if (pq) pq.textContent = p.q;
    if (pe) pe.textContent = p.en + " · " + p.lang;
    const g = document.getElementById("glossary");
    if (g) {
      g.innerHTML = GLOSSARY.map(([a, b]) => `<button type="button"><b>${a}</b><span>${b}</span></button>`).join("");
      g.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        try {
          await navigator.clipboard.writeText(btn.querySelector("b").textContent);
          setStatus("Copied " + btn.querySelector("b").textContent);
        } catch (err) { /* ignore */ }
      });
    }
    document.getElementById("xlate-src").value = "Government commits to delivering free quality education for every Ugandan child by 2027.";
  }

  init();
})();
