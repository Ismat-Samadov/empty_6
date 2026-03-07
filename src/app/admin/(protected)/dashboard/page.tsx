import { getDashboardStats, getRecentApplications, getAllBanks } from "@/db/queries";

function StatCard({
  label,
  value,
  color = "blue",
  icon,
}: {
  label: string;
  value: number;
  color?: "blue" | "amber" | "green" | "slate";
  icon: React.ReactNode;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</div>
      <div className="mt-0.5 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function maskFin(fin: string) {
  return fin.slice(0, 2) + "***" + fin.slice(-1);
}

export default async function DashboardPage() {
  const [stats, recent, allBanks] = await Promise.all([
    getDashboardStats(),
    getRecentApplications(8),
    getAllBanks(),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Platformanın ümumi görünüşü</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Ümumi müraciət"
          value={stats.totalApplications}
          color="slate"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Aktiv bank"
          value={stats.activeBanks}
          color="blue"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          label="Gözlənilir"
          value={stats.pendingApplications}
          color="amber"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <StatCard
          label="Təsdiq edildi"
          value={stats.approvedApplications}
          color="green"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
            </svg>
          }
        />
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
            {recent.map((app) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">{app.phoneNumber}</div>
                  <div className="text-xs text-slate-400">FİN: {maskFin(app.finCode)}</div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(app.createdAt).toLocaleDateString("az-AZ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banks overview */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Banklar</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {allBanks.map((bank) => (
              <div key={bank.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-slate-700">{bank.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    bank.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {bank.isActive ? "Aktiv" : "Deaktiv"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
