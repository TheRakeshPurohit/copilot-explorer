var n;
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.telemetryTypeToBaseType = function (e) {
  switch (e) {
    case n.Event:
      return "EventData";
    case n.Exception:
      return "ExceptionData";
    case n.Trace:
      return "MessageData";
    case n.Metric:
      return "MetricData";
    case n.Request:
      return "RequestData";
    case n.Dependency:
      return "RemoteDependencyData";
    case n.Availability:
      return "AvailabilityData";
  }
};
exports.baseTypeToTelemetryType = function (e) {
  switch (e) {
    case "EventData":
      return n.Event;
    case "ExceptionData":
      return n.Exception;
    case "MessageData":
      return n.Trace;
    case "MetricData":
      return n.Metric;
    case "RequestData":
      return n.Request;
    case "RemoteDependencyData":
      return n.Dependency;
    case "AvailabilityData":
      return n.Availability;
  }
};
exports.TelemetryTypeString = {
  Event: "EventData",
  Exception: "ExceptionData",
  Trace: "MessageData",
  Metric: "MetricData",
  Request: "RequestData",
  Dependency: "RemoteDependencyData",
  Availability: "AvailabilityData",
};
(function (e) {
  e[(e.Event = 0)] = "Event";
  e[(e.Exception = 1)] = "Exception";
  e[(e.Trace = 2)] = "Trace";
  e[(e.Metric = 3)] = "Metric";
  e[(e.Request = 4)] = "Request";
  e[(e.Dependency = 5)] = "Dependency";
  e[(e.Availability = 6)] = "Availability";
})((n = exports.TelemetryType || (exports.TelemetryType = {})));