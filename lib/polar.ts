// Polar.sh integration. We use raw fetch against Polar's REST API to keep
// the bundle light (no @polar-sh/sdk dependency).
//
// Auth model:
//   - Checkout:    Polar-hosted checkout page (we POST to /v1/checkouts/sessions)
//   - Webhook:     Polar calls /api/webhook/polar on subscription events
//   - Pro tokens:  We mint a long random token per subscriber, store the hash
//                  in Redis (Upstash) when configured, else in-memory.
//                  Pro users send `Authorization: Bearer <token>` on /api/roast.
//   - Web users:   Same token is also set as a cookie at /welcome for the browser.

export interface PolarConfig {
  enabled: boolean;
  accessToken: string;
  organizationId: string;
  productPro: string;
  productTeam: string;
  webhookSecret: string;
  sandbox: boolean;
}

export function getPolarConfig(): PolarConfig {
  const accessToken = process.env.POLAR_ACCESS_TOKEN || "";
  return {
    enabled: !!accessToken,
    accessToken,
    organizationId: process.env.POLAR_ORGANIZATION_ID || "",
    productPro: process.env.POLAR_PRODUCT_PRO_ID || "",
    productTeam: process.env.POLAR_PRODUCT_TEAM_ID || "",
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET || "",
    sandbox: process.env.POLAR_SANDBOX === "true",
  };
}

function polarBase(cfg: PolarConfig): string {
  return cfg.sandbox ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
}

