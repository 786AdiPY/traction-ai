import { getInvestorSourceRows } from "../../constants/modules.js";
import { intelModuleStyles as I } from "./IntelModuleView.styles.js";

function Section({ color, title, children }) {
  return (
    <div style={{ ...I.card, padding: "16px 18px", marginBottom: 14, borderLeft: `4px solid ${color}` }}>
      <div style={{ ...I.analysisSectionLabel, color, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function Muted({ children }) {
  return <p style={{ fontSize: 11, color: "var(--t3)", margin: 0, lineHeight: 1.55 }}>{children}</p>;
}

export function CompeteMapStatic({ profile }) {
  const name = profile?.startupName || "Your startup";
  const c = "#38bdf8";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 960 }}>
      <Muted>
        Reference landscape for <strong style={{ color: "var(--t1)" }}>{name}</strong> — illustrative until live CompeteMap runs return.
      </Muted>
      <Section color={c} title="Competitive landscape">
        {[
          ["Notion", "All-in-one workspace; strong PLG and templates.", "High overlap"],
          ["Coda", "Doc + lightweight apps; automation-heavy buyers.", "Medium"],
          ["Airtable", "Data-centric ops; enterprise expansion motion.", "Medium"],
        ].map(([n, d, t], i) => (
          <div key={n} style={{ padding: "12px 0", borderTop: i ? "1px solid var(--b1)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "var(--t1)" }}>{n}</span>
              <span style={{ fontSize: 10, color: c, background: `${c}18`, padding: "2px 8px", borderRadius: 6 }}>{t}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 4, lineHeight: 1.45 }}>{d}</div>
          </div>
        ))}
      </Section>
      <Section color={c} title="Gap analysis">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--t2)", lineHeight: 1.65 }}>
          <li>Narrow ICP vs “everyone in ops” — sharper buyer persona wins demos.</li>
          <li>Integrations cited in reviews: calendar, CRM, SSO often decide shortlists.</li>
          <li>Incumbents win on brand; challengers win on speed and vertical workflows.</li>
        </ul>
      </Section>
      <Section color={c} title="Positioning strategy">
        <Muted>
          Lead with the workflow you own end-to-end, publish 2–3 proof points (time saved, error reduction), and anchor pricing against the
          substitute the buyer already pays for—not the widest competitor.
        </Muted>
      </Section>
    </div>
  );
}

export function HireSignalStatic({ profile }) {
  const name = profile?.startupName || "Your startup";
  const c = "#34d399";
  return (
    <div style={{ maxWidth: 960 }}>
      <Muted>
        Hiring market snapshot for teams like <strong style={{ color: "var(--t1)" }}>{name}</strong>.
      </Muted>
      <Section color={c} title="In-demand roles">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginTop: 4 }}>
          {[
            ["Full-stack (product)", "Typescript + infra breadth"],
            ["Product design", "0→1 systems thinking"],
            ["Founding AE", "Founder-led → repeatable outbound"],
          ].map(([t, s]) => (
            <div key={t} style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--b1)", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--t1)" }}>{t}</div>
              <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section color={c} title="Compensation bands (US, indicative)">
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--t3)", fontSize: 10, textAlign: "left" }}>
              <th style={{ padding: "8px 0", borderBottom: "1px solid var(--b1)" }}>Role</th>
              <th style={{ padding: "8px 0", borderBottom: "1px solid var(--b1)" }}>Band</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Senior engineer", "$160–210K + equity"],
              ["Designer (senior)", "$130–165K"],
              ["GTM / AE", "$110–140K base + OTE"],
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ padding: "10px 0", borderBottom: "1px solid var(--b1)", color: "var(--t1)" }}>{a}</td>
                <td style={{ padding: "10px 0", borderBottom: "1px solid var(--b1)", color: "var(--t2)" }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <Section color={c} title="Strategic insight">
        <Muted>
          Early teams hire for learning velocity: one senior who can ship vertically beats three narrow ICs until PMF is obvious. Document
          your interview scorecard so every hire raises the bar.
        </Muted>
      </Section>
    </div>
  );
}

const GOLD = "#fbbf24";

