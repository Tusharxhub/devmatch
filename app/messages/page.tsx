import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { MessageSquare, Users, Circle, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Container from "@/components/ui/container"
import Card from "@/components/ui/card"
import Badge from "@/components/ui/badge"

export default async function MessagesInboxPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin")
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
  )

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

      return { partner, lastMessage, unreadCount }
    })
  )

  // Sort by most recent message
  conversations.sort(
    (a, b) =>
      (b.lastMessage?.createdAt?.getTime() || 0) -
      (a.lastMessage?.createdAt?.getTime() || 0)
  )

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Container>
        <div className="py-8 border-b border-line">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#ff2e63]" />
            <h1 className="text-heading-xl">Messages</h1>
          </div>
          <p className="text-body-sm text-[#b0b0b8] mt-2">Your conversations with other developers</p>
        </div>

        <div className="py-8">
          {conversations.length === 0 ? (
            <Card variant="featured" className="text-center py-14">
              <MessageSquare className="w-16 h-16 text-[#9ca3af]/20 mx-auto mb-4" />
              <h2 className="text-heading-md mb-2">No conversations yet</h2>
              <p className="text-body-sm text-[#b0b0b8] mb-6">
                Head to your matches and start a conversation.
              </p>
              <Link href="/dashboard/matches">
                <Badge variant="accent" size="md" className="inline-flex items-center gap-2 px-4 py-2">
                  <Users className="w-4 h-4" />
                  Browse Matches
                </Badge>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => {
                if (!conv.partner) return null
                const isMyLastMessage = conv.lastMessage?.senderId === session.user.id

                return (
                  <Link key={conv.partner.id} href={`/messages/${conv.partner.id}`}>
                    <Card variant="interactive" className="group">
                      <div className="flex items-center gap-4">
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
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,46,99,0.1)] border border-[rgba(255,46,99,0.2)]">
                              <Users className="w-5 h-5 text-[#ff2e63]" />
                            </div>
                          )}
                          {conv.partner.onlineStatus && (
                            <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 fill-[#00ffa3] text-[#00ffa3]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate font-semibold text-[#eaeaf0]">{conv.partner.name}</p>
                            {conv.lastMessage && (
                              <span className="shrink-0 text-[10px] text-[#9ca3af]">
                                {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-3">
                            <p className="truncate text-xs text-[#9ca3af]">
                              {isMyLastMessage ? "You: " : ""}
                              {conv.lastMessage?.content || "No messages yet"}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge variant="accent" size="sm">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 shrink-0 text-[#9ca3af] transition-colors group-hover:text-[#ff2e63]" />
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
