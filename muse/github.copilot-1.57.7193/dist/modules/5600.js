const { PassThrough: r, Readable: o } = require("stream");
const {
  types: { isAnyArrayBuffer: i },
} = require("util");
const { FetchError: s, FetchBaseError: a } = require(3683);
const { streamToBuffer: c } = require(4544);
const l = Buffer.alloc(0);
const u = Symbol("Body internals");
const d = async (e) => {
  if (e[u].disturbed) throw new TypeError("Already read");
  if (e[u].error)
    throw new TypeError(`Stream had error: ${e[u].error.message}`);
  e[u].disturbed = true;
  const { stream: t } = e[u];
  return null === t ? l : c(t);
};
class p {
  constructor(e) {
    let t;
    t =
      null == e
        ? null
        : e instanceof URLSearchParams
        ? o.from(e.toString())
        : e instanceof o
        ? e
        : Buffer.isBuffer(e)
        ? o.from(e)
        : i(e)
        ? o.from(Buffer.from(e))
        : "string" == typeof e || e instanceof String
        ? o.from(e)
        : o.from(String(e));
    this[u] = {
      stream: t,
      disturbed: false,
      error: null,
    };
    if (e instanceof o) {
      t.on("error", (e) => {
        const t =
          e instanceof a
            ? e
            : new s(
                `Invalid response body while trying to fetch ${this.url}: ${e.message}`,
                "system",
                e
              );
        this[u].error = t;
      });
    }
  }
  get body() {
    return this[u].stream;
  }
  get bodyUsed() {
    return this[u].disturbed;
  }
  async buffer() {
    return d(this);
  }
  async arrayBuffer() {
    return (e = await this.buffer()).buffer.slice(
      e.byteOffset,
      e.byteOffset + e.byteLength
    );
    var e;
  }
  async text() {
    return (await d(this)).toString();
  }
  async json() {
    return JSON.parse(await this.text());
  }
}
Object.defineProperties(p.prototype, {
  body: {
    enumerable: true,
  },
  bodyUsed: {
    enumerable: true,
  },
  arrayBuffer: {
    enumerable: true,
  },
  json: {
    enumerable: true,
  },
  text: {
    enumerable: true,
  },
});
module.exports = {
  Body: p,
  cloneStream: (e) => {
    if (e[u].disturbed) throw new TypeError("Cannot clone: already read");
    const { stream: t } = e[u];
    let n = t;
    if (t instanceof o) {
      n = new r();
      const o = new r();
      t.pipe(n);
      t.pipe(o);
      e[u].stream = o;
    }
    return n;
  },
  guessContentType: (e) =>
    null === e
      ? null
      : "string" == typeof e
      ? "text/plain; charset=utf-8"
      : e instanceof URLSearchParams
      ? "application/x-www-form-urlencoded; charset=utf-8"
      : Buffer.isBuffer(e) || i(e) || e instanceof o
      ? null
      : "text/plain; charset=utf-8",
};