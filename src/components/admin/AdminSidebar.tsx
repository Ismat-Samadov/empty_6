"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { logoutAction } from "@/lib/actions/auth";

type NavItem = { label: string; href: string; icon: React.ReactNode };

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-slate-700 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

function LogoutBtn({ redirectTo }: { redirectTo: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() =>
        startTransition(() => logoutAction(redirectTo))
      }
      disabled={pending}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
      {pending ? "Çıxılır..." : "Çıxış"}
    </button>
  );
}

interface SuperAdminSidebarProps {
  variant: "super_admin";
}

interface BankAdminSidebarProps {
  variant: "bank_admin";
  bankName: string;
  bankSlug: string;
}

type Props = SuperAdminSidebarProps | BankAdminSidebarProps;

const DashIcon = (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const BankIcon = (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);
const AppIcon = (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const SettingsIcon = (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const ChartIcon = (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

export function AdminSidebar(props: Props) {
  const navItems: NavItem[] =
    props.variant === "super_admin"
      ? [
          { label: "Dashboard", href: "/admin/dashboard", icon: DashIcon },
          { label: "Banklar", href: "/admin/banks", icon: BankIcon },
          { label: "Müraciətlər", href: "/admin/applications", icon: AppIcon },
          { label: "Analitika", href: "/admin/analytics", icon: ChartIcon },
        ]
      : [
          { label: "Dashboard", href: `/admin/bank/${props.bankSlug}`, icon: DashIcon },
          { label: "Müraciətlər", href: `/admin/bank/${props.bankSlug}/applications`, icon: AppIcon },
          { label: "Analitika", href: `/admin/bank/${props.bankSlug}/analytics`, icon: ChartIcon },
          { label: "Parametrlər", href: `/admin/bank/${props.bankSlug}/settings`, icon: SettingsIcon },
        ];

  const logoutRedirect =
    props.variant === "super_admin"
      ? "/admin/login"
      : props.variant === "bank_admin"
        ? `/admin/bank/${props.bankSlug}/login`
        : "/";

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <span className="text-sm font-bold text-white">K</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Kreditor.az</div>
          <div className="text-[10px] text-slate-400">
            {props.variant === "super_admin"
              ? "Super Admin"
              : (props as BankAdminSidebarProps).bankName}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 px-3 py-3">
        <LogoutBtn redirectTo={logoutRedirect} />
      </div>
    </aside>
  );
}
