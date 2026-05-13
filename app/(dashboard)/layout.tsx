// app/(dashboard)/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen flex bg-[var(--dm-bg-deep)]">
      <DashboardNav user={{ ...session.user, role: (session.user as { role?: string }).role }} />
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
