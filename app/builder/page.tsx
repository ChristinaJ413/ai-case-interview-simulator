import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { CaseBuilder } from "@/components/CaseBuilder";

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
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Case Builder
          </h1>
          <p className="text-sm text-gray-600">
            Define the scenario a candidate will work through. Tickets are
            pre-seeded in this prototype; focus on high-level context.
          </p>
        </div>
        {existingCase && (
          <a
            href={`/run/${existingCase.id}`}
            className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white"
          >
            Run simulation
          </a>
        )}
      </header>

      <div>
        <CaseBuilder
          initialCase={existingCase ?? undefined}
          onSave={saveCase}
          saved={saved}
        />
      </div>
    </div>
  );
}
