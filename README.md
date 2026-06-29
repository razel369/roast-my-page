# Roast My Page

> Brutal AI audits for landing pages. Free. No signup. 60 seconds.

Drop any landing page URL and get a brutally specific autopsy of what's killing your conversion — with prioritized fixes, a hero rewrite, an objection-coverage map, and a 1-hour action plan. Every roast produces a shareable link with a custom OG image so your teardown doubles as marketing.

## Why this exists

Smart founders spend weeks A/B-testing buttons on pages with broken copy. Hiring a CRO consultant costs $5K–$15K. Free tools like Hotjar show data but never tell you what to fix. Roast My Page hands you the same five insights a $10K consultant would, in under a minute, for free.

## Tech

- **Next.js 14** (App Router) — static + server routes
- **TypeScript**
- **Tailwind CSS** (dark, premium, mobile-first)
- **next/og** dynamic OG image generation (no extra image service needed)
- **localStorage** for history (no auth required)
- Server-side URL fetcher + parser
- In-memory rate limit (swap for Upstash in production)
- Rule-based analyzer (architected to swap in an LLM)

## Quick start

Requires **Node.js 18+**.

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# edit NEXT_PUBLIC_SITE_URL if you want

# 3. Develop
npm run dev          # http://localhost:3000

# 4. Production build
npm run build
npm start
```

## Deploy

### Vercel (recommended) — one-command deploy

```bash
# 1. Install Vercel CLI (no need to globally install; npx works fine)
npx vercel login          # opens browser for auth

# 2. First-time setup (answer prompts: scope, link to existing project? no, project name)
npx vercel                # preview deploy

# 3. Promote to production
npx vercel --prod
```

That's it. Vercel auto-detects Next.js. The `vercel.json` in this repo already sets the right function timeouts and memory.

### Required environment variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Canonical URL (used by sitemap, OG tags) |
| `LLM_BASE_URL` | `https://api.minimax.io` | Overseas: `api.minimax.io`. China-domestic: `api.minimaxi.com` |
| `LLM_API_KEY` | `sk-cp-...` (Token Plan) or `sk-api-...` (PAYG) | Your MiniMax M3 key |
| `LLM_MODEL` | `MiniMax-M3` | Default |
| `BROWSERLESS_URL` | `https://production-sfo.browserless.io` | Get a free token at browserless.io (1000/month free) |
| `BROWSERLESS_TOKEN` | `<your token>` | Required for visual critique to work in production |

Without the LLM keys, the app falls back to the rule-engine only. Without Browserless, visual critique is disabled — text critique still works.

### Custom domain

In Vercel: **Project → Settings → Domains → Add**. Point your DNS (A or CNAME) per Vercel's instructions. SSL is automatic.

### Other hosts

Any Node host works: Netlify (with `@netlify/plugin-nextjs`), Railway, Render, Fly.io, AWS (Amplify). Build with `npm run build`, run with `npm start`. Set `PORT` and `HOSTNAME` per host's conventions.

