"use client";

import React from "react";
import type { CandidateSession, Case, Ticket } from "@/lib/types";
import { TicketList } from "./TicketList";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

const inputClass =
  "mt-2 w-full rounded-xl border border-brand-silver bg-brand-white px-3 py-2 text-sm text-brand-black placeholder:opacity-70 focus:ring-2 focus:ring-brand-coral focus:border-brand-coral focus:outline-none";

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
    <>
      {/* Stepper: Triage → Respond → Escalate → Summarize */}
      <div className="mb-4 flex flex-wrap items-center gap-1 text-sm">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <span
              className={
                lastChangeStep === step.id
                  ? "font-semibold text-brand-coral"
                  : "text-brand-slate"
              }
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="text-brand-silver px-0.5">→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-4 pb-24 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:pb-4">
        <div className="space-y-4">
          <TicketList
            tickets={caseData.tickets}
            selectedId={selectedTicketId}
            onSelect={setSelectedTicketId}
          />

          <Card>
            <h3 className="text-sm font-semibold text-brand-black">
              Prioritization
            </h3>
            <p className="mt-1 text-xs text-brand-slate">
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
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-brand-silver/20 ${
                        inList ? "bg-brand-silver/20 text-brand-black" : "text-brand-slate"
                      }`}
                    >
                      <span className="truncate">{t.subject}</span>
                      {inList && (
                        <span className="shrink-0 rounded bg-brand-slate px-1.5 py-0.5 text-[10px] font-medium text-white">
                          In list
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-brand-black">
              Escalations
            </h3>
            <p className="mt-1 text-xs text-brand-slate">
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
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-brand-silver/20 ${
                        isEscalated ? "bg-brand-coral/10 text-brand-black" : "text-brand-slate"
                      }`}
                    >
                      <span className="truncate">{t.subject}</span>
                      {isEscalated && (
                        <span className="shrink-0 rounded bg-brand-coral px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Escalate
                        </span>
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
                <h2 className="text-base font-semibold text-brand-black">
                  {currentTicket.subject}
                </h2>
                <p className="mt-1 text-xs text-brand-slate">
                  {currentTicket.channel} • {currentTicket.customer_tier} • SLA{" "}
                  {currentTicket.sla_hours}h • {currentTicket.severity} severity
                </p>
                <p className="mt-3 text-sm text-brand-black leading-relaxed">
                  {currentTicket.body}
                </p>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-brand-black">
                    Draft response to customer
                  </label>
                  <textarea
                    className={inputClass}
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
              <p className="text-sm text-brand-slate">
                Select a ticket to view details and respond.
              </p>
            )}
          </Card>

          <Card>
            <label className="block text-xs font-medium text-brand-black">
              Internal summary
            </label>
            <textarea
              className={inputClass}
              rows={4}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setLastChangeStep("summarize");
              }}
            />
            <p className="mt-1.5 text-xs text-brand-slate">
              How would you summarize this situation for a handoff?
            </p>
          </Card>
        </div>
      </div>

      {/* Sticky bottom bar: Save progress + Finish */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-brand-silver/60 bg-white/90 px-4 py-3 backdrop-blur sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-0 sm:mt-4 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleSaveProgress}
            disabled={saving || finishing}
            variant="outline"
            size="md"
          >
            {saving ? "Saving..." : "Save progress"}
          </Button>
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
            <span className="text-sm text-brand-coral">{saveError}</span>
          )}
        </div>
      </div>
    </>
  );
}
