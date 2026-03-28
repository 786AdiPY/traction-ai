import { useState, useEffect, useRef } from "react";
import Analysis from "./components/Analysis.jsx";
import { MODULES, SECTIONS, getTasks, getSysPrompt } from "./constants/modules.js";
import { claudeAnalyze, runScrapes } from "./lib/api.js";

const ANTHROPIC_STORAGE = "traction_anthropic_key";

function readStoredAnthropicKey() {
  try {
    return sessionStorage.getItem(ANTHROPIC_STORAGE) || import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  } catch {
    return import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  }
}

export default function App() {
  const [launched, setLaunched] = useState(false);
  const [anthropicKey, setAnthropicKey] = useState(readStoredAnthropicKey);
  const [anthropicInput, setAnthropicInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [pN, setPN] = useState("");
  const [pD, setPD] = useState("");
  const [pS, setPS] = useState("idea");
  const [pC, setPC] = useState("saas");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [raw, setRaw] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [hist, setHist] = useState({});
  const ref = useRef(null);
  const mod = MODULES.find((m) => m.id === tab);

  function go(id) {
    setTab(id);
    setQuery("");
    setAnalysis("");
    setRaw(null);
    setShowRaw(false);
    setPhase("");
    setLoading(false);
  }

  async function run() {
    const q = query || profile?.description || "";
    if (!q || !mod) return;
    setLoading(true);
    setAnalysis("");
    setRaw(null);
    setShowRaw(false);
    try {
      setPhase("Scraping live web data...");
      const tasks = getTasks(mod.id, q);
      const { data, error } = await runScrapes(tasks);
      setPhase("AI analyzing patterns...");
      const key = anthropicKey.trim();
      let res;
      const ctx = `Founder asked: "${q}". Startup: ${profile?.description || "N/A"}, Stage: ${profile?.stage || "N/A"}, Category: ${profile?.category || "N/A"}.`;
      if (data.length > 0) {
        setRaw(data);
        if (!key) {
          res =
            "Add an Anthropic API key in Settings (or VITE_ANTHROPIC_API_KEY) to synthesize analysis. Raw search results are available below.";
        } else {
          res = await claudeAnalyze(key, getSysPrompt(mod.id), `${ctx}\n\nScraped data:\n${JSON.stringify(data, null, 2)}\n\nProvide structured analysis.`);
        }
      } else {
        const note = error || "Live data unavailable.";
        setRaw([{ note }]);
        if (!key) {
          res = `${note}\n\nAdd an Anthropic API key in Settings for AI analysis when search data is missing.`;
        } else {
          res = await claudeAnalyze(
            key,
            getSysPrompt(mod.id),
            `${ctx}\n\n${note}\n\nProvide structured analysis using your knowledge where needed.`
          );
        }
      }
      setAnalysis(res || "No analysis returned.");
      setHist((p) => ({ ...p, [mod.id]: [...(p[mod.id] || []), { q, t: new Date().toLocaleTimeString() }] }));
    } catch (e) {
      setAnalysis("Error: " + (e.message || "Please try again."));
    }
    setLoading(false);
    setPhase("");
  }

  useEffect(() => {
    if (analysis && ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [analysis]);

  useEffect(() => {
    if (tab === "settings" && profile) {
      setPN(profile.name || "");
      setPD(profile.description || "");
      setPS(profile.stage || "idea");
      setPC(profile.category || "saas");
    }
  }, [tab, profile]);

  useEffect(() => {
    if (!MODULES.some((m) => m.id === tab)) setTab("dashboard");
  }, [tab]);

  const stageOpts = ["idea", "mvp", "launched", "revenue", "funded"];
  const catOpts = ["saas", "marketplace", "consumer", "fintech", "healthtech", "ai", "ecommerce", "devtools", "other"];

  const canEnter = pD.trim().length > 0;

  function handleEnterApp() {
    if (!canEnter) return;
    setProfile({ name: pN.trim(), description: pD.trim(), stage: pS, category: pC });
    setLaunched(true);
  }

  function saveAnthropicKey() {
    const v = anthropicInput.trim();
    try {
      if (v) sessionStorage.setItem(ANTHROPIC_STORAGE, v);
      else sessionStorage.removeItem(ANTHROPIC_STORAGE);
    } catch {
      /* ignore */
    }
    setAnthropicKey(v || import.meta.env.VITE_ANTHROPIC_API_KEY || "");
    setAnthropicInput("");
  }

  if (!launched)
    return (
      <div style={S.root}>
        <style>{CSS}</style>
        <div style={S.keyOv}>
          <div style={S.onboard}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "var(--t3)", textTransform: "uppercase", marginBottom: 20 }}>Welcome</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 28, fontWeight: 800, color: "var(--t1)", letterSpacing: -1, marginBottom: 8 }}>Traction.ai</div>
            <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 24, lineHeight: 1.5 }}>Tell us about your startup to get started. Web search runs through our API; keys stay on the server.</p>
            <div style={S.cardLbl}>Startup profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={S.lbl}>Company or product name</label>
                <input style={S.inp} placeholder="Acme Analytics" value={pN} onChange={(e) => setPN(e.target.value)} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={S.lbl}>What are you building?</label>
                <input
                  style={S.inp}
                  placeholder="AI-powered analytics for e-commerce"
                  value={pD}
                  onChange={(e) => setPD(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canEnter && handleEnterApp()}
                />
              </div>
              <div>
                <label style={S.lbl}>Stage</label>
                <select style={S.inp} value={pS} onChange={(e) => setPS(e.target.value)}>
                  {stageOpts.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={S.lbl}>Category</label>
                <select style={S.inp} value={pC} onChange={(e) => setPC(e.target.value)}>
                  {catOpts.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button style={{ ...S.btn, width: "100%", marginTop: 20, opacity: canEnter ? 1 : 0.4 }} disabled={!canEnter} onClick={handleEnterApp}>
              Enter app →
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <nav style={{ ...S.side, width: collapsed ? 56 : 224 }}>
        <div style={S.sHead} onClick={() => setCollapsed(!collapsed)}>
          <div style={S.logo}>T</div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: "var(--fd)", fontSize: 15, fontWeight: 800, color: "var(--t1)", letterSpacing: -0.5 }}>Traction.ai</div>
              <div style={{ fontSize: 9, color: "var(--t3)", letterSpacing: 1.5, textTransform: "uppercase" }}>v1.0</div>
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
          {SECTIONS.map((s) => (
            <div key={s.id}>
              {s.label && !collapsed && <div style={S.secLbl}>{s.label}</div>}
              {s.label && collapsed && <div style={{ height: 20 }} />}
              {MODULES.filter((m) => m.section === s.id).map((m) => {
                const a = tab === m.id;
                return (
                  <div
                    key={m.id}
                    style={{
                      ...S.nav,
                      background: a ? "var(--navA)" : "transparent",
                      color: a ? "var(--t1)" : "var(--t3)",
                      justifyContent: collapsed ? "center" : "flex-start",
                      padding: collapsed ? "10px 0" : "9px 12px",
                    }}
                    onClick={() => go(m.id)}
                    title={m.name}
                  >
                    <span style={{ fontSize: 15, width: 20, textAlign: "center", flexShrink: 0, color: a ? m.color || "var(--t1)" : "var(--t3)" }}>{m.icon}</span>
                    {!collapsed && (
                      <div style={{ overflow: "hidden", minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: a ? 600 : 400, whiteSpace: "nowrap" }}>{m.name}</div>
                        {m.desc && (
                          <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.desc}</div>
                        )}
                      </div>
                    )}
                    {!collapsed && a && <div style={{ width: 3, height: 18, borderRadius: 2, background: m.color || "var(--ac)", marginLeft: "auto", flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {!collapsed && profile && (
          <div style={S.pBadge} onClick={() => go("settings")}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "var(--navA)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--ac)",
                flexShrink: 0,
              }}
            >
              {(profile.name || "S")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden", minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.name || "My Startup"}</div>
              <div style={{ fontSize: 10, color: "var(--t3)" }}>
                {profile.stage} · {profile.category}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main style={S.main}>
        {tab === "dashboard" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <h1 style={S.h1}>{profile ? `Welcome back${profile.name ? ", " + profile.name : ""}` : "Welcome to Traction.ai"}</h1>
            <p style={S.sub}>{profile ? "Pick a module to begin." : "Set up your startup profile first."}</p>
            {!profile && (
              <div style={{ ...S.card, marginTop: 24 }}>
                <div style={S.cardLbl}>Startup Profile</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={S.lbl}>Name</label>
                    <input style={S.inp} placeholder="Acme Analytics" value={pN} onChange={(e) => setPN(e.target.value)} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={S.lbl}>What are you building?</label>
                    <input style={S.inp} placeholder="AI-powered analytics for e-commerce" value={pD} onChange={(e) => setPD(e.target.value)} />
                  </div>
                  <div>
                    <label style={S.lbl}>Stage</label>
                    <select style={S.inp} value={pS} onChange={(e) => setPS(e.target.value)}>
                      {stageOpts.map((s) => (
                        <option key={s} value={s}>
                          {s[0].toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={S.lbl}>Category</label>
                    <select style={S.inp} value={pC} onChange={(e) => setPC(e.target.value)}>
                      {catOpts.map((s) => (
                        <option key={s} value={s}>
                          {s[0].toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button style={{ ...S.btn, width: "100%", marginTop: 16, opacity: pD ? 1 : 0.4 }} disabled={!pD} onClick={() => setProfile({ name: pN, description: pD, stage: pS, category: pC })}>
                  Save Profile
                </button>
              </div>
            )}
            {profile && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(195px,1fr))", gap: 10, marginTop: 24 }}>
                {MODULES.filter((m) => m.section !== "home" && m.section !== "sys").map((m) => (
                  <div key={m.id} className="mc" style={S.mc} onClick={() => go(m.id)}>
                    <div style={{ fontSize: 20, marginBottom: 6, color: m.color }}>{m.icon}</div>
                    <div style={{ fontFamily: "var(--fd)", fontSize: 13, fontWeight: 700, color: "var(--t1)" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>{m.desc}</div>
                    {hist[m.id] && (
                      <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 8, borderTop: "1px solid var(--b1)", paddingTop: 6 }}>{hist[m.id].length} queries</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <h1 style={S.h1}>Settings</h1>
            <p style={S.sub}>Profile and API keys.</p>
            <div style={{ ...S.card, marginTop: 20 }}>
              <div style={S.cardLbl}>Startup Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={S.lbl}>Name</label>
                  <input style={S.inp} value={pN} onChange={(e) => setPN(e.target.value)} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={S.lbl}>Description</label>
                  <input style={S.inp} value={pD} onChange={(e) => setPD(e.target.value)} />
                </div>
                <div>
                  <label style={S.lbl}>Stage</label>
                  <select style={S.inp} value={pS} onChange={(e) => setPS(e.target.value)}>
                    {stageOpts.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Category</label>
                  <select style={S.inp} value={pC} onChange={(e) => setPC(e.target.value)}>
                    {catOpts.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button style={{ ...S.btn, marginTop: 16 }} onClick={() => setProfile({ name: pN, description: pD, stage: pS, category: pC })}>
                Update
              </button>
            </div>
            <div style={{ ...S.card, marginTop: 12 }}>
              <div style={S.cardLbl}>Anthropic (analysis)</div>
              <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 12 }}>Stored in session storage on this browser. Optional if you set VITE_ANTHROPIC_API_KEY at build time.</p>
              <label style={S.lbl}>API key</label>
              <input style={S.inp} type="password" placeholder="sk-ant-..." value={anthropicInput} onChange={(e) => setAnthropicInput(e.target.value)} />
              <button style={{ ...S.btn, marginTop: 12 }} onClick={saveAnthropicKey}>
                Save key
              </button>
              <div style={{ marginTop: 10, fontSize: 11, color: anthropicKey ? "var(--green)" : "var(--t3)" }}>{anthropicKey ? "● Analysis key set" : "○ No analysis key (search still works)"}</div>
            </div>
            <div style={{ ...S.card, marginTop: 12 }}>
              <div style={S.cardLbl}>Web search</div>
              <p style={{ fontSize: 12, color: "var(--t3)", margin: 0, lineHeight: 1.6 }}>
                Handled by our API at <code style={{ fontSize: 11, color: "var(--t2)" }}>POST /v1/automation/run-sse</code>. TinyFish credentials live in server environment only.
              </p>
            </div>
          </div>
        )}

        {mod && mod.section !== "home" && mod.section !== "sys" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: mod.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: mod.color,
                }}
              >
                {mod.icon}
              </div>
              <div>
                <h1 style={{ fontFamily: "var(--fd)", fontSize: 22, fontWeight: 800, margin: 0, color: "var(--t1)", letterSpacing: -0.5 }}>{mod.name}</h1>
                <p style={{ fontSize: 12, color: "var(--t3)", margin: 0 }}>{mod.desc}</p>
              </div>
            </div>

            {!profile ? (
              <div style={{ ...S.card, borderLeft: `3px solid ${mod.color}` }}>
                <p style={{ fontSize: 13, color: "var(--t2)", margin: 0 }}>Set up your profile first.</p>
                <button style={{ ...S.btn, marginTop: 12, fontSize: 12 }} onClick={() => go("dashboard")}>
                  Dashboard →
                </button>
              </div>
            ) : (
              <>
                <div style={S.srchW}>
                  <span style={{ color: "var(--t3)", fontSize: 14 }}>⌕</span>
                  <input style={S.srchI} placeholder={`Ask ${mod.name}...`} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !loading && run()} />
                  <button style={{ ...S.runB, background: mod.color, opacity: loading ? 0.6 : 1 }} disabled={loading} onClick={run}>
                    {loading ? <span className="spin">⟳</span> : "→"}
                  </button>
                </div>

                {loading && (
                  <div style={S.ldW}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="spin" style={{ color: mod.color, fontSize: 14 }}>
                        ⟳
                      </span>
                      <span style={{ fontSize: 12, color: "var(--t3)" }}>{phase}</span>
                    </div>
                    <div style={S.pTrk}>
                      <div style={{ ...S.pBar, background: mod.color }} />
                    </div>
                  </div>
                )}

                {analysis && (
                  <div ref={ref} style={{ animation: "fadeUp .35s ease" }}>
                    <div style={{ ...S.card, borderTop: `2px solid ${mod.color}` }}>
                      <div style={{ fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Analysis</div>
                      <Analysis text={analysis} color={mod.color} />
                    </div>
                    {raw && !raw[0]?.note && (
                      <div style={{ marginTop: 8 }}>
                        <button style={S.togB} onClick={() => setShowRaw(!showRaw)}>
                          {showRaw ? "Hide" : "Show"} raw data ({raw.length} sources)
                        </button>
                        {showRaw && <pre style={S.rawP}>{JSON.stringify(raw, null, 2)}</pre>}
                      </div>
                    )}
                    {raw?.[0]?.note && (
                      <div style={{ marginTop: 8, padding: "8px 14px", borderRadius: 8, background: "rgba(251,191,36,.08)", fontSize: 11, color: "#fbbf24" }}>
                        ⚠ {raw[0].note}
                      </div>
                    )}
                  </div>
                )}

                {hist[mod.id]?.length > 0 && !loading && !analysis && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t3)", textTransform: "uppercase", marginBottom: 10 }}>Recent</div>
                    {hist[mod.id]
                      .slice(-5)
                      .reverse()
                      .map((h, i) => (
                        <div key={i} style={S.hItem} onClick={() => setQuery(h.q)}>
                          <span style={{ fontSize: 12, color: "var(--t2)" }}>{h.q}</span>
                          <span style={{ fontSize: 10, color: "var(--t3)" }}>{h.t}</span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div style={S.ft}>
          Powered by <strong>TinyFish</strong> × <strong>Claude API</strong>
        </div>
      </main>
    </div>
  );
}

const S = {
  root: { display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)", fontFamily: "var(--fb)", color: "var(--t1)" },
  side: { height: "100vh", background: "var(--s1)", borderRight: "1px solid var(--b1)", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .2s", overflow: "hidden" },
  sHead: { display: "flex", alignItems: "center", gap: 10, padding: "16px 14px", cursor: "pointer", borderBottom: "1px solid var(--b1)" },
  logo: { width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#818cf8,#f472b6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 900, fontSize: 14, color: "#fff", flexShrink: 0 },
  secLbl: { fontSize: 9, letterSpacing: 2, color: "var(--t3)", textTransform: "uppercase", padding: "16px 14px 6px", fontWeight: 600 },
  nav: { display: "flex", alignItems: "center", gap: 10, borderRadius: 8, cursor: "pointer", transition: "all .15s", marginBottom: 2, minHeight: 36 },
  pBadge: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderTop: "1px solid var(--b1)", cursor: "pointer" },
  main: { flex: 1, overflowY: "auto", padding: "28px 36px 80px", position: "relative", maxWidth: 800 },
  h1: { fontFamily: "var(--fd)", fontSize: 24, fontWeight: 800, color: "var(--t1)", margin: 0, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: "var(--t3)", margin: "4px 0 0" },
  card: { background: "var(--s1)", border: "1px solid var(--b1)", borderRadius: 10, padding: 20 },
  cardLbl: { fontSize: 10, letterSpacing: 2, color: "var(--t3)", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 },
  mc: { background: "var(--s1)", border: "1px solid var(--b1)", borderRadius: 10, padding: 16, cursor: "pointer", transition: "all .15s" },
  lbl: { display: "block", fontSize: 10, fontWeight: 600, color: "var(--t3)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 },
  inp: { width: "100%", padding: "9px 11px", borderRadius: 7, border: "1px solid var(--b1)", background: "var(--s2)", color: "var(--t1)", fontSize: 13, fontFamily: "var(--fb)", outline: "none", boxSizing: "border-box", transition: "border .2s" },
  btn: { padding: "10px 18px", borderRadius: 8, border: "none", background: "var(--ac)", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "var(--fd)", cursor: "pointer", letterSpacing: -0.3, transition: "all .15s" },
  srchW: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--b1)", background: "var(--s1)", marginBottom: 14 },
  srchI: { flex: 1, border: "none", background: "none", color: "var(--t1)", fontSize: 13, fontFamily: "var(--fb)", outline: "none" },
  runB: { width: 34, height: 34, borderRadius: 8, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, flexShrink: 0, transition: "opacity .2s" },
  ldW: { padding: "14px 16px", borderRadius: 10, border: "1px solid var(--b1)", background: "var(--s1)", marginBottom: 14 },
  pTrk: { height: 2, borderRadius: 1, background: "var(--b1)", marginTop: 10, overflow: "hidden" },
  pBar: { height: "100%", borderRadius: 1, animation: "prog 10s ease-out forwards", width: "0%" },
  togB: { background: "none", border: "none", color: "var(--t3)", fontSize: 11, cursor: "pointer", padding: "4px 0", fontFamily: "var(--fb)" },
  rawP: { fontSize: 10, color: "var(--t3)", background: "var(--s2)", borderRadius: 8, padding: 12, overflow: "auto", maxHeight: 180, whiteSpace: "pre-wrap", wordBreak: "break-all", marginTop: 6, border: "1px solid var(--b1)" },
  hItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 7, background: "var(--s1)", border: "1px solid var(--b1)", marginBottom: 4, cursor: "pointer" },
  ft: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 36px", fontSize: 11, color: "var(--t3)", borderTop: "1px solid var(--b1)", background: "var(--bg)" },
  keyOv: { position: "fixed", inset: 0, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  onboard: { maxWidth: 440, width: "100%", padding: "36px 32px", textAlign: "left", background: "var(--s1)", border: "1px solid var(--b1)", borderRadius: 12 },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap');
  :root {
    --fd:'Outfit',sans-serif; --fb:'Outfit',sans-serif; --fc:'IBM Plex Mono',monospace;
    --bg:#0b0b0f; --s1:#111118; --s2:#18181f; --b1:#1f1f2a;
    --t1:#e8e8ed; --t2:#a0a0ab; --t3:#5a5a66;
    --ac:#818cf8; --navA:#1a1a26; --green:#34d399;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes prog{0%{width:0}15%{width:25%}40%{width:50%}70%{width:75%}100%{width:95%}}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  .spin{display:inline-block;animation:spin .8s linear infinite}
  input:focus,select:focus{border-color:var(--ac)!important}
  button:hover{filter:brightness(1.12)}
  .mc:hover{border-color:var(--ac)!important;transform:translateY(-1px)}
  ::selection{background:rgba(129,140,248,.25)}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--b1);border-radius:3px}
`;
