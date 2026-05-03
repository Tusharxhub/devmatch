"use client";
import React from "react";
import Image from "next/image";

type Sender = {
  id: string;
  name?: string | null;
  image?: string | null;
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  sender: Sender;
};

export default function MessageBubble({ message, isMe }: { message: Message; isMe: boolean }) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <div className="mr-2 mt-auto shrink-0">
          {message.sender?.image ? (
            <Image src={message.sender.image} alt={message.sender.name || ""} width={28} height={28} className="rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="3" /><path d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" /></svg>
            </div>
          )}
        </div>
      )}

      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-br-md" : "bg-white/[0.03] border border-white/5 rounded-bl-md"}`}>
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
        <p className={`text-[10px] mt-1 ${isMe ? "text-white/40" : "text-muted-foreground"}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
}
