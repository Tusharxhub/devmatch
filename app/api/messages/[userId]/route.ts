// app/api/messages/[userId]/route.ts
// GET: Fetch chat history between the authenticated user and the target user
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId: partnerId } = params;

  if (!partnerId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  try {
    // Verify the target user exists
    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
      select: {
        id: true,
        name: true,
        image: true,
        onlineStatus: true,
        lastSeenAt: true,
        githubProfile: {
          select: { username: true },
        },
      },
    });

    if (!partner) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch messages between the two users (both directions)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: session.user.id },
        ],
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Mark unread messages from partner as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({
      partner,
      messages,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("[API:Messages] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
