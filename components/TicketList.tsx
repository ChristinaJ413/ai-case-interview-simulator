import React from "react";
import type { Ticket } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/**
 * TicketList — Scrollable list of tickets for the current case.
 * Each row shows subject, channel/tier/SLA as muted badges, and severity (coral/slate/silver).
 * Selected ticket gets a left border accent and light background.
 */
type Props = {
  tickets: Ticket[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

const severityVariant = {
  HIGH: "high" as const,
  MEDIUM: "medium" as const,
  LOW: "low" as const,
};

export function TicketList({ tickets, selectedId, onSelect }: Props) {
  if (tickets.length === 0) {
    return (
      <Card>
        <p className="text-sm text-brand-slate/80">No tickets in this case.</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base">Tickets</CardTitle>
      </CardHeader>
      <ul className="flex flex-1 flex-col gap-1 overflow-auto">
        {tickets.map((t) => {
          const isSelected = selectedId === t.id;
          return (
            <li key={t.id}>
              <button
                aria-pressed={isSelected}
                type="button"
                onClick={() => onSelect?.(t.id)}
                className={`relative flex w-full flex-col gap-1.5 rounded-xl border-l-4 px-3 py-2.5 text-left transition-colors hover:bg-brand-silver/20 ${
                  isSelected
                    ? "border-l-brand-coral bg-brand-coral/5 border border-brand-coral/40"
                    : "border-l-transparent border border-transparent bg-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 font-medium text-brand-black">
                    {t.subject}
                  </span>
                  <Badge variant={severityVariant[t.severity] ?? "low"}>
                    {t.severity}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="muted">{t.channel}</Badge>
                  <Badge variant="muted">{t.customer_tier}</Badge>
                  <Badge variant="muted">SLA {t.sla_hours}h</Badge>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
