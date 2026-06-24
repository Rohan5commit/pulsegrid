import type { ResponsePlan } from "../schemas";

export function generateHandoffNote(plan: ResponsePlan, issueTitle: string, issueLocation: string) {
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
    deadline: "Next 30 minutes",
  };
}
