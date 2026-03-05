import React from "react";

/**
 * SectionHeader — Section title with optional description and right-aligned actions.
 */
type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function SectionHeader({
  title,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-brand-black">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-brand-slate/80">{description}</p>
        )}
      </div>
      {actions && <div className="mt-2 shrink-0 sm:mt-0">{actions}</div>}
    </div>
  );
}
