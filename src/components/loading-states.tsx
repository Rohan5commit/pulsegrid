"use client";

import { Loader2 } from "lucide-react";

export function Spinner({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-5 w-5";
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <Loader2 className={`${sizeClass} animate-spin text-cyan-400`} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm"
        >
          <div className="mb-3 flex gap-2">
            <div className="h-6 w-12 rounded bg-white/5" />
            <div className="h-6 w-16 rounded bg-white/5" />
          </div>
          <div className="mb-2 h-5 w-3/4 rounded bg-white/5" />
          <div className="mb-3 h-4 w-full rounded bg-white/5" />
          <div className="flex gap-4">
            <div className="h-3 w-24 rounded bg-white/5" />
            <div className="h-3 w-20 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageLoader({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-slate-400">{message ?? "Loading..."}</p>
    </div>
  );
}
