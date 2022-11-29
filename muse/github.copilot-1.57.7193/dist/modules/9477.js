Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.initProxyEnvironment = undefined;
const r = require(1808),
  o = require(7310),
  i = require(9496);
exports.initProxyEnvironment = function (e, t) {
  let n = i.workspace.getConfiguration("http").get("proxy") || function (e) {
    return e.HTTPS_PROXY || e.https_proxy || e.HTTP_PROXY || e.http_proxy || null;
  }(t);
  if (n) {
    const t = {},
      s = i.workspace.getConfiguration("http").get("proxyAuthorization"),
      a = i.workspace.getConfiguration("http").get("proxyStrictSSL", !0);
    s && (t["Proxy-Authorization"] = s);
    let c = n;
    const l = n.split(":");
    if (l.length > 2) {
      if (n.includes("[")) {
        const e = n.indexOf("["),
          t = n.indexOf("]");
        c = n.substring(e + 1, t);
      }
    } else c = l[0];
    const u = r.isIP(c);
    4 === u ? n = `https://${n}` : 6 === u && (n.includes("[") ? n.startsWith("https://") || (n = `https://${n}`) : n = `https://[${n}]`);
    const {
        hostname: d,
        port: p,
        username: h,
        password: f
      } = function (e) {
        try {
          return new o.URL(e);
        } catch (t) {
          throw new Error(`Invalid proxy URL: '${e}'`);
        }
      }(n),
      m = h && f && `${h}:${f}`;
    e.proxySettings = {
      host: d,
      port: parseInt(p),
      proxyAuth: m,
      headers: t,
      rejectUnauthorized: a
    };
  }
};