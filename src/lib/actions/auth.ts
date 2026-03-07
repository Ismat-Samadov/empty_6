"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth";
import { db } from "@/db";
import { bankAdmins, banks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export type AuthState = { error: string } | null;

// Super admin login
export async function superAdminLoginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return { error: "Admin konfiqurasiyası tapılmadı" };
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { error: "E-poçt və ya şifrə yanlışdır" };
  }

  const token = await signToken({ role: "super_admin" });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  redirect("/admin/dashboard");
}

// Bank admin login (slug is pre-bound)
export async function bankAdminLoginAction(
  slug: string,
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await db
    .select({ admin: bankAdmins, bank: banks })
    .from(bankAdmins)
    .innerJoin(banks, eq(bankAdmins.bankId, banks.id))
    .where(
      and(
        eq(bankAdmins.email, email),
        eq(banks.slug, slug),
        eq(bankAdmins.isActive, true)
      )
    )
    .limit(1);

  if (!result.length) {
    return { error: "E-poçt və ya şifrə yanlışdır" };
  }

  const { admin, bank } = result[0];
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "E-poçt və ya şifrə yanlışdır" };
  }

  const token = await signToken({
    role: "bank_admin",
    adminId: admin.id,
    bankId: bank.id,
    bankSlug: bank.slug,
    bankName: bank.name,
  });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  redirect(`/admin/bank/${slug}`);
}

// Logout
export async function logoutAction(redirectTo: string) {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect(redirectTo);
}
