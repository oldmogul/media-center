(function () {
  const XAI = {
    endpoint: "https://api.x.ai/v1/chat/completions",
    model: "grok-4.5",
    key: (typeof localStorage !== "undefined" && localStorage.getItem("umc-xai-key")) || "test-key"
  };

  const WA = {
    numbers: ["+256 312 261 525", "+256 414 254 461", "+256 414 237 141"],
    href: "https://wa.me/256312261525?text=" + encodeURIComponent("Hello Uganda Media Centre, I have a question the chatbot could not confirm.")
  };

  const SYSTEM = "You are UGov, the official chatbot of the Uganda Media Centre. You are trained on Ugandan government affairs (ministries, NIRA IDs, passports, URA taxes, PDM, UNEB, health lines, press, languages, radio) and you may also answer ordinary general questions briefly and helpfully. Keep replies short (under 90 words). Official, clear tone. If the user has a personal legal, land, court or medical-diagnosis case, do not guess — tell them to WhatsApp the Uganda Media Centre on +256 312 261 525, +256 414 254 461 or +256 414 237 141.";

  type CopyLang = "en" | "lg" | "sw";

  const UI = {
    en: {
      fab: "Chat",
      title: "UGov chatbot",
      sub: "Ugandan affairs · live",
      ph: "Ask about IDs, ministries, taxes…",
      hello: "I’m <b>UGov</b>, the Media Centre chatbot. Ask about government services — or anything else. Personal legal or land cases go to WhatsApp.",
      chips: ["National ID?", "Emergency numbers?"],
      wa: "That’s a detailed case I shouldn’t guess on. WhatsApp the Uganda Media Centre and an officer will take it from here.",
      waBtn: "WhatsApp the desk"
    },
    lg: {
      fab: "Yogera",
      title: "UGov chatbot",
      sub: "Ebya Uganda · Media Centre",
      ph: "Buuza ku NIN, minisitule, emisolo…",
      hello: "Nze <b>UGov</b>, chatbot eya Media Centre. Buuza ku Gavumenti — oba ekirala. Ebyamateeka by’ettaka bijja ku WhatsApp.",
      chips: ["NIN?", "Amangu?"],
      wa: "Kino kya wala okunnyonnyola wano. WhatsApp Uganda Media Centre, omukozi ajja kukuwuliriza.",
      waBtn: "WhatsApp ku ddeesike"
    },
    sw: {
      fab: "Chat",
      title: "UGov chatbot",
      sub: "Mambo ya Uganda · Media Centre",
      ph: "Uliza kuhusu vitambulisho, wizara…",
      hello: "Mimi ni <b>UGov</b>, chatbot wa Media Centre. Uliza kuhusu serikali — au kitu kingine. Kesi za ardhi na sheria: WhatsApp.",
      chips: ["Kitambulisho?", "Simu za dharura?"],
      wa: "Hili ni suala la kina nisiweze kukisia. WhatsApp Uganda Media Centre, afisa atakushughulikia.",
      waBtn: "WhatsApp dawati"
    }
  };

  const FACTS: { re: RegExp; en: string; lg: string; sw: string }[] = [
    { re: /\b(id|nin|nira|kitambulisho|kkalaamu|national id)\b/i, en: "Apply for a National ID at NIRA (nira.go.ug) with a birth certificate or passport. Lost cards are replaced at NIRA offices. Cabinet adopted NIN as the Tax Identification Number, so URA records use the same number.", lg: "Okufuna ekkalaamu y’eggwanga kola ku NIRA (nira.go.ug) n’olupapula lw’amazaalibwa. Kabineeti ekkirizza NIN okukozesebwa nga TIN ku URA.", sw: "Omba kitambulisho cha taifa katika NIRA (nira.go.ug) na cheti cha kuzaliwa. Baraza la Mawaziri limekubali NIN kama TIN kwa URA." },
    { re: /\b(passport|passipooti|pasipoti|immigration|visa)\b/i, en: "Passports are issued by the Directorate of Citizenship and Immigration. Start at visas.immigration.go.ug and carry your National ID to the appointment.", lg: "Passipooti zaavako ku Immigration. Tandika ku visas.immigration.go.ug. Twala NIN.", sw: "Pasipoti hutolewa na Uhamiaji. Anza visas.immigration.go.ug. Bebe NIN." },
    { re: /\b(water|maji|mazzi|borehole|tap)\b/i, en: "Report dry taps and broken boreholes to the Ministry of Water and Environment or your district water office. You can also file feedback on the Engagement page.", lg: "Amazzi agakamye wategeeza Minisitule y’Amazzi n’obutonde, oba akakiiko k’essaza.", sw: "Ripoti maji yaliyokauka kwa Wizara ya Maji na Mazingira au ofisi ya wilaya." },
    { re: /\b(uce|uneb|exam|result|ssoma|matokeo)\b/i, en: "UCE and other UNEB results are announced by the Ministry of Education and Sports. Watch the Press Room briefing and check education.go.ug. Release follows the marking calendar each year.", lg: "Ebyavaamu bya UCE bireetebwa Minisitule y’Ebyenjigiriza. Kebera Press Room n’omuko gwa education.go.ug.", sw: "Matokeo ya UCE yatangazwa na Wizara ya Elimu. Angalia Press Room na education.go.ug." },
    { re: /\b(corrupt|rushwa|bulyazamaanyi|ig|integrity)\b/i, en: "Report corruption on the toll-free anti-corruption line 0800 100 227, or to the Inspectorate of Government. Feedback on this site is not linked to your identity.", lg: "Obulyazamaanyi wategeeza ku ssimu ya bwereere 0800 100 227.", sw: "Ripoti rushwa kwa simu ya bure 0800 100 227." },
    { re: /\b(pdm|sacco|parish development)\b/i, en: "The Parish Development Model is coordinated by the Office of the Prime Minister. Ask your parish SACCO or LC1 about the current cycle. Citizen Line on UMC Radio also takes PDM questions.", lg: "PDM ekulemberwa Ofisi ya Palamenti. Buuza SACCO y’omuluka oba LC1.", sw: "PDM inaratibiwa na Ofisi ya Waziri Mkuu. Uliza SACCO ya parish au LC1." },
    { re: /\b(ebola|health|afya|obulamu|hospital|ambulance)\b/i, en: "Health emergencies: 0800 100 066 (toll-free). The 2026 Ebola outbreak was declared over after 42 days with no new cases. Use the nearest health facility for symptoms.", lg: "Obulamu: 0800 100 066. Ebola 2026 eggwaawo. Genda mu ddwaliro eriri okumpi.", sw: "Afya: 0800 100 066. Ebola 2026 imeisha. Tumia kituo cha afya kilicho karibu." },
    { re: /\b(tax|tin|ura|kodi|emisolo)\b/i, en: "URA taxes are paid at ura.go.ug. Cabinet adopted NIN as TIN, so your National ID number is becoming the standard tax ID.", lg: "Emisolo gya URA ku ura.go.ug. NIN kati ye TIN.", sw: "Kodi za URA katika ura.go.ug. NIN sasa ni TIN." },
    { re: /\b(afcon|stadium|hoima|pamoja)\b/i, en: "AFCON PAMOJA 2027 is co-hosted by Kenya, Tanzania and Uganda, with kick-off in June 2027. LOC briefings are in the Press Room. Training facilities are funded at Shs 135.7 billion.", lg: "AFCON 2027 ekyali emyezi mwenda. Amawulire gali mu Press Room.", sw: "AFCON 2027 imeondoka miezi tisa. Taarifa zipo kwenye Press Room." },
    { re: /\b(emergenc|police|999|112|gbv|116)\b/i, en: "Emergency helplines: Police 999 / 112 · GBV and child protection 116 · Health 0800 100 066 · Anti-corruption 0800 100 227.", lg: "Amangu: Poliisi 999 / 112 · GBV 116 · Obulamu 0800 100 066 · Obulyazamaanyi 0800 100 227.", sw: "Dharura: Polisi 999 / 112 · GBV 116 · Afya 0800 100 066 · Rushwa 0800 100 227." },
    { re: /\b(media centre|mediacentre|umc|what do you do|what does the)\b/i, en: "The Uganda Media Centre is the official communications command centre of the Government of Uganda. We brief the press, publish releases, accredit journalists, translate government messages, and run UMC Radio — One Government, one voice.", lg: "Uganda Media Centre y’ekifo ky’amawulire ekya Gavumenti ya Uganda — okunnyonnyola, obubaka, okukkiriza abamawulire n’olulimi.", sw: "Uganda Media Centre ni kituo rasmi cha mawasiliano ya Serikali ya Uganda — taarifa, uidhinishaji wa waandishi na redio." },
    { re: /\b(accredit|journalist|press card)\b/i, en: "Press accreditation is handled by Uganda Media Centre with the Media Council of Uganda. Apply on the Accreditation page. Local and foreign journalists follow different fee schedules.", lg: "Okukkirizibwa kwa press kukolebwa Uganda Media Centre ne Media Council. Tandika ku lupapula lwa Accreditation.", sw: "Uidhinishaji wa waandishi unashughulikiwa na Uganda Media Centre na Media Council. Omba kwenye ukurasa wa Accreditation." },
    { re: /\b(luganda|kiswahili|language|olulimi|lugha|translate)\b/i, en: "The Languages Desk translates official messages into English, Luganda, Kiswahili and regional languages. Open The Pulse → Languages Desk.", lg: "Olulimi luvvuunula obubaka mu Lungereza, Luganda, Kiswahili n’ennimi z’ewaka. Genda ku The Pulse → Olulimi.", sw: "Dawati la Lugha linatafsiri taarifa rasmi kwa Kiingereza, Luganda, Kiswahili na lugha za mikoa." },
    { re: /\b(radio|leediyo|redio|podcast)\b/i, en: "UMC Radio carries live press briefings and programmes in English, Luganda and Kiswahili. Open The Pulse → Radio.", lg: "Leediyo ya UMC erina okunnyonnyola n’pulogulaamu mu Lungereza, Luganda ne Kiswahili.", sw: "Redio ya UMC inabeba mikutano ya waandishi na vipindi kwa Kiingereza, Luganda na Kiswahili." },
    { re: /\b(minister|ministry|minisitule|wizara)\b/i, en: "Uganda’s ministries sit under the Ministries directory on this site — mandate, leadership, phone and recent releases for each desk.", lg: "Minisitule zonna ziri ku lupapula lwa Ministries — omulimu, akulira, essimu n’obubaka.", sw: "Wizara zote zipo kwenye ukurasa wa Ministries — jukumu, uongozi, simu na taarifa." },
    { re: /\b(kampala|capital|uganda)\b/i, en: "Uganda’s capital is Kampala. The Media Centre sits at Plot 15 Nakasero Hill / Plot 36A Nile Avenue. The Republic’s motto is For God and my Country. Independence: 9 October 1962.", lg: "Ekibuga kya Uganda kye Kampala. Media Centre eri Plot 15 Nakasero Hill. Motto: Ku Katonda n’eggwanga lyange. Okwefuga: 9 October 1962.", sw: "Mji mkuu wa Uganda ni Kampala. Media Centre iko Plot 15 Nakasero Hill. Kauli mbiu: For God and my Country. Uhuru: 9 Oktoba 1962." }
  ];

  const PERSONAL = /\b(my land|my plot|sue|lawyer|court case|my husband|my wife|my child|compensation claim|medical diagnosis)\b/i;

  function lang(): CopyLang {
    const g = window.UMC && window.UMC.getLang && window.UMC.getLang();
    return g === "lg" || g === "sw" ? g : "en";
  }

  function waHtml(L: CopyLang): string {
    const u = UI[L];
    const nums = WA.numbers.map((n) => `<a href="tel:${n.replace(/\s/g, "")}">${n}</a>`).join(" · ");
    return `${u.wa}<br><br><b>WhatsApp / call</b><br>${nums}<br><a class="btn-gold chat-wa" href="${WA.href}" target="_blank" rel="noopener">${u.waBtn}</a>`;
  }

  function localReply(q: string, L: CopyLang): string | null {
    if (PERSONAL.test(q) && !/\b(nira|nin|id|tax|ura|uce|pdm|passport)\b/i.test(q)) return null;
    for (let i = 0; i < FACTS.length; i++) {
      if (FACTS[i].re.test(q)) return FACTS[i][L];
    }
    return null;
  }

  function isComplex(q: string): boolean {
    const words = q.trim().split(/\s+/).length;
    const marks = (q.match(/\?/g) || []).length;
    return words > 36 || marks > 1 || PERSONAL.test(q);
  }

  const history: { role: string; content: string }[] = [];

  async function readAi(res: Response): Promise<string | null> {
    if (!res.ok) return null;
    const data = await res.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return text ? String(text).trim() : null;
  }

  async function modelReply(q: string, L: CopyLang): Promise<string | null> {
    const payload = {
      lang: L,
      messages: history.slice(-8).concat([{ role: "user", content: q }])
    };
    try {
      const local = await fetch("/api/ugov-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const viaProxy = await readAi(local);
      if (viaProxy) return viaProxy;
    } catch (e) { /* proxy not running */ }
    if (!XAI.key || XAI.key === "test-key") return null;
    try {
      const res = await fetch(XAI.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + XAI.key },
        body: JSON.stringify({
          model: XAI.model,
          temperature: 0.4,
          messages: [
            { role: "system", content: SYSTEM + " Reply in " + (L === "lg" ? "Luganda" : L === "sw" ? "Kiswahili" : "English") + "." },
            ...history.slice(-8),
            { role: "user", content: q }
          ]
        })
      });
      return await readAi(res);
    } catch (e) {
      return null;
    }
  }

  async function reply(q: string, L?: CopyLang): Promise<{ html: string; handoff: boolean }> {
    const loc = L || lang();
    if (PERSONAL.test(q) && !/\b(nira|nin|id|tax|ura|uce|pdm|passport)\b/i.test(q)) {
      return { html: waHtml(loc), handoff: true };
    }
    const known = localReply(q, loc);
    if (known && !isComplex(q)) return { html: known, handoff: false };
    const ai = await modelReply(q, loc);
    if (ai) {
      history.push({ role: "user", content: q });
      history.push({ role: "assistant", content: ai });
      return { html: ai.replace(/\n/g, "<br>"), handoff: /whatsapp the uganda media centre|256\s*312\s*261/i.test(ai) };
    }
    if (known) return { html: known, handoff: false };
    return { html: waHtml(loc), handoff: true };
  }

  function bubble(html: string, who: string): HTMLElement {
    const el = document.createElement("div");
    el.className = "ugov-msg " + who;
    el.innerHTML = html;
    return el;
  }

  function mount(rootPath: string) {
    if (document.getElementById("ugov-widget")) return;
    const L = lang();
    const u = UI[L];
    const wrap = document.createElement("div");
    wrap.id = "ugov-widget";
    wrap.innerHTML = `
      <div class="ugov-dock" id="ugov-dock" hidden>
        <div class="ugov-top">
          <div class="chat-brand">
            <span class="chat-ico">UG</span>
            <div>
              <strong>${u.title}</strong>
              <small><i class="live-dot" style="display:inline-block;margin-right:6px"></i>${u.sub}</small>
            </div>
          </div>
          <button type="button" class="ugov-dock-x" id="ugov-close" aria-label="Close chatbot">×</button>
        </div>
        <div class="ugov-thread" id="ugov-thread"></div>
        <div class="ask-chips" id="ugov-chips"></div>
        <form class="ugov-input" id="ugov-form">
          <input id="ugov-q" required placeholder="${u.ph}" autocomplete="off">
          <button class="btn-gold" type="submit">Send</button>
        </form>
      </div>
      <button type="button" class="ugov-fab" id="ugov-fab" aria-controls="ugov-dock" aria-expanded="false" aria-label="${u.title}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
        <span>${u.fab}</span>
      </button>`;
    document.body.appendChild(wrap);

    const fab = document.getElementById("ugov-fab");
    const dock = document.getElementById("ugov-dock");
    const thread = document.getElementById("ugov-thread");
    const chips = document.getElementById("ugov-chips");
    const input = document.getElementById("ugov-q") as HTMLInputElement;
    const form = document.getElementById("ugov-form");

    function greet() {
      if (!thread) return;
      const c = UI[lang()];
      thread.innerHTML = "";
      thread.appendChild(bubble(c.hello, "bot"));
      if (chips) chips.innerHTML = c.chips.map((q) => `<button type="button">${q}</button>`).join("");
      if (input) input.placeholder = c.ph;
    }

    async function ask(text: string) {
      if (!text || !text.trim() || !thread) return;
      thread.appendChild(bubble(text, "me"));
      const wait = bubble("…", "bot");
      thread.appendChild(wait);
      thread.scrollTop = thread.scrollHeight;
      const out = await reply(text, lang());
      wait.innerHTML = out.html;
      thread.scrollTop = thread.scrollHeight;
    }

    function openDock(open: boolean) {
      if (!dock || !fab) return;
      dock.hidden = !open;
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("ugov-open", open);
      if (open && thread && !thread.childNodes.length) greet();
      if (open) input?.focus();
    }

    fab?.addEventListener("click", () => openDock(dock?.hidden !== false));
    document.getElementById("ugov-close")?.addEventListener("click", () => openDock(false));
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input?.value || "";
      if (input) input.value = "";
      ask(v);
    });
    chips?.addEventListener("click", (e) => {
      const b = e.target instanceof Element ? e.target.closest("button") : null;
      if (b) ask(b.textContent || "");
    });
    void rootPath;
  }

  window.UMC_CHAT = { reply, mount, waHtml };
  document.dispatchEvent(new CustomEvent("umc:chat-ready"));
  const root = document.body.getAttribute("data-root") || ".";
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount(root));
  } else {
    mount(root);
  }
})();
