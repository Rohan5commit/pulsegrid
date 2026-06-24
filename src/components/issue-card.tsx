"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Clock, AlertTriangle } from "lucide-react";
import type { NormalizedIssue, PriorityScore } from "@/lib/schemas";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  info: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const URGENCY_COLORS: Record<string, string> = {
  immediate: "bg-red-500/20 text-red-400 border-red-500/30",
  urgent: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  soon: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  monitor: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

interface IssueCardProps {
  issue: NormalizedIssue;
  priority: PriorityScore;
  onClick?: () => void;
}

export function IssueCard({ issue, priority, onClick }: IssueCardProps) {
  const scoreColor =
    priority.score >= 80 ? "text-red-400" : priority.score >= 60 ? "text-orange-400" : priority.score >= 40 ? "text-yellow-400" : "text-blue-400";

  return (
    <Card
      className={`cursor-pointer border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface-2)] hover:shadow-lg hover:shadow-[var(--color-primary)]/5 ${onClick ? "hover:scale-[1.01]" : ""}`}
      onClick={onClick}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`text-2xl font-bold ${scoreColor}`}>{priority.score}</span>
            <span className="text-xs text-[var(--color-muted)]">/ 100</span>
            <Badge className={`ml-1 border ${SEVERITY_COLORS[issue.severity]}`}>{issue.severity}</Badge>
            <Badge className={`border ${URGENCY_COLORS[issue.urgency]}`}>{issue.urgency}</Badge>
          </div>
          <h3 className="text-lg font-semibold leading-tight">{issue.title}</h3>
        </div>
        {priority.score >= 80 && (
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400 animate-pulse-glow" />
        )}
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-[var(--color-text-2)]">{issue.description}</p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)]">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {issue.location}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" /> {issue.populationAffected.toLocaleString()} affected
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {new Date(issue.reportedAt).toLocaleTimeString()}
        </span>
      </div>
    </Card>
  );
}
