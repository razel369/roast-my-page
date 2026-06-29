export interface PaypalConfig {
  clientId: string;
  secret: string;
  sandbox: boolean;
}

export function getPaypalConfig(): PaypalConfig {
  return {
    clientId: process.env.PAYPAL_CLIENT_ID || "",
    secret: process.env.PAYPAL_CLIENT_SECRET || "",
    sandbox: process.env.PAYPAL_SANDBOX !== "false",
  };
}

export function paypalBaseUrl(sandbox: boolean): string {
  return sandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

let tokenCache: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }

  const cfg = getPaypalConfig();
  const base = paypalBaseUrl(cfg.sandbox);
  const basic = Buffer.from(`${cfg.clientId}:${cfg.secret}`).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PayPal auth failed: ${res.status} ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

export interface CreateOrderParams {
  plan: "pro" | "team";
}

const PLAN_PRICES: Record<string, { price: string; description: string }> = {
  pro: { price: "19.00", description: "Roast My Page Pro — monthly" },
  team: { price: "79.00", description: "Roast My Page Team — monthly" },
};

export async function createOrder(params: CreateOrderParams): Promise<{ id: string }> {
  const cfg = getPaypalConfig();
  const base = paypalBaseUrl(cfg.sandbox);
  const plan = PLAN_PRICES[params.plan];
  if (!plan) throw new Error(`Unknown plan: ${params.plan}`);

  const accessToken = await getAccessToken();

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: plan.description,
          amount: {
            currency_code: "USD",
            value: plan.price,
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PayPal create order failed: ${res.status} ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return { id: data.id };
}

export async function captureOrder(orderId: string): Promise<{ status: string; id: string }> {
  const cfg = getPaypalConfig();
  const base = paypalBaseUrl(cfg.sandbox);
  const accessToken = await getAccessToken();

  const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PayPal capture failed: ${res.status} ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return { status: data.status, id: data.id };
}
