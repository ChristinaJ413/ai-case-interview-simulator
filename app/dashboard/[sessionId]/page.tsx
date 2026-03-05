import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { MetricsDashboard } from "@/components/MetricsDashboard";

type Params = {
  params: Promise<{ sessionId: string }>;
};

export const dynamic = "force-dynamic";

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

  async function computeScore() {
    "use server";
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    await fetch(`${base}/api/score/${sessionId}`, { method: "POST" });
    revalidatePath(`/dashboard/${sessionId}`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Session dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Review this candidate&apos;s performance on the simulated case.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/builder"
            className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-900"
          >
            Back to builder
          </a>
          <form action={computeScore}>
            <button
              type="submit"
              className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white"
            >
              Compute score
            </button>
          </form>
        </div>
      </header>

      <MetricsDashboard
        caseData={session.case}
        session={session}
        score={session.scoreResult ?? undefined}
      />
    </div>
  );
}