For self-hosted / VPS deployments with full Playwright support: set `DISABLE_SCREENSHOTS=false` (or just don't set Browserless env vars) and run `npx playwright install chromium` on the host. You'll need ~200MB of disk + Chromium dependencies (libs listed in Playwright docs).

### Important Vercel caveats

1. **Function timeout**: the roast endpoint needs up to 60s (screenshots + LLM). This requires **Vercel Pro** ($20/mo). The Hobby free tier caps at 10s — usable for text-only roasts if you also set `DISABLE_SCREENSHOTS=true`.
2. **Region**: `vercel.json` pins to `fra1` (Frankfurt) by default for best latency to EU/Israel/Africa. Change to your nearest region.
3. **Memory**: the roast route is pinned to 1024 MB to handle image uploads to the LLM.

## Production checklist

- [x] Production build passes (`npm run build`)
- [x] Security headers (CSP, HSTS, X-Frame-Options, etc.) via `next.config.js`
- [x] Rate limit on `/api/roast` (8 req/min/IP by default — see `lib/rateLimit.ts`)
- [x] Dynamic OG image per shared roast (viral loop works)
- [x] robots.txt + sitemap.xml
- [x] Web manifest + favicon + Apple touch icon
- [x] error.tsx + loading.tsx + not-found.tsx
- [x] Mobile nav
- [x] Accessibility: focus rings, semantic landmarks, ARIA labels
- [x] **Optional LLM enrichment** — set 4 env vars to upgrade roasts with an OpenAI-compatible model
- [x] **Visual critique** via Playwright (dev) or Browserless (Vercel)
- [x] `vercel.json` with function timeouts and memory
- [x] `.vercelignore` excludes Chromium binary
- [ ] **TODO before serious traffic**: replace in-memory rate limiter with Upstash Ratelimit (or Vercel KV) so limits hold across serverless instances
- [ ] **TODO**: add a Vitest suite for `lib/analyzer.ts` + `lib/enrich.ts` (pure-ish functions, fast)

## Project structure

```
app/
  page.tsx                       # Landing + roast tool
  r/[id]/page.tsx                # Shareable roast view
  r/[id]/opengraph-image.tsx     # Dynamic OG image per roast
  history/page.tsx               # Saved roasts (localStorage)
  pricing/page.tsx               # Plans + waitlist
  about/page.tsx
  api/roast/route.ts             # Server-side fetch + analyze (rate-limited)
  icon.tsx, apple-icon.tsx       # Favicons
  manifest.ts, robots.ts, sitemap.ts
  error.tsx, loading.tsx, not-found.tsx
  layout.tsx, globals.css
components/
  Header, Footer, Hero
  RoastForm, RoastResults, ScoreRing, ShareButton
  Features, HowItWorks, SocialProof, FinalCTA
lib/
  types.ts        # Shared types
  analyzer.ts     # The brain — rule engine + scoring
  fetcher.ts      # URL → parsed page
  storage.ts      # LocalStorage + base64 share encoder
  share.ts        # Share-URL helpers
  seeds.ts        # Demo pages so visitors see the magic
  rateLimit.ts    # In-memory token bucket
```

## How the analyzer works

The analyzer takes a parsed page (headline, subheadlines, CTAs, body, trust signals, FAQ, pricing) and runs ~12 rules, each carrying evidence and a fix. Findings are scored by severity (critical/high/medium) and rolled into:

- **Conversion Score** (0–100)
- **Verdict** (Conversion Killer / Needs Work / Solid / Strong)
- **Top 5 Conversion Killers**, ranked
- **3 Quick Wins** to ship today
- **Hero rewrite** (headline + sub + CTA + rationale)
- **Trust-signal audit** (found vs missing)
- **Objection-coverage map** (handled vs missing)
- **1-hour action plan**

## Adding a real LLM

The app supports LLM enrichment via any **Anthropic Messages API-compatible** provider. The rule engine runs first (free, deterministic), then the LLM sharpens the evidence, rewrites copy, and flags qualitative issues the rules miss.

**Default mode (no LLM):** works out of the box. The rule engine alone produces a brutal, useful audit. `X-Source: rules` response header.

**LLM mode:** set four env vars in `.env.local`:

```bash
LLM_BASE_URL=https://api.minimaxi.com/anthropic
LLM_API_KEY=your-key
LLM_MODEL=MiniMax-M3
LLM_ENABLED=true   # optional — auto-detected when LLM_API_KEY is set
```

Works with any provider that speaks Anthropic Messages API (`POST /v1/messages`, `x-api-key` header, `content` array of blocks):

| Provider | `LLM_BASE_URL` | `LLM_MODEL` example |
|---|---|---|
| **MiniMax M3** | `https://api.minimaxi.com/anthropic` | `MiniMax-M3` |
| Anthropic | `https://api.anthropic.com` | `claude-3-5-sonnet-latest` |
| Any Anthropic-compatible proxy | your endpoint | your model |

When the LLM responds, the result gets an `AI` badge in the header. If the LLM call fails, the app silently falls back to the rule engine and surfaces the warning to the user — nothing breaks.

### Architecture

```
POST /api/roast { url | text }
   ↓
fetcher → ParsedPage
   ↓
analyzer (rule engine) → base RoastResult
   ↓                              ↑
enrich.ts → chatComplete(MiniMax M3) ┘  (if LLM_API_KEY set)
   ↓
final RoastResult + { source, warning }
```

The LLM receives:
- The parsed page (headline, body, CTAs, trust signals, FAQ, pricing, etc.)
- The rule engine's existing findings

It returns JSON matching the schema in `lib/prompts.ts`. We merge its findings with the rule findings, dedupe by title, and clamp to top 5.

### Tuning the prompt

See `lib/prompts.ts`. The system prompt instructs the LLM to act as a world-class CRO consultant — specific, brutal, never marketing-fluff. Adjust there if you want a different voice (e.g. friendlier, more B2B-formal, etc.).

## License

MIT