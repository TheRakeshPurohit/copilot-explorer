const r = process.binding("async_wrap");
const o = r.Providers.TIMERWRAP;
const i = {
  nextTick: require(3269),
  promise: require(9565),
  timers: require(7190),
};
const s = new Set();
function a() {
  this.enabled = false;
  this.counter = 0;
}
function c() {
  const e = (this.initFns = []);
  const t = (this.preFns = []);
  const n = (this.postFns = []);
  const r = (this.destroyFns = []);
  this.init = function (t, n, r, i) {
    if (n !== o) for (const o of e) o(t, this, n, r, i);
    else s.add(t);
  };
  this.pre = function (e) {
    if (!s.has(e)) for (const n of t) n(e, this);
  };
  this.post = function (e, t) {
    if (!s.has(e)) for (const r of n) r(e, this, t);
  };
  this.destroy = function (e) {
    if (s.has(e)) s.delete(e);
    else for (const t of r) t(e);
  };
}
function l(e, t) {
  const n = e.indexOf(t);
  if (-1 !== n) {
    e.splice(n, 1);
  }
}
function u() {
  this._state = new a();
  this._hooks = new c();
  this.version = require(6157).i8;
  this.providers = r.Providers;
  for (const e of Object.keys(i)) i[e].call(this);
  if (process.env.hasOwnProperty("NODE_ASYNC_HOOK_WARNING")) {
    console.warn("warning: you are using async-hook-jl which is unstable.");
  }
  r.setupHooks({
    init: this._hooks.init,
    pre: this._hooks.pre,
    post: this._hooks.post,
    destroy: this._hooks.destroy,
  });
}
c.prototype.add = function (e) {
  if (e.init) {
    this.initFns.push(e.init);
  }
  if (e.pre) {
    this.preFns.push(e.pre);
  }
  if (e.post) {
    this.postFns.push(e.post);
  }
  if (e.destroy) {
    this.destroyFns.push(e.destroy);
  }
};
c.prototype.remove = function (e) {
  if (e.init) {
    l(this.initFns, e.init);
  }
  if (e.pre) {
    l(this.preFns, e.pre);
  }
  if (e.post) {
    l(this.postFns, e.post);
  }
  if (e.destroy) {
    l(this.destroyFns, e.destroy);
  }
};
module.exports = u;
u.prototype.addHooks = function (e) {
  this._hooks.add(e);
};
u.prototype.removeHooks = function (e) {
  this._hooks.remove(e);
};
u.prototype.enable = function () {
  this._state.enabled = true;
  r.enable();
};
u.prototype.disable = function () {
  this._state.enabled = false;
  r.disable();
};