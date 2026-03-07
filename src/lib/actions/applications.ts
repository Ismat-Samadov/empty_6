"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { applicationBanks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

type Status = "gozlemede" | "baxilir" | "tesdiq_edildi" | "red_edildi";

export async function updateApplicationStatusAction(
  applicationBankId: string,
  status: Status,
  notes: string
) {
  const session = await getSession();
  if (!session || session.role !== "bank_admin") return;

  await db
    .update(applicationBanks)
    .set({
      status,
      notes: notes.trim() || null,
      reviewedAt: status !== "gozlemede" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(applicationBanks.id, applicationBankId));

  revalidatePath(`/admin/bank/${session.bankSlug}/applications`);
  revalidatePath(`/admin/bank/${session.bankSlug}`);
}
