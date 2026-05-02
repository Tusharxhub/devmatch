// app/api/chat/conversations/route.ts
// GET: List all conversations for the authenticated user
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all unique conversation partners with last message
    const sentMessages = await prisma.message.findMany({
      where: { senderId: session.user.id },
      select: { receiverId: true },
      distinct: ["receiverId"],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: session.user.id },
      select: { senderId: true },
      distinct: ["senderId"],
    });

    const partnerIds = Array.from(new Set([
      ...sentMessages.map((m) => m.receiverId),
      ...receivedMessages.map((m) => m.senderId),
    ]));

    const conversations = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const [lastMessage, unreadCount, partner] = await Promise.all([
          prisma.message.findFirst({
            where: {
              OR: [
                { senderId: session.user.id, receiverId: partnerId },
                { senderId: partnerId, receiverId: session.user.id },
              ],
            },
            orderBy: { createdAt: "desc" },
          }),
          prisma.message.count({
            where: {
              senderId: partnerId,
              receiverId: session.user.id,
              read: false,
            },
          }),
          prisma.user.findUnique({
            where: { id: partnerId },
            select: {
              id: true,
              name: true,
              image: true,
              onlineStatus: true,
              lastSeenAt: true,
              githubProfile: { select: { username: true } },
            },
          }),
        ]);

        return { partner, lastMessage, unreadCount };
      })
    );

    // Sort by last message time
    conversations.sort(
      (a, b) =>
        (b.lastMessage?.createdAt?.getTime() || 0) -
        (a.lastMessage?.createdAt?.getTime() || 0)
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[API:Conversations] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
