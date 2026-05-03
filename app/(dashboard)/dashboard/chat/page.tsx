"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import {
  MessageSquare,
  Send,
  Users,
  ArrowLeft,
  Loader2,
  Circle,
  Wifi,
  WifiOff,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Container from "@/components/ui/container"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import MessageBubble from "@/components/ui/message-bubble"

interface Conversation {
  partner: {
    id: string;
    name: string;
    image: string;
    onlineStatus: boolean;
    lastSeenAt: string;
    githubProfile: { username: string } | null;
  };
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: { id: string; name: string; image: string };
}

export default function ChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Conversation["partner"] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pusherConnected, setPusherConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherChannelRef = useRef<ReturnType<typeof import("pusher-js").default.prototype.subscribe> | null>(null)
  const pusherClientRef = useRef<InstanceType<typeof import("pusher-js").default> | null>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  // Set up Pusher real-time subscription when partner changes
  useEffect(() => {
    if (!selectedPartner || !session?.user?.id) return

    let channel: ReturnType<typeof import("pusher-js").default.prototype.subscribe>

    async function setupPusher() {
      try {
        const { getPusherClient, CHANNELS, EVENTS } = await import("@/lib/pusher")
        const client = getPusherClient()
        pusherClientRef.current = client

        const channelName = CHANNELS.chat(session!.user.id, selectedPartner!.id)

        // Unsubscribe from previous channel
        if (pusherChannelRef.current) {
          pusherChannelRef.current.unbind_all()
          client.unsubscribe(pusherChannelRef.current.name)
        }

        channel = client.subscribe(channelName)
        pusherChannelRef.current = channel

        channel.bind("pusher:subscription_succeeded", () => {
          setPusherConnected(true)
        })

        channel.bind("pusher:subscription_error", () => {
          setPusherConnected(false)
        })

        channel.bind(EVENTS.NEW_MESSAGE, (data: { message: Message; senderId: string }) => {
          // Only add if the message isn't from us (we already added it optimistically)
          if (data.senderId !== session!.user.id) {
            setMessages((prev) => {
              // Deduplicate by checking ID
              if (prev.some((m) => m.id === data.message.id)) return prev
              return [...prev, data.message]
            });
          }
        })

        channel.bind(EVENTS.USER_TYPING, (data: { userId: string }) => {
          // Future: show typing indicator
        })
      } catch (err) {
        console.warn("[Chat] Pusher setup failed, using polling fallback:", err)
        setPusherConnected(false)
      }
    }

    setupPusher()

    return () => {
      if (pusherChannelRef.current && pusherClientRef.current) {
        pusherChannelRef.current.unbind_all()
        pusherClientRef.current.unsubscribe(pusherChannelRef.current.name)
        pusherChannelRef.current = null
      }
      setPusherConnected(false)
    }
  }, [selectedPartner, session?.user?.id])

  // Polling fallback when Pusher isn't connected
  useEffect(() => {
    if (pusherConnected || !selectedPartner) return

    const interval = setInterval(() => {
      fetchMessages(selectedPartner.id)
    }, 5000)

    return () => clearInterval(interval)
  }, [pusherConnected, selectedPartner])

  useEffect(() => {
    if (selectedPartner) fetchMessages(selectedPartner.id)
  }, [selectedPartner])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchConversations() {
    try {
      const res = await fetch("/api/chat/conversations")
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch {
      console.error("Failed to fetch conversations")
    } finally {
      setLoading(false)
    }
  }

  async function fetchMessages(partnerId: string) {
    try {
      const res = await fetch(`/api/chat?partnerId=${partnerId}`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {
      console.error("Failed to fetch messages")
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedPartner || sending) return

    const content = newMessage.trim()
    setSending(true)
    setNewMessage("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedPartner.id, content }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages((prev) => {
          // Deduplicate
          if (prev.some((m) => m.id === data.message.id)) return prev
          return [...prev, data.message]
        })
      }
    } catch {
      console.error("Failed to send message")
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  return (
    <Container>
      <Card variant="featured" className="overflow-hidden">
        <div className="flex min-h-[72vh] flex-col lg:flex-row">
          <div className={`flex w-full flex-col border-r border-[rgba(255,255,255,0.08)] lg:w-80 ${selectedPartner ? "hidden lg:flex" : "flex"}`}>
            <div className="border-b border-[rgba(255,255,255,0.08)] p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#ff2e63]" />
                <h2 className="text-heading-md">Messages</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-[#9ca3af]" />
                </div>
              ) : conversations.length === 0 ? (
                <Card variant="default" className="text-center py-10">
                  <MessageSquare className="mx-auto mb-3 h-10 w-10 text-[#9ca3af]/20" />
                  <p className="text-sm text-[#9ca3af]">No conversations yet</p>
                  <p className="mt-1 text-xs text-[#9ca3af]">Start by messaging a match.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button
                      key={conv.partner.id}
                      onClick={() => setSelectedPartner(conv.partner)}
                      className={`w-full rounded-xl border p-3 text-left transition-all ${
                        selectedPartner?.id === conv.partner.id
                          ? "border-[rgba(255,46,99,0.25)] bg-[rgba(255,46,99,0.08)]"
                          : "border-transparent hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.03)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {conv.partner.image ? (
                            <Image src={conv.partner.image} alt="" width={40} height={40} className="rounded-full" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,46,99,0.1)] border border-[rgba(255,46,99,0.2)]">
                              <Users className="h-4 w-4 text-[#ff2e63]" />
                            </div>
                          )}
                          {conv.partner.onlineStatus && (
                            <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-[#00ffa3] text-[#00ffa3]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium text-[#eaeaf0]">{conv.partner.name}</p>
                            {conv.lastMessage && (
                              <span className="shrink-0 text-[10px] text-[#9ca3af]">
                                {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs text-[#9ca3af]">{conv.lastMessage?.content || "No messages yet"}</p>
                        </div>
                        {conv.unreadCount > 0 && <Badge variant="accent" size="sm">{conv.unreadCount}</Badge>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col ${!selectedPartner ? "hidden lg:flex" : "flex"}`}>
            {selectedPartner ? (
              <>
                <div className="flex h-16 items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-5">
                  <button onClick={() => setSelectedPartner(null)} className="lg:hidden">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    {selectedPartner.image ? (
                      <Image src={selectedPartner.image} alt="" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,46,99,0.1)] border border-[rgba(255,46,99,0.2)]">
                        <Users className="h-4 w-4 text-[#ff2e63]" />
                      </div>
                    )}
                    {selectedPartner.onlineStatus && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 fill-[#00ffa3] text-[#00ffa3]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#eaeaf0]">{selectedPartner.name}</p>
                    <p className="text-[10px] text-[#9ca3af]">{selectedPartner.onlineStatus ? "Online" : "Offline"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pusherConnected ? (
                      <Wifi className="h-3.5 w-3.5 text-[#00ffa3]" />
                    ) : (
                      <WifiOff className="h-3.5 w-3.5 text-[#9ca3af]" />
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="mx-auto mb-2 h-10 w-10 text-[#9ca3af]/10" />
                        <p className="text-sm text-[#9ca3af]">No messages yet. Say hello!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === session?.user?.id
                      return <MessageBubble key={msg.id} message={msg} isMe={isMe} />
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="border-t border-[rgba(255,255,255,0.08)] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="input-base w-full flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      variant="primary"
                      size="md"
                      className="w-full flex items-center justify-center gap-2 sm:w-auto"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-4 h-16 w-16 text-[#9ca3af]/10" />
                  <p className="text-lg font-semibold">Select a conversation</p>
                  <p className="mt-1 text-sm text-[#9ca3af]">Choose from your matches to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Container>
  )
}
