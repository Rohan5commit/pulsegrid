"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, MessageSquare, BarChart3, Layers, FileText } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Activity },
  { href: "/demo", label: "Demo", icon: LayoutDashboard },
  { href: "/ask", label: "Ask", icon: MessageSquare },
  { href: "/summary", label: "Impact", icon: BarChart3 },
  { href: "/architecture", label: "Architecture", icon: Layers },
  { href: "/response-plan", label: "Plan", icon: FileText },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Activity className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 opacity-0 blur-md group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Pulse</span>
            <span className="text-white">Grid</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="pulse-dot" />
          <span className="text-xs font-medium text-cyan-400">LIVE</span>
        </div>
      </div>
    </nav>
  );
}
