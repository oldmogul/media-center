(function () {
  if (document.body.getAttribute("data-page") !== "engagement") return;

  const COPY = {
    en: {
      hello: "Hello, I'm UGov Assistant. I can help you find government services, report problems, and route your concerns to the right ministry. What can I help with today?",
      chips: ["How do I apply for a national ID?", "There is no clean water in my village", "When are UCE results released?", "How do I report a corrupt official?"],
      ph: "How do I apply for a national ID?",
      id: "Apply for a National ID at NIRA (nira.go.ug) with a birth certificate or passport. Lost cards are replaced at NIRA offices. The Cabinet has also adopted NIN as the Tax Identification Number — URA records will use the same number.",
      water: "Report dry taps and broken boreholes to the Ministry of Water and Environment or your district water office. For a village with no clean water, file feedback here and we will route it to Water and the local government.",
      uce: "UCE and other UNEB results are announced by the Ministry of Education and Sports. Watch the Press Room live briefing and check education.go.ug. Typical release follows the marking calendar each year.",
      corrupt: "Report corruption on the toll-free anti-corruption line 0800 100 227, or to the Inspectorate of Government. You can also file feedback on this page — it is not linked to your identity.",
      pass: "Passports are issued by the Directorate of Citizenship and Immigration. Start at visas.immigration.go.ug. Carry your National ID to the appointment.",
      pdm: "The Parish Development Model is coordinated by the Office of the Prime Minister. Ask your parish SACCO or LC1 about the current cycle. Citizen Line on UMC Radio also takes PDM questions.",
      health: "For health emergencies call 0800 100 066 (toll-free). Ebola 2026 is declared over after 42 days with no new cases. Stay vigilant and use the nearest health facility.",
      tax: "URA taxes are paid at ura.go.ug. Cabinet adopted NIN as TIN, so your National ID number is becoming the standard tax ID.",
      afcon: "AFCON PAMOJA 2027 is nine months out. LOC briefings are in the Press Room. Training facilities are funded at Shs 135.7 billion.",
      fallback: "I will route that to the right ministry. You can also file feedback on this page, or call the helplines on the right. Try asking about IDs, water, exams, taxes or corruption."
    },
    lg: {
      hello: "Nze UGov Assistant. Nsobola okukulagirira ku buweereza bwa Gavumenti, okutegeeza ebizibu, n’okutumira minisitule. Nkuyambe otya leero?",
      chips: ["Nfunye NIN ntya?", "Tewali mazzi malungi mu kyalo kyaffe", "UCE evaateebwa ddi?", "Ntegeeza atya omukozi ayaaya?"],
      ph: "Nfunye NIN ntya?",
      id: "Okufuna ekkalaamu y’eggwanga kola ku NIRA (nira.go.ug) n’olupapula lw’amazaalibwa. Kabineeti ekkirizza NIN okukozesebwa nga TIN ku URA.",
      water: "Amazzi agakamye wategeeza Minisitule y’Amazzi n’obutonde, oba akakiiko k’essaza. Osobola n’okuwaayo obubaka wano.",
      uce: "Ebyavaamu bya UCE bireetebwa Minisitule y’Ebyenjigiriza. Kebera Press Room n’omuko gwa education.go.ug.",
      corrupt: "Obulyazamaanyi wategeeza ku ssimu ya bwereere 0800 100 227. Obubaka wano tebukwataganyizibwa na ggwe.",
      pass: "Passipooti zaavako ku Immigration. Tandika ku visas.immigration.go.ug. Twala NIN.",
      pdm: "PDM ekulemberwa Ofisi ya Palamenti. Buuza SACCO y’omuluka oba LC1.",
      health: "Obulamu: 0800 100 066. Ebola 2026 eggwaawo. Weewale n’okugenda mu ddwaliro eriri okumpi.",
      tax: "Emisolo gya URA ku ura.go.ug. NIN kati ye TIN.",
      afcon: "AFCON 2027 ekyali emyezi mwenda. Amawulire gali mu Press Room.",
      fallback: "Njja kutuukiriza minisitule. Gezaako okubuuza ku NIN, amazzi, UCE, emisolo oba obulyazamaanyi."
    },
    sw: {
      hello: "Mimi ni UGov Assistant. Ninaweza kukuonyesha huduma za Serikali, kuripoti tatizo, na kuelekeza wizara. Nikusaidie nini leo?",
      chips: ["Nitaomba kitambulisho cha taifa vipi?", "Hakuna maji safi kijijini", "Matokeo ya UCE yatolewa lini?", "Nitaripoti rushwa vipi?"],
      ph: "Nitaomba kitambulisho cha taifa vipi?",
      id: "Omba kitambulisho cha taifa katika NIRA (nira.go.ug) na cheti cha kuzaliwa. Baraza la Mawaziri limekubali NIN kama TIN kwa URA.",
      water: "Ripoti maji yaliyokauka kwa Wizara ya Maji na Mazingira au ofisi ya wilaya. Unaweza kutuma ujumbe hapa.",
      uce: "Matokeo ya UCE yatangazwa na Wizara ya Elimu. Angalia Press Room na education.go.ug.",
      corrupt: "Ripoti rushwa kwa simu ya bure 0800 100 227. Ujumbe hapa hauhusiani na utambulisho wako.",
      pass: "Pasipoti hutolewa na Uhamiaji. Anza visas.immigration.go.ug. Bebe NIN.",
      pdm: "PDM inaratibiwa na Ofisi ya Waziri Mkuu. Uliza SACCO ya parish au LC1.",
      health: "Afya: 0800 100 066. Ebola 2026 imeisha. Endelea kuwa macho.",
      tax: "Kodi za URA katika ura.go.ug. NIN sasa ni TIN.",
      afcon: "AFCON 2027 imeondoka miezi tisa. Taarifa zipo kwenye Press Room.",
      fallback: "Nitaelekeza wizara husika. Jaribu kuuliza kuhusu NIN, maji, mitihani, kodi au rushwa."
    }
  };

  let lang = "en";

  function replyFor(q) {
    const t = q.toLowerCase();
    const c = COPY[lang];
    if (/id|nin|nira|kitambulisho|kkalaamu|national/.test(t)) return c.id;
    if (/water|maji|mazzi|borehole|tap/.test(t)) return c.water;
    if (/uce|uneb|result|exam|ssoma/.test(t)) return c.uce;
    if (/corrupt|rushwa|bulyazamaanyi|ig/.test(t)) return c.corrupt;
    if (/passport|passipooti|pasipoti|immigration/.test(t)) return c.pass;
    if (/\bpdm\b|sacco|parish/.test(t)) return c.pdm;
    if (/ebola|health|afya|obulamu|hospital/.test(t)) return c.health;
    if (/tax|tin|ura|kodi|emisolo/.test(t)) return c.tax;
    if (/afcon|stadium|hoima/.test(t)) return c.afcon;
    return c.fallback;
  }

  function bubble(html, who) {
    const el = document.createElement("div");
    el.className = "ugov-msg " + who;
    el.innerHTML = html;
    return el;
  }

  const thread = document.getElementById("chat-thread");
  const chips = document.getElementById("ask-chips");
  const input = document.getElementById("chat-q");

  function greet() {
    if (!thread) return;
    thread.innerHTML = "";
    thread.appendChild(bubble(COPY[lang].hello, "bot"));
    chips.innerHTML = COPY[lang].chips.map((q) => `<button type="button">${q}</button>`).join("");
    input.placeholder = COPY[lang].ph;
    thread.scrollTop = thread.scrollHeight;
  }

  function ask(text) {
    if (!text.trim()) return;
    thread.appendChild(bubble(text, "me"));
    const wait = bubble("…", "bot");
    thread.appendChild(wait);
    thread.scrollTop = thread.scrollHeight;
    setTimeout(() => {
      wait.innerHTML = replyFor(text);
      thread.scrollTop = thread.scrollHeight;
    }, 420);
  }

  greet();
  document.getElementById("chat-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    ask(v);
  });
  chips?.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) ask(b.textContent);
  });
  document.getElementById("chat-langs")?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-chat-lang]");
    if (!b) return;
    lang = b.getAttribute("data-chat-lang");
    document.querySelectorAll("#chat-langs button").forEach((x) => x.classList.toggle("on", x === b));
    greet();
  });

  const POLLS = [
    { id: "p1", q: "Is the NIN-as-TIN Cabinet decision clear to you?", opts: ["Yes, I understand", "I need a briefing", "Not yet"] },
    { id: "p2", q: "How do you prefer to receive government news?", opts: ["Radio", "Press Room", "Languages Desk"] },
    { id: "p3", q: "Should AFCON 2027 training facilities be ready by December 2026?", opts: ["Yes", "Need more time", "Not sure"] }
  ];

  function pollState() {
    try { return JSON.parse(localStorage.getItem("umc-polls") || "{}"); }
    catch (e) { return {}; }
  }
  function savePolls(s) { localStorage.setItem("umc-polls", JSON.stringify(s)); }

  function renderPolls() {
    const box = document.getElementById("poll-grid");
    if (!box) return;
    const st = pollState();
    box.innerHTML = POLLS.map((p) => {
      const votes = st[p.id] || p.opts.map(() => 0);
      const mine = st["pick-" + p.id];
      const total = votes.reduce((a, b) => a + b, 0) || 1;
      return `<article class="poll-card">
        <p class="kicker-off">Live poll</p>
        <h3>${p.q}</h3>
        ${p.opts.map((o, i) => {
          const pct = Math.round((votes[i] / total) * 100);
          return `<button class="poll-opt ${mine === i ? "on" : ""}" type="button" data-poll="${p.id}" data-i="${i}">
            <span>${o}</span><b>${pct}%</b>
            <i style="width:${pct}%"></i>
          </button>`;
        }).join("")}
        <p class="muted">${votes.reduce((a, b) => a + b, 0)} votes</p>
      </article>`;
    }).join("");
  }

  document.getElementById("poll-grid")?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-poll]");
    if (!b) return;
    const id = b.getAttribute("data-poll");
    const i = Number(b.getAttribute("data-i"));
    const st = pollState();
    if (st["pick-" + id] != null) return;
    const poll = POLLS.find((p) => p.id === id);
    st[id] = st[id] || poll.opts.map(() => 0);
    st[id][i] += 1;
    st["pick-" + id] = i;
    savePolls(st);
    renderPolls();
  });
  renderPolls();
})();
