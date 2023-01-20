Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.extensionFileSystem = undefined;
const r = require("vscode");
exports.extensionFileSystem = {
  readFile: async function (e) {
    return await r.workspace.fs.readFile(r.Uri.file(e));
  },
  mtime: async function (e) {
    return (await r.workspace.fs.stat(r.Uri.file(e))).mtime;
  },
  stat: async function (e) {
    return await r.workspace.fs.stat(r.Uri.file(e));
  },
};