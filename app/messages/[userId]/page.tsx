"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Send,
  Loader2,
  MessageSquare,
  Users,
  Wifi,
  WifiOff,
  ExternalLink,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Container from "@/components/ui/container"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import MessageBubble from "@/components/ui/message-bubble"

interface Partner {
  id: string
  name: string | null
  image: string | null
  onlineStatus: boolean
  lastSeenAt: string | null
  githubProfile: { username: string } | null
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const partnerId = params.userId as string

  const [partner, setPartner] = useState<Partner | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pusherConnected, setPusherConnected] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pusherChannelRef = useRef<ReturnType<typeof import("pusher-js").default.prototype.subscribe> | null>(null)
  const pusherClientRef = useRef<InstanceType<typeof import("pusher-js").default> | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const fetchMessages = useCallback(async () => {
    if (!partnerId) return

    try {
      const res = await fetch(`/api/messages/${partnerId}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError("User not found")
          return
        }
        throw new Error("Failed to load messages")
      }

      const data = await res.json()
      setPartner(data.partner)
      setMessages(data.messages)
      setError(null)
    } catch (err) {
      console.error("[Chat] Failed to fetch messages:", err)
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }, [partnerId])

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages()
    }
  }, [status, fetchMessages])

  useEffect(() => {
    if (!session?.user?.id || !partnerId) return
    const currentUserId = session.user.id

    async function setupPusher() {
      try {
        const { getPusherClient, CHANNELS, EVENTS } = await import("@/lib/pusher")
        const client = getPusherClient()
        pusherClientRef.current = client

        const channelName = CHANNELS.chat(currentUserId, partnerId)

        if (pusherChannelRef.current) {
          pusherChannelRef.current.unbind_all()
          client.unsubscribe(pusherChannelRef.current.name)
        }

        const channel = client.subscribe(channelName)
        pusherChannelRef.current = channel

        channel.bind("pusher:subscription_succeeded", () => {
          setPusherConnected(true)
        })

        channel.bind("pusher:subscription_error", () => {
          setPusherConnected(false)
        })

        channel.bind(EVENTS.NEW_MESSAGE, (data: Message) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev
            return [...prev, data]
          })
        })
      } catch (err) {
        console.warn("[Chat] Pusher setup failed:", err)
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
  }, [session?.user?.id, partnerId])

  useEffect(() => {
    if (pusherConnected || !partnerId || loading) return

    const interval = setInterval(() => {
      fetchMessages()
    }, 4000)

    return () => clearInterval(interval)
  }, [pusherConnected, partnerId, loading, fetchMessages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending || !partnerId) return

    const content = newMessage.trim()
    setNewMessage("")
    setSending(true)

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: partnerId, content }),
      })

      if (!res.ok) {
        throw new Error("Failed to send message")
      }

      const data = await res.json()
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev
        return [...prev, data.message]
      })
    } catch (err) {
      console.error("[Chat] Send failed:", err)
      setNewMessage(content)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  if (status === "loading" || loading) {
    return (
      <Container>
        <Card variant="featured" className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-[#ff2e63]" />
            <p className="text-sm text-[#9ca3af]">Loading conversation...</p>
          </div>
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Card variant="featured" className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Users className="mx-auto mb-3 h-12 w-12 text-[#9ca3af]/20" />
            <p className="mb-2 text-lg font-semibold">{error}</p>
            <Link href="/messages" className="inline-flex items-center gap-2 text-sm text-[#ff2e63] hover:text-[#00ffa3]">
              <ArrowLeft className="h-4 w-4" />
              Back to messages
            </Link>
          </div>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Card variant="featured" className="overflow-hidden">
        <div className="flex min-h-[72vh] flex-col">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-5">
            <Link href="/messages" className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.05)]">
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="relative">
              {partner?.image ? (
                <Image src={partner.image} alt={partner.name || "User"} width={36} height={36} className="rounded-full" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,46,99,0.1)] border border-[rgba(255,46,99,0.2)]">
                  <Users className="h-4 w-4 text-[#ff2e63]" />
                </div>
              )}
              {partner?.onlineStatus && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b0b0f] bg-[#00ffa3]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#eaeaf0]">{partner?.name}</p>
              <p className="text-[10px] text-[#9ca3af]">
                {partner?.onlineStatus
                  ? "Online"
                  : partner?.lastSeenAt
                    ? `Last seen ${formatDistanceToNow(new Date(partner.lastSeenAt), { addSuffix: true })}`
                    : "Offline"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div title={pusherConnected ? "Real-time connected" : "Polling mode"}>
                {pusherConnected ? (
                  <Wifi className="h-3.5 w-3.5 text-[#00ffa3]" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-[#9ca3af]" />
                )}
              </div>
              {partner?.githubProfile?.username && (
                <a
                  href={`https://github.com/${partner.githubProfile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                  title="View GitHub profile"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#9ca3af]" />
                </a>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-3 h-12 w-12 text-[#9ca3af]/10" />
                  <p className="text-sm text-[#9ca3af]">
                    No messages yet - say hello to <span className="font-medium text-[#eaeaf0]">{partner?.name?.split(" ")[0]}</span>!
                  </p>
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

          <form onSubmit={handleSend} className="shrink-0 border-t border-[rgba(255,255,255,0.08)] p-4">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${partner?.name?.split(" ")[0] || ""}...`}
                className="input-base w-full flex-1"
                autoFocus
                disabled={sending}
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
        </div>
      </Card>
    </Container>
  )
}
