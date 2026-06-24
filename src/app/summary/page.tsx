"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/loading-states";
import { ALL_SIGNALS, DEMO_IMPACT_SUMMARY } from "@/lib/schemas/demo-data";
import { normalizeSignals } from "@/lib/normalization";
import { rankIssues } from "@/lib/ranking";
import type { ImpactSummary, NormalizedIssue, PriorityScore } from "@/lib/schemas";
import { TrendingUp, Users, AlertTriangle, CheckCircle, ArrowLeft, BarChart3 } from "lucide-react";

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-[var(--color-text-2)]">Loading...</div>}>
      <SummaryInner />
    </Suspense>
  );
}

function SummaryInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scenarioId = searchParams.get("scenario") ?? "heatwave-water";
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [issues, setIssues] = useState<NormalizedIssue[]>([]);
  const [priorities, setPriorities] = useState<PriorityScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const signals = ALL_SIGNALS[scenarioId] ?? [];
    const normalized = normalizeSignals(signals);
    const ranked = rankIssues(normalized);
    setIssues(normalized);
    setPriorities(ranked);
    setSummary(DEMO_IMPACT_SUMMARY[scenarioId] ?? null);
    setLoading(false);
  }, [scenarioId]);

  if (loading) return <Spinner size="lg" label="Generating impact summary..." />;
  if (!summary) return <div className="p-8 text-center text-[var(--color-text-2)]">No summary available.</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button
        onClick={() => router.push(`/demo?scenario=${scenarioId}`)}
        className="mb-6 flex items-center gap-1 text-sm text-[var(--color-text-2)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Demo
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Impact & Readiness Summary</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-2)]">
          Scenario: {scenarioId.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" + ")}
        </p>
      </div>

      {/* Top 3 Priorities */}
      <Card className="mb-6 border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
          <h2 className="text-lg font-semibold">Top 3 Priorities</h2>
        </div>
        <div className="space-y-3">
          {summary.topPriorities.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-xs font-bold text-[var(--color-primary)]">
                {i + 1}
              </div>
              <p className="text-sm text-[var(--color-text)]">{p}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <BarChart3 className="mx-auto mb-2 h-8 w-8 text-[var(--color-primary)]" />
          <div className="text-2xl font-bold">{summary.actionCoverage}%</div>
          <p className="text-xs text-[var(--color-text-2)]">Action Coverage</p>
          <Progress value={summary.actionCoverage} className="mt-2 h-2" />
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
          <div className="text-2xl font-bold">{summary.unresolvedRisks}</div>
          <p className="text-xs text-[var(--color-text-2)]">Unresolved Risks</p>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <CheckCircle className="mx-auto mb-2 h-8 w-8 text-[var(--color-accent)]" />
          <div className="text-2xl font-bold">{issues.length}</div>
          <p className="text-xs text-[var(--color-text-2)]">Issues Tracked</p>
        </Card>
      </div>

      {/* Affected Groups */}
      <Card className="mb-6 border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-[var(--color-accent)]" />
          <h2 className="text-lg font-semibold">Affected Groups</h2>
        </div>
        <div className="space-y-2">
          {summary.affectedGroups.map((g, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text-2)]">
              <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
              {g}
            </div>
          ))}
        </div>
      </Card>

      {/* Readiness */}
      <Card className="mb-6 border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-2 text-lg font-semibold">Readiness Level</h2>
        <p className="text-sm text-[var(--color-text-2)]">{summary.readinessLevel}</p>
      </Card>

      {/* Impact & Decisions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="mb-2 text-lg font-semibold">Expected Community Impact</h2>
          <p className="text-sm leading-relaxed text-[var(--color-text-2)]">{summary.expectedCommunityImpact}</p>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="mb-2 text-lg font-semibold">Decisions Made Faster</h2>
          <p className="text-sm leading-relaxed text-[var(--color-text-2)]">{summary.decisionsMadeFaster}</p>
        </Card>
      </div>
    </div>
  );
}
