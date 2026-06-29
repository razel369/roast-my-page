// v1 of the public API. Same contract as /api/roast.
//
// Authentication for Pro:
//   - HTTP header `Authorization: Bearer <pro-token>` (issued at /welcome)
//   - or cookie `rmp_pro_token=<pro-token>` (auto-set by /welcome)
//
// Free tier falls through to anonymous rate limiting (3/day per IP).
//
// Request:
//   POST /api/v1/roast
//   Content-Type: application/json
//   { "url": "https://example.com" }   — audit a URL
//   { "text": "...copy..." }            — audit pasted copy
//
// Response (200):
//   { "result": { ...RoastResult }, "source": "rules" | "llm", "plan": "free" | "pro" }
// Response (429):
//   { "error": "Free tier: 3 verdicts per day..." }

import { POST as v0Post, GET as v0Get } from "../../roast/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const POST = v0Post;
export const GET = v0Get;
