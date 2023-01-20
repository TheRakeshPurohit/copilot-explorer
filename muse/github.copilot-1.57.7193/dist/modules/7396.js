Object.defineProperty(exports, "__esModule", {
  value: true,
});
var r = require(5282);
exports.IsInitialized = !process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL;
var o = "DiagnosticChannel";
if (exports.IsInitialized) {
  var i = require(4106);
  var s = (process.env.APPLICATION_INSIGHTS_NO_PATCH_MODULES || "").split(",");
  var a = {
    bunyan: i.bunyan,
    console: i.console,
    mongodb: i.mongodb,
    mongodbCore: i.mongodbCore,
    mysql: i.mysql,
    redis: i.redis,
    pg: i.pg,
    pgPool: i.pgPool,
    winston: i.winston,
  };
  for (var c in a)
    if (-1 === s.indexOf(c)) {
      a[c].enable();
      r.info(o, "Subscribed to " + c + " events");
    }
  if (s.length > 0) {
    r.info(o, "Some modules will not be patched", s);
  }
} else
  r.info(
    o,
    "Not subscribing to dependency autocollection because APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL was set"
  );
exports.registerContextPreservation = function (e) {
  if (exports.IsInitialized) {
    require(4953).channel.addContextPreservation(e);
  }
};