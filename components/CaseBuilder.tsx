"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import type { Case } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/Input";

/**
 * CaseBuilder — Form for editing case metadata (title, description, context, policies).
 * Submits to a Next.js server action. Uses hidden "id" when editing an existing case
 * so the server can update instead of create.
 */
type Props = {
  initialCase?: Case | null;
  onSave: (formData: FormData) => Promise<void>;
  saved?: boolean;
};

/** Shows pending state while the form is submitting (no JS needed for the action). */
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
    <form action={onSave} className="space-y-8">
      {/* Server uses "id" to decide update vs create */}
      {initialCase?.id && (
        <input type="hidden" name="id" value={initialCase.id} readOnly />
      )}

      {/* Section 1: Core scenario for the candidate */}
      <section>
        <h2 className="text-lg font-semibold text-brand-black">Scenario</h2>
        <p className="mt-0.5 text-sm text-brand-slate/80">
          Core case title and description for the candidate.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={`mt-1.5 ${inputClass}`}
              name="title"
              defaultValue={initialCase?.title ?? ""}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`mt-1.5 ${inputClass}`}
              name="description"
              rows={3}
              defaultValue={initialCase?.description ?? ""}
              required
            />
          </div>
        </div>
      </section>

      {/* Section 2: Company background */}
      <section>
        <h2 className="text-lg font-semibold text-brand-black">
          Company context
        </h2>
        <p className="mt-0.5 text-sm text-brand-slate/80">
          Background the candidate should consider.
        </p>
        <div className="mt-4">
          <label className={labelClass}>Context</label>
          <textarea
            className={`mt-1.5 ${inputClass}`}
            name="company_context"
            rows={3}
            defaultValue={initialCase?.company_context ?? ""}
          />
        </div>
      </section>

      {/* Section 3: Policy text */}
      <section>
        <h2 className="text-lg font-semibold text-brand-black">Policies</h2>
        <p className="mt-0.5 text-sm text-brand-slate/80">
          Guidelines and policies for handling the case.
        </p>
        <div className="mt-4">
          <label className={labelClass}>Policy text</label>
          <textarea
            className={`mt-1.5 ${inputClass}`}
            name="policies"
            rows={4}
            defaultValue={initialCase?.policies ?? ""}
          />
        </div>
      </section>

      {/* Footer: save button + brief "Saved" feedback after redirect */}
      <div className="flex flex-wrap items-center gap-3 border-t border-brand-silver/60 pt-6">
        <SubmitButton />
        {saved && (
          <span className="text-sm font-medium text-brand-coral">Saved</span>
        )}
      </div>
    </form>
  );
}
