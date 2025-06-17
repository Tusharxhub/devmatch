"use client"

import React from "react"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "system"
}

interface WebSocketContextType {
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
  messages: Message[]
  sendMessage: (content: string, recipientId?: string) => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  onlineUsers: string[]
  reconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "connecting",
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>(["user1", "user2", "user3"])
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const connect = useCallback(() => {
    setConnectionStatus("connecting")

    // Simulate connection with potential failure
    const connectionTimer = setTimeout(
      () => {
        if (Math.random() > 0.1) {
          // 90% success rate
          setIsConnected(true)
          setConnectionStatus("connected")
          setReconnectAttempts(0)
        } else {
          setConnectionStatus("error")
          // Auto-retry connection
          if (reconnectAttempts < 3) {
            setTimeout(
              () => {
                setReconnectAttempts((prev) => prev + 1)
                connect()
              },
              2000 * (reconnectAttempts + 1),
            )
          }
        }
      },
      1000 + Math.random() * 2000,
    )

    return () => clearTimeout(connectionTimer)
  }, [reconnectAttempts])

  const reconnect = useCallback(() => {
    setReconnectAttempts(0)
    connect()
  }, [connect])

  useEffect(() => {
    const cleanup = connect()

    // Simulate occasional disconnections
    const disconnectInterval = setInterval(() => {
      if (Math.random() > 0.95 && isConnected) {
        // 5% chance of disconnection
        setIsConnected(false)
        setConnectionStatus("disconnected")
        setTimeout(() => {
          connect()
        }, 3000)
      }
    }, 30000) // Check every 30 seconds

    return () => {
      cleanup?.()
      clearInterval(disconnectInterval)
    }
  }, [connect, isConnected])

  const sendMessage = useCallback((content: string, recipientId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "currentUser",
      senderName: "You",
      content,
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const joinRoom = useCallback((roomId: string) => {
    console.log(`Joined room: ${roomId}`)
  }, [])

  const leaveRoom = useCallback((roomId: string) => {
    console.log(`Left room: ${roomId}`)
  }, [])

  const contextValue = React.useMemo<WebSocketContextType>(
    () => ({
      isConnected,
      connectionStatus,
      messages,
      sendMessage,
      joinRoom,
      leaveRoom,
      onlineUsers,
      reconnect,
    }),
    [isConnected, connectionStatus, messages, onlineUsers, reconnect],
  )

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
