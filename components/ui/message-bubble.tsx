"use client"

import React from "react"
import Image from "next/image"

type Sender = {
  id: string
  name?: string | null
  image?: string | null
}

type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  sender: Sender
}

export default function MessageBubble({
  message,
  isMe,
}: {
  message: Message
  isMe: boolean
}) {
  return (
    <div className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <div className="shrink-0 mt-auto">
          {message.sender?.image ? (
            <Image
              src={message.sender.image}
              alt={message.sender.name || ""}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[rgba(255,46,99,0.1)] flex items-center justify-center border border-[rgba(255,46,99,0.2)]">
              <svg
                className="w-4 h-4 text-[#ff2e63]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
              </svg>
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-md rounded-lg px-4 py-3 transition-all duration-200 ${
          isMe
            ? "bg-[#ff2e63] text-white rounded-br-none shadow-lg shadow-[0_0_20px_rgba(255,46,99,0.2)]"
            : "glass border-line rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
        <p
          className={`text-xs mt-2 ${
            isMe ? "text-white/50" : "text-[#9ca3af]"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}

