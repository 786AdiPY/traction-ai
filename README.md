Traction.ai

Live Demo:https://traction-ai-gold.vercel.app/
username:admin@zenohosp.com
password:admin@123


Overview
Traction.ai scrapes the live web using the TinyFish Web Agent API and delivers structured, actionable intelligence to startup founders — personalized to their company, stage, and market.
Each query triggers parallel web scrapes across Reddit, Hacker News, Google, competitor websites, and job boards. The raw data is then analyzed by an LLM (via OpenRouter) to produce evidence-backed recommendations.
Modules
ModulePurposeOpinionAIStrategic advice grounded in real founder discussions from Reddit and HNCompeteMapLive competitive analysis — features, pricing, sentiment, and market gapsHireSignalHiring intelligence — role demand, salary benchmarks, competitor strategy signalsInvestorRadarActive investors in your space, funding trends, and fundraising readinessPriceLabCompetitor pricing data and community sentiment on value perceptionChurnSenseEarly warning signals from customer complaints and churn discussions

Architecture
                         ┌────────────────────┐
                         │     React (UI)     │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │  Java Spring Boot  │
                         │    (REST API)      │
                         └───┬────────────┬───┘
                             │            │
                 ┌───────────▼──┐   ┌─────▼───────────┐
                 │  TinyFish    │   │   OpenRouter     │
                 │  Web Agent   │   │   (LLM API)     │
                 │  API         │   │                  │
                 └───────┬──────┘   └────────┬─────────┘
                         │                   │
          ┌──────────────▼──────────────┐    │
          │  Live Web Sources           │    │
          │  Reddit · HN · Google       │    │
          │  Job boards · News          │    │
          │  Competitor sites · Reviews │    │
          └─────────────────────────────┘    │
                         │                   │
                         ▼                   ▼
                 ┌─────────────────────────────┐
                 │  Scraped data + AI analysis  │
                 │  returned to user            │
                 └──────────────┬───────────────┘
                                │
                                ▼
                      ┌───────────────────┐
                      │   PostgreSQL      │
                      │   (Supabase)      │
                      └───────────────────┘

Tech Stack
LayerTechnologyFrontendReact, Tailwind CSSBackendJava, Spring BootWeb ScrapingTinyFish Web Agent APILLM AnalysisOpenRouter APIDatabasePostgreSQL (Supabase)AuthenticationSupabase AuthDeploymentVercel (frontend), Railway / Render (backend)


Setup:

Prerequisites

Java 17+
Node.js 18+
PostgreSQL (or a Supabase project)
API keys for TinyFish and OpenRouter

Environment
envTINYFISH_API_KEY=tf_your_key
OPENROUTER_API_KEY=sk-or-your_key
DATABASE_URL=postgresql://user:pass@host:5432/traction_ai
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key


Backend
bashcd backend
./mvnw spring-boot:run


Frontend
bashcd frontend
npm install
npm run dev

Access
Open http://localhost:5173. Sign in
