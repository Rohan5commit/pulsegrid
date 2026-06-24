"use client";

import Link from "next/link";
import { Shield, Zap, Radio, BarChart3, ArrowRight, Activity, MapPin, Users } from "lucide-react";

const STEPS = [
  { icon: Radio, label: "Detect Issues", desc: "Ingest signals from weather feeds, service monitors, and community reports." },
  { icon: BarChart3, label: "Prioritize Risks", desc: "AI-powered ranking surfaces the most critical issues first." },
  { icon: Shield, label: "Plan Response", desc: "Generate actionable plans with teams, resources, and timelines." },
  { icon: Zap, label: "Notify Community", desc: "Draft alerts for residents, volunteers, and operations teams." },
];

const STATS = [
  { value: "< 10s", label: "Time to Priority" },
  { value: "8", label: "Risk Factors Scored" },
  { value: "3", label: "Scenario Presets" },
  { value: "24/7", label: "Monitoring Ready" },
];

export default function HomePage() {
  return (
    <div className="grid-pattern">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium text-[var(--color-text-2)]">
            <Activity className="h-3 w-3 text-[var(--color-primary)]" />
            FutureHacks 2026
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            <span className="gradient-text">PulseGrid</span>
          </h1>
          <p className="mb-4 text-xl font-medium text-[var(--color-text)] md:text-2xl">
            Future-city outage prediction and community response planner.
          </p>
          <p className="mx-auto mb-10 max-w-2xl text-base text-[var(--color-text-2)] md:text-lg">
            PulseGrid helps communities predict, prioritize, and respond to local outages and urban disruptions
            before they become bigger problems.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/demo"
              className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary)]/25"
            >
              Try Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/architecture"
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3.5 text-base font-semibold text-[var(--color-text)] transition-all hover:border-[var(--color-border-2)] hover:bg-[var(--color-surface-2)]"
            >
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface-2)]"
            >
              <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                {i + 1}
              </div>
              <step.icon className="mb-4 h-8 w-8 text-[var(--color-primary)] transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-lg font-semibold">{step.label}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-2)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 px-4 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-[var(--color-primary)]">{stat.value}</div>
              <div className="mt-1 text-sm text-[var(--color-text-2)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">Built for Real Communities</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Hyper-Local Intelligence", desc: "Precise location tracking and neighborhood-level impact assessment for every incident." },
            { icon: Users, title: "Community-First Design", desc: "Resident-facing alerts, volunteer coordination, and accessible information for all." },
            { icon: Shield, title: "AI + Deterministic Hybrid", desc: "Critical severity rules stay deterministic. AI handles context, explanation, and recommendations." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-all hover:border-[var(--color-primary)]/20"
            >
              <f.icon className="mb-4 h-8 w-8 text-[var(--color-accent)]" />
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-2)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)] p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">See PulseGrid in Action</h2>
          <p className="mb-8 text-[var(--color-text-2)]">
            Experience how communities can predict and respond to urban disruptions in real-time.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary)]/25"
          >
            Launch Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] px-4 py-8 text-center text-sm text-[var(--color-muted)]">
        PulseGrid — Built for FutureHacks 2026. Powered by NVIDIA NIM.
      </footer>
    </div>
  );
}
