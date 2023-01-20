function r(e) {
  return e && "object" == typeof e && "default" in e
    ? e
    : {
        default: e,
      };
}
var o = r(require(6008));
const i = (e, t) => t.some((t) => (t instanceof RegExp ? t.test(e) : t === e));
const s = (e, t = false) => {
  const n =
    /^(?:([a-z_][a-z0-9_-]{0,31})@|https?:\/\/)([\w\.\-@]+)[\/:]([\~,\.\w,\-,\_,\/]+?(?:\.git|\/)?)$/;
  const r = (t) => {
    const n = new Error(t);
    throw ((n.subject_url = e), n);
  };
  if ("string" == typeof e && e.trim()) {
    r("Invalid url.");
  }
  if (e.length > s.MAX_INPUT_LENGTH) {
    r(
      "Input exceeds maximum length. If needed, change the value of parseUrl.MAX_INPUT_LENGTH."
    );
  }
  if (t) {
    if ("object" != typeof t) {
      t = {
        stripHash: false,
      };
    }
    e = (function (e, t) {
      t = {
        defaultProtocol: "http:",
        normalizeProtocol: true,
        forceHttp: false,
        forceHttps: false,
        stripAuthentication: true,
        stripHash: false,
        stripTextFragment: true,
        stripWWW: true,
        removeQueryParameters: [/^utm_\w+/i],
        removeTrailingSlash: true,
        removeSingleSlash: true,
        removeDirectoryIndex: false,
        sortQueryParameters: true,
        ...t,
      };
      e = e.trim();
      if (/^data:/i.test(e))
        return ((e, { stripHash: t }) => {
          const n =
            /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(e);
          if (!n) throw new Error(`Invalid URL: ${e}`);
          let { type: r, data: o, hash: i } = n.groups;
          const s = r.split(";");
          i = t ? "" : i;
          let a = !1;
          "base64" === s[s.length - 1] && (s.pop(), (a = !0));
          const c = (s.shift() || "").toLowerCase(),
            l = [
              ...s
                .map((e) => {
                  let [t, n = ""] = e.split("=").map((e) => e.trim());
                  return "charset" === t &&
                    ((n = n.toLowerCase()), "us-ascii" === n)
                    ? ""
                    : `${t}${n ? `=${n}` : ""}`;
                })
                .filter(Boolean),
            ];
          return (
            a && l.push("base64"),
            (l.length > 0 || (c && "text/plain" !== c)) && l.unshift(c),
            `data:${l.join(";")},${a ? o.trim() : o}${i ? `#${i}` : ""}`
          );
        })(e, t);
      if (/^view-source:/i.test(e))
        throw new Error(
          "`view-source:` is not supported as it is a non-standard protocol"
        );
      const n = e.startsWith("//");
      if (!n && /^\.*\//.test(e)) {
        e = e.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, t.defaultProtocol);
      }
      const r = new URL(e);
      if (t.forceHttp && t.forceHttps)
        throw new Error(
          "The `forceHttp` and `forceHttps` options cannot be used together"
        );
      if (t.forceHttp && "https:" === r.protocol) {
        r.protocol = "http:";
      }
      if (t.forceHttps && "http:" === r.protocol) {
        r.protocol = "https:";
      }
      if (t.stripAuthentication) {
        r.username = "";
        r.password = "";
      }
      if (t.stripHash) {
        r.hash = "";
      } else {
        if (t.stripTextFragment) {
          r.hash = r.hash.replace(/#?:~:text.*?$/i, "");
        }
      }
      if (r.pathname) {
        const e = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
        let t = 0,
          n = "";
        for (;;) {
          const o = e.exec(r.pathname);
          if (!o) break;
          const i = o[0],
            s = o.index;
          (n += r.pathname.slice(t, s).replace(/\/{2,}/g, "/")),
            (n += i),
            (t = s + i.length);
        }
        (n += r.pathname.slice(t, r.pathname.length).replace(/\/{2,}/g, "/")),
          (r.pathname = n);
      }
      if (r.pathname)
        try {
          r.pathname = decodeURI(r.pathname);
        } catch {}
      if (true === t.removeDirectoryIndex) {
        t.removeDirectoryIndex = [/^index\.[a-z]+$/];
      }
      if (
        Array.isArray(t.removeDirectoryIndex) &&
        t.removeDirectoryIndex.length > 0
      ) {
        let e = r.pathname.split("/");
        const n = e[e.length - 1];
        i(n, t.removeDirectoryIndex) &&
          ((e = e.slice(0, -1)), (r.pathname = e.slice(1).join("/") + "/"));
      }
      if (r.hostname) {
        r.hostname = r.hostname.replace(/\.$/, "");
        if (
          t.stripWWW &&
          /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(r.hostname)
        ) {
          r.hostname = r.hostname.replace(/^www\./, "");
        }
      }
      if (Array.isArray(t.removeQueryParameters))
        for (const e of [...r.searchParams.keys()])
          i(e, t.removeQueryParameters) && r.searchParams.delete(e);
      if (true === t.removeQueryParameters) {
        r.search = "";
      }
      if (t.sortQueryParameters) {
        r.searchParams.sort();
        try {
          r.search = decodeURIComponent(r.search);
        } catch {}
      }
      if (t.removeTrailingSlash) {
        r.pathname = r.pathname.replace(/\/$/, "");
      }
      const o = e;
      e = r.toString();
      if (
        t.removeSingleSlash ||
        "/" !== r.pathname ||
        o.endsWith("/") ||
        "" !== r.hash
      ) {
        e = e.replace(/\/$/, "");
      }
      if (
        (t.removeTrailingSlash || "/" === r.pathname) &&
        "" === r.hash &&
        t.removeSingleSlash
      ) {
        e = e.replace(/\/$/, "");
      }
      if (n && !t.normalizeProtocol) {
        e = e.replace(/^http:\/\//, "//");
      }
      if (t.stripProtocol) {
        e = e.replace(/^(?:https?:)?\/\//, "");
      }
      return e;
    })(e, t);
  }
  const a = o.default(e);
  if (a.parse_failed) {
    const e = a.href.match(n);
    if (e) {
      a.protocols = ["ssh"];
      a.protocol = "ssh";
      a.resource = e[2];
      a.host = e[2];
      a.user = e[1];
      a.pathname = `/${e[3]}`;
      a.parse_failed = false;
    } else {
      r("URL parsing failed.");
    }
  }
  return a;
};
s.MAX_INPUT_LENGTH = 2048;
module.exports = s;