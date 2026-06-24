import type { IncidentSignal, NormalizedIssue } from "../schemas";

const SEVERITY_MAP: Record<string, NormalizedIssue["severity"]> = {
  "water-outage": "critical",
  "power-cut": "critical",
  "heat-stress": "high",
  "flooding": "critical",
  "waste-buildup": "low",
  "traffic-chokepoint": "medium",
  "medical-urgency": "critical",
  "structural-damage": "high",
};

const URGENCY_MAP: Record<string, NormalizedIssue["urgency"]> = {
  "water-outage": "urgent",
  "power-cut": "urgent",
  "heat-stress": "soon",
  "flooding": "immediate",
  "waste-buildup": "planned",
  "traffic-chokepoint": "soon",
  "medical-urgency": "immediate",
  "structural-damage": "urgent",
};

export function normalizeSignal(signal: IncidentSignal): NormalizedIssue {
  let cascadingRisk = 5;
  if (signal.category === "water-outage" || signal.category === "power-cut") cascadingRisk = 8;
  if (signal.category === "medical-urgency") cascadingRisk = 9;
  if (signal.category === "flooding") cascadingRisk = 9;
  if (signal.category === "waste-buildup") cascadingRisk = 2;
  if (signal.category === "traffic-chokepoint") cascadingRisk = 3;

  let timeSensitivity = 5;
  if (signal.category === "medical-urgency") timeSensitivity = 10;
  if (signal.category === "flooding") timeSensitivity = 9;
  if (signal.category === "water-outage" || signal.category === "power-cut") timeSensitivity = 8;
  if (signal.category === "heat-stress") timeSensitivity = 7;
  if (signal.category === "traffic-chokepoint") timeSensitivity = 4;
  if (signal.category === "waste-buildup") timeSensitivity = 2;

  const resourceAvailability = signal.rawPayload?.resourceAvailability ?? 5;

  return {
    id: signal.id,
    category: signal.category,
    title: signal.title,
    description: signal.description,
    location: signal.location,
    coordinates: signal.coordinates,
    severity: SEVERITY_MAP[signal.category] ?? "medium",
    urgency: URGENCY_MAP[signal.category] ?? "soon",
    populationAffected: signal.populationAffected,
    serviceCriticality: signal.serviceCriticality,
    cascadingRisk,
    timeSensitivity,
    confidence: Math.min(0.95, 0.5 + (signal.populationAffected / 20000) * 0.45),
    resourceAvailability,
    reportedAt: signal.reportedAt,
    source: signal.source,
  };
}

export function normalizeSignals(signals: IncidentSignal[]): NormalizedIssue[] {
  return signals.map(normalizeSignal);
}
