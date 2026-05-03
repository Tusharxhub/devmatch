// app/messages/page.tsx
// Conversations inbox — lists all chat partners with last message preview
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  Users,
  Circle,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function MessagesInboxPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get all unique conversation partners
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

  const partnerIds = Array.from(
    new Set([
      ...sentMessages.map((m) => m.receiverId),
      ...receivedMessages.map((m) => m.senderId),
    ])
  );

  // Build conversation list with last message + unread count
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
          select: {
            content: true,
            createdAt: true,
            senderId: true,
          },
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
            githubProfile: { select: { username: true } },
          },
        }),
      ]);

      return { partner, lastMessage, unreadCount };
    })
  );

  // Sort by most recent message
  conversations.sort(
    (a, b) =>
      (b.lastMessage?.createdAt?.getTime() || 0) -
      (a.lastMessage?.createdAt?.getTime() || 0)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-violet-400" />
          Messages
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your conversations with other developers
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground/15 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No conversations yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Head to your matches and start a conversation!
          </p>
          <Link
            href="/dashboard/matches"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Users className="w-4 h-4" />
            Browse Matches
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            if (!conv.partner) return null;
            const isMyLastMessage = conv.lastMessage?.senderId === session.user.id;

            return (
              <Link
                key={conv.partner.id}
                href={`/messages/${conv.partner.id}`}
                className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/[0.04] transition-all duration-200"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {conv.partner.image ? (
                    <Image
                      src={conv.partner.image}
                      alt={conv.partner.name || ""}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-400" />
                    </div>
                  )}
                  {conv.partner.onlineStatus && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[hsl(222,47%,4%)]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold truncate">
                      {conv.partner.name}
                    </p>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">
                      {isMyLastMessage ? "You: " : ""}
                      {conv.lastMessage?.content || "No messages yet"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-violet-400 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