export function InvestorRadarStatic({ profile, query }) {
  const name = profile?.startupName || "your startup";
  const rows = getInvestorSourceRows(query || "");
  const readiness = [
    { title: "Product in market", status: "Ready", note: "Shipped MVP with early users — baseline for seed conversations." },
    { title: "Pilot LOIs", status: "Needs work", note: "Aim for 2–3 written pilots in your ICP before a broad raise." },
    { title: "Revenue / MRR", status: "Missing", note: "Even small paid revenue changes investor calibration." },
    { title: "ICP clarity", status: "Needs work", note: "Tighten from broad vertical to named buyer + budget owner." },
  ];
  const rounds = [
    ["MedPilot", "Seed · 2026", "$4.2M"],
    ["CareStack", "Series B · 2026", "$32M"],
    ["Eka.Care", "Series A · 2026", "$15M"],
  ];
  const investors = [
    { name: "Sequoia Surge", focus: "Seed, India / SEA, health & SaaS", detail: "Recent: clinic ops, B2B health APIs." },
    { name: "General Catalyst", focus: "Series A+, global healthtech", detail: "Thesis: workflow AI; looks for distribution + compliance story." },
    { name: "YourNest VC", focus: "Pre-seed — Seed, India", detail: "Hands-on GTM for first 10 customers." },
  ];
  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ ...I.card, padding: "14px 16px", marginBottom: 14, borderTop: `2px solid ${GOLD}33` }}>
        <div style={{ ...I.analysisSectionLabel, color: GOLD, marginBottom: 12 }}>Data sources (live runs)</div>
        {rows.map((row, i) => (
          <div key={row.site} style={{ borderTop: i ? "1px solid var(--b1)" : "none", paddingTop: i ? 12 : 0, marginTop: i ? 12 : 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{row.site}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {row.pills.map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: 11,
                    fontFamily: "ui-monospace, monospace",
                    color: "#fb7185",
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid var(--b1)",
                    padding: "4px 8px",
                    borderRadius: 6,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <Muted>
          Illustrative radar for <strong style={{ color: "var(--t1)" }}>{name}</strong> — matches InvestorRadar layout; connect TinyFish again for
          live rounds.
        </Muted>
      </div>
      <div style={{ ...I.card, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Fundraising readiness</span>
          <span style={{ fontWeight: 800, color: GOLD }}>2/5</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "var(--b1)", marginBottom: 12 }}>
          <div style={{ width: "40%", height: "100%", background: GOLD, borderRadius: 2 }} />
        </div>
        {readiness.map((r, i) => (
          <div key={r.title} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: i ? "1px solid var(--b1)" : "none" }}>
            <span style={{ color: r.status === "Ready" ? "#34d399" : r.status === "Missing" ? "#f87171" : "#fb923c" }}>{r.status === "Ready" ? "✓" : r.status === "Missing" ? "✕" : "!"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>{r.note}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `${GOLD}22`, color: GOLD }}>{r.status}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <div style={{ ...I.card, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: GOLD, marginBottom: 10 }}>| FUNDING ROUNDS</div>
          {rounds.map(([co, meta, amt], i) => (
            <div key={co} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: i ? "1px solid var(--b1)" : "none" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{co}</div>
                <div style={{ fontSize: 11, color: "var(--t3)" }}>{meta}</div>
              </div>
              <div style={{ fontWeight: 800, color: GOLD }}>{amt}</div>
            </div>
          ))}
        </div>
        <div style={{ ...I.card, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: GOLD, marginBottom: 10 }}>| ACTIVE INVESTORS</div>
          {investors.map((inv, i) => (
            <div key={inv.name} style={{ padding: "10px 0", borderTop: i ? "1px solid var(--b1)" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: 12 }}>{inv.name}</div>
              <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>{inv.focus}</div>
              <div style={{ fontSize: 11, color: "var(--t2)", marginTop: 6 }}>{inv.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PriceLabStatic({ profile }) {
  const c = "#fb7185";
  return (
    <div style={{ maxWidth: 960 }}>
      <Muted>
        Pricing reference for <strong style={{ color: "var(--t1)" }}>{profile?.startupName || "your product"}</strong>.
      </Muted>
      <Section color={c} title="Market pricing map">
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--t3)", fontSize: 10, textAlign: "left" }}>
              <th style={{ padding: "8px 0", borderBottom: "1px solid var(--b1)" }}>Tier</th>
              <th style={{ padding: "8px 0", borderBottom: "1px solid var(--b1)" }}>Typical range</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Self-serve", "$12–29 / seat / mo"],
              ["Team", "$49–99 / mo flat"],
              ["Business", "$199–499 / mo + SSO"],
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ padding: "10px 0", borderBottom: "1px solid var(--b1)" }}>{a}</td>
                <td style={{ padding: "10px 0", borderBottom: "1px solid var(--b1)", color: "var(--t2)" }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <Section color={c} title="Community sentiment">
        <Muted>
          Buyers compare “fair” pricing to the last tool in the stack, not your costs. Annual prepay with 15–20% discount is a common
          compromise for SMB.
        </Muted>
      </Section>
      <Section color={c} title="Recommendation">
        <Muted>
          Publish a transparent page with 3 tiers, cap enterprise talk track to security + procurement, and run one willingness-to-pay interview
          per week until renewals feel predictable.
        </Muted>
      </Section>
    </div>
  );
}

export function ChurnSenseStatic({ profile }) {
  const c = "#2dd4bf";
  return (
    <div style={{ maxWidth: 960 }}>
      <Muted>
        Early warning themes for <strong style={{ color: "var(--t1)" }}>{profile?.startupName || "your product"}</strong>.
      </Muted>
      <Section color={c} title="Churn signals">
        <div style={{ display: "grid", gap: 10 }}>
          {[
            ["Usage cliff", "DAU drops 40%+ before renewal — flag for CSM within 48h."],
            ["Support tone", "Repeated “confusing” or “missing feature” in tickets clusters by cohort."],
            ["Champion left", "Economic buyer churn without handoff is the #1 silent killer."],
          ].map(([t, s]) => (
            <div key={t} style={{ padding: 12, borderRadius: 8, border: "1px solid var(--b1)", background: "rgba(255,255,255,.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 4, lineHeight: 1.45 }}>{s}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section color={c} title="Complaint clusters">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--t2)", lineHeight: 1.65 }}>
          <li>Onboarding length vs time-to-value</li>
          <li>Invoice / seat reconciliation</li>
          <li>Mobile or offline gaps vs expectations set in sales</li>
        </ul>
      </Section>
      <Section color={c} title="Retention playbook">
        <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--t2)", lineHeight: 1.65 }}>
          <li>Instrument activation milestones in the first 7 days.</li>
          <li>Quarterly business review template for &gt;$5K ACV.</li>
          <li>Win-back offer only after root-cause doc is written.</li>
        </ol>
      </Section>
    </div>
  );
}
