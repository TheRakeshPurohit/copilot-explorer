Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(412);
const o = require(3487);
const i = require(6776);
const s = require(6776);
const a = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, data: a, parentSchema: c, it: l } = e;
    const { opts: u } = l;
    const d = r.allSchemaProperties(n);
    const p = d.filter((e) => i.alwaysValidSchema(l, n[e]));
    if (
      0 === d.length ||
      (p.length === d.length && (!l.opts.unevaluated || true === l.props))
    )
      return;
    const h = u.strictSchema && !u.allowMatchingProperties && c.properties;
    const f = t.name("valid");
    if (true === l.props || l.props instanceof o.Name) {
      l.props = s.evaluatedPropsToName(t, l.props);
    }
    const { props: m } = l;
    function g(e) {
      for (const t in h)
        if (new RegExp(e).test(t)) {
          i.checkStrictMode(
            l,
            `property ${t} matches pattern ${e} (use allowMatchingProperties)`
          );
        }
    }
    function _(n) {
      t.forIn("key", a, (i) => {
        t.if(o._`${r.usePattern(e, n)}.test(${i})`, () => {
          const r = p.includes(n);
          if (r) {
            e.subschema(
              {
                keyword: "patternProperties",
                schemaProp: n,
                dataProp: i,
                dataPropType: s.Type.Str,
              },
              f
            );
          }
          if (l.opts.unevaluated && true !== m) {
            t.assign(o._`${m}[${i}]`, true);
          } else {
            if (r || l.allErrors) {
              t.if(o.not(f), () => t.break());
            }
          }
        });
      });
    }
    !(function () {
      for (const e of d) {
        if (h) {
          g(e);
        }
        if (l.allErrors) {
          _(e);
        } else {
          t.var(f, true);
          _(e);
          t.if(f);
        }
      }
    })();
  },
};
exports.default = a;