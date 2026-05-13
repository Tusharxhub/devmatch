// app/(admin)/admin/audit/page.tsx
import { Activity, ScrollText } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Audit Log" };

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-heading-xl flex items-center gap-2.5">
          <ScrollText className="h-6 w-6 text-[var(--dm-accent)]" />
          Audit Log
        </h1>
        <p className="text-body-md mt-1">Security-relevant platform activity and admin actions.</p>
      </div>

      <Card variant="default" padding="none">
        {logs.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="mx-auto mb-3 h-10 w-10 text-[var(--dm-text-faint)]" />
            <p className="text-heading-sm">No audit events yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--dm-border)]">
            {logs.map((log) => (
              <div key={log.id} className="grid gap-3 px-4 py-3 md:grid-cols-[220px_1fr_170px] md:items-center">
                <div className="flex items-center gap-3">
                  <Avatar src={log.user?.image} alt={log.user?.name || "System"} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[var(--dm-text-primary)]">
                      {log.user?.name || "System"}
                    </div>
                    <div className="truncate text-xs text-[var(--dm-text-muted)]">
                      {log.user?.email || "automated event"}
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" size="xs">
                      {log.action}
                    </Badge>
                    <span className="text-sm text-[var(--dm-text-secondary)]">
                      {log.entity}
                    </span>
                    {log.entityId && (
                      <span className="truncate font-mono text-xs text-[var(--dm-text-faint)]">
                        {log.entityId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[var(--dm-text-muted)] md:text-right">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
