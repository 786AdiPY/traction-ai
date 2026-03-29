import { useState } from "react";
import { MODULES } from "../../constants/modules.js";
import Analysis from "../_shared/Analysis.jsx";
import IntelModuleView from "../_shared/IntelModuleView.jsx";
import { intelModuleStyles as I } from "../_shared/IntelModuleView.styles.js";

const MOD = MODULES.find((m) => m.id === "opinion");

const RISKS_HEADER = /\*\*(?:Risks\s*&\s*warning signs|Negative)\*\*/i;

function stripSignalsHeader(s) {
  return s
    .replace(/^\s*\*\*(?:Positive|Signals in your favour|Signals in your favor)\*\*\s*/i, "")
    .trim();
}

/** Supports new headers (Signals / Risks) and legacy Positive / Negative. */
function splitOpinionSections(text) {
  if (!text) return { signals: "", risks: "", verdict: "", structured: false };
  const partsVer = text.split(/\*\*AI Verdict\*\*/i);
  const beforeVerdict = partsVer[0] || "";
  const verdict = (partsVer[1] || "").trim();
  const risksMatch = beforeVerdict.match(RISKS_HEADER);
  let signals = "";
  let risks = "";
  if (risksMatch && risksMatch.index != null) {
    signals = stripSignalsHeader(beforeVerdict.slice(0, risksMatch.index));
    risks = beforeVerdict.slice(risksMatch.index + risksMatch[0].length).trim();
  } else {
    signals = stripSignalsHeader(beforeVerdict).trim();
  }
  const structured = !!(verdict || risksMatch);
  return { signals, risks, verdict, structured };
}

function cleanFindingTitle(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^\*\*|\*\*$/g, "")
    .trim();
}

/** Pull trailing `Source: …` out of detail if the model merged it into one block. */
function splitSourceFromDetail(detail) {
  const d = detail?.trim() || "";
  if (!d) return { body: "", source: "" };
  const lines = d.split("\n");
  const last = lines[lines.length - 1]?.trim() || "";
  const m = last.match(/^Source:\s*(.+)$/i);
  if (m) {
    return {
      body: lines.slice(0, -1).join("\n").trim(),
      source: m[1].trim().replace(/^[`'"]|[`'"]$/g, ""),
    };
  }
  return { body: d, source: "" };
}

/**
 * Bullets become items; continuation lines are detail; `Source:` line is badge (not in body).
 */
function parseFindings(text) {
  if (!text || text === "—") return [];
  const lines = text.split("\n");
  const items = [];
  let current = null;

  function pushCurrent() {
    if (!current) return;
    items.push({
      title: current.title,
      detail: current.detail.trim(),
      source: current.source || "",
    });
    current = null;
  }

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const sourceLine = t.match(/^Source:\s*(.+)$/i);
    if (sourceLine && current) {
      current.source = sourceLine[1].trim().replace(/^[`'"]|[`'"]$/g, "");
      continue;
    }

    const tickOnly = t.match(/^`([^`]{1,80})`$/);
    if (tickOnly && current && !current.source) {
      current.source = tickOnly[1].trim();
      continue;
    }

    const bullet = t.match(/^[-•*]\s+(.+)$/);
    const numbered = t.match(/^\d+\.\s+(.+)$/);
    if (bullet || numbered) {
      pushCurrent();
      current = {
        title: cleanFindingTitle((bullet?.[1] || numbered?.[1] || t).trim()),
        detail: "",
        source: "",
      };
      continue;
    }

    if (current) {
      current.detail += (current.detail ? "\n" : "") + t;
    } else {
      current = { title: cleanFindingTitle(t), detail: "", source: "" };
    }
  }
  pushCurrent();

  if (items.length === 0 && text.trim()) {
    items.push({ title: cleanFindingTitle(text.trim()), detail: "", source: "" });
  }

  return items.map((it) => {
    const { body, source } = splitSourceFromDetail(it.detail);
    return { ...it, detail: body, source: it.source || source || "" };
  });
}

function SourceBadge({ label }) {
  if (!label?.trim()) return null;
  return (
    <span
      style={{
        display: "inline-block",
        marginTop: 8,
        fontSize: 10,
        color: "var(--t2)",
        background: "rgba(255,255,255,.06)",
        border: "1px solid var(--b1)",
        padding: "4px 9px",
        borderRadius: 6,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        letterSpacing: 0.2,
      }}
    >
      {label.trim()}
    </span>
  );
}

function FindingsAccordion({ items, accent, dotColor }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (items.length === 0) {
    return <p style={{ fontSize: 12, color: "var(--t3)", margin: 0 }}>—</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const hasDetail = Boolean(item.detail?.trim());
        const hasSource = Boolean(item.source?.trim());
        const showPanel = isOpen && (hasDetail || hasSource);
        return (
          <div
            key={i}
            style={{
              borderRadius: 8,
              border: "1px solid var(--b1)",
              background: "rgba(255,255,255,.02)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "7px 10px",
                border: "none",
                background: isOpen ? "rgba(255,255,255,.04)" : "transparent",
                cursor: "pointer",
                textAlign: "left",
                font: "inherit",
                color: "var(--t1)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: dotColor,
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 12, lineHeight: 1.45, paddingRight: 4 }}>{item.title}</span>
              <span
                style={{
                  color: "var(--t3)",
                  fontSize: 9,
                  flexShrink: 0,
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform .15s ease",
                  lineHeight: 1.2,
                  marginTop: 4,
                }}
              >
                ▼
              </span>
            </button>
            {showPanel ? (
              <div
                style={{
                  padding: "6px 10px 10px 24px",
                  borderTop: "1px solid var(--b1)",
                }}
              >
                {hasDetail ? (
                  <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.55 }}>
                    <Analysis text={item.detail.trim()} color={accent} />
                  </div>
                ) : null}
                <SourceBadge label={item.source} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function FindingsCard({ title, sub, accent, dotColor, borderAccent, items }) {
  const n = items.length;
  return (
    <div
      style={{
        ...I.card,
        borderTop: "none",
        borderLeft: `4px solid ${borderAccent}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.04)",
        padding: "12px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <div>
          <div style={{ ...I.analysisSectionLabel, color: accent, marginBottom: 2 }}>{title}</div>
          <p style={{ fontSize: 11, color: "var(--t3)", margin: 0, lineHeight: 1.4 }}>{sub}</p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: accent,
            background: `${accent}22`,
            padding: "2px 8px",
            borderRadius: 999,
            flexShrink: 0,
            minWidth: 22,
            textAlign: "center",
          }}
        >
          {n}
        </span>
      </div>
      <FindingsAccordion items={items} accent={accent} dotColor={dotColor} />
    </div>
  );
}

