const r = process.binding("async_wrap"),
  o = r.Providers.TIMERWRAP,
  i = {
    nextTick: require(3269),
    promise: require(9565),
    timers: require(7190)
  },
  s = new Set();
function a() {
  this.enabled = !1;
  this.counter = 0;
}
function c() {
  const e = this.initFns = [],
    t = this.preFns = [],
    n = this.postFns = [],
    r = this.destroyFns = [];
  this.init = function (t, n, r, i) {
    if (n !== o) for (const o of e) o(t, this, n, r, i);else s.add(t);
  };
  this.pre = function (e) {
    if (!s.has(e)) for (const n of t) n(e, this);
  };
  this.post = function (e, t) {
    if (!s.has(e)) for (const r of n) r(e, this, t);
  };
  this.destroy = function (e) {
    if (s.has(e)) s.delete(e);else for (const t of r) t(e);
  };
}
function l(e, t) {
  const n = e.indexOf(t);
  -1 !== n && e.splice(n, 1);
}
function u() {
  this._state = new a();
  this._hooks = new c();
  this.version = require(6157).i8;
  this.providers = r.Providers;
  for (const e of Object.keys(i)) i[e].call(this);
  process.env.hasOwnProperty("NODE_ASYNC_HOOK_WARNING") && console.warn("warning: you are using async-hook-jl which is unstable.");
  r.setupHooks({
    init: this._hooks.init,
    pre: this._hooks.pre,
    post: this._hooks.post,
    destroy: this._hooks.destroy
  });
}
c.prototype.add = function (e) {
  e.init && this.initFns.push(e.init);
  e.pre && this.preFns.push(e.pre);
  e.post && this.postFns.push(e.post);
  e.destroy && this.destroyFns.push(e.destroy);
};
c.prototype.remove = function (e) {
  e.init && l(this.initFns, e.init);
  e.pre && l(this.preFns, e.pre);
  e.post && l(this.postFns, e.post);
  e.destroy && l(this.destroyFns, e.destroy);
};
module.exports = u;
u.prototype.addHooks = function (e) {
  this._hooks.add(e);
};
u.prototype.removeHooks = function (e) {
  this._hooks.remove(e);
};
u.prototype.enable = function () {
  this._state.enabled = !0;
  r.enable();
};
u.prototype.disable = function () {
  this._state.enabled = !1;
  r.disable();
};