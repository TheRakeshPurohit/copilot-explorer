Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = require(6776);
const i = require(3510);
const s = {
  keyword: "enum",
  schemaType: "array",
  $data: true,
  error: {
    message: "must be equal to one of the allowed values",
    params: ({ schemaCode: e }) => r._`{allowedValues: ${e}}`,
  },
  code(e) {
    const { gen: t, data: n, $data: s, schema: a, schemaCode: c, it: l } = e;
    if (!s && 0 === a.length) throw new Error("enum must have non-empty array");
    const u = a.length >= l.opts.loopEnum;
    const d = o.useFunc(t, i.default);
    let p;
    if (u || s) {
      p = t.let("valid");
      e.block$data(p, function () {
        t.assign(p, false);
        t.forOf("v", c, (e) =>
          t.if(r._`${d}(${n}, ${e})`, () => t.assign(p, true).break())
        );
      });
    } else {
      if (!Array.isArray(a)) throw new Error("ajv implementation error");
      const e = t.const("vSchema", c);
      p = r.or(
        ...a.map((t, o) =>
          (function (e, t) {
            const o = a[t];
            return "object" == typeof o && null !== o
              ? r._`${d}(${n}, ${e}[${t}])`
              : r._`${n} === ${o}`;
          })(e, o)
        )
      );
    }
    e.pass(p);
  },
};
exports.default = s;