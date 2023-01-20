const { Body: r, cloneStream: o, guessContentType: i } = require(5600);
const { Headers: s } = require(9872);
const { isPlainObject: a } = require(4544);
const { isFormData: c, FormDataSerializer: l } = require(9407);
const u = Symbol("Response internals");
class d extends r {
  constructor(e = null, t = {}) {
    const n = new s(t.headers);
    let r = e;
    if (c(r) && !n.has("content-type")) {
      const e = new l(r);
      r = e.stream();
      n.set("content-type", e.contentType());
      if (n.has("transfer-encoding") || n.has("content-length")) {
        n.set("content-length", e.length());
      }
    }
    if (null !== r && !n.has("content-type"))
      if (a(r)) {
        r = JSON.stringify(r);
        n.set("content-type", "application/json");
      } else {
        const e = i(r);
        if (e) {
          n.set("content-type", e);
        }
      }
    super(r);
    this[u] = {
      url: t.url,
      status: t.status || 200,
      statusText: t.statusText || "",
      headers: n,
      httpVersion: t.httpVersion,
      decoded: t.decoded,
      counter: t.counter,
    };
  }
  get url() {
    return this[u].url || "";
  }
  get status() {
    return this[u].status;
  }
  get statusText() {
    return this[u].statusText;
  }
  get ok() {
    return this[u].status >= 200 && this[u].status < 300;
  }
  get redirected() {
    return this[u].counter > 0;
  }
  get headers() {
    return this[u].headers;
  }
  get httpVersion() {
    return this[u].httpVersion;
  }
  get decoded() {
    return this[u].decoded;
  }
  static redirect(e, t = 302) {
    if (![301, 302, 303, 307, 308].includes(t))
      throw new RangeError("Invalid status code");
    return new d(null, {
      headers: {
        location: new URL(e).toString(),
      },
      status: t,
    });
  }
  clone() {
    if (this.bodyUsed) throw new TypeError("Cannot clone: already read");
    return new d(o(this), {
      ...this[u],
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
Object.defineProperties(d.prototype, {
  url: {
    enumerable: true,
  },
  status: {
    enumerable: true,
  },
  ok: {
    enumerable: true,
  },
  redirected: {
    enumerable: true,
  },
  statusText: {
    enumerable: true,
  },
  headers: {
    enumerable: true,
  },
  clone: {
    enumerable: true,
  },
});
module.exports = {
  Response: d,
};