import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { CaseBuilder } from "@/components/CaseBuilder";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ saved?: string }> | { saved?: string };
};

export default async function BuilderPage({ searchParams }: PageProps) {
  const resolved = await Promise.resolve(searchParams ?? {}).then((s) => s);
  const saved = resolved?.saved === "1";

  const existingCase = await prisma.case.findFirst({
    orderBy: { createdAt: "desc" },
    include: { tickets: true },
  });

  async function saveCase(formData: FormData) {
    "use server";

    const id = (formData.get("id") as string)?.trim() || null;
    const title = (formData.get("title") as string) ?? "";
    const description = (formData.get("description") as string) ?? "";
    const company_context =
      (formData.get("company_context") as string) ?? "";
    const policies = (formData.get("policies") as string) ?? "";

    if (id) {
      await prisma.case.update({
        where: { id },
        data: {
          title,
          description,
          company_context,
          policies,
        },
      });
    } else {
      await prisma.case.create({
        data: {
          title,
          description,
          company_context,
          policies,
          rubric: [],
          expected_priority: [],
          expected_escalations: [],
        },
      });
    }
    revalidatePath("/builder");
    redirect("/builder?saved=1");
  }

  const ticketCount = existingCase?.tickets?.length ?? 0;
  const lastUpdated = existingCase?.updatedAt
    ? new Date(existingCase.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <AppShell
      title="Case Builder"
      subtitle="Define the scenario a candidate will work through. Tickets are pre-seeded; focus on high-level context."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <Card className="sticky top-6">
            <CaseBuilder
              initialCase={existingCase ?? undefined}
              onSave={saveCase}
              saved={saved}
            />
          </Card>
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card variant="subtle">
            <h2 className="text-lg font-semibold text-brand-black">
              Simulation summary
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-brand-slate/80">Case name</dt>
                <dd className="mt-0.5 font-medium text-brand-black">
                  {existingCase?.title ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-brand-slate/80">Tickets</dt>
                <dd className="mt-0.5 font-medium text-brand-black">
                  {ticketCount}
                </dd>
              </div>
              {lastUpdated && (
                <div>
                  <dt className="text-brand-slate/80">Last updated</dt>
                  <dd className="mt-0.5 font-medium text-brand-black">
                    {lastUpdated}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-6">
              <ButtonLink
                href={existingCase ? `/run/${existingCase.id}` : "/builder"}
                variant="primary"
                size="md"
                className="w-full"
              >
                Run simulation
              </ButtonLink>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
