"use client";

import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Layers,
  Eye,
  AlertTriangle,
  Shield,
  Bell,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen items-center px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-8 text-7xl font-black tracking-tight sm:text-8xl lg:text-9xl">
            <span className="gradient-text">PulseGrid</span>
          </h1>

          <p className="mb-14 text-lg leading-relaxed text-slate-500">
            AI-powered outage prediction for future cities.
          </p>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <Link href="/demo" className="btn-neon flex items-center gap-3 text-base">
              <Zap className="h-5 w-5" />
              Try Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/architecture" className="btn-ghost flex items-center gap-3 text-base">
              <Layers className="h-5 w-5" />
              Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-6 py-48 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-20 text-3xl font-bold text-white sm:text-4xl">How it works</h2>

          <div className="space-y-16">
            {[
              { icon: Eye, step: "01", title: "Detect", desc: "AI monitors infrastructure signals in real-time." },
              { icon: AlertTriangle, step: "02", title: "Prioritize", desc: "ML ranks outages by severity and population impact." },
              { icon: Shield, step: "03", title: "Plan", desc: "Automated response plans with resource allocation." },
              { icon: Bell, step: "04", title: "Notify", desc: "Multi-channel alerts to the right people." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex items-center gap-8 text-left">
                <div className="shrink-0 text-sm font-bold text-slate-700">{step}</div>
                <div className="h-px w-8 bg-gradient-to-r from-cyan-500/30 to-transparent" />
                <Icon className="h-5 w-5 shrink-0 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-6 pb-32 pt-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-10 text-lg text-slate-500">
            Experience how AI detects infrastructure failures and coordinates community response.
          </p>
          <Link href="/demo" className="btn-neon inline-flex items-center gap-3 text-base">
            <Zap className="h-5 w-5" />
            Launch Demo
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10 text-center">
        <p className="text-xs text-slate-600">
          PulseGrid &middot; FutureHacks 2026
        </p>
      </footer>
    </div>
  );
}
