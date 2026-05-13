// app/api/admin/users/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/users — list all users with admin controls
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "25"), 100);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const banned = searchParams.get("banned");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;
    if (banned === "true") where.isBanned = true;
    if (banned === "false") where.isBanned = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isBanned: true,
          bannedReason: true,
          onlineStatus: true,
          createdAt: true,
          lastSeenAt: true,
          githubProfile: { select: { username: true, experienceLevel: true } },
          _count: { select: { sentMessages: true, matchesAsUser: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[Admin Users API] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// PATCH /api/admin/users — update user (ban, role change)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action, reason, newRole } = body as {
      userId: string;
      action: "ban" | "unban" | "changeRole";
      reason?: string;
      newRole?: string;
    };

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing userId or action" }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};
    let auditAction = "";

    switch (action) {
      case "ban":
        updateData = { isBanned: true, bannedAt: new Date(), bannedReason: reason || "Violation of terms" };
        auditAction = "user.ban";
        break;
      case "unban":
        updateData = { isBanned: false, bannedAt: null, bannedReason: null };
        auditAction = "user.unban";
        break;
      case "changeRole":
        if (!newRole || !["DEVELOPER", "RECRUITER", "ADMIN"].includes(newRole)) {
          return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
        updateData = { role: newRole };
        auditAction = "user.role_change";
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, role: true, isBanned: true },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: auditAction,
        entity: "user",
        entityId: userId,
        metadata: { reason, newRole, targetUser: updatedUser.name },
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("[Admin Users API] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
