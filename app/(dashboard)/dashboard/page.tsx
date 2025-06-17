"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import { Code, Star, GitFork, Users, Zap, ArrowRight, Sparkles, Lightbulb, MessageSquare, Plus } from "lucide-react"

export default function DashboardPage() {
  const { playSound } = useSound()
  const { toast } = useToast()
  const [aiSuggestions] = useState([
    {
      id: 1,
      title: "React Native Developer",
      description: "98% match based on your React skills",
      confidence: 98,
    },
    {
      id: 2,
      title: "Open Source Contribution",
      description: "Consider joining this TypeScript project",
      confidence: 85,
    },
    {
      id: 3,
      title: "Learning Path",
      description: "GraphQL would complement your stack",
      confidence: 76,
    },
  ])

  const handleQuickAction = (action: string) => {
    playSound("medium")
    toast({
      title: `${action} initiated`,
      description: `You've started the ${action.toLowerCase()} process.`,
    })
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, Developer</h1>
          <p className="text-muted-foreground">Here's what's happening with your developer profile.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-teal"></span>
          </span>
          <span className="text-primary-teal">Online</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm group hover:border-primary-pink transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GitHub Repos</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground group-hover:text-primary-pink transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm group hover:border-primary-teal transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stars</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground group-hover:text-primary-teal transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+38 since last month</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm group hover:border-primary-pink transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Forks</CardTitle>
            <GitFork className="h-4 w-4 text-muted-foreground group-hover:text-primary-pink transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">+12 since last month</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm group hover:border-primary-teal transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary-teal transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+3 since last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent matches */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Matches</CardTitle>
                <CardDescription>Developers who match your profile</CardDescription>
              </div>
              <Link href="/matches">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-primary-teal hover:text-primary-teal/80"
                  onClick={() => playSound("high")}
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((match) => (
                <div
                  key={match}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-800 bg-black/30 hover:border-primary-pink transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    playSound("medium")
                    toast({
                      title: "Match profile opened",
                      description: "Viewing developer profile details.",
                    })
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center">
                    <span className="text-white font-bold">D{match}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Developer {match}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary-pink/10 text-primary-pink border-primary-pink/20">
                        React
                      </Badge>
                      <Badge variant="outline" className="bg-primary-teal/10 text-primary-teal border-primary-teal/20">
                        TypeScript
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-pink">{90 - match * 5}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-primary-pink hover:bg-primary-pink/90 text-white group relative overflow-hidden"
                onClick={() => {
                  playSound("medium")
                  toast({
                    title: "Finding new matches",
                    description: "Searching for developers based on your profile.",
                  })
                }}
              >
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Find New Matches
                </span>
              </Button>
            </CardFooter>
          </Card>

          {/* Quick actions */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 px-4 border-gray-800 hover:border-primary-pink hover:bg-primary-pink/10 justify-start gap-3 group"
                onClick={() => handleQuickAction("Profile Update")}
              >
                <div className="w-8 h-8 rounded-full bg-primary-pink/20 flex items-center justify-center group-hover:bg-primary-pink/30 transition-colors">
                  <Users className="h-4 w-4 text-primary-pink" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Update Profile</h4>
                  <p className="text-xs text-muted-foreground">Refresh your skills and availability</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 px-4 border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10 justify-start gap-3 group"
                onClick={() => handleQuickAction("New Project")}
              >
                <div className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center group-hover:bg-primary-teal/30 transition-colors">
                  <Plus className="h-4 w-4 text-primary-teal" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Create Project</h4>
                  <p className="text-xs text-muted-foreground">Start a new collaboration</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 px-4 border-gray-800 hover:border-primary-pink hover:bg-primary-pink/10 justify-start gap-3 group"
                onClick={() => handleQuickAction("Message Check")}
              >
                <div className="w-8 h-8 rounded-full bg-primary-pink/20 flex items-center justify-center group-hover:bg-primary-pink/30 transition-colors">
                  <MessageSquare className="h-4 w-4 text-primary-pink" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Check Messages</h4>
                  <p className="text-xs text-muted-foreground">You have 3 unread messages</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 px-4 border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10 justify-start gap-3 group"
                onClick={() => handleQuickAction("Skill Assessment")}
              >
                <div className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center group-hover:bg-primary-teal/30 transition-colors">
                  <Zap className="h-4 w-4 text-primary-teal" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Skill Assessment</h4>
                  <p className="text-xs text-muted-foreground">Verify your coding abilities</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column - AI suggestions */}
        <div className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-teal" />
                  AI Suggestions
                </CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 rounded-lg border border-gray-800 bg-black/30 hover:border-primary-teal transition-all duration-300 cursor-pointer space-y-2"
                  onClick={() => {
                    playSound("medium")
                    toast({
                      title: suggestion.title,
                      description: suggestion.description,
                    })
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary-teal" />
                      {suggestion.title}
                    </h4>
                    <Badge variant="outline" className="bg-primary-teal/10 text-primary-teal border-primary-teal/20">
                      {suggestion.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  <Progress value={suggestion.confidence} className="h-1 bg-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-primary-teal to-primary-pink"
                      style={{ width: `${suggestion.confidence}%` }}
                    />
                  </Progress>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10 group"
                onClick={() => {
                  playSound("medium")
                  toast({
                    title: "Refreshing AI suggestions",
                    description: "Finding new personalized recommendations for you.",
                  })
                }}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-teal group-hover:text-primary-teal" />
                  Refresh Suggestions
                </span>
              </Button>
            </CardFooter>
          </Card>

          {/* Activity summary */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>Your recent platform activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Views</span>
                  <span className="text-sm font-medium">32</span>
                </div>
                <Progress value={64} className="h-1 bg-gray-800">
                  <div className="h-full bg-primary-pink" style={{ width: "64%" }} />
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Match Requests</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <Progress value={40} className="h-1 bg-gray-800">
                  <div className="h-full bg-primary-teal" style={{ width: "40%" }} />
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Messages</span>
                  <span className="text-sm font-medium">15</span>
                </div>
                <Progress value={75} className="h-1 bg-gray-800">
                  <div className="h-full bg-primary-pink" style={{ width: "75%" }} />
                </Progress>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
