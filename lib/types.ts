// Shared TypeScript types for the case simulator

import type {
  Case as PrismaCase,
  Ticket as PrismaTicket,
  CandidateSession as PrismaCandidateSession,
  ScoreResult as PrismaScoreResult,
  Severity,
  CustomerTier,
  Channel,
} from "@prisma/client";

export type Case = PrismaCase;
export type Ticket = PrismaTicket;
export type CandidateSession = PrismaCandidateSession;
export type ScoreResult = PrismaScoreResult;

// Event stored in CandidateSession.event_log
export type SessionEvent = {
  event_type: string;
  timestamp: string; // ISO
  metadata: Record<string, unknown>;
};

// Rubric criterion structure stored in Case.rubric JSON
export type RubricCriterion = {
  id: string;
  label: string;
  description?: string;
  weight?: number;
};

export type SeverityEnum = Severity;
export type CustomerTierEnum = CustomerTier;
export type ChannelEnum = Channel;

