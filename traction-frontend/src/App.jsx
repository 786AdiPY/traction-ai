import { useState, useEffect, useRef } from "react";
import { appStyles as S } from "./App.styles.js";
import { MODULES, SECTIONS, getTasks, getSysPrompt } from "./constants/modules.js";
import * as Api from "./lib/api.js";
import OpinionAIView from "./components/opinionai/OpinionAIView.jsx";
import CompeteMapView from "./components/competeMap/CompeteMapView.jsx";
import HireSignalView from "./components/hireSignal/HireSignalView.jsx";
import InvestorRadarView from "./components/investorRadar/InvestorRadarView.jsx";
import RegLensView from "./components/regLens/RegLensView.jsx";
import PriceLabView from "./components/priceLab/PriceLabView.jsx";
import ChurnSenseView from "./components/churnSense/ChurnSenseView.jsx";

const INTEL_VIEWS = {
  opinion: OpinionAIView,
  compete: CompeteMapView,
  hire: HireSignalView,
  investor: InvestorRadarView,
  reg: RegLensView,
  price: PriceLabView,
  churn: ChurnSenseView,
};

const ANTHROPIC_STORAGE = "traction_anthropic_key";
const AUTH_STORAGE = "traction_auth";

function readStoredAnthropicKey() {
  try {
    return sessionStorage.getItem(ANTHROPIC_STORAGE) || import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  } catch {
    return import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  }
}

