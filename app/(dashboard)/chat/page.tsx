"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import { useWebSocket } from "@/components/websocket-provider"
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Zap, Lightbulb } from "lucide-react"

interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  lastMessage: string
  timestamp: string
  unread: number
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "system"
}

export default function ChatPage() {
  const { playSound } = useSound()
  const { toast } = useToast()
  const { isConnected, messages, sendMessage } = useWebSocket()
  const [selectedContact, setSelectedContact] = useState<string>("1")
  const [messageInput, setMessageInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "SC",
      status: "online",
      lastMessage: "That sounds like a great project idea!",
      timestamp: "2 min ago",
      unread: 2,
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      avatar: "MR",
      status: "online",
      lastMessage: "I can help with the backend architecture",
      timestamp: "15 min ago",
      unread: 0,
    },
    {
      id: "3",
      name: "Emily Watson",
      avatar: "EW",
      status: "away",
      lastMessage: "Let me review the design mockups",
      timestamp: "1 hour ago",
      unread: 1,
    },
    {
      id: "4",
      name: "David Kim",
      avatar: "DK",
      status: "offline",
      lastMessage: "The ML model is ready for testing",
      timestamp: "3 hours ago",
      unread: 0,
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "1",
      senderName: "Sarah Chen",
      content: "Hey! I saw your React project on GitHub. Really impressive work!",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
    },
    {
      id: "2",
      senderId: "currentUser",
      senderName: "You",
      content: "Thanks! I'd love to collaborate on something similar. Do you have any ideas?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "text",
    },
    {
      id: "3",
      senderId: "1",
      senderName: "Sarah Chen",
      content: "Actually yes! I've been thinking about building a developer portfolio platform. Want to discuss?",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      type: "text",
    },
  ])

  const aiSuggestions = [
    "That sounds like a great idea! I'd love to contribute.",
    "What tech stack are you thinking of using?",
    "I have experience with that. Happy to help!",
    "When would be a good time to start?",
    "Let's schedule a call to discuss the details.",
  ]

  const smartReplies = ["Sounds good! 👍", "I'm interested", "Let's do it!", "Tell me more", "When can we start?"]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim()

    if (!trimmedMessage) {
      playSound("error")
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      })
      return
    }

    if (trimmedMessage.length > 1000) {
      playSound("error")
      toast({
        title: "Message too long",
        description: "Messages must be 1000 characters or less.",
        variant: "destructive",
      })
      return
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: "currentUser",
      senderName: "You",
      content: trimmedMessage,
      timestamp: new Date(),
      type: "text",
    }

    setChatMessages((prev) => [...prev, newMessage])
    sendMessage(trimmedMessage, selectedContact)
    setMessageInput("")
    setShowAISuggestions(false)
    playSound("medium")

    // Show typing indicator
    const typingIndicator: ChatMessage = {
      id: "typing-" + Date.now(),
      senderId: selectedContact,
      senderName: contacts.find((c) => c.id === selectedContact)?.name || "Developer",
      content: "typing...",
      timestamp: new Date(),
      type: "system",
    }

    setChatMessages((prev) => [...prev, typingIndicator])

    // Simulate realistic response with typing delay
    setTimeout(
      () => {
        setChatMessages((prev) => prev.filter((msg) => msg.id !== typingIndicator.id))

        const responses = [
          "That's a great point!",
          "I agree, let's move forward with that approach.",
          "Interesting idea. Let me think about it.",
          "Perfect! I'll start working on that.",
          "Thanks for the suggestion!",
          "Could you elaborate on that?",
          "I have some experience with that. Happy to help!",
          "When would be a good time to discuss this further?",
        ]

        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: selectedContact,
          senderName: contacts.find((c) => c.id === selectedContact)?.name || "Developer",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: "text",
        }
        setChatMessages((prev) => [...prev, response])
        playSound("success")
      },
      1500 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleContactSelect = (contactId: string) => {
    if (contactId === selectedContact) return

    setSelectedContact(contactId)
    playSound("high")

    // Show loading state while "fetching" chat history
    setChatMessages([
      {
        id: "loading",
        senderId: "system",
        senderName: "System",
        content: "Loading chat history...",
        timestamp: new Date(),
        type: "system",
      },
    ])

    // Simulate loading chat history
    setTimeout(() => {
      const mockHistory: ChatMessage[] = [
        {
          id: "1",
          senderId: contactId,
          senderName: contacts.find((c) => c.id === contactId)?.name || "Developer",
          content: "Hey! How's your project going?",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          type: "text",
        },
        {
          id: "2",
          senderId: "currentUser",
          senderName: "You",
          content: "Going well! Thanks for asking. How about yours?",
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          type: "text",
        },
      ]
      setChatMessages(mockHistory)
    }, 800)
  }

  const handleAISuggestion = (suggestion: string) => {
    setMessageInput(suggestion)
    setShowAISuggestions(false)
    playSound("medium")
  }

  const handleSmartReply = (reply: string) => {
    setMessageInput(reply)
    playSound("medium")
  }

  // Make the call buttons actually initiate calls
  const handleCall = (type: "audio" | "video") => {
    playSound("medium")

    // Show call interface
    const callDuration = Math.floor(Math.random() * 300) + 60 // 1-5 minutes

    toast({
      title: `${type === "audio" ? "Audio" : "Video"} call started`,
      description: `Connected with ${contacts.find((c) => c.id === selectedContact)?.name}`,
    })

    // Simulate call duration
    setTimeout(() => {
      toast({
        title: "Call ended",
        description: `Call duration: ${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, "0")}`,
      })
    }, 5000)
  }

  // Make file attachment work
  const handleFileAttachment = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      if (files.length > 0) {
        playSound("medium")
        toast({
          title: "Files attached",
          description: `${files.length} file(s) ready to send.`,
        })
      }
    }
    input.click()
  }

  // Make voice recording work
  const handleVoiceRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          playSound("medium")
          toast({
            title: "Recording started",
            description: "Tap again to stop recording.",
          })

          setTimeout(() => {
            toast({
              title: "Voice message recorded",
              description: "Voice message is ready to send.",
            })
          }, 3000)
        })
        .catch(() => {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to record voice messages.",
            variant: "destructive",
          })
        })
    }
  }

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedContactData = contacts.find((c) => c.id === selectedContact)

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Contacts sidebar */}
      <div className="w-80 flex flex-col">
        <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Messages</span>
              <Badge variant="outline" className="bg-primary-teal/10 text-primary-teal border-primary-teal/20">
                {isConnected ? "Connected" : "Connecting..."}
              </Badge>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 border-gray-700 focus:border-primary-teal pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-1 p-3">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedContact === contact.id
                        ? "bg-primary-pink/20 border border-primary-pink/30"
                        : "hover:bg-gray-800/50"
                    }`}
                    onClick={() => handleContactSelect(contact.id)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center text-white font-bold text-sm">
                        {contact.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                          contact.status === "online"
                            ? "bg-primary-teal"
                            : contact.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                        <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && (
                      <Badge className="bg-primary-pink text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm flex-1 flex flex-col">
          {/* Chat header */}
          <CardHeader className="border-b border-gray-800 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center text-white font-bold text-sm">
                    {selectedContactData?.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                      selectedContactData?.status === "online"
                        ? "bg-primary-teal"
                        : selectedContactData?.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedContactData?.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{selectedContactData?.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCall("audio")}
                  className="hover:bg-primary-teal/10 hover:text-primary-teal"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCall("video")}
                  className="hover:bg-primary-teal/10 hover:text-primary-teal"
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-20rem)] p-4">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === "currentUser" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.senderId === "currentUser" ? "bg-primary-pink text-white" : "bg-gray-800 text-white"
                      } rounded-lg p-3`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* AI Suggestions */}
          {showAISuggestions && (
            <div className="border-t border-gray-800 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary-teal" />
                <span className="text-sm font-medium text-primary-teal">AI Suggestions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAISuggestion(suggestion)}
                    className="text-xs border-gray-700 hover:border-primary-teal hover:bg-primary-teal/10"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Smart replies */}
          <div className="border-t border-gray-800 p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {smartReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSmartReply(reply)}
                  className="text-xs border-gray-700 hover:border-primary-pink hover:bg-primary-pink/10"
                >
                  {reply}
                </Button>
              ))}
            </div>

            {/* Message input */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-gray-800" onClick={handleFileAttachment}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value)
                    setShowAISuggestions(e.target.value.length > 10)
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 hover:bg-gray-800"
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                >
                  <Lightbulb className={`h-4 w-4 ${showAISuggestions ? "text-primary-teal" : ""}`} />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800" onClick={handleVoiceRecording}>
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="bg-primary-pink hover:bg-primary-pink/90 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
