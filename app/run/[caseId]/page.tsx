import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CandidateWorkspace } from "@/components/CandidateWorkspace";

type Params = {
  params: Promise<{ caseId: string }>;
};

export const dynamic = "force-dynamic";

export default async function RunCasePage({ params }: Params) {
  const { caseId } = await params;

  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    include: { tickets: true },
  });

  if (!caseData) {
    notFound();
  }

  const session = await prisma.candidateSession.create({
    data: {
      caseId: caseData.id,
      priority_ranking: [],
      escalations: [],
      responses: {},
      event_log: [],
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <header>
        <h1 className="text-xl font-semibold text-gray-900">
          Candidate workspace
        </h1>
        <p className="text-sm text-gray-600">
          Triage, respond, escalate, and summarize this case. Save progress, then
          click Finish & view dashboard when done.
        </p>
      </header>

      <CandidateWorkspace
        sessionId={session.id}
        caseData={caseData}
        session={session}
      />
    </div>
  );
}
