"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/loading-states";
import { ALL_SIGNALS, DEMO_ENRICHED_CONTEXTS, DEMO_RESPONSE_PLANS, DEMO_IMPACT_SUMMARY, SCENARIO_PRESETS } from "@/lib/schemas/demo-data";
import { normalizeSignals } from "@/lib/normalization";
import { rankIssues } from "@/lib/ranking";
import { generateHandoffNote } from "@/lib/planning";
import type { NormalizedIssue, PriorityScore, EnrichedContext, ResponsePlan, AlertDraft } from "@/lib/schemas";
import { CheckCircle, AlertTriangle, Clock, Users, ArrowLeft, MessageSquare, ClipboardList } from "lucide-react";

export default function ResponsePlanPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-[var(--color-text-2)]">Loading...</div>}>
      <ResponsePlanInner />
    </Suspense>
  );
}

function ResponsePlanInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scenarioId = searchParams.get("scenario") ?? "heatwave-water";
  const issueId = searchParams.get("issue");

  const [issues, setIssues] = useState<NormalizedIssue[]>([]);
  const [priorities, setPriorities] = useState<PriorityScore[]>([]);
  const [enrichments, setEnrichments] = useState<EnrichedContext[]>([]);
  const [plans, setPlans] = useState<ResponsePlan[]>([]);
  const [alerts, setAlerts] = useState<AlertDraft[]>([]);
  const [activeTab, setActiveTab] = useState<"plan" | "alerts" | "handoff">("plan");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
    const signals = ALL_SIGNALS[scenarioId] ?? [];
    const normalized = normalizeSignals(signals);
    const ranked = rankIssues(normalized);
    setIssues(normalized);
    setPriorities(ranked);
    setEnrichments(DEMO_ENRICHED_CONTEXTS[scenarioId] ?? []);
    setPlans(DEMO_RESPONSE_PLANS[scenarioId] ?? []);

    // Generate alerts via server-side API
    const allPlans = DEMO_RESPONSE_PLANS[scenarioId] ?? [];
    const fetchedAlerts: AlertDraft[] = [];
    for (const p of allPlans) {
      const matchedIssue = normalized.find((i) => i.id === p.issueId);
      if (matchedIssue) {
        try {
          const res = await fetch("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ issue: matchedIssue, plan: p }),
          });
          const data = await res.json();
          fetchedAlerts.push({ ...data, issueId: p.issueId });
        } catch {
          // Fallback if API fails
          fetchedAlerts.push({
            issueId: p.issueId,
            residentAlert: `⚠️ ${matchedIssue.title} reported in ${matchedIssue.location}. ${p.residentInstructions}`,
            volunteerMessage: `Volunteers needed: ${p.recommendedTeam}. Report to ${matchedIssue.location}. Resources: ${p.requiredResources.join(", ")}.`,
            operationsHandoff: `${matchedIssue.title} – ${matchedIssue.severity.toUpperCase()}. Action: ${p.immediateAction}. Team: ${p.recommendedTeam}.`,
            statusUpdate: `UPDATE: ${matchedIssue.title} – Response team deployed. ${p.twentyFourHourNote}`,
          });
        }
      }
    }
    setAlerts(fetchedAlerts);
    setLoading(false);
    }
    loadAlerts();
  }, [scenarioId]);

  const targetIssueId = issueId ?? priorities[0]?.issueId;
  const issue = issues.find((i) => i.id === targetIssueId);
  const priority = priorities.find((p) => p.issueId === targetIssueId);
  const enrichment = enrichments.find((e) => e.issueId === targetIssueId);
  const plan = plans.find((p) => p.issueId === targetIssueId);
  const alert = alerts.find((a) => a.issueId === targetIssueId);
  const handoff = plan ? generateHandoffNote(plan, issue?.title ?? "", issue?.location ?? "") : null;

  if (loading) return <Spinner size="lg" label="Generating response plan..." />;

  if (!issue || !plan) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold">No response plan available</h2>
        <p className="mt-2 text-[var(--color-text-2)]">Select a scenario and issue from the demo page.</p>
        <button onClick={() => router.push("/demo")} className="mt-4 text-[var(--color-primary)] underline">
          Go to Demo
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button
        onClick={() => router.push(`/demo?scenario=${scenarioId}`)}
        className="mb-6 flex items-center gap-1 text-sm text-[var(--color-text-2)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Demo
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{issue.severity}</Badge>
          <Badge className="bg-[var(--color-primary)]/20 text-[var(--color-primary)]">Score {priority?.score ?? 0}</Badge>
        </div>
        <h1 className="text-2xl font-bold">{issue.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-2)]">{issue.location} · {issue.populationAffected.toLocaleString()} affected</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
        {[
          { id: "plan" as const, label: "Response Plan", icon: ClipboardList },
          { id: "alerts" as const, label: "Alerts", icon: MessageSquare },
          { id: "handoff" as const, label: "Handoff", icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "text-[var(--color-text-2)] hover:text-[var(--color-text)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Response Plan Tab */}
      {activeTab === "plan" && (
        <div className="space-y-4">
          {/* AI Enrichment */}
          {enrichment && (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase text-[var(--color-muted)]">AI Analysis</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[var(--color-primary)]">Why It Matters</p>
                  <p className="text-sm text-[var(--color-text-2)]">{enrichment.whyItMatters}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-primary)]">Who Is Affected</p>
                  <p className="text-sm text-[var(--color-text-2)]">{enrichment.whoIsAffected}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-primary)]">Likely Next Impact</p>
                  <p className="text-sm text-[var(--color-text-2)]">{enrichment.likelyNextImpact}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-primary)]">Recommendation</p>
                  <p className="text-sm text-[var(--color-text-2)]">{enrichment.recommendation}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Immediate Action */}
          <Card className="border-l-4 border-l-red-500 border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="font-semibold text-red-400">Immediate Action</h3>
            </div>
            <p className="text-sm text-[var(--color-text)]">{plan.immediateAction}</p>
          </Card>

          {/* Team & Resources */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--color-primary)]" />
                <h3 className="text-sm font-semibold">Recommended Team</h3>
              </div>
              <p className="text-sm text-[var(--color-text-2)]">{plan.recommendedTeam}</p>
            </Card>
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[var(--color-accent)]" />
                <h3 className="text-sm font-semibold">Required Resources</h3>
              </div>
              <ul className="space-y-1">
                {plan.requiredResources.map((r, i) => (
                  <li key={i} className="text-sm text-[var(--color-text-2)]">• {r}</li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Time Plans */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <h3 className="text-sm font-semibold">30-Minute Plan</h3>
              </div>
              <p className="text-sm text-[var(--color-text-2)]">{plan.thirtyMinutePlan}</p>
            </Card>
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold">24-Hour Note</h3>
              </div>
              <p className="text-sm text-[var(--color-text-2)]">{plan.twentyFourHourNote}</p>
            </Card>
          </div>

          {/* Resident Instructions */}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold">Resident Instructions</h3>
            <p className="text-sm text-[var(--color-text-2)]">{plan.residentInstructions}</p>
          </Card>

          {/* Escalation */}
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold">Escalation Threshold</h3>
            <p className="text-sm text-[var(--color-text-2)]">{plan.escalationThreshold}</p>
          </Card>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && alert && (
        <div className="space-y-4">
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold text-red-400">Resident Alert</h3>
            <p className="text-sm text-[var(--color-text-2)]">{alert.residentAlert}</p>
          </Card>
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold text-[var(--color-primary)]">Volunteer Message</h3>
            <p className="text-sm text-[var(--color-text-2)]">{alert.volunteerMessage}</p>
          </Card>
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold text-[var(--color-accent)]">Operations Handoff</h3>
            <p className="text-sm text-[var(--color-text-2)]">{alert.operationsHandoff}</p>
          </Card>
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold text-yellow-400">Status Update Template</h3>
            <p className="text-sm text-[var(--color-text-2)]">{alert.statusUpdate}</p>
          </Card>
        </div>
      )}

      {/* Handoff Tab */}
      {activeTab === "handoff" && handoff && (
        <div className="space-y-4">
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold">Summary</h3>
            <p className="text-sm text-[var(--color-text-2)]">{handoff.summary}</p>
          </Card>
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-sm font-semibold">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-1">
              {handoff.nextSteps.map((step, i) => (
                <li key={i} className="text-sm text-[var(--color-text-2)]">{step}</li>
              ))}
            </ol>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="mb-2 text-sm font-semibold">Owner</h3>
              <p className="text-sm text-[var(--color-text-2)]">{handoff.owner}</p>
            </Card>
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="mb-2 text-sm font-semibold">Deadline</h3>
              <p className="text-sm text-[var(--color-text-2)]">{handoff.deadline}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
