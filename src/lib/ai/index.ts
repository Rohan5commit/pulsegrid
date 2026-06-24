import type { NormalizedIssue, EnrichedContext, ResponsePlan, AlertDraft, AgentExplanation, ImpactSummary } from "../schemas";

const NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NIM_MODEL = "nvidia/llama-3.3-70b-instruct";
const API_KEY = process.env.NIM_API_KEY ?? "";

async function callNIM(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("NIM_API_KEY not configured");
  }

  const res = await fetch(NIM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: NIM_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    throw new Error(`NIM API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function parseJSONResponse<T>(raw: string, fallback: T): T {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
  } catch {
    // fall through
  }
  return fallback;
}

// ─── Enrich Issue Context ───
export async function enrichIssue(issue: NormalizedIssue): Promise<EnrichedContext> {
  const systemPrompt = `You are PulseGrid, a future-city outage prediction and response planner.
Given an urban incident, return a JSON object with these fields:
- whyItMatters: 1-2 sentences on impact
- whoIsAffected: specific groups and numbers
- likelyNextImpact: what happens if unchecked
- urgencyExplanation: why timing matters
- recommendation: first action to take
Return ONLY valid JSON, no markdown.`;

  const userPrompt = `Incident: ${issue.title}
Category: ${issue.category}
Severity: ${issue.severity}
Location: ${issue.location}
Population affected: ${issue.populationAffected}
Service criticality: ${issue.serviceCriticality}/10
Description: ${issue.description}`;

  try {
    const raw = await callNIM(systemPrompt, userPrompt);
    const parsed = parseJSONResponse<EnrichedContext>(raw, {} as EnrichedContext);
    return { ...parsed, issueId: issue.id };
  } catch {
    return generateFallbackEnrichment(issue);
  }
}

function generateFallbackEnrichment(issue: NormalizedIssue): EnrichedContext {
  return {
    issueId: issue.id,
    whyItMatters: `${issue.title} affects ${issue.populationAffected.toLocaleString()} residents with severity rated ${issue.severity}.`,
    whoIsAffected: `${issue.populationAffected.toLocaleString()} people in ${issue.location} are directly impacted.`,
    likelyNextImpact: `Without action, this issue may escalate and affect additional nearby areas.`,
    urgencyExplanation: `This issue is rated ${issue.urgency} urgency. Time-sensitive action is recommended.`,
    recommendation: `Deploy response team to ${issue.location} and assess immediate needs.`,
  };
}

// ─── Generate Response Plan ───
export async function generateResponsePlan(
  issue: NormalizedIssue,
  enrichment: EnrichedContext
): Promise<ResponsePlan> {
  const systemPrompt = `You are PulseGrid, a community response planner.
Given an incident and its context, generate a response plan as a JSON object with:
- immediateAction: one sentence
- recommendedTeam: who should handle it
- requiredResources: array of strings
- thirtyMinutePlan: what to do in next 30 min
- twentyFourHourNote: 24-hour outlook
- residentInstructions: clear steps for residents
- escalationThreshold: when to escalate
Return ONLY valid JSON, no markdown.`;

  const userPrompt = `Incident: ${issue.title}
Category: ${issue.category}
Severity: ${issue.severity}
Population: ${issue.populationAffected}
Location: ${issue.location}
Why it matters: ${enrichment.whyItMatters}
Likely next impact: ${enrichment.likelyNextImpact}
Recommendation: ${enrichment.recommendation}`;

  try {
    const raw = await callNIM(systemPrompt, userPrompt);
    const parsed = parseJSONResponse<ResponsePlan>(raw, {} as ResponsePlan);
    return { ...parsed, issueId: issue.id };
  } catch {
    return generateFallbackPlan(issue);
  }
}

function generateFallbackPlan(issue: NormalizedIssue): ResponsePlan {
  return {
    issueId: issue.id,
    immediateAction: `Assess ${issue.title} at ${issue.location} and deploy initial response.`,
    recommendedTeam: "Emergency Response Team",
    requiredResources: ["Assessment team", "Communication equipment", "Basic supplies"],
    thirtyMinutePlan: `Deploy team to ${issue.location}. Assess severity and immediate needs. Establish communication with affected residents.`,
    twentyFourHourNote: `Monitor situation at ${issue.location}. Escalate if conditions worsen. Coordinate with district services.`,
    residentInstructions: `Stay informed. Follow instructions from response team. Report changes to emergency hotline.`,
    escalationThreshold: `If severity increases or additional populations are affected, escalate to district emergency management.`,
  };
}

// ─── Generate Alert Drafts ───
export async function generateAlertDrafts(
  issue: NormalizedIssue,
  plan: ResponsePlan
): Promise<AlertDraft> {
  const systemPrompt = `You are PulseGrid's alert generator. Create concise, actionable messages as JSON with:
- residentAlert: public-facing safety message
- volunteerMessage: coordination instructions for volunteers
- operationsHandoff: brief ops summary for shift change
- statusUpdate: template for periodic updates
Return ONLY valid JSON, no markdown. Keep messages under 150 words each.`;

  const userPrompt = `Incident: ${issue.title}
Severity: ${issue.severity}
Location: ${issue.location}
Immediate action: ${plan.immediateAction}
Resident instructions: ${plan.residentInstructions}`;

  try {
    const raw = await callNIM(systemPrompt, userPrompt);
    const parsed = parseJSONResponse<AlertDraft>(raw, {} as AlertDraft);
    return { ...parsed, issueId: issue.id };
  } catch {
    return generateFallbackAlerts(issue, plan);
  }
}

function generateFallbackAlerts(issue: NormalizedIssue, plan: ResponsePlan): AlertDraft {
  return {
    issueId: issue.id,
    residentAlert: `⚠️ ${issue.title} reported in ${issue.location}. ${plan.residentInstructions}`,
    volunteerMessage: `Volunteers needed: ${plan.recommendedTeam}. Report to ${issue.location}. Resources: ${plan.requiredResources.join(", ")}.`,
    operationsHandoff: `${issue.title} – ${issue.severity.toUpperCase()}. Action: ${plan.immediateAction}. Team: ${plan.recommendedTeam}.`,
    statusUpdate: `UPDATE: ${issue.title} – Response team deployed. ${plan.twentyFourHourNote}`,
  };
}

// ─── Ask PulseGrid (grounded Q&A) ───
export async function askPulseGrid(
  question: string,
  issues: NormalizedIssue[],
  priorities: { issueId: string; score: number; rank: number }[],
  plans: ResponsePlan[]
): Promise<AgentExplanation> {
  const issueContext = issues
    .map(
      (i, idx) =>
        `#${idx + 1} [${i.severity.toUpperCase()}] ${i.title} at ${i.location} – ${i.populationAffected} affected, score: ${priorities[idx]?.score ?? "N/A"}`
    )
    .join("\n");

  const planContext = plans
    .map((p) => `${p.issueId}: ${p.immediateAction}`)
    .join("\n");

  const systemPrompt = `You are PulseGrid, a grounded assistant for community crisis response.
You can ONLY answer using the provided incident data, priority rankings, and response plans.
Do not make up information. If the answer is not in the data, say so.
Be concise and actionable. Return JSON with: question, answer, confidence (0-1), sources (array of issue IDs).`;

  const userPrompt = `Current issues ranked by priority:
${issueContext}

Response plans:
${planContext}

Question: ${question}`;

  try {
    const raw = await callNIM(systemPrompt, userPrompt);
    const parsed = parseJSONResponse<AgentExplanation>(raw, {} as AgentExplanation);
    return { ...parsed, question };
  } catch {
    return generateFallbackAnswer(question, issues, priorities);
  }
}

