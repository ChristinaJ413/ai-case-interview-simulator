import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { appendSessionEvent } from "@/lib/instrumentation";

type Context = { params: Promise<{ sessionId: string }> };

// GET /api/sessions/:sessionId - fetch session with case and tickets
export async function GET(_request: Request, { params }: Context) {
  const { sessionId } = await params;

  const session = await prisma.candidateSession.findUnique({
    where: { id: sessionId },
    include: {
      case: {
        include: { tickets: true },
      },
      scoreResult: true,
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
}

// PUT /api/sessions/:sessionId - update session data (progress save)
export async function PUT(request: Request, { params }: Context) {
  const { sessionId } = await params;
  const body = await request.json();

  const {
    priority_ranking,
    escalations,
    responses,
    internal_summary,
    end_time,
    event,
  } = body;

  // Only update fields that were sent (partial update)
  const data: Record<string, unknown> = {};
  if (priority_ranking !== undefined) data.priority_ranking = priority_ranking;
  if (escalations !== undefined) data.escalations = escalations;
  if (responses !== undefined) data.responses = responses;
  if (internal_summary !== undefined) data.internal_summary = internal_summary;
  if (end_time != null) data.end_time = new Date(end_time);

  const updated = await prisma.candidateSession.update({
    where: { id: sessionId },
    data,
  });

  if (event) {
    await appendSessionEvent(sessionId, event);
  }

  return NextResponse.json(updated);
}

