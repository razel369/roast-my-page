interface Props {
  score: number;
  verdict: string;
  size?: number;
}

export function ScoreRing({ score, verdict, size = 140 }: Props) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 82 ? "#2A4D2A" : score >= 65 ? "#7A7567" : score >= 40 ? "#D62828" : "#C8321C";

  return (
    <div className="relative inline-flex items-center justify-center animate-count-up" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#DCD8CC"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold leading-none" style={{ color }}>
          {score}
        </div>
        <div className="mt-1 text-[9px] font-mono uppercase tracking-stamped text-ink-500">
          {verdict}
        </div>
      </div>
    </div>
  );
}