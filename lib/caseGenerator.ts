import { Severity, CustomerTier, Channel } from "@prisma/client";
import type { RubricCriterion } from "./types";

// Stub AI case generator. For now returns a hard-coded sample payload
// that matches the Prisma Case/Ticket structure (minus IDs).

export function generateSampleCase() {
  const rubric: RubricCriterion[] = [
    {
      id: "prioritization",
      label: "Prioritization",
      description: "Are the most critical tickets handled first?",
      weight: 0.4,
    },
    {
      id: "escalation",
      label: "Escalation judgment",
      description: "Does the candidate escalate high-risk issues?",
      weight: 0.3,
    },
    {
      id: "communication",
      label: "Communication quality",
      description: "Clear, empathetic, and concise responses.",
      weight: 0.3,
    },
  ];

  return {
    title: "Multi-channel SLA Triage",
    description:
      "You are a customer support analyst for a SaaS company. Multiple customers have written in across channels. Triage, respond, and escalate appropriately.",
    company_context:
      "AcmeCloud provides uptime-critical infrastructure for SMB and enterprise customers.",
    policies:
      "Premium and Enterprise customers receive priority handling. High severity issues impacting many users must be escalated to on-call engineering.",
    tickets: [
      {
        subject: "Login errors for multiple users",
        body: "Several users report intermittent 500 errors when logging into the dashboard.",
        severity: Severity.HIGH,
        customer_tier: CustomerTier.ENTERPRISE,
        channel: Channel.EMAIL,
        sla_hours: 2,
      },
      {
        subject: "Billing question about invoice line item",
        body: "Customer is confused about an overage charge on last month’s invoice.",
        severity: Severity.LOW,
        customer_tier: CustomerTier.STANDARD,
        channel: Channel.CHAT,
        sla_hours: 24,
      },
      {
        subject: "Slow API responses in EU region",
        body: "Premium customer reporting elevated latency on EU shards during business hours.",
        severity: Severity.MEDIUM,
        customer_tier: CustomerTier.PREMIUM,
        channel: Channel.EMAIL,
        sla_hours: 4,
      },
    ],
    expected_priority: [] as string[], // to be set when tickets are persisted
    expected_escalations: [] as string[], // to be set when tickets are persisted
    rubric,
  };
}

