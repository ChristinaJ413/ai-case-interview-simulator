"use client";

import React from "react";
import type { CandidateSession, Case, Ticket } from "@/lib/types";
import { TicketList } from "./TicketList";

type Step = "triage" | "respond" | "escalate" | "summarize" | "workspace";

type Props = {
  sessionId: string;
  caseData: Case & { tickets: Ticket[] };
  session: CandidateSession;
};

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// Persist progress via PUT and optionally append one event (progress_saved or session_finished).
async function saveSession(
  sessionId: string,
  payload: {
    priority_ranking: string[];
    escalations: string[];
    responses: Record<string, string>;
    internal_summary: string;
    end_time?: string;
    event?: { event_type: string; metadata: Record<string, unknown> };
  },
) {
  const res = await fetch(`/api/sessions/${sessionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save session");
  return res.json();
}

// Minimal, single-page candidate workspace. Persists to PUT /api/sessions/[sessionId].
// Events logged on "Save progress" only (no keystroke spam).
export function CandidateWorkspace({
  sessionId,
  caseData,
  session,
}: Props) {
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(
    caseData.tickets[0]?.id ?? null,
  );
  const [responses, setResponses] = React.useState<Record<string, string>>(
    (session.responses as Record<string, string>) ?? {},
  );
  const [priorityRanking, setPriorityRanking] = React.useState<string[]>(
    (session.priority_ranking as string[]) ?? [],
  );
  const [escalations, setEscalations] = React.useState<string[]>(
    (session.escalations as string[]) ?? [],
  );
  const [summary, setSummary] = React.useState(session.internal_summary ?? "");
  const [saving, setSaving] = React.useState(false);
  const [finishing, setFinishing] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  // Track last change type for progress_saved event step (meaningful analytics).
  const [lastChangeStep, setLastChangeStep] = React.useState<Step>("workspace");

  const currentTicket = caseData.tickets.find((t) => t.id === selectedTicketId);

  function toggleEscalation(ticketId: string) {
    setEscalations((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId],
    );
    setLastChangeStep("escalate");
  }

  function togglePriority(ticketId: string) {
    setPriorityRanking((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId],
    );
    setLastChangeStep("triage");
  }

  function getTotalWordCount(): number {
    const responseWords = Object.values(responses).reduce(
      (n, t) => n + wordCount(t),
      0,
    );
    return responseWords + wordCount(summary);
  }

  async function handleSaveProgress() {
    setSaving(true);
    setSaveError(null);
    try {
      await saveSession(sessionId, {
        priority_ranking: priorityRanking,
        escalations,
        responses,
        internal_summary: summary,
        event: {
          event_type: "progress_saved",
          metadata: {
            step: lastChangeStep,
            wordCount: getTotalWordCount(),
          },
        },
      });
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleFinish() {
    setFinishing(true);
    setSaveError(null);
    try {
      await saveSession(sessionId, {
        priority_ranking: priorityRanking,
        escalations,
        responses,
        internal_summary: summary,
        end_time: new Date().toISOString(),
        event: {
          event_type: "session_finished",
          metadata: {},
        },
      });
      window.location.href = `/dashboard/${sessionId}`;
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Finish failed");
      setFinishing(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-4">
        <TicketList
          tickets={caseData.tickets}
          selectedId={selectedTicketId}
          onSelect={setSelectedTicketId}
        />

        <div className="rounded-lg border bg-white p-3 text-sm">
          <h3 className="text-sm font-semibold text-gray-800">
            Prioritization
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Click to add/remove from your priority list (top = most urgent).
          </p>
          <ul className="mt-2 space-y-1">
            {caseData.tickets.map((t) => {
              const inList = priorityRanking.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => togglePriority(t.id)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs hover:bg-gray-50 ${
                      inList ? "bg-gray-100" : ""
                    }`}
                  >
                    <span>{t.subject}</span>
                    {inList && (
                      <span className="rounded bg-black px-1.5 py-0.5 text-[10px] font-medium text-white">
                        In list
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-lg border bg-white p-3 text-sm">
          <h3 className="text-sm font-semibold text-gray-800">Escalations</h3>
          <p className="mt-1 text-xs text-gray-500">
            Mark which tickets you would escalate to engineering/leadership.
          </p>
          <ul className="mt-2 space-y-1">
            {caseData.tickets.map((t) => {
              const isEscalated = escalations.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggleEscalation(t.id)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs hover:bg-gray-50 ${
                      isEscalated ? "bg-red-50" : ""
                    }`}
                  >
                    <span>{t.subject}</span>
                    {isEscalated && (
                      <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Escalate
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border bg-white p-4 text-sm">
          {currentTicket ? (
            <>
              <h2 className="text-base font-semibold text-gray-900">
                {currentTicket.subject}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {currentTicket.channel} • {currentTicket.customer_tier} • SLA{" "}
                {currentTicket.sla_hours}h • {currentTicket.severity} severity
              </p>
              <p className="mt-3 text-sm text-gray-800">{currentTicket.body}</p>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700">
                  Draft response to customer
                </label>
                <textarea
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  rows={6}
                  value={responses[currentTicket.id] ?? ""}
                  onChange={(e) => {
                    setResponses((prev) => ({
                      ...prev,
                      [currentTicket.id]: e.target.value,
                    }));
                    setLastChangeStep("respond");
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Select a ticket to view details and respond.
            </p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 text-sm">
          <label className="block text-xs font-medium text-gray-700">
            Internal summary
          </label>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            rows={4}
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setLastChangeStep("summarize");
            }}
          />
          <p className="mt-1 text-xs text-gray-500">
            How would you summarize this situation for a handoff?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveProgress}
            disabled={saving || finishing}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save progress"}
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={saving || finishing}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {finishing ? "Finishing..." : "Finish & view dashboard"}
          </button>
          {saveError && (
            <span className="text-sm text-red-600">{saveError}</span>
          )}
        </div>
      </div>
    </div>
  );
}
