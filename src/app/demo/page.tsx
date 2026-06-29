"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Zap,
  Flame,
  Droplets,
  Loader2,
  MapPin,
  Clock,
  Shield,
  ShieldCheck,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Send,
  Users,
  Target,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { normalizeSignals } from "@/lib/normalization";
import { rankIssues } from "@/lib/ranking";
import {
  SCENARIO_PRESETS,
  ALL_SIGNALS,
  DEMO_ENRICHED_CONTEXTS,
  DEMO_RESPONSE_PLANS,
} from "@/lib/schemas/demo-data";
import type {
  NormalizedIssue,
  PriorityScore,
  EnrichedContext,
  ResponsePlan,
  AlertDraft,
} from "@/lib/schemas";

/* ──────────── Types ──────────── */

type PipelineState = "select" | "running" | "issues" | "detail";
type PipelineStep = "ingest" | "normalize" | "rank" | "ready";

interface RankedIssue extends NormalizedIssue {
  rank: number;
  score: number;
  breakdown?: PriorityScore["breakdown"];
}

interface ChatMsg {
  role: "user" | "ai";
  content: string;
}

/* ──────────── Config ──────────── */

const SCENARIO_ICONS: Record<string, typeof Flame> = {
  "heatwave-water": Flame,
  "flood-traffic": Droplets,
  "blackout-medical": Zap,
};

const SCENARIO_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  "heatwave-water": {
    bg: "bg-red-500/10",
    text: "text-red-400",
    badge: "bg-red-500/15 text-red-400 border-red-500/20",
  },
  "flood-traffic": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  },
  "blackout-medical": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    badge: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  },
};

const SEVERITY_STYLE: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/20",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  low: "bg-green-500/15 text-green-400 border-green-500/20",
};

const PIPELINE_STEPS: { key: PipelineStep; label: string }[] = [
  { key: "ingest", label: "Ingesting signals" },
  { key: "normalize", label: "Normalizing data" },
  { key: "rank", label: "Scoring priority" },
  { key: "ready", label: "Ranking complete" },
];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ──────────── Page ──────────── */

