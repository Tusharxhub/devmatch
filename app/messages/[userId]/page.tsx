// app/messages/[userId]/page.tsx
// 1-on-1 real-time chat page with Pusher subscription
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Loader2,
  MessageSquare,
  Users,
  Circle,
  Wifi,
  WifiOff,
  ExternalLink,
} from "lucide-react";
import Container from "@/components/ui/container";
import MessageBubble from "@/components/ui/message-bubble";
import { formatDistanceToNow } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Partner {
  id: string;
  name: string | null;
  image: string | null;
  onlineStatus: boolean;
  lastSeenAt: string | null;
  githubProfile: { username: string } | null;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const partnerId = params.userId as string;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pusherConnected, setPusherConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pusherChannelRef = useRef<ReturnType<
    typeof import("pusher-js").default.prototype.subscribe
  > | null>(null);
  const pusherClientRef = useRef<InstanceType<
    typeof import("pusher-js").default
  > | null>(null);

  // ─── Scroll to bottom ────────────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ─── Fetch chat history ──────────────────────────────────────────────────────

  const fetchMessages = useCallback(async () => {
    if (!partnerId) return;

    try {
      const res = await fetch(`/api/messages/${partnerId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("User not found");
          return;
        }
        throw new Error("Failed to load messages");
      }

      const data = await res.json();
      setPartner(data.partner);
      setMessages(data.messages);
      setError(null);
    } catch (err) {
      console.error("[Chat] Failed to fetch messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages();
    }
  }, [status, fetchMessages]);

  // ─── Pusher real-time subscription ───────────────────────────────────────────

  useEffect(() => {
    if (!session?.user?.id || !partnerId) return;

    let channel: ReturnType<
      typeof import("pusher-js").default.prototype.subscribe
    >;

    async function setupPusher() {
      try {
        const { getPusherClient, CHANNELS, EVENTS } = await import(
          "@/lib/pusher"
        );
        const client = getPusherClient();
        pusherClientRef.current = client;

        const channelName = CHANNELS.chat(session!.user.id, partnerId);

        // Cleanup previous subscription
        if (pusherChannelRef.current) {
          pusherChannelRef.current.unbind_all();
          client.unsubscribe(pusherChannelRef.current.name);
        }

        channel = client.subscribe(channelName);
        pusherChannelRef.current = channel;

        channel.bind("pusher:subscription_succeeded", () => {
          setPusherConnected(true);
        });

        channel.bind("pusher:subscription_error", () => {
          setPusherConnected(false);
        });

        // Listen for incoming messages
        channel.bind(
          EVENTS.NEW_MESSAGE,
          (data: {
            id: string;
            senderId: string;
            receiverId: string;
            content: string;
            createdAt: string;
            sender: { id: string; name: string | null; image: string | null };
          }) => {
            setMessages((prev) => {
              // Deduplicate — don't add if we already have this message ID
              if (prev.some((m) => m.id === data.id)) return prev;
              return [...prev, data];
            });
          }
        );
      } catch (err) {
        console.warn("[Chat] Pusher setup failed:", err);
        setPusherConnected(false);
      }
    }

    setupPusher();

    return () => {
      if (pusherChannelRef.current && pusherClientRef.current) {
        pusherChannelRef.current.unbind_all();
        pusherClientRef.current.unsubscribe(pusherChannelRef.current.name);
        pusherChannelRef.current = null;
      }
      setPusherConnected(false);
    };
  }, [session?.user?.id, partnerId]);

  // ─── Polling fallback (when Pusher is not connected) ─────────────────────────

  useEffect(() => {
    if (pusherConnected || !partnerId || loading) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 4000);

    return () => clearInterval(interval);
  }, [pusherConnected, partnerId, loading, fetchMessages]);

  // ─── Send message ────────────────────────────────────────────────────────────

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || sending || !partnerId) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: partnerId, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();

      // Add to local state (deduplicated — Pusher may have already added it)
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    } catch (err) {
      console.error("[Chat] Send failed:", err);
      setNewMessage(content); // Restore input on failure
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  // ─── Loading state ──────────────────────────────────────────────────────────

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl flex items-center justify-center" style={{ height: "calc(100vh - 8rem)" }}>
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl flex items-center justify-center" style={{ height: "calc(100vh - 8rem)" }}>
          <div className="text-center">
            <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-lg font-semibold mb-2">{error}</p>
            <Link
              href="/messages"
              className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to messages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <div
          className="glass rounded-xl overflow-hidden flex flex-col"
          style={{ height: "calc(100vh - 8rem)" }}
        >
        {/* ─── Chat header ──────────────────────────────────────────── */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5 shrink-0">
          <Link
            href="/messages"
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Partner avatar */}
          <div className="relative">
            {partner?.image ? (
              <Image
                src={partner.image}
                alt={partner.name || "User"}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-violet-400" />
              </div>
            )}
            {partner?.onlineStatus && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[hsl(222,47%,4%)]" />
            )}
          </div>

          {/* Partner info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{partner?.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {partner?.onlineStatus
                ? "Online"
                : partner?.lastSeenAt
                  ? `Last seen ${formatDistanceToNow(new Date(partner.lastSeenAt), { addSuffix: true })}`
                  : "Offline"}
            </p>
          </div>

          {/* Connection status + GitHub link */}
          <div className="flex items-center gap-2">
            <div
              title={pusherConnected ? "Real-time connected" : "Polling mode"}
            >
              {pusherConnected ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            {partner?.githubProfile?.username && (
              <a
                href={`https://github.com/${partner.githubProfile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                title="View GitHub profile"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>

        {/* ─── Messages area ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/10 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No messages yet — say hello to {" "}
                  <span className="text-foreground font-medium">{partner?.name?.split(" ")[0]}</span>!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === session?.user?.id;
              return <MessageBubble key={msg.id} message={msg} isMe={isMe} />;
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ─── Message input ──────────────────────────────────────────── */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 shrink-0 bg-transparent">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${partner?.name?.split(" ")[0] || ""}...`}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] text-sm outline-none focus:ring-1 focus:ring-violet-500/30 border border-white/5 placeholder:text-muted-foreground/50 w-full"
              autoFocus
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="mt-2 sm:mt-0 sm:w-auto w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
      </div>
    </Container>
  );
}
