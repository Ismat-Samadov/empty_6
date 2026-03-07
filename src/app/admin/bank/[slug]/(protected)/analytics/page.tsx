import { getSession } from "@/lib/auth";
import { getBankDashboardStats, getBankAnalytics } from "@/db/queries";

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

export default async function BankAnalyticsPage() {
  const session = await getSession();
  if (!session || session.role !== "bank_admin") return null;

  const [stats, analytics] = await Promise.all([
    getBankDashboardStats(session.bankId),
    getBankAnalytics(session.bankId),
  ]);

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const rejectionRate = stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0;

  const maxDaily = Math.max(...analytics.daily.map((d) => d.count), 1);
  const maxBrowser = Math.max(...analytics.browsers.map((b) => b.count), 1);
  const maxLang = Math.max(...analytics.languages.map((l) => l.count), 1);

  const deviceTotal = analytics.devices.reduce((s, d) => s + d.count, 0);
  const deviceMap = Object.fromEntries(analytics.devices.map((d) => [d.deviceType, d.count]));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analitika</h1>
        <p className="mt-1 text-sm text-slate-500">{session.bankName} — ətraflı statistika</p>
      </div>

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Ümumi müraciət", value: stats.total, sub: "bütün vaxt", color: "text-slate-800" },
          { label: "Təsdiq dərəcəsi", value: `${approvalRate}%`, sub: `${stats.approved} təsdiq`, color: "text-emerald-600" },
          { label: "Rədd dərəcəsi", value: `${rejectionRate}%`, sub: `${stats.rejected} rədd`, color: "text-red-500" },
          { label: "Gözlənilir", value: stats.pending, sub: "cavab verilmədi", color: "text-amber-500" },
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

        {/* Status breakdown */}
        <Section title="Status bölgüsü">
          <div className="space-y-4">
            {[
              { label: "Gözlənilir", value: stats.pending, color: "bg-amber-400" },
              { label: "Baxılır", value: stats.reviewing, color: "bg-blue-400" },
              { label: "Təsdiq edildi", value: stats.approved, color: "bg-emerald-400" },
              { label: "Rədd edildi", value: stats.rejected, color: "bg-red-400" },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-medium text-slate-700">
                    {s.value} ({stats.total > 0 ? Math.round((s.value / stats.total) * 100) : 0}%)
                  </span>
                </div>
                <Bar value={s.value} max={stats.total} color={s.color} />
              </div>
            ))}
          </div>
        </Section>

        {/* Device type */}
        <Section title="Cihaz növü">
          <div className="flex items-center justify-center gap-8">
            {[
              { type: "mobile", label: "Mobil", color: "bg-blue-500" },
              { type: "tablet", label: "Tablet", color: "bg-violet-500" },
              { type: "desktop", label: "Masaüstü", color: "bg-slate-400" },
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
                        stroke={d.color.replace("bg-", "").includes("blue") ? "#3b82f6" : d.color.includes("violet") ? "#8b5cf6" : "#94a3b8"}
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

        {/* Browser breakdown */}
        <Section title="Brauzer bölgüsü">
          {analytics.browsers.length === 0 ? (
            <p className="text-sm text-slate-400">Məlumat yoxdur</p>
          ) : (
            <div className="space-y-3">
              {analytics.browsers.map((b) => (
                <div key={b.browser}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">{b.browser}</span>
                    <span className="font-medium text-slate-700">{b.count}</span>
                  </div>
                  <Bar value={b.count} max={maxBrowser} color="bg-indigo-400" />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Language breakdown */}
        <Section title="Dil bölgüsü">
          {analytics.languages.length === 0 ? (
            <p className="text-sm text-slate-400">Məlumat yoxdur</p>
          ) : (
            <div className="space-y-3">
              {analytics.languages.map((l) => (
                <div key={l.language}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-mono text-slate-600">{l.language}</span>
                    <span className="font-medium text-slate-700">
                      {l.count} ({deviceTotal > 0 ? Math.round((l.count / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                  <Bar value={l.count} max={maxLang} color="bg-teal-400" />
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
