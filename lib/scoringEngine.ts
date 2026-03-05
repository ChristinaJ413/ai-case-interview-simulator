import type { CandidateSession, Case } from "./types";

export type ScoreBreakdown = {
  prioritization_score: number;
  escalation_score: number;
  policy_violations: number;
  response_quality_score: number;
  total_score: number;
};

// Very simple rule-based scoring stub.
// - prioritization_score: overlap of candidate ranking vs expected_priority (top K)
// - escalation_score: overlap of candidate escalations vs expected_escalations
// - policy_violations: keyword scan in responses & summary (stub)
// - response_quality_score: fixed 0 for now (placeholder for AI model)

export function scoreSession(caseData: Case, session: CandidateSession): ScoreBreakdown {
  const expectedPriority = (caseData.expected_priority ?? []) as string[];
  const expectedEscalations = (caseData.expected_escalations ?? []) as string[];

  const priorityRanking = (session.priority_ranking as string[] | null) ?? [];
  const escalations = (session.escalations as string[] | null) ?? [];
  const responses = (session.responses as Record<string, string> | null) ?? {};
  const summary = session.internal_summary ?? "";

  const topK = Math.min(3, expectedPriority.length);
  const expectedTop = new Set(expectedPriority.slice(0, topK));
  const candidateTop = new Set(priorityRanking.slice(0, topK));

  let prioritizationScore = 0;
  for (const t of candidateTop) {
    if (expectedTop.has(t)) prioritizationScore += 1;
  }

  const expectedEscSet = new Set(expectedEscalations);
  let escalationScore = 0;
  for (const t of escalations) {
    if (expectedEscSet.has(t)) escalationScore += 1;
  }

  const textBlob =
    Object.values(responses).join(" ") + " " + summary.toLowerCase();

  const violationKeywords = ["breach", "illegal", "ignore sla"]; // stub list
  let policyViolations = 0;
  for (const kw of violationKeywords) {
    if (textBlob.toLowerCase().includes(kw)) {
      policyViolations += 1;
    }
  }

  const responseQualityScore = 0;

  // Simple aggregation: positive scores minus penalties
  const totalScore =
    prioritizationScore * 10 + escalationScore * 10 - policyViolations * 5;

  return {
    prioritization_score: prioritizationScore,
    escalation_score: escalationScore,
    policy_violations: policyViolations,
    response_quality_score: responseQualityScore,
    total_score: totalScore,
  };
}

