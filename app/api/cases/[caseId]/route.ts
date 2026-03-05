import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Context = { params: Promise<{ caseId: string }> };

// GET /api/cases/:caseId - fetch one case with tickets
export async function GET(_request: Request, { params }: Context) {
  const { caseId } = await params;

  const c = await prisma.case.findUnique({
    where: { id: caseId },
    include: { tickets: true },
  });

  if (!c) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  return NextResponse.json(c);
}

// PUT /api/cases/:caseId - update case and (optionally) tickets
export async function PUT(request: Request, { params }: Context) {
  const { caseId } = await params;
  const body = await request.json();

  const {
    title,
    description,
    company_context,
    policies,
    expected_priority,
    expected_escalations,
    rubric,
  } = body;

  const updated = await prisma.case.update({
    where: { id: caseId },
    data: {
      title,
      description,
      company_context,
      policies,
      expected_priority,
      expected_escalations,
      rubric,
    },
  });

  return NextResponse.json(updated);
}

