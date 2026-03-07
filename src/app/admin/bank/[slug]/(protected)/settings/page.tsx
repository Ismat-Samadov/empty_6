"use client";

import { useActionState } from "react";
import { updateBankSettingsAction } from "@/lib/actions/banks";

const INPUT =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export default function BankSettingsPage() {
  const [state, action, pending] = useActionState(updateBankSettingsAction, null);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Parametrlər</h1>
        <p className="mt-1 text-sm text-slate-500">Bank məlumatlarını yeniləyin</p>
      </div>

      <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Təsvir</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Bank haqqında qısa məlumat"
              className={INPUT}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Veb sayt</label>
              <input name="websiteUrl" type="url" placeholder="https://..." className={INPUT} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefon</label>
              <input name="phoneNumber" placeholder="*1234" className={INPUT} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Logo URL</label>
            <input name="logoUrl" type="url" placeholder="https://..." className={INPUT} />
            <p className="mt-1 text-xs text-slate-400">
              Cloudflare R2 konfiqurasiyası tamamlandıqda fayl yükləmə əlavə ediləcək
            </p>
          </div>

          {state?.error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {state.success}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Saxlanılır..." : "Yadda saxla"}
          </button>
        </form>
      </div>
    </div>
  );
}
