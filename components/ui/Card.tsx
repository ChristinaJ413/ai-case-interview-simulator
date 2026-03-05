import React from "react";

type CardVariant = "default" | "subtle";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-brand-white border-brand-silver/60 shadow-soft",
  subtle:
    "bg-brand-white border-brand-silver/60",
};

export function Card({
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export function CardHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-3 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-lg font-semibold text-brand-black ${className}`}
      {...props}
    />
  );
}

export function CardContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-sm md:text-base text-brand-slate ${className}`} {...props} />
  );
}
