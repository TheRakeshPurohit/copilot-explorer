Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.validateSchemaDeps =
  exports.validatePropertyDeps =
  exports.error =
    undefined;
const r = require(3487);
const o = require(6776);
const i = require(412);
exports.error = {
  message: ({ params: { property: e, depsCount: t, deps: n } }) => {
    const o = 1 === t ? "property" : "properties";
    return r.str`must have ${o} ${n} when property ${e} is present`;
  },
  params: ({
    params: { property: e, depsCount: t, deps: n, missingProperty: o },
  }) => r._`{property: ${e},
    missingProperty: ${o},
    depsCount: ${t},
    deps: ${n}}`,
};
const s = {
  keyword: "dependencies",
  type: "object",
  schemaType: "object",
  error: exports.error,
  code(e) {
    const [t, n] = (function ({ schema: e }) {
      const t = {};
      const n = {};
      for (const r in e)
        if ("__proto__" !== r) {
          (Array.isArray(e[r]) ? t : n)[r] = e[r];
        }
      return [t, n];
    })(e);
    validatePropertyDeps(e, t);
    validateSchemaDeps(e, n);
  },
};
function validatePropertyDeps(e, t = e.schema) {
  const { gen: n, data: o, it: s } = e;
  if (0 === Object.keys(t).length) return;
  const a = n.let("missing");
  for (const c in t) {
    const l = t[c];
    if (0 === l.length) continue;
    const u = i.propertyInData(n, o, c, s.opts.ownProperties);
    e.setParams({
      property: c,
      depsCount: l.length,
      deps: l.join(", "),
    });
    if (s.allErrors) {
      n.if(u, () => {
        for (const t of l) i.checkReportMissingProp(e, t);
      });
    } else {
      n.if(r._`${u} && (${i.checkMissingProp(e, l, a)})`);
      i.reportMissingProp(e, a);
      n.else();
    }
  }
}
function validateSchemaDeps(e, t = e.schema) {
  const { gen: n, data: r, keyword: s, it: a } = e;
  const c = n.name("valid");
  for (const l in t)
    if (o.alwaysValidSchema(a, t[l])) {
      n.if(
        i.propertyInData(n, r, l, a.opts.ownProperties),
        () => {
          const t = e.subschema(
            {
              keyword: s,
              schemaProp: l,
            },
            c
          );
          e.mergeValidEvaluated(t, c);
        },
        () => n.var(c, true)
      );
      e.ok(c);
    }
}
exports.validatePropertyDeps = validatePropertyDeps;
exports.validateSchemaDeps = validateSchemaDeps;
exports.default = s;