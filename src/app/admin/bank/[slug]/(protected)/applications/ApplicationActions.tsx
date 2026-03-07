"use client";

import { useState, useTransition } from "react";
import { updateApplicationStatusAction } from "@/lib/actions/applications";

type Status = "gozlemede" | "baxilir" | "tesdiq_edildi" | "red_edildi";

const STATUS_BUTTONS: { status: Status; label: string; className: string }[] = [
  { status: "baxilir", label: "Baxılır", className: "border-blue-200 text-blue-700 hover:bg-blue-50" },
  { status: "tesdiq_edildi", label: "Təsdiq et", className: "border-emerald-200 text-emerald-700 hover:bg-emerald-50" },
  { status: "red_edildi", label: "Rədd et", className: "border-red-200 text-red-700 hover:bg-red-50" },
];

export function ApplicationActions({
  applicationBankId,
  currentStatus,
  currentNotes,
}: {
  applicationBankId: string;
  currentStatus: Status;
  currentNotes: string;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(currentNotes);
  const [pending, startTransition] = useTransition();

  const updateStatus = (status: Status) => {
    startTransition(async () => {
      await updateApplicationStatusAction(applicationBankId, status, notes);
      setOpen(false);
    });
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
      >
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Yenilə
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <p className="mb-2 text-xs font-medium text-slate-600">Status seçin:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {STATUS_BUTTONS.map(({ status, label, className }) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={pending || currentStatus === status}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition disabled:opacity-40 ${className}`}
              >
                {label}
              </button>
            ))}
            {currentStatus !== "gozlemede" && (
              <button
                onClick={() => updateStatus("gozlemede")}
                disabled={pending}
                className="rounded-lg border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-40"
              >
                Geri al
              </button>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Qeyd əlavə edin..."
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
          />
          <div className="mt-2 flex justify-between">
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Ləğv et
            </button>
            {pending && <span className="text-xs text-slate-400">Saxlanılır...</span>}
          </div>
        </div>
      )}
    </div>
  );
}
