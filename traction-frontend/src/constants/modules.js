export const MODULES = [
  { id: "dashboard", name: "Dashboard", icon: "◉", section: "home" },
  { id: "opinion", name: "OpinionAI", desc: "Evidence-backed advisor", icon: "⬡", color: "#818cf8", section: "intel" },
  { id: "compete", name: "CompeteMap", desc: "Competitive analysis", icon: "◎", color: "#38bdf8", section: "intel" },
  { id: "hire", name: "HireSignal", desc: "Hiring intelligence", icon: "⊞", color: "#34d399", section: "intel" },
  { id: "investor", name: "InvestorRadar", desc: "Funding & investors", icon: "◈", color: "#fbbf24", section: "intel" },
  { id: "reg", name: "RegLens", desc: "Regulatory alerts", icon: "⊘", color: "#a78bfa", section: "monitor" },
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

export function getTasks(id, q) {
  const e = encodeURIComponent(q);
  const m = {
    opinion: [
      { url: `https://www.reddit.com/search/?q=${e}+startup+advice`, goal: `Extract top 5 Reddit posts about "${q}" startup advice as JSON: [{"title":str,"subreddit":str,"upvotes":str,"snippet":str}]` },
      { url: `https://news.ycombinator.com/`, goal: `Search for "${q}" and extract top 5 discussions as JSON: [{"title":str,"points":str,"snippet":str}]` },
    ],
    compete: [
      { url: `https://www.google.com/search?q=${e}+competitors+alternative`, goal: `Extract top 5 competitors of "${q}" as JSON: [{"name":str,"description":str,"differentiator":str}]` },
      { url: `https://www.reddit.com/search/?q=${e}+vs+alternative+comparison`, goal: `Extract top 5 comparison discussions for "${q}" as JSON: [{"title":str,"snippet":str,"verdict":str}]` },
    ],
    hire: [
      { url: `https://www.google.com/search?q=${e}+hiring+jobs+startup`, goal: `Extract top 5 job trends for "${q}" as JSON: [{"role":str,"company":str,"skills":str,"salary_range":str}]` },
      { url: `https://www.reddit.com/search/?q=${e}+hiring+team+engineer`, goal: `Extract top 5 hiring discussions for "${q}" as JSON: [{"title":str,"snippet":str,"key_insight":str}]` },
    ],
    investor: [
      { url: `https://www.google.com/search?q=${e}+startup+funding+investment+2026`, goal: `Extract top 5 funding events for "${q}" as JSON: [{"company":str,"amount":str,"investor":str,"date":str}]` },
      { url: `https://www.reddit.com/search/?q=${e}+funding+VC+raise`, goal: `Extract top 5 fundraising discussions for "${q}" as JSON: [{"title":str,"snippet":str}]` },
    ],
    reg: [
      { url: `https://www.google.com/search?q=${e}+regulation+compliance+law+2026`, goal: `Extract top 5 regulations for "${q}" as JSON: [{"regulation":str,"jurisdiction":str,"summary":str}]` },
      { url: `https://www.reddit.com/search/?q=${e}+regulation+legal+compliance`, goal: `Extract top 5 regulatory discussions for "${q}" as JSON: [{"title":str,"snippet":str}]` },
    ],
    price: [
      { url: `https://www.google.com/search?q=${e}+pricing+plans+cost`, goal: `Extract pricing for top 5 products in "${q}" space as JSON: [{"product":str,"free_tier":str,"pro_price":str}]` },
      { url: `https://www.reddit.com/search/?q=${e}+pricing+expensive+worth+cost`, goal: `Extract top 5 pricing discussions for "${q}" as JSON: [{"title":str,"snippet":str,"sentiment":str}]` },
    ],
    churn: [
      { url: `https://www.reddit.com/search/?q=${e}+cancelled+switched+unsubscribed`, goal: `Extract top 5 churn stories for "${q}" as JSON: [{"title":str,"snippet":str,"churn_reason":str}]` },
      { url: `https://www.reddit.com/search/?q=${e}+complaint+problem+issue`, goal: `Extract top 5 complaint threads for "${q}" as JSON: [{"title":str,"snippet":str,"issue_category":str}]` },
    ],
  };
  return m[id] || [];
}

export function getSysPrompt(id) {
  const p = {
    opinion: "You are OpinionAI, a startup advisor. Analyze scraped data. Provide: **Community Consensus**, **Contrarian View**, **Your Recommendation**. Be specific, cite patterns.",
    compete: "You are CompeteMap, competitive analyst. Provide: **Competitive Landscape**, **Gap Analysis**, **Positioning Strategy**.",
    hire: "You are HireSignal, hiring analyst. Provide: **Hiring Trends**, **Salary Intelligence**, **Strategic Insight**.",
    investor: "You are InvestorRadar, funding analyst. Provide: **Active Investors**, **Funding Trends**, **Approach Strategy**.",
    reg: "You are RegLens, regulatory analyst. Provide: **Current Regulations**, **Upcoming Changes**, **Compliance Checklist**.",
    price: "You are PriceLab, pricing analyst. Provide: **Market Pricing Map**, **Community Sentiment**, **Recommendation**.",
    churn: "You are ChurnSense, sentiment analyst. Provide: **Churn Signals**, **Complaint Clusters**, **Retention Playbook**.",
  };
  return p[id] || "";
}