function OpinionStructuredAnalysis({ text, profile, raw }) {
  const { signals, risks, verdict, structured } = splitOpinionSections(text);
  const sourceCount = Array.isArray(raw) ? raw.filter((r) => !r?.note).length : 0;
  const startup = profile?.startupName?.trim() || "your startup";
  const verdictSub =
    sourceCount > 0
      ? `Recommendation for ${startup} based on ${sourceCount} source${sourceCount === 1 ? "" : "s"}`
      : `Recommendation for ${startup}`;

  if (!structured) {
    return (
      <div style={{ ...I.card, borderTop: "2px solid #818cf8" }}>
        <div style={{ ...I.analysisSectionLabel, color: "#818cf8" }}>Analysis</div>
        <Analysis text={text} color="#818cf8" />
      </div>
    );
  }

  const signalItems = parseFindings(signals);
  const riskItems = parseFindings(risks);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 6, alignItems: "start" }}>
        <FindingsCard
          title="Signals in your favor"
          sub={`From TinyFish research (${signalItems.length} finding${signalItems.length === 1 ? "" : "s"})`}
          accent="#34d399"
          dotColor="#34d399"
          borderAccent="#34d399"
          items={signalItems}
        />
        <FindingsCard
          title="Risks & warning signs"
          sub={`Failure patterns from research (${riskItems.length} finding${riskItems.length === 1 ? "" : "s"})`}
          accent="#fb7185"
          dotColor="#fb7185"
          borderAccent="#fb7185"
          items={riskItems}
        />
      </div>
      <div
        style={{
          ...I.card,
          borderTop: "2px solid #818cf8",
          boxShadow: "inset 0 1px 0 rgba(129,140,248,.12)",
          padding: "12px 14px",
        }}
      >
        <div style={{ ...I.analysisSectionLabel, color: "#818cf8", marginBottom: 2, letterSpacing: 0.5 }}>
          | AI VERDICT
        </div>
        <p style={{ fontSize: 11, color: "var(--t3)", margin: "0 0 8px", lineHeight: 1.45 }}>{verdictSub}</p>
        <Analysis text={verdict || "—"} color="#818cf8" />
      </div>
    </div>
  );
}

export default function OpinionAIView(props) {
  return (
    <IntelModuleView
      mod={MOD}
      showSearch
      renderAnalysis={(analysisText) => (
        <OpinionStructuredAnalysis text={analysisText} profile={props.profile} raw={props.raw} />
      )}
      {...props}
    />
  );
}
