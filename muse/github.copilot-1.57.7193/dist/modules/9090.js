var r;
var o;
var i = require(6372).wrap;
var s = [];
var a = 0;
var c = false;
var l = [];
function u(e, t) {
  var n = e.length;
  var r = t.length;
  var o = [];
  if (0 === n && 0 === r) return o;
  for (var i = 0; i < n; i++) o[i] = e[i];
  if (0 === r) return o;
  for (var s = 0; s < r; s++) {
    var a = true;
    for (i = 0; i < n; i++)
      if (e[i].uid === t[s].uid) {
        a = false;
        break;
      }
    if (a) {
      o.push(t[s]);
    }
  }
  return o;
}
if (process._fatalException) {
  var d;
  var p = false;
  r = function (e) {
    var t = s.length;
    if (p || 0 === t) return false;
    var n = false;
    p = true;
    for (var r = 0; r < t; ++r) {
      var o = s[r];
      if (0 != (8 & o.flags)) {
        var i = d && d[o.uid];
        n = o.error(i, e) || n;
      }
    }
    p = false;
    if (l.length > 0) {
      s = l.pop();
    }
    d = undefined;
    return n && !c;
  };
  o = function (e, t, n) {
    var r = [];
    c = true;
    for (var o = 0; o < n; ++o) {
      var i = t[o];
      r[i.uid] = i.data;
      if (0 != (1 & i.flags)) {
        var a = i.create(i.data);
        void 0 !== a && (r[i.uid] = a);
      }
    }
    c = false;
    return function () {
      d = r;
      l.push(s);
      s = u(t, s);
      c = true;
      for (var o = 0; o < n; ++o)
        if ((2 & t[o].flags) > 0) {
          t[o].before(this, r[t[o].uid]);
        }
      c = false;
      var i = e.apply(this, arguments);
      for (c = true, o = 0; o < n; ++o)
        if ((4 & t[o].flags) > 0) {
          t[o].after(this, r[t[o].uid]);
        }
      c = false;
      s = l.pop();
      d = undefined;
      return i;
    };
  };
  i(process, "_fatalException", function (e) {
    return function (t) {
      return r(t) || e(t);
    };
  });
} else {
  var h = false;
  r = function (e) {
    if (h) throw e;
    for (t = false, n = s.length, r = 0, undefined; r < n; ++r) {
      var t;
      var n;
      var r;
      var o = s[r];
      if (0 != (8 & o.flags)) {
        t = o.error(null, e) || t;
      }
    }
    if (!t && c) throw e;
  };
  o = function (e, t, n) {
    var o = [];
    c = true;
    for (var i = 0; i < n; ++i) {
      var a = t[i];
      o[a.uid] = a.data;
      if (0 != (1 & a.flags)) {
        var d = a.create(a.data);
        void 0 !== d && (o[a.uid] = d);
      }
    }
    c = false;
    return function () {
      var i;
      var a = false;
      var d = false;
      l.push(s);
      s = u(t, s);
      c = true;
      for (var p = 0; p < n; ++p)
        if ((2 & t[p].flags) > 0) {
          t[p].before(this, o[t[p].uid]);
        }
      c = false;
      try {
        i = e.apply(this, arguments);
      } catch (e) {
        for (a = true, p = 0; p < n; ++p)
          if (0 != (8 & s[p].flags))
            try {
              d = s[p].error(o[t[p].uid], e) || d;
            } catch (e) {
              throw ((h = true), e);
            }
        if (!d)
          throw (
            (process.removeListener("uncaughtException", r),
            process._originalNextTick(function () {
              process.addListener("uncaughtException", r);
            }),
            e)
          );
      } finally {
        if (!a || d) {
          for (c = true, p = 0; p < n; ++p)
            if ((4 & t[p].flags) > 0) {
              t[p].after(this, o[t[p].uid]);
            }
          c = false;
        }
        s = l.pop();
      }
      return i;
    };
  };
  process.addListener("uncaughtException", r);
}
function f(e, t) {
  if ("function" == typeof e.create) {
    this.create = e.create;
    this.flags |= 1;
  }
  if ("function" == typeof e.before) {
    this.before = e.before;
    this.flags |= 2;
  }
  if ("function" == typeof e.after) {
    this.after = e.after;
    this.flags |= 4;
  }
  if ("function" == typeof e.error) {
    this.error = e.error;
    this.flags |= 8;
  }
  this.uid = ++a;
  this.data = undefined === t ? null : t;
}
function m(e, t) {
  if ("object" != typeof e || !e)
    throw new TypeError("callbacks argument must be an object");
  return e instanceof f ? e : new f(e, t);
}
f.prototype.create = undefined;
f.prototype.before = undefined;
f.prototype.after = undefined;
f.prototype.error = undefined;
f.prototype.data = undefined;
f.prototype.uid = 0;
f.prototype.flags = 0;
process.createAsyncListener = m;
process.addAsyncListener = function (e, t) {
  var n;
  n = e instanceof f ? e : m(e, t);
  for (r = false, o = 0, undefined; o < s.length; o++) {
    var r;
    var o;
    if (n === s[o]) {
      r = true;
      break;
    }
  }
  if (r) {
    s.push(n);
  }
  return n;
};
process.removeAsyncListener = function (e) {
  for (var t = 0; t < s.length; t++)
    if (e === s[t]) {
      s.splice(t, 1);
      break;
    }
};
module.exports = function (e) {
  var t = s.length;
  if (0 === t) return e;
  for (n = s.slice(), r = 0, undefined; r < t; ++r) {
    var n;
    var r;
    if (n[r].flags > 0) return o(e, n, t);
  }
  return (function (e, t, n) {
    c = true;
    for (var r = 0; r < n; ++r) {
      var o = t[r];
      if (o.create) {
        o.create(o.data);
      }
    }
    c = false;
    return function () {
      l.push(s);
      s = u(t, s);
      var n = e.apply(this, arguments);
      s = l.pop();
      return n;
    };
  })(e, n, t);
};