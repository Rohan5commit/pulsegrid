"use client";

import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock,
  Shield,
  Activity,
  MapPin,
  Heart,
  Zap,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const IMPACT_METRICS = [
  { label: "Population at Risk", value: "47,200", icon: Users, color: "rose", change: "+12%" },
  { label: "Infrastructure Nodes", value: "342", icon: Activity, color: "cyan", change: "+5" },
  { label: "Active Threats", value: "7", icon: AlertTriangle, color: "amber", change: "-2" },
  { label: "Response Time", value: "8.4s", icon: Clock, color: "green", change: "-3.1s" },
];

const AFFECTED_GROUPS = [
  { name: "Elderly (65+)", count: 8400, risk: "high", icon: Heart, color: "rose" },
  { name: "Medical Dependent", count: 3200, risk: "critical", icon: Shield, color: "rose" },
  { name: "Schools & Daycares", count: 6200, risk: "medium", icon: Users, color: "amber" },
  { name: "Low-Income Housing", count: 11800, risk: "high", icon: MapPin, color: "purple" },
];

const DECISIONS = [
  { action: "Deploy mobile generators to City General", time: "2 min", confidence: 97, status: "executed" },
  { action: "Activate cooling centers B and C", time: "5 min", confidence: 94, status: "executed" },
  { action: "Issue flood warning — Sectors 3, 7", time: "30 sec", confidence: 99, status: "executed" },
  { action: "Reroute school buses via Route 7", time: "1 min", confidence: 91, status: "executed" },
  { action: "Deploy welfare check teams — 142 households", time: "8 min", confidence: 88, status: "pending" },
];

const colorMap: Record<string, string> = {
  rose: "text-rose-400",
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  green: "text-emerald-400",
  purple: "text-purple-400",
};

const bgMap: Record<string, string> = {
  rose: "bg-rose-500/10",
  cyan: "bg-cyan-500/10",
  amber: "bg-amber-500/10",
  green: "bg-emerald-500/10",
  purple: "bg-purple-500/10",
};

const borderMap: Record<string, string> = {
  rose: "border-rose-500/20",
  cyan: "border-cyan-500/20",
  amber: "border-amber-500/20",
  green: "border-emerald-500/20",
  purple: "border-purple-500/20",
};

const riskColors: Record<string, string> = {
  critical: "badge-rose",
  high: "badge-amber",
  medium: "badge-cyan",
  low: "badge-green",
};

export default function SummaryPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 shadow-lg shadow-rose-500/20">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Impact Intelligence</h1>
              <p className="text-sm text-slate-500">Real-time threat assessment and population impact analysis</p>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {IMPACT_METRICS.map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="glass-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className={`inline-flex rounded-xl ${bgMap[color]} border ${borderMap[color]} p-2.5`}>
                  <Icon className={`h-5 w-5 ${colorMap[color]}`} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${colorMap[color]}`}>
                  <ArrowUpRight className="h-3 w-3" /> {change}
                </span>
              </div>
              <div className="mb-1 text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Affected Groups */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-white">Affected Populations</h2>
            <div className="glass-strong rounded-2xl p-5">
              <div className="space-y-4">
                {AFFECTED_GROUPS.map(({ name, count, risk, icon: Icon, color }) => (
                  <div key={name} className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgMap[color]} border ${borderMap[color]}`}>
                      <Icon className={`h-5 w-5 ${colorMap[color]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{name}</span>
                        <span className="text-sm font-bold text-slate-300">{count.toLocaleString()}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            color === "rose" ? "from-rose-500 to-rose-400" :
                            color === "amber" ? "from-amber-500 to-amber-400" :
                            "from-purple-500 to-purple-400"
                          }`}
                          style={{ width: `${Math.min((count / 15000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className={`badge-neon ${riskColors[risk]} text-[10px]`}>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accelerated Decisions */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-white">AI Accelerated Decisions</h2>
            <div className="glass-strong rounded-2xl p-5">
              <div className="space-y-3">
                {DECISIONS.map(({ action, time, confidence, status }, i) => (
                  <div key={i} className={`glass-card p-3 ${status === "executed" ? "border-l-2 border-l-emerald-500" : "border-l-2 border-l-amber-500"}`}>
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <span className="text-sm text-slate-300">{action}</span>
                      <span className={`badge-neon ${status === "executed" ? "badge-green" : "badge-amber"} text-[10px] shrink-0`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {time}</span>
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {confidence}% confidence</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
