"use client";

import { useState } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Brain,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SAMPLE_RESPONSES: Record<string, string> = {
  blackout: `**Scenario Analysis: Citywide Blackout**

**Severity:** Critical — Immediate action required

**Impact Assessment:**
- **Population affected:** ~45,000 residents without power
- **Critical facilities:** 2 hospitals, 4 schools, 12 senior care facilities impacted
- **Estimated duration:** 4-8 hours based on grid damage pattern

**AI-Powered Response Plan:**
1. **Hospital priority** — Deploy mobile generators to City General and Memorial within 20 minutes
2. **Traffic management** — Deploy 24 officers to key intersections, activate portable signal units
3. **Vulnerable populations** — Initiate welfare checks on 1,200 registered elderly residents
4. **Communication** — Activate emergency broadcast on all channels (SMS, sirens, social media)

**Resource Requirements:**
- 6 mobile generator units
- 24 traffic officers
- 8 emergency response vehicles
- 15,000 bottled water units

Would you like me to generate the full response plan?`,

  flood: `**Flood Risk Assessment**

**Current Status:** Moderate — Rising water levels detected

**Monitoring Data:**
- River gauge at Main Street: 8.2 ft (flood stage: 9.0 ft)
- Rainfall rate: 2.1 in/hr — expected to continue for 3 hours
- Storm drains at 78% capacity in sectors 3, 7, and 11

**Predictive Analysis:**
Based on current rainfall trajectory, flood stage will be reached in approximately **45 minutes** in Sector 7 and **1.5 hours** in Sector 3.

**Recommended Actions:**
1. Issue flood warning to sectors 7 and 3 immediately
2. Pre-position sandbags at Main Street underpass
3. Activate emergency pumping stations PS-3 and PS-4
4. Notify residents in flood-prone areas to move vehicles to higher ground
5. Prepare evacuation routes for Riverside Drive`,

  default: `**PulseGrid Analysis Complete**

I can help you analyze infrastructure threats and generate response plans. Try asking about:

- **Blackout scenarios** — Power grid failures and medical facility impacts
- **Flood risks** — Water management and traffic disruption
- **Heatwave events** — Cooling center capacity and vulnerable populations
- **Traffic incidents** — Signal failures and emergency vehicle access

Or describe a specific scenario and I'll provide a detailed AI-powered assessment with prioritized response actions.`,
};

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello, I'm PulseGrid AI. I can help you analyze infrastructure threats, assess impact, and generate response plans.\n\nDescribe a scenario or ask a question about urban resilience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = SAMPLE_RESPONSES.default;
      if (lowerInput.includes("blackout") || lowerInput.includes("power") || lowerInput.includes("outage")) {
        response = SAMPLE_RESPONSES.blackout;
      } else if (lowerInput.includes("flood") || lowerInput.includes("water")) {
        response = SAMPLE_RESPONSES.flood;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 shadow-lg shadow-purple-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Ask PulseGrid</h1>
            <p className="text-xs text-slate-500">AI-powered infrastructure analysis</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl glass p-4 sm:p-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Brain className="h-4 w-4 text-cyan-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/20"
                    : "glass-card"
                }`}
              >
                <div className="whitespace-pre-wrap text-slate-300">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <User className="h-4 w-4 text-purple-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                <Brain className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="glass-card flex items-center gap-2 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                <span className="text-sm text-slate-400">Analyzing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mt-4">
          <div className="glass-strong flex items-center gap-3 rounded-xl px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe a scenario or ask about infrastructure threats..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-40 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-600">
            PulseGrid AI — Powered by multi-signal fusion analysis
          </p>
        </div>
      </div>
    </div>
  );
}
