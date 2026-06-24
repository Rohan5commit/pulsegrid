import type { NormalizedIssue, PriorityScore } from "../schemas";

interface ScoreWeights {
  urgency: number;
  severity: number;
  population: number;
  cascading: number;
  time: number;
  criticality: number;
  confidence: number;
  resource: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  urgency: 0.18,
  severity: 0.15,
  population: 0.12,
  cascading: 0.15,
  time: 0.12,
  criticality: 0.10,
  confidence: 0.08,
  resource: 0.10,
};

const URGENCY_SCORES: Record<string, number> = {
  immediate: 10,
  urgent: 8,
  soon: 6,
  planned: 4,
  monitor: 2,
};

const SEVERITY_SCORES: Record<string, number> = {
  critical: 10,
  high: 8,
  medium: 5,
  low: 3,
  info: 1,
};

export function scoreIssue(
  issue: NormalizedIssue,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): PriorityScore {
  const urgencyScore = (URGENCY_SCORES[issue.urgency] ?? 5) * weights.urgency;
  const severityScore = (SEVERITY_SCORES[issue.severity] ?? 5) * weights.severity;
  const populationScore = Math.min(10, Math.log10(Math.max(1, issue.populationAffected)) * 2.5) * weights.population;
  const cascadingScore = issue.cascadingRisk * weights.cascading;
  const timeScore = issue.timeSensitivity * weights.time;
  const criticalityScore = issue.serviceCriticality * weights.criticality;
  const confidenceScore = issue.confidence * 10 * weights.confidence;
  const resourceScore = (10 - issue.resourceAvailability) * weights.resource;

  const score = Math.min(100, Math.max(0, Math.round(
    (urgencyScore + severityScore + populationScore + cascadingScore + timeScore + criticalityScore + confidenceScore + resourceScore) * 10
  )));

  return {
    issueId: issue.id,
    score,
    rank: 0,
    breakdown: {
      urgencyScore,
      severityScore,
      populationScore,
      cascadingScore,
      timeScore,
      criticalityScore,
      confidenceScore,
      resourceScore,
    },
  };
}

export function rankIssues(issues: NormalizedIssue[]): PriorityScore[] {
  const scores = issues.map((issue) => scoreIssue(issue));
  scores.sort((a, b) => b.score - a.score);
  scores.forEach((s, i) => (s.rank = i + 1));
  return scores;
}
