import { normalizeSignals } from "../normalization";
import { rankIssues } from "../ranking";
import { ALL_SIGNALS, DEMO_ENRICHED_CONTEXTS, DEMO_RESPONSE_PLANS } from "../schemas/demo-data";

describe("Normalization", () => {
  it("normalizes all signals in a scenario", () => {
    const signals = ALL_SIGNALS["heatwave-water"]!;
    const issues = normalizeSignals(signals);
    expect(issues.length).toBe(signals.length);
    issues.forEach((issue) => {
      expect(issue.id).toBeTruthy();
      expect(issue.severity).toBeTruthy();
      expect(issue.urgency).toBeTruthy();
      expect(issue.confidence).toBeGreaterThan(0);
      expect(issue.confidence).toBeLessThanOrEqual(1);
    });
  });

  it("assigns critical severity to water-outage", () => {
    const signals = ALL_SIGNALS["heatwave-water"]!.filter((s) => s.category === "water-outage");
    const issues = normalizeSignals(signals);
    issues.forEach((issue) => {
      expect(issue.severity).toBe("critical");
    });
  });
});

describe("Ranking", () => {
  it("ranks all issues and returns descending scores", () => {
    const signals = ALL_SIGNALS["heatwave-water"]!;
    const issues = normalizeSignals(signals);
    const priorities = rankIssues(issues);
    expect(priorities.length).toBe(issues.length);
    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i - 1].score).toBeGreaterThanOrEqual(priorities[i].score);
    }
  });

  it("assigns rank 1 to the highest-scoring issue", () => {
    const signals = ALL_SIGNALS["heatwave-water"]!;
    const issues = normalizeSignals(signals);
    const priorities = rankIssues(issues);
    expect(priorities[0].rank).toBe(1);
  });

  it("all scores are between 0 and 100", () => {
    const signals = ALL_SIGNALS["heatwave-water"]!;
    const issues = normalizeSignals(signals);
    const priorities = rankIssues(issues);
    priorities.forEach((p) => {
      expect(p.score).toBeGreaterThanOrEqual(0);
      expect(p.score).toBeLessThanOrEqual(100);
    });
  });
});

describe("Schema Validation", () => {
  it("demo data passes NormalizedIssue schema", () => {
    const { NormalizedIssueSchema } = require("../schemas");
    const signals = ALL_SIGNALS["heatwave-water"]!;
    const issues = normalizeSignals(signals);
    issues.forEach((issue) => {
      const result = NormalizedIssueSchema.safeParse(issue);
      expect(result.success).toBe(true);
    });
  });

  it("demo enriched contexts are valid", () => {
    const { EnrichedContextSchema } = require("../schemas");
    const contexts = DEMO_ENRICHED_CONTEXTS["heatwave-water"]!;
    contexts.forEach((ctx) => {
      const result = EnrichedContextSchema.safeParse(ctx);
      expect(result.success).toBe(true);
    });
  });

  it("demo response plans are valid", () => {
    const { ResponsePlanSchema } = require("../schemas");
    const plans = DEMO_RESPONSE_PLANS["heatwave-water"]!;
    plans.forEach((plan) => {
      const result = ResponsePlanSchema.safeParse(plan);
      expect(result.success).toBe(true);
    });
  });
});

describe("No-data Fallback", () => {
  it("returns empty array for empty signals", () => {
    const issues = normalizeSignals([]);
    expect(issues).toEqual([]);
  });

  it("returns empty array for empty ranking", () => {
    const priorities = rankIssues([]);
    expect(priorities).toEqual([]);
  });
});
