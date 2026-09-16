/* OblivianOS core — boot, window manager, dock, wallpapers. All of the code I made it. */
(function () {
  const STORE = "oblivian-os-web";
  const APPS = [
    { id: "store", title: "App Downloader" },
    { id: "arcade", title: "Arcade" },
    { id: "pulse", title: "Pulse" },
    { id: "browser", title: "Proxy" },
    { id: "music", title: "Oblivian FM" },
    { id: "youtube", title: "YouTube" },
    { id: "spotify", title: "Spotify" },
    { id: "tiktok", title: "TikTok" },
    { id: "doblox", title: "Doblox" },
    { id: "ps4", title: "PlayStation" },
    { id: "vpn", title: "Tunnel" },
    { id: "settings", title: "Settings" },
    { id: "terminal", title: "Terminal" },
    { id: "files", title: "Files" },
    { id: "calculator", title: "Calculator" },
    { id: "about", title: "About" }
  ];
  const DOCK = ["store", "arcade", "pulse", "browser", "music", "youtube", "spotify", "doblox", "ps4", "settings"];

  const WALLS = [
    { id: "rain", name: "Night Rain" },
    { id: "drive", name: "Night Drive" },
    { id: "voxel", name: "Voxel Dusk" },
    { id: "sakura", name: "Sakura Night" },
    { id: "cinema", name: "Dark Cinema" },
    { id: "rooftop", name: "Rooftop Fog" }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
    catch { return {}; }
  }

  const Os = {
    flavor: null,
    wallpaper: "rain",
    vpn: false,
    region: "Zurich",
    handle: "",
    wins: [],
    z: 20,
    seq: 1,
    init() {
      const s = load();
      this.flavor = s.flavor || null;
      this.wallpaper = s.wallpaper || "rain";
      this.vpn = !!s.vpn;
      this.region = s.region || "Zurich";
      this.handle = s.handle || (window.Pulse && Pulse.db.handle) || "";
      boot();
    },
    persist() {
      localStorage.setItem(STORE, JSON.stringify({
        flavor: this.flavor, wallpaper: this.wallpaper, vpn: this.vpn, region: this.region, handle: this.handle
      }));
    },
    choose(flavor) {
      this.flavor = flavor;
      this.persist();
      document.documentElement.dataset.flavor = flavor;
      document.getElementById("boot").style.display = "none";
      document.getElementById("desktop").classList.add("on");
      paintChrome();
      startWall(this.wallpaper);
      tickClock();
      setInterval(tickClock, 1000);
    },
    open(id, payload) {
      const meta = APPS.find((a) => a.id === id) || { id, title: id };
      const existing = this.wins.find((w) => w.app === id && !w.payload && !payload);
      if (existing && !payload) {
        existing.min = false;
        this.focus(existing.id);
        renderWins();
        return;
      }
      const mobile = window.innerWidth < 720;
      const left = Os.flavor === "linux" && !mobile ? 78 : 40;
      const w = {
        id: "w" + this.seq++,
        app: id,
        title: (payload && payload.title) || meta.title,
        x: left + (this.wins.length % 5) * 24,
        y: 48 + (this.wins.length % 5) * 18,
        w: mobile ? window.innerWidth - 16 : 860,
        h: mobile ? window.innerHeight - 120 : 560,
        z: ++this.z,
        min: false,
        max: mobile,
        payload: payload || null
      };
      this.wins.push(w);
      renderWins();
      paintDock();
    },
    close(id) {
      this.wins = this.wins.filter((w) => w.id !== id);
      renderWins();
      paintDock();
    },
    focus(id) {
      const w = this.wins.find((x) => x.id === id);
      if (!w) return;
      w.z = ++this.z;
      w.min = false;
      renderWins();
    },
    toggleMin(id) {
      const w = this.wins.find((x) => x.id === id);
      if (!w) return;
      w.min = !w.min;
      renderWins();
    },
    toggleMax(id) {
      const w = this.wins.find((x) => x.id === id);
      if (!w) return;
      w.max = !w.max;
      w.min = false;
      renderWins();
    }
  };

  const ICONS = {
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16l-1 12H5L4 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>',
    arcade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="8" cy="14" r="1.5"/><path d="M15 12h4M17 10v4"/></svg>',
    pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
    browser: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M10 9l6 3-6 3z"/></svg>',
    spotify: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 10c2.5-1 5.5-1 8 .4M8 13c2-.8 4.5-.8 6.5.3M8 16c1.5-.6 3.2-.6 4.8.2"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4v10a4 4 0 1 1-4-4"/><path d="M14 8c1.5 2 3.5 3 6 3"/></svg>',
    doblox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v16M4 9h16M4 15h16M15 4v16"/></svg>',
    ps4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="8" width="20" height="10" rx="3"/><path d="M7 12h.01M17 12h.01"/></svg>',
    vpn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5L18 18M18 6l-1.5 1.5M6 18l1.5-1.5"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7l6 5-6 5M12 17h8"/></svg>',
    files: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h6l2 2h10v10H3z"/></svg>',
    calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
    about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></svg>'
  };

  function boot() {
    const logs = [
      "OBLIVIAN KERNEL 6.1.0-cine",
      "ALL OF THE CODE I MADE IT",
      "mounted /dev/pulse",
      "fork  amaanallen2016-web/OBLIVIAN-OS",
      "fork  amaanallen2016-web/Ps4-sdk",
      "fork  amaanallen2016-web/Doblox-Uncopylocked-Games",
      "loaded cine compositor",
      "tunnel stack ready",
      "waiting for flavor…"
    ];
    const ul = document.getElementById("boot-logs");
    let i = 0;
    const step = () => {
      if (i < logs.length) {
        const li = document.createElement("li");
        li.textContent = logs[i++];
        ul.appendChild(li);
        setTimeout(step, 140);
      } else {
        document.getElementById("boot-pick").hidden = false;
        if (Os.flavor) {
          setTimeout(() => Os.choose(Os.flavor), 280);
        }
      }
    };
    step();
    document.getElementById("pick-linux").onclick = () => Os.choose("linux");
    document.getElementById("pick-os").onclick = () => Os.choose("os");
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleSpot();
      }
      if (e.key === "Escape") document.getElementById("spot").classList.remove("on");
    });
  }

  function paintChrome() {
    document.getElementById("hud-menus").hidden = Os.flavor !== "os";
    document.getElementById("linux-status").hidden = Os.flavor !== "linux";
    paintDock();
    const icons = document.getElementById("icons");
    icons.style.left = Os.flavor === "linux" ? "78px" : "16px";
    icons.innerHTML = ["store", "arcade", "pulse", "files"].map((id) => {
      const a = APPS.find((x) => x.id === id);
      return `<button class="desk-icon" data-open="${id}"><span class="mark">${ICONS[id]}</span><small>${a.title}</small></button>`;
    }).join("");
    icons.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => Os.open(b.dataset.open));
    document.getElementById("spot-btn").onclick = toggleSpot;
  }

  function paintDock() {
    const dock = document.getElementById("dock");
    dock.innerHTML = DOCK.map((id) => {
      const on = Os.wins.some((w) => w.app === id && !w.min);
      return `<button class="dock-btn ${on ? "on" : ""}" data-open="${id}" title="${(APPS.find((a)=>a.id===id)||{}).title}">${ICONS[id]}</button>`;
    }).join("");
    dock.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => Os.open(b.dataset.open));
  }

  function renderWins() {
    const root = document.getElementById("wins");
    const keep = new Set(Os.wins.map((w) => w.id));
    [...root.children].forEach((el) => { if (!keep.has(el.dataset.id)) el.remove(); });
    Os.wins.forEach((w) => {
      let el = root.querySelector(`[data-id="${w.id}"]`);
      if (!el) {
        el = document.createElement("section");
        el.className = "win";
        el.dataset.id = w.id;
        el.innerHTML = `
          <div class="titlebar">
            <div class="traffic">
              <button class="dot close" data-act="close" aria-label="Close"></button>
              <button class="dot min" data-act="min" aria-label="Minimize"></button>
              <button class="dot max" data-act="max" aria-label="Maximize"></button>
            </div>
            <div class="win-title">${esc(w.title)}</div>
          </div>
          <div class="body"></div>
          <div class="resize"></div>`;
        root.appendChild(el);
        bindWin(el, w);
        const body = el.querySelector(".body");
        if (window.renderApp) window.renderApp(w, body);
      }
      el.style.zIndex = w.z;
      el.classList.toggle("max", w.max);
      el.classList.toggle("min", w.min);
      if (!w.max) {
        el.style.left = w.x + "px";
        el.style.top = w.y + "px";
        el.style.width = w.w + "px";
        el.style.height = w.h + "px";
      }
      el.querySelector(".win-title").textContent = w.title;
    });
    paintDock();
  }

  function bindWin(el, w) {
    el.addEventListener("pointerdown", () => Os.focus(w.id));
    el.querySelector('[data-act="close"]').onclick = (e) => { e.stopPropagation(); Os.close(w.id); };
    el.querySelector('[data-act="min"]').onclick = (e) => { e.stopPropagation(); Os.toggleMin(w.id); };
    el.querySelector('[data-act="max"]').onclick = (e) => { e.stopPropagation(); Os.toggleMax(w.id); };
    const bar = el.querySelector(".titlebar");
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || w.max) return;
      const ox = e.clientX - w.x, oy = e.clientY - w.y;
      const move = (ev) => {
        w.x = Math.max(0, ev.clientX - ox);
        w.y = Math.max(36, ev.clientY - oy);
        el.style.left = w.x + "px";
        el.style.top = w.y + "px";
      };
      const up = () => { window.removeEventListener("pointermove", move); };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
    });
    const rz = el.querySelector(".resize");
    rz.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      const sx = e.clientX, sy = e.clientY, sw = w.w, sh = w.h;
      const move = (ev) => {
        w.w = Math.max(280, sw + (ev.clientX - sx));
        w.h = Math.max(200, sh + (ev.clientY - sy));
        el.style.width = w.w + "px";
        el.style.height = w.h + "px";
      };
      const up = () => window.removeEventListener("pointermove", move);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
    });
  }

  function tickClock() {
    const t = new Date();
    const str = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const el = document.getElementById("clock");
    if (el) el.textContent = str;
  }

  function toggleSpot() {
    const spot = document.getElementById("spot");
    spot.classList.toggle("on");
    if (spot.classList.contains("on")) {
      const inp = document.getElementById("spot-input");
      inp.value = "";
      inp.focus();
      paintSpot("");
    }
  }

  function paintSpot(q) {
    const hits = APPS.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) || a.id.includes(q.toLowerCase()));
    const games = (window.searchGames ? searchGames(q) : []).slice(0, 8);
    const box = document.getElementById("spot-hits");
    box.innerHTML = hits.map((a) => `<button data-app="${a.id}">${a.title}</button>`).join("") +
      games.map((g) => `<button data-game="${g.id}">${g.title} · ${g.genre}</button>`).join("");
    box.querySelectorAll("[data-app]").forEach((b) => b.onclick = () => { Os.open(b.dataset.app); toggleSpot(); });
    box.querySelectorAll("[data-game]").forEach((b) => b.onclick = () => { Os.open("arcade", { game: b.dataset.game, title: "Arcade" }); toggleSpot(); });
  }

  let wallAnim = 0;
  function startWall(id) {
    Os.wallpaper = id;
    Os.persist();
    const canvas = document.getElementById("wall-canvas");
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    cancelAnimationFrame(wallAnim);
    const parts = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(), s: 0.4 + Math.random() * 1.4, v: 0.002 + Math.random() * 0.01
    }));
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      if (id === "rain") {
        ctx.fillStyle = "#071018"; ctx.fillRect(0, 0, w, h);
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "rgba(40,70,90,0.35)"); g.addColorStop(1, "rgba(8,10,16,0.2)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(183,194,206,0.28)";
        ctx.lineWidth = 1;
        parts.forEach((p) => {
          p.y += p.v * 1.8; if (p.y > 1) p.y = 0;
          ctx.beginPath();
          ctx.moveTo(p.x * w, p.y * h);
          ctx.lineTo(p.x * w + 2, p.y * h + 14 * p.s);
          ctx.stroke();
        });
      } else if (id === "drive") {
        ctx.fillStyle = "#05070c"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0c121c"; ctx.fillRect(0, h * 0.58, w, h);
        ctx.strokeStyle = "rgba(183,194,206,0.55)";
        ctx.lineWidth = 3;
        const t = Date.now() / 400;
        for (let i = 0; i < 12; i++) {
          const x = ((i * 140) + t * 80) % (w + 140) - 70;
          ctx.fillStyle = "rgba(220,210,160,0.25)";
          ctx.fillRect(x, h * 0.62, 40, 6);
        }
        ctx.fillStyle = "rgba(183,194,206,0.08)";
        ctx.beginPath(); ctx.moveTo(w * 0.35, h); ctx.lineTo(w * 0.5, h * 0.58); ctx.lineTo(w * 0.65, h); ctx.fill();
      } else if (id === "voxel") {
        ctx.fillStyle = "#0a1410"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 40; i++) {
          const x = (i * 47) % w, y = h * 0.4 + Math.sin(i) * 40;
          ctx.fillStyle = `hsl(${90 + (i % 8) * 8} 18% ${14 + (i % 5) * 3}%)`;
          ctx.fillRect(x, y, 28, h);
        }
      } else if (id === "sakura") {
        ctx.fillStyle = "#120814"; ctx.fillRect(0, 0, w, h);
        parts.forEach((p) => {
          p.y += p.v * 0.35; p.x += 0.0008; if (p.y > 1) p.y = 0; if (p.x > 1) p.x = 0;
          ctx.fillStyle = "rgba(220,170,190,0.55)";
          ctx.beginPath(); ctx.ellipse(p.x * w, p.y * h, 4 * p.s, 2.2 * p.s, p.s, 0, Math.PI * 2); ctx.fill();
        });
      } else if (id === "cinema") {
        ctx.fillStyle = "#08090d"; ctx.fillRect(0, 0, w, h);
        const g = ctx.createRadialGradient(w * 0.5, h * 0.2, 20, w * 0.5, h * 0.4, w * 0.6);
        g.addColorStop(0, "rgba(183,194,206,0.16)"); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#0a0d12"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "rgba(80,90,100,0.2)";
        ctx.fillRect(0, h * 0.55, w, h);
        parts.forEach((p) => {
          ctx.fillStyle = "rgba(200,210,220,0.15)";
          ctx.fillRect(p.x * w, h * 0.2 + p.y * 40, 90, 2);
        });
      }
      wallAnim = requestAnimationFrame(draw);
    };
    draw();
  }

  function esc(s) {
    const a = String.fromCharCode(38);
    return String(s)
      .replace(/&/g, a + "amp;")
      .replace(/</g, a + "lt;")
      .replace(/>/g, a + "gt;")
      .replace(/"/g, a + "quot;")
      .replace(/'/g, a + "#39;");
  }

  window.Os = Os;
  window.OBLIVIAN_APPS = APPS;
  window.OBLIVIAN_WALLS = WALLS;
  window.OBLIVIAN_ICONS = ICONS;
  window.startWall = startWall;
  document.getElementById("spot-input").addEventListener("input", (e) => paintSpot(e.target.value));
  Os.init();
})();
