"use client";
import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface Props {
  plan: "pro" | "team";
  price: string;
  onSuccess?: () => void;
}

export function PayPalButton({ plan, price, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  if (!clientId) {
    return (
      <div className="border-l-4 border-ink-500 bg-bone-200 px-4 py-3 font-mono text-xs text-ink-700">
        PayPal not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local
      </div>
    );
  }

  if (paid) {
    return (
      <div className="border border-ink-900 bg-bone-50 px-4 py-4 text-center">
        <div className="font-display text-lg font-bold text-ink-900">Payment complete!</div>
        <p className="mt-1 text-sm text-ink-600">Your {plan} plan is active.</p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
        enableFunding: ["paypal", "card", "applepay"],
      }}
    >
      <div className="space-y-3">
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "subscribe",
          }}
          fundingSource={undefined}
          createOrder={async () => {
            setError(null);
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create order");
            return data.id;
          }}
          onApprove={async (data) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to capture order");
            setPaid(true);
            onSuccess?.();
          }}
          onError={(err) => {
            setError(err instanceof Error ? err.message : "Payment failed. Try again.");
          }}
          onCancel={() => {
            setError("Payment cancelled.");
          }}
        />

        {error && (
          <div className="border-l-4 border-vermillion bg-highlight-tint px-4 py-2 font-mono text-xs text-ink-900">
            {error}
          </div>
        )}

        <p className="filing text-center text-[10px]">
          {price} USD/mo · Powered by PayPal · Apple Pay available on supported devices
        </p>
      </div>
    </PayPalScriptProvider>
  );
}
