import { PrismaClient, Severity, CustomerTier, Channel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.case.findFirst();
  if (existing) {
    console.log("Case already exists, skipping seed.");
    return;
  }

  const createdCase = await prisma.case.create({
    data: {
      title: "Demo: Multi-channel SLA Triage",
      description:
        "You are a customer support analyst for a SaaS company. Triage incoming tickets, respond, and escalate where appropriate.",
      company_context:
        "AcmeCloud provides uptime-critical infrastructure for SMB and enterprise customers.",
      policies:
        "Premium and Enterprise customers receive priority handling. High severity incidents impacting many users must be escalated to on-call engineering.",
      expected_priority: [],
      expected_escalations: [],
      rubric: [
        {
          id: "prioritization",
          label: "Prioritization",
          weight: 0.4,
        },
        {
          id: "escalation",
          label: "Escalation choices",
          weight: 0.3,
        },
        {
          id: "communication",
          label: "Communication quality",
          weight: 0.3,
        },
      ],
      tickets: {
        create: [
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
      },
    },
    include: {
      tickets: true,
    },
  });

  const ticketIds = createdCase.tickets.map((t) => t.id);

  await prisma.case.update({
    where: { id: createdCase.id },
    data: {
      expected_priority: ticketIds, // simplistic: all in created order
      expected_escalations: [ticketIds[0]].filter(Boolean), // expect escalation of first (high severity) ticket
    },
  });

  console.log("Seeded demo case with id:", createdCase.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

