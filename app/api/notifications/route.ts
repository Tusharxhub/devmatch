// app/api/notifications/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/notifications — list user notifications
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 100);

    const where: Record<string, unknown> = { userId: session.user.id };
    if (unreadOnly) where.read = false;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: session.user.id, read: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("[Notifications API] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PATCH /api/notifications — mark as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ids, markAll } = body as { ids?: string[]; markAll?: boolean };

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true, readAt: new Date() },
      });
    } else if (ids?.length) {
      await prisma.notification.updateMany({
        where: { id: { in: ids }, userId: session.user.id },
        data: { read: true, readAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notifications API] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
