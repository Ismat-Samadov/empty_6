import { getSession } from "@/lib/auth";
import { getBankApplications } from "@/db/queries";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ApplicationActions } from "./ApplicationActions";

export default async function BankApplicationsPage() {
  const session = await getSession();
  if (!session || session.role !== "bank_admin") return null;

  const applications = await getBankApplications(session.bankId, 100);

  const counts = applications.reduce(
    (acc, a) => {
      acc[a.status as keyof typeof acc]++;
      return acc;
    },
    { gozlemede: 0, baxilir: 0, tesdiq_edildi: 0, red_edildi: 0 }
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Müraciətlər</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { label: "Gözlənilir", count: counts.gozlemede, color: "bg-amber-50 text-amber-700" },
            { label: "Baxılır", count: counts.baxilir, color: "bg-blue-50 text-blue-700" },
            { label: "Təsdiq", count: counts.tesdiq_edildi, color: "bg-emerald-50 text-emerald-700" },
            { label: "Rədd", count: counts.red_edildi, color: "bg-red-50 text-red-700" },
          ].map((s) => (
            <span key={s.label} className={`rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>
              {s.label}: {s.count}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Qeyd</th>
                <th className="px-4 py-3">Tarix</th>
                <th className="px-4 py-3">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applications.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {entry.phoneNumber}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={entry.status as "gozlemede" | "baxilir" | "tesdiq_edildi" | "red_edildi"}
                    />
                  </td>
                  <td className="px-4 py-3 max-w-[180px] truncate text-xs text-slate-500">
                    {entry.notes ?? "–"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(entry.appliedAt).toLocaleDateString("az-AZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <ApplicationActions
                      applicationBankId={entry.id}
                      currentStatus={entry.status as "gozlemede" | "baxilir" | "tesdiq_edildi" | "red_edildi"}
                      currentNotes={entry.notes ?? ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">
            Hələ heç bir müraciət yoxdur
          </p>
        )}
      </div>
    </div>
  );
}