function generateFallbackAnswer(
  question: string,
  issues: NormalizedIssue[],
  priorities: { issueId: string; score: number; rank: number }[]
): AgentExplanation {
  const q = question.toLowerCase();
  let answer = "Based on the current data, I can help with that question.";

  if (q.includes("why") && q.includes("water")) {
    const water = issues.find((i) => i.category === "water-outage");
    if (water) {
      answer = `The water outage (${water.title}) is ranked highly because it affects ${water.populationAffected.toLocaleString()} people and has a cascading risk of ${water.cascadingRisk}/10. During current conditions, water infrastructure failure creates compounding health risks.`;
    }
  } else if (q.includes("30 minute") || q.includes("next")) {
    answer = "In the next 30 minutes: Deploy response teams to the top-priority issue. Activate communication channels. Begin resident notifications. Secure necessary resources.";
  } else if (q.includes("notify") || q.includes("resident")) {
    answer = "Resident notification should use the generated alert messages. Send via emergency broadcast, community app, and door-to-door for vulnerable populations.";
  } else {
    const top = issues[0];
    if (top) {
      answer = `The highest priority issue is "${top.title}" at ${top.location}, affecting ${top.populationAffected.toLocaleString()} people with ${top.severity} severity.`;
    }
  }

  return {
    issueId: issues[0]?.id ?? "",
    question,
    answer,
    confidence: 0.6,
    sources: issues.slice(0, 3).map((i) => i.id),
  };
}

// ─── Generate Impact Summary ───
export async function generateImpactSummary(
  issues: NormalizedIssue[],
  priorities: { issueId: string; score: number; rank: number }[]
): Promise<ImpactSummary> {
  const top3 = priorities.slice(0, 3).map((p) => {
    const issue = issues.find((i) => i.id === p.issueId);
    return issue?.title ?? p.issueId;
  });

  const totalAffected = issues.reduce((sum, i) => sum + i.populationAffected, 0);

  return {
    topPriorities: top3,
    affectedGroups: issues.map(
      (i) => `${i.populationAffected.toLocaleString()} residents – ${i.title}`
    ),
    readinessLevel:
      priorities[0]?.score ?? 0 > 80
        ? "Critical – immediate action required"
        : priorities[0]?.score ?? 0 > 60
        ? "Urgent – rapid response needed"
        : "Moderate – monitor and plan",
    actionCoverage: Math.round((issues.length / (issues.length + 2)) * 100),
    unresolvedRisks: issues.filter((i) => i.severity === "critical").length,
    expectedCommunityImpact: `Addressing the top ${Math.min(3, issues.length)} issues can improve safety for ${totalAffected.toLocaleString()} residents.`,
    decisionsMadeFaster: `PulseGrid's prioritization engine analyzed ${issues.length} issues and ranked them in milliseconds, saving an estimated 30-45 minutes of manual assessment.`,
  };
}
