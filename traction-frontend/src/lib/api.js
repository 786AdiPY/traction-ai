/** Empty base uses same-origin paths (Vite dev: proxy /api and /v1 → backend). */
const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

/** Auth & Profile */
export async function login(email, password) {
  const r = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error("Invalid credentials");
  return r.json();
}

export async function register(email, password, fullName) {
  const r = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });
  if (!r.ok) throw new Error("Registration failed");
  return r.json();
}

export async function getActiveProfile(token) {
  const r = await fetch(apiUrl("/api/profiles/active"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (r.status === 204) return null;
  if (!r.ok) throw new Error("Could not fetch profile");
  return r.json();
}

export async function createProfile(token, profile) {
  const r = await fetch(apiUrl("/api/profiles"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  if (!r.ok) throw new Error("Could not save profile");
  return r.json();
}

function runSseUrl() {
  return apiUrl("/v1/automation/run-sse");
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
        return { _error: "Search unavailable. Configure tiny_fish on the server or check the TinyFish proxy." };
      return { _error: `Search failed (${r.status}).` };
    }
    const txt = await r.text();
    const lines = txt.split("\n").filter((l) => l.startsWith("data:"));
    for (const line of lines) {
      try {
        const d = JSON.parse(line.replace(/^data:\s*/, ""));
        if (d.type === "COMPLETE" && d.status === "COMPLETED") return d.result || d.resultJson || d;
      } catch {
        /* skip */
      }
    }
  } catch {
    /* network */
  }
  return null;
}

/** OpenRouter via Spring POST /v1/llm/chat (key on server only). */
export async function llmAnalyze(system, userMessage, opts = {}) {
  const max_tokens = opts.maxTokens ?? 2048;
  try {
    const r = await fetch(apiUrl("/v1/llm/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, user: userMessage, max_tokens }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) return d.text ?? d.content ?? "";
    return d.error ? `[Analysis] ${d.error}` : "";
  } catch (e) {
    return "";
  }
}

export async function runScrapes(tasks) {
  const results = await Promise.allSettled(tasks.map((t) => tfScrape(t.url, t.goal)));
  let error = null;
  const data = [];
  results.forEach((r, i) => {
    if (r.status !== "fulfilled") return;
    const v = r.value;
    if (!v) return;
    if (v._error) {
      error = error || v._error;
      return;
    }
    const t = tasks[i];
    if (t.source != null || t.bucket != null)
      data.push({ source: t.source, bucket: t.bucket, url: t.url, scraped: v });
    else data.push(v);
  });
  return { data, error };
}
