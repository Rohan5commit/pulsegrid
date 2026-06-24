# PulseGrid

**Future-city outage prediction and community response planner.**

PulseGrid helps communities predict, prioritize, and respond to local outages and urban disruptions before they become bigger problems.

## The Problem

Future cities are only "smart" if they help people respond quickly to real local problems. Today, communities lose critical time when signals are fragmented across weather feeds, service monitors, complaint logs, and social media. Prioritization under pressure is hard.

## The Solution

PulseGrid turns scattered urban disruption signals into prioritized, actionable response plans. It combines deterministic severity scoring with AI-powered context enrichment to help communities understand what matters most and what to do next.

## Future-City Angle

PulseGrid embodies the idea that smart cities must help people respond to real local problems. It's not about flashy dashboards—it's about faster, better decisions when communities need them most.

## How Prioritization Works

Each incident is scored using 8 weighted factors:

1. **Urgency** (18%) — How quickly action is needed
2. **Severity** (15%) — How serious the issue is
3. **Cascading Risk** (15%) — Likelihood of triggering other problems
4. **Population Affected** (12%) — Number of people impacted
5. **Time Sensitivity** (12%) — Deadline pressure
6. **Service Criticality** (10%) — Importance of the affected service
7. **Resource Availability** (10%) — How constrained resources are
8. **Confidence** (8%) — Data quality and completeness

## How AI Is Used

- **NVIDIA NIM** (Llama 3.3 70B) powers all AI inference
- AI handles: issue understanding, context enrichment, recommendation generation, explanation generation, alert drafting
- Deterministic rules handle: severity classification, priority scoring, schema validation
- All AI outputs are schema-validated with fallbacks on failure

## Setup

```bash
git clone https://github.com/Rohan5commit/pulsegrid.git
cd pulsegrid
npm install
cp .env.example .env.local  # Add your NIM_API_KEY
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NIM_API_KEY` | Yes | NVIDIA NIM API key for AI features |

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add `NIM_API_KEY` in Vercel dashboard
4. Deploy

## Demo Flow

1. Click "Try Demo" on the landing page
2. Select a scenario preset (Heatwave, Flooding, or Blackout)
3. View prioritized issues with scores and AI analysis
4. Click an issue to see details and response plan
5. Use "Ask PulseGrid" for interactive Q&A
6. View the impact summary for the full picture

## Limitations

- Demo mode uses pre-seeded data
- AI responses may vary in quality
- No persistent storage (session-only state)
- Single-user demo (no multi-user collaboration)

## Future Work

- Real-time data ingestion from weather APIs and city services
- Multi-user collaboration and role-based access
- Push notifications and SMS alerts
- Historical analytics and trend detection
- Mobile app for field responders
- Integration with city 311 systems

## Tech Stack

- Next.js 15, React, TypeScript
- Tailwind CSS v4, shadcn/ui
- Zod schema validation
- NVIDIA NIM (Llama 3.3 70B)
- Lucide React icons

## License

MIT
