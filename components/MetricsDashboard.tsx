import React from "react";
import type { CandidateSession, Case, ScoreResult } from "@/lib/types";
import { computeSessionMetrics } from "@/lib/analytics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

type Props = {
  caseData: Case;
  session: CandidateSession;
  score?: ScoreResult | null;
};

export function MetricsDashboard({ caseData, session, score }: Props) {
  const metrics = computeSessionMetrics(session, caseData);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-brand-slate">
            Basic timing and activity metrics for this simulation run.
          </p>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-brand-slate">Duration</dt>
              <dd className="text-2xl font-semibold text-brand-black">
                {metrics.durationSeconds != null
                  ? `${metrics.durationSeconds}s`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-brand-slate">Event count</dt>
              <dd className="text-2xl font-semibold text-brand-black">
                {metrics.eventCount}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-brand-slate">Time to first action</dt>
              <dd className="text-2xl font-semibold text-brand-black">
                {metrics.firstActionSeconds != null
                  ? `${metrics.firstActionSeconds}s`
                  : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-brand-slate">
            Simple rule-based scoring. In a production system this would be
            replaced or augmented with AI-based scoring.
          </p>
          {score ? (
            <>
              <div className="mb-4 rounded-xl bg-brand-coral/10 px-4 py-3">
                <dt className="text-sm text-brand-slate">Total score</dt>
                <dd className="text-3xl font-semibold text-brand-coral">
                  {score.total_score}
                </dd>
              </div>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <dt className="text-sm text-brand-slate">Prioritization</dt>
                  <dd className="text-2xl font-semibold text-brand-black">
                    {score.prioritization_score}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-brand-slate">Escalation</dt>
                  <dd className="text-2xl font-semibold text-brand-black">
                    {score.escalation_score}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-brand-slate">Policy violations</dt>
                  <dd className="text-2xl font-semibold text-brand-black">
                    {score.policy_violations}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-brand-slate">Response quality</dt>
                  <dd className="text-2xl font-semibold text-brand-black">
                    {score.response_quality_score}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="text-sm text-brand-slate">
              No score computed yet. Use the dashboard action to compute it.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-1 text-xs text-brand-slate">
            <div>
              <dt className="inline font-medium text-brand-black">Case:</dt>{" "}
              <dd className="inline">{caseData.title}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-brand-black">Session ID:</dt>{" "}
              <dd className="inline font-mono">{session.id}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-brand-black">Started:</dt>{" "}
              <dd className="inline">
                {typeof session.start_time === "string"
                  ? session.start_time
                  : session.start_time.toISOString()}
              </dd>
            </div>
            {session.end_time && (
              <div>
                <dt className="inline font-medium text-brand-black">Ended:</dt>{" "}
                <dd className="inline">
                  {typeof session.end_time === "string"
                    ? session.end_time
                    : session.end_time.toISOString()}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
