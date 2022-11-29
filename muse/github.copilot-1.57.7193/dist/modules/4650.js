var r,
  o = this && this.__extends || (r = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
  }, function (e, t) {
    function n() {
      this.constructor = e;
    }
    r(e, t);
    e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
  }),
  i = this && this.__rest || function (e, t) {
    var n = {};
    for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var o = 0;
      for (r = Object.getOwnPropertySymbols(e); o < r.length; o++) t.indexOf(r[o]) < 0 && (n[r[o]] = e[r[o]]);
    }
    return n;
  };
Object.defineProperty(exports, "__esModule", {
  value: !0
});
var s = require(4953);
exports.winston3 = {
  versionSpecifier: "3.x",
  patch: function (e) {
    var t = function (e) {
      function t(t, n) {
        var r = e.call(this, n) || this;
        r.winston = t;
        return r;
      }
      o(t, e);
      t.prototype.log = function (e, t) {
        var n = e.message,
          r = e.level,
          o = e.meta,
          a = i(e, ["message", "level", "meta"]);
        r = "function" == typeof Symbol.for ? e[Symbol.for("level")] : r;
        n = e instanceof Error ? e : n;
        var c = function (e, t) {
          return null != e.config.npm.levels[t] ? "npm" : null != e.config.syslog.levels[t] ? "syslog" : "unknown";
        }(this.winston, r);
        for (var l in o = o || {}, a) a.hasOwnProperty(l) && (o[l] = a[l]);
        s.channel.publish("winston", {
          message: n,
          level: r,
          levelKind: c,
          meta: o
        });
        t();
      };
      return t;
    }(e.Transport);
    function n() {
      var n,
        r = arguments[0].levels || e.config.npm.levels;
      for (var o in r) r.hasOwnProperty(o) && (n = undefined === n || r[o] > r[n] ? o : n);
      this.add(new t(e, {
        level: n
      }));
    }
    var r = e.createLogger;
    e.createLogger = function () {
      var o,
        i = arguments[0].levels || e.config.npm.levels;
      for (var s in i) i.hasOwnProperty(s) && (o = undefined === o || i[s] > i[o] ? s : o);
      var a = r.apply(this, arguments);
      a.add(new t(e, {
        level: o
      }));
      var c = a.configure;
      a.configure = function () {
        c.apply(this, arguments);
        n.apply(this, arguments);
      };
      return a;
    };
    var a = e.createLogger;
    e.configure = function () {
      a.apply(this, arguments);
      n.apply(this, arguments);
    };
    e.add(new t(e));
    return e;
  }
};
exports.winston2 = {
  versionSpecifier: "2.x",
  patch: function (e) {
    var t,
      n = e.Logger.prototype.log,
      r = function (n, r, o) {
        var i;
        i = t === e.config.npm.levels ? "npm" : t === e.config.syslog.levels ? "syslog" : "unknown";
        s.channel.publish("winston", {
          level: n,
          message: r,
          meta: o,
          levelKind: i
        });
        return r;
      };
    e.Logger.prototype.log = function () {
      t = this.levels;
      this.filters && 0 !== this.filters.length ? this.filters[this.filters.length - 1] !== r && (this.filters = this.filters.filter(function (e) {
        return e !== r;
      }), this.filters.push(r)) : this.filters = [r];
      return n.apply(this, arguments);
    };
    return e;
  }
};
exports.enable = function () {
  s.channel.registerMonkeyPatch("winston", exports.winston2);
  s.channel.registerMonkeyPatch("winston", exports.winston3);
};