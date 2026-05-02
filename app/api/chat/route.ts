// app/api/chat/route.ts
// GET: Fetch messages, POST: Send message with real-time delivery
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const partnerId = searchParams.get("partnerId");
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  if (!partnerId) {
    return NextResponse.json({ error: "partnerId is required" }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: session.user.id },
        ],
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({
      messages: messages.reverse(),
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("[API:Chat] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { receiverId, content } = await req.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: "receiverId and content required" }, { status: 400 });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    // Push real-time event
    try {
      const pusher = getPusherServer();
      const channel = CHANNELS.chat(session.user.id, receiverId);
      await pusher.trigger(channel, EVENTS.NEW_MESSAGE, {
        message,
        senderId: session.user.id,
      });
    } catch (pusherError) {
      console.error("[API:Chat] Pusher error:", pusherError);
      // Don't fail the request if Pusher is down
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[API:Chat] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
