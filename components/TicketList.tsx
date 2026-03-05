import React from "react";
import type { Ticket } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  tickets: Ticket[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

const severityClasses = {
  HIGH: "bg-brand-coral text-brand-white",
  MEDIUM: "bg-brand-slate text-brand-white",
  LOW: "bg-brand-silver text-brand-black",
};

export function TicketList({ tickets, selectedId, onSelect }: Props) {
  if (tickets.length === 0) {
    return (
      <Card>
        <p className="text-sm text-brand-slate">No tickets in this case.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
      </CardHeader>
      <ul className="space-y-1">
        {tickets.map((t) => {
          const isSelected = selectedId === t.id;
          const severityClass = severityClasses[t.severity] ?? severityClasses.LOW;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelect?.(t.id)}
                className={`flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors hover:bg-brand-silver/20 ${
                  isSelected
                    ? "border-brand-coral bg-brand-silver/20"
                    : "border-brand-silver/40 bg-transparent"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-brand-black">{t.subject}</div>
                  <div className="mt-0.5 text-xs text-brand-slate">
                    {t.channel} • {t.customer_tier} • SLA {t.sla_hours}h
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase ${severityClass}`}
                >
                  {t.severity}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
