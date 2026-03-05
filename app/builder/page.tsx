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

  return (
    <AppShell
      title="Case Builder"
      subtitle="Define the scenario a candidate will work through. Tickets are pre-seeded; focus on high-level context."
      actions={
        existingCase ? (
          <ButtonLink
            href={`/run/${existingCase.id}`}
            variant="secondary"
            size="sm"
          >
            Run simulation
          </ButtonLink>
        ) : null
      }
    >
      <Card>
        <CaseBuilder
          initialCase={existingCase ?? undefined}
          onSave={saveCase}
          saved={saved}
        />
      </Card>
    </AppShell>
  );
}
