"use client";

import { useTransition } from "react";
import { deleteBankAdminAction } from "@/lib/actions/banks";

export function DeleteAdminButton({ adminId, slug }: { adminId: string; slug: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Bu admini silmək istəyirsiniz?")) return;
    startTransition(() => deleteBankAdminAction(adminId, slug));
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-lg px-2 py-1 text-xs text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {pending ? "Silinir..." : "Sil"}
    </button>
  );
}
