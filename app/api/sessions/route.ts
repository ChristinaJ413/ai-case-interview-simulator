import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { appendSessionEvent } from "@/lib/instrumentation";

// POST /api/sessions - create a new candidate session for a case
export async function POST(request: Request) {
  const body = await request.json();
  const { caseId } = body;

  const session = await prisma.candidateSession.create({
    data: {
      caseId,
      priority_ranking: [],
      escalations: [],
      responses: {},
      event_log: [],
    },
  });

  await appendSessionEvent(session.id, {
    event_type: "session_created",
    metadata: { caseId },
  });

  return NextResponse.json(session, { status: 201 });
}

