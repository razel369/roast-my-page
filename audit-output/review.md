# Roast My Page - Brutal SaaS Review

Date: 2026-06-30
Surface reviewed: local Next.js app at http://localhost:3000
Evidence folder: C:\Users\rmalk\roast-my-page\audit-output

## Verdict

This is a genuinely promising micro-SaaS with a strong, memorable brand system and a useful core result. The product idea is sharp: founders understand "paste URL, get brutal landing page fixes" instantly.

The problem is trust. The app promises "no signup", "no fluff", and "specific audit", then immediately does three things that work against that promise:

1. It interrupts the first visit with an onboarding tour.
2. It interrupts the first result with an email modal.
3. It leaks broken encoded characters into demo/results copy.

For a product that audits other people's copy quality, those are not small polish bugs. They make the reviewer look careless.

## Captured Steps

1. First visit onboarding blocker - weak
   Screenshot: 01-first-visit-onboarding-blocker.png
   The tour appears before the user has formed intent. It dims the page, focuses the URL input, and turns the first impression into software instruction instead of product value.

2. Clean desktop landing page - strong
   Screenshot: 03-landing-top-desktop-after-tour.png
   The hero is distinctive, memorable, and better than typical AI tool pages. The "case file" visual language gives the product a point of view.

3. Form and demo section - mixed
   Screenshot: 04-form-desktop.png
   The form is clear and fast. The demo chips are useful. But the demo text contains mojibake artifacts, which hurts credibility.

4. Result interruption - weak
   Screenshot: 05-results-top-desktop.png
   The email capture appears before the user has consumed the verdict. This contradicts the no-signup positioning and feels like a growth hack at the worst possible moment.

5. Result score and diagnosis - promising but visually dense
   Screenshots: 06-results-score-desktop.png, 07-results-verdict-desktop.png
   The result has real value: score, diagnosis grid, quick wins, hero rewrite, trust audit, and action plan. But the first read is too busy and the most useful fixes are not surfaced aggressively enough.

6. Pricing - DOM audited, screenshot blocked
   Evidence: pricing DOM snapshot from browser automation
   Pricing is reasonable at $19/mo and $79/mo, but the copy contains a trust contradiction: the page asks "Is the free tier really unlimited?" and answers "No", while other areas sell free/no signup/unlimited-ish framing.

## Highest Priority Fixes

1. Kill the onboarding tour on first visit.
   Code: C:\Users\rmalk\roast-my-page\components\Onboarding.tsx
   Evidence: 01-first-visit-onboarding-blocker.png
   Why: the product is simple enough to not need a tour. A guided tour for a one-field form says "this app is more complicated than it looks." Put the demo chips and placeholder to work instead.

2. Do not show the email modal until after the user scrolls past the first result sections or clicks share/copy.
   Code: C:\Users\rmalk\roast-my-page\components\EmailCapture.tsx
   Evidence: 05-results-top-desktop.png
   Why: asking for email before value is fully delivered breaks the "no signup" promise. Better trigger: after the user copies a verdict link, finishes the checklist, or scrolls 70% through the report.

3. Fix encoding before anything public.
   Code examples:
   - C:\Users\rmalk\roast-my-page\lib\seeds.ts
   - C:\Users\rmalk\roast-my-page\components\ShareButton.tsx
   - C:\Users\rmalk\roast-my-page\components\ProFeaturesTeaser.tsx
   Why: broken characters in a copy-audit product are conversion poison. The demo seed text currently leaks artifacts like "â€”" in rendered UI.

4. Make the result's first screen more decisive.
   Evidence: 06-results-score-desktop.png, 07-results-verdict-desktop.png
   Current result has substance, but it asks the user to parse a report. The first result view should answer:
   - "What is my score?"
   - "What is the one biggest problem?"
   - "What exact copy should I paste?"
   - "What do I fix in the next 15 minutes?"

5. Clean up free/pro positioning.
   Code examples:
   - C:\Users\rmalk\roast-my-page\app\pricing\page.tsx
   - C:\Users\rmalk\roast-my-page\app\api\roast\route.ts
   - C:\Users\rmalk\roast-my-page\components\TierBadge.tsx
   Why: "free/no signup" is compelling. "Is the free tier really unlimited? No" is awkward. Say it plainly everywhere: "3 free verdicts per day. No signup. Pro removes the cap and adds AI/visual review."

## What Is Working

- The brand is memorable. The forensic/case-file style is a real asset.
- The core workflow is low-friction: URL or paste copy, plus demos.
- The result content is meaningfully useful, especially the quick wins and hero rewrite.
- Pricing is plausible for founders and teams.
- Production build passed.

## What Is Not Working

- The app over-explains itself with modals when the concept is already simple.
- The visual style is strong but sometimes makes the UI harder to read than it needs to be.
- The result is rich, but not prioritized enough for a founder in a hurry.
- Broken encoded characters undermine trust fast.
- Some Pro claims feel ahead of the product unless those features are fully working in production.

## Build Check

Command: npm run build
Result: passed
Notes: compile, lint/type check, static generation, and build trace collection completed successfully. The build took roughly 1.5 minutes locally.

## Evidence Limits

- Desktop flow was captured in the in-app browser.
- Pricing screenshot capture timed out twice, so pricing was audited from DOM evidence.
- The in-app browser viewport override did not actually switch to mobile. The file 09-landing-mobile.png is not accepted as mobile evidence because the page still reported a desktop viewport.
