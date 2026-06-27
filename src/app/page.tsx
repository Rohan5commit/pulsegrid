"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Radio,
  Clock,
  TrendingUp,
  Eye,
  Layers,
  Bell,
} from "lucide-react";

const STEPS = [
  {
    icon: Eye,
    title: "Detect Issues",
    desc: "AI monitors power, water, traffic, and medical systems in real-time.",
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-400",
    lineClass: "from-cyan-500/30",
  },
  {
    icon: AlertTriangle,
    title: "Prioritize Risks",
    desc: "Machine learning ranks outages by severity, urgency, and population impact.",
    iconBg: "bg-purple-500/10",
    iconText: "text-purple-400",
    lineClass: "from-purple-500/30",
  },
  {
    icon: Shield,
    title: "Plan Response",
    desc: "Automated response plans with resource allocation and resident instructions.",
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-400",
    lineClass: "from-rose-500/30",
  },
  {
    icon: Bell,
    title: "Notify Community",
    desc: "Multi-channel alerts via SMS, push, sirens, and community liaison networks.",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    lineClass: "from-emerald-500/30",
  },
];

const STATS = [
  { value: "< 10s", label: "Time to Priority" },
  { value: "99.7%", label: "Detection Rate" },
  { value: "24/7", label: "Monitoring Ready" },
  { value: "50K+", label: "Residents Covered" },
];

const FEATURES = [
  {
    icon: Radio,
    title: "Multi-Signal Fusion",
    desc: "Combines IoT sensor data, weather feeds, traffic cameras, and social media signals into a unified threat model.",
  },
  {
    icon: Layers,
    title: "Impact Intelligence",
    desc: "Maps infrastructure failures to population impact — vulnerable communities, hospitals, schools, and transit hubs.",
  },
  {
    icon: Users,
    title: "Community-First Design",
    desc: "Response plans prioritize elderly, disabled, and low-income populations with tailored outreach protocols.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative px-4 pb-28 pt-28 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <Zap className="h-3.5 w-3.5" />
            FutureHacks 2026
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            <span className="gradient-text">PulseGrid</span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-xl text-slate-300 sm:text-2xl">
            Future-city outage prediction
            <br />
            <span className="text-slate-500">&</span>{" "}
            community response planning
          </p>
          <p className="mx-auto mb-10 max-w-xl text-base text-slate-500">
            AI-powered infrastructure monitoring that detects failures before they cascade, prioritizes by human impact, and coordinates community response in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/demo" className="btn-neon flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4" />
              Try Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/architecture" className="btn-ghost flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4" />
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="badge-neon badge-cyan mb-4 inline-flex">Workflow</span>
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
            <p className="text-slate-400">Four steps from detection to community action</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="glass-card group relative p-6">
                  {/* Step number */}
                  <div className="absolute right-4 top-4 text-5xl font-black text-white/[0.03]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Icon */}
                  <div className={`mb-4 inline-flex rounded-xl ${step.iconBg} p-3 shadow-lg`}>
                    <Icon className={`h-6 w-6 ${step.iconText}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${step.lineClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="glass-strong rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="mb-1 text-3xl font-black gradient-text">{value}</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="badge-neon badge-purple mb-4 inline-flex">Capabilities</span>
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Built for Real Communities</h2>
            <p className="text-slate-400">Not just monitoring — actionable intelligence for human impact</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card group p-6">
                <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3 shadow-lg shadow-purple-500/20">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-4 pb-24 pt-12 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-strong rounded-3xl p-10 sm:p-14">
            <Activity className="mx-auto mb-6 h-12 w-12 text-cyan-400" />
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">See PulseGrid in Action</h2>
            <p className="mb-8 text-slate-400">
              Experience how AI detects infrastructure failures and coordinates community response.
            </p>
            <Link href="/demo" className="btn-neon inline-flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4" />
              Launch Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8 text-center">
        <p className="text-xs text-slate-600">
          PulseGrid &middot; FutureHacks 2026 &middot; AI-Powered Community Resilience
        </p>
      </footer>
    </div>
  );
}
