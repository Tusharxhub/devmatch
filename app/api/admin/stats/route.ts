// app/api/admin/stats/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersThisWeek,
      totalMessages,
      totalMatches,
      totalProjects,
      totalCommunities,
      totalPosts,
      activeUsers,
      bannedUsers,
      pendingReports,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.message.count(),
      prisma.matchScore.count(),
      prisma.project.count(),
      prisma.community.count(),
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { onlineStatus: true } }),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        newUsersThisMonth,
        newUsersThisWeek,
        totalMessages,
        totalMatches,
        totalProjects,
        totalCommunities,
        totalPosts,
        activeUsers,
        bannedUsers,
        pendingReports,
      },
      recentAuditLogs,
    });
  } catch (error) {
    console.error("[Admin Stats API] error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
