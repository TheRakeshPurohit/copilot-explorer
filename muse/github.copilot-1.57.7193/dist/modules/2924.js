Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(4665);
const o = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => r.validateTuple(e, "items"),
};
exports.default = o;