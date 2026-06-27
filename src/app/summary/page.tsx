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
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-slate-400">Loading...</div>}>
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
  if (!summary) return <div className="p-8 text-center text-slate-400">No summary available.</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pt-20">
      <button
        onClick={() => router.push(`/demo?scenario=${scenarioId}`)}
        className="mb-6 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Demo
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Impact & Readiness Summary</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Scenario: {scenarioId.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" + ")}
        </p>
      </div>

      {/* Top 3 Priorities */}
      <Card className="mb-6 border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-slate-100">Top 3 Priorities</h2>
        </div>
        <div className="space-y-3">
          {summary.topPriorities.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
                {i + 1}
              </div>
              <p className="text-sm text-slate-200">{p}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-white/5 bg-white/[0.03] p-6 text-center backdrop-blur-sm">
          <BarChart3 className="mx-auto mb-2 h-8 w-8 text-cyan-400" />
          <div className="text-2xl font-bold text-slate-100">{summary.actionCoverage}%</div>
          <p className="text-xs text-slate-400">Action Coverage</p>
          <Progress value={summary.actionCoverage} className="mt-2" />
        </Card>
        <Card className="border-white/5 bg-white/[0.03] p-6 text-center backdrop-blur-sm">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
          <div className="text-2xl font-bold text-slate-100">{summary.unresolvedRisks}</div>
          <p className="text-xs text-slate-400">Unresolved Risks</p>
        </Card>
        <Card className="border-white/5 bg-white/[0.03] p-6 text-center backdrop-blur-sm">
          <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
          <div className="text-2xl font-bold text-slate-100">{issues.length}</div>
          <p className="text-xs text-slate-400">Issues Tracked</p>
        </Card>
      </div>

      {/* Affected Groups */}
      <Card className="mb-6 border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-slate-100">Affected Groups</h2>
        </div>
        <div className="space-y-2">
          {summary.affectedGroups.map((g, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 text-sm text-slate-400">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              {g}
            </div>
          ))}
        </div>
      </Card>

      {/* Readiness */}
      <Card className="mb-6 border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-100">Readiness Level</h2>
        <p className="text-sm text-slate-400">{summary.readinessLevel}</p>
      </Card>

      {/* Impact & Decisions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
          <h2 className="mb-2 text-lg font-semibold text-slate-100">Expected Community Impact</h2>
          <p className="text-sm leading-relaxed text-slate-400">{summary.expectedCommunityImpact}</p>
        </Card>
        <Card className="border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
          <h2 className="mb-2 text-lg font-semibold text-slate-100">Decisions Made Faster</h2>
          <p className="text-sm leading-relaxed text-slate-400">{summary.decisionsMadeFaster}</p>
        </Card>
      </div>
    </div>
  );
}
