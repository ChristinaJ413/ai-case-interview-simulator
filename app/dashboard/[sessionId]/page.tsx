import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { MetricsDashboard } from "@/components/MetricsDashboard";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";

type Params = {
  params: Promise<{ sessionId: string }>;
};

export const dynamic = "force-dynamic";

/**
 * Dashboard page — Analytics for a single session. Shows overview metrics,
 * scores (after "Compute score"), and session details. Compute score calls
 * the scoring API and revalidates so the new score appears.
 */
export default async function DashboardPage({ params }: Params) {
  const { sessionId } = await params;

  const session = await prisma.candidateSession.findUnique({
    where: { id: sessionId },
    include: {
      case: true,
      scoreResult: true,
    },
  });

  if (!session) {
    notFound();
  }

  /** Calls POST /api/score/:sessionId then revalidates this page */
  async function computeScore() {
    "use server";
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    await fetch(`${base}/api/score/${sessionId}`, { method: "POST" });
    revalidatePath(`/dashboard/${sessionId}`);
  }

  return (
    <AppShell
      title="Session Dashboard"
      subtitle="Review this candidate's performance on the simulated case."
      actions={
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/builder" variant="outline" size="sm">
            Back to builder
          </ButtonLink>
          <form action={computeScore}>
            <Button type="submit" variant="primary" size="sm">
              Compute score
            </Button>
          </form>
        </div>
      }
    >
      <MetricsDashboard
        caseData={session.case}
        session={session}
        score={session.scoreResult ?? undefined}
      />
    </AppShell>
  );
}
