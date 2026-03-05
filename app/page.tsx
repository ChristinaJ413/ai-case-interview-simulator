import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-silver/15 flex items-center justify-center px-6 py-10">
      <main className="w-full max-w-xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight text-brand-black md:text-3xl">
              AI Case Interview Simulator
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-2 text-base text-brand-slate/90">
            Create a simulated customer support case, run candidates through it,
            and review performance with structured analytics.
          </CardContent>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/builder" variant="primary" size="lg">
              Open Case Builder
            </ButtonLink>
            <ButtonLink href="/builder" variant="outline" size="lg">
              View demo flow
            </ButtonLink>
          </div>
          <div className="mt-10 border-t border-brand-silver/60 pt-8">
            <p className="text-sm font-medium text-brand-black">
              How it works
            </p>
            <ul className="mt-4 space-y-4 text-left sm:mx-auto sm:max-w-sm">
              <li className="flex items-start gap-3">
                <span className="text-xl" aria-hidden>📋</span>
                <div>
                  <span className="font-medium text-brand-black">Build a case</span>
                  <p className="mt-0.5 text-sm text-brand-slate/80">
                    Define scenario, context, and policies. Tickets are pre-seeded.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl" aria-hidden>▶️</span>
                <div>
                  <span className="font-medium text-brand-black">Run a simulation</span>
                  <p className="mt-0.5 text-sm text-brand-slate/80">
                    Candidate triages, responds, escalates, and summarizes.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl" aria-hidden>📊</span>
                <div>
                  <span className="font-medium text-brand-black">Review analytics</span>
                  <p className="mt-0.5 text-sm text-brand-slate/80">
                    See timing, scores, and session details on the dashboard.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </main>
    </div>
  );
}
