export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400" />
        <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-purple-400" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card animate-pulse p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/5" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-3/4 rounded bg-white/5" />
          <div className="h-3 w-1/2 rounded bg-white/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-5/6 rounded bg-white/5" />
        <div className="h-3 w-2/3 rounded bg-white/5" />
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner className="mb-4" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