export default function App() {
  // --- Auth & Onboarding State ---
  const [step, setStep] = useState("loading"); // loading, auth, profile, dashboard
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // --- App State ---
  const [anthropicKey, setAnthropicKey] = useState(readStoredAnthropicKey);
  const [anthropicInput, setAnthropicInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [pN, setPN] = useState("");
  const [pD, setPD] = useState("");
  const [pS, setPS] = useState("idea");
  const [pC, setPC] = useState("saas");
  const [pT, setPT] = useState(1);
  
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [raw, setRaw] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [hist, setHist] = useState({});
  const ref = useRef(null);

  const mod = MODULES.find((m) => m.id === tab);
  const IntelView = INTEL_VIEWS[tab];

  // --- Initialization ---
  useEffect(() => {
    async function init() {
      const stored = localStorage.getItem(AUTH_STORAGE);
      if (stored) {
        try {
          const { token: t, user: u } = JSON.parse(stored);
          setToken(t);
          setUser(u);
          const prof = await Api.getActiveProfile(t);
          if (prof) {
            setProfile(prof);
            setStep("dashboard");
          } else {
            setStep("profile");
          }
        } catch (e) {
          localStorage.removeItem(AUTH_STORAGE);
          setStep("auth");
        }
      } else {
        setStep("auth");
      }
    }
    init();
  }, []);

  // --- Auth Handlers ---
  async function handleAuth() {
    setAuthError("");
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await Api.login(authEmail, authPassword);
      } else {
        res = await Api.register(authEmail, authPassword, authName);
      }
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(res));
      
      const prof = await Api.getActiveProfile(res.token);
      if (prof) {
        setProfile(prof);
        setStep("dashboard");
      } else {
        setStep("profile");
      }
    } catch (e) {
      setAuthError(e.message);
    }
    setLoading(false);
  }

  async function handleCreateProfile() {
    if (!pD.trim()) return;
    setLoading(true);
    try {
      const res = await Api.createProfile(token, {
        startupName: pN,
        description: pD,
        stage: pS.toUpperCase(),
        category: pC.toUpperCase(),
        teamSize: pT
      });
      setProfile(res);
      setStep("dashboard");
    } catch (e) {
      alert("Error saving profile: " + e.message);
    }
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE);
    setToken(null);
    setUser(null);
    setProfile(null);
    setStep("auth");
  }

  // --- App Logic ---
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
      const { data, error } = await Api.runScrapes(tasks);
      setPhase("AI analyzing patterns...");
      const key = anthropicKey.trim();
      let res;
      const ctx = `Founder asked: "${q}". Startup: ${profile?.description || "N/A"}, Stage: ${profile?.stage || "N/A"}, Category: ${profile?.category || "N/A"}.`;
      if (data.length > 0) {
        setRaw(data);
        if (!key) {
          res = "Add an Anthropic API key in Settings (or VITE_ANTHROPIC_API_KEY) to synthesize analysis. Raw search results are available below.";
        } else {
          res = await Api.claudeAnalyze(key, getSysPrompt(mod.id), `${ctx}\n\nScraped data:\n${JSON.stringify(data, null, 2)}\n\nProvide structured analysis.`);
        }
      } else {
        const note = error || "Live data unavailable.";
        setRaw([{ note }]);
        if (!key) {
          res = `${note}\n\nAdd an Anthropic API key in Settings for AI analysis when search data is missing.`;
        } else {
          res = await Api.claudeAnalyze(key, getSysPrompt(mod.id), `${ctx}\n\n${note}\n\nProvide structured analysis using your knowledge where needed.`);
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
      setPN(profile.startupName || "");
      setPD(profile.description || "");
      setPS(profile.stage?.toLowerCase() || "idea");
      setPC(profile.category?.toLowerCase() || "saas");
    }
  }, [tab, profile]);

  const stageOpts = ["idea", "mvp", "launched", "revenue", "funded"];
  const catOpts = ["saas", "marketplace", "consumer", "fintech", "healthtech", "ai", "ecommerce", "devtools", "other"];

  // --- Rendering Helpers ---

  if (step === "loading") {
    return <div style={{...S.root, alignItems:'center', justifyContent:'center'}}>Initializing Command Center...</div>;
  }

  if (step === "auth") {
    return (
      <div style={S.root}>
        <div style={S.keyOv}>
          <div style={S.onboard}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "var(--t3)", textTransform: "uppercase", marginBottom: 20 }}>Traction Command Center</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 28, fontWeight: 800, color: "var(--t1)", letterSpacing: -1, marginBottom: 8 }}>{isLogin ? "Login" : "Sign Up"}</div>
            <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 24, lineHeight: 1.5 }}>Access your real-time founder dashboard.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!isLogin && (
                <div>
                  <label style={S.lbl}>Full Name</label>
                  <input style={S.inp} placeholder="Jane Doe" value={authName} onChange={(e) => setAuthName(e.target.value)} />
                </div>
              )}
              <div>
                <label style={S.lbl}>Email</label>
                <input style={S.inp} placeholder="jane@startup.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
              </div>
              <div>
                <label style={S.lbl}>Password</label>
                <input style={S.inp} type="password" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAuth()} />
              </div>
              {authError && <div style={{ fontSize: 11, color: "var(--red)" }}>{authError}</div>}
              
              <button style={{ ...S.btn, marginTop: 8 }} onClick={handleAuth} disabled={loading}>
                {loading ? "Authenticating..." : isLogin ? "Login →" : "Create Account →"}
              </button>
              
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <span style={{ fontSize: 12, color: "var(--t3)" }}>
                  {isLogin ? "New to Traction?" : "Already have an account?"}{" "}
                  <button style={{ background: "none", border: "none", color: "var(--ac)", fontWeight: 600, cursor: "pointer", fontSize: 12 }} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "profile") {
    return (
      <div style={S.root}>
        <div style={S.keyOv}>
          <div style={S.onboard}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "var(--t3)", textTransform: "uppercase", marginBottom: 20 }}>Founder Onboarding</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 28, fontWeight: 800, color: "var(--t1)", letterSpacing: -1, marginBottom: 8 }}>Startup Profile</div>
            <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 24, lineHeight: 1.5 }}>Tell us about your startup to customize your command center signals.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={S.lbl}>Company or product name</label>
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
                    <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={S.lbl}>Category</label>
                <select style={S.inp} value={pC} onChange={(e) => setPC(e.target.value)}>
                  {catOpts.map((s) => (
                    <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button style={{ ...S.btn, width: "100%", marginTop: 20, opacity: pD ? 1 : 0.4 }} disabled={!pD || loading} onClick={handleCreateProfile}>
              {loading ? "Creating Profile..." : "Initialize Command Center →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const intelProps = {
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
    analysisRef: ref,
  };

  if (step !== "dashboard") return null;

  return (
    <div style={S.root}>
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
        
        {!collapsed && (
          <div style={{ padding: "0 14px 14px" }}>
            <button 
              onClick={handleLogout}
              style={{ ...S.btn, width: "100%", background: "transparent", border: "1px solid var(--b1)", color: "var(--t3)", fontSize: 11 }}
            >
              Sign Out
            </button>
          </div>
        )}

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
              {(profile.startupName || "S")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden", minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.startupName || "My Startup"}</div>
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
            <h1 style={S.h1}>{profile ? `Welcome back, ${user?.fullName || "Founder"}` : "Welcome to Traction.ai"}</h1>
            <p style={S.sub}>{profile ? `Analyzing the public web for ${profile.startupName}` : "Set up your startup profile first."}</p>
            
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
                      <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Category</label>
                  <select style={S.inp} value={pC} onChange={(e) => setPC(e.target.value)}>
                    {catOpts.map((s) => (
                      <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button style={{ ...S.btn, marginTop: 16 }} onClick={handleCreateProfile}>Update Profile</button>
            </div>
            
            <div style={{ ...S.card, marginTop: 12 }}>
              <div style={S.cardLbl}>Anthropic (analysis)</div>
              <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 12 }}>Stored in session storage on this browser.</p>
              <label style={S.lbl}>API key</label>
              <input style={S.inp} type="password" placeholder="sk-ant-..." value={anthropicInput} onChange={(e) => setAnthropicInput(e.target.value)} />
              <button style={{ ...S.btn, marginTop: 12 }} onClick={() => {
                const v = anthropicInput.trim();
                if (v) sessionStorage.setItem(ANTHROPIC_STORAGE, v);
                setAnthropicKey(v);
                setAnthropicInput("");
              }}>Save key</button>
            </div>
          </div>
        )}

        {IntelView && <IntelView {...intelProps} />}

        <div style={S.ft}>
          Powered by <strong>TinyFish</strong> × <strong>Claude API</strong>
        </div>
      </main>
    </div>
  );
}

