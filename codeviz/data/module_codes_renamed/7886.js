var M_channel_NOTSURE = require("channel"),
  o = [];
exports.qP = function (e) {
  e.data.event.commandName;
  o.forEach(function (t) {
    var n =
      (e.data.startedData && e.data.startedData.databaseName) ||
      "Unknown database";
    t.trackDependency({
      target: n,
      data: e.data.event.commandName,
      name: e.data.event.commandName,
      duration: e.data.event.duration,
      success: e.data.succeeded,
      resultCode: e.data.succeeded ? "0" : "1",
      dependencyTypeName: "mongodb",
    });
  });
};
exports.wp = function (e, n) {
  if (e) {
    if (0 === o.length) {
      M_channel_NOTSURE.channel.subscribe("mongodb", exports.qP);
    }
    o.push(n);
  } else {
    if (
      0 ===
      (o = o.filter(function (e) {
        return e != n;
      })).length
    ) {
      M_channel_NOTSURE.channel.unsubscribe("mongodb", exports.qP);
    }
  }
};