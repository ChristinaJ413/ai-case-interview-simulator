import React from "react";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-coral text-brand-white hover:bg-brand-coral/90 focus-visible:ring-brand-coral",
  secondary:
    "bg-brand-slate text-brand-white hover:bg-brand-slate/90 focus-visible:ring-brand-coral",
  outline:
    "border border-brand-slate text-brand-slate bg-brand-white hover:bg-brand-silver/20 focus-visible:ring-brand-coral",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-base gap-2",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  href: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center font-medium rounded-xl border focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variant === "outline" ? "" : "border-transparent"} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  iconLeft,
  iconRight,
  ...props
}: AnchorProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center font-medium rounded-xl border focus-visible:ring-2 focus-visible:ring-offset-2 hover:opacity-92 ${variant === "outline" ? "" : "border-transparent"} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </a>
  );
}
