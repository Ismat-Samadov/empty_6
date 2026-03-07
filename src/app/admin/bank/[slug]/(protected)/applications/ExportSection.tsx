"use client";

import { useState } from "react";

const STATUSES = [
  { value: "gozlemede", label: "Gözlənilir" },
  { value: "baxilir", label: "Baxılır" },
  { value: "tesdiq_edildi", label: "Təsdiq edildi" },
  { value: "red_edildi", label: "Rədd edildi" },
];

const INPUT =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export function ExportSection({ bankSlug }: { bankSlug: string }) {
  const [open, setOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleStatus(value: string) {
    setSelectedStatuses((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  async function handleExport() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ slug: bankSlug });
      params.set("status", selectedStatuses.length > 0 ? selectedStatuses.join(",") : "all");
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/admin/export?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? "Xəta baş verdi");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? `${bankSlug}-export.xlsx`;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        XLSX ixracı
      </button>

      {open && (
        <div className="absolute right-6 top-16 z-20 w-96 rounded-xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Məlumat ixracı</h3>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Status filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-600">
                Status filtri <span className="text-slate-400">(seçilməzsə hamısı)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => {
                  const active = selectedStatuses.includes(s.value);
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleStatus(s.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        active
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {active && "✓ "}{s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Başlanğıc</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Son tarix</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={INPUT} />
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Hazırlanır...
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  XLSX olaraq yüklə
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
