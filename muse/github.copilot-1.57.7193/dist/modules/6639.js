var t = (function () {
  function e(t) {
    if (e.INSTANCE)
      throw new Error(
        "Exception tracking should be configured from the applicationInsights object"
      );
    e.INSTANCE = this;
    this._client = t;
    var n = process.versions.node.split(".");
    e._canUseUncaughtExceptionMonitor =
      parseInt(n[0]) > 13 || (13 === parseInt(n[0]) && parseInt(n[1]) >= 7);
  }
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.prototype.enable = function (t) {
    var n = this;
    if (t) {
      this._isInitialized = true;
      if (!this._exceptionListenerHandle) {
        var r = function (t, r, o) {
          void 0 === o && (o = new Error(e._FALLBACK_ERROR_MESSAGE)),
            n._client.trackException({
              exception: o,
            }),
            n._client.flush({
              isAppCrashing: !0,
            }),
            t &&
              r &&
              1 === process.listeners(r).length &&
              (console.error(o), process.exit(1));
        };
        e._canUseUncaughtExceptionMonitor
          ? ((this._exceptionListenerHandle = r.bind(this, !1)),
            process.on(
              e.UNCAUGHT_EXCEPTION_MONITOR_HANDLER_NAME,
              this._exceptionListenerHandle
            ))
          : ((this._exceptionListenerHandle = r.bind(
              this,
              !0,
              e.UNCAUGHT_EXCEPTION_HANDLER_NAME
            )),
            (this._rejectionListenerHandle = r.bind(this, !1)),
            process.on(
              e.UNCAUGHT_EXCEPTION_HANDLER_NAME,
              this._exceptionListenerHandle
            ),
            process.on(
              e.UNHANDLED_REJECTION_HANDLER_NAME,
              this._rejectionListenerHandle
            ));
      }
    } else if (this._exceptionListenerHandle) {
      if (e._canUseUncaughtExceptionMonitor) {
        process.removeListener(
          e.UNCAUGHT_EXCEPTION_MONITOR_HANDLER_NAME,
          this._exceptionListenerHandle
        );
      } else {
        process.removeListener(
          e.UNCAUGHT_EXCEPTION_HANDLER_NAME,
          this._exceptionListenerHandle
        );
        process.removeListener(
          e.UNHANDLED_REJECTION_HANDLER_NAME,
          this._rejectionListenerHandle
        );
      }
      this._exceptionListenerHandle = undefined;
      this._rejectionListenerHandle = undefined;
      delete this._exceptionListenerHandle;
      delete this._rejectionListenerHandle;
    }
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(false);
    this._isInitialized = false;
  };
  e.INSTANCE = null;
  e.UNCAUGHT_EXCEPTION_MONITOR_HANDLER_NAME = "uncaughtExceptionMonitor";
  e.UNCAUGHT_EXCEPTION_HANDLER_NAME = "uncaughtException";
  e.UNHANDLED_REJECTION_HANDLER_NAME = "unhandledRejection";
  e._RETHROW_EXIT_MESSAGE = "Application Insights Rethrow Exception Handler";
  e._FALLBACK_ERROR_MESSAGE =
    "A promise was rejected without providing an error. Application Insights generated this error stack for you.";
  e._canUseUncaughtExceptionMonitor = false;
  return e;
})();
module.exports = t;