// app/api/messages/route.ts
// POST: Send a new message with real-time delivery via Pusher
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { receiverId, content } = await req.json();

    if (!receiverId || typeof receiverId !== "string") {
      return NextResponse.json({ error: "receiverId is required" }, { status: 400 });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    if (receiverId === session.user.id) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true },
    });

    if (!receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save message — senderId is ALWAYS from session (prevents spoofing)
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content: content.trim().slice(0, 5000), // cap length
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "MESSAGE_RECEIVED",
        title: `New message from ${session.user.name || "a developer"}`,
        message: message.content.slice(0, 140),
        data: {
          senderId: session.user.id,
          messageId: message.id,
          conversationUrl: `/messages/${session.user.id}`,
        },
      },
    }).catch((notificationErr) => {
      console.error("[API:Messages] Notification create failed:", notificationErr);
    });

    // Trigger Pusher real-time event
    try {
      const pusher = getPusherServer();
      const channelName = CHANNELS.chat(session.user.id, receiverId);
      await pusher.trigger(channelName, EVENTS.NEW_MESSAGE, {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        sender: message.sender,
      });
      await pusher.trigger(CHANNELS.user(receiverId), EVENTS.NEW_MESSAGE, {
        messageId: message.id,
        senderId: session.user.id,
        preview: message.content.slice(0, 140),
      });
    } catch (pusherErr) {
      // Pusher failure should not block message persistence
      console.error("[API:Messages] Pusher trigger failed:", pusherErr);
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[API:Messages] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
