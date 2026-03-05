import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/cases - list all cases (with basic ticket counts)
export async function GET() {
  const cases = await prisma.case.findMany({
    include: {
      _count: {
        select: { tickets: true, sessions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cases);
}

// POST /api/cases - create a new case with tickets
export async function POST(request: Request) {
  const body = await request.json();

  const {
    title,
    description,
    company_context,
    policies,
    tickets,
    expected_priority,
    expected_escalations,
    rubric,
  } = body;

  const created = await prisma.case.create({
    data: {
      title,
      description,
      company_context,
      policies,
      rubric: rubric ?? [],
      tickets: {
        create: (tickets ?? []).map((t: any) => ({
          subject: t.subject,
          body: t.body,
          severity: t.severity,
          customer_tier: t.customer_tier,
          channel: t.channel,
          sla_hours: t.sla_hours,
        })),
      },
      expected_priority: expected_priority ?? [],
      expected_escalations: expected_escalations ?? [],
    },
  });

  return NextResponse.json(created, { status: 201 });
}

