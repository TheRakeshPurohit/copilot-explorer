const {
    AbortSignal: r
  } = require(6829),
  {
    Body: o,
    cloneStream: i,
    guessContentType: s
  } = require(5600),
  {
    Headers: a
  } = require(9872),
  {
    isPlainObject: c
  } = require(4544),
  {
    isFormData: l,
    FormDataSerializer: u
  } = require(9407),
  d = Symbol("Request internals");
class p extends o {
  constructor(e, t = {}) {
    const n = e instanceof p ? e : null,
      o = n ? new URL(n.url) : new URL(e);
    let h = t.method || n && n.method || "GET";
    h = h.toUpperCase();
    if ((null != t.body || n && null !== n.body) && ["GET", "HEAD"].includes(h)) throw new TypeError("Request with GET/HEAD method cannot have body");
    let f = t.body || (n && n.body ? i(n) : null);
    const m = new a(t.headers || n && n.headers || {});
    if (l(f) && !m.has("content-type")) {
      const e = new u(f);
      f = e.stream();
      m.set("content-type", e.contentType());
      m.has("transfer-encoding") || m.has("content-length") || m.set("content-length", e.length());
    }
    if (!m.has("content-type")) if (c(f)) {
      f = JSON.stringify(f);
      m.set("content-type", "application/json");
    } else {
      const e = s(f);
      e && m.set("content-type", e);
    }
    super(f);
    let g = n ? n.signal : null;
    "signal" in t && (g = t.signal);
    if (g && !(g instanceof r)) throw new TypeError("signal needs to be an instance of AbortSignal");
    const _ = t.redirect || n && n.redirect || "follow";
    if (!["follow", "error", "manual"].includes(_)) throw new TypeError(`'${_}' is not a valid redirect option`);
    const y = t.cache || n && n.cache || "default";
    if (!["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"].includes(y)) throw new TypeError(`'${y}' is not a valid cache option`);
    this[d] = {
      init: {
        ...t
      },
      method: h,
      redirect: _,
      cache: y,
      headers: m,
      parsedURL: o,
      signal: g
    };
    undefined === t.follow ? n && undefined !== n.follow ? this.follow = n.follow : this.follow = 20 : this.follow = t.follow;
    this.counter = t.counter || n && n.counter || 0;
    undefined === t.compress ? n && undefined !== n.compress ? this.compress = n.compress : this.compress = !0 : this.compress = t.compress;
    undefined === t.decode ? n && undefined !== n.decode ? this.decode = n.decode : this.decode = !0 : this.decode = t.decode;
  }
  get method() {
    return this[d].method;
  }
  get url() {
    return this[d].parsedURL.toString();
  }
  get headers() {
    return this[d].headers;
  }
  get redirect() {
    return this[d].redirect;
  }
  get cache() {
    return this[d].cache;
  }
  get signal() {
    return this[d].signal;
  }
  clone() {
    return new p(this);
  }
  get init() {
    return this[d].init;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
Object.defineProperties(p.prototype, {
  method: {
    enumerable: !0
  },
  url: {
    enumerable: !0
  },
  headers: {
    enumerable: !0
  },
  redirect: {
    enumerable: !0
  },
  cache: {
    enumerable: !0
  },
  clone: {
    enumerable: !0
  },
  signal: {
    enumerable: !0
  }
});
module.exports = {
  Request: p
};