import { NextRequest, NextResponse } from "next/server";
import { enrichIssue } from "@/lib/ai";
import type { NormalizedIssue } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { issue } = (await req.json()) as { issue: NormalizedIssue };
    const context = await enrichIssue(issue);
    return NextResponse.json({ context, source: "ai" as const });
  } catch {
    return NextResponse.json(
      { context: null, source: "fallback" as const },
      { status: 200 }
    );
  }
}
