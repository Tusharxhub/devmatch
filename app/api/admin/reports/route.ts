// app/api/admin/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ReportStatus } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateReportSchema = z.object({
  reportId: z.string().min(1),
  status: z.nativeEnum(ReportStatus),
});

async function requireAdmin(userId?: string) {
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await requireAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: session ? 403 : 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const reports = await prisma.report.findMany({
    where: status ? { status: status as ReportStatus } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: { select: { id: true, name: true, image: true, email: true } },
      target: { select: { id: true, name: true, image: true, email: true } },
    },
  });

  return NextResponse.json({ reports });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await requireAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: session ? 403 : 401 });
  }

  try {
    const data = updateReportSchema.parse(await req.json());
    const report = await prisma.report.update({
      where: { id: data.reportId },
      data: {
        status: data.status,
        resolvedAt: ["RESOLVED", "DISMISSED"].includes(data.status) ? new Date() : null,
        resolvedBy: ["RESOLVED", "DISMISSED"].includes(data.status)
          ? session?.user?.id
          : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id,
        action: "report.status_update",
        entity: "report",
        entityId: report.id,
        metadata: { status: data.status },
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[Admin Reports API] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}
