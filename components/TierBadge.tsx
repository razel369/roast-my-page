import Link from "next/link";

interface Props {
  plan: "free" | "pro";
}

export function TierBadge({ plan }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 border border-ink-900 bg-bone-100 px-4 py-2">
      <div className="flex items-center gap-2">
        <span
          className={`grid h-6 w-12 place-items-center font-mono text-[9px] font-bold uppercase tracking-stamped ${
            plan === "pro"
              ? "bg-vermillion text-bone-50"
              : "border border-ink-900 bg-bone-50 text-ink-700"
          }`}
        >
          {plan === "pro" ? "Pro" : "Free"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">
          {plan === "pro"
            ? "Unlimited + AI critique + screenshots"
            : "3 verdicts / day · Rules only"}
        </span>
      </div>
      {plan === "free" && (
        <Link
          href="/pricing"
          className="font-mono text-[10px] uppercase tracking-stamped text-vermillion hover:underline"
        >
          Upgrade →
        </Link>
      )}
    </div>
  );
}
