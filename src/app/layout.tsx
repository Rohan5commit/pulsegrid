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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <TooltipProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
