-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company_context" TEXT NOT NULL,
    "policies" TEXT NOT NULL,
    "expected_priority" JSONB NOT NULL,
    "expected_escalations" JSONB NOT NULL,
    "rubric" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "customer_tier" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "sla_hours" INTEGER NOT NULL,
    CONSTRAINT "Ticket_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CandidateSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" DATETIME,
    "priority_ranking" JSONB NOT NULL,
    "escalations" JSONB NOT NULL,
    "responses" JSONB NOT NULL,
    "internal_summary" TEXT,
    "event_log" JSONB NOT NULL,
    CONSTRAINT "CandidateSession_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScoreResult" (
    "sessionId" TEXT NOT NULL PRIMARY KEY,
    "prioritization_score" INTEGER NOT NULL,
    "escalation_score" INTEGER NOT NULL,
    "policy_violations" INTEGER NOT NULL,
    "response_quality_score" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    CONSTRAINT "ScoreResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CandidateSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
