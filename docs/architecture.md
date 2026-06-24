# PulseGrid — Architecture

## System Overview

PulseGrid is a future-city outage prediction and community response planner. It helps neighborhoods, campuses, and apartment communities prepare for and respond to disruptions like water outages, power cuts, heat stress, flooding, waste buildup, and traffic chokepoints.

## Data Flow

```
Incident Signals → Normalization → Priority Ranking → AI Enrichment → Response Plans → Alerts & Summary
```

## 1. Issue Intake & Normalization

Raw signals come from multiple sources:
- Manual incident reports
- Weather feeds
- Service status monitors
- Complaint logs
- CSV/JSON uploads

Each signal is normalized into a `NormalizedIssue` with standardized fields: category, severity, urgency, population affected, cascading risk, time sensitivity, confidence, and resource availability.

## 2. Ranking Logic

The priority engine scores each issue using 8 weighted factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Urgency | 18% | How quickly action is needed |
| Severity | 15% | How serious the issue is |
| Cascading Risk | 15% | Likelihood of triggering other problems |
| Population Affected | 12% | Number of people impacted |
| Time Sensitivity | 12% | Deadline pressure |
| Service Criticality | 10% | Importance of the affected service |
| Resource Availability | 10% | How constrained resources are |
| Confidence | 8% | Data quality and completeness |

Each factor produces a sub-score (0-10), which is multiplied by its weight and summed for a final score (0-100).

## 3. AI Explanation/Recommendation Flow

AI enrichment uses NVIDIA NIM (Llama 3.3 70B) for:
- **Why it matters** — impact explanation
- **Who is affected** — specific groups and numbers
- **Likely next impact** — cascading consequences
- **Urgency explanation** — why timing matters
- **Recommendation** — first action to take

All AI outputs are schema-validated. On failure, deterministic fallback content is used.

## 4. Response Generation

For each prioritized issue, the system generates:
- Immediate next action
- Recommended team or owner
- Required resources
- 30-minute plan
- 24-hour note
- Resident-facing instructions
- Escalation threshold

## 5. Communication Generation

Alert drafts are generated for:
- **Resident alerts** — public-facing safety messages
- **Volunteer messages** — coordination instructions
- **Operations handoffs** — brief summaries for shift changes
- **Status updates** — periodic update templates

## 6. Grounded Q&A (Ask PulseGrid)

A context-grounded assistant answers questions using only:
- Current incident data
- Priority rankings
- Generated response plans

It does not access external knowledge, ensuring answers are grounded in app state.
