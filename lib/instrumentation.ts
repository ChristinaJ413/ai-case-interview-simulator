import type { CandidateSession, SessionEvent } from "./types";
import { prisma } from "./db";

// Helper to append an event to a CandidateSession's event_log.
// Keeps the write logic in one place so callers can just pass metadata.

export async function appendSessionEvent(
  sessionId: string,
  event: Omit<SessionEvent, "timestamp"> & { timestamp?: string },
): Promise<CandidateSession> {
  const timestamp = event.timestamp ?? new Date().toISOString();

  const session = await prisma.candidateSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const existingLog = (session.event_log as SessionEvent[] | null) ?? [];

  const updatedLog: SessionEvent[] = [
    ...existingLog,
    {
      event_type: event.event_type,
      timestamp,
      metadata: event.metadata ?? {},
    },
  ];

  return prisma.candidateSession.update({
    where: { id: sessionId },
    data: {
      event_log: updatedLog as Parameters<typeof prisma.candidateSession.update>[0]["data"]["event_log"],
    },
  });
}

