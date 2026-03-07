import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar variant="super_admin" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
