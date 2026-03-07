import { getSession } from "@/lib/auth";
import { getBankDashboardStats, getBankApplications } from "@/db/queries";
import { StatusBadge } from "@/components/admin/StatusBadge";

function StatCard({
  label,
  value,
  color = "slate",
}: {
  label: string;
  value: number;
  color?: "slate" | "amber" | "green" | "red" | "blue";
}) {
  const colors = {
    slate: "bg-slate-50 text-slate-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className={`mb-2 text-2xl font-bold ${colors[color].split(" ")[1]}`}>
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

export default async function BankDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "bank_admin") return null;

  const [stats, recent] = await Promise.all([
    getBankDashboardStats(session.bankId),
    getBankApplications(session.bankId, 8),
  ]);

  const approvalRate =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">{session.bankName} — ümumi görünüş</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Ümumi müraciət" value={stats.total} color="slate" />
        <StatCard label="Gözlənilir" value={stats.pending} color="amber" />
        <StatCard label="Təsdiq edildi" value={stats.approved} color="green" />
        <StatCard label="Rədd edildi" value={stats.rejected} color="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent applications */}
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Son müraciətlər</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {recent.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">Müraciət yoxdur</p>
            )}
            {recent.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">{entry.phoneNumber}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(entry.appliedAt).toLocaleDateString("az-AZ")}
                  </div>
                </div>
                <StatusBadge status={entry.status as "gozlemede" | "baxilir" | "tesdiq_edildi" | "red_edildi"} />
              </div>
            ))}
          </div>
        </div>

        {/* Analytics card */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Analitika</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Gözlənilir</span>
                <span>{stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-amber-400 transition-all"
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Baxılır</span>
                <span>{stats.total > 0 ? Math.round((stats.reviewing / stats.total) * 100) : 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-400 transition-all"
                  style={{ width: `${stats.total > 0 ? (stats.reviewing / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Təsdiq edildi</span>
                <span>{approvalRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${approvalRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Rədd edildi</span>
                <span>{stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-red-400 transition-all"
                  style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
