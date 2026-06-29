# GitHub Actions

`.github/workflows/ci.yml` runs lint, typecheck, and build on every push to `main` and every pull request.

## Deploys

Deploys happen automatically via the [Vercel GitHub App](https://vercel.com/docs/git/vercel-for-github). You don't need to configure anything — every push to `main` becomes a production deploy, and every PR gets a preview URL.

## Adding environment secrets

In GitHub: **Settings → Secrets and variables → Actions**, add:

- `VERCEL_TOKEN` — from https://vercel.com/account/tokens (only if you switch the workflow back to manual deploys).

The Vercel GitHub App already injects `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` automatically.
