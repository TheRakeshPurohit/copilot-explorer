Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.reportTypeError =
  exports.checkDataTypes =
  exports.checkDataType =
  exports.coerceAndCheckDataType =
  exports.getJSONTypes =
  exports.getSchemaTypes =
  exports.DataType =
    undefined;
const r = require(3141);
const o = require(8876);
const i = require(4181);
const s = require(3487);
const a = require(6776);
var c;
function getJSONTypes(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(r.isJSONType)) return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
!(function (e) {
  e[(e.Correct = 0)] = "Correct";
  e[(e.Wrong = 1)] = "Wrong";
})((c = exports.DataType || (exports.DataType = {})));
exports.getSchemaTypes = function (e) {
  const t = getJSONTypes(e.type);
  if (t.includes("null")) {
    if (false === e.nullable)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && undefined !== e.nullable)
      throw new Error('"nullable" cannot be used without "type"');
    if (true === e.nullable) {
      t.push("null");
    }
  }
  return t;
};
exports.getJSONTypes = getJSONTypes;
exports.coerceAndCheckDataType = function (e, t) {
  const { gen: n, data: r, opts: i } = e;
  const a = (function (e, t) {
    return t
      ? e.filter((e) => u.has(e) || ("array" === t && "array" === e))
      : [];
  })(t, i.coerceTypes);
  const l =
    t.length > 0 &&
    !(0 === a.length && 1 === t.length && o.schemaHasRulesForType(e, t[0]));
  if (l) {
    const o = checkDataTypes(t, r, i.strictNumbers, c.Wrong);
    n.if(o, () => {
      if (a.length) {
        (function (e, t, n) {
          const { gen: r, data: o, opts: i } = e;
          const a = r.let("dataType", s._`typeof ${o}`);
          const c = r.let("coerced", s._`undefined`);
          if ("array" === i.coerceTypes) {
            r.if(
              s._`${a} == 'object' && Array.isArray(${o}) && ${o}.length == 1`,
              () =>
                r
                  .assign(o, s._`${o}[0]`)
                  .assign(a, s._`typeof ${o}`)
                  .if(checkDataTypes(t, o, i.strictNumbers), () =>
                    r.assign(c, o)
                  )
            );
          }
          r.if(s._`${c} !== undefined`);
          for (const e of n)
            if (u.has(e) || ("array" === e && "array" === i.coerceTypes)) {
              l(e);
            }
          function l(e) {
            switch (e) {
              case "string":
                return void r
                  .elseIf(s._`${a} == "number" || ${a} == "boolean"`)
                  .assign(c, s._`"" + ${o}`)
                  .elseIf(s._`${o} === null`)
                  .assign(c, s._`""`);
              case "number":
                return void r
                  .elseIf(
                    s._`${a} == "boolean" || ${o} === null
              || (${a} == "string" && ${o} && ${o} == +${o})`
                  )
                  .assign(c, s._`+${o}`);
              case "integer":
                return void r
                  .elseIf(
                    s._`${a} === "boolean" || ${o} === null
              || (${a} === "string" && ${o} && ${o} == +${o} && !(${o} % 1))`
                  )
                  .assign(c, s._`+${o}`);
              case "boolean":
                return void r
                  .elseIf(s._`${o} === "false" || ${o} === 0 || ${o} === null`)
                  .assign(c, false)
                  .elseIf(s._`${o} === "true" || ${o} === 1`)
                  .assign(c, true);
              case "null":
                r.elseIf(s._`${o} === "" || ${o} === 0 || ${o} === false`);
                return void r.assign(c, null);
              case "array":
                r.elseIf(
                  s._`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${o} === null`
                ).assign(c, s._`[${o}]`);
            }
          }
          r.else();
          reportTypeError(e);
          r.endIf();
          r.if(s._`${c} !== undefined`, () => {
            r.assign(o, c);
            (function ({ gen: e, parentData: t, parentDataProperty: n }, r) {
              e.if(s._`${t} !== undefined`, () => e.assign(s._`${t}[${n}]`, r));
            })(e, c);
          });
        })(e, t, a);
      } else {
        reportTypeError(e);
      }
    });
  }
  return l;
};
const u = new Set(["string", "number", "integer", "boolean", "null"]);
function checkDataType(e, t, n, r = c.Correct) {
  const o = r === c.Correct ? s.operators.EQ : s.operators.NEQ;
  let i;
  switch (e) {
    case "null":
      return s._`${t} ${o} null`;
    case "array":
      i = s._`Array.isArray(${t})`;
      break;
    case "object":
      i = s._`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      i = a(s._`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      i = a();
      break;
    default:
      return s._`typeof ${t} ${o} ${e}`;
  }
  return r === c.Correct ? i : s.not(i);
  function a(e = s.nil) {
    return s.and(
      s._`typeof ${t} == "number"`,
      e,
      n ? s._`isFinite(${t})` : s.nil
    );
  }
}
function checkDataTypes(e, t, n, r) {
  if (1 === e.length) return checkDataType(e[0], t, n, r);
  let o;
  const i = a.toHash(e);
  if (i.array && i.object) {
    const e = s._`typeof ${t} != "object"`;
    o = i.null ? e : s._`!${t} || ${e}`;
    delete i.null;
    delete i.array;
    delete i.object;
  } else o = s.nil;
  if (i.number) {
    delete i.integer;
  }
  for (const e in i) o = s.and(o, checkDataType(e, t, n, r));
  return o;
}
exports.checkDataType = checkDataType;
exports.checkDataTypes = checkDataTypes;
const h = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) =>
    "string" == typeof e ? s._`{type: ${e}}` : s._`{type: ${t}}`,
};
function reportTypeError(e) {
  const t = (function (e) {
    const { gen: t, data: n, schema: r } = e;
    const o = a.schemaRefOrVal(e, r, "type");
    return {
      gen: t,
      keyword: "type",
      data: n,
      schema: r.type,
      schemaCode: o,
      schemaValue: o,
      parentSchema: r,
      params: {},
      it: e,
    };
  })(e);
  i.reportError(t, h);
}
exports.reportTypeError = reportTypeError;