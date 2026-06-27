"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Brain, Shield, Radio, Users, Zap, Database, Cpu } from "lucide-react";

const MODULES = [
  { icon: Radio, name: "Signal Intake", desc: "Ingests data from weather feeds, service monitors, community reports, and complaint logs.", tech: "TypeScript, Zod validation" },
  { icon: Layers, name: "Normalization Layer", desc: "Transforms raw signals into a common incident structure with standardized fields.", tech: "Deterministic mapping, schema validation" },
  { icon: Shield, name: "Priority Engine", desc: "Ranks incidents using 8 weighted factors: urgency, severity, population, cascading risk, time sensitivity, criticality, confidence, resource availability.", tech: "Deterministic scoring, explainable ranking" },
  { icon: Brain, name: "AI Enrichment", desc: "Generates context, explanations, and recommendations using NVIDIA NIM (Llama 3.3 70B).", tech: "NVIDIA NIM API, structured JSON outputs" },
  { icon: Users, name: "Response Planner", desc: "Generates actionable plans with immediate actions, teams, resources, timelines, and escalation thresholds.", tech: "AI-generated, schema-validated" },
  { icon: Zap, name: "Alert Generator", desc: "Creates resident alerts, volunteer messages, ops handoffs, and status update templates.", tech: "AI-generated, editable output" },
  { icon: Database, name: "State Management", desc: "Client-side state with React hooks. Demo data pre-seeded for instant access.", tech: "React state, URL params" },
  { icon: Cpu, name: "Ask PulseGrid", desc: "Grounded Q&A assistant that answers only from app state, issue data, and generated plans.", tech: "NVIDIA NIM, context-grounded prompts" },
];

const PRINCIPLES = [
  { title: "Future-City Theme", desc: "PulseGrid embodies the idea that smart cities must help people respond quickly to real local problems. It's not about flashy dashboards—it's about faster, better decisions when communities need them most." },
  { title: "AI + Deterministic Hybrid", desc: "Critical severity rules and ranking constraints remain deterministic. AI handles context enrichment, explanation, and recommendation generation. This ensures malformed AI outputs cannot corrupt the ranked issue list." },
  { title: "Explainable Prioritization", desc: "Every priority score is broken down into 8 weighted factors. Users can see exactly why one issue ranks above another, making the system transparent and trustworthy." },
  { title: "Community-First UX", desc: "The app is designed for residents, student leaders, and community volunteers—not engineers. Clear language, actionable outputs, and accessible design are core priorities." },
  { title: "Demo-Ready", desc: "Three scenario presets demonstrate real-world use cases. No setup friction. One click to see the full workflow from detection to response planning." },
  { title: "Real-World Applicability", desc: "PulseGrid addresses a genuine gap: communities lose time when signals are fragmented and prioritization under pressure is hard. This tool turns scattered issues into action-first plans." },
];

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Architecture</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          How PulseGrid is built and why it works.
        </p>
      </div>

      {/* Problem Statement */}
      <Card className="mb-8 border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-100">The Problem</h2>
        <p className="text-slate-400 leading-relaxed">
          Future cities are only &quot;smart&quot; if they help people respond quickly to real local problems.
          Today, communities lose critical time when signals are fragmented across weather feeds, service
          monitors, complaint logs, and social media. Prioritization under pressure is hard. Emergency
          coordinators waste 30-60 minutes manually assessing which issue to tackle first—time that
          could mean the difference between a contained incident and a cascading crisis.
        </p>
      </Card>

      {/* Solution */}
      <Card className="mb-8 border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-100">The Solution</h2>
        <p className="text-slate-400 leading-relaxed">
          PulseGrid turns scattered urban disruption signals into prioritized, actionable response plans.
          It combines deterministic severity scoring with AI-powered context enrichment to help communities
          understand what matters most and what to do next. The result: faster decisions, better outcomes,
          and more resilient neighborhoods.
        </p>
      </Card>

      {/* System Modules */}
      <h2 className="mb-4 text-xl font-bold text-slate-100">System Modules</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {MODULES.map((mod) => (
          <Card key={mod.name} className="border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <mod.icon className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold text-slate-100">{mod.name}</h3>
            </div>
            <p className="mb-2 text-sm text-slate-400">{mod.desc}</p>
            <Badge className="bg-white/5 text-slate-500 border-white/10">{mod.tech}</Badge>
          </Card>
        ))}
      </div>

      {/* How Prioritization Works */}
      <Card className="mb-8 border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-100">How Prioritization Works</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">
          PulseGrid scores each incident using 8 weighted factors, each contributing to a final priority
          score out of 100:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { name: "Urgency", weight: "18%", desc: "How quickly action is needed" },
            { name: "Severity", weight: "15%", desc: "How serious the issue is" },
            { name: "Cascading Risk", weight: "15%", desc: "How likely it triggers other problems" },
            { name: "Population Affected", weight: "12%", desc: "Number of people impacted" },
            { name: "Time Sensitivity", weight: "12%", desc: "Deadline pressure" },
            { name: "Service Criticality", weight: "10%", desc: "Importance of affected service" },
            { name: "Resource Availability", weight: "10%", desc: "How constrained resources are" },
            { name: "Confidence", weight: "8%", desc: "Data quality and completeness" },
          ].map((f) => (
            <div key={f.name} className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">{f.name}</span>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{f.weight}</Badge>
              </div>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Where AI Is Used */}
      <Card className="mb-8 border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-100">Where AI Is Used</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400">AI-Powered (NVIDIA NIM)</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>• Issue understanding and context enrichment</li>
              <li>• Explanation generation (why it matters, who is affected)</li>
              <li>• Response plan generation (actions, teams, resources)</li>
              <li>• Alert and communication drafting</li>
              <li>• Grounded Q&A (Ask PulseGrid)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-cyan-400">Deterministic (Rules-Based)</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>• Severity classification based on incident category</li>
              <li>• Urgency assignment based on category and conditions</li>
              <li>• Priority scoring with weighted factors</li>
              <li>• Schema validation of all AI outputs</li>
              <li>• Fallback logic when AI is unavailable</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Design Principles */}
      <h2 className="mb-4 text-xl font-bold text-slate-100">Design Principles</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.title} className="border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm">
            <h3 className="mb-2 font-semibold text-slate-100">{p.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
          </Card>
        ))}
      </div>

      {/* Tech Stack */}
      <Card className="mt-8 border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-100">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {["Next.js 15", "React", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Zod", "NVIDIA NIM", "Llama 3.3 70B", "Lucide Icons"].map((t) => (
            <Badge key={t} className="bg-white/5 text-slate-400 border-white/10">{t}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
