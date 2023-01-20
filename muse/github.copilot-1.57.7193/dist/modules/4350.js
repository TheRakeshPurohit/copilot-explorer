var r = require("os");
var o = require(3580);
var i = (function () {
  function e(t, n, r) {
    if (undefined === n) {
      n = 6e4;
    }
    if (undefined === r) {
      r = false;
    }
    this._lastIntervalRequestExecutionTime = 0;
    this._lastIntervalDependencyExecutionTime = 0;
    if (e.INSTANCE) {
      e.INSTANCE = this;
    }
    this._isInitialized = false;
    this._client = t;
    this._collectionInterval = n;
    this._enableLiveMetricsCounters = r;
  }
  e.prototype.enable = function (t, n) {
    var o = this;
    this._isEnabled = t;
    if (this._isEnabled && !this._isInitialized) {
      this._isInitialized = true;
    }
    if (t) {
      if (this._handle) {
        this._lastCpus = r.cpus();
        this._lastRequests = {
          totalRequestCount: e._totalRequestCount,
          totalFailedRequestCount: e._totalFailedRequestCount,
          time: +new Date(),
        };
        this._lastDependencies = {
          totalDependencyCount: e._totalDependencyCount,
          totalFailedDependencyCount: e._totalFailedDependencyCount,
          time: +new Date(),
        };
        this._lastExceptions = {
          totalExceptionCount: e._totalExceptionCount,
          time: +new Date(),
        };
        if ("function" == typeof process.cpuUsage) {
          this._lastAppCpuUsage = process.cpuUsage();
        }
        this._lastHrtime = process.hrtime();
        this._collectionInterval = n || this._collectionInterval;
        this._handle = setInterval(function () {
          return o.trackPerformance();
        }, this._collectionInterval);
        this._handle.unref();
      }
    } else {
      if (this._handle) {
        clearInterval(this._handle);
        this._handle = undefined;
      }
    }
  };
  e.countRequest = function (t, n) {
    var r;
    if (e.isEnabled()) {
      if ("string" == typeof t) r = +new Date("1970-01-01T" + t + "Z");
      else {
        if ("number" != typeof t) return;
        r = t;
      }
      e._intervalRequestExecutionTime += r;
      if (false === n) {
        e._totalFailedRequestCount++;
      }
      e._totalRequestCount++;
    }
  };
  e.countException = function () {
    e._totalExceptionCount++;
  };
  e.countDependency = function (t, n) {
    var r;
    if (e.isEnabled()) {
      if ("string" == typeof t) r = +new Date("1970-01-01T" + t + "Z");
      else {
        if ("number" != typeof t) return;
        r = t;
      }
      e._intervalDependencyExecutionTime += r;
      if (false === n) {
        e._totalFailedDependencyCount++;
      }
      e._totalDependencyCount++;
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.isEnabled = function () {
    return e.INSTANCE && e.INSTANCE._isEnabled;
  };
  e.prototype.trackPerformance = function () {
    this._trackCpu();
    this._trackMemory();
    this._trackNetwork();
    this._trackDependencyRate();
    this._trackExceptionRate();
  };
  e.prototype._trackCpu = function () {
    var e = r.cpus();
    if (e && e.length && this._lastCpus && e.length === this._lastCpus.length) {
      for (
        t = 0, n = 0, i = 0, s = 0, a = 0, c = 0, undefined;
        e && c < e.length;
        c++
      ) {
        var t;
        var n;
        var i;
        var s;
        var a;
        var c;
        var l = e[c];
        var u = this._lastCpus[c];
        var d = (l.model, l.speed, l.times);
        var p = u.times;
        t += d.user - p.user || 0;
        n += d.sys - p.sys || 0;
        i += d.nice - p.nice || 0;
        s += d.idle - p.idle || 0;
        a += d.irq - p.irq || 0;
      }
      var h = undefined;
      if ("function" == typeof process.cpuUsage) {
        var f = process.cpuUsage();
        var m = process.hrtime();
        var g =
          f.user -
            this._lastAppCpuUsage.user +
            (f.system - this._lastAppCpuUsage.system) || 0;
        if (undefined !== this._lastHrtime && 2 === this._lastHrtime.length) {
          h =
            (100 * g) /
            ((1e6 * (m[0] - this._lastHrtime[0]) +
              (m[1] - this._lastHrtime[1]) / 1e3 || 0) *
              e.length);
        }
        this._lastAppCpuUsage = f;
        this._lastHrtime = m;
      }
      var _ = t + n + i + s + a || 1;
      this._client.trackMetric({
        name: o.PerformanceCounter.PROCESSOR_TIME,
        value: ((_ - s) / _) * 100,
      });
      this._client.trackMetric({
        name: o.PerformanceCounter.PROCESS_TIME,
        value: h || (t / _) * 100,
      });
    }
    this._lastCpus = e;
  };
  e.prototype._trackMemory = function () {
    var e = r.freemem();
    var t = process.memoryUsage().rss;
    var n = r.totalmem() - e;
    this._client.trackMetric({
      name: o.PerformanceCounter.PRIVATE_BYTES,
      value: t,
    });
    this._client.trackMetric({
      name: o.PerformanceCounter.AVAILABLE_BYTES,
      value: e,
    });
    if (this._enableLiveMetricsCounters) {
      this._client.trackMetric({
        name: o.QuickPulseCounter.COMMITTED_BYTES,
        value: n,
      });
    }
  };
  e.prototype._trackNetwork = function () {
    var t = this._lastRequests;
    var n = {
      totalRequestCount: e._totalRequestCount,
      totalFailedRequestCount: e._totalFailedRequestCount,
      time: +new Date(),
    };
    var r = n.totalRequestCount - t.totalRequestCount || 0;
    var i = n.totalFailedRequestCount - t.totalFailedRequestCount || 0;
    var s = n.time - t.time;
    var a = s / 1e3;
    var c =
      (e._intervalRequestExecutionTime -
        this._lastIntervalRequestExecutionTime) /
        r || 0;
    this._lastIntervalRequestExecutionTime = e._intervalRequestExecutionTime;
    if (s > 0) {
      var l = r / a,
        u = i / a;
      this._client.trackMetric({
        name: o.PerformanceCounter.REQUEST_RATE,
        value: l,
      }),
        (!this._enableLiveMetricsCounters || r > 0) &&
          this._client.trackMetric({
            name: o.PerformanceCounter.REQUEST_DURATION,
            value: c,
          }),
        this._enableLiveMetricsCounters &&
          this._client.trackMetric({
            name: o.QuickPulseCounter.REQUEST_FAILURE_RATE,
            value: u,
          });
    }
    this._lastRequests = n;
  };
  e.prototype._trackDependencyRate = function () {
    if (this._enableLiveMetricsCounters) {
      var t = this._lastDependencies;
      var n = {
        totalDependencyCount: e._totalDependencyCount,
        totalFailedDependencyCount: e._totalFailedDependencyCount,
        time: +new Date(),
      };
      var r = n.totalDependencyCount - t.totalDependencyCount || 0;
      var i = n.totalFailedDependencyCount - t.totalFailedDependencyCount || 0;
      var s = n.time - t.time;
      var a = s / 1e3;
      var c =
        (e._intervalDependencyExecutionTime -
          this._lastIntervalDependencyExecutionTime) /
          r || 0;
      this._lastIntervalDependencyExecutionTime =
        e._intervalDependencyExecutionTime;
      if (s > 0) {
        var l = r / a,
          u = i / a;
        this._client.trackMetric({
          name: o.QuickPulseCounter.DEPENDENCY_RATE,
          value: l,
        }),
          this._client.trackMetric({
            name: o.QuickPulseCounter.DEPENDENCY_FAILURE_RATE,
            value: u,
          }),
          (!this._enableLiveMetricsCounters || r > 0) &&
            this._client.trackMetric({
              name: o.QuickPulseCounter.DEPENDENCY_DURATION,
              value: c,
            });
      }
      this._lastDependencies = n;
    }
  };
  e.prototype._trackExceptionRate = function () {
    if (this._enableLiveMetricsCounters) {
      var t = this._lastExceptions;
      var n = {
        totalExceptionCount: e._totalExceptionCount,
        time: +new Date(),
      };
      var r = n.totalExceptionCount - t.totalExceptionCount || 0;
      var i = n.time - t.time;
      if (i > 0) {
        var s = r / (i / 1e3);
        this._client.trackMetric({
          name: o.QuickPulseCounter.EXCEPTION_RATE,
          value: s,
        });
      }
      this._lastExceptions = n;
    }
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(false);
    this._isInitialized = false;
  };
  e._totalRequestCount = 0;
  e._totalFailedRequestCount = 0;
  e._lastRequestExecutionTime = 0;
  e._totalDependencyCount = 0;
  e._totalFailedDependencyCount = 0;
  e._lastDependencyExecutionTime = 0;
  e._totalExceptionCount = 0;
  e._intervalDependencyExecutionTime = 0;
  e._intervalRequestExecutionTime = 0;
  return e;
})();
module.exports = i;