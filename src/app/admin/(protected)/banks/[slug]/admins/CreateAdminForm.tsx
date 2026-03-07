"use client";

import { useActionState } from "react";
import { createBankAdminAction } from "@/lib/actions/banks";

const INPUT =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export function CreateAdminForm({ bankId }: { bankId: string }) {
  const boundAction = createBankAdminAction.bind(null, bankId);
  const [state, action, pending] = useActionState(boundAction, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Ad</label>
        <input name="name" required className={INPUT} placeholder="Əli Əliyev" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">E-poçt</label>
        <input name="email" type="email" required className={INPUT} placeholder="ali@bank.az" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Şifrə</label>
        <input name="password" type="password" required minLength={8} className={INPUT} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Rol</label>
        <select name="role" className={INPUT}>
          <option value="admin">Admin (tam giriş)</option>
          <option value="baxici">Baxıcı (yalnız baxış)</option>
        </select>
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Yaradılır..." : "Admin yarat"}
      </button>
    </form>
  );
}
