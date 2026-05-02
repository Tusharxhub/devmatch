// app/(dashboard)/dashboard/chat/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  MessageSquare,
  Send,
  Users,
  Search,
  ArrowLeft,
  Loader2,
  Circle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedPartner) fetchMessages(selectedPartner.id);
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/chat/conversations");
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch {
      console.error("Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(partnerId: string) {
    try {
      const res = await fetch(`/api/chat?partnerId=${partnerId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      console.error("Failed to fetch messages");
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedPartner.id, content: newMessage }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch {
      console.error("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass rounded-xl overflow-hidden" style={{ height: "calc(100vh - 8rem)" }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`w-full sm:w-80 border-r border-white/5 flex flex-col ${selectedPartner ? "hidden sm:flex" : "flex"}`}>
            <div className="p-4 border-b border-white/5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                Messages
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start by messaging a match!</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.partner.id}
                    onClick={() => setSelectedPartner(conv.partner)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-white/[0.03] transition-colors text-left ${
                      selectedPartner?.id === conv.partner.id ? "bg-white/[0.05]" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      {conv.partner.image ? (
                        <Image src={conv.partner.image} alt="" width={40} height={40} className="rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-violet-400" />
                        </div>
                      )}
                      {conv.partner.onlineStatus && (
                        <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-emerald-500 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{conv.partner.name}</p>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${!selectedPartner ? "hidden sm:flex" : "flex"}`}>
            {selectedPartner ? (
              <>
                {/* Chat header */}
                <div className="h-14 flex items-center gap-3 px-4 border-b border-white/5">
                  <button onClick={() => setSelectedPartner(null)} className="sm:hidden">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    {selectedPartner.image && (
                      <Image src={selectedPartner.image} alt="" width={32} height={32} className="rounded-full" />
                    )}
                    {selectedPartner.onlineStatus && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{selectedPartner.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedPartner.onlineStatus ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === session?.user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-br-md"
                            : "bg-white/[0.05] rounded-bl-md"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? "text-white/50" : "text-muted-foreground"}`}>
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] text-sm outline-none focus:ring-1 focus:ring-violet-500/30 border border-white/5"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white disabled:opacity-50 hover:opacity-90 transition-opacity shrink-0"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-1">Select a conversation</p>
                  <p className="text-sm text-muted-foreground">Choose from your matches to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
