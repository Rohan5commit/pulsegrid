"use client";

import { MapPin, Clock, TrendingUp, Shield, Brain } from "lucide-react";

type IssueCardProps = {
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  urgency: "immediate" | "short-term" | "planned";
  category: string;
  priority: number;
  affected: string;
  desc: string;
  aiAnalysis?: string;
  onClick?: () => void;
  active?: boolean;
};

const SEVERITY_CLASSES = {
  critical: "badge-rose",
  high: "badge-amber",
  medium: "badge-cyan",
  low: "badge-green",
};

export function IssueCard({
  title,
  severity,
  urgency,
  category,
  priority,
  affected,
  desc,
  onClick,
  active,
}: IssueCardProps) {
  return (
    <button
      onClick={onClick}
      className={`glass-card w-full p-4 text-left transition-all ${
        active ? "border-cyan-500/30 bg-cyan-500/5" : ""
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <span className={`badge-neon ${SEVERITY_CLASSES[severity]} shrink-0 text-[10px]`}>
          {severity}
        </span>
      </div>
      <p className="mb-2 text-xs text-slate-500">{desc}</p>
      <div className="flex items-center gap-3 text-[11px] text-slate-600">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {affected}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {urgency}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> {priority}
        </span>
      </div>
    </button>
  );
}
