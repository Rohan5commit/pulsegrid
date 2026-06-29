import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Scan,
  BarChart3,
  ShieldCheck,
  Radio,
} from "lucide-react";

const STEPS = [
  {
    icon: Scan,
    label: "Detect",
    desc: "AI monitors infrastructure signals across weather, power, water, and traffic feeds.",
  },
  {
    icon: BarChart3,
    label: "Prioritize",
    desc: "Eight weighted factors score each incident by severity, urgency, and population impact.",
  },
  {
    icon: ShieldCheck,
    label: "Plan",
    desc: "Automated response plans with team assignments, resource allocation, and escalation paths.",
  },
  {
    icon: Radio,
    label: "Notify",
    desc: "Multi-channel alert drafts for residents, volunteers, and operations teams.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      {/* Hero */}
      <div className="mb-8">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
          </span>
          AI-powered
        </span>
      </div>

      <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-50 sm:text-6xl">
        PulseGrid
      </h1>

      <p className="mb-12 text-lg leading-relaxed text-zinc-400">
        Predict, prioritize, and respond to urban infrastructure failures
        before they cascade.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/25"
        >
          <Zap className="h-4 w-4" />
          Try the Demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* How It Works */}
      <div className="mt-32">
        <h2 className="mb-16 text-sm font-semibold uppercase tracking-widest text-zinc-500">
          How it works
        </h2>

        <div className="space-y-12 text-left">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-start gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <step.icon className="h-4 w-4 text-sky-400" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-200">
                    {step.label}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-32 border-t border-zinc-800/60 pt-16">
        <p className="mb-6 text-sm text-zinc-500">
          See how AI detects failures and coordinates community response in
          real time.
        </p>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
        >
          Launch Demo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-32 border-t border-zinc-800/60 pt-8 pb-12">
        <p className="text-xs text-zinc-600">
          PulseGrid &middot; Gen AI Academy APAC Edition Cohort 2
        </p>
      </footer>
    </div>
  );
}
