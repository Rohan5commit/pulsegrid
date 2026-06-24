import type { ResponsePlan } from "../schemas";

const DEADLINES: Record<string, string> = {
  immediate: "Next 30 minutes",
  urgent: "Next 2 hours",
  soon: "Next 6 hours",
  planned: "Next 24–48 hours",
  monitor: "Ongoing — review weekly",
};

export function generateHandoffNote(plan: ResponsePlan, issueTitle: string, issueLocation: string, urgency: string = "soon") {
  return {
    issueId: plan.issueId,
    summary: `${issueTitle} at ${issueLocation}. Immediate action: ${plan.immediateAction}`,
    nextSteps: [
      plan.immediateAction,
      `Deploy team: ${plan.recommendedTeam}`,
      `Resources: ${plan.requiredResources.join(", ")}`,
      plan.escalationThreshold,
    ],
    owner: plan.recommendedTeam,
    deadline: DEADLINES[urgency] ?? "Next 2 hours",
  };
}
