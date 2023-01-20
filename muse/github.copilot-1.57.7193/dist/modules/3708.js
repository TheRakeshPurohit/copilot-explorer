Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = require(6776);
const i = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: {
    message: "property name must be valid",
    params: ({ params: e }) => r._`{propertyName: ${e.propertyName}}`,
  },
  code(e) {
    const { gen: t, schema: n, data: i, it: s } = e;
    if (o.alwaysValidSchema(s, n)) return;
    const a = t.name("valid");
    t.forIn("key", i, (n) => {
      e.setParams({
        propertyName: n,
      });
      e.subschema(
        {
          keyword: "propertyNames",
          data: n,
          dataTypes: ["string"],
          propertyName: n,
          compositeRule: true,
        },
        a
      );
      t.if(r.not(a), () => {
        e.error(true);
        if (s.allErrors) {
          t.break();
        }
      });
    });
    e.ok(a);
  },
};
exports.default = i;