"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/loading-states";
import { ALL_SIGNALS, DEMO_ENRICHED_CONTEXTS, DEMO_RESPONSE_PLANS } from "@/lib/schemas/demo-data";
import { normalizeSignals } from "@/lib/normalization";
import { rankIssues } from "@/lib/ranking";
import { generateHandoffNote } from "@/lib/planning";
import type { NormalizedIssue, PriorityScore, EnrichedContext, ResponsePlan, AlertDraft } from "@/lib/schemas";
import { CheckCircle, AlertTriangle, Clock, Users, ArrowLeft, MessageSquare, ClipboardList } from "lucide-react";

export default function ResponsePlanPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-slate-400">Loading...</div>}>
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

      const allPlans = DEMO_RESPONSE_PLANS[scenarioId] ?? [];
      const alertResults = await Promise.all(
        allPlans.map(async (p) => {
          const matchedIssue = normalized.find((i) => i.id === p.issueId);
          if (!matchedIssue) return null;
          try {
            const res = await fetch("/api/alerts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ issue: matchedIssue, plan: p }),
            });
            const data = await res.json();
            return { ...data, issueId: p.issueId } as AlertDraft;
          } catch {
            return {
              issueId: p.issueId,
              residentAlert: `⚠️ ${matchedIssue.title} reported in ${matchedIssue.location}. ${p.residentInstructions}`,
              volunteerMessage: `Volunteers needed: ${p.recommendedTeam}. Report to ${matchedIssue.location}. Resources: ${p.requiredResources.join(", ")}.`,
              operationsHandoff: `${matchedIssue.title} – ${matchedIssue.severity.toUpperCase()}. Action: ${p.immediateAction}. Team: ${p.recommendedTeam}.`,
              statusUpdate: `UPDATE: ${matchedIssue.title} – Response team deployed. ${p.twentyFourHourNote}`,
            } as AlertDraft;
          }
        })
      );
      setAlerts(alertResults.filter(Boolean) as AlertDraft[]);
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
  const handoff = plan ? generateHandoffNote(plan, issue?.title ?? "", issue?.location ?? "", issue?.urgency ?? "soon") : null;

  if (loading) return <Spinner size="lg" label="Generating response plan..." />;

  if (!issue || !plan) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 pt-24 text-center">
        <h2 className="text-xl font-bold text-slate-100">No response plan available</h2>
        <p className="mt-2 text-slate-400">Select a scenario and issue from the demo page.</p>
        <button onClick={() => router.push("/demo")} className="mt-4 text-cyan-400 underline">
          Go to Demo
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pt-20">
      <button
        onClick={() => router.push(`/demo?scenario=${scenarioId}`)}
        className="mb-6 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Demo
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{issue.severity}</Badge>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Score {priority?.score ?? 0}</Badge>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">{issue.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{issue.location} · {issue.populationAffected.toLocaleString()} affected</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
        {[
          { id: "plan" as const, label: "Response Plan", icon: ClipboardList },
          { id: "alerts" as const, label: "Alerts", icon: MessageSquare },
          { id: "handoff" as const, label: "Handoff", icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
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
          {enrichment && (
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase text-slate-500">AI Analysis</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-cyan-400">Why It Matters</p>
                  <p className="text-sm text-slate-400">{enrichment.whyItMatters}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-cyan-400">Who Is Affected</p>
                  <p className="text-sm text-slate-400">{enrichment.whoIsAffected}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-cyan-400">Likely Next Impact</p>
                  <p className="text-sm text-slate-400">{enrichment.likelyNextImpact}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-cyan-400">Recommendation</p>
                  <p className="text-sm text-slate-400">{enrichment.recommendation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border-l-4 border-l-red-500 border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="font-semibold text-red-400">Immediate Action</h3>
            </div>
            <p className="text-sm text-slate-200">{plan.immediateAction}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Recommended Team</h3>
              </div>
              <p className="text-sm text-slate-400">{plan.recommendedTeam}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">Required Resources</h3>
              </div>
              <ul className="space-y-1">
                {plan.requiredResources.map((r, i) => (
                  <li key={i} className="text-sm text-slate-400">• {r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-slate-100">30-Minute Plan</h3>
              </div>
              <p className="text-sm text-slate-400">{plan.thirtyMinutePlan}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-slate-100">24-Hour Note</h3>
              </div>
              <p className="text-sm text-slate-400">{plan.twentyFourHourNote}</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Resident Instructions</h3>
            <p className="text-sm text-slate-400">{plan.residentInstructions}</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Escalation Threshold</h3>
            <p className="text-sm text-slate-400">{plan.escalationThreshold}</p>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && alert && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-red-400">Resident Alert</h3>
            <p className="text-sm text-slate-400">{alert.residentAlert}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-cyan-400">Volunteer Message</h3>
            <p className="text-sm text-slate-400">{alert.volunteerMessage}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-emerald-400">Operations Handoff</h3>
            <p className="text-sm text-slate-400">{alert.operationsHandoff}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-yellow-400">Status Update Template</h3>
            <p className="text-sm text-slate-400">{alert.statusUpdate}</p>
          </div>
        </div>
      )}

      {/* Handoff Tab */}
      {activeTab === "handoff" && handoff && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Summary</h3>
            <p className="text-sm text-slate-400">{handoff.summary}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-1">
              {handoff.nextSteps.map((step, i) => (
                <li key={i} className="text-sm text-slate-400">{step}</li>
              ))}
            </ol>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-100">Owner</h3>
              <p className="text-sm text-slate-400">{handoff.owner}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-100">Deadline</h3>
              <p className="text-sm text-slate-400">{handoff.deadline}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
