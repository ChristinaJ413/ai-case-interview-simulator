import React from "react";
import type { CandidateSession, Case, ScoreResult } from "@/lib/types";
import { computeSessionMetrics } from "@/lib/analytics";
import { Card } from "@/components/ui/Card";

type Props = {
  caseData: Case;
  session: CandidateSession;
  score?: ScoreResult | null;
};

/** Session dates may be Date (from Prisma) or string (after serialization) */
function formatDate(d: Date | string): string {
  return typeof d === "string" ? d : d.toISOString();
}

/**
 * MetricsDashboard — Analytics view for a completed session.
 * Overview: duration, time to first action, event count.
 * Scores: total (highlighted) + prioritization, escalation, policy violations, response quality.
 * Session details: case name, session ID, started/ended.
 */
export function MetricsDashboard({ caseData, session, score }: Props) {
  const metrics = computeSessionMetrics(session, caseData);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-brand-black">Overview</h2>
        <p className="mt-0.5 text-sm text-brand-slate/80">
          Timing and activity for this run.
        </p>
        {/* Three metric cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card variant="subtle">
            <dt className="text-sm text-brand-slate/80">Duration</dt>
            <dd className="mt-1 text-2xl font-semibold text-brand-black">
              {metrics.durationSeconds != null
                ? `${metrics.durationSeconds}s`
                : "—"}
            </dd>
          </Card>
          <Card variant="subtle">
            <dt className="text-sm text-brand-slate/80">Time to first action</dt>
            <dd className="mt-1 text-2xl font-semibold text-brand-black">
              {metrics.firstActionSeconds != null
                ? `${metrics.firstActionSeconds}s`
                : "—"}
            </dd>
          </Card>
          <Card variant="subtle">
            <dt className="text-sm text-brand-slate/80">Event count</dt>
            <dd className="mt-1 text-2xl font-semibold text-brand-black">
              {metrics.eventCount}
            </dd>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-black">Scores</h2>
        <p className="mt-0.5 text-sm text-brand-slate/80">
          Rule-based scoring. Replace or augment with AI in production.
        </p>
        {score ? (
          <>
            {/* Hero card: total score in coral */}
            <Card className="mt-4 flex flex-row flex-wrap items-center justify-between gap-6 bg-brand-coral/5 border-brand-coral/30">
              <div>
                <dt className="text-sm text-brand-slate/80">Total score</dt>
                <dd className="mt-1 text-4xl font-semibold text-brand-coral">
                  {score.total_score}
                </dd>
              </div>
              <p className="max-w-xs text-sm text-brand-slate/80">
                Combined prioritization, escalation, and policy adherence.
              </p>
            </Card>
            {/* Breakdown: four score cards */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card variant="subtle">
                <dt className="text-sm text-brand-slate/80">Prioritization</dt>
                <dd className="mt-1 text-xl font-semibold text-brand-black">
                  {score.prioritization_score}
                </dd>
              </Card>
              <Card variant="subtle">
                <dt className="text-sm text-brand-slate/80">Escalation</dt>
                <dd className="mt-1 text-xl font-semibold text-brand-black">
                  {score.escalation_score}
                </dd>
              </Card>
              <Card variant="subtle">
                <dt className="text-sm text-brand-slate/80">Policy violations</dt>
                <dd className="mt-1 text-xl font-semibold text-brand-black">
                  {score.policy_violations}
                </dd>
              </Card>
              <Card variant="subtle">
                <dt className="text-sm text-brand-slate/80">Response quality</dt>
                <dd className="mt-1 text-xl font-semibold text-brand-black">
                  {score.response_quality_score}
                </dd>
              </Card>
            </div>
          </>
        ) : (
          <Card variant="subtle" className="mt-4">
            <p className="text-sm text-brand-slate/80">
              No score yet. Click &quot;Compute score&quot; above.
            </p>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-black">
          Session details
        </h2>
        <Card variant="subtle" className="mt-4">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-brand-slate/80">Case</dt>
              <dd className="mt-0.5 text-sm font-medium text-brand-black">
                {caseData.title}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-brand-slate/80">Session ID</dt>
              <dd className="mt-0.5 font-mono text-sm text-brand-black">
                {session.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-brand-slate/80">Started</dt>
              <dd className="mt-0.5 text-sm text-brand-black">
                {formatDate(session.start_time)}
              </dd>
            </div>
            {session.end_time && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-slate/80">Ended</dt>
                <dd className="mt-0.5 text-sm text-brand-black">
                  {formatDate(session.end_time)}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      </section>
    </div>
  );
}
