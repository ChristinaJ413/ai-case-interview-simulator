import React from "react";
import type { Ticket } from "@/lib/types";

type Props = {
  tickets: Ticket[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export function TicketList({ tickets, selectedId, onSelect }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
        No tickets in this case.
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border bg-white p-3">
      <h2 className="text-sm font-semibold text-gray-800">Tickets</h2>
      <ul className="space-y-1 text-sm">
        {tickets.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onSelect?.(t.id)}
              className={`flex w-full items-start justify-between rounded-md px-2 py-1 text-left hover:bg-gray-50 ${
                selectedId === t.id ? "bg-gray-100" : ""
              }`}
            >
              <div>
                <div className="font-medium">{t.subject}</div>
                <div className="text-xs text-gray-500">
                  {t.channel} • {t.customer_tier} • SLA {t.sla_hours}h
                </div>
              </div>
              <span className="text-xs uppercase text-gray-500">
                {t.severity}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

