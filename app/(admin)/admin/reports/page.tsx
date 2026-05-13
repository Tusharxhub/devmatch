"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Flag, Loader2, ShieldCheck } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

interface Report {
  id: string;
  entityType: string;
  entityId: string;
  reason: string;
  details?: string | null;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  author: { id: string; name?: string | null; email?: string | null; image?: string | null };
  target?: { id: string; name?: string | null; email?: string | null; image?: string | null } | null;
}

const statusVariant = {
  PENDING: "warning",
  REVIEWED: "info",
  RESOLVED: "success",
  DISMISSED: "default",
} as const;

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, [status]);

  async function loadReports() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "ALL") params.set("status", status);
      const res = await fetch(`/api/admin/reports?${params}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  async function updateReport(reportId: string, nextStatus: Report["status"]) {
    setUpdating(reportId);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status: nextStatus }),
      });
      if (res.ok) loadReports();
    } catch {
      console.error("Failed to update report");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-heading-xl flex items-center gap-2.5">
            <Flag className="h-6 w-6 text-[var(--dm-accent)]" />
            Reports
          </h1>
          <p className="text-body-md mt-1">Review abuse reports and moderation decisions.</p>
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-[var(--radius-md)] border border-[var(--dm-border)] bg-[var(--dm-bg-raised)] px-3 py-2 text-sm text-[var(--dm-text-primary)] focus:outline-none"
        >
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
          <option value="ALL">All reports</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--dm-accent)]" />
        </div>
      ) : reports.length === 0 ? (
        <Card variant="default" padding="lg" className="text-center">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[var(--dm-green)]" />
          <p className="text-heading-sm">No reports in this queue</p>
          <p className="text-body-sm mt-1">Moderation is clear for the selected filter.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} variant="default" padding="md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[report.status]} size="xs">
                      {report.status.toLowerCase()}
                    </Badge>
                    <Badge variant="outline" size="xs">
                      {report.entityType}
                    </Badge>
                    <span className="text-xs text-[var(--dm-text-faint)]">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-[var(--dm-text-primary)]">
                    {report.reason}
                  </div>
                  {report.details && (
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--dm-text-secondary)]">
                      {report.details}
                    </p>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--dm-bg-base)] p-3">
                      <Avatar src={report.author.image} alt={report.author.name || ""} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs text-[var(--dm-text-muted)]">Reporter</div>
                        <div className="truncate text-sm text-[var(--dm-text-primary)]">
                          {report.author.name || report.author.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--dm-bg-base)] p-3">
                      {report.target ? (
                        <>
                          <Avatar src={report.target.image} alt={report.target.name || ""} size="sm" />
                          <div className="min-w-0">
                            <div className="text-xs text-[var(--dm-text-muted)]">Target user</div>
                            <div className="truncate text-sm text-[var(--dm-text-primary)]">
                              {report.target.name || report.target.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-[var(--dm-text-muted)]">
                          <AlertTriangle className="h-4 w-4" />
                          Entity {report.entityId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:w-60 lg:justify-end">
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={<Clock3 className="h-3.5 w-3.5" />}
                    isLoading={updating === report.id}
                    onClick={() => updateReport(report.id, "REVIEWED")}
                  >
                    Review
                  </Button>
                  <Button
                    variant="success"
                    size="xs"
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    isLoading={updating === report.id}
                    onClick={() => updateReport(report.id, "RESOLVED")}
                  >
                    Resolve
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => updateReport(report.id, "DISMISSED")}
                    isLoading={updating === report.id}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
