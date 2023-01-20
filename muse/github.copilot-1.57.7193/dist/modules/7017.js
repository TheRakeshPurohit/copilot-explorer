Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.postInsertionTasks =
  exports.postRejectionTasks =
  exports.captureCode =
    undefined;
const r = require(6881);
const o = require(750);
const i = require(9899);
const s = require(7727);
const a = require(4969);
const c = require(5120);
const l = require(6333);
const u = require(3136);
const d = new i.Logger(i.LogLevel.INFO, "post-insertion");
const p = [
  {
    seconds: 15,
    captureCode: false,
    captureRejection: false,
  },
  {
    seconds: 30,
    captureCode: true,
    captureRejection: true,
  },
  {
    seconds: 120,
    captureCode: false,
    captureRejection: false,
  },
  {
    seconds: 300,
    captureCode: false,
    captureRejection: false,
  },
  {
    seconds: 600,
    captureCode: false,
    captureRejection: false,
  },
];
async function captureCode(e, t, n) {
  const r = await e.get(u.TextDocumentManager).getTextDocument(t);
  if (!r) {
    d.info(
      e,
      `Could not get document for ${t.fsPath}. Maybe it was closed by the editor.`
    );
    return {
      prompt: {
        prefix: "",
        suffix: "",
        isFimEnabled: false,
        promptElementRanges: [],
      },
      capturedCode: "",
      terminationOffset: 0,
    };
  }
  const o = r.getText();
  const i = o.substring(0, n);
  const c = r.positionAt(n);
  const l = await a.extractPrompt(e, r, c);
  const p =
    "prompt" === l.type
      ? l.prompt
      : {
          prefix: i,
          suffix: "",
          isFimEnabled: false,
          promptElementRanges: [],
        };
  const h = o.substring(n);
  const f = s.contextIndentationFromText(i, n, r.languageId);
  const m = s.indentationBlockFinished(f, undefined);
  const g = await m(h);
  const _ = Math.min(o.length, n + (g ? 2 * g : 500));
  return {
    prompt: p,
    capturedCode: o.substring(n, _),
    terminationOffset: null != g ? g : -1,
  };
}
function f(e, t, n, r) {
  const o = e.substring(
    Math.max(0, r - n),
    Math.min(e.length, r + t.length + n)
  );
  const i = c.lexEditDistance(o, t);
  const s = i.lexDistance / i.needleLexLength;
  const { distance: a } = c.editDistance(
    o.substring(i.startOffset, i.endOffset),
    t
  );
  return {
    relativeLexEditDistance: s,
    charEditDistance: a,
    completionLexLength: i.needleLexLength,
    foundOffset: i.startOffset + Math.max(0, r - n),
    lexEditDistance: i.lexDistance,
    stillInCodeHeuristic: s <= 0.5 ? 1 : 0,
  };
}
exports.captureCode = captureCode;
exports.postRejectionTasks = function (e, t, n, i, s) {
  s.forEach(({ completionText: n, completionTelemetryData: r }) => {
    d.debug(e, `${t}.rejected choiceIndex: ${r.properties.choiceIndex}`);
    o.telemetryRejected(e, t, r);
  });
  const a = new r.ChangeTracker(e, i, n);
  p.filter((e) => e.captureRejection).map((r) => {
    a.push(async () => {
      d.debug(e, `Original offset: ${n}, Tracked offset: ${a.offset}`);
      const { completionTelemetryData: o } = s[0];
      const {
        prompt: c,
        capturedCode: u,
        terminationOffset: p,
      } = await captureCode(e, i, a.offset);
      let f;
      f = c.isFimEnabled
        ? {
            hypotheticalPromptPrefixJson: JSON.stringify(c.prefix),
            hypotheticalPromptSuffixJson: JSON.stringify(c.suffix),
          }
        : {
            hypotheticalPromptJson: JSON.stringify(c.prefix),
          };
      const m = o.extendedBy(
        {
          ...f,
          capturedCodeJson: JSON.stringify(u),
        },
        {
          timeout: r.seconds,
          insertionOffset: n,
          trackedOffset: a.offset,
          terminationOffsetInCapturedCode: p,
        }
      );
      d.debug(
        e,
        `${t}.capturedAfterRejected choiceIndex: ${o.properties.choiceIndex}`,
        m
      );
      l.telemetry(e, t + ".capturedAfterRejected", m, true);
    }, 1e3 * r.seconds);
  });
};
exports.postInsertionTasks = async function (e, t, n, i, s, a) {
  d.debug(e, `${t}.accepted choiceIndex: ${a.properties.choiceIndex}`);
  o.telemetryAccepted(e, t, a);
  const c = new r.ChangeTracker(e, s, i);
  const m = n.trim();
  p.map((n) =>
    c.push(
      () =>
        (async function (e, t, n, r, o, i, s, a) {
          const c = await e.get(u.TextDocumentManager).getTextDocument(o);
          if (c) {
            const u = c.getText();
            let p = f(u, n, 50, a.offset);
            if (p.stillInCodeHeuristic) {
              p = f(u, n, 1500, a.offset);
            }
            d.debug(
              e,
              `stillInCode: ${
                p.stillInCodeHeuristic ? "Found" : "Not found"
              }! Completion '${n}' in file ${
                o.fsPath
              }. lexEditDistance fraction was ${
                p.relativeLexEditDistance
              }. Char edit distance was ${
                p.charEditDistance
              }. Inserted at ${r}, tracked at ${a.offset}, found at ${
                p.foundOffset
              }. choiceIndex: ${s.properties.choiceIndex}`
            );
            const m = s
              .extendedBy(
                {},
                {
                  timeout: i.seconds,
                  insertionOffset: r,
                  trackedOffset: a.offset,
                }
              )
              .extendedBy({}, p);
            l.telemetry(e, t + ".stillInCode", m);
            if (i.captureCode) {
              const {
                prompt: n,
                capturedCode: c,
                terminationOffset: u,
              } = await captureCode(e, o, a.offset);
              let p;
              p = n.isFimEnabled
                ? {
                    hypotheticalPromptPrefixJson: JSON.stringify(n.prefix),
                    hypotheticalPromptSuffixJson: JSON.stringify(n.suffix),
                  }
                : {
                    hypotheticalPromptJson: JSON.stringify(n.prefix),
                  };
              const f = s.extendedBy(
                {
                  ...p,
                  capturedCodeJson: JSON.stringify(c),
                },
                {
                  timeout: i.seconds,
                  insertionOffset: r,
                  trackedOffset: a.offset,
                  terminationOffsetInCapturedCode: u,
                }
              );
              d.debug(
                e,
                `${t}.capturedAfterAccepted choiceIndex: ${s.properties.choiceIndex}`,
                m
              ),
                (0, l.telemetry)(e, t + ".capturedAfterAccepted", f, !0);
            }
          }
        })(e, t, m, i, s, n, a, c),
      1e3 * n.seconds
    )
  );
};