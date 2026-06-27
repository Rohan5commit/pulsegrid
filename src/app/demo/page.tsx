"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Shield,
  Clock,
  Zap,
  ChevronRight,
  ArrowLeft,
  FileText,
  Users,
  MapPin,
  TrendingUp,
  Brain,
  Loader2,
  Radio,
  Droplets,
  Flame,
  Heart,
} from "lucide-react";

/* ===== MOCK DATA ===== */

type Scenario = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  badge: string;
  issues: Issue[];
};

type Issue = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  urgency: "immediate" | "short-term" | "planned";
  category: string;
  priority: number;
  affected: string;
  desc: string;
  aiAnalysis: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "heatwave",
    title: "Heatwave + Water Outage",
    description: "Extreme heat event combined with water main break affecting 12,000 residents",
    icon: Flame,
    color: "rose",
    badge: "CRITICAL",
    issues: [
      { id: "1", title: "Water Main Break — Sector 7", severity: "critical", urgency: "immediate", category: "Water", priority: 98, affected: "3,200 residents", desc: "6-inch water main rupture at intersection of Oak and 5th, flooding adjacent streets.", aiAnalysis: "AI recommends immediate shutoff at valves V-7A and V-7B. Estimated repair: 8 hours. Emergency water distribution should be deployed to Oak Park Elementary within 30 minutes." },
      { id: "2", title: "Power Grid Overload — Blocks 12-15", severity: "critical", urgency: "immediate", category: "Power", priority: 95, affected: "4,100 residents", desc: "AC demand surge causing transformer overload. Rolling blackouts imminent.", aiAnalysis: "Transformer T-12 is operating at 147% capacity. Preemptive load shedding recommended for non-essential circuits. Hospital district must remain on dedicated grid." },
      { id: "3", title: "Cooling Center Capacity Warning", severity: "high", urgency: "short-term", category: "Medical", priority: 87, affected: "1,800 seniors", desc: "Three primary cooling centers at 85%+ capacity. Elderly residents in unconditioned buildings at risk.", aiAnalysis: "Recommend activating secondary cooling center at Community Center B. Deploy mobile cooling units to high-rise senior housing on Elm Street. ETA for additional capacity: 45 minutes." },
      { id: "4", title: "Traffic Signal Failure — Highway 9", severity: "high", urgency: "short-term", category: "Traffic", priority: 78, affected: "6,500 commuters", desc: "Signal controllers offline at 4 intersections along Highway 9 corridor.", aiAnalysis: "Root cause: upstream power fluctuation. Manual traffic control recommended at intersections H9-1 through H9-4. Deploy signal repair team ETA 25 minutes." },
    ],
  },
  {
    id: "flood",
    title: "Flash Flood + Traffic Gridlock",
    description: "Sudden flooding blocking major arteries and trapping commuters",
    icon: Droplets,
    color: "cyan",
    badge: "HIGH",
    issues: [
      { id: "1", title: "Main Street Underpass Submerged", severity: "critical", urgency: "immediate", category: "Traffic", priority: 96, affected: "8,000 commuters", desc: "3 feet of standing water in Main Street underpass. Multiple vehicles stranded.", aiAnalysis: "Close underpass immediately. Redirect traffic via Route 7 bypass. Deploy water extraction pump team. Estimated clearance: 4 hours. Check stranded vehicles for occupants." },
      { id: "2", title: "Storm Drain Overflow — Riverside", severity: "critical", urgency: "immediate", category: "Water", priority: 93, affected: "2,400 residents", desc: "Storm drains at capacity, backing up into residential basements.", aiAnalysis: "Activate emergency pumping stations PS-3 and PS-4. Issue basement evacuation advisory for Riverside Drive properties. Coordinate with fire department for welfare checks." },
      { id: "3", title: "School Bus Routes Disrupted", severity: "high", urgency: "short-term", category: "Traffic", priority: 82, affected: "1,200 students", desc: "14 school bus routes affected by flooded roads. Afternoon pickup delayed.", aiAnalysis: "Reroute buses via elevated roads. Contact parents via emergency notification system. Estimated delay: 45-60 minutes. Priority: ensure special-needs transport is rerouted first." },
    ],
  },
  {
    id: "blackout",
    title: "Citywide Blackout + Medical Emergency",
    description: "Widespread power failure impacting critical medical facilities",
    icon: Zap,
    color: "purple",
    badge: "SEVERE",
    issues: [
      { id: "1", title: "Hospital Backup Generator Failure", severity: "critical", urgency: "immediate", category: "Medical", priority: 99, affected: "200 patients", desc: "Primary and backup generators offline at City General Hospital. ICU on battery backup.", aiAnalysis: "CRITICAL: Deploy mobile generator units immediately. Estimated battery life: 90 minutes. Evacuate ICU patients to Regional Medical Center via ambulance convoy. Activate mutual aid agreement with neighboring district." },
      { id: "2", title: "Elevator Entrapment — 3 High-rises", severity: "critical", urgency: "immediate", category: "Medical", priority: 94, affected: "23 residents", desc: "Elevator failures in three residential high-rises. Multiple residents trapped.", aiAnalysis: "Dispatch fire department rescue teams to Tower A (8 trapped), Tower C (11 trapped), and Tower E (4 trapped). Prioritize Tower C — includes mobility-impaired residents on floors 12 and 15." },
      { id: "3", title: "Traffic Signal Cascade Failure", severity: "high", urgency: "short-term", category: "Traffic", priority: 85, affected: "15,000 commuters", desc: "All traffic signals on Main Corridor offline, causing gridlock.", aiAnalysis: "Deploy 12 traffic officers to key intersections. Activate portable generators for critical intersection signals. Coordinate with transit authority to increase bus frequency on parallel routes." },
    ],
  },
];

const SEVERITY_COLORS = {
  critical: "badge-rose",
  high: "badge-amber",
  medium: "badge-cyan",
  low: "badge-green",
};

/* ===== PAGE ===== */

export default function DemoPage() {
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleScenarioClick = (scenario: Scenario) => {
    setSelected(scenario);
    setActiveIssue(null);
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 1200);
  };

  const handleIssueClick = (issue: Issue) => {
    setAnalyzing(true);
    setTimeout(() => {
      setActiveIssue(issue);
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 shadow-lg shadow-cyan-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PulseGrid Demo</h1>
              <p className="text-sm text-slate-500">Select a crisis scenario to see AI-powered response</p>
            </div>
          </div>
        </div>

        {/* Scenario Selection */}
        {!selected && (
          <div className="grid gap-5 md:grid-cols-3">
            {SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioClick(scenario)}
                  className="glass-card group cursor-pointer p-6 text-left"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`inline-flex rounded-xl ${
                      scenario.color === "rose" ? "bg-rose-500/10" : scenario.color === "cyan" ? "bg-cyan-500/10" : "bg-purple-500/10"
                    } p-3`}>
                      <Icon className={`h-6 w-6 ${
                        scenario.color === "rose" ? "text-rose-400" : scenario.color === "cyan" ? "text-cyan-400" : "text-purple-400"
                      }`} />
                    </div>
                    <span className={`badge-neon ${
                      scenario.color === "rose" ? "badge-rose" : scenario.color === "cyan" ? "badge-cyan" : "badge-purple"
                    } text-[10px]`}>
                      {scenario.badge}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{scenario.title}</h3>
                  <p className="mb-4 text-sm text-slate-400">{scenario.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                    Launch Scenario <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Scenario */}
        {selected && (
          <div className="flex gap-5">
            {/* Issues List */}
            <div className={`w-full ${activeIssue ? "hidden lg:block lg:w-[380px]" : ""}`}>
              <button
                onClick={() => { setSelected(null); setActiveIssue(null); }}
                className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to scenarios
              </button>

              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{selected.title}</h2>
                <span className={`badge-neon ${
                  selected.color === "rose" ? "badge-rose" : selected.color === "cyan" ? "badge-cyan" : "badge-purple"
                }`}>
                  {selected.issues.length} issues
                </span>
              </div>

              {analyzing ? (
                <div className="glass-card flex items-center justify-center gap-3 p-12">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                  <span className="text-sm text-slate-400">Analyzing threats...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {selected.issues.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => handleIssueClick(issue)}
                      className={`glass-card w-full p-4 text-left transition-all ${
                        activeIssue?.id === issue.id ? "border-cyan-500/30 bg-cyan-500/5" : ""
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{issue.title}</h4>
                        <span className={`badge-neon ${SEVERITY_COLORS[issue.severity]} shrink-0 text-[10px]`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="mb-2 text-xs text-slate-500">{issue.desc}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{issue.affected}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{issue.urgency}</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{issue.priority}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Issue Detail Sidebar */}
            {activeIssue && (
              <div className="flex-1">
                <button
                  onClick={() => setActiveIssue(null)}
                  className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to issues
                </button>

                <div className="glass-strong rounded-2xl p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-xl font-bold text-white">{activeIssue.title}</h3>
                    <span className={`badge-neon ${SEVERITY_COLORS[activeIssue.severity]}`}>
                      {activeIssue.severity}
                    </span>
                  </div>

                  <p className="mb-6 text-sm text-slate-400">{activeIssue.desc}</p>

                  {/* Details Grid */}
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    {[
                      { icon: MapPin, label: "Affected", value: activeIssue.affected },
                      { icon: Clock, label: "Urgency", value: activeIssue.urgency },
                      { icon: TrendingUp, label: "Priority Score", value: `${activeIssue.priority}/100` },
                      { icon: Shield, label: "Category", value: activeIssue.category },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="glass-card p-3">
                        <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-500">
                          <Icon className="h-3 w-3" /> {label}
                        </div>
                        <div className="text-sm font-semibold text-white capitalize">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* AI Analysis */}
                  <div className="glass-card border-l-2 border-l-cyan-500 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">AI Analysis</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">{activeIssue.aiAnalysis}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
