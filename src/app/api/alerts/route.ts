import { NextRequest, NextResponse } from "next/server";
import { generateAlertDrafts } from "@/lib/ai";
import type { NormalizedIssue, ResponsePlan } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const { issue, plan } = await req.json();

    const result = await generateAlertDrafts(
      issue as NormalizedIssue,
      plan as ResponsePlan
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate alerts" },
      { status: 500 }
    );
  }
}
