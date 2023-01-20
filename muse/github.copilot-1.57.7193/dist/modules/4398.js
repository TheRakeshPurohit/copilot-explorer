Object.defineProperty(exports, "__esModule", {
  value: true,
});
process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL = true;
var r = require("fs");
var o = require("os");
var i = require("path");
var s = require("vscode");
var a = require(9574);
var c = (function () {
  function e(e, t, n, o) {
    var a = this;
    this.extensionId = e;
    this.extensionVersion = t;
    this.firstParty = false;
    this.userOptIn = false;
    this.firstParty = !!o;
    var c = process.env.VSCODE_LOGS || "";
    if (c && e && "trace" === process.env.VSCODE_LOG_LEVEL) {
      c = i.join(c, e + ".txt");
      this.logStream = r.createWriteStream(c, {
        flags: "a",
        encoding: "utf8",
        autoClose: true,
      });
    }
    this.updateUserOptIn(n);
    if (undefined !== s.env.onDidChangeTelemetryEnabled) {
      this.optOutListener = s.env.onDidChangeTelemetryEnabled(function () {
        return a.updateUserOptIn(n);
      });
    } else {
      this.optOutListener = s.workspace.onDidChangeConfiguration(function () {
        return a.updateUserOptIn(n);
      });
    }
  }
  e.prototype.updateUserOptIn = function (t) {
    var n = s.workspace.getConfiguration(e.TELEMETRY_CONFIG_ID);
    var r =
      undefined === s.env.isTelemetryEnabled
        ? n.get(e.TELEMETRY_CONFIG_ENABLED_ID, true)
        : s.env.isTelemetryEnabled;
    if (this.userOptIn !== r) {
      this.userOptIn = r;
      if (this.userOptIn) {
        this.createAppInsightsClient(t);
      } else {
        this.dispose();
      }
    }
  };
  e.prototype.createAppInsightsClient = function (e) {
    if (a.defaultClient) {
      this.appInsightsClient = new a.TelemetryClient(e);
      this.appInsightsClient.channel.setUseDiskRetryCaching(true);
    } else {
      a.setup(e)
        .setAutoCollectRequests(false)
        .setAutoCollectPerformance(false)
        .setAutoCollectExceptions(false)
        .setAutoCollectDependencies(false)
        .setAutoDependencyCorrelation(false)
        .setAutoCollectConsole(false)
        .setUseDiskRetryCaching(true)
        .start();
      this.appInsightsClient = a.defaultClient;
    }
    this.appInsightsClient.commonProperties = this.getCommonProperties();
    if (s && s.env) {
      this.appInsightsClient.context.tags[
        this.appInsightsClient.context.keys.userId
      ] = s.env.machineId;
      this.appInsightsClient.context.tags[
        this.appInsightsClient.context.keys.sessionId
      ] = s.env.sessionId;
    }
    if (e && 0 === e.indexOf("AIF-")) {
      this.appInsightsClient.config.endpointUrl =
        "https://vortex.data.microsoft.com/collect/v1";
      this.firstParty = true;
    }
  };
  e.prototype.getCommonProperties = function () {
    var e = Object.create(null);
    e["common.os"] = o.platform();
    e["common.platformversion"] = (o.release() || "").replace(
      /^(\d+)(\.\d+)?(\.\d+)?(.*)/,
      "$1$2$3"
    );
    e["common.extname"] = this.extensionId;
    e["common.extversion"] = this.extensionVersion;
    if (s && s.env) {
      switch (
        ((e["common.vscodemachineid"] = s.env.machineId),
        (e["common.vscodesessionid"] = s.env.sessionId),
        (e["common.vscodeversion"] = s.version),
        (e["common.isnewappinstall"] = s.env.isNewAppInstall),
        s.env.uiKind)
      ) {
        case s.UIKind.Web:
          e["common.uikind"] = "web";
          break;
        case s.UIKind.Desktop:
          e["common.uikind"] = "desktop";
          break;
        default:
          e["common.uikind"] = "unknown";
      }
      e["common.remotename"] = this.cleanRemoteName(s.env.remoteName);
    }
    return e;
  };
  e.prototype.cleanRemoteName = function (e) {
    if (!e) return "none";
    var t = "other";
    ["ssh-remote", "dev-container", "attached-container", "wsl"].forEach(
      function (n) {
        if (0 === e.indexOf(n + "+")) {
          t = n;
        }
      }
    );
    return t;
  };
  e.prototype.shouldSendErrorTelemetry = function () {
    return (
      !this.firstParty ||
      "other" !== this.cleanRemoteName(s.env.remoteName) ||
      (undefined !== this.extension &&
        this.extension.extensionKind !== s.ExtensionKind.Workspace &&
        s.env.uiKind !== s.UIKind.Web)
    );
  };
  Object.defineProperty(e.prototype, "extension", {
    get: function () {
      if (undefined === this._extension) {
        this._extension = s.extensions.getExtension(this.extensionId);
      }
      return this._extension;
    },
    enumerable: false,
    configurable: true,
  });
  e.prototype.cloneAndChange = function (e, t) {
    if (null === e || "object" != typeof e) return e;
    if ("function" != typeof t) return e;
    var n = {};
    for (var r in e) n[r] = t(r, e[r]);
    return n;
  };
  e.prototype.anonymizeFilePaths = function (e, t) {
    if (null == e) return "";
    var n = [
      new RegExp(s.env.appRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
    ];
    if (this.extension) {
      n.push(
        new RegExp(
          this.extension.extensionPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        )
      );
    }
    var r = e;
    if (t) {
      for (o = [], i = 0, a = n, undefined; i < a.length; i++) {
        var o;
        var i;
        var a;
        for (var c = a[i]; ; ) {
          var l = c.exec(e);
          if (!l) break;
          o.push([l.index, c.lastIndex]);
        }
      }
      var u = /^[\\\/]?(node_modules|node_modules\.asar)[\\\/]/;
      var d =
        /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-\._]+(\\\\|\\|\/))+[\w-\._]*/g;
      var p = 0;
      r = "";
      for (
        var h = function () {
          var t = d.exec(e);
          if (!t) return "break";
          if (
            !u.test(t[0]) &&
            o.every(function (e) {
              var n = e[0];
              var r = e[1];
              return t.index < n || t.index >= r;
            })
          ) {
            r += e.substring(p, t.index) + "<REDACTED: user-file-path>";
            p = d.lastIndex;
          }
        };
        "break" !== h();

      );
      if (p < e.length) {
        r += e.substr(p);
      }
    }
    for (f = 0, m = n, undefined; f < m.length; f++) {
      var f;
      var m;
      c = m[f];
      r = r.replace(c, "");
    }
    return r;
  };
  e.prototype.sendTelemetryEvent = function (e, t, n) {
    var r = this;
    if (this.userOptIn && e && this.appInsightsClient) {
      var o = this.cloneAndChange(t, function (e, t) {
        return r.anonymizeFilePaths(t, r.firstParty);
      });
      this.appInsightsClient.trackEvent({
        name: this.extensionId + "/" + e,
        properties: o,
        measurements: n,
      });
      if (this.logStream) {
        this.logStream.write(
          "telemetry/" +
            e +
            " " +
            JSON.stringify({
              properties: t,
              measurements: n,
            }) +
            "\n"
        );
      }
    }
  };
  e.prototype.sendTelemetryErrorEvent = function (e, t, n, r) {
    var o = this;
    if (this.userOptIn && e && this.appInsightsClient) {
      var i = this.cloneAndChange(t, function (e, t) {
        return o.shouldSendErrorTelemetry()
          ? o.anonymizeFilePaths(t, o.firstParty)
          : undefined === r || -1 !== r.indexOf(e)
          ? "REDACTED"
          : o.anonymizeFilePaths(t, o.firstParty);
      });
      this.appInsightsClient.trackEvent({
        name: this.extensionId + "/" + e,
        properties: i,
        measurements: n,
      });
      if (this.logStream) {
        this.logStream.write(
          "telemetry/" +
            e +
            " " +
            JSON.stringify({
              properties: t,
              measurements: n,
            }) +
            "\n"
        );
      }
    }
  };
  e.prototype.sendTelemetryException = function (e, t, n) {
    var r = this;
    if (
      this.shouldSendErrorTelemetry() &&
      this.userOptIn &&
      e &&
      this.appInsightsClient
    ) {
      var o = this.cloneAndChange(t, function (e, t) {
        return r.anonymizeFilePaths(t, r.firstParty);
      });
      this.appInsightsClient.trackException({
        exception: e,
        properties: o,
        measurements: n,
      });
      if (this.logStream) {
        this.logStream.write(
          "telemetry/" +
            e.name +
            " " +
            e.message +
            " " +
            JSON.stringify({
              properties: t,
              measurements: n,
            }) +
            "\n"
        );
      }
    }
  };
  e.prototype.dispose = function () {
    var e = this;
    this.optOutListener.dispose();
    var t = new Promise(function (t) {
      if (!e.logStream) return t(undefined);
      e.logStream.on("finish", t);
      e.logStream.end();
    });
    var n = new Promise(function (t) {
      if (e.appInsightsClient) {
        e.appInsightsClient.flush({
          callback: function () {
            e.appInsightsClient = undefined;
            t(undefined);
          },
        });
      } else {
        t(undefined);
      }
    });
    return Promise.all([n, t]);
  };
  e.TELEMETRY_CONFIG_ID = "telemetry";
  e.TELEMETRY_CONFIG_ENABLED_ID = "enableTelemetry";
  return e;
})();
exports.default = c;