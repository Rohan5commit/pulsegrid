import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseGrid — Future-City Outage Prediction & Response",
  description:
    "AI-powered urban disruption prioritization and community response planner for FutureHacks 2026.",
  openGraph: {
    title: "PulseGrid — Future-City Outage Prediction",
    description: "AI-powered urban disruption prioritization and response planning.",
    url: "https://pulsegrid-six.vercel.app",
    siteName: "PulseGrid",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseGrid — Future-City Outage Prediction",
    description: "AI-powered urban disruption prioritization and response planning.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
