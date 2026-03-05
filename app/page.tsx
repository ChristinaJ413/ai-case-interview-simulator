import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-white flex items-center justify-center px-4">
      <main className="w-full max-w-xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-black">
              AI Case Interview Simulator
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-2 text-brand-slate">
            Prototype for Cornell: create a simulated customer support case,
            walk a candidate through it, and review their performance.
          </CardContent>
          <div className="mt-6">
            <ButtonLink
              href="/builder"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
            >
              Case Builder
            </ButtonLink>
          </div>
          <p className="mt-4 text-xs text-brand-slate">
            Start by seeding the database and visiting the builder to review the
            demo case, then run a simulation and open the dashboard.
          </p>
        </Card>
      </main>
    </div>
  );
}
