"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import type { Case } from "@/lib/types";
import { Button } from "@/components/ui/Button";

type Props = {
  initialCase?: Case | null;
  /** Server action: (formData: FormData) => Promise<void>. Reads name="title", "description", "company_context", "policies", "id" (optional). */
  onSave: (formData: FormData) => Promise<void>;
  /** When true, show brief "Saved" feedback (e.g. after redirect with ?saved=1). */
  saved?: boolean;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-brand-silver bg-brand-white px-3 py-2 text-sm text-brand-black placeholder:opacity-70 focus:ring-2 focus:ring-brand-coral focus:border-brand-coral focus:outline-none";
const labelClass = "block text-sm font-medium text-brand-black";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="md" disabled={pending}>
      {pending ? "Saving..." : "Save Case"}
    </Button>
  );
}

export function CaseBuilder({ initialCase, onSave, saved = false }: Props) {
  return (
    <form action={onSave} className="space-y-6">
      {initialCase?.id && (
        <input type="hidden" name="id" value={initialCase.id} readOnly />
      )}
      <div>
        <label className={labelClass}>Title</label>
        <input
          className={inputClass}
          name="title"
          defaultValue={initialCase?.title ?? ""}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={inputClass}
          name="description"
          rows={3}
          defaultValue={initialCase?.description ?? ""}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Company context</label>
        <textarea
          className={inputClass}
          name="company_context"
          rows={3}
          defaultValue={initialCase?.company_context ?? ""}
        />
      </div>
      <div>
        <label className={labelClass}>Policies</label>
        <textarea
          className={inputClass}
          name="policies"
          rows={3}
          defaultValue={initialCase?.policies ?? ""}
        />
        <p className="mt-1.5 text-xs text-brand-slate">
          Freeform text. In future we can attach structured policy documents and
          AI evaluation.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <SubmitButton />
        {saved && (
          <span className="text-sm font-medium text-brand-coral">Saved.</span>
        )}
      </div>
    </form>
  );
}
