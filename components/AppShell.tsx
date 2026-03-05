import React from "react";

type AppShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** Optional: no max-width container (e.g. for run page with sticky bar) */
  fullWidth?: boolean;
};

export function AppShell({
  title,
  subtitle,
  actions,
  children,
  fullWidth = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-brand-white">
      <div
        className={`mx-auto ${fullWidth ? "max-w-6xl" : "max-w-6xl"} px-4 py-6 sm:py-8`}
      >
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-brand-black">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-brand-slate">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
