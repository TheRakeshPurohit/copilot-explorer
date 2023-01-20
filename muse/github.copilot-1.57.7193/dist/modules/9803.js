const r = require("http");
const o = require("https");
const { Readable: i } = require("stream");
const s = require(8104)("helix-fetch:h1");
const { RequestAbortedError: a } = require(1787);
const { decodeStream: c } = require(4544);
module.exports = {
  request: async (e, t, n) => {
    const { request: l } = "https:" === t.protocol ? o : r;
    const u = ((e, t) => {
      const {
        h1: n,
        options: { h1: i, rejectUnauthorized: s },
      } = e;
      return "https:" === t
        ? n.httpsAgent
          ? n.httpsAgent
          : i || "boolean" == typeof s
          ? ((n.httpsAgent = new o.Agent(
              "boolean" == typeof s
                ? {
                    ...(i || {}),
                    rejectUnauthorized: s,
                  }
                : i
            )),
            n.httpsAgent)
          : undefined
        : n.httpAgent
        ? n.httpAgent
        : i
        ? ((n.httpAgent = new r.Agent(i)), n.httpAgent)
        : undefined;
    })(e, t.protocol);
    const d = {
      ...n,
      agent: u,
    };
    const { socket: p, body: h } = d;
    if (p) {
      delete d.socket;
      if (p.assigned) {
        p.assigned = true;
        if (u) {
          d.agent = new Proxy(u, {
            get: (e, t) =>
              "createConnection" !== t || p.inUse
                ? e[t]
                : (e, t) => {
                    s(`agent reusing socket #${p.id} (${p.servername})`);
                    p.inUse = true;
                    t(null, p);
                  },
          });
        } else {
          d.createConnection = (e, t) => {
            s(`reusing socket #${p.id} (${p.servername})`);
            p.inUse = true;
            t(null, p);
          };
        }
      }
    }
    return new Promise((e, n) => {
      let r;
      s(`${d.method} ${t.href}`);
      const { signal: o } = d;
      const u = () => {
        o.removeEventListener("abort", u);
        if (p && !p.inUse) {
          s(
            `discarding redundant socket used for ALPN: #${p.id} ${p.servername}`
          );
          p.destroy();
        }
        n(new a());
        if (r) {
          r.abort();
        }
      };
      if (o) {
        if (o.aborted) return void n(new a());
        o.addEventListener("abort", u);
      }
      r = l(t, d);
      r.once("response", (t) => {
        if (o) {
          o.removeEventListener("abort", u);
        }
        if (p && !p.inUse) {
          s(
            `discarding redundant socket used for ALPN: #${p.id} ${p.servername}`
          );
          p.destroy();
        }
        e(
          ((e, t, n) => {
            const {
              statusCode: r,
              statusMessage: o,
              httpVersion: i,
              httpVersionMajor: s,
              httpVersionMinor: a,
              headers: l,
            } = e;
            const u = t ? c(r, l, e, n) : e;
            return {
              statusCode: r,
              statusText: o,
              httpVersion: i,
              httpVersionMajor: s,
              httpVersionMinor: a,
              headers: l,
              readable: u,
              decoded: !(!t || u === e),
            };
          })(t, d.decode, n)
        );
      });
      r.once("error", (e) => {
        if (o) {
          o.removeEventListener("abort", u);
        }
        if (p && !p.inUse) {
          s(
            `discarding redundant socket used for ALPN: #${p.id} ${p.servername}`
          );
          p.destroy();
        }
        if (r.aborted) {
          s(`${d.method} ${t.href} failed with: ${e.message}`);
          r.abort();
          n(e);
        }
      });
      if (h instanceof i) {
        h.pipe(r);
      } else {
        if (h) {
          r.write(h);
        }
        r.end();
      }
    });
  },
  setupContext: (e) => {
    e.h1 = {};
  },
  resetContext: async ({ h1: e }) => {
    if (e.httpAgent) {
      s("resetContext: destroying httpAgent");
      e.httpAgent.destroy();
      delete e.httpAgent;
    }
    if (e.httpsAgent) {
      s("resetContext: destroying httpsAgent");
      e.httpsAgent.destroy();
      delete e.httpsAgent;
    }
  },
};