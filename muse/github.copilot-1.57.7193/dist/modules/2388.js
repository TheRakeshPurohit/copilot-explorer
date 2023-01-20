Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.launchSolutions = exports.normalizeCompletionText = undefined;
const r = require(2277);
const o = require(6932);
const i = require(1133);
const s = require(256);
const a = require(9899);
const c = require(3);
const l = require(937);
const u = require(6722);
const d = require(7727);
const p = require(4969);
const h = require(2533);
const f = require(766);
const m = require(1124);
const g = require(6333);
const _ = require(6403);
const y = new a.Logger(a.LogLevel.INFO, "solutions");
function v(e, t, n, r) {
  return async (o) => {
    if (r instanceof Array) {
      const [i, s] = r;
      return d.isBlockBodyFinishedWithPrefix(e, t, n, o, s);
    }
    return d.isBlockBodyFinished(e, t, n, o);
  };
}
async function b(e, t, n) {
  if (t.isCancellationRequested) {
    e.removeProgress();
    return {
      status: "FinishedWithError",
      error: "Cancelled",
    };
  }
  const r = await n.next();
  return true === r.done
    ? (e.removeProgress(),
      {
        status: "FinishedNormally",
      })
    : {
        status: "Solution",
        solution: r.value,
        next: b(e, t, n),
      };
}
exports.normalizeCompletionText = function (e) {
  return e.replace(/\s+/g, "");
};
exports.launchSolutions = async function (e, t) {
  var n;
  var a;
  var w;
  const x = t.completionContext.insertPosition;
  const E = t.completionContext.prependToCompletion;
  const C = t.completionContext.indentation;
  const S = e.get(_.LocationFactory);
  const T = await t.getDocument();
  const k = await p.extractPrompt(e, T, x);
  if ("contextTooShort" === k.type) {
    t.reportCancelled();
    return {
      status: "FinishedWithError",
      error: "Context too short",
    };
  }
  const I = k.prompt;
  const P = k.trailingWs;
  if (P.length > 0) {
    t.startPosition = S.position(
      t.startPosition.line,
      t.startPosition.character - P.length
    );
  }
  const A = t.getCancellationToken();
  const O = r.v4();
  t.savedTelemetryData = g.TelemetryData.createAndMarkAsIssued(
    {
      headerRequestId: O,
      languageId: T.languageId,
      source: s.completionTypeToString(t.completionContext.completionType),
    },
    {
      ...g.telemetrizePromptLength(I),
      solutionCount: t.solutionCountTarget,
      promptEndPos: T.offsetAt(x),
    }
  );
  if (t.completionContext.completionType === s.CompletionType.TODO_QUICK_FIX) {
    const e = I.prefix.split("\n"),
      t = e.pop(),
      n = e.pop();
    if (n) {
      const r = /^\W+(todo:?\s+)/i.exec(n);
      if (r) {
        const o = r[1],
          i = n.replace(o, "");
        I.prefix = e.join("\n") + "\n" + i + "\n" + t;
      }
    }
  }
  if (
    t.completionContext.completionType ===
    s.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
  ) {
    I.prefix += t.completionContext.prependToCompletion;
  }
  y.info(e, `prompt: ${JSON.stringify(I)}`);
  y.debug(e, `prependToCompletion: ${E}`);
  g.telemetry(e, "solution.requested", t.savedTelemetryData);
  const N = await e.get(i.BlockModeConfig).forLanguage(e, T.languageId);
  const R = h.isSupportedLanguageId(T.languageId);
  const M = d.contextIndentation(T, x);
  const L = {
    stream: true,
    extra: {
      language: T.languageId,
      next_indent: null !== (n = M.next) && undefined !== n ? n : 0,
    },
  };
  if ("parsing" !== N || R) {
    L.stop = ["\n\n", "\r\n\r\n"];
  }
  const $ = f.extractRepoInfoInBackground(e, T.fileName);
  const D = {
    prompt: I,
    languageId: T.languageId,
    repoInfo: $,
    ourRequestId: O,
    engineUrl: await c.getEngineURL(
      e,
      f.tryGetGitHubNWO($),
      T.languageId,
      f.getDogFood($),
      await f.getUserKind(e),
      t.savedTelemetryData
    ),
    count: t.solutionCountTarget,
    uiKind: l.CopilotUiKind.Panel,
    postOptions: L,
    requestLogProbs: true,
  };
  let F;
  const j =
    t.completionContext.completionType ===
    s.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
      ? [
          s.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX,
          t.completionContext.prependToCompletion,
        ]
      : t.completionContext.completionType;
  switch (N) {
    case i.BlockMode.Server:
      F = async (e) => {};
      L.extra.force_indent = null !== (a = M.prev) && undefined !== a ? a : -1;
      L.extra.trim_by_indentation = true;
      break;
    case i.BlockMode.ParsingAndServer:
      F = R ? v(e, T, t.startPosition, j) : async (e) => {};
      L.extra.force_indent = null !== (w = M.prev) && undefined !== w ? w : -1;
      L.extra.trim_by_indentation = true;
      break;
    case i.BlockMode.Parsing:
    default:
      F = R ? v(e, T, t.startPosition, j) : async (e) => {};
  }
  e.get(u.StatusReporter).setProgress();
  const q = await e
    .get(l.OpenAIFetcher)
    .fetchAndStreamCompletions(
      e,
      D,
      g.TelemetryData.createAndMarkAsIssued(),
      F,
      A
    );
  if ("failed" === q.type || "canceled" === q.type) {
    t.reportCancelled();
    e.get(u.StatusReporter).removeProgress();
    return {
      status: "FinishedWithError",
      error: `${q.type}: ${q.reason}`,
    };
  }
  let B = q.choices;
  B = (async function* (e, t) {
    for await (const n of e) {
      const e = {
        ...n,
      };
      e.completionText = t + e.completionText.trimRight();
      yield e;
    }
  })(B, E);
  if (null !== C) {
    B = l.cleanupIndentChoices(B, C);
  }
  B = o.asyncIterableMapFilter(B, async (t) =>
    m.postProcessChoice(e, "solution", T, x, t, false, y)
  );
  const U = o.asyncIterableMapFilter(B, async (n) => {
    let r = n.completionText;
    y.info(e, `Open Copilot completion: [${n.completionText}]`);
    if (
      t.completionContext.completionType === s.CompletionType.OPEN_COPILOT ||
      t.completionContext.completionType === s.CompletionType.TODO_QUICK_FIX
    ) {
      let t = "";
      const o = await (0, d.getNodeStart)(e, T, x, n.completionText);
      if (o)
        [t] = (0, p.trimLastLine)(
          T.getText(S.range(S.position(o.line, o.character), x))
        );
      else {
        const e = S.position(x.line, 0);
        t = T.getText(S.range(e, x));
      }
      r = t + r;
    }
    let o = n.completionText;
    if (
      t.completionContext.completionType === s.CompletionType.TODO_QUICK_FIX
    ) {
      if (T.lineAt(x.line).isEmptyOrWhitespace) {
        o += "\n";
      }
    }
    if (P.length > 0 && o.startsWith(P)) {
      o = o.substring(P.length);
    }
    const i = n.meanLogProb;
    return {
      displayText: r,
      meanProb: undefined !== i ? Math.exp(i) : 0,
      meanLogProb: i || 0,
      completionText: o,
      requestId: n.requestId,
      choiceIndex: n.choiceIndex,
      prependToCompletion: E,
    };
  });
  return b(e.get(u.StatusReporter), A, U[Symbol.asyncIterator]());
};