// app/(admin)/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Shield,
  LayoutDashboard,
  Users,
  Flag,
  ScrollText,
  Zap,
  ArrowLeft,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-[var(--dm-bg-deep)]">
      {/* Admin Sidebar */}
      <aside className="w-60 border-r border-[var(--dm-border)] bg-[var(--dm-bg-base)] flex flex-col">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--dm-border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--dm-accent)] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:bg-[var(--dm-bg-hover)] transition-all"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--dm-border)]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm text-[var(--dm-text-muted)] hover:text-[var(--dm-text-primary)] hover:bg-[var(--dm-bg-hover)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
