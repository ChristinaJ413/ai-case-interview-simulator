import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CandidateWorkspace } from "@/components/CandidateWorkspace";
import { AppShell } from "@/components/AppShell";

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
    <AppShell
      title="Candidate Workspace"
      subtitle="Triage, respond, escalate, and summarize this case. Save progress, then click Finish & view dashboard when done."
      fullWidth
    >
      <div className="flex flex-col gap-4 md:grid md:grid-cols-1">
        <CandidateWorkspace
          sessionId={session.id}
          caseData={caseData}
          session={session}
        />
      </div>
    </AppShell>
  );
}
