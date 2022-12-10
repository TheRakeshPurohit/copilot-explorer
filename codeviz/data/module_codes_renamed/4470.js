var r = require("os"),
  o = require("fs"),
  i = require("path"),
  M_copilot_utils_NOTSURE = require("copilot-utils"),
  M_logging_NOTSURE = require("logging"),
  c = (function () {
    function e(e) {
      this.keys = new M_copilot_utils_NOTSURE.ContextTagKeys();
      this.tags = {};
      this._loadApplicationContext();
      this._loadDeviceContext();
      this._loadInternalContext();
    }
    e.prototype._loadApplicationContext = function (t) {
      t = t || i.resolve(__dirname, "../../../../package.json");
      if (!e.appVersion[t]) {
        e.appVersion[t] = "unknown";
        try {
          var n = JSON.parse(o.readFileSync(t, "utf8"));
          n && "string" == typeof n.version && (e.appVersion[t] = n.version);
        } catch (e) {
          M_logging_NOTSURE.info("unable to read app version: ", e);
        }
      }
      this.tags[this.keys.applicationVersion] = e.appVersion[t];
    };
    e.prototype._loadDeviceContext = function () {
      this.tags[this.keys.deviceId] = "";
      this.tags[this.keys.cloudRoleInstance] = r && r.hostname();
      this.tags[this.keys.deviceOSVersion] = r && r.type() + " " + r.release();
      this.tags[this.keys.cloudRole] = e.DefaultRoleName;
      this.tags["ai.device.osArchitecture"] = r && r.arch();
      this.tags["ai.device.osPlatform"] = r && r.platform();
    };
    e.prototype._loadInternalContext = function () {
      var t = i.resolve(__dirname, "../../package.json");
      if (!e.sdkVersion) {
        e.sdkVersion = "unknown";
        try {
          var n = JSON.parse(o.readFileSync(t, "utf8"));
          if (n && "string" == typeof n.version) {
            e.sdkVersion = n.version;
          }
        } catch (e) {
          M_logging_NOTSURE.info("unable to read app version: ", e);
        }
      }
      this.tags[this.keys.internalSdkVersion] = "node:" + e.sdkVersion;
    };
    e.DefaultRoleName = "Web";
    e.appVersion = {};
    e.sdkVersion = null;
    return e;
  })();
module.exports = c;