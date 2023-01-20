Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.asyncIterableFromArray =
  exports.asyncIterableMapFilter =
  exports.asyncIterableFilter =
  exports.asyncIterableMap =
    undefined;
exports.asyncIterableMap = async function* (e, t) {
  for await (const n of e) yield t(n);
};
exports.asyncIterableFilter = async function* (e, t) {
  for await (const n of e)
    if (await t(n)) {
      yield n;
    }
};
exports.asyncIterableMapFilter = async function* (e, t) {
  for await (const n of e) {
    const e = await t(n);
    if (undefined !== e) {
      yield e;
    }
  }
};
exports.asyncIterableFromArray = async function* (e) {
  for (const t of e) yield t;
};