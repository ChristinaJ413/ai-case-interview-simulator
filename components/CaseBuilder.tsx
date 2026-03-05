"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import type { Case } from "@/lib/types";

type Props = {
  initialCase?: Case | null;
  /** Server action: (formData: FormData) => Promise<void>. Reads name="title", "description", "company_context", "policies", "id" (optional). */
  onSave: (formData: FormData) => Promise<void>;
  /** When true, show brief "Saved" feedback (e.g. after redirect with ?saved=1). */
  saved?: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save Case"}
    </button>
  );
}

// Form that submits to the passed server action. Uses defaultValue so seeded data appears and can be edited.
export function CaseBuilder({ initialCase, onSave, saved = false }: Props) {
  return (
    <form
      action={onSave}
      className="space-y-4 rounded-lg border bg-white p-4 shadow-sm"
    >
      {initialCase?.id && (
        <input type="hidden" name="id" value={initialCase.id} readOnly />
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          name="title"
          defaultValue={initialCase?.title ?? ""}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          name="description"
          rows={3}
          defaultValue={initialCase?.description ?? ""}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company context
        </label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          name="company_context"
          rows={3}
          defaultValue={initialCase?.company_context ?? ""}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Policies
        </label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          name="policies"
          rows={3}
          defaultValue={initialCase?.policies ?? ""}
        />
        <p className="mt-1 text-xs text-gray-500">
          Freeform text. In future we can attach structured policy documents and
          AI evaluation.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton />
        {saved && (
          <span className="text-sm text-green-600">Saved.</span>
        )}
      </div>
    </form>
  );
}
