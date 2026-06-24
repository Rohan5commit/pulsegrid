"use client";

interface PriorityBarProps {
  score: number;
  label?: string;
  showLabel?: boolean;
}

export function PriorityBar({ score, label, showLabel = true }: PriorityBarProps) {
  const color =
    score >= 80 ? "bg-red-500" : score >= 60 ? "bg-orange-500" : score >= 40 ? "bg-yellow-500" : "bg-blue-500";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-[var(--color-text-2)]">{label ?? "Priority Score"}</span>
          <span className="font-mono font-bold text-[var(--color-text)]">{score}</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
