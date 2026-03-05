import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreSession } from "@/lib/scoringEngine";

type Context = { params: Promise<{ sessionId: string }> };

// POST /api/score/:sessionId - compute and persist scores (stub, rule-based)
export async function POST(_request: Request, { params }: Context) {
  const { sessionId } = await params;

  const session = await prisma.candidateSession.findUnique({
    where: { id: sessionId },
    include: { case: true, scoreResult: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const breakdown = scoreSession(session.case, session);

  const saved = await prisma.scoreResult.upsert({
    where: { sessionId },
    create: {
      sessionId,
      ...breakdown,
    },
    update: {
      ...breakdown,
    },
  });

  return NextResponse.json(saved);
}

