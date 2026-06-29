import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PulseGrid — AI-Powered Infrastructure Response",
  description:
    "Predict, prioritize, and respond to urban infrastructure failures with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="grid-bg fixed inset-0 z-0" />

        <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-zinc-100 transition-colors hover:text-sky-400"
            >
              PulseGrid
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/demo"
                className="text-sm text-zinc-400 transition-colors hover:text-sky-400"
              >
                Demo
              </Link>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] text-zinc-500">Live</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 min-h-screen">
          <main className="pt-14">{children}</main>
        </div>
      </body>
    </html>
  );
}
