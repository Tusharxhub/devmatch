"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Users,
  Zap,
  Terminal,
  X,
  Check,
  AlertCircle,
  MessageSquare,
  Hash,
  Brain,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { soundManager } from "@/lib/sounds"
import { cn } from "@/lib/utils"

interface Suggestion {
  id: string
  text: string
  type: "autocomplete" | "smart-reply" | "context"
  confidence: number
  category?: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  time: string
  isOwn: boolean
  aiEnhanced: boolean
  timestamp: number
}

interface ChatContact {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  aiStatus: string
  avatar: string
}

interface ChatGroup {
  id: string
  name: string
  lastMessage: string
  time: string
  members: number
  unread: number
  aiLevel: string
}

export default function ChatPage() {
  // State management
  const [isTyping, setIsTyping] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [selectedChatData, setSelectedChatData] = useState<ChatContact | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [smartReplies, setSmartReplies] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState("direct")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showCallDialog, setShowCallDialog] = useState<"audio" | "video" | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [contacts, setContacts] = useState<ChatContact[]>([])
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat data
  useEffect(() => {
    // Initialize contacts
    const initialContacts: ChatContact[] = [
      {
        id: "1",
        name: "Arpan Samanta",
        lastMessage: "Hey! I saw your React projects and would love to collaborate!",
        time: "2m ago",
        unread: 2,
        online: true,
        aiStatus: "Active",
        avatar: "/placeholder.jpg?height=48&width=48",
      },
      {
        id: "2",
        name: "Arijit Ghorai",
        lastMessage: "The API endpoints are ready for testing",
        time: "1h ago",
        unread: 0,
        online: true,
        aiStatus: "Coding",
        avatar: "/placeholder.jpg?height=48&width=48",
      },
      {
        id: "3",
        name: "Sudip Das",
        lastMessage: "Thanks for the code review!",
        time: "3h ago",
        unread: 0,
        online: false,
        aiStatus: "Offline",
        avatar: "/placeholder.jpg?height=48&width=48",
      },
      {
        id: "4",
        name: "Samriddhi  Singha",
        lastMessage: "Can we schedule a call to discuss the UI mockups?",
        time: "1d ago",
        unread: 1,
        online: false,
        aiStatus: "Away",
        avatar: "/placeholder.jpg?height=48&width=48",
      },
      {
        id: "5",
        name: "Abhishek Singh",
        lastMessage: "The deployment pipeline is working perfectly",
        time: "2d ago",
        unread: 0,
        online: true,
        aiStatus: "Active",
        avatar: "/placeholder.jpg?height=48&width=48",
      },
    ]

    setContacts(initialContacts)

    // Initialize groups
    const initialGroups: ChatGroup[] = [
      {
        id: "g1",
        name: "React Squid Squad",
        lastMessage: "John: Anyone working with Next.js 14?",
        time: "30m ago",
        members: 12,
        unread: 3,
        aiLevel: "Advanced",
      },
      {
        id: "g2",
        name: "Open Source Collective",
        lastMessage: "Lisa: New issue needs attention",
        time: "2h ago",
        members: 8,
        unread: 0,
        aiLevel: "Expert",
      },
      {
        id: "g3",
        name: "ML Study Group",
        lastMessage: "Mike: Sharing some TensorFlow resources",
        time: "1d ago",
        members: 15,
        unread: 1,
        aiLevel: "Advanced",
      },
    ]

    setGroups(initialGroups)

    // Set default selected chat
    const defaultChat = initialContacts[0]
    setSelectedChat(defaultChat.id)
    setSelectedChatData(defaultChat)

    // Load initial messages for default chat
    const initialMessages: ChatMessage[] = [
      {
        id: "m1",
        sender: defaultChat.name,
        message: "Hey! I saw your React projects and would love to collaborate!",
        time: "10:30 AM",
        isOwn: false,
        aiEnhanced: true,
        timestamp: Date.now() - 600000,
      },
      {
        id: "m2",
        sender: "You",
        message: "Hi Alex! Thanks for reaching out. I'd be interested to hear more about what you have in mind.",
        time: "10:32 AM",
        isOwn: true,
        aiEnhanced: false,
        timestamp: Date.now() - 580000,
      },
      {
        id: "m3",
        sender: defaultChat.name,
        message:
          "I'm working on a React component library and could use someone with your TypeScript expertise. Would you be interested in contributing?",
        time: "10:35 AM",
        isOwn: false,
        aiEnhanced: true,
        timestamp: Date.now() - 550000,
      },
      {
        id: "m4",
        sender: "You",
        message:
          "That sounds really interesting! I love working on component libraries. Do you have a GitHub repo I can check out?",
        time: "10:37 AM",
        isOwn: true,
        aiEnhanced: false,
        timestamp: Date.now() - 530000,
      },
      {
        id: "m5",
        sender: defaultChat.name,
        message: "Here's the link: github.com/alexchen/react-ui-kit",
        time: "10:38 AM",
        isOwn: false,
        aiEnhanced: false,
        timestamp: Date.now() - 520000,
      },
      {
        id: "m6",
        sender: defaultChat.name,
        message:
          "We're focusing on accessibility and performance. I think your background would be perfect for this project.",
        time: "10:39 AM",
        isOwn: false,
        aiEnhanced: true,
        timestamp: Date.now() - 510000,
      },
    ]

    setMessages(initialMessages)

    // Generate smart replies based on last message
    const lastMessage = initialMessages[initialMessages.length - 1].message
    setSmartReplies(generateSmartReplies(lastMessage))
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // AI-powered suggestions based on input
  const generateSuggestions = (input: string): Suggestion[] => {
    if (input.length < 2) return []

    const suggestions: Suggestion[] = []

    // Auto-complete suggestions
    const autoCompleteMap: { [key: string]: string[] } = {
      let: ["let's collaborate on this", "let's schedule a meeting", "let's discuss this further"],
      can: ["can you help me with", "can we schedule a call", "can you review my code"],
      i: ["I think this is great", "I would love to collaborate", "I'm working on a similar project"],
      how: ["how about we", "how does this work", "how can I help"],
      what: ["what do you think about", "what's your experience with", "what framework do you prefer"],
      when: ["when are you available", "when can we start", "when is the deadline"],
      where: ["where can I find", "where should we meet", "where is the documentation"],
      why: ["why don't we", "why not try", "why is this approach better"],
      would: ["would you like to", "would this work for", "would you be interested in"],
      could: ["could you help me", "could we implement", "could this be optimized"],
      should: ["should we use", "should I implement", "should we consider"],
      react: ["React components", "React hooks", "React best practices", "React TypeScript"],
      next: ["Next.js 14", "Next.js App Router", "Next.js deployment", "Next.js optimization"],
      typescript: ["TypeScript interfaces", "TypeScript generics", "TypeScript best practices"],
      api: ["API endpoints", "API documentation", "API testing", "API integration"],
      github: ["GitHub repository", "GitHub collaboration", "GitHub workflow", "GitHub issues"],
      code: ["code review", "code optimization", "code refactoring", "code documentation"],
      project: ["project structure", "project timeline", "project requirements", "project collaboration"],
    }

    const inputLower = input.toLowerCase()
    const words = inputLower.split(" ")
    const lastWord = words[words.length - 1]
    const firstWord = words[0]

    // Find auto-complete matches
    Object.entries(autoCompleteMap).forEach(([key, values]) => {
      if (key.startsWith(lastWord) || key.startsWith(firstWord)) {
        values.forEach((value, index) => {
          suggestions.push({
            id: `auto-${key}-${index}`,
            text: value,
            type: "autocomplete",
            confidence: 0.8 - index * 0.1,
            category: "Auto-complete",
          })
        })
      }
    })

    // Context-aware suggestions
    const contextSuggestions = [
      "That sounds like a great opportunity to learn!",
      "I'd be happy to contribute to this project.",
      "Let me know if you need any help with implementation.",
      "Have you considered using TypeScript for better type safety?",
      "We could set up a pair programming session.",
      "I can share some resources that might be helpful.",
      "What's your preferred tech stack for this project?",
      "Should we create a shared GitHub repository?",
    ]

    contextSuggestions.forEach((suggestion, index) => {
      if (suggestion.toLowerCase().includes(inputLower) || inputLower.length > 5) {
        suggestions.push({
          id: `context-${index}`,
          text: suggestion,
          type: "context",
          confidence: 0.7 - index * 0.05,
          category: "AI Suggested",
        })
      }
    })

    return suggestions.slice(0, 6).sort((a, b) => b.confidence - a.confidence)
  }

  // Smart reply suggestions based on last message
  const generateSmartReplies = (lastMessage: string): Suggestion[] => {
    const replyMap: { [key: string]: string[] } = {
      collaborate: ["I'd love to collaborate! 🚀", "Count me in for this project!", "Let's discuss the details."],
      help: ["I'm here to help! 💪", "What specific area do you need help with?", "I have experience with that."],
      project: [
        "Sounds like an exciting project! ✨",
        "I'd like to learn more about this.",
        "What technologies are you using?",
      ],
      review: ["I'd be happy to review it! 👀", "Send me the link when ready.", "I can provide detailed feedback."],
      meeting: ["Let's schedule a meeting! 📅", "I'm available this week.", "What time works best for you?"],
      question: ["Great question! 🤔", "Let me think about that.", "I have some ideas on this."],
    }

    const replies: Suggestion[] = []
    const messageLower = lastMessage.toLowerCase()

    Object.entries(replyMap).forEach(([key, values]) => {
      if (messageLower.includes(key)) {
        values.forEach((reply, index) => {
          replies.push({
            id: `reply-${key}-${index}`,
            text: reply,
            type: "smart-reply",
            confidence: 0.9 - index * 0.1,
            category: "Smart Reply",
          })
        })
      }
    })

    // Default smart replies
    if (replies.length === 0) {
      const defaultReplies = [
        "That's interesting! Tell me more. 🤔",
        "I agree with your approach. 👍",
        "Thanks for sharing that! 🙏",
        "Let me know how I can help. 💪",
      ]

      defaultReplies.forEach((reply, index) => {
        replies.push({
          id: `default-${index}`,
          text: reply,
          type: "smart-reply",
          confidence: 0.6 - index * 0.1,
          category: "Quick Reply",
        })
      })
    }

    return replies.slice(0, 4)
  }

  // Format timestamp to readable time
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessageInput(value)

    if (value.length > 0) {
      const newSuggestions = generateSuggestions(value)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
    setSelectedSuggestionIndex(-1)

    // Play typing sound
    soundManager.playHoverSound()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If Enter is pressed without suggestions, send the message
    if (e.key === "Enter" && !e.shiftKey && !showSuggestions && messageInput.trim()) {
      e.preventDefault()
      handleSendMessage()
      return
    }

    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        soundManager.playNavigationClick()
        setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        soundManager.playNavigationClick()
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Tab":
      case "Enter":
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault()
          applySuggestion(suggestions[selectedSuggestionIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        soundManager.playButtonClick()
        break
    }
  }

  // Apply suggestion
  const applySuggestion = (suggestion: Suggestion) => {
    setMessageInput(suggestion.text)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    inputRef.current?.focus()
    soundManager.playSuccessSound()
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return

    soundManager.playButtonClick()

    // Create new message
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      sender: "You",
      message: messageInput,
      time: formatTime(Date.now()),
      isOwn: true,
      aiEnhanced: false,
      timestamp: Date.now(),
    }

    // Add message to chat
    setMessages((prev) => [...prev, newMessage])

    // Clear input
    setMessageInput("")
    setShowSuggestions(false)

    // Update contact's last message
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === selectedChat
          ? {
              ...contact,
              lastMessage: `You: ${messageInput}`,
              time: "Just now",
            }
          : contact,
      ),
    )

    // Simulate typing response after a delay
    setIsTyping(true)

    // Generate AI response after a delay
    setTimeout(
      () => {
        setIsTyping(false)

        if (!selectedChatData) return

        // Create AI response
        const aiResponse: ChatMessage = {
          id: `m${Date.now()}`,
          sender: selectedChatData.name,
          message: generateAIResponse(messageInput),
          time: formatTime(Date.now()),
          isOwn: false,
          aiEnhanced: Math.random() > 0.3, // 70% chance of AI enhancement
          timestamp: Date.now(),
        }

        // Add AI response to chat
        setMessages((prev) => [...prev, aiResponse])

        // Update contact's last message
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === selectedChat
              ? {
                  ...contact,
                  lastMessage: aiResponse.message,
                  time: "Just now",
                  unread: 0, // Reset unread count
                }
              : contact,
          ),
        )

        // Generate new smart replies based on AI response
        setSmartReplies(generateSmartReplies(aiResponse.message))

        // Play notification sound
        soundManager.playSuccessSound()
      },
      1500 + Math.random() * 1500,
    ) // Random delay between 1.5-3s
  }

  // Generate AI response based on user message
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Response patterns
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi ") || lowerMessage.includes("hey")) {
      return "Hi there! How can I help with your project today?"
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! I'm always happy to collaborate with talented developers."
    }

    if (lowerMessage.includes("github") || lowerMessage.includes("repo")) {
      return "I've just pushed some new commits to the repo. You can check it out at github.com/alexchen/react-ui-kit/pull/42"
    }

    if (lowerMessage.includes("meet") || lowerMessage.includes("call") || lowerMessage.includes("zoom")) {
      return "I'm available for a call tomorrow between 2-5pm EST. Would that work for you?"
    }

    if (lowerMessage.includes("typescript") || lowerMessage.includes("ts")) {
      return "Your TypeScript expertise would be perfect for implementing our component type definitions. We're aiming for full type safety across the library."
    }

    if (lowerMessage.includes("component") || lowerMessage.includes("ui")) {
      return "We're building a comprehensive UI kit with 30+ accessible components. The design system is inspired by Material Design but with our own custom flair."
    }

    // Default responses
    const defaultResponses = [
      "That's a great point! I think we can definitely incorporate that into the project.",
      "I like your approach. Let's explore that further in our next planning session.",
      "Interesting perspective! I hadn't considered that angle before.",
      "I agree with your assessment. Let's prioritize that for the next sprint.",
      "That aligns perfectly with our project goals. Can you elaborate more on the implementation details?",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  // Handle chat selection
  const handleChatSelect = (chatId: string) => {
    if (chatId === selectedChat) return

    soundManager.playNavigationClick()

    // Find selected chat data
    const selectedContact = contacts.find((contact) => contact.id === chatId)

    if (!selectedContact) return

    setSelectedChat(chatId)
    setSelectedChatData(selectedContact)

    // Clear unread messages
    setContacts((prev) => prev.map((contact) => (contact.id === chatId ? { ...contact, unread: 0 } : contact)))

    // Load chat messages (in a real app, these would come from an API)
    const chatMessages: ChatMessage[] = [
      {
        id: `m${Date.now() - 600000}`,
        sender: selectedContact.name,
        message: "Hey there! How's your day going?",
        time: "11:30 AM",
        isOwn: false,
        aiEnhanced: true,
        timestamp: Date.now() - 600000,
      },
      {
        id: `m${Date.now() - 580000}`,
        sender: "You",
        message: "Going well! Just working on some React components.",
        time: "11:32 AM",
        isOwn: true,
        aiEnhanced: false,
        timestamp: Date.now() - 580000,
      },
      {
        id: `m${Date.now() - 550000}`,
        sender: selectedContact.name,
        message: "That's awesome! I've been diving into Next.js 14 lately. The new features are impressive.",
        time: "11:35 AM",
        isOwn: false,
        aiEnhanced: true,
        timestamp: Date.now() - 550000,
      },
    ]

    setMessages(chatMessages)

    // Generate smart replies based on last message
    const lastMessage = chatMessages[chatMessages.length - 1].message
    setSmartReplies(generateSmartReplies(lastMessage))
  }

  // Handle group selection
  const handleGroupSelect = (groupId: string) => {
    soundManager.playNavigationClick()

    // Show notification that group chat is coming soon
    setNotification({
      message: "Group chat functionality coming soon!",
      type: "info",
    })

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    soundManager.playNavigationClick()
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    soundManager.playHoverSound()
  }

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    soundManager.playButtonClick()
    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)

      // Show notification
      setNotification({
        message: `Search results for "${searchQuery}" will be available soon!`,
        type: "info",
      })

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 1000)
  }

  // Handle call button click
  const handleCallClick = (type: "audio" | "video") => {
    soundManager.playButtonClick()
    setShowCallDialog(type)

    // Simulate call connection
    setTimeout(() => {
      setShowCallDialog(null)

      // Show notification
      setNotification({
        message: `${type === "audio" ? "Audio" : "Video"} call functionality coming soon!`,
        type: "info",
      })

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 2000)
  }

  // Filter contacts based on search query
  const filteredContacts = searchQuery
    ? contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : contacts

  // Filter groups based on search query
  const filteredGroups = searchQuery
    ? groups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : groups

  return (
    <div className="space-y-8 squid-terminal-bg min-h-screen">
      {/* Notification */}
      {notification && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-terminal-fade max-w-md squid-terminal",
            notification.type === "success"
              ? "border-squid-teal"
              : notification.type === "error"
                ? "border-squid-pink"
                : "border-squid-pink/50",
          )}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <Check className="h-5 w-5 text-squid-teal" />
            ) : notification.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-squid-pink" />
            ) : (
              <Terminal className="h-5 w-5 text-squid-pink animate-cursor-blink" />
            )}
            <span className="text-foreground">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Call Dialog */}
      {showCallDialog && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="squid-terminal w-full max-w-md animate-terminal-fade">
            <CardHeader className="squid-terminal-header">
              <div className="terminal-dot terminal-dot-red"></div>
              <div className="terminal-dot terminal-dot-yellow"></div>
              <div className="terminal-dot terminal-dot-green"></div>
              <div className="ml-2 flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-squid-teal" />
                  <span className="text-xs font-medium">
                    {showCallDialog === "audio" ? "audio_call.sh" : "video_call.sh"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="squid-interactive hover:bg-squid-pink/10"
                  onClick={() => {
                    soundManager.playButtonClick()
                    setShowCallDialog(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-center bg-code-bg">
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-squid-pink/20 to-squid-teal/20 border-2 border-squid-pink/30 flex items-center justify-center animate-squid-pulse">
                  {showCallDialog === "audio" ? (
                    <Phone className="h-12 w-12 text-squid-pink" />
                  ) : (
                    <Video className="h-12 w-12 text-squid-teal" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl squid-title mb-1">{selectedChatData?.name || "Contact"}</h3>
                  <div className="terminal-prompt text-sm animate-typing-effect overflow-hidden whitespace-nowrap">
                    <span className="squid-function">
                      {showCallDialog === "audio" ? "connecting_audio_call" : "connecting_video_call"}
                    </span>
                    ()<span className="squid-operator">;</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm squid-comment">
                  <div className="h-2 w-2 rounded-full bg-squid-teal animate-squid-pulse"></div>
                  <span>Establishing connection...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold squid-title">Squid Chat Terminal</h1>
          <div className="terminal-prompt text-sm mt-1 animate-typing-effect overflow-hidden whitespace-nowrap">
            <span className="squid-keyword">const</span> <span className="squid-function">chatSession</span> ={" "}
            <span className="squid-keyword">new</span> <span className="squid-function">SquidChat</span>()
            <span className="squid-operator">;</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="squid-badge-teal">
            <div className="h-2 w-2 rounded-full bg-squid-teal mr-2 animate-squid-pulse"></div>
            Online
          </Badge>
          <Badge className="squid-badge-pink">
            <MessageSquare className="h-3 w-3 mr-1" />
            {contacts.reduce((sum, contact) => sum + contact.unread, 0)} unread
          </Badge>
          <Badge className="squid-badge-pink">
            <Zap className="h-3 w-3 mr-1 animate-squid-pulse" />
            Squid Mode
          </Badge>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="squid-terminal h-full">
            <CardHeader className="squid-terminal-header">
              <div className="terminal-dot terminal-dot-red"></div>
              <div className="terminal-dot terminal-dot-yellow"></div>
              <div className="terminal-dot terminal-dot-green"></div>
              <div className="ml-2 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-squid-teal" />
                <span className="text-xs font-medium">chat_list.sh</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-code-bg h-full flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-squid-pink/20">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 squid-comment" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 bg-code-selection/20 border-squid-pink/30 focus:border-squid-pink squid-focus"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-4 w-4 border-2 border-squid-pink border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </form>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-code-selection/20 border-b border-squid-pink/20 rounded-none">
                  <TabsTrigger
                    value="direct"
                    className="data-[state=active]:bg-squid-pink data-[state=active]:text-white squid-interactive"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Direct
                  </TabsTrigger>
                  <TabsTrigger
                    value="groups"
                    className="data-[state=active]:bg-squid-teal data-[state=active]:text-white squid-interactive"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Groups
                  </TabsTrigger>
                </TabsList>

                {/* Direct Messages */}
                <TabsContent value="direct" className="flex-1 overflow-auto">
                  <div className="space-y-1 p-2">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-all duration-200 squid-interactive",
                          selectedChat === contact.id
                            ? "bg-squid-pink/10 border-l-2 border-squid-pink animate-terminal-glow"
                            : "hover:bg-squid-pink/5",
                        )}
                        onClick={() => handleChatSelect(contact.id)}
                        onMouseEnter={() => soundManager.playHoverSound()}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={contact.avatar || "/placeholder.jpg"}
                              alt={contact.name}
                              width={40}
                              height={40}
                              className="rounded-full border border-squid-pink/30"
                            />
                            <div
                              className={cn(
                                "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-code-bg",
                                contact.aiStatus === "Active"
                                  ? "status-online"
                                  : contact.aiStatus === "Coding"
                                    ? "status-coding"
                                    : contact.aiStatus === "Away"
                                      ? "status-away"
                                      : "status-offline",
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate text-squid-pink">{contact.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs squid-comment">{contact.time}</span>
                                {contact.unread > 0 && (
                                  <Badge className="squid-badge-pink text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center animate-squid-pulse">
                                    {contact.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm squid-comment truncate">{contact.lastMessage}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="squid-badge-teal text-xs">{contact.aiStatus}</Badge>
                              <div className="flex items-center gap-1">
                                <Brain className="h-3 w-3 text-squid-pink" />
                                <span className="text-xs squid-comment">AI Enhanced</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Group Messages */}
                <TabsContent value="groups" className="flex-1 overflow-auto">
                  <div className="space-y-1 p-2">
                    {filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className="p-3 rounded-lg cursor-pointer hover:bg-squid-teal/5 transition-all duration-200 squid-interactive"
                        onClick={() => handleGroupSelect(group.id)}
                        onMouseEnter={() => soundManager.playHoverSound()}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-squid-pink/20 to-squid-teal/20 border border-squid-pink/30 flex items-center justify-center">
                            <Hash className="h-5 w-5 text-squid-teal" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate text-squid-teal">{group.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs squid-comment">{group.time}</span>
                                {group.unread > 0 && (
                                  <Badge className="squid-badge-teal text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                                    {group.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm squid-comment truncate">{group.lastMessage}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="squid-badge-pink text-xs">{group.aiLevel}</Badge>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-squid-teal" />
                                <span className="text-xs squid-comment">{group.members} members</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <Card className="squid-terminal h-full">
            {selectedChatData ? (
              <>
                {/* Chat Header */}
                <CardHeader className="squid-terminal-header">
                  <div className="terminal-dot terminal-dot-red"></div>
                  <div className="terminal-dot terminal-dot-yellow"></div>
                  <div className="terminal-dot terminal-dot-green"></div>
                  <div className="ml-2 flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Terminal className="h-4 w-4 text-squid-teal" />
                      <span className="text-xs font-medium">chat_session.sh</span>
                      <div className="flex items-center gap-2">
                        <Image
                          src={selectedChatData.avatar || "/placeholder.jpg"}
                          alt={selectedChatData.name}
                          width={24}
                          height={24}
                          className="rounded-full border border-squid-pink/30"
                        />
                        <span className="text-sm font-medium text-squid-pink">{selectedChatData.name}</span>
                        <Badge className="squid-badge-teal text-xs">{selectedChatData.aiStatus}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 squid-interactive hover:bg-squid-pink/10"
                        onClick={() => handleCallClick("audio")}
                        title="Audio Call"
                      >
                        <Phone className="h-4 w-4 text-squid-pink" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 squid-interactive hover:bg-squid-teal/10"
                        onClick={() => handleCallClick("video")}
                        title="Video Call"
                      >
                        <Video className="h-4 w-4 text-squid-teal" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 squid-interactive hover:bg-squid-pink/10"
                        title="More Options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 bg-code-bg h-full flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex animate-terminal-fade", message.isOwn ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3 relative",
                            message.isOwn ? "message-own ml-12" : "message-other mr-12",
                            message.aiEnhanced && "message-ai-enhanced",
                          )}
                        >
                          {!message.isOwn && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-squid-pink">{message.sender}</span>
                              {message.aiEnhanced && (
                                <Badge className="squid-badge-pink text-xs">
                                  <Sparkles className="h-2 w-2 mr-1 animate-squid-pulse" />
                                  AI Enhanced
                                </Badge>
                              )}
                            </div>
                          )}
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">{message.time}</span>
                            {message.isOwn && (
                              <div className="flex items-center gap-1">
                                <Check className="h-3 w-3 text-squid-teal" />
                                <Check className="h-3 w-3 text-squid-teal -ml-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start animate-terminal-fade">
                        <div className="max-w-[70%] rounded-lg p-3 message-other mr-12">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-squid-pink">{selectedChatData.name}</span>
                            <Badge className="squid-badge-teal text-xs">
                              <Terminal className="h-2 w-2 mr-1 animate-cursor-blink" />
                              Typing
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-squid-pink animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-squid-pink animate-bounce [animation-delay:0.1s]"></div>
                            <div className="h-2 w-2 rounded-full bg-squid-pink animate-bounce [animation-delay:0.2s]"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Smart Replies */}
                  {smartReplies.length > 0 && (
                    <div className="px-4 py-2 border-t border-squid-pink/20 bg-code-bg/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-squid-pink animate-squid-pulse" />
                        <span className="text-xs squid-subtitle">Smart Replies</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {smartReplies.map((reply) => (
                          <Button
                            key={reply.id}
                            variant="outline"
                            size="sm"
                            className="text-xs squid-button border-squid-pink/30 hover:border-squid-pink hover:bg-squid-pink hover:text-white squid-interactive"
                            onClick={() => {
                              setMessageInput(reply.text)
                              soundManager.playSuccessSound()
                            }}
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-4 border-t border-squid-pink/20 bg-code-bg/50 relative">
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute bottom-full left-4 right-4 mb-2 bg-code-bg border border-squid-pink/30 rounded-lg shadow-lg z-10 max-h-48 overflow-auto animate-terminal-fade squid-terminal">
                        <div className="p-2">
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-squid-pink/20">
                            <Brain className="h-4 w-4 text-squid-pink animate-squid-pulse" />
                            <span className="text-xs squid-subtitle">AI Suggestions</span>
                          </div>
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={suggestion.id}
                              className={cn(
                                "p-2 rounded cursor-pointer transition-all duration-200 squid-interactive",
                                index === selectedSuggestionIndex
                                  ? "bg-squid-pink/20 border-l-2 border-squid-pink"
                                  : "hover:bg-squid-pink/10",
                              )}
                              onClick={() => applySuggestion(suggestion)}
                              onMouseEnter={() => {
                                setSelectedSuggestionIndex(index)
                                soundManager.playHoverSound()
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{suggestion.text}</span>
                                <div className="flex items-center gap-2">
                                  <Badge className="squid-badge-teal text-xs">{suggestion.category}</Badge>
                                  <div className="flex items-center gap-1">
                                    <div
                                      className={cn(
                                        "h-2 w-2 rounded-full",
                                        suggestion.confidence > 0.8
                                          ? "bg-squid-teal"
                                          : suggestion.confidence > 0.6
                                            ? "bg-code-number"
                                            : "squid-comment",
                                      )}
                                    />
                                    <span className="text-xs squid-comment">
                                      {Math.round(suggestion.confidence * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-end gap-3">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className="bg-code-selection/20 border-squid-pink/30 focus:border-squid-pink squid-focus pr-12"
                        />
                        {messageInput && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            <div className="text-xs squid-comment">
                              {suggestions.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Brain className="h-3 w-3 animate-squid-pulse" />
                                  {suggestions.length}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="squid-button bg-squid-pink hover:bg-squid-pink/80 text-white squid-interactive"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Input Helper */}
                    <div className="flex items-center justify-between mt-2 text-xs squid-comment">
                      <div className="flex items-center gap-4">
                        <span>Press Tab or Enter to accept suggestions</span>
                        <span>↑↓ to navigate</span>
                        <span>Esc to close</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-squid-pink animate-squid-pulse" />
                        <span>Squid AI-powered suggestions enabled</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-8 bg-code-bg h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-squid-pink/20 to-squid-teal/20 border-2 border-squid-pink/30 flex items-center justify-center mx-auto mb-4 animate-squid-pulse">
                    <MessageSquare className="h-12 w-12 text-squid-pink" />
                  </div>
                  <h3 className="text-xl squid-title mb-2">Select a conversation</h3>
                  <div className="terminal-prompt text-sm animate-typing-effect overflow-hidden whitespace-nowrap">
                    <span className="squid-function">selectChat</span>()<span className="squid-operator">;</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
