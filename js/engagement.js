"use strict";
(function () {
    function init() {
        if (document.body.getAttribute("data-page") !== "engagement")
            return;
        const COPY = {
            en: {
                hello: "Hello — I’m <b>UGov</b>, the official chatbot of the Uganda Media Centre. I’m trained on Ugandan government affairs. Ask me about IDs, ministries, health, taxes or the Press Room. If I can’t confirm your case, I’ll send you to WhatsApp the Media Centre desk.",
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
        let lang = (window.UMC && window.UMC.getLang && window.UMC.getLang()) || "en";
        function replyFor(q) {
            const t = q.toLowerCase();
            const c = COPY[lang] || COPY.en;
            if (/id|nin|nira|kitambulisho|kkalaamu|national/.test(t))
                return c.id;
            if (/water|maji|mazzi|borehole|tap/.test(t))
                return c.water;
            if (/uce|uneb|result|exam|ssoma/.test(t))
                return c.uce;
            if (/corrupt|rushwa|bulyazamaanyi|ig/.test(t))
                return c.corrupt;
            if (/passport|passipooti|pasipoti|immigration/.test(t))
                return c.pass;
            if (/\bpdm\b|sacco|parish/.test(t))
                return c.pdm;
            if (/ebola|health|afya|obulamu|hospital/.test(t))
                return c.health;
            if (/tax|tin|ura|kodi|emisolo/.test(t))
                return c.tax;
            if (/afcon|stadium|hoima/.test(t))
                return c.afcon;
            return c.fallback;
        }
        function bubble(html, who, allowUse) {
            const el = document.createElement("div");
            el.className = "ugov-msg " + who;
            el.innerHTML = html;
            if (who === "bot" && allowUse) {
                const use = document.createElement("button");
                use.type = "button";
                use.className = "chat-use";
                use.setAttribute("data-use-fb", String(html).replace(/<[^>]+>/g, ""));
                use.textContent = (window.UMC && window.UMC.t("eng.chat.use")) || "Use in feedback form";
                el.appendChild(use);
            }
            return el;
        }
        const thread = document.getElementById("chat-thread");
        const chips = document.getElementById("ask-chips");
        const input = document.getElementById("chat-q");
        function greet() {
            if (!thread)
                return;
            const c = COPY[lang] || COPY.en;
            thread.innerHTML = "";
            thread.appendChild(bubble(c.hello, "bot"));
            if (chips)
                chips.innerHTML = c.chips.map((q) => `<button type="button">${q}</button>`).join("");
            if (input)
                input.placeholder = c.ph;
            thread.scrollTop = thread.scrollHeight;
        }
        async function ask(text) {
            if (!text.trim() || !thread)
                return;
            thread.appendChild(bubble(text, "me"));
            const wait = bubble("…", "bot");
            thread.appendChild(wait);
            thread.scrollTop = thread.scrollHeight;
            let html = replyFor(text);
            let handoff = html === (COPY[lang] || COPY.en).fallback;
            if (window.UMC_CHAT) {
                const out = await window.UMC_CHAT.reply(text, lang);
                html = out.html;
                handoff = out.handoff;
            }
            wait.remove();
            thread.appendChild(bubble(html, "bot", !handoff));
            thread.scrollTop = thread.scrollHeight;
        }
        function toast(msg) {
            const el = document.getElementById("toast");
            if (!el)
                return;
            el.textContent = msg;
            el.classList.add("show");
            setTimeout(() => el.classList.remove("show"), 3200);
        }
        function t(key) {
            return (window.UMC && window.UMC.t(key)) || "";
        }
        function openTab(id) {
            document.querySelectorAll("[data-tab]").forEach((btn) => btn.classList.toggle("on", btn.getAttribute("data-tab") === id));
            document.querySelectorAll("[data-tab-panel]").forEach((p) => p.classList.toggle("on", p.getAttribute("data-tab-panel") === id));
        }
        function useInForm(text) {
            const ta = document.getElementById("fb-msg");
            if (ta)
                ta.value = text;
            openTab("feedback");
            ta?.focus();
        }
        greet();
        document.getElementById("chat-form")?.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!input)
                return;
            const v = input.value;
            input.value = "";
            ask(v);
        });
        chips?.addEventListener("click", (e) => {
            const b = e.target instanceof Element ? e.target.closest("button") : null;
            if (b)
                ask(b.textContent);
        });
        document.getElementById("chat-langs")?.addEventListener("click", (e) => {
            const b = e.target instanceof Element ? e.target.closest("[data-chat-lang]") : null;
            if (!b)
                return;
            lang = (b.getAttribute("data-chat-lang") || "en");
            document.querySelectorAll("#chat-langs button").forEach((x) => x.classList.toggle("on", x === b));
            greet();
        });
        thread?.addEventListener("click", (e) => {
            const b = e.target instanceof Element ? e.target.closest("[data-use-fb]") : null;
            if (!b)
                return;
            useInForm(b.getAttribute("data-use-fb") || "");
        });
        const desk = document.getElementById("fb-desk");
        if (desk) {
            const mins = (typeof UMC_MINISTRIES !== "undefined" && UMC_MINISTRIES) || [];
            const names = mins.length
                ? mins.map((m) => m.name)
                : ["Office of the Prime Minister", "Ministry of Health", "Ministry of Education and Sports", "Ministry of ICT and National Guidance"];
            desk.innerHTML = "";
            const first = document.createElement("option");
            first.value = "";
            first.textContent = "Select a ministry / desk";
            desk.appendChild(first);
            names.forEach((n) => {
                const o = document.createElement("option");
                o.value = n;
                o.textContent = n;
                desk.appendChild(o);
            });
        }
        document.getElementById("feedback-form")?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const token = window.grecaptcha ? window.grecaptcha.getResponse() : "";
            if (!token) {
                toast(t("eng.fb.captcha") || "Please complete the captcha before sending.");
                return;
            }
            const data = {
                ministry: document.getElementById("fb-desk")?.value || "",
                language: document.getElementById("fb-lang")?.value || "en",
                subject: document.getElementById("fb-subject")?.value.trim() || "",
                message: document.getElementById("fb-msg")?.value.trim() || "",
                contact: document.getElementById("fb-contact")?.value.trim() || "",
                captcha: token,
                at: new Date().toISOString()
            };
            if (!data.message)
                return;
            try {
                const inbox = JSON.parse(localStorage.getItem("umc-feedback") || "[]");
                inbox.unshift(data);
                localStorage.setItem("umc-feedback", JSON.stringify(inbox.slice(0, 80)));
            }
            catch (err) { /* ignore quota */ }
            try {
                await fetch("https://formsubmit.co/ajax/info@mediacentre.go.ug", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({
                        _subject: "UMC citizen feedback — " + data.ministry,
                        ministry: data.ministry,
                        language: data.language,
                        subject: data.subject,
                        message: data.message,
                        contact: data.contact || "(not provided)"
                    })
                });
            }
            catch (err) { /* filed locally */ }
            toast(t("eng.fb.ok") || "Feedback received. It has been filed for the ministry desk.");
            form.reset();
            window.grecaptcha?.reset();
        });
        const POLLS = [
            { id: "p1", q: "Is the NIN-as-TIN Cabinet decision clear to you?", opts: ["Yes, I understand", "I need a briefing", "Not yet"] },
            { id: "p2", q: "How do you prefer to receive government news?", opts: ["Radio", "Press Room", "Languages Desk"] },
            { id: "p3", q: "Should AFCON 2027 training facilities be ready by December 2026?", opts: ["Yes", "Need more time", "Not sure"] }
        ];
        function pollState() {
            try {
                return JSON.parse(localStorage.getItem("umc-polls") || "{}");
            }
            catch (e) {
                return {};
            }
        }
        function savePolls(s) { localStorage.setItem("umc-polls", JSON.stringify(s)); }
        function renderPolls() {
            const box = document.getElementById("poll-grid");
            if (!box)
                return;
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
            if (!b)
                return;
            const id = b.getAttribute("data-poll");
            const i = Number(b.getAttribute("data-i"));
            const st = pollState();
            if (st["pick-" + id] != null)
                return;
            const poll = POLLS.find((p) => p.id === id);
            st[id] = st[id] || poll.opts.map(() => 0);
            st[id][i] += 1;
            st["pick-" + id] = i;
            savePolls(st);
            renderPolls();
        });
        renderPolls();
        function applyHash() {
            const hash = (location.hash || "").replace("#", "");
            if (hash === "feedback" || hash === "polls")
                openTab(hash);
            if (hash === "desk" || hash === "assistant")
                openTab("assistant");
        }
        applyHash();
        window.addEventListener("hashchange", applyHash);
    }
    init();
})();
//# sourceMappingURL=engagement.js.map