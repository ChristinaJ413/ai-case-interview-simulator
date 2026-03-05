import type { CandidateSession, Case, SessionEvent } from "./types";

export type SessionMetrics = {
  durationSeconds: number | null;
  eventCount: number;
  firstActionSeconds: number | null;
};

// Compute simple metrics derived from a session and its event_log.
export function computeSessionMetrics(
  session: CandidateSession,
  _caseData: Case,
): SessionMetrics {
  const start = session.start_time;
  const end = session.end_time ?? null;

  const durationSeconds =
    end != null ? Math.round((end.getTime() - start.getTime()) / 1000) : null;

  const events = (session.event_log as SessionEvent[] | null) ?? [];
  const eventCount = events.length;

  let firstActionSeconds: number | null = null;
  if (events.length > 0) {
    const firstTs = new Date(events[0].timestamp);
    firstActionSeconds = Math.round(
      (firstTs.getTime() - start.getTime()) / 1000,
    );
  }

  return {
    durationSeconds,
    eventCount,
    firstActionSeconds,
  };
}

