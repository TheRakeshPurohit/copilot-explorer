Object.defineProperty(exports, "__esModule", {
  value: true,
});
var r = require(4953);
var o = require("path");
exports.mysql = {
  versionSpecifier: ">= 2.0.0 < 3.0.0",
  patch: function (e, t) {
    var i = function (e, t) {
      return function (t, n) {
        var o = e[t];
        if (o) {
          e[t] = function () {
            for (
              e = arguments.length - 1, t = arguments.length - 1, undefined;
              t >= 0;
              --t
            ) {
              var e;
              var t;
              if ("function" == typeof arguments[t]) {
                e = t;
                break;
              }
              if (undefined !== arguments[t]) break;
            }
            var i = arguments[e];
            var s = {
              result: null,
              startTime: null,
              startDate: null,
            };
            if ("function" == typeof i) {
              if (n) {
                s.startTime = process.hrtime();
                s.startDate = new Date();
                arguments[e] = r.channel.bindToContext(n(s, i));
              } else {
                arguments[e] = r.channel.bindToContext(i);
              }
            }
            var a = o.apply(this, arguments);
            s.result = a;
            return a;
          };
        }
      };
    };
    var s = function (e, t) {
      return i(e.prototype);
    };
    var a = require(4694)(o.dirname(t) + "/lib/Connection");
    ["connect", "changeUser", "ping", "statistics", "end"].forEach(function (
      e
    ) {
      return s(a)(e);
    });
    i(a)("createQuery", function (e, t) {
      return function (n) {
        var o = process.hrtime(e.startTime);
        var i = (1e3 * o[0] + o[1] / 1e6) | 0;
        r.channel.publish("mysql", {
          query: e.result,
          callbackArgs: arguments,
          err: n,
          duration: i,
          time: e.startDate,
        });
        t.apply(this, arguments);
      };
    });
    var c = require(420)(o.dirname(t) + "/lib/Pool");
    ["_enqueueCallback"].forEach(function (e) {
      return s(c)(e);
    });
    return e;
  },
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("mysql", exports.mysql);
};