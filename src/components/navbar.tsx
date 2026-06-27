"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, Zap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Demo" },
  { href: "/ask", label: "Ask PulseGrid" },
  { href: "/summary", label: "Impact" },
  { href: "/architecture", label: "Architecture" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="gradient-text">PulseGrid</span>
        </Link>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5 text-slate-400" /> : <Menu className="h-5 w-5 text-slate-400" />}
        </button>

        <div
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 top-full z-50 w-full flex-col gap-1 border-b border-white/5 bg-[#050816]/95 p-4 backdrop-blur-xl md:relative md:w-auto md:flex-row md:border-0 md:p-0 md:bg-transparent items-center md:flex`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/demo"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]"
        >
          <Zap className="h-4 w-4" />
          Try Demo
        </Link>
      </div>
    </nav>
  );
}
