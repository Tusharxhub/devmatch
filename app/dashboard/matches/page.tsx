"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Code, MessageSquare, Star, Filter, X, ThumbsUp, ThumbsDown, Clock } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function MatchesPage() {
  const router = useRouter()

  const handleSendCollabRequest = (devName: string) => {
    alert(`Collaboration request sent to ${devName}!`)
  }

  const handleMessage = (devName: string) => {
    router.push("/dashboard/chat")
  }

  const handleViewProfile = (devName: string) => {
    alert(`Viewing ${devName}'s profile`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Find Your Match</h1>
          <p className="text-muted-foreground">Discover developers who share your coding style and interests</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="discover" className="space-y-6">
            {/* Filters */}
            <Card className="border-pink-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tech Stack</label>
                      <div className="flex flex-wrap gap-2">
                        {["React", "Node.js", "Python", "TypeScript", "Go", "Ruby"].map((tech) => (
                          <Badge key={tech} variant="outline" className="cursor-pointer hover:bg-pink-500/10">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Type</label>
                      <div className="flex flex-wrap gap-2">
                        {["Frontend", "Backend", "Full Stack", "Mobile", "AI/ML", "DevOps"].map((type) => (
                          <Badge key={type} variant="outline" className="cursor-pointer hover:bg-pink-500/10">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Experience Level</label>
                      <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Arpan Samanta",
                  role: "Frontend Developer",
                  matchScore: 92,
                  skills: ["React", "TypeScript", "Tailwind"],
                  repos: 24,
                  stars: 156,
                  bio: "Passionate about creating beautiful, responsive UIs with React and TypeScript. Looking for backend developers to collaborate on open-source projects.",
                },
                {
                  name: "Arijit Ghorai",
                  role: "Backend Developer",
                  matchScore: 87,
                  skills: ["Node.js", "Python", "MongoDB"],
                  repos: 31,
                  stars: 203,
                  bio: "Backend developer specializing in Node.js and Python. Interested in API design and database optimization. Looking for frontend partners for full-stack projects.",
                },
                {
                  name: "Sudip Das",
                  role: "Full Stack Developer",
                  matchScore: 84,
                  skills: ["React", "Express", "PostgreSQL"],
                  repos: 18,
                  stars: 97,
                  bio: "Full stack developer with a focus on PERN stack. Currently building a SaaS platform and looking for collaborators with UI/UX experience.",
                },
                {
                  name: "Samriddhi  Singha",
                  role: "UI/UX Developer",
                  matchScore: 81,
                  skills: ["Figma", "React", "CSS"],
                  repos: 15,
                  stars: 112,
                  bio: "Designer turned developer with a passion for creating intuitive user experiences. Looking for backend developers to bring designs to life.",
                },
                {
                  name: "Abhishek Singh",
                  role: "DevOps Engineer",
                  matchScore: 78,
                  skills: ["Docker", "Kubernetes", "AWS"],
                  repos: 22,
                  stars: 184,
                  bio: "DevOps engineer focused on containerization and CI/CD pipelines. Interested in collaborating on infrastructure as code projects.",
                },
                {
                  name: "Ankit Dey",
                  role: "Mobile Developer",
                  matchScore: 76,
                  skills: ["React Native", "Flutter", "Swift"],
                  repos: 19,
                  stars: 143,
                  bio: "Mobile app developer with experience in React Native and Flutter. Looking for backend developers for a new health and fitness app.",
                },
              ].map((dev, index) => (
                <Card key={index} className="border-pink-500/20 overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-r from-pink-500/20 to-teal-400/20">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-pink-500">{dev.matchScore}% Match</Badge>
                    </div>
                  </div>
                  <CardContent className="pt-0">
                    <div className="flex justify-center -mt-12">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-background">
                        <Image
                          src="/placeholder.jpg?height=96&width=96"
                          alt={dev.name}
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="font-bold text-lg">{dev.name}</h3>
                      <p className="text-sm text-muted-foreground">{dev.role}</p>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{dev.repos}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{dev.stars}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 mt-4">
                      {dev.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="border-teal-400/20 text-teal-400 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-center mt-4 line-clamp-3">{dev.bio}</p>
                    <div className="flex justify-center gap-2 mt-6">
                      <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-pink-500/20">
                        <ThumbsDown className="h-5 w-5 text-muted-foreground" />
                      </Button>
                      <Button size="icon" className="rounded-full h-12 w-12 bg-pink-500 hover:bg-pink-600">
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Your Matches</CardTitle>
                <CardDescription>Developers you've matched with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Arpan Samanta",
                      role: "Frontend Developer",
                      matchDate: "2 days ago",
                      message: "Hey! I saw your React projects and would love to collaborate!",
                    },
                    {
                      name: "Arijit Ghorai",
                      role: "Backend Developer",
                      matchDate: "1 week ago",
                      message: "Hi there! I'm looking for a frontend dev for my new API project.",
                    },
                    {
                      name: "Sudip Das",
                      role: "Full Stack Developer",
                      matchDate: "2 weeks ago",
                      message: "Hello! Your portfolio is impressive. Want to work on an open-source project?",
                    },
                  ].map((match, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-pink-500/20 rounded-lg">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src="/placeholder.jpg?height=48&width=48"
                          alt={match.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{match.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {match.matchDate}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{match.role}</p>
                        <p className="text-sm mt-1 truncate">{match.message}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-pink-500 hover:bg-pink-600"
                        onClick={() => handleMessage(match.name)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Collaboration Requests</CardTitle>
                <CardDescription>Developers who want to connect with you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Samriddhi  Singha",
                      role: "UI/UX Developer",
                      requestDate: "1 day ago",
                      message:
                        "Hi! I love your backend work. Would you be interested in collaborating on a design system?",
                    },
                    {
                      name: "Abhishek Singh",
                      role: "DevOps Engineer",
                      requestDate: "3 days ago",
                      message:
                        "Hello! I'm looking for a developer to help with a Kubernetes project. Are you available?",
                    },
                  ].map((request, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-pink-500/20 rounded-lg">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src="/placeholder.jpg?height=48&width=48"
                          alt={request.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{request.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {request.requestDate}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.role}</p>
                        <p className="text-sm mt-1 truncate">{request.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleSendCollabRequest(request.name)}>
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600"
                          onClick={() => handleViewProfile(request.name)}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
