Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.validateTuple = undefined;
const r = require(3487);
const o = require(6776);
const i = require(412);
const s = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: n } = e;
    if (Array.isArray(t)) return validateTuple(e, "additionalItems", t);
    n.items = true;
    if (o.alwaysValidSchema(n, t)) {
      e.ok(i.validateArray(e));
    }
  },
};
function validateTuple(e, t, n = e.schema) {
  const { gen: i, parentSchema: s, data: a, keyword: c, it: l } = e;
  !(function (e) {
    const { opts: r, errSchemaPath: i } = l;
    const s = n.length;
    const a = s === e.minItems && (s === e.maxItems || false === e[t]);
    if (r.strictTuples && !a) {
      const e = `"${c}" is ${s}-tuple, but minItems or maxItems/${t} are not specified or different at path "${i}"`;
      o.checkStrictMode(l, e, r.strictTuples);
    }
  })(s);
  if (l.opts.unevaluated && n.length && true !== l.items) {
    l.items = o.mergeEvaluated.items(i, n.length, l.items);
  }
  const u = i.name("valid");
  const d = i.const("len", r._`${a}.length`);
  n.forEach((t, n) => {
    if (o.alwaysValidSchema(l, t)) {
      i.if(r._`${d} > ${n}`, () =>
        e.subschema(
          {
            keyword: c,
            schemaProp: n,
            dataProp: n,
          },
          u
        )
      );
      e.ok(u);
    }
  });
}
exports.validateTuple = validateTuple;
exports.default = s;