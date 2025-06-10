"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Code, Star, GitFork, Users, MessageSquare, Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Tushar</h1>
          <p className="text-muted-foreground">Here's what's happening with your developer profile</p>
        </div>
        <Button className="bg-squid-pink hover:bg-squid-pink/90" onClick={() => router.push("/dashboard/matches")}>
          Find Matches
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Match Score", value: "87%", icon: Users, description: "Based on your profile" },
          { title: "Potential Matches", value: "24", icon: Code, description: "Developers in your area" },
          { title: "Messages", value: "7", icon: MessageSquare, description: "Unread messages" },
          { title: "Upcoming Sessions", value: "3", icon: Calendar, description: "Scheduled this week" },
        ].map((stat, index) => (
          <Card key={index} className="border-pink-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-pink-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GitHub Profile */}
      <Card className="border-pink-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">GitHub Profile</CardTitle>
            <CardDescription>Your coding activity and statistics</CardDescription>
          </div>
          <Github className="h-6 w-6" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-pink-500">
                <Image
                  src="/Tushar.jpg?height=80&width=80"
                  alt="GitHub Avatar"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold">Tusharxhub</h3>
                <p className="text-sm text-muted-foreground">github.com/Tusharxhub</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="border-pink-500/20 text-pink-500">
                    <Code className="h-3 w-3 mr-1" />
                    Full Stack
                  </Badge>
                  <Badge variant="outline" className="border-teal-400/20 text-teal-400">
                    <Star className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Repositories", value: "32", icon: Code },
                { label: "Stars", value: "128", icon: Star },
                { label: "Forks", value: "47", icon: GitFork },
                { label: "Followers", value: "96", icon: Users },
              ].map((stat, index) => (
                <div key={index} className="flex flex-col items-center justify-center p-3 bg-pink-500/5 rounded-lg">
                  <stat.icon className="h-5 w-5 text-pink-500 mb-1" />
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Graph */}
          <div className="mt-6 p-4 border border-pink-500/20 rounded-lg">
            <h3 className="text-sm font-medium mb-4">Contribution Activity</h3>
            <div className="flex items-start gap-2">
              {/* Day labels */}
              <div className="flex flex-col justify-between h-24 py-0.5">
                {["Mon", "Wed", "Fri"].map((day, i) => (
                  <span key={day} className="text-[10px] text-muted-foreground h-3 leading-3">{day}</span>
                ))}
              </div>
              {/* Contribution grid - GitHub style (7 rows x 52 columns, left-to-right) */}
              <div className="h-28 flex flex-row gap-[4px] p-2 bg-pink-50 dark:bg-pink-950/40 rounded-xl shadow-inner border border-pink-100 dark:border-pink-900">
                {Array.from({ length: 65 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[4px]">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      // Generate random activity level
                      const activityLevel = Math.floor(Math.random() * 5)
                      let bgColor
                      switch (activityLevel) {
                        case 0:
                          bgColor = "bg-pink-100 border border-pink-100 dark:bg-pink-950 dark:border-pink-900"
                          break
                        case 1:
                          bgColor = "bg-pink-200 border border-pink-200"
                          break
                        case 2:
                          bgColor = "bg-pink-300 border border-pink-300"
                          break
                        case 3:
                          bgColor = "bg-pink-400 border border-pink-400"
                          break
                        case 4:
                          bgColor = "bg-pink-500 border border-pink-500"
                          break
                      }
                      return (
                        <div
                          key={dayIndex}
                          className={`w-3 h-3 rounded-[4px] transition-all duration-200 shadow-sm ${bgColor}`}
                          title={`${activityLevel} contributions`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            {/* Legend in the middle */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="">Less</span>
                <span className="w-2 h-2 bg-pink-100 border border-pink-100 dark:bg-pink-950 dark:border-pink-900 rounded-sm" />
                <span className="w-2 h-2 bg-pink-200 border border-pink-200 rounded-sm" />
                <span className="w-2 h-2 bg-pink-300 border border-pink-300 rounded-sm" />
                <span className="w-2 h-2 bg-pink-400 border border-pink-400 rounded-sm" />
                <span className="w-2 h-2 bg-pink-500 border border-pink-500 rounded-sm" />
                <span className="ml-1">More</span>
              </div>
            </div>
            {/* Month labels */}
            <div className="flex mt-1 ml-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="flex-1 text-[10px] text-muted-foreground text-center">
                  {new Date(2025, i).toLocaleString("default", { month: "short" })}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Matches */}
      <Card className="border-pink-500/20">
        <CardHeader>
          <CardTitle className="text-xl">Suggested Matches</CardTitle>
          <CardDescription>Developers who might be a good fit for collaboration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Arpan Samanta",
                role: "Frontend Developer",
                matchScore: 92,
                skills: ["React", "TypeScript", "Tailwind"],
              },
              {
                name: "Arijit Ghorai",
                role: "Backend Developer",
                matchScore: 87,
                skills: ["Node.js", "Python", "MongoDB"],
              },
              {
                name: "Sudip Das",
                role: "Full Stack Developer",
                matchScore: 84,
                skills: ["React", "Express", "PostgreSQL"],
              },
            ].map((dev, index) => (
              <div key={index} className="border border-pink-500/20 rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-pink-500/20">
                    <Image
                      src="/placeholder.jpg?height=48&width=48"
                      alt={dev.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{dev.name}</h3>
                    <p className="text-xs text-muted-foreground">{dev.role}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-pink-500">{dev.matchScore}%</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {dev.skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="border-teal-400/20 text-teal-400 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Profile
                  </Button>
                  <Button size="sm" className="flex-1 bg-pink-500 hover:bg-pink-600">
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="link" className="text-pink-500">
              View All Matches
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="border-pink-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-teal-400/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-400"
              >
                <path d="M12 2v8" />
                <path d="m4.93 10.93 1.41 1.41" />
                <path d="M2 18h2" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-1.41 1.41" />
                <path d="M22 22H2" />
                <path d="M16 6a4 4 0 0 0-8 0" />
                <path d="M16 18a4 4 0 0 0-8 0" />
              </svg>
            </div>
            <CardTitle className="text-xl">AI Suggestions</CardTitle>
          </div>
          <CardDescription>Personalized recommendations based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-teal-400/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Suggested Repos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "react-state-management", stars: 342 },
                  { name: "typescript-patterns", stars: 187 },
                  { name: "nextjs-starter", stars: 523 },
                ].map((repo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-teal-400" />
                      <span className="text-sm">{repo.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      {repo.stars}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-teal-400/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Suggested Developers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "Samriddhi  Singha", role: "UI/UX Developer" },
                  { name: "Abhishek Singh", role: "DevOps Engineer" },
                  { name: "Ankit Dey", role: "Mobile Developer" },
                ].map((dev, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-400" />
                      <span className="text-sm">{dev.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{dev.role}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-teal-400/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Best Collab Time Slots</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { day: "Monday", time: "2:00 PM - 4:00 PM" },
                  { day: "Wednesday", time: "10:00 AM - 12:00 PM" },
                  { day: "Saturday", time: "1:00 PM - 3:00 PM" },
                ].map((slot, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-400" />
                      <span className="text-sm">{slot.day}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{slot.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
