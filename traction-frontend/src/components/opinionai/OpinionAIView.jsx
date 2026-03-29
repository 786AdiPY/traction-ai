import { MODULES } from "../../constants/modules.js";
import Analysis from "../_shared/Analysis.jsx";
import IntelModuleView from "../_shared/IntelModuleView.jsx";
import { intelModuleStyles as I } from "../_shared/IntelModuleView.styles.js";

const MOD = MODULES.find((m) => m.id === "opinion");

/** Split model output on **Negative** and **AI Verdict** (see getSysPrompt opinion). */
function splitOpinionSections(text) {
  if (!text) return { positive: "", negative: "", verdict: "" };
  const partsNeg = text.split(/\*\*Negative\*\*/i);
  const head = partsNeg[0] || "";
  const positive = head.replace(/^\s*\*\*Positive\*\*\s*/i, "").trim();
  const rest = partsNeg[1] || "";
  const partsVer = rest.split(/\*\*AI Verdict\*\*/i);
  const negative = (partsVer[0] || "").trim();
  const verdict = (partsVer[1] || "").trim();
  return { positive, negative, verdict };
}

function OpinionStructuredAnalysis({ text }) {
  const { positive, negative, verdict } = splitOpinionSections(text);
  const hasStructure = negative || verdict;

  if (!hasStructure) {
    return (
      <div style={{ ...I.card, borderTop: "2px solid #818cf8" }}>
        <div style={{ ...I.analysisSectionLabel, color: "#818cf8" }}>Analysis</div>
        <Analysis text={text} color="#818cf8" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, alignItems: "start" }}>
        <div style={{ ...I.card, borderTop: "2px solid #34d399", boxShadow: "inset 0 1px 0 rgba(52,211,153,.1)" }}>
          <div style={{ ...I.analysisSectionLabel, color: "#34d399", marginBottom: 8 }}>Positive</div>
          <p style={{ fontSize: 11, color: "var(--t3)", margin: "0 0 10px", lineHeight: 1.45 }}>From TinyFish research (signals bucket).</p>
          <Analysis text={positive || "—"} color="#34d399" />
        </div>
        <div style={{ ...I.card, borderTop: "2px solid #fb7185", boxShadow: "inset 0 1px 0 rgba(251,113,133,.08)" }}>
          <div style={{ ...I.analysisSectionLabel, color: "#fb7185", marginBottom: 8 }}>Negative</div>
          <p style={{ fontSize: 11, color: "var(--t3)", margin: "0 0 10px", lineHeight: 1.45 }}>Risks and failure patterns from research (negative bucket).</p>
          <Analysis text={negative || "—"} color="#fb7185" />
        </div>
      </div>
      <div style={{ ...I.card, borderTop: "2px solid #818cf8", boxShadow: "inset 0 1px 0 rgba(129,140,248,.12)" }}>
        <div style={{ ...I.analysisSectionLabel, color: "#818cf8", marginBottom: 8 }}>AI Verdict</div>
        <p style={{ fontSize: 11, color: "var(--t3)", margin: "0 0 10px", lineHeight: 1.45 }}>Recommendation for your startup profile and question.</p>
        <Analysis text={verdict || "—"} color="#818cf8" />
      </div>
    </div>
  );
}

export default function OpinionAIView(props) {
  return (
    <IntelModuleView
      mod={MOD}
      renderAnalysis={(text) => <OpinionStructuredAnalysis text={text} />}
      {...props}
    />
  );
}