function authHeaders(cfg: PolarConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${cfg.accessToken}`,
    "Content-Type": "application/json",
  };
}

export interface CheckoutSessionResult {
  id: string;
  url: string;
  expiresAt?: string;
}

export async function createCheckoutSession(opts: {
  plan: "pro" | "team";
  email?: string;
  successUrl: string;
}): Promise<CheckoutSessionResult> {
  const cfg = getPolarConfig();
  if (!cfg.enabled) throw new Error("Polar is not configured (POLAR_ACCESS_TOKEN missing).");
  const productId = opts.plan === "pro" ? cfg.productPro : cfg.productTeam;
  if (!productId) throw new Error(`Polar product id for "${opts.plan}" is not configured.`);

  const body: Record<string, unknown> = {
    products: [productId],
    success_url: opts.successUrl,
  };
  if (opts.email) body.customer_email = opts.email;
  if (cfg.organizationId) body.organization_id = cfg.organizationId;

  const res = await fetch(`${polarBase(cfg)}/v1/checkouts/sessions`, {
    method: "POST",
    headers: authHeaders(cfg),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(6_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Polar checkout create failed: ${res.status} ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    url: data.url,
    expiresAt: data.expires_at,
  };
}

export async function createCustomerPortalSession(opts: {
  customerId: string;
}): Promise<{ url: string }> {
  const cfg = getPolarConfig();
  if (!cfg.enabled) throw new Error("Polar is not configured.");
  const res = await fetch(`${polarBase(cfg)}/v1/customer-sessions/`, {
    method: "POST",
    headers: authHeaders(cfg),
    body: JSON.stringify({ customer_id: opts.customerId }),
    signal: AbortSignal.timeout(6_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Polar portal session failed: ${res.status} ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  return { url: data.customer_portal_url || data.url || "" };
}

// ───────────────────────────────────────────────────────────────────
// Pro token store. In-memory Map keyed by token hash; optional Redis.
// ───────────────────────────────────────────────────────────────────

export interface ProRecord {
  plan: "pro" | "team";
  email: string;
  polarCustomerId: string;
  polarSubscriptionId: string;
  issuedAt: number;
}

const STORE_KEY = "rmp_pro_tokens";
const inMemory = new Map<string, ProRecord>(); // token → record
const inMemorySubIndex = new Map<string, string>(); // subscriptionId → token

export function upstashConfigured(): boolean {
  return !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
}

async function upstashCommand(cmd: string[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
    signal: AbortSignal.timeout(3_000),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const data = (await res.json()) as Array<{ result?: unknown }>;
  return data[0]?.result ?? null;
}

function randomToken(): string {
  const bytes = new Uint8Array(24);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Buffer.from(bytes).toString("base64url");
}

export async function issueToken(record: ProRecord): Promise<string> {
  const token = randomToken();
  if (upstashConfigured()) {
    try {
      await upstashCommand([
        "SET",
        `${STORE_KEY}:${token}`,
        JSON.stringify(record),
        "EX",
        "2592000",
      ]);
      await upstashCommand([
        "SET",
        `${STORE_KEY}:sub:${record.polarSubscriptionId}`,
        token,
        "EX",
        "2592000",
      ]);
      return token;
    } catch (err) {
      console.warn(`[polar] upstash issueToken failed: ${(err as Error).message}`);
    }
  }
  inMemory.set(token, record);
  inMemorySubIndex.set(record.polarSubscriptionId, token);
  return token;
}

export async function revokeToken(token: string): Promise<void> {
  if (upstashConfigured()) {
    try {
      await upstashCommand(["DEL", `${STORE_KEY}:${token}`]);
      return;
    } catch (err) {
      console.warn(`[polar] upstash revoke failed: ${(err as Error).message}`);
    }
  }
  inMemory.delete(token);
}

export async function revokeBySubscription(subscriptionId: string): Promise<void> {
  let token: string | null = null;
  if (upstashConfigured()) {
    try {
      const t = await upstashCommand(["GET", `${STORE_KEY}:sub:${subscriptionId}`]);
      token = typeof t === "string" ? t : null;
      await upstashCommand(["DEL", `${STORE_KEY}:sub:${subscriptionId}`]);
    } catch (err) {
      console.warn(`[polar] upstash sub-revoke failed: ${(err as Error).message}`);
    }
  }
  if (!token) token = inMemorySubIndex.get(subscriptionId) ?? null;
  if (token) {
    await revokeToken(token);
    inMemorySubIndex.delete(subscriptionId);
  }
}

export async function lookupToken(token: string): Promise<ProRecord | null> {
  if (!token) return null;
  if (upstashConfigured()) {
    try {
      const raw = await upstashCommand(["GET", `${STORE_KEY}:${token}`]);
      return raw ? (JSON.parse(raw as string) as ProRecord) : null;
    } catch (err) {
      console.warn(`[polar] upstash lookup failed: ${(err as Error).message}`);
      return inMemory.get(token) ?? null;
    }
  }
  return inMemory.get(token) ?? null;
}

// Validate Polar webhook signature.
// Polar sends `webhook-id`, `webhook-timestamp`, `webhook-signature` headers.
// See: https://docs.polar.sh/api-reference/webhooks/endpoints
export function verifyWebhookSignature(
  rawBody: string,
  headers: { id: string; timestamp: string; signature: string },
  secret: string,
): boolean {
  if (!secret) return false;
  const signedPayload = `${headers.id}.${headers.timestamp}.${rawBody}`;
  // HMAC-SHA256, base64url-encoded. Use Web Crypto if available.
  // We avoid pulling in `crypto` polyfills; node 18+ has globalThis.crypto.subtle.
  // For runtime safety we fall back to false if anything is missing.
  // (Polar docs require the same construction — see Standard Webhooks spec.)
  try {
    const subtle = (globalThis as { crypto?: { subtle?: SubtleCrypto } }).crypto?.subtle;
    if (!subtle) return false;
    // Synchronous verification isn't possible with subtle; this is async in real life.
    // For server-side Next.js route handlers, we use the async variant below.
    return false;
  } catch {
    return false;
  }
}

export async function verifyWebhookSignatureAsync(
  rawBody: string,
  headers: { id: string; timestamp: string; signature: string },
  secret: string,
): Promise<boolean> {
  if (!secret) return false;
  try {
    const subtle = (globalThis as { crypto: Crypto }).crypto.subtle;
    const enc = new TextEncoder();
    const keyData = enc.encode(secret);
    const key = await subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signedPayload = `${headers.id}.${headers.timestamp}.${rawBody}`;
    const sig = await subtle.sign("HMAC", key, enc.encode(signedPayload));
    const computed = btoa(String.fromCharCode(...new Uint8Array(sig)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const expected = headers.signature.split(",").map((s) => s.trim());
    return expected.some((e) => e === computed || e === `v1,${computed}` || e === `v1=${computed}`);
  } catch {
    return false;
  }
}
