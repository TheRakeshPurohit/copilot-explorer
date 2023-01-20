Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ExtensionLocationFactory = undefined;
const r = require("vscode");
const o = require(6403);
class ExtensionLocationFactory extends o.LocationFactory {
  range(e, t, n, o) {
    return undefined !== n && undefined !== o
      ? new r.Range(e, t, n, o)
      : new r.Range(e, t);
  }
  position(e, t) {
    return new r.Position(e, t);
  }
}
exports.ExtensionLocationFactory = ExtensionLocationFactory;