Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_channel_NOTSURE = require("channel");
exports.redis = {
  versionSpecifier: ">= 2.0.0 < 4.0.0",
  patch: function (e) {
    var t = e.RedisClient.prototype.internal_send_command;
    e.RedisClient.prototype.internal_send_command = function (e) {
      if (e) {
        var n = e.callback;
        if (!n || !n.pubsubBound) {
          var o = this.address,
            i = process.hrtime(),
            s = new Date();
          e.callback = M_channel_NOTSURE.channel.bindToContext(function (t, a) {
            var c = process.hrtime(i),
              l = (1e3 * c[0] + c[1] / 1e6) | 0;
            M_channel_NOTSURE.channel.publish("redis", {
              duration: l,
              address: o,
              commandObj: e,
              err: t,
              result: a,
              time: s,
            });
            if ("function" == typeof n) {
              n.apply(this, arguments);
            }
          });
          e.callback.pubsubBound = !0;
        }
      }
      return t.call(this, e);
    };
    return e;
  },
};
exports.enable = function () {
  M_channel_NOTSURE.channel.registerMonkeyPatch("redis", exports.redis);
};