// In-memory rate limiter with a sliding window algorithm.
// Falls back from Upstash when env vars are missing (local dev).
// Swap import to @upstash/ratelimit + @upstash/redis for production.

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

// Default: 3 requests per 24 hours (86400 seconds)
const DEFAULT_LIMIT = parseInt(process.env.RATE_LIMIT?.split("/")[0] || "3", 10);
const DEFAULT_WINDOW_MS =
  (parseInt(process.env.RATE_LIMIT?.split("/")[1] || "86400", 10)) * 1000;

export async function rateLimit(
  key: string,
): Promise<{ allowed: boolean; remaining: number; resetMs: number }> {
  const now = Date.now();
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < DEFAULT_WINDOW_MS);

  if (entry.timestamps.length >= DEFAULT_LIMIT) {
    // When was the oldest in this window? That's our reset time.
    const oldest = entry.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldest + DEFAULT_WINDOW_MS - now,
    };
  }

  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: DEFAULT_LIMIT - entry.timestamps.length,
    resetMs: DEFAULT_WINDOW_MS,
  };
}

export function clientIpFromHeaders(h: Headers): string {
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "anon"
  );
}
