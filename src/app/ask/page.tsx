"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/loading-states";
import { ALL_SIGNALS, DEMO_RESPONSE_PLANS } from "@/lib/schemas/demo-data";
import { normalizeSignals } from "@/lib/normalization";
import { rankIssues } from "@/lib/ranking";
import type { NormalizedIssue, PriorityScore, ResponsePlan } from "@/lib/schemas";
import { Send, Bot, User } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Why is the water outage ranked above the traffic issue?",
  "What should we do in the next 30 minutes?",
  "How do we notify residents?",
  "What happens if we delay action on the top issue?",
  "Which issue affects the most people?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function AskPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-slate-400">Loading...</div>}>
      <AskPageInner />
    </Suspense>
  );
}

function AskPageInner() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenario") ?? "heatwave-water";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<NormalizedIssue[]>([]);
  const [priorities, setPriorities] = useState<PriorityScore[]>([]);
  const [plans, setPlans] = useState<ResponsePlan[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const signals = ALL_SIGNALS[scenarioId] ?? [];
    const normalized = normalizeSignals(signals);
    const ranked = rankIssues(normalized);
    setIssues(normalized);
    setPriorities(ranked);
    setPlans(DEMO_RESPONSE_PLANS[scenarioId] ?? []);
  }, [scenarioId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (question: string) => {
    if (!question.trim() || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, issues, priorities, plans }),
      });
      const result = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer ?? "I couldn't process that question.", sources: result.sources ?? [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn't process that question. Please try again." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Ask PulseGrid</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Ask questions about current incidents, priorities, and response plans.
        </p>
      </div>

      {/* Scenario Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 backdrop-blur-sm">
          Scenario: {scenarioId.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" + ")}
        </span>
      </div>

      {/* Chat Area */}
      <div className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-sm">
        <div ref={scrollRef} className="h-[50vh] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Bot className="mb-4 h-12 w-12 text-cyan-500/30" />
              <h3 className="mb-2 text-lg font-semibold text-slate-300">Ask anything about the current situation</h3>
              <p className="mb-6 max-w-md text-sm text-slate-500">
                PulseGrid answers from incident data, priority rankings, and generated response plans only.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAsk(q)}
                    disabled={loading}
                    className={`rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition-all duration-200 hover:border-cyan-500/30 hover:text-slate-200 hover:bg-white/10 ${loading ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                  <Bot className="h-4 w-4 text-cyan-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    : "bg-white/[0.05] text-slate-200 border border-white/5"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {msg.sources.map((s) => (
                      <span key={s} className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] text-cyan-400">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                <Bot className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="rounded-xl bg-white/[0.05] px-4 py-3 border border-white/5">
                <Spinner size="sm" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/5 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about priorities, actions, notifications..."
              className="border-white/10 bg-white/5 text-slate-200 placeholder:text-slate-500 focus-visible:border-cyan-500/50 focus-visible:ring-cyan-500/20"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
