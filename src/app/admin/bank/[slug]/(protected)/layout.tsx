import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";

export default async function BankAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  if (!session || session.role !== "bank_admin" || session.bankSlug !== slug) {
    redirect(`/admin/bank/${slug}/login`);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar
        variant="bank_admin"
        bankName={session.bankName}
        bankSlug={session.bankSlug}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
