export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          AI Case Interview Simulator
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Prototype for Cornell: create a simulated customer support case,
          walk a candidate through it, and review their performance.
        </p>

        <div className="mt-6 space-y-3 text-sm">
          <a
            href="/builder"
            className="flex items-center justify-between rounded-md border px-4 py-3 hover:bg-gray-50"
          >
            <span className="font-medium text-gray-900">Case Builder</span>
            <span className="text-xs text-gray-500">
              Create or edit the simulation scenario
            </span>
          </a>
          <p className="text-xs text-gray-500">
            Start by seeding the database and visiting the builder to review the
            demo case, then run a simulation and open the dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}
