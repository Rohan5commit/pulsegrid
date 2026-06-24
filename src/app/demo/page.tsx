"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IssueCard } from "@/components/issue-card";
import { CardSkeleton, Spinner } from "@/components/loading-states";
import { ALL_SIGNALS, DEMO_ENRICHED_CONTEXTS, DEMO_RESPONSE_PLANS, SCENARIO_PRESETS } from "@/lib/schemas/demo-data";
import { normalizeSignals } from "@/lib/normalization";
import { rankIssues } from "@/lib/ranking";
import type { NormalizedIssue, PriorityScore, EnrichedContext, ResponsePlan } from "@/lib/schemas";
import { Flame, Droplets, AlertTriangle, RotateCcw } from "lucide-react";

const SCENARIO_ICONS: Record<string, typeof Flame> = {
  "heatwave-water": Flame,
  "flood-traffic": Droplets,
  "blackout-medical": AlertTriangle,
};

interface DemoState {
  scenarioId: string | null;
  issues: NormalizedIssue[];
  priorities: PriorityScore[];
  enrichments: EnrichedContext[];
  plans: ResponsePlan[];
  selectedIssue: string | null;
  loading: boolean;
}

export default function DemoPage() {
  const router = useRouter();
  const [state, setState] = useState<DemoState>({
    scenarioId: null,
    issues: [],
    priorities: [],
    enrichments: [],
    plans: [],
    selectedIssue: null,
    loading: false,
  });

  const loadScenario = async (scenarioId: string) => {
    setState((s) => ({ ...s, loading: true, scenarioId }));
    const signals = ALL_SIGNALS[scenarioId] ?? [];
    const issues = normalizeSignals(signals);
    const priorities = rankIssues(issues);
    const enrichments = DEMO_ENRICHED_CONTEXTS[scenarioId] ?? [];
    const plans = DEMO_RESPONSE_PLANS[scenarioId] ?? [];
    setState({ scenarioId, issues, priorities, enrichments, plans, selectedIssue: null, loading: false });
  };

  const selectedIssueData = state.issues.find((i) => i.id === state.selectedIssue);
  const selectedPriority = state.priorities.find((p) => p.issueId === state.selectedIssue);
  const selectedEnrichment = state.enrichments.find((e) => e.issueId === state.selectedIssue);
  const selectedPlan = state.plans.find((p) => p.issueId === state.selectedIssue);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          <span className="gradient-text">Demo Mode</span>
        </h1>
        <p className="text-[var(--color-text-2)]">
          Select a scenario to see PulseGrid detect, prioritize, and plan responses to urban disruptions.
        </p>
      </div>

      {/* Scenario Picker */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {SCENARIO_PRESETS.map((preset) => {
          const Icon = SCENARIO_ICONS[preset.id] ?? Flame;
          return (
            <Card
              key={preset.id}
              className={`cursor-pointer border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface-2)] ${
                state.scenarioId === preset.id ? "border-[var(--color-primary)] glow-blue" : ""
              }`}
              onClick={() => loadScenario(preset.id)}
            >
              <Icon className="mb-3 h-6 w-6 text-[var(--color-primary)]" />
              <h3 className="mb-1 font-semibold">{preset.name}</h3>
              <p className="text-sm text-[var(--color-text-2)]">{preset.description}</p>
            </Card>
          );
        })}
      </div>

      {state.loading && <CardSkeleton count={3} />}

      {/* Issue Board */}
      {!state.loading && state.issues.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Issue List */}
          <div className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Detected Issues ({state.issues.length})
              </h2>
              <button
                onClick={() => loadScenario(state.scenarioId!)}
                className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-2)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <RotateCcw className="h-3 w-3" /> Refresh
              </button>
            </div>
            {state.priorities.map((priority) => {
              const issue = state.issues.find((i) => i.id === priority.issueId);
              if (!issue) return null;
              return (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  priority={priority}
                  onClick={() => setState((s) => ({ ...s, selectedIssue: issue.id }))}
                />
              );
            })}
          </div>

          {/* Detail Sidebar */}
          <div className="sticky top-20 h-fit">
            {selectedIssueData && selectedPriority ? (
              <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Badge className="bg-[var(--color-primary)]/20 text-[var(--color-primary)]">Rank #{selectedPriority.rank}</Badge>
                  <Badge className="bg-[var(--color-accent)]/20 text-[var(--color-accent)]">Score {selectedPriority.score}</Badge>
                </div>
                <h3 className="mb-2 text-lg font-bold">{selectedIssueData.title}</h3>
                <p className="mb-4 text-sm text-[var(--color-text-2)]">{selectedIssueData.description}</p>

                {/* Score Breakdown */}
                <div className="mb-4 space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-[var(--color-muted)]">Score Breakdown</h4>
                  {Object.entries(selectedPriority.breakdown).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-2)]">{key.replace("Score", "")}</span>
                      <span className="font-mono text-[var(--color-text)]">{(val as number).toFixed(1)}</span>
                    </div>
                  ))}
                </div>

                {/* AI Context */}
                {selectedEnrichment && (
                  <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                    <h4 className="text-xs font-semibold uppercase text-[var(--color-muted)]">AI Analysis</h4>
                    <div>
                      <p className="text-xs font-medium text-[var(--color-primary)]">Why It Matters</p>
                      <p className="text-sm text-[var(--color-text-2)]">{selectedEnrichment.whyItMatters}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--color-primary)]">Who Is Affected</p>
                      <p className="text-sm text-[var(--color-text-2)]">{selectedEnrichment.whoIsAffected}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--color-primary)]">Likely Next Impact</p>
                      <p className="text-sm text-[var(--color-text-2)]">{selectedEnrichment.likelyNextImpact}</p>
                    </div>
                  </div>
                )}

                {/* Response Plan Preview */}
                {selectedPlan && (
                  <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase text-[var(--color-muted)]">Immediate Action</h4>
                    <p className="text-sm text-[var(--color-text-2)]">{selectedPlan.immediateAction}</p>
                    <button
                      onClick={() =>
                        router.push(
                          `/response-plan?scenario=${state.scenarioId}&issue=${selectedIssueData.id}`
                        )
                      }
                      className="mt-3 w-full rounded-lg bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/20"
                    >
                      View Full Response Plan →
                    </button>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
                <p className="text-sm text-[var(--color-text-2)]">Select an issue to view details</p>
              </Card>
            )}

            {/* Quick Actions */}
            {state.scenarioId && !state.loading && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => router.push(`/summary?scenario=${state.scenarioId}`)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  View Impact Summary →
                </button>
                <button
                  onClick={() => router.push(`/ask?scenario=${state.scenarioId}`)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  Ask PulseGrid →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!state.loading && state.issues.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50 p-16 text-center">
          <h3 className="mb-2 text-lg font-semibold">Select a Scenario</h3>
          <p className="text-sm text-[var(--color-text-2)]">
            Choose one of the three preset scenarios above to begin the demo.
          </p>
        </div>
      )}
    </div>
  );
}
