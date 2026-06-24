import { NextRequest, NextResponse } from "next/server";
import { askPulseGrid } from "@/lib/ai";
import type { NormalizedIssue, ResponsePlan } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const { question, issues, priorities, plans } = await req.json();

    const result = await askPulseGrid(
      question,
      issues as NormalizedIssue[],
      priorities as { issueId: string; score: number; rank: number }[],
      plans as ResponsePlan[]
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
