(function () {
  if (document.body.getAttribute("data-page") !== "press") return;

  const CHANNEL = "UCobG6xQoAv_uULa4W7zA1gA";
  const FALLBACK = {
    id: "J_7bkyMV1Cg",
    title: "Press conference | Return and funeral arrangements for King Oyo",
    date: "2026-09-03T11:40:19+00:00"
  };
  const RSS = "https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL;
  const PROXY = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(RSS);

  function hoursAgo(iso) {
    const t = new Date(iso).getTime();
    if (!isFinite(t)) return 999;
    return (Date.now() - t) / 36e5;
  }

  function setPlayer(id, title, live) {
    const frame = document.getElementById("yt-player");
    const tEl = document.getElementById("yt-title");
    const bEl = document.getElementById("yt-blurb");
    const open = document.getElementById("yt-open");
    const strip = document.getElementById("strip-title");
    const badges = [document.getElementById("strip-badge"), document.getElementById("yt-badge")];
    if (frame) {
      frame.src = live
        ? "https://www.youtube.com/embed/live_stream?channel=" + CHANNEL
        : "https://www.youtube.com/embed/" + id;
    }
    if (tEl) tEl.textContent = live ? "Live press briefing" : title;
    if (bEl) {
      bEl.textContent = live
        ? "The official desk is live on YouTube. Watch here, or join on Facebook, X and Instagram."
        : title + " — latest from the official Uganda Media Centre channel.";
    }
    if (open) open.href = live
      ? "https://www.youtube.com/@ugandamediacentre/live"
      : "https://www.youtube.com/watch?v=" + id;
    if (strip) {
      strip.textContent = live
        ? "Live now on YouTube · @ugandamediacentre"
        : title;
    }
    badges.forEach((el) => {
      if (!el) return;
      el.innerHTML = live ? "<i></i> Live press briefing" : "<i></i> Latest briefing";
      el.classList.toggle("is-latest", !live);
    });
    if (live && localStorage.getItem("umc-live-notify") === "1" && "Notification" in window && Notification.permission === "granted") {
      const key = "umc-live-ping-" + (id || "live");
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        try {
          new Notification("Uganda Media Centre — live", {
            body: title || "A press briefing is live on YouTube.",
            icon: "img/coat.svg"
          });
        } catch (e) { /* ignore */ }
      }
    }
  }

  async function loadFeed() {
    try {
      const res = await fetch(PROXY);
      const data = await res.json();
      const item = data && data.items && data.items[0];
      if (!item) throw new Error("empty");
      const id = (item.guid || item.link || "").replace(/^.*v=/, "").replace(/^yt:video:/, "");
      const title = item.title || FALLBACK.title;
      const pub = item.pubDate || item.published || "";
      const live = hoursAgo(pub) < 10 || /live/i.test(title);
      setPlayer(id || FALLBACK.id, title, live);
    } catch (e) {
      const live = hoursAgo(FALLBACK.date) < 10;
      setPlayer(FALLBACK.id, FALLBACK.title, live);
    }
  }

  document.getElementById("notify-live")?.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      const toast = document.getElementById("toast");
      if (toast) { toast.textContent = "Notifications are not available in this browser."; toast.classList.add("show"); }
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      localStorage.setItem("umc-live-notify", "1");
      new Notification("Uganda Media Centre", { body: "You will be notified when a press briefing goes live." });
      const btn = document.getElementById("notify-live");
      if (btn) btn.textContent = "Notifications on";
    }
  });
  if (localStorage.getItem("umc-live-notify") === "1") {
    const btn = document.getElementById("notify-live");
    if (btn) btn.textContent = "Notifications on";
  }

  loadFeed();
})();
