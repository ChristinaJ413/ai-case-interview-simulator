import React from "react";
import type { CandidateSession, Case, ScoreResult } from "@/lib/types";
import { computeSessionMetrics } from "@/lib/analytics";

type Props = {
  caseData: Case;
  session: CandidateSession;
  score?: ScoreResult | null;
};

export function MetricsDashboard({ caseData, session, score }: Props) {
  const metrics = computeSessionMetrics(session, caseData);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">Overview</h2>
        <p className="mt-1 text-xs text-gray-500">
          Basic timing and activity metrics for this simulation run.
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-gray-500">Duration</dt>
            <dd className="text-sm font-medium text-gray-900">
              {metrics.durationSeconds != null
                ? `${metrics.durationSeconds}s`
                : "In progress"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Event count</dt>
            <dd className="text-sm font-medium text-gray-900">
              {metrics.eventCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Time to first action</dt>
            <dd className="text-sm font-medium text-gray-900">
              {metrics.firstActionSeconds != null
                ? `${metrics.firstActionSeconds}s`
                : "No events logged"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">Scores</h2>
        <p className="mt-1 text-xs text-gray-500">
          Simple rule-based scoring. In a production system this would be
          replaced or augmented with AI-based scoring.
        </p>
        {score ? (
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-gray-500">Prioritization</dt>
              <dd className="text-sm font-medium text-gray-900">
                {score.prioritization_score}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Escalation</dt>
              <dd className="text-sm font-medium text-gray-900">
                {score.escalation_score}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Policy violations</dt>
              <dd className="text-sm font-medium text-gray-900">
                {score.policy_violations}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Response quality</dt>
              <dd className="text-sm font-medium text-gray-900">
                {score.response_quality_score}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Total score</dt>
              <dd className="text-sm font-medium text-gray-900">
                {score.total_score}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            No score computed yet. Use the dashboard action to compute it.
          </p>
        )}
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">Session details</h2>
        <dl className="mt-2 space-y-1 text-xs text-gray-600">
          <div>
            <dt className="inline font-medium">Case:</dt>{" "}
            <dd className="inline">{caseData.title}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Session ID:</dt>{" "}
            <dd className="inline">{session.id}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Started:</dt>{" "}
            <dd className="inline">{session.start_time.toISOString()}</dd>
          </div>
          {session.end_time && (
            <div>
              <dt className="inline font-medium">Ended:</dt>{" "}
              <dd className="inline">{session.end_time.toISOString()}</dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

