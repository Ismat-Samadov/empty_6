import { getDashboardStats, getPlatformAnalytics } from "@/db/queries";

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default async function PlatformAnalyticsPage() {
  const [stats, analytics] = await Promise.all([
    getDashboardStats(),
    getPlatformAnalytics(),
  ]);

  const totalApproved = analytics.banks.reduce((s, b) => s + b.approved, 0);
  const totalRejected = analytics.banks.reduce((s, b) => s + b.rejected, 0);
  const platformApprovalRate =
    stats.totalApplications > 0
      ? Math.round((totalApproved / analytics.banks.reduce((s, b) => s + b.total, 0)) * 100)
      : 0;

  const maxDaily = Math.max(...analytics.daily.map((d) => d.count), 1);
  const maxBankTotal = Math.max(...analytics.banks.map((b) => b.total), 1);

  const deviceTotal = analytics.devices.reduce((s, d) => s + d.count, 0);
  const deviceMap = Object.fromEntries(analytics.devices.map((d) => [d.deviceType, d.count]));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analitika</h1>
        <p className="mt-1 text-sm text-slate-500">Platform üzrə ətraflı statistika</p>
      </div>

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Ümumi müraciət", value: stats.totalApplications, sub: "bütün vaxt", color: "text-slate-800" },
          { label: "Aktiv bank", value: stats.activeBanks, sub: "banklar qeydiyyatda", color: "text-blue-600" },
          { label: "Təsdiq dərəcəsi", value: `${platformApprovalRate}%`, sub: `${totalApproved} təsdiq`, color: "text-emerald-600" },
          { label: "Gözlənilir", value: stats.pendingApplications, sub: "cavabsız müraciət", color: "text-amber-500" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="mt-0.5 text-sm font-medium text-slate-700">{k.label}</div>
            <div className="text-xs text-slate-400">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily applications — last 30 days */}
        <Section title="Son 30 gün — müraciət dinamikası">
          {analytics.daily.length === 0 ? (
            <p className="text-sm text-slate-400">Məlumat yoxdur</p>
          ) : (
            <div className="space-y-1.5">
              {analytics.daily.map((d) => (
                <div key={d.date} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-right text-xs text-slate-400">{d.date}</span>
                  <div className="flex-1">
                    <Bar value={d.count} max={maxDaily} color="bg-blue-400" />
                  </div>
                  <span className="w-6 text-right text-xs font-medium text-slate-600">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Device breakdown */}
        <Section title="Cihaz növü">
          <div className="flex items-center justify-center gap-8">
            {[
              { type: "mobile", label: "Mobil", strokeColor: "#3b82f6" },
              { type: "tablet", label: "Tablet", strokeColor: "#8b5cf6" },
              { type: "desktop", label: "Masaüstü", strokeColor: "#94a3b8" },
            ].map((d) => {
              const val = deviceMap[d.type] ?? 0;
              const pct = deviceTotal > 0 ? Math.round((val / deviceTotal) * 100) : 0;
              return (
                <div key={d.type} className="flex flex-col items-center gap-1">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <svg className="absolute inset-0" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={d.strokeColor}
                        strokeWidth="3"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset="25"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="relative text-xs font-bold text-slate-700">{pct}%</span>
                  </div>
                  <span className="text-xs text-slate-500">{d.label}</span>
                  <span className="text-xs font-medium text-slate-700">{val}</span>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Per-bank performance — full width */}
        <div className="lg:col-span-2">
          <Section title="Bank performansı (müraciət sayına görə)">
            {analytics.banks.length === 0 ? (
              <p className="text-sm text-slate-400">Məlumat yoxdur</p>
            ) : (
              <div className="space-y-4">
                {analytics.banks.map((b) => {
                  const approvalRate = b.total > 0 ? Math.round((b.approved / b.total) * 100) : 0;
                  const rejectionRate = b.total > 0 ? Math.round((b.rejected / b.total) * 100) : 0;
                  return (
                    <div key={b.bankId} className="rounded-lg border border-slate-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{b.bankName}</span>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="text-emerald-600 font-medium">+{b.approved} təsdiq</span>
                          <span className="text-red-500 font-medium">-{b.rejected} rədd</span>
                          <span className="text-amber-500 font-medium">{b.pending} gözlənilir</span>
                          <span className="font-semibold text-slate-700">{b.total} cəmi</span>
                        </div>
                      </div>
                      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-emerald-400 transition-all"
                          style={{ width: `${approvalRate}%` }}
                          title={`Təsdiq: ${approvalRate}%`}
                        />
                        <div
                          className="h-full bg-blue-300 transition-all"
                          style={{ width: `${b.total > 0 ? Math.round((b.pending / b.total) * 100) : 0}%` }}
                          title={`Gözlənilir`}
                        />
                        <div
                          className="h-full bg-red-400 transition-all"
                          style={{ width: `${rejectionRate}%` }}
                          title={`Rədd: ${rejectionRate}%`}
                        />
                      </div>
                      <div className="mt-1 flex gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />Təsdiq {approvalRate}%</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-300 inline-block" />Gözlənilir</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400 inline-block" />Rədd {rejectionRate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>

        {/* Top banks by volume */}
        <Section title="Ən çox müraciət alan banklar">
          <div className="space-y-3">
            {analytics.banks.slice(0, 10).map((b, i) => (
              <div key={b.bankId}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-600">
                    <span className="mr-1.5 font-bold text-slate-400">#{i + 1}</span>
                    {b.bankName}
                  </span>
                  <span className="font-medium text-slate-700">{b.total}</span>
                </div>
                <Bar value={b.total} max={maxBankTotal} color="bg-blue-400" />
              </div>
            ))}
          </div>
        </Section>

        {/* Top banks by approval rate */}
        <Section title="Ən yüksək təsdiq dərəcəsi">
          <div className="space-y-3">
            {[...analytics.banks]
              .filter((b) => b.total >= 1)
              .sort((a, b) => b.approved / b.total - a.approved / a.total)
              .slice(0, 10)
              .map((b, i) => {
                const rate = Math.round((b.approved / b.total) * 100);
                return (
                  <div key={b.bankId}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-600">
                        <span className="mr-1.5 font-bold text-slate-400">#{i + 1}</span>
                        {b.bankName}
                      </span>
                      <span className="font-medium text-emerald-600">{rate}%</span>
                    </div>
                    <Bar value={rate} max={100} color="bg-emerald-400" />
                  </div>
                );
              })}
          </div>
        </Section>
      </div>
    </div>
  );
}
