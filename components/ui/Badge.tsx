import React from "react";

/**
 * Badge — Small pill for severity (high/medium/low), metadata (muted),
 * or stepper state (stepper-active = coral, stepper-inactive = slate).
 */
type BadgeVariant =
  | "high"
  | "medium"
  | "low"
  | "muted"
  | "stepper-active"
  | "stepper-inactive";

const variantClasses: Record<BadgeVariant, string> = {
  high: "bg-brand-coral text-brand-white",
  medium: "bg-brand-slate text-brand-white",
  low: "bg-brand-silver text-brand-black",
  muted:
    "bg-brand-silver/30 text-brand-slate border border-brand-silver/60",
  "stepper-active":
    "bg-brand-coral/15 text-brand-coral border border-brand-coral/40",
  "stepper-inactive":
    "bg-brand-white text-brand-slate border border-brand-silver/60",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  variant = "muted",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
