import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseGrid — Future-City Outage Prediction & Response",
  description:
    "PulseGrid helps communities predict, prioritize, and respond to local outages and urban disruptions before they become bigger problems.",
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
      <body className={`${inter.className} antialiased`}>
        <TooltipProvider>
          <Navbar />
          <div className="h-14" />
          <main className="min-h-screen">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
