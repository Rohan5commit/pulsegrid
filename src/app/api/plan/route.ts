import { NextRequest, NextResponse } from "next/server";
import { generateResponsePlan, generateAlertDrafts } from "@/lib/ai";
import type { NormalizedIssue, EnrichedContext } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { issue, context } = (await req.json()) as {
      issue: NormalizedIssue;
      context: EnrichedContext;
    };
    const plan = await generateResponsePlan(issue, context);
    const alerts = await generateAlertDrafts(issue, plan);
    return NextResponse.json({ plan, alerts, source: "ai" as const });
  } catch {
    return NextResponse.json(
      { plan: null, alerts: [], source: "fallback" as const },
      { status: 200 }
    );
  }
}
