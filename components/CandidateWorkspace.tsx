"use client";

import React from "react";
import type { CandidateSession, Case, Ticket } from "@/lib/types";
import { TicketList } from "./TicketList";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { inputClass, labelClass } from "@/components/ui/Input";

/** Steps shown in the stepper; lastChangeStep tracks which the user last interacted with */
type Step = "triage" | "respond" | "escalate" | "summarize" | "workspace";

const STEPS: { id: Step; label: string }[] = [
  { id: "triage", label: "Triage" },
  { id: "respond", label: "Respond" },
  { id: "escalate", label: "Escalate" },
  { id: "summarize", label: "Summarize" },
];

type Props = {
  sessionId: string;
  caseData: Case & { tickets: Ticket[] };
  session: CandidateSession;
};

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Persist session state and optionally append an event to the event_log */
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

/**
 * CandidateWorkspace — Main simulation UI: tickets list, prioritization, escalations,
 * ticket detail + response editor, and internal summary. Saves via PUT /api/sessions/:id.
 * Sticky bottom bar: Save progress (outline) + Finish & view dashboard (primary).
 */
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
  const [lastChangeStep, setLastChangeStep] = React.useState<Step>("workspace");
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);

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
      setLastSavedAt(new Date()); // Show "Last saved HH:MM" in the bar
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
      window.location.href = `/dashboard/${sessionId}`; // Full nav so server sees updated session
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Finish failed");
      setFinishing(false);
    }
  }

  return (
    <>
      {/* Stepper: shows which step the user last touched (active = coral) */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STEPS.map((step) => (
          <Badge
            key={step.id}
            variant={
              lastChangeStep === step.id ? "stepper-active" : "stepper-inactive"
            }
          >
            {step.label}
          </Badge>
        ))}
      </div>

      {/* Three columns: tickets | prioritization + escalations | detail + editors */}
      <div className="grid gap-4 pb-28 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,2fr)] md:pb-4">
        <div className="flex max-h-[420px] flex-col md:max-h-none">
          <TicketList
            tickets={caseData.tickets}
            selectedId={selectedTicketId}
            onSelect={setSelectedTicketId}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Card variant="subtle" className="flex flex-col">
            <h3 className="text-base font-semibold text-brand-black">
              Prioritization
            </h3>
            <p className="mt-1 text-xs text-brand-slate/80">
              Add to priority list (top = most urgent).
            </p>
            <ul className="mt-3 space-y-1">
              {caseData.tickets.map((t) => {
                const inList = priorityRanking.includes(t.id);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => togglePriority(t.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-brand-silver/20 ${
                        inList ? "bg-brand-silver/20 text-brand-black" : "text-brand-slate/80"
                      }`}
                    >
                      <span className="truncate">{t.subject}</span>
                      {inList && (
                        <Badge variant="medium" className="shrink-0 text-[10px]">
                          In list
                        </Badge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card variant="subtle" className="flex flex-col">
            <h3 className="text-base font-semibold text-brand-black">
              Escalations
            </h3>
            <p className="mt-1 text-xs text-brand-slate/80">
              Mark tickets to escalate.
            </p>
            <ul className="mt-3 space-y-1">
              {caseData.tickets.map((t) => {
                const isEscalated = escalations.includes(t.id);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => toggleEscalation(t.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-brand-silver/20 ${
                        isEscalated ? "bg-brand-coral/10 text-brand-black" : "text-brand-slate/80"
                      }`}
                    >
                      <span className="truncate">{t.subject}</span>
                      {isEscalated && (
                        <Badge variant="high" className="shrink-0 text-[10px]">
                          Escalate
                        </Badge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            {currentTicket ? (
              <>
                <h2 className="text-lg font-semibold text-brand-black">
                  {currentTicket.subject}
                </h2>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="muted">{currentTicket.channel}</Badge>
                  <Badge variant="muted">{currentTicket.customer_tier}</Badge>
                  <Badge variant="muted">SLA {currentTicket.sla_hours}h</Badge>
                  <Badge
                    variant={
                      currentTicket.severity === "HIGH"
                        ? "high"
                        : currentTicket.severity === "MEDIUM"
                          ? "medium"
                          : "low"
                    }
                  >
                    {currentTicket.severity}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-brand-black leading-relaxed">
                  {currentTicket.body}
                </p>
                <div className="mt-4">
                  <label className={labelClass}>
                    Draft response to customer
                  </label>
                  <textarea
                    className={`mt-1.5 min-h-[180px] ${inputClass}`}
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
              <p className="text-sm text-brand-slate/80">
                Select a ticket to view details and respond.
              </p>
            )}
          </Card>

          <Card>
            <label className={labelClass}>Internal summary</label>
            <textarea
              className={`mt-1.5 min-h-[120px] ${inputClass}`}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setLastChangeStep("summarize");
              }}
            />
            <p className="mt-1.5 text-xs text-brand-slate/80">
              How would you summarize this situation for a handoff?
            </p>
          </Card>
        </div>
      </div>

      {/* Sticky action bar on mobile; inline on desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-brand-silver/60 bg-white/95 px-4 py-3 backdrop-blur sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleSaveProgress}
              disabled={saving || finishing}
              variant="outline"
              size="md"
            >
              {saving ? "Saving..." : "Save progress"}
            </Button>
            {lastSavedAt && (
              <span className="text-xs text-brand-slate/80">
                Last saved {lastSavedAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <Button
            type="button"
            onClick={handleFinish}
            disabled={saving || finishing}
            variant="primary"
            size="md"
          >
            {finishing ? "Finishing..." : "Finish & view dashboard"}
          </Button>
          {saveError && (
            <span className="w-full text-sm text-brand-coral sm:w-auto">
              {saveError}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