export default function DemoPage() {
  const [state, setState] = useState<PipelineState>("select");
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("ingest");
  const [issues, setIssues] = useState<RankedIssue[]>([]);
  const [selected, setSelected] = useState<RankedIssue | null>(null);
  const [enrichment, setEnrichment] = useState<EnrichedContext | null>(null);
  const [plan, setPlan] = useState<ResponsePlan | null>(null);
  const [alerts, setAlerts] = useState<AlertDraft[]>([]);
  const [loading, setLoading] = useState<"enrich" | "plan" | null>(null);
  const [aiSource, setAiSource] = useState<"ai" | "fallback">("ai");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(true);
  const [expandedAlerts, setExpandedAlerts] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* ── Run Pipeline ── */

  const runPipeline = async (id: string) => {
    setScenarioId(id);
    setState("running");
    setPipelineStep("ingest");

    try {
      const signals = ALL_SIGNALS[id] || [];
      await delay(500);
      setPipelineStep("normalize");

      const normalized = normalizeSignals(signals);
      await delay(600);
      setPipelineStep("rank");

      const scores = rankIssues(normalized);
      await delay(500);
      setPipelineStep("ready");
      await delay(300);

      // rankIssues already sorts descending and assigns ranks
      const ranked: RankedIssue[] = scores.map((s) => {
        const issue = normalized.find((n) => n.id === s.issueId)!;
        return { ...issue, rank: s.rank, score: s.score, breakdown: s.breakdown };
      });

      setIssues(ranked);
      setState("issues");
    } catch {
      setState("select");
      setScenarioId(null);
    }
  };

  /* ── Select Issue ── */

  const selectIssue = async (issue: RankedIssue) => {
    setSelected(issue);
    setEnrichment(null);
    setPlan(null);
    setAlerts([]);
    setState("detail");
    setLoading("enrich");

    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue }),
      });
      const data = await res.json();
      setAiSource(data.source);

      const ctx: EnrichedContext | null =
        data.context ??
        (scenarioId
          ? (DEMO_ENRICHED_CONTEXTS[scenarioId]?.find(
              (e) => e.issueId === issue.id
            ) as EnrichedContext | null) ??
            null
          : null);
      setEnrichment(ctx);

      setLoading("plan");
      if (ctx) {
        const planRes = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ issue, context: ctx }),
        });
        const planData = await planRes.json();
        setPlan(planData.plan);
        setAlerts(planData.alerts);

        if (!planData.plan && scenarioId) {
          const fallbackPlan = DEMO_RESPONSE_PLANS[scenarioId]?.find(
            (p) => p.issueId === issue.id
          );
          if (fallbackPlan) {
            setPlan(fallbackPlan);
            setAiSource("fallback");
          }
        }
      }
    } catch {
      if (scenarioId) {
        const fbCtx = DEMO_ENRICHED_CONTEXTS[scenarioId]?.find(
          (e) => e.issueId === issue.id
        );
        if (fbCtx) {
          setEnrichment(fbCtx as EnrichedContext);
          setAiSource("fallback");
        }
        const fbPlan = DEMO_RESPONSE_PLANS[scenarioId]?.find(
          (p) => p.issueId === issue.id
        );
        if (fbPlan) setPlan(fbPlan);
      }
    } finally {
      setLoading(null);
    }
  };

  /* ── Chat ── */

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChat((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: msg,
          issues,
          priorities: issues.map((i) => ({
            issueId: i.id,
            score: i.score,
            rank: i.rank,
          })),
          plans: plan ? [plan] : [],
        }),
      });
      const data = await res.json();
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.answer || "I could not process that question.",
        },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Connection error. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  /* ── Reset ── */

  const goBack = () => {
    setLoading(null);
    setChatLoading(false);
    if (state === "detail") {
      setSelected(null);
      setEnrichment(null);
      setPlan(null);
      setAlerts([]);
      setChat([]);
      setState("issues");
    } else {
      setState("select");
      setScenarioId(null);
      setIssues([]);
    }
  };

  const scenarioMeta = scenarioId
    ? SCENARIO_PRESETS.find((s) => s.id === scenarioId)
    : null;
  const colors = scenarioId ? SCENARIO_COLORS[scenarioId] : null;

  /* ──────────── Render ──────────── */

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Back nav */}
      {state !== "select" && (
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {state === "detail"
            ? "Back to issues"
            : state === "running"
              ? "Cancel"
              : "Back to scenarios"}
        </button>
      )}

      {/* ═══════ SCENARIO PICKER ═══════ */}
      {state === "select" && (
        <div className="animate-fade-in-up">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-zinc-50">PulseGrid Demo</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Choose a crisis scenario to run the AI response pipeline.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {SCENARIO_PRESETS.map((s) => {
              const Icon = SCENARIO_ICONS[s.id] ?? Zap;
              const c = SCENARIO_COLORS[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => runPipeline(s.id)}
                  className="group rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-6 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${c.text}`} />
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}
                    >
                      {(ALL_SIGNALS[s.id] ?? []).length} signals
                    </span>
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-zinc-100 group-hover:text-white">
                    {s.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    {s.description}
                  </p>
                  <div className="mt-4 text-xs font-medium text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Run pipeline →
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ PIPELINE RUNNING ═══════ */}
      {state === "running" && scenarioMeta && (
        <div className="animate-fade-in-up mx-auto max-w-lg py-20">
          <div className="mb-8 text-center">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-sky-400" />
            <h2 className="text-lg font-semibold text-zinc-100">
              Running Pipeline
            </h2>
            <p className="text-sm text-zinc-500">{scenarioMeta.name}</p>
          </div>

          <div className="space-y-1">
            {PIPELINE_STEPS.map((step, i) => {
              const stepIdx = PIPELINE_STEPS.findIndex(
                (s) => s.key === pipelineStep
              );
              const status: "done" | "active" | "pending" =
                i < stepIdx
                  ? "done"
                  : i === stepIdx
                    ? "active"
                    : "pending";

              return (
                <div
                  key={step.key}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5"
                  style={{ opacity: status === "pending" ? 0.3 : 1 }}
                >
                  {status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : status === "active" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-zinc-600" />
                  )}
                  <span
                    className={`text-sm ${
                      status === "active"
                        ? "font-medium text-zinc-200"
                        : status === "done"
                          ? "text-zinc-400"
                          : "text-zinc-600"
                    }`}
                  >
                    {step.label}
                  </span>
                  {status === "done" && (
                    <span className="ml-auto text-[11px] text-zinc-600">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ ISSUE LIST ═══════ */}
      {state === "issues" && (
        <div className="animate-fade-in-up">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-100">
                {scenarioMeta?.name}
              </h2>
              <p className="text-xs text-zinc-500">
                {issues.length} issues ranked by composite priority score
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                colors?.badge ?? ""
              }`}
            >
              {issues.length} issues
            </span>
          </div>

          <div className="space-y-2">
            {issues.map((issue, i) => (
              <button
                key={issue.id}
                onClick={() => selectIssue(issue)}
                className="animate-fade-in-up w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[11px] font-bold text-zinc-400">
                      #{issue.rank}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-100">
                      {issue.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        SEVERITY_STYLE[issue.severity] ?? ""
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                </div>
                <p className="mb-2.5 ml-[34px] text-xs text-zinc-500 line-clamp-2">
                  {issue.description}
                </p>
                <div className="ml-[34px] flex items-center gap-4 text-[11px] text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Score {issue.score}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {issue.populationAffected.toLocaleString()} affected
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {issue.urgency}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ ISSUE DETAIL ═══════ */}
      {state === "detail" && selected && (
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-[11px] font-bold text-zinc-400">
                    #{selected.rank}
                  </span>
                  <h2 className="text-lg font-bold text-zinc-50">
                    {selected.title}
                  </h2>
                </div>
                <p className="text-sm text-zinc-500">{selected.description}</p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                  SEVERITY_STYLE[selected.severity] ?? ""
                }`}
              >
                {selected.severity}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Details */}
            <div className="space-y-4 lg:col-span-2">
              {/* Metadata */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Details
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Target, label: "Priority Score", value: `${selected.score}/100` },
                    { icon: Shield, label: "Category", value: selected.category },
                    { icon: Clock, label: "Urgency", value: selected.urgency },
                    {
                      icon: Users,
                      label: "Population Affected",
                      value: selected.populationAffected.toLocaleString(),
                    },
                    { icon: MapPin, label: "Location", value: selected.location },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Icon className="h-3 w-3" />
                        {label}
                      </div>
                      <span className="text-xs font-medium capitalize text-zinc-300">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Score Breakdown
                </h3>
                <div className="space-y-2">
                  {(selected.breakdown
                    ? [
                        { label: "Urgency", value: selected.breakdown.urgencyScore, max: 10 },
                        { label: "Severity", value: selected.breakdown.severityScore, max: 10 },
                        { label: "Cascading Risk", value: selected.breakdown.cascadingScore, max: 10 },
                        { label: "Population", value: selected.breakdown.populationScore, max: 10 },
                        { label: "Time Sensitivity", value: selected.breakdown.timeScore, max: 10 },
                        { label: "Service Criticality", value: selected.breakdown.criticalityScore, max: 10 },
                        { label: "Resource Availability", value: selected.breakdown.resourceScore, max: 10 },
                        { label: "Confidence", value: selected.breakdown.confidenceScore, max: 10 },
                      ]
                    : [
                        { label: "Urgency", value: 0, max: 10 },
                        { label: "Severity", value: 0, max: 10 },
                      ]
                  ).map(({ label, value, max }) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">{label}</span>
                        <span className="text-zinc-600">{value.toFixed(1)}/{max}</span>
                      </div>
                      <div className="h-1 rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-sky-500/60"
                          style={{ width: `${(value / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Content */}
            <div className="space-y-4 lg:col-span-3">
              {/* AI Source Badge */}
              {aiSource === "fallback" && (
                <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  AI unavailable — showing cached analysis
                </div>
              )}

              {/* Enrichment */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-sky-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    AI Enrichment
                  </h3>
                  {loading === "enrich" && (
                    <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-sky-400" />
                  )}
                </div>
                {loading === "enrich" ? (
                  <div className="space-y-2">
                    <div className="h-3 w-full animate-shimmer rounded" />
                    <div className="h-3 w-4/5 animate-shimmer rounded" />
                    <div className="h-3 w-3/5 animate-shimmer rounded" />
                  </div>
                ) : enrichment ? (
                  <div className="space-y-3">
                    <div>
                      <p className="mb-0.5 text-[11px] font-semibold text-zinc-400">
                        Why it matters
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300">
                        {enrichment.whyItMatters}
                      </p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-[11px] font-semibold text-zinc-400">
                        Who is affected
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300">
                        {enrichment.whoIsAffected}
                      </p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-[11px] font-semibold text-zinc-400">
                        Likely next impact
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300">
                        {enrichment.likelyNextImpact}
                      </p>
                    </div>
                    <div className="rounded-lg border-l-2 border-l-sky-500 bg-sky-500/5 p-3">
                      <p className="mb-0.5 text-[11px] font-semibold text-sky-400">
                        Recommendation
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300">
                        {enrichment.recommendation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600">
                    Select an issue to see AI enrichment.
                  </p>
                )}
              </div>

              {/* Response Plan */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50">
                <button
                  onClick={() => setExpandedPlan(!expandedPlan)}
                  className="flex w-full items-center justify-between p-4"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Response Plan
                    </h3>
                    {loading === "plan" && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    )}
                  </div>
                  {expandedPlan ? (
                    <ChevronUp className="h-4 w-4 text-zinc-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-600" />
                  )}
                </button>
                {expandedPlan && (
                  <div className="border-t border-zinc-800/60 px-4 pb-4">
                    {loading === "plan" ? (
                      <div className="space-y-2 pt-3">
                        <div className="h-3 w-full animate-shimmer rounded" />
                        <div className="h-3 w-4/5 animate-shimmer rounded" />
                      </div>
                    ) : plan ? (
                      <div className="space-y-3 pt-3">
                        <div>
                          <p className="mb-0.5 text-[11px] font-semibold text-zinc-400">
                            Immediate Action
                          </p>
                          <p className="text-xs leading-relaxed text-zinc-300">
                            {plan.immediateAction}
                          </p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-[11px] font-semibold text-zinc-400">
                            Recommended Team
                          </p>
                          <p className="text-xs text-zinc-300">
                            {plan.recommendedTeam}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-[11px] font-semibold text-zinc-400">
                            Required Resources
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.requiredResources.map((r) => (
                              <span
                                key={r}
                                className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-0.5 text-[11px] font-semibold text-zinc-400">
                            Resident Instructions
                          </p>
                          <p className="text-xs leading-relaxed text-zinc-300">
                            {plan.residentInstructions}
                          </p>
                        </div>
                        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                          <p className="mb-0.5 text-[11px] font-semibold text-orange-400">
                            Escalation Threshold
                          </p>
                          <p className="text-xs leading-relaxed text-zinc-300">
                            {plan.escalationThreshold}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="pt-3 text-xs text-zinc-600">
                        Waiting for AI enrichment...
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Alert Drafts */}
              {alerts.length > 0 && (
                <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50">
                  <button
                    onClick={() => setExpandedAlerts(!expandedAlerts)}
                    className="flex w-full items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-400" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Alert Drafts ({alerts.length})
                      </h3>
                    </div>
                    {expandedAlerts ? (
                      <ChevronUp className="h-4 w-4 text-zinc-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-600" />
                    )}
                  </button>
                  {expandedAlerts && (
                    <div className="border-t border-zinc-800/60 px-4 pb-4">
                      <div className="space-y-2 pt-3">
                        {alerts.map((a, i) => (
                          <div key={i} className="space-y-2 rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-3">
                            {a.residentAlert && (
                              <div>
                                <p className="mb-0.5 text-[11px] font-semibold text-amber-400">Resident Alert</p>
                                <p className="text-xs leading-relaxed text-zinc-300">{a.residentAlert}</p>
                              </div>
                            )}
                            {a.volunteerMessage && (
                              <div>
                                <p className="mb-0.5 text-[11px] font-semibold text-emerald-400">Volunteer Message</p>
                                <p className="text-xs leading-relaxed text-zinc-300">{a.volunteerMessage}</p>
                              </div>
                            )}
                            {a.operationsHandoff && (
                              <div>
                                <p className="mb-0.5 text-[11px] font-semibold text-sky-400">Operations Handoff</p>
                                <p className="text-xs leading-relaxed text-zinc-300">{a.operationsHandoff}</p>
                              </div>
                            )}
                            {a.statusUpdate && (
                              <div>
                                <p className="mb-0.5 text-[11px] font-semibold text-zinc-400">Status Update</p>
                                <p className="text-xs leading-relaxed text-zinc-300">{a.statusUpdate}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-sky-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Ask PulseGrid
                  </h3>
                </div>
                <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
                  {chat.length === 0 && (
                    <p className="text-xs text-zinc-600">
                      Ask about this scenario, priorities, or resources...
                    </p>
                  )}
                  {chat.map((msg, i) => (
                    <div
                      key={i}
                      className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "ml-8 bg-sky-500/10 text-zinc-300"
                          : "mr-8 bg-zinc-800/60 text-zinc-300"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="mr-8 rounded-lg bg-zinc-800/60 px-3 py-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Ask a question..."
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-sky-500/40"
                  />
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || chatLoading}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white transition-colors hover:bg-sky-400 disabled:opacity-30"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-800/60 pt-6 pb-8 text-center">
        <p className="text-xs text-zinc-600">
          PulseGrid &middot; Gen AI Academy APAC Edition Cohort 2
        </p>
      </footer>
    </div>
  );
}
