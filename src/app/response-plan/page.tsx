"use client";

import {
  FileText,
  AlertTriangle,
  Clock,
  Users,
  Shield,
  Radio,
  Phone,
  CheckCircle2,
  Copy,
  Send,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const IMMEDIATE_ACTIONS = [
  { action: "Deploy mobile generators to City General Hospital", time: "0-5 min", priority: "critical" },
  { action: "Close Main Street underpass and redirect traffic", time: "0-2 min", priority: "critical" },
  { action: "Issue flood warning — Sectors 3 and 7", time: "0-1 min", priority: "critical" },
  { action: "Activate cooling centers B and C", time: "5-10 min", priority: "high" },
  { action: "Deploy welfare check teams to 142 households", time: "10-20 min", priority: "high" },
  { action: "Reroute school buses via elevated Route 7", time: "5-15 min", priority: "medium" },
];

const RESOURCES = [
  { type: "Mobile Generators", count: 6, deployed: 4, color: "cyan" },
  { type: "Traffic Officers", count: 24, deployed: 18, color: "purple" },
  { type: "Emergency Vehicles", count: 8, deployed: 6, color: "rose" },
  { type: "Medical Teams", count: 12, deployed: 8, color: "green" },
  { type: "Sandbag Pallets", count: 200, deployed: 150, color: "amber" },
  { type: "Water Distribution Units", count: 15000, deployed: 12000, color: "cyan" },
];

const ALERT_TEMPLATES = [
  {
    channel: "Emergency Broadcast",
    icon: Radio,
    message: "URGENT: Infrastructure failure detected in your area. Follow emergency instructions from local authorities. PulseGrid monitoring active.",
  },
  {
    channel: "SMS Alert",
    icon: Phone,
    message: "ALERT: Power outage + water main break affecting your area. Move to nearest cooling center. Check pulsegrid.gov/status for updates.",
  },
  {
    channel: "Resident Notification",
    icon: Send,
    message: "Community Response Update: Emergency services deployed. Water distribution at Oak Park Elementary starting in 30 minutes.",
  },
];

const priorityColors: Record<string, string> = {
  critical: "badge-rose",
  high: "badge-amber",
  medium: "badge-cyan",
  low: "badge-green",
};

export default function ResponsePlanPage() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 shadow-lg shadow-amber-500/20">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Response Plan</h1>
              <p className="text-sm text-slate-500">AI-generated emergency response with prioritized actions</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Immediate Actions */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-white">Immediate Actions</h2>
            <div className="space-y-3">
              {IMMEDIATE_ACTIONS.map(({ action, time, priority }, i) => (
                <div key={i} className="glass-card flex items-center gap-4 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-slate-200">{action}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" /> {time}
                  </span>
                  <span className={`badge-neon ${priorityColors[priority]} text-[10px]`}>{priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Allocation */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-white">Resource Allocation</h2>
            <div className="glass-strong rounded-2xl p-5">
              <div className="space-y-4">
                {RESOURCES.map(({ type, count, deployed, color }) => (
                  <div key={type}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">{type}</span>
                      <span className="text-xs text-slate-500">{deployed}/{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          color === "cyan" ? "from-cyan-500 to-cyan-400" :
                          color === "purple" ? "from-purple-500 to-purple-400" :
                          color === "rose" ? "from-rose-500 to-rose-400" :
                          color === "green" ? "from-emerald-500 to-emerald-400" :
                          "from-amber-500 to-amber-400"
                        }`}
                        style={{ width: `${(deployed / count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Templates */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-white">Generated Alert Templates</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {ALERT_TEMPLATES.map(({ channel, icon: Icon, message }, i) => (
              <div key={channel} className="glass-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">{channel}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(message, i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {copiedIdx === i ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-slate-400">{message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
