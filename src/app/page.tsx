"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Bell,
  Eye,
  Layers,
} from "lucide-react";

const STEPS = [
  {
    icon: Eye,
    title: "Detect",
    desc: "AI monitors infrastructure signals in real-time.",
    color: "cyan" as const,
  },
  {
    icon: AlertTriangle,
    title: "Prioritize",
    desc: "Machine learning ranks by severity and impact.",
    color: "purple" as const,
  },
  {
    icon: Shield,
    title: "Plan",
    desc: "Automated response plans with resource allocation.",
    color: "rose" as const,
  },
  {
    icon: Bell,
    title: "Notify",
    desc: "Multi-channel alerts to the right people.",
    color: "green" as const,
  },
];

const FEATURES = [
  {
    icon: Activity,
    title: "Multi-Signal Fusion",
    desc: "Combines IoT sensors, weather feeds, traffic cameras, and social media into a unified threat model.",
  },
  {
    icon: Layers,
    title: "Impact Intelligence",
    desc: "Maps infrastructure failures to population impact — hospitals, schools, and vulnerable communities.",
  },
  {
    icon: Users,
    title: "Community-First",
    desc: "Response plans prioritize elderly, disabled, and low-income populations with tailored protocols.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[85vh] items-center px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <Zap className="h-3.5 w-3.5" />
            FutureHacks 2026
          </div>

          <h1 className="mb-8 text-6xl font-black tracking-tight sm:text-8xl lg:text-9xl">
            <span className="gradient-text">PulseGrid</span>
          </h1>

          <p className="mb-12 max-w-2xl text-2xl leading-relaxed text-slate-300 sm:text-3xl">
            Future-city outage prediction
            <br />
            <span className="text-slate-600">&</span>{" "}
            community response planning
          </p>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <Link href="/demo" className="btn-neon flex items-center gap-3 text-base">
              <Zap className="h-5 w-5" />
              Try Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/architecture" className="btn-ghost flex items-center gap-3 text-base">
              <Layers className="h-5 w-5" />
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-6 py-32 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <span className="badge-neon badge-cyan mb-6 inline-flex">Workflow</span>
            <h2 className="mb-5 text-4xl font-bold text-white sm:text-5xl">How It Works</h2>
            <p className="text-lg text-slate-500">Four steps from detection to community action</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const bgMap = {
                cyan: "bg-cyan-500/10",
                purple: "bg-purple-500/10",
                rose: "bg-rose-500/10",
                green: "bg-emerald-500/10",
              };
              const textMap = {
                cyan: "text-cyan-400",
                purple: "text-purple-400",
                rose: "text-rose-400",
                green: "text-emerald-400",
              };
              return (
                <div key={step.title} className="glass-card group p-8 text-center">
                  <div className="mb-2 text-xs font-bold tracking-widest text-slate-600">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className={`mx-auto mb-5 inline-flex rounded-2xl ${bgMap[step.color]} p-4`}>
                    <Icon className={`h-7 w-7 ${textMap[step.color]}`} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="px-6 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="glass-strong rounded-3xl p-12 text-center">
            <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
              {[
                { value: "< 10s", label: "Time to Priority" },
                { value: "99.7%", label: "Detection Rate" },
                { value: "24/7", label: "Monitoring" },
                { value: "50K+", label: "Residents" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="mb-2 text-4xl font-black gradient-text">{value}</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-6 py-32 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <span className="badge-neon badge-purple mb-6 inline-flex">Capabilities</span>
            <h2 className="mb-5 text-4xl font-bold text-white sm:text-5xl">Built for Real Communities</h2>
            <p className="text-lg text-slate-500">Actionable intelligence for human impact</p>
          </div>

          <div className="space-y-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card flex items-start gap-8 p-10">
                <div className="shrink-0 rounded-2xl bg-purple-500/10 p-4">
                  <Icon className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
                  <p className="text-base leading-relaxed text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-6 pb-32 pt-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-strong rounded-3xl p-16">
            <Activity className="mx-auto mb-8 h-14 w-14 text-cyan-400" />
            <h2 className="mb-5 text-3xl font-bold text-white sm:text-4xl">See PulseGrid in Action</h2>
            <p className="mb-10 text-lg text-slate-500">
              Experience how AI detects failures and coordinates community response.
            </p>
            <Link href="/demo" className="btn-neon inline-flex items-center gap-3 text-base">
              <Zap className="h-5 w-5" />
              Launch Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10 text-center">
        <p className="text-xs text-slate-600">
          PulseGrid &middot; FutureHacks 2026 &middot; AI-Powered Community Resilience
        </p>
      </footer>
    </div>
  );
}
