import { z } from "zod";

// ─── Enums ───
export const SeverityLevel = z.enum(["critical", "high", "medium", "low", "info"]);
export type SeverityLevel = z.infer<typeof SeverityLevel>;

export const IssueCategory = z.enum([
  "water-outage",
  "power-cut",
  "heat-stress",
  "flooding",
  "waste-buildup",
  "traffic-chokepoint",
  "medical-urgency",
  "structural-damage",
]);
export type IssueCategory = z.infer<typeof IssueCategory>;

export const UrgencyLevel = z.enum(["immediate", "urgent", "soon", "planned", "monitor"]);
export type UrgencyLevel = z.infer<typeof UrgencyLevel>;

// ─── Incident Signal (raw intake) ───
export const IncidentSignalSchema = z.object({
  id: z.string(),
  source: z.string(),
  category: IssueCategory,
  title: z.string(),
  description: z.string(),
  location: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  reportedAt: z.string(),
  populationAffected: z.number().default(0),
  serviceCriticality: z.number().min(1).max(10).default(5),
  rawPayload: z.any().optional(),
});
export type IncidentSignal = z.infer<typeof IncidentSignalSchema>;

// ─── Normalized Issue ───
export const NormalizedIssueSchema = z.object({
  id: z.string(),
  category: IssueCategory,
  title: z.string(),
  description: z.string(),
  location: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  severity: SeverityLevel,
  urgency: UrgencyLevel,
  populationAffected: z.number(),
  serviceCriticality: z.number(),
  cascadingRisk: z.number().min(0).max(10).default(5),
  timeSensitivity: z.number().min(0).max(10).default(5),
  confidence: z.number().min(0).max(1).default(0.8),
  resourceAvailability: z.number().min(0).max(10).default(5),
  reportedAt: z.string(),
  source: z.string(),
});
export type NormalizedIssue = z.infer<typeof NormalizedIssueSchema>;

// ─── Priority Score ───
export const PriorityScoreSchema = z.object({
  issueId: z.string(),
  score: z.number().min(0).max(100),
  rank: z.number(),
  breakdown: z.object({
    urgencyScore: z.number(),
    severityScore: z.number(),
    populationScore: z.number(),
    cascadingScore: z.number(),
    timeScore: z.number(),
    criticalityScore: z.number(),
    confidenceScore: z.number(),
    resourceScore: z.number(),
  }),
});
export type PriorityScore = z.infer<typeof PriorityScoreSchema>;

// ─── Enriched Context (AI) ───
export const EnrichedContextSchema = z.object({
  issueId: z.string(),
  whyItMatters: z.string(),
  whoIsAffected: z.string(),
  likelyNextImpact: z.string(),
  urgencyExplanation: z.string(),
  recommendation: z.string(),
});
export type EnrichedContext = z.infer<typeof EnrichedContextSchema>;

// ─── Response Plan ───
export const ResponsePlanSchema = z.object({
  issueId: z.string(),
  immediateAction: z.string(),
  recommendedTeam: z.string(),
  requiredResources: z.array(z.string()),
  thirtyMinutePlan: z.string(),
  twentyFourHourNote: z.string(),
  residentInstructions: z.string(),
  escalationThreshold: z.string(),
});
export type ResponsePlan = z.infer<typeof ResponsePlanSchema>;

// ─── Alert Draft ───
export const AlertDraftSchema = z.object({
  issueId: z.string(),
  residentAlert: z.string(),
  volunteerMessage: z.string(),
  operationsHandoff: z.string(),
  statusUpdate: z.string(),
});
export type AlertDraft = z.infer<typeof AlertDraftSchema>;

// ─── Handoff Note ───
export const HandoffNoteSchema = z.object({
  issueId: z.string(),
  summary: z.string(),
  nextSteps: z.array(z.string()),
  owner: z.string(),
  deadline: z.string(),
});
export type HandoffNote = z.infer<typeof HandoffNoteSchema>;

// ─── Impact Summary ───
export const ImpactSummarySchema = z.object({
  topPriorities: z.array(z.string()),
  affectedGroups: z.array(z.string()),
  readinessLevel: z.string(),
  actionCoverage: z.number().min(0).max(100),
  unresolvedRisks: z.number(),
  expectedCommunityImpact: z.string(),
  decisionsMadeFaster: z.string(),
});
export type ImpactSummary = z.infer<typeof ImpactSummarySchema>;

// ─── Agent Explanation ───
export const AgentExplanationSchema = z.object({
  issueId: z.string(),
  question: z.string(),
  answer: z.string(),
  confidence: z.number().min(0).max(1),
  sources: z.array(z.string()),
});
export type AgentExplanation = z.infer<typeof AgentExplanationSchema>;
