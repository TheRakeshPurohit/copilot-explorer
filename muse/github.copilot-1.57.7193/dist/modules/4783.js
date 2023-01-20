Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.validateAdditionalItems = undefined;
const r = require(3487);
const o = require(6776);
const i = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: {
    message: ({ params: { len: e } }) =>
      r.str`must NOT have more than ${e} items`,
    params: ({ params: { len: e } }) => r._`{limit: ${e}}`,
  },
  code(e) {
    const { parentSchema: t, it: n } = e;
    const { items: r } = t;
    if (Array.isArray(r)) {
      validateAdditionalItems(e, r);
    } else {
      o.checkStrictMode(
        n,
        '"additionalItems" is ignored when "items" is not an array of schemas'
      );
    }
  },
};
function validateAdditionalItems(e, t) {
  const { gen: n, schema: i, data: s, keyword: a, it: c } = e;
  c.items = true;
  const l = n.const("len", r._`${s}.length`);
  if (false === i) {
    e.setParams({
      len: t.length,
    });
    e.pass(r._`${l} <= ${t.length}`);
  } else if ("object" == typeof i && !o.alwaysValidSchema(c, i)) {
    const i = n.var("valid", r._`${l} <= ${t.length}`);
    n.if(r.not(i), () =>
      (function (i) {
        n.forRange("i", t.length, l, (t) => {
          e.subschema(
            {
              keyword: a,
              dataProp: t,
              dataPropType: o.Type.Num,
            },
            i
          );
          if (c.allErrors) {
            n.if(r.not(i), () => n.break());
          }
        });
      })(i)
    );
    e.ok(i);
  }
}
exports.validateAdditionalItems = validateAdditionalItems;
exports.default = i;