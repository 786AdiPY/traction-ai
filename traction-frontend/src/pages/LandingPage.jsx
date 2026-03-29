import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TractionLogo from "../components/brand/TractionLogo.jsx";
import "./landing.css";

const LS = {
  page: { minHeight: "100vh", background: "#09090d", fontFamily: "var(--fb)", color: "#e8e8ed", position: "relative", overflowX: "hidden" },
  gridBg: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 },
  glowOrb1: { position: "fixed", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
  glowOrb2: { position: "fixed", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },

  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", position: "relative", zIndex: 10, transition: "all .6s ease" },
  navLeft: { display: "flex", alignItems: "center", gap: 10 },
  logoText: { fontFamily: "var(--fd)", fontSize: 17, fontWeight: 800, color: "#e8e8ed", letterSpacing: -0.5 },
  navRight: { display: "flex", alignItems: "center", gap: 20 },
  navLink: { fontSize: 13, color: "#5a5a66", textDecoration: "none", fontWeight: 500, transition: "color .2s" },
  loginBtn: { background: "none", border: "none", color: "#a0a0ab", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--fb)" },
  ctaBtn: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#818cf8", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--fd)", letterSpacing: -0.3 },

  hero: { textAlign: "center", padding: "120px 40px 80px", position: "relative", zIndex: 2 },
  heroTag: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "#818cf8", fontWeight: 600, padding: "6px 16px", borderRadius: 20, border: "1px solid #818cf825", background: "#818cf808", marginBottom: 28, transition: "all .6s ease" },
  heroDot: { width: 6, height: 6, borderRadius: "50%", background: "#818cf8", animation: "pulse 2s infinite" },
  heroTitle: { fontFamily: "var(--fd)", fontSize: 68, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, margin: "0 0 22px", background: "linear-gradient(135deg, #e8e8ed 40%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", transition: "all .8s ease" },
  heroSub: { fontSize: 17, color: "#6a6a76", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 40px", fontWeight: 400, transition: "all .8s ease" },
  heroCtas: { display: "flex", gap: 12, justifyContent: "center", transition: "all .8s ease" },
  heroBtn: { padding: "13px 32px", borderRadius: 10, border: "none", background: "#818cf8", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--fd)", letterSpacing: -0.3, transition: "all .2s" },

  features: { padding: "80px 40px", textAlign: "center", position: "relative", zIndex: 2 },
  sectionTag: { fontSize: 11, letterSpacing: 3, color: "#818cf8", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 },
  sectionTitle: { fontFamily: "var(--fd)", fontSize: 34, fontWeight: 800, color: "#e8e8ed", letterSpacing: -1.5, lineHeight: 1.2, marginBottom: 14 },
  sectionSub: { fontSize: 14, color: "#5a5a66", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px" },
  moduleGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 820, margin: "0 auto" },
  modCard: { padding: "22px 18px", background: "#0f0f14", border: "1px solid #1a1a24", borderRadius: 12, textAlign: "left", transition: "all .2s", animation: "landingFadeUp .5s ease both" },

  how: { padding: "80px 40px", textAlign: "center", position: "relative", zIndex: 2 },
  stepsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 820, margin: "0 auto" },
  step: { textAlign: "left", padding: "28px 22px", borderRadius: 12, border: "1px solid #1a1a24", background: "#0f0f14" },
  stepNum: { fontFamily: "var(--fd)", fontSize: 36, fontWeight: 900, color: "#1a1a24", marginBottom: 14 },
  stepTitle: { fontSize: 15, fontWeight: 700, color: "#e8e8ed", fontFamily: "var(--fd)", marginBottom: 8 },
  stepDesc: { fontSize: 12.5, color: "#5a5a66", lineHeight: 1.65 },

  ctaSection: { padding: "80px 40px", textAlign: "center", position: "relative", zIndex: 2 },
  ctaTitle: { fontFamily: "var(--fd)", fontSize: 38, fontWeight: 900, color: "#e8e8ed", letterSpacing: -1.5, marginBottom: 10 },
  ctaSub: { fontSize: 15, color: "#5a5a66", marginBottom: 28 },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", borderTop: "1px solid #111118", position: "relative", zIndex: 2 },
  footLeft: { display: "flex", alignItems: "center", gap: 8 },
};

