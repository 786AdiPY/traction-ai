import Analysis from "./Analysis.jsx";
import { intelModuleStyles as I } from "./IntelModuleView.styles.js";

export default function IntelModuleView({
  mod,
  profile,
  go,
  query,
  setQuery,
  run,
  loading,
  phase,
  analysis,
  raw,
  showRaw,
  setShowRaw,
  hist,
  analysisRef,
  renderAnalysis,
}) {
  if (!mod) return null;

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <div style={I.headerRow}>
        <div
          style={{
            ...I.iconWrap,
            background: mod.color + "18",
            color: mod.color,
          }}
        >
          {mod.icon}
        </div>
        <div>
          <h1 style={I.moduleTitle}>{mod.name}</h1>
          <p style={I.moduleDesc}>{mod.desc}</p>
        </div>
      </div>

      {!profile ? (
        <div style={{ ...I.card, borderLeft: `3px solid ${mod.color}` }}>
          <p style={I.profileGateText}>Set up your profile first.</p>
          <button style={{ ...I.btn, marginTop: 12, fontSize: 12 }} onClick={() => go("dashboard")}>
            Dashboard →
          </button>
        </div>
      ) : (
        <>
          <div style={I.srchW}>
            <span style={{ color: "var(--t3)", fontSize: 14 }}>⌕</span>
            <input style={I.srchI} placeholder={`Ask ${mod.name}...`} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !loading && run()} />
            <button style={{ ...I.runB, background: mod.color, opacity: loading ? 0.6 : 1 }} disabled={loading} onClick={run}>
              {loading ? <span className="spin">⟳</span> : "→"}
            </button>
          </div>

          {loading && (
            <div style={I.ldW}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="spin" style={{ color: mod.color, fontSize: 14 }}>
                  ⟳
                </span>
                <span style={{ fontSize: 12, color: "var(--t3)" }}>{phase}</span>
              </div>
              <div style={I.pTrk}>
                <div style={{ ...I.pBar, background: mod.color }} />
              </div>
            </div>
          )}

          {analysis && (
            <div ref={analysisRef} style={{ animation: "fadeUp .35s ease" }}>
              {renderAnalysis ? (
                renderAnalysis(analysis, mod)
              ) : (
                <div style={{ ...I.card, borderTop: `2px solid ${mod.color}` }}>
                  <div style={{ ...I.analysisSectionLabel, color: mod.color }}>Analysis</div>
                  <Analysis text={analysis} color={mod.color} />
                </div>
              )}
              {raw && !raw[0]?.note && (
                <div style={{ marginTop: 8 }}>
                  <button style={I.togB} onClick={() => setShowRaw(!showRaw)}>
                    {showRaw ? "Hide" : "Show"} raw data ({raw.length} sources)
                  </button>
                  {showRaw && <pre style={I.rawP}>{JSON.stringify(raw, null, 2)}</pre>}
                </div>
              )}
              {raw?.[0]?.note && (
                <div style={I.noteBanner}>
                  ⚠ {raw[0].note}
                </div>
              )}
            </div>
          )}

          {hist[mod.id]?.length > 0 && !loading && !analysis && (
            <div style={I.recentList}>
              <div style={I.recentSectionLabel}>Recent</div>
              {hist[mod.id]
                .slice(-5)
                .reverse()
                .map((h, i) => (
                  <div key={i} style={I.hItem} onClick={() => setQuery(h.q)}>
                    <span style={I.recentQuery}>{h.q}</span>
                    <span style={I.recentTime}>{h.t}</span>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
