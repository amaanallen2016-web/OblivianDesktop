/* Pulse — text-code chat. Same device via BroadcastChannel; live via PeerJS when hosted. */
(function () {
  const KEY = "oblivian-pulse-v1";
  const bus = ("BroadcastChannel" in window) ? new BroadcastChannel("oblivian-pulse") : null;
  let peer = null;
  let conns = {};

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch { return {}; }
  }
  function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

  function threadKey(a, b) {
    return [a, b].map((s) => s.toLowerCase()).sort().join("::");
  }

  const Pulse = {
    db: load(),
    online: false,
    onMail: null,

    claim(code) {
      const c = String(code || "").trim();
      if (!/^[A-Za-z0-9_-]{2,32}$/.test(c)) throw new Error("Use 2–32 letters, numbers, _ or -");
      this.db.handle = c;
      this.db.dir = this.db.dir || {};
      this.db.dir[c.toLowerCase()] = { code: c, t: Date.now() };
      save(this.db);
      this.connectPeer(c);
      this.broadcast({ type: "hello", code: c });
      return c;
    },

    search(q) {
      const s = (q || "").trim().toLowerCase();
      const dir = this.db.dir || {};
      const hits = Object.values(dir).filter((d) => d.code.toLowerCase().includes(s));
      if (s && !hits.find((h) => h.code.toLowerCase() === s) && /^[a-z0-9_-]{2,32}$/.test(s)) {
        hits.unshift({ code: q.trim(), t: 0 });
      }
      return hits.slice(0, 40);
    },

    threads(me) {
      const out = [];
      const threads = this.db.threads || {};
      Object.keys(threads).forEach((k) => {
        if (!k.split("::").includes(me.toLowerCase())) return;
        const msgs = threads[k];
        const last = msgs[msgs.length - 1];
        if (!last) return;
        const other = last.from.toLowerCase() === me.toLowerCase() ? last.to : last.from;
        out.push({ other, last: last.body, t: last.t });
      });
      out.sort((a, b) => b.t - a.t);
      return out;
    },

    list(a, b) {
      return (this.db.threads && this.db.threads[threadKey(a, b)]) || [];
    },

    send(from, to, body) {
      const msg = { id: Date.now() + Math.random(), from, to, body, t: Date.now() };
      this.db.threads = this.db.threads || {};
      const k = threadKey(from, to);
      this.db.threads[k] = this.db.threads[k] || [];
      this.db.threads[k].push(msg);
      this.db.dir = this.db.dir || {};
      this.db.dir[to.toLowerCase()] = { code: to, t: Date.now() };
      save(this.db);
      this.broadcast({ type: "msg", msg });
      this.peerSend(to, msg);
      return msg;
    },

    broadcast(payload) {
      try { bus && bus.postMessage(payload); } catch {}
    },

    ingest(msg) {
      this.db.threads = this.db.threads || {};
      const k = threadKey(msg.from, msg.to);
      this.db.threads[k] = this.db.threads[k] || [];
      if (this.db.threads[k].some((m) => m.id === msg.id)) return;
      this.db.threads[k].push(msg);
      this.db.dir = this.db.dir || {};
      this.db.dir[msg.from.toLowerCase()] = { code: msg.from, t: Date.now() };
      save(this.db);
      if (this.onMail) this.onMail(msg);
    },

    connectPeer(code) {
      if (!window.Peer) return;
      if (location.protocol === "file:") return;
      try {
        if (peer) { try { peer.destroy(); } catch {} }
        const id = "obv" + code.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 28);
        peer = new Peer(id, { debug: 0 });
        peer.on("open", () => { this.online = true; });
        peer.on("connection", (c) => this.bindConn(c));
        peer.on("error", () => { this.online = false; });
      } catch {
        this.online = false;
      }
    },

    bindConn(c) {
      conns[c.peer] = c;
      c.on("data", (d) => { if (d && d.type === "msg" && d.msg) this.ingest(d.msg); });
    },

    peerSend(to, msg) {
      if (!peer || !this.online) return;
      const id = "obv" + String(to).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 28);
      const c = conns[id] || peer.connect(id);
      conns[id] = c;
      const fire = () => { try { c.send({ type: "msg", msg }); } catch {} };
      if (c.open) fire();
      else c.on("open", fire);
    }
  };

  if (bus) {
    bus.onmessage = (e) => {
      const d = e.data || {};
      if (d.type === "hello" && d.code) {
        Pulse.db.dir = Pulse.db.dir || {};
        Pulse.db.dir[d.code.toLowerCase()] = { code: d.code, t: Date.now() };
        save(Pulse.db);
      }
      if (d.type === "msg" && d.msg) Pulse.ingest(d.msg);
    };
  }

  window.Pulse = Pulse;
})();
