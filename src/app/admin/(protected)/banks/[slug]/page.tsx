import Link from "next/link";
import { notFound } from "next/navigation";
import { getBankBySlug } from "@/db/queries";
import { EditBankForm } from "./EditBankForm";

export default async function EditBankPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bank = await getBankBySlug(slug);
  if (!bank) notFound();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/admin/banks"
          className="mb-2 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Banklara qayıt
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{bank.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Bank məlumatlarını redaktə edin</p>
      </div>

      <div className="flex gap-6">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <EditBankForm bank={bank} />
        </div>

        <div className="hidden lg:block">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Sürətli keçidlər</h3>
            <div className="flex flex-col gap-2">
              <Link
                href={`/admin/banks/${bank.slug}/admins`}
                className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Admin hesabları
              </Link>
              <Link
                href={`/admin/bank/${bank.slug}/login`}
                target="_blank"
                className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                Bank admin paneli
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
