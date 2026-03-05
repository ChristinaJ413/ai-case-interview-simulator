import React from "react";

/**
 * Input / Textarea — Shared form styling. Export inputClass and labelClass
 * for use in custom forms, or use <Input /> / <Textarea /> with optional label and error.
 */
export const inputClass =
  "w-full rounded-xl border border-brand-silver/70 bg-brand-white px-3 py-2 text-sm text-brand-black placeholder:text-brand-slate/70 focus:ring-2 focus:ring-brand-coral focus:border-brand-coral focus:outline-none hover:border-brand-silver transition-colors";
export const labelClass = "block text-sm font-medium text-brand-black";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const elId = id ?? props.name;
  return (
    <div>
      {label && (
        <label htmlFor={elId} className={labelClass}>
          {label}
        </label>
      )}
      <input
        id={elId}
        className={`mt-1.5 ${inputClass} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-brand-coral">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const elId = id ?? props.name;
  return (
    <div>
      {label && (
        <label htmlFor={elId} className={labelClass}>
          {label}
        </label>
      )}
      <textarea
        id={elId}
        className={`mt-1.5 ${inputClass} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-brand-coral">{error}</p>
      )}
    </div>
  );
}
