/**
 * Shrinks scrape payloads before sending to the LLM (smaller prompt → faster + cheaper).
 * Full raw blobs stay in `raw` / DB; this only affects the synthesis request.
 */
const DEFAULT_MAX_ARRAY = 10;
const DEFAULT_MAX_STRING = 1400;

export function shrinkForLlm(value, maxArray = DEFAULT_MAX_ARRAY, maxStr = DEFAULT_MAX_STRING) {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.length <= maxStr ? value : `${value.slice(0, maxStr)}…`;
  }
  if (Array.isArray(value)) {
    return value.slice(0, maxArray).map((x) => shrinkForLlm(x, maxArray, maxStr));
  }
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = shrinkForLlm(v, maxArray, maxStr);
    }
    return out;
  }
  return value;
}

export function shrinkScrapeBundleForLlm(data) {
  if (!Array.isArray(data)) return data;
  return data.map((entry) => {
    if (entry && typeof entry === "object" && "scraped" in entry) {
      return {
        source: entry.source,
        bucket: entry.bucket,
        url: entry.url,
        scraped: shrinkForLlm(entry.scraped),
      };
    }
    return shrinkForLlm(entry);
  });
}
