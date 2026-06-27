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
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)] shadow-lg shadow-black/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Activity className="h-6 w-6 text-[var(--color-primary)]" />
          <span className="gradient-text">PulseGrid</span>
        </Link>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className={`${menuOpen ? "flex" : "hidden"} absolute left-0 top-full z-50 w-full flex-col gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:relative md:w-auto md:flex-row md:border-0 md:p-0 md:bg-transparent items-center md:flex`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-text-2)] hover:text-[var(--color-text)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/demo"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-glow)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20"
        >
          <Zap className="h-4 w-4" />
          Try Demo
        </Link>
      </div>
    </nav>
  );
}
