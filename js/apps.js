/* OblivianOS apps. All of the code I made it. */
(function () {
  function esc(s) {
    const a = String.fromCharCode(38);
    return String(s ?? "")
      .replace(/&/g, a + "amp;")
      .replace(/</g, a + "lt;")
      .replace(/>/g, a + "gt;")
      .replace(/"/g, a + "quot;")
      .replace(/'/g, a + "#39;");
  }
  function proxyUrl(raw) {
    let url = (raw || "").trim();
    if (!url) url = "https://duckduckgo.com/";
    if (!/^https?:\/\//i.test(url)) {
      url = (url.includes(".") && !url.includes(" ")) ? "https://" + url : "https://duckduckgo.com/?q=" + encodeURIComponent(url);
    }
    return "https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=" + encodeURIComponent(url);
  }

  function renderApp(win, body) {
    const id = win.app;
    const payload = win.payload || {};
    const map = {
      store: storeApp, arcade: arcadeApp, pulse: pulseApp, browser: browserApp,
      music: musicApp, youtube: youtubeApp, spotify: spotifyApp, tiktok: tiktokApp,
      doblox: dobloxApp, ps4: ps4App, vpn: vpnApp, settings: settingsApp,
      terminal: terminalApp, files: filesApp, calculator: calcApp, about: aboutApp
    };
    (map[id] || aboutApp)(body, payload);
  }

  function storeApp(el) {
    const hero = ["red-dead-redemption-2", "mortal-kombat", "roblox", "pocket-mortys"].map(getGame).filter(Boolean);
    el.innerHTML = `<div class="app">
      <div class="app-head">
        <h2>DOWNLOADER</h2>
        <p>${OBLIVIAN_GAME_COUNT.toLocaleString()} games · Get adds them to Arcade</p>
        <input class="search" id="st-q" placeholder="Find a title">
      </div>
      <div class="scroll" id="st-list"></div>
    </div>`;
    const paint = (q) => {
      const games = searchGames(q);
      const rest = games.filter((g) => !hero.some((h) => h && h.id === g.id)).slice(0, 140);
      document.getElementById("st-list").innerHTML = `
        <div class="grid-4">${hero.map(card).join("")}</div>
        <p class="muted" style="margin:18px 0 8px;letter-spacing:.18em;font-size:11px">MORE</p>
        ${rest.map((g) => `<button class="row" data-get="${g.id}"><span><b>${esc(g.title)}</b><em class="muted">${esc(g.genre)}</em></span><span class="muted">GET</span></button>`).join("")}`;
      bindGet(el);
    };
    const card = (g) => `<article class="card">
      <div class="cover" style="background:${g.cover}"></div>
      <b>${esc(g.title)}</b><em>${esc(g.blurb)}</em>
      <button class="btn" data-get="${g.id}">Get</button>
    </article>`;
    document.getElementById("st-q").oninput = (e) => paint(e.target.value);
    paint("");
  }

  function bindGet(root) {
    root.querySelectorAll("[data-get]").forEach((b) => {
      b.onclick = () => {
        const g = getGame(b.dataset.get);
        if (!g) return;
        Os.open("arcade", { game: g.id, title: g.title });
      };
    });
  }

  function arcadeApp(el, payload) {
    let active = payload.game || "";
    const paint = () => {
      const cur = active && getGame(active);
      if (cur) {
        el.innerHTML = `<div class="app">
          <div class="app-head" style="display:flex;gap:12px;align-items:center">
            <button class="btn ghost" id="ar-back">Library</button>
            <div><h2>${esc(cur.title)}</h2><p>${esc(cur.genre)}</p></div>
          </div>
          <div class="scroll" style="padding:0" id="ar-play"></div>
        </div>`;
        document.getElementById("ar-back").onclick = () => { active = ""; paint(); };
        playGame(document.getElementById("ar-play"), cur);
        return;
      }
      const games = searchGames(document.getElementById("ar-q") ? document.getElementById("ar-q").value : "");
      const feat = games.filter((g) => g.featured).slice(0, 24);
      const rest = games.filter((g) => !g.featured).slice(0, 80);
      el.innerHTML = `<div class="app">
        <div class="app-head">
          <h2>ARCADE</h2>
          <p>${OBLIVIAN_GAME_COUNT.toLocaleString()} titles · real web builds up front</p>
          <input class="search" id="ar-q" placeholder="Search the catalog">
        </div>
        <div class="scroll">
          <p class="muted" style="letter-spacing:.18em;font-size:11px">PINNED</p>
          <div class="grid-4" style="margin-top:8px">${feat.map((g) => `<button class="card" data-play="${g.id}"><div class="cover" style="background:${g.cover}"></div><b>${esc(g.title)}</b><em>${esc(g.genre)}</em></button>`).join("")}</div>
          <p class="muted" style="margin:18px 0 8px;letter-spacing:.18em;font-size:11px">CATALOG</p>
          ${rest.map((g) => `<button class="row" data-play="${g.id}"><span>${esc(g.title)}</span><span class="muted">${esc(g.genre)}</span></button>`).join("")}
        </div>
      </div>`;
      const q = el.querySelector("#ar-q");
      q.oninput = () => { /* rebuild from search */ 
        const g2 = searchGames(q.value);
        const box = el.querySelector(".scroll");
        box.innerHTML = g2.slice(0, 120).map((g) => `<button class="row" data-play="${g.id}"><span>${esc(g.title)}</span><span class="muted">${esc(g.genre)}</span></button>`).join("");
        box.querySelectorAll("[data-play]").forEach((b) => b.onclick = () => { active = b.dataset.play; paint(); });
      };
      el.querySelectorAll("[data-play]").forEach((b) => b.onclick = () => { active = b.dataset.play; paint(); });
    };
    paint();
  }

  function playGame(node, g) {
    if (g.url && g.url.startsWith("offline:")) {
      offlineGame(node, g.url.slice(8));
      return;
    }
    if (!g.url) {
      node.innerHTML = `<div class="notice">No web build for ${esc(g.title)}. Opening Proxy search.</div>`;
      Os.open("browser", { url: "https://duckduckgo.com/?q=" + encodeURIComponent(g.title + " play unblocked") });
      return;
    }
    node.innerHTML = `<iframe class="frame" title="${esc(g.title)}" src="${esc(g.url)}" allowfullscreen allow="gamepad; fullscreen"></iframe>`;
  }

  function pulseApp(el) {
    const me = Os.handle || (window.Pulse && Pulse.db.handle) || "";
    if (!me) {
      el.innerHTML = `<div class="app" style="place-items:center;display:grid">
        <div style="width:min(320px,90%);padding:24px">
          <h2 class="kicker">PULSE</h2>
          <p style="margin:12px 0;color:var(--muted);font-size:14px">Pick a text code. Anyone can search it and message you live.</p>
          <input class="field" id="code" placeholder="your_code">
          <p class="muted" id="cerr" style="min-height:16px"></p>
          <button class="btn" id="claim" style="width:100%;margin-top:8px">Claim code</button>
        </div>
      </div>`;
      el.querySelector("#claim").onclick = () => {
        try {
          const c = Pulse.claim(el.querySelector("#code").value);
          Os.handle = c; Os.persist();
          pulseApp(el);
        } catch (err) { el.querySelector("#cerr").textContent = err.message; }
      };
      return;
    }
    let peer = "";
    el.innerHTML = `<div class="app split">
      <aside class="side">
        <div style="padding:12px;border-bottom:1px solid var(--border)">
          <p class="muted" style="font-size:11px">YOU</p>
          <p class="mono">${esc(me)}</p>
          <input class="search" id="pq" placeholder="Search codes">
        </div>
        <div class="scroll" id="plist" style="padding:0"></div>
      </aside>
      <section class="pane" id="pview">
        <div class="notice">Search a code to start a thread.</div>
      </section>
    </div>`;
    const listEl = el.querySelector("#plist");
    const view = el.querySelector("#pview");
    const paintList = () => {
      const q = el.querySelector("#pq").value;
      const hits = q ? Pulse.search(q) : Pulse.threads(me).map((t) => ({ code: t.other }));
      listEl.innerHTML = hits.map((h) => `<button class="row" data-p="${esc(h.code)}">${esc(h.code)}</button>`).join("");
      listEl.querySelectorAll("[data-p]").forEach((b) => b.onclick = () => { peer = b.dataset.p; paintThread(); });
    };
    const paintThread = () => {
      const msgs = Pulse.list(me, peer);
      view.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid var(--border)">
          <p class="mono">${esc(peer)}</p>
          <span class="muted" style="font-size:11px">${Pulse.online ? "LIVE" : "LOCAL / PEER"}</span>
        </div>
        <div class="scroll" id="mbox">${msgs.map((m) => `<div class="msg ${m.from === me ? "me" : "them"}">${esc(m.body)}</div>`).join("")}</div>
        <form id="psend" style="display:flex;gap:8px;padding:8px;border-top:1px solid var(--border)">
          <input class="field" id="pbody" placeholder="Message" style="flex:1">
          <button class="btn">Send</button>
        </form>`;
      const box = view.querySelector("#mbox");
      box.scrollTop = box.scrollHeight;
      view.querySelector("#psend").onsubmit = (e) => {
        e.preventDefault();
        const body = view.querySelector("#pbody").value.trim();
        if (!body) return;
        Pulse.send(me, peer, body);
        view.querySelector("#pbody").value = "";
        paintThread();
        paintList();
      };
    };
    Pulse.onMail = () => { if (peer) paintThread(); paintList(); };
    el.querySelector("#pq").oninput = paintList;
    paintList();
  }

  function browserApp(el, payload) {
    let src = proxyUrl(payload.url || "https://duckduckgo.com/");
    el.innerHTML = `<div class="app">
      <form id="go" style="display:flex;gap:6px;padding:8px;border-bottom:1px solid var(--border)">
        <input class="field" id="url" value="${esc(payload.url || "https://duckduckgo.com/")}" placeholder="Search or URL">
        <button class="btn">Go</button>
      </form>
      <div class="chips">
        ${["https://duckduckgo.com/","https://en.wikipedia.org/","https://lichess.org/"].map((u) => `<button class="chip" data-u="${u}">${u.replace("https://","").split("/")[0]}</button>`).join("")}
      </div>
      <iframe class="frame" id="frame" src="${esc(src)}" title="Proxy"></iframe>
    </div>`;
    const go = (u) => {
      el.querySelector("#url").value = u;
      el.querySelector("#frame").src = proxyUrl(u);
    };
    el.querySelector("#go").onsubmit = (e) => { e.preventDefault(); go(el.querySelector("#url").value); };
    el.querySelectorAll("[data-u]").forEach((b) => b.onclick = () => go(b.dataset.u));
  }

  function musicApp(el) {
    const stations = [
      ["Phonk FM", "phonk mix"], ["Drift Night", "drift phonk mix"], ["Lofi Desk", "lofi hip hop radio"],
      ["Rage Core", "rage phonk mix"], ["Night Drive", "synthwave mix"], ["Boss OST", "video game soundtrack mix"],
      ["UK Drill", "uk drill mix"], ["After Hours", "dark jazz mix"]
    ];
    el.innerHTML = `<div class="app">
      <div class="app-head"><h2>OBLIVIAN FM</h2><p>Phonk, drill, lofi, game OST — YouTube mixes</p></div>
      <div class="scroll">
        <div class="grid-4">${stations.map((s, i) => `<button class="card" data-q="${esc(s[1])}"><div class="cover" style="background:linear-gradient(135deg,#1b2028,#0b0d12 ${i*8}%)"></div><b>${esc(s[0])}</b></button>`).join("")}</div>
        <div id="mix" style="margin-top:14px;height:280px"></div>
      </div>
    </div>`;
    el.querySelectorAll("[data-q]").forEach((b) => b.onclick = () => {
      el.querySelector("#mix").innerHTML = `<iframe class="frame" src="https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(b.dataset.q)}" allow="autoplay" title="mix"></iframe>`;
    });
  }

  function youtubeApp(el) {
    el.innerHTML = `<div class="app">
      <form id="yt" class="app-head"><h2>YOUTUBE</h2><input class="search" placeholder="Search YouTube"></form>
      <iframe class="frame" id="ytf" src="https://www.youtube-nocookie.com/embed?listType=search&list=phonk" title="YouTube" allow="autoplay; fullscreen"></iframe>
    </div>`;
    el.querySelector("#yt").onsubmit = (e) => {
      e.preventDefault();
      const q = el.querySelector("input").value || "phonk";
      el.querySelector("#ytf").src = "https://www.youtube-nocookie.com/embed?listType=search&list=" + encodeURIComponent(q);
    };
  }

  function spotifyApp(el) {
    const lists = [
      ["Phonk", "37i9dQZF1DWZjqjZMudx9T"],
      ["RapCaviar", "37i9dQZF1DX0XUsuxWHRQd"],
      ["Lofi Beats", "37i9dQZF1DWWQRwui0ExPn"],
      ["Dark & Stormy", "37i9dQZF1DX4WYpdgoIcn6"]
    ];
    el.innerHTML = `<div class="app">
      <div class="app-head"><h2>SPOTIFY</h2><p>Official embeds</p></div>
      <div class="chips">${lists.map((l) => `<button class="chip" data-id="${l[1]}">${l[0]}</button>`).join("")}</div>
      <iframe class="frame" id="spf" src="https://open.spotify.com/embed/playlist/${lists[0][1]}" allow="autoplay; clipboard-write; encrypted-media" title="Spotify"></iframe>
    </div>`;
    el.querySelectorAll("[data-id]").forEach((b) => b.onclick = () => {
      el.querySelector("#spf").src = "https://open.spotify.com/embed/playlist/" + b.dataset.id;
    });
  }

  function tiktokApp(el) {
    el.innerHTML = `<div class="app">
      <div class="app-head"><h2>TIKTOK</h2><p>Opens through Proxy if embed is blocked</p></div>
      <div class="scroll">
        <button class="btn" id="tt">Open TikTok</button>
        <p class="muted" style="margin-top:12px">School networks often block tiktok.com. Proxy uses a translate tunnel.</p>
      </div>
    </div>`;
    el.querySelector("#tt").onclick = () => Os.open("browser", { url: "https://www.tiktok.com/" });
  }

  function dobloxApp(el) {
    const games = [
      ["Eaglercraft", "https://eaglercraft.com/mc/1.8.8/"],
      ["Krunker", "https://krunker.io/"],
      ["1v1.LOL", "https://1v1.lol/"],
      ["Voxiom", "https://voxiom.io/"],
      ["Narrow.one", "https://narrow.one/"]
    ];
    el.innerHTML = `<div class="app">
      <div class="app-head"><h2>DOBLOX</h2><p>Uncopylocked-style web experiences · amaanallen2016-web/Doblox-Uncopylocked-Games</p></div>
      <div class="scroll">
        <div class="grid-4">${games.map((g) => `<button class="card" data-u="${g[1]}"><b>${g[0]}</b><em>Play</em></button>`).join("")}</div>
        <div id="dbx" style="height:360px;margin-top:12px"></div>
      </div>
    </div>`;
    el.querySelectorAll("[data-u]").forEach((b) => b.onclick = () => {
      el.querySelector("#dbx").innerHTML = `<iframe class="frame" src="${b.dataset.u}" title="Doblox" allowfullscreen></iframe>`;
    });
  }

  function ps4App(el) {
    const tiles = searchGames("").filter((g) => ["Shooter", "Action", "Racing", "Fighter", "Sports"].includes(g.genre)).slice(0, 16);
    el.innerHTML = `<div class="app">
      <div class="app-head"><h2>PLAYSTATION</h2><p>Cine hub · web titles in a PS4-style shelf · Ps4-sdk fork</p></div>
      <div class="scroll">
        <div class="grid-4">${tiles.map((g) => `<button class="card" data-play="${g.id}"><div class="cover" style="background:${g.cover}"></div><b>${esc(g.title)}</b></button>`).join("")}</div>
      </div>
    </div>`;
    el.querySelectorAll("[data-play]").forEach((b) => b.onclick = () => Os.open("arcade", { game: b.dataset.play }));
  }

  function vpnApp(el) {
    const regions = ["Zurich", "Tokyo", "Ashburn", "Frankfurt", "Singapore", "Miami"];
    const paint = () => {
      el.innerHTML = `<div class="app"><div class="app-head"><h2>TUNNEL</h2><p>Stealth route for Proxy</p></div>
        <div class="scroll">
          <button class="btn ${Os.vpn ? "ok" : ""}" id="vpn">${Os.vpn ? "Disconnect" : "Connect"}</button>
          <p class="muted" style="margin:16px 0 8px;letter-spacing:.18em;font-size:11px">EXIT</p>
          ${regions.map((r) => `<button class="row" data-r="${r}"><span>${r}</span>${Os.region === r ? "<span>ON</span>" : ""}</button>`).join("")}
        </div></div>`;
      el.querySelector("#vpn").onclick = () => { Os.vpn = !Os.vpn; Os.persist(); paint(); };
      el.querySelectorAll("[data-r]").forEach((b) => b.onclick = () => { Os.region = b.dataset.r; Os.persist(); paint(); });
    };
    paint();
  }

  function settingsApp(el) {
    el.innerHTML = `<div class="app">
      <div class="app-head"><h2>SETTINGS</h2><p>Live wallpapers · ${Os.flavor === "os" ? "OS" : "Linux"} flavor</p></div>
      <div class="scroll">
        <p class="muted" style="letter-spacing:.18em;font-size:11px">WALLPAPER</p>
        <div class="wall-grid" style="margin:10px 0 18px">
          ${OBLIVIAN_WALLS.map((w) => `<button class="wall-swatch" data-w="${w.id}" style="background:${swatch(w.id)}"><span>${w.name}</span></button>`).join("")}
        </div>
        <p class="muted" style="letter-spacing:.18em;font-size:11px">FLAVOR</p>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn ghost" data-f="linux">Linux</button>
          <button class="btn ghost" data-f="os">OS</button>
        </div>
      </div>
    </div>`;
    el.querySelectorAll("[data-w]").forEach((b) => b.onclick = () => startWall(b.dataset.w));
    el.querySelectorAll("[data-f]").forEach((b) => b.onclick = () => {
      Os.flavor = b.dataset.f; Os.persist();
      document.documentElement.dataset.flavor = Os.flavor;
      location.reload();
    });
  }

  function swatch(id) {
    return {
      rain: "linear-gradient(180deg,#1a2a38,#07080c)",
      drive: "linear-gradient(180deg,#121820,#05070c)",
      voxel: "linear-gradient(180deg,#1a2a18,#0a1410)",
      sakura: "linear-gradient(180deg,#2a1420,#120814)",
      cinema: "linear-gradient(180deg,#1a1c22,#08090d)",
      rooftop: "linear-gradient(180deg,#1a222c,#0a0d12)"
    }[id];
  }

  function terminalApp(el) {
    el.innerHTML = `<div class="term"><div class="out" id="tout">oblivian kernel 6.1.0-cine\nALL OF THE CODE I MADE IT\ntype help\n</div>
      <form id="tform"><span>$</span><input id="tcmd" autocomplete="off"></form></div>`;
    const out = el.querySelector("#tout");
    el.querySelector("#tform").onsubmit = (e) => {
      e.preventDefault();
      const c = el.querySelector("#tcmd").value.trim();
      el.querySelector("#tcmd").value = "";
      let r = "";
      if (c === "help") r = "help, neofetch, uname, whoami, open <app>, clear";
      else if (c === "neofetch" || c === "uname") r = `OblivianOS 1.0\nflavor: ${Os.flavor}\ncredit: ALL OF THE CODE I MADE IT`;
      else if (c === "whoami") r = Os.handle || "guest";
      else if (c.startsWith("open ")) { Os.open(c.slice(5).trim()); r = "launched"; }
      else if (c === "clear") { out.textContent = ""; return; }
      else r = "command not found";
      out.textContent += "$ " + c + "\n" + r + "\n";
      out.scrollTop = out.scrollHeight;
    };
  }

  function filesApp(el) {
    el.innerHTML = `<div class="app"><div class="app-head"><h2>FILES</h2><p>Local Oblivian volume</p></div>
      <div class="scroll">
        ${["Arcade","Pulse","Wallpapers","Doblox","Ps4-sdk","OBLIVIAN-OS"].map((n) => `<button class="row"><span>${n}</span><span class="muted">dir</span></button>`).join("")}
      </div></div>`;
  }

  function calcApp(el) {
    let cur = "0";
    el.innerHTML = `<div class="app"><div class="app-head"><h2 id="cdisp">0</h2></div>
      <div class="calc">${["C","/","*","-","7","8","9","+","4","5","6","=","1","2","3","0"].map((k) => `<button data-k="${k}">${k}</button>`).join("")}</div></div>`;
    const disp = () => { el.querySelector("#cdisp").textContent = cur; };
    el.querySelectorAll("[data-k]").forEach((b) => b.onclick = () => {
      const k = b.dataset.k;
      if (k === "C") cur = "0";
      else if (k === "=") { try { cur = String(Function('"use strict";return (' + cur.replace(/[^0-9+\-*/().]/g, "") + ")")()); } catch { cur = "err"; } }
      else cur = (cur === "0" && /[0-9]/.test(k)) ? k : cur + k;
      disp();
    });
  }

  function aboutApp(el) {
    el.innerHTML = `<div class="app">
      <div class="app-head"><h2>OBLIVIAN</h2><p>All of the code I made it.</p></div>
      <div class="scroll" style="line-height:1.55;font-size:14px">
        <p>Built by <b>amaanallen2016-web</b> / Verity.</p>
        <p class="muted">Forks: OBLIVIAN-OS · Ps4-sdk · Doblox-Uncopylocked-Games</p>
        <p style="margin-top:14px">Chromebook: this <b>index.html</b> is the OS. Open it from the GitHub ZIP or GitHub Pages.</p>
        <p><a href="https://github.com/amaanallen2016-web/OblivianOS" style="color:var(--accent)">github.com/amaanallen2016-web/OblivianOS</a></p>
        <p class="muted" style="margin-top:16px">AAA store tiles (RDR2, MK, Fortnite…) open official or web companion builds. Offline pack (Snake, 2048, Breakout, Drift) always runs on a school Chromebook even if game sites are blocked.</p>
      </div>
    </div>`;
  }

  function offlineGame(node, kind) {
    node.innerHTML = `<canvas id="og" style="width:100%;height:100%;background:#07080c;display:block"></canvas>`;
    const canvas = node.querySelector("#og");
    const ctx = canvas.getContext("2d");
    const fit = () => { canvas.width = node.clientWidth; canvas.height = node.clientHeight; };
    fit();
    if (kind === "snake") snake(canvas, ctx);
    else if (kind === "2048") g2048(canvas, ctx);
    else if (kind === "breakout") breakout(canvas, ctx);
    else slope(canvas, ctx);
  }

  function snake(canvas, ctx) {
    const cell = 16;
    let dir = { x: 1, y: 0 }, next = { x: 1, y: 0 };
    let snake = [{ x: 8, y: 8 }], food = { x: 14, y: 10 }, dead = false;
    window.addEventListener("keydown", (e) => {
      const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
      if (!m) return;
      if (m[0] === -dir.x && m[1] === -dir.y) return;
      next = { x: m[0], y: m[1] };
    });
    setInterval(() => {
      dir = next;
      const w = Math.floor(canvas.width / cell), h = Math.floor(canvas.height / cell);
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= w || head.y >= h || snake.some((s) => s.x === head.x && s.y === head.y)) dead = true;
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) food = { x: Math.floor(Math.random() * w), y: Math.floor(Math.random() * h) };
      else snake.pop();
      ctx.fillStyle = "#07080c"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#6f9e7c"; snake.forEach((s) => ctx.fillRect(s.x * cell, s.y * cell, cell - 2, cell - 2));
      ctx.fillStyle = "#b7c2ce"; ctx.fillRect(food.x * cell, food.y * cell, cell - 2, cell - 2);
      if (dead) { ctx.fillStyle = "#e8eaee"; ctx.fillText("R to retry", 16, 24); snake = [{ x: 8, y: 8 }]; dead = false; }
    }, 90);
  }

  function g2048(canvas, ctx) {
    let grid = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    const spawn = () => {
      const empty = [];
      grid.forEach((r, y) => r.forEach((v, x) => { if (!v) empty.push([x, y]); }));
      if (!empty.length) return;
      const [x, y] = empty[Math.floor(Math.random() * empty.length)];
      grid[y][x] = Math.random() < 0.9 ? 2 : 4;
    };
    spawn(); spawn();
    const slide = (row) => {
      const a = row.filter(Boolean);
      for (let i = 0; i < a.length - 1; i++) if (a[i] === a[i + 1]) { a[i] *= 2; a.splice(i + 1, 1); }
      while (a.length < 4) a.push(0);
      return a;
    };
    const rot = () => { grid = grid[0].map((_, i) => grid.map((r) => r[i]).reverse()); };
    window.addEventListener("keydown", (e) => {
      const k = e.key;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k)) return;
      e.preventDefault();
      if (k === "ArrowLeft") grid = grid.map(slide);
      if (k === "ArrowRight") grid = grid.map((r) => slide(r.slice().reverse()).reverse());
      if (k === "ArrowUp") { rot(); rot(); rot(); grid = grid.map(slide); rot(); }
      if (k === "ArrowDown") { rot(); grid = grid.map(slide); rot(); rot(); rot(); }
      spawn(); draw();
    });
    function draw() {
      const s = Math.min(canvas.width, canvas.height) - 24;
      const x0 = (canvas.width - s) / 2, y0 = (canvas.height - s) / 2, g = s / 4;
      ctx.fillStyle = "#07080c"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      grid.forEach((row, y) => row.forEach((v, x) => {
        ctx.fillStyle = v ? `hsl(210 12% ${18 + Math.log2(v) * 6}%)` : "#101218";
        ctx.fillRect(x0 + x * g + 4, y0 + y * g + 4, g - 8, g - 8);
        if (v) {
          ctx.fillStyle = "#e8eaee"; ctx.font = "20px Rajdhani"; ctx.textAlign = "center";
          ctx.fillText(v, x0 + x * g + g / 2, y0 + y * g + g / 2 + 8);
        }
      }));
    }
    draw();
  }

  function breakout(canvas, ctx) {
    let x = 120, y = 160, vx = 3, vy = -3, px = 80;
    const bricks = Array.from({ length: 24 }, (_, i) => ({ x: 20 + (i % 8) * 70, y: 30 + Math.floor(i / 8) * 22, on: true }));
    window.addEventListener("mousemove", (e) => { px = e.offsetX - 40; });
    const loop = () => {
      x += vx; y += vy;
      if (x < 0 || x > canvas.width) vx *= -1;
      if (y < 0) vy *= -1;
      if (y > canvas.height - 24 && x > px && x < px + 80) vy = -Math.abs(vy);
      bricks.forEach((b) => {
        if (b.on && x > b.x && x < b.x + 64 && y > b.y && y < b.y + 16) { b.on = false; vy *= -1; }
      });
      ctx.fillStyle = "#07080c"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#b7c2ce"; ctx.fillRect(px, canvas.height - 18, 80, 10);
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      bricks.forEach((b) => { if (b.on) { ctx.fillStyle = "#6f9e7c"; ctx.fillRect(b.x, b.y, 64, 16); } });
      requestAnimationFrame(loop);
    };
    loop();
  }

  function slope(canvas, ctx) {
    let z = 0, x = 0, speed = 6, dead = false;
    window.addEventListener("keydown", (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") x -= 0.15;
      if (e.key === "d" || e.key === "ArrowRight") x += 0.15;
    });
    const loop = () => {
      z += speed * 0.01;
      ctx.fillStyle = "#10141c"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 18; i >= 0; i--) {
        const d = i + (z % 1);
        const w = 40 + d * 28;
        const cx = canvas.width / 2 + Math.sin(z + i * 0.35) * (d * 18) + x * d * 40;
        const y = 40 + d * d * 1.6;
        ctx.strokeStyle = `rgba(183,194,206,${0.15 + i / 30})`;
        ctx.strokeRect(cx - w / 2, y, w, 10);
        if (i === 2) {
          const ballX = canvas.width / 2;
          if (Math.abs(ballX - cx) > w / 2 - 8) dead = true;
          ctx.fillStyle = dead ? "#c45c5c" : "#e8eaee";
          ctx.beginPath(); ctx.arc(ballX, y - 8, 8, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (dead) { ctx.fillStyle = "#e8eaee"; ctx.fillText("crashed — reload window", 16, 24); }
      else requestAnimationFrame(loop);
    };
    loop();
  }

  window.renderApp = renderApp;
})();
