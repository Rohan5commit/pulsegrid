"use client";

import {
  Layers,
  Database,
  Brain,
  Radio,
  Shield,
  Zap,
  Activity,
  GitBranch,
  Server,
  Lock,
  Cpu,
  Globe,
} from "lucide-react";

const LAYERS = [
  {
    icon: Radio,
    title: "Signal Ingestion Layer",
    color: "cyan",
    desc: "Multi-channel data ingestion from IoT sensors, weather APIs, traffic cameras, social media, and emergency broadcasts.",
    tech: ["Apache Kafka", "WebSocket", "REST APIs", "MQTT"],
  },
  {
    icon: Brain,
    title: "AI Processing Core",
    color: "purple",
    desc: "Real-time threat detection, severity scoring, and predictive modeling using ensemble ML models.",
    tech: ["TensorFlow", "Python", "Edge Computing", "AutoML"],
  },
  {
    icon: Database,
    title: "Data & State Layer",
    color: "rose",
    desc: "Time-series storage for sensor data, geospatial indexing for impact mapping, and event sourcing for audit trails.",
    tech: ["TimescaleDB", "PostGIS", "Redis", "S3"],
  },
  {
    icon: Shield,
    title: "Response Orchestration",
    color: "green",
    desc: "Automated response plan generation, resource allocation optimization, and multi-channel notification dispatch.",
    tech: ["Celery", "Twilio", "Firebase", "PagerDuty"],
  },
  {
    icon: Lock,
    title: "Security & Access",
    color: "amber",
    desc: "Role-based access control, encrypted communications, and compliance with HIPAA and emergency services standards.",
    tech: ["OAuth 2.0", "mTLS", "AES-256", "RBAC"],
  },
];

const ARCHITECTURE_DIAGRAM = [
  { icon: Globe, label: "External Signals", desc: "IoT · Weather · Traffic · Social" },
  { icon: Server, label: "Ingestion", desc: "Kafka · WebSocket · REST" },
  { icon: Cpu, label: "AI Core", desc: "Detection · Scoring · Prediction" },
  { icon: Database, label: "State Store", desc: "TimescaleDB · PostGIS · Redis" },
  { icon: Shield, label: "Orchestration", desc: "Response Plans · Allocation" },
  { icon: Zap, label: "Notifications", desc: "SMS · Push · Sirens · Liaison" },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", glow: "shadow-cyan-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", glow: "shadow-purple-500/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", glow: "shadow-rose-500/20" },
  green: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 shadow-lg shadow-purple-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">System Architecture</h1>
              <p className="text-sm text-slate-500">Multi-layered AI-powered resilience platform</p>
            </div>
          </div>
        </div>

        {/* Architecture Flow */}
        <div className="mb-12">
          <h2 className="mb-6 text-lg font-bold text-white">Data Flow</h2>
          <div className="glass-strong rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              {ARCHITECTURE_DIAGRAM.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 shadow-lg shadow-cyan-500/10">
                        <Icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="text-xs font-bold text-white">{step.label}</div>
                      <div className="text-[10px] text-slate-500">{step.desc}</div>
                    </div>
                    {i < ARCHITECTURE_DIAGRAM.length - 1 && (
                      <div className="hidden h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent sm:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Layer Details */}
        <div>
          <h2 className="mb-6 text-lg font-bold text-white">System Layers</h2>
          <div className="space-y-4">
            {LAYERS.map((layer, i) => {
              const c = colorMap[layer.color];
              return (
                <div key={layer.title} className="glass-card group p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm ${c.bg}`} />
                        <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} border ${c.border}`}>
                          <layer.icon className={`h-6 w-6 ${c.text}`} />
                        </div>
                      </div>
                      <div className="sm:hidden">
                        <div className="text-xs font-bold text-slate-500">Layer {String(i + 1).padStart(2, "0")}</div>
                        <h3 className="text-lg font-bold text-white">{layer.title}</h3>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 hidden text-xs font-bold text-slate-500 sm:block">
                        Layer {String(i + 1).padStart(2, "0")} — {layer.title}
                      </div>
                      <p className="mb-3 text-sm text-slate-400">{layer.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.tech.map((t) => (
                          <span key={t} className={`badge-neon ${c.bg.replace("/10", "/5")} ${c.text} text-[10px]`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
