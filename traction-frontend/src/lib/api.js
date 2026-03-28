const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");
const CL_API = "https://api.anthropic.com/v1/messages";

/** POST /v1/automation/run-sse on your API (TinyFish key only in server env). */
function runSseUrl() {
  return API_BASE.length > 0 ? `${API_BASE}/v1/automation/run-sse` : "/v1/automation/run-sse";
}

export async function tfScrape(url, goal) {
  try {
    const r = await fetch(runSseUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, goal, browser_profile: "stealth" }),
    });
    if (!r.ok) {
      if (r.status === 503)
        return { _error: "Search unavailable. Run the API and set TINYFISH_API_KEY on the server." };
      return { _error: `Search failed (${r.status}).` };
    }
    const txt = await r.text();
    const lines = txt.split("\n").filter((l) => l.startsWith("data:"));
    for (const line of lines) {
      try {
        const d = JSON.parse(line.replace(/^data:\s*/, ""));
        if (d.type === "COMPLETE" && d.status === "COMPLETED") return d.result || d.resultJson || d;
      } catch {
        /* skip malformed chunk */
      }
    }
  } catch {
    /* network */
  }
  return null;
}

export async function claudeAnalyze(apiKey, sys, usr) {
  if (!apiKey) return "";
  try {
    const r = await fetch(CL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: sys,
        messages: [{ role: "user", content: usr }],
      }),
    });
    const d = await r.json();
    return d.content?.[0]?.text || "";
  } catch {
    return "";
  }
}

export async function runScrapes(tasks) {
  const results = await Promise.allSettled(tasks.map((t) => tfScrape(t.url, t.goal)));
  let error = null;
  const data = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const v = r.value;
    if (!v) continue;
    if (v._error) {
      error = error || v._error;
      continue;
    }
    data.push(v);
  }
  return { data, error };
}
