import React from "react";

type AppShellProps = {
  title: string;
  subtitle?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
};

export function AppShell({
  title,
  subtitle,
  breadcrumb,
  actions,
  toolbar,
  children,
  fullWidth = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-brand-silver/15">
      <div
        className={`mx-auto max-w-6xl px-6 py-8 md:py-10 ${fullWidth ? "" : ""}`}
      >
        <header className="border-b border-brand-silver/60 pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {breadcrumb && (
                <div className="mb-1 text-sm text-brand-slate/80">
                  {breadcrumb}
                </div>
              )}
              <h1 className="text-2xl font-semibold tracking-tight text-brand-black md:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-brand-slate md:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {actions}
              </div>
            )}
          </div>
          {toolbar && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {toolbar}
            </div>
          )}
        </header>
        <main className="pt-6">{children}</main>
      </div>
    </div>
  );
}
