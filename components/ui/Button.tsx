import React from "react";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-coral text-brand-white hover:bg-brand-coral/90 focus-visible:ring-brand-coral",
  secondary:
    "bg-brand-slate text-brand-white hover:bg-brand-slate/90 focus-visible:ring-brand-coral",
  outline:
    "border border-brand-slate text-brand-slate bg-brand-white hover:bg-brand-silver/20 focus-visible:ring-brand-coral",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: false;
};

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: false;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center font-medium rounded-xl border focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variant === "outline" ? "" : "border-transparent"} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...props
}: AnchorProps & { href: string }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center font-medium rounded-xl border border-transparent focus-visible:ring-2 focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
