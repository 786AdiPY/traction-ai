export const MODULES = [
  { id: "dashboard", name: "Dashboard", icon: "◉", section: "home" },
  { id: "opinion", name: "OpinionAI", desc: "Evidence-backed advisor", icon: "⬡", color: "#818cf8", section: "intel" },
  { id: "compete", name: "CompeteMap", desc: "Competitive analysis", icon: "◎", color: "#38bdf8", section: "intel" },
  { id: "hire", name: "HireSignal", desc: "Hiring intelligence", icon: "⊞", color: "#34d399", section: "intel" },
  { id: "investor", name: "InvestorRadar", desc: "Funding & investors", icon: "◈", color: "#fbbf24", section: "intel" },
  { id: "price", name: "PriceLab", desc: "Pricing intelligence", icon: "⊡", color: "#fb7185", section: "monitor" },
  { id: "churn", name: "ChurnSense", desc: "Sentiment early warning", icon: "◬", color: "#2dd4bf", section: "monitor" },
  { id: "settings", name: "Settings", icon: "⚙", section: "sys" },
];

export const SECTIONS = [
  { id: "home", label: "" },
  { id: "intel", label: "INTELLIGENCE" },
  { id: "monitor", label: "MONITOR" },
  { id: "sys", label: "" },
];

const str = JSON.stringify;

/**
 * OpinionAI: single TinyFish run (minimum latency). One Reddit search; output must split pos/neg in JSON.
 */
function opinionTasks(q) {
  const item = `{"title":str,"url_or_permalink":str,"snippet":str}`;
  return [
    {
      url: `https://www.reddit.com/r/startups/search/?q=${encodeURIComponent(q)}&restrict_sr=1`,
      source: "r/startups",
      bucket: "mixed",
      goal: `Topic: ${str(q)}. JSON only, no prose: {"positive":[${item},...],"negative":[${item},...]} — up to 3 each. positive = traction/validation wins; negative = failures/risks/post-mortems.`,
    },
  ];
}

/** InvestorRadar: one Google scrape only (minimum latency). */
function investorTasks(q) {
  return [
    {
      url: `https://www.google.com/search?q=${encodeURIComponent(`${q} startup funding raised 2026`)}`,
      source: "Google Search",
      bucket: "funding",
      goal: `Topic: ${str(q)}. JSON only: up to 5 items [{"company":str,"amount":str,"investor":str,"stage":str,"date":str}].`,
    },
  ];
}

/** UI labels for the InvestorRadar “Site” panel (matches scrape plan). */
export function getInvestorSourceRows(q) {
  const t = (q && String(q).trim()) || "{query}";
  return [{ site: "Google Search", pills: [`${t} startup funding raised 2026`] }];
}

export function getTasks(id, q) {
  const e = encodeURIComponent(q);
  const m = {
    opinion: opinionTasks(q),
    compete: [
      {
        url: `https://www.google.com/search?q=${e}+competitors+alternative`,
        goal: `Extract up to 4 competitors for "${q}" as JSON only: [{"name":str,"description":str,"differentiator":str}]`,
      },
    ],
    hire: [
      {
        url: `https://www.google.com/search?q=${e}+hiring+jobs+startup`,
        goal: `Extract up to 4 hiring signals for "${q}" as JSON only: [{"role":str,"company":str,"skills":str,"salary_range":str}]`,
      },
    ],
    investor: investorTasks(q),
    price: [
      {
        url: `https://www.google.com/search?q=${e}+pricing+plans+cost`,
        goal: `Extract up to 4 pricing data points in "${q}" space as JSON only: [{"product":str,"free_tier":str,"pro_price":str}]`,
      },
    ],
    churn: [
      {
        url: `https://www.reddit.com/search/?q=${e}+complaint+churn+cancelled`,
        goal: `Extract up to 4 threads for "${q}" as JSON only: [{"title":str,"snippet":str,"churn_reason":str}]`,
      },
    ],
  };
  return m[id] || [];
}

export function getSysPrompt(id) {
  const p = {
    opinion: `You are OpinionAI. The founder's active startup profile and question are given below.

The JSON is live TinyFish research (each object may include source, bucket, url, scraped). Use POSITIVE evidence from scraped.positive OR any object with bucket "positive". Use NEGATIVE evidence from scraped.negative OR bucket "negative". If the scrape returned one object with bucket "mixed", read scraped.positive and scraped.negative arrays inside it.

You MUST respond with exactly three sections using these bold titles on their own lines (nothing else as top-level ** sections):

**Signals in your favour**
Use this exact pattern for each finding (repeat for every bullet):
- One-line headline (the main signal).
  Next line(s): 1–2 sentences of supporting evidence from the POSITIVE bucket in the JSON (cite what people did or said).
  Final line of that finding (required): Source: <short label> — use subreddit like r/startups, or hostname, or the scrape's source field; keep it brief.

**Risks & warning signs**
Same pattern as above for each risk:
- One-line headline.
  1–2 sentences from the NEGATIVE bucket.
  Final line (required): Source: <short label> as above.

**AI Verdict**
2–4 sentences: balanced recommendation for THIS founder (use profile: name, description, stage, category). Say what you would do next and under what conditions to reconsider. Base the verdict primarily on the scraped JSON; if data is thin, say so briefly.

Do not add a preamble.`,
    compete: "You are CompeteMap, competitive analyst. Provide: **Competitive Landscape**, **Gap Analysis**, **Positioning Strategy**.",
    hire: "You are HireSignal, hiring analyst. Provide: **Hiring Trends**, **Salary Intelligence**, **Strategic Insight**.",
    investor: `You are InvestorRadar. The founder profile and question are below. JSON is live TinyFish research (objects may include source, bucket, url, scraped).

You MUST output exactly these three sections with these bold titles on their own lines (no other top-level ** headers):

**Fundraising readiness**
Score: X/5  (integer 0–5 for THIS founder based on profile stage, traction signals in scrapes, and typical seed/Series A bars)
Then 4–6 checklist lines, each exactly in this pipe format (status must be exactly Ready, Needs work, or Missing):
- Criteria title | Ready | One short sentence tailored to this founder.
- Criteria title | Needs work | ...
- Criteria title | Missing | ...

**Funding rounds**
Up to 6 lines from scraped funding JSON and headlines; each line exactly:
- Company | Stage · Month YYYY | $X  (use best-effort if date/amount partial; write "n/a" if unknown)

**Active investors**
Up to 6 investor firms or programs relevant to this founder's space; each entry starts with a bullet, pipe-separated:
- Firm name | One-line focus (stage + geo + sector)
Optional extra sentences on the next line(s) (no leading -) for "Recent bets:" or "Signal:" if you have them from scrapes.

Do not add a preamble.`,
    price: "You are PriceLab, pricing analyst. Provide: **Market Pricing Map**, **Community Sentiment**, **Recommendation**.",
    churn: "You are ChurnSense, sentiment analyst. Provide: **Churn Signals**, **Complaint Clusters**, **Retention Playbook**.",
  };
  return p[id] || "";
}