const modules = [
  { name: "OpinionAI", icon: "⬡", color: "#818cf8", desc: "Ask any strategic question and get advice backed by real founder discussions from Reddit, HN, and Indie Hackers — not generic AI opinions." },
  { name: "CompeteMap", icon: "◎", color: "#38bdf8", desc: "Enter a competitor or market and get a live competitive breakdown — features, pricing, community sentiment, and gaps you can exploit." },
  { name: "HireSignal", icon: "⊞", color: "#34d399", desc: "See what roles competitors are hiring for, salary benchmarks in your domain, and what their hiring patterns reveal about their roadmap." },
  { name: "InvestorRadar", icon: "◈", color: "#fbbf24", desc: "Find who is actively funding startups in your space, what they care about, and how to approach them — with a fundraising readiness check." },
  { name: "PriceLab", icon: "⊡", color: "#fb7185", desc: "Scrape competitor pricing pages and Reddit discussions to see what the market charges, what users think, and what you should price at." },
  { name: "ChurnSense", icon: "◬", color: "#2dd4bf", desc: "Detect customer complaints and churn signals from Reddit, reviews, and forums before they show up in your own metrics." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const goLogin = () => navigate("/login");
  const goSignup = () => navigate("/login?signup=1");

  return (
    <div className="landing-page" style={LS.page}>
      <div style={LS.gridBg} />
      <div style={LS.glowOrb1} />
      <div style={LS.glowOrb2} />

      <nav className="landing-top-nav" style={{ ...LS.nav, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(-10px)" }}>
        <div style={LS.navLeft}>
          <TractionLogo size={30} />
          <span style={LS.logoText}>Traction.ai</span>
        </div>
        <div style={LS.navRight}>
          <a href="#features" className="landing-nav-link" style={LS.navLink}>Features</a>
          <a href="#how" className="landing-nav-link" style={LS.navLink}>How it works</a>
          <button type="button" style={LS.loginBtn} onClick={goLogin}>Log in</button>
          <button type="button" style={LS.ctaBtn} onClick={goSignup}>Get started</button>
        </div>
      </nav>

      <section className="landing-section" style={LS.hero}>
        <div style={{ ...LS.heroTag, opacity: loaded ? 1 : 0, transitionDelay: "0.2s" }}>
          <span style={LS.heroDot} />
          Powered by TinyFish Web Agent
        </div>
        <h1 className="landing-hero-title" style={{ ...LS.heroTitle, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transitionDelay: "0.3s" }}>
          {"Don't build blind."}
        </h1>
        <p style={{ ...LS.heroSub, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transitionDelay: "0.5s" }}>
          Real-time startup intelligence scraped from the live web.
          <br />
          Six modules. One platform. Every decision backed by evidence.
        </p>
        <div style={{ ...LS.heroCtas, opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transitionDelay: "0.7s" }}>
          <button type="button" style={LS.heroBtn} onClick={goSignup}>
            Get started
          </button>
        </div>
      </section>

      <section id="features" className="landing-section" style={LS.features}>
        <div style={LS.sectionTag}>Intelligence modules</div>
        <h2 style={LS.sectionTitle}>Six tools. One unfair advantage.</h2>
        <p style={LS.sectionSub}>
          Each module scrapes live data from Reddit, Hacker News, job boards, competitor sites, and news outlets through TinyFish — then AI turns raw web data into decisions you can act on.
        </p>
        <div className="landing-mod-grid" style={LS.moduleGrid}>
          {modules.map((m, i) => (
            <div key={m.name} className="landing-mod" style={{ ...LS.modCard, animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 20, color: m.color, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: `${m.color}12`, borderRadius: 8 }}>{m.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#e8e8ed", fontFamily: "var(--fd)" }}>{m.name}</div>
              </div>
              <div style={{ fontSize: 12.5, color: "#6a6a76", lineHeight: 1.65 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="landing-section" style={LS.how}>
        <div style={LS.sectionTag}>How it works</div>
        <h2 style={LS.sectionTitle}>From question to intelligence in under a minute.</h2>
        <div className="landing-steps-row" style={LS.stepsRow}>
          {[
            { num: "01", title: "Set up your startup profile", desc: "Tell us what you are building, your stage, and your category. This takes 30 seconds and powers personalized analysis across every module." },
            { num: "02", title: "Pick a module and ask anything", desc: "Choose OpinionAI, CompeteMap, or any module. Type a question. TinyFish instantly scrapes Reddit, HN, job boards, news sites, and competitor pages — live, in real time." },
            { num: "03", title: "Get evidence-backed intelligence", desc: "AI analyzes the scraped data against your startup profile and returns structured insights — positive signals, risks, competitive gaps, and a clear recommended next step." },
          ].map((s) => (
            <div key={s.num} style={LS.step}>
              <div style={LS.stepNum}>{s.num}</div>
              <div style={LS.stepTitle}>{s.title}</div>
              <div style={LS.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section" style={LS.ctaSection}>
        <h2 style={LS.ctaTitle}>Stop guessing. Start knowing.</h2>
        <p style={LS.ctaSub}>Free to start. No credit card needed.</p>
        <button type="button" style={LS.heroBtn} onClick={goSignup}>
          Get started
        </button>
      </section>

      <footer style={LS.footer}>
        <div style={LS.footLeft}>
          <TractionLogo size={22} />
          <span style={{ fontSize: 13, color: "#5a5a66" }}>Traction.ai</span>
        </div>
        <div style={{ fontSize: 11, color: "#3a3a44" }}>Built for HackerEarth Golden Ticket Challenge 2026</div>
      </footer>
    </div>
  );
}
