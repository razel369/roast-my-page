// v1 of the public API. Behaves identically to /api/roast but is the
// stable contract surface — version-bump separately if breaking.
//
// Authentication: send `x-api-key: <PRO_API_KEY>`. Without it, you fall
// through to anonymous rate limiting (3/day per IP).
//
// Request:
//   POST /api/v1/roast
//   Content-Type: application/json
//   { "url": "https://example.com" }   — audit a URL
//   { "text": "...copy..." }            — audit pasted copy
//
// Response (200):
//   { "result": { ...RoastResult }, "source": "rules" | "llm", "warning": "..." }
// Response (429):
//   { "error": "Free tier: 3 verdicts per day..." }

import { POST as v0Post, GET as v0Get } from "../../roast/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Re-export the same handlers under a versioned URL.
export const POST = v0Post;
export const GET = v0Get;
