"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Code,
  Users,
  Calendar,
  GitBranch,
  Star,
  Plus,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function CollabsPage() {
  const router = useRouter()

  const handleCreateProject = () => {
    alert("Create New Project modal would open here")
  }

  const handleViewProject = (projectTitle: string) => {
    alert(`Viewing ${projectTitle} details`)
  }

  const handleChatTeam = (projectTitle: string) => {
    router.push("/dashboard/chat")
  }

  const handleApplyToJoin = (projectTitle: string) => {
    alert(`Applied to join ${projectTitle}!`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Collaborations</h1>
          <p className="text-muted-foreground">Manage your projects and find new collaboration opportunities</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Active Projects", value: "5", icon: Code, description: "Currently working on" },
          { title: "Team Members", value: "12", icon: Users, description: "Across all projects" },
          { title: "Completed", value: "8", icon: CheckCircle, description: "Successfully finished" },
          { title: "This Month", value: "3", icon: Calendar, description: "New collaborations" },
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

      {/* Main Content */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "DevMatch Mobile App",
                  description: "React Native app for the DevMatch platform with real-time matching",
                  status: "In Progress",
                  progress: 65,
                  tech: ["React Native", "TypeScript", "Firebase"],
                  team: [
                    { name: "You", avatar: "/placeholder.jpg?height=32&width=32" },
                    { name: "Arpan Samanta", avatar: "/placeholder.jpg?height=32&width=32" },
                    { name: "Arijit Ghorai", avatar: "/placeholder.jpg?height=32&width=32" },
                  ],
                  deadline: "2024-03-15",
                  commits: 47,
                  issues: 3,
                },
                {
                  title: "AI Code Review Tool",
                  description: "Machine learning tool that provides intelligent code review suggestions",
                  status: "In Progress",
                  progress: 40,
                  tech: ["Python", "TensorFlow", "FastAPI"],
                  team: [
                    { name: "You", avatar: "/placeholder.jpg?height=32&width=32" },
                    { name: "Sudip Das", avatar: "/placeholder.jpg?height=32&width=32" },
                  ],
                  deadline: "2024-04-01",
                  commits: 23,
                  issues: 7,
                },
                {
                  title: "Open Source UI Library",
                  description: "Comprehensive React component library with accessibility focus",
                  status: "In Progress",
                  progress: 80,
                  tech: ["React", "TypeScript", "Storybook"],
                  team: [
                    { name: "You", avatar: "/placeholder.jpg?height=32&width=32" },
                    { name: "Samriddhi  Singha", avatar: "/placeholder.jpg?height=32&width=32" },
                    { name: "Abhishek Singh", avatar: "/placeholder.jpg?height=32&width=32" },
                    { name: "Ankit Dey", avatar: "/placeholder.jpg?height=32&width=32" },
                  ],
                  deadline: "2024-02-28",
                  commits: 89,
                  issues: 2,
                },
                {
                  title: "Blockchain Voting System",
                  description: "Secure and transparent voting system built on Ethereum",
                  status: "Planning",
                  progress: 15,
                  tech: ["Solidity", "Web3.js", "React"],
                  team: [
                    { name: "You", avatar: "/placeholder.jpg?height=32&width=32" },
                    { name: "David Kim", avatar: "/placeholder.jpg?height=32&width=32" },
                  ],
                  deadline: "2024-05-01",
                  commits: 8,
                  issues: 12,
                },
              ].map((project, index) => (
                <Card key={index} className="border-pink-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </div>
                      <Badge
                        variant={project.status === "In Progress" ? "default" : "secondary"}
                        className={project.status === "In Progress" ? "bg-green-500" : ""}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tech Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech, i) => (
                          <Badge key={i} variant="outline" className="border-teal-400/20 text-teal-400 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Team */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Team ({project.team.length})</p>
                      <div className="flex -space-x-2">
                        {project.team.map((member, i) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatar || "/placeholder.jpg"} alt={member.name} />
                            <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-pink-500/20">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{project.commits}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{project.issues}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{project.deadline}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewProject(project.title)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-pink-500 hover:bg-pink-600"
                        onClick={() => handleChatTeam(project.title)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "E-commerce Platform",
                  description: "Full-stack e-commerce solution with modern payment integration",
                  creator: "John Smith",
                  lookingFor: ["Frontend Developer", "UI/UX Designer"],
                  tech: ["Next.js", "Node.js", "PostgreSQL"],
                  commitment: "Part-time",
                  duration: "3 months",
                  applicants: 8,
                },
                {
                  title: "Climate Data Visualization",
                  description: "Interactive dashboard for climate change data analysis and visualization",
                  creator: "Lisa Chen",
                  lookingFor: ["Data Scientist", "Frontend Developer"],
                  tech: ["Python", "D3.js", "React"],
                  commitment: "Full-time",
                  duration: "2 months",
                  applicants: 12,
                },
                {
                  title: "Fitness Tracking App",
                  description: "Mobile app for tracking workouts with social features",
                  creator: "Mike Johnson",
                  lookingFor: ["Mobile Developer", "Backend Developer"],
                  tech: ["Flutter", "Firebase", "Node.js"],
                  commitment: "Part-time",
                  duration: "4 months",
                  applicants: 5,
                },
                {
                  title: "Code Learning Platform",
                  description: "Interactive platform for learning programming with gamification",
                  creator: "Anna Rodriguez",
                  lookingFor: ["Full Stack Developer", "Game Developer"],
                  tech: ["React", "Express", "MongoDB"],
                  commitment: "Part-time",
                  duration: "6 months",
                  applicants: 15,
                },
              ].map((opportunity, index) => (
                <Card key={index} className="border-pink-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{opportunity.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-green-500/20 text-green-500">
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Creator */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.jpg?height=32&width=32" alt={opportunity.creator} />
                        <AvatarFallback className="text-xs">{opportunity.creator.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{opportunity.creator}</p>
                        <p className="text-xs text-muted-foreground">Project Creator</p>
                      </div>
                    </div>

                    {/* Looking For */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Looking for</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.lookingFor.map((role, i) => (
                          <Badge key={i} className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tech Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.tech.map((tech, i) => (
                          <Badge key={i} variant="outline" className="border-teal-400/20 text-teal-400 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-pink-500/20">
                      <div>
                        <p className="text-xs text-muted-foreground">Commitment</p>
                        <p className="text-sm font-medium">{opportunity.commitment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">{opportunity.duration}</p>
                      </div>
                    </div>

                    {/* Applicants */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{opportunity.applicants} applicants</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Learn More
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-pink-500 hover:bg-pink-600"
                        onClick={() => handleApplyToJoin(opportunity.title)}
                      >
                        Apply to Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "Task Management App",
                  description: "Collaborative task management tool with real-time updates",
                  completedDate: "2024-01-15",
                  duration: "2 months",
                  tech: ["React", "Node.js", "Socket.io"],
                  team: 4,
                  rating: 4.8,
                  github: "github.com/team/task-manager",
                },
                {
                  title: "Weather Dashboard",
                  description: "Beautiful weather dashboard with location-based forecasts",
                  completedDate: "2023-12-20",
                  duration: "1 month",
                  tech: ["Vue.js", "Express", "OpenWeather API"],
                  team: 2,
                  rating: 4.6,
                  github: "github.com/team/weather-dash",
                },
                {
                  title: "Recipe Sharing Platform",
                  description: "Social platform for sharing and discovering recipes",
                  completedDate: "2023-11-30",
                  duration: "3 months",
                  tech: ["Next.js", "Prisma", "PostgreSQL"],
                  team: 5,
                  rating: 4.9,
                  github: "github.com/team/recipe-share",
                },
              ].map((project, index) => (
                <Card key={index} className="border-pink-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </div>
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tech Stack */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tech Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech, i) => (
                          <Badge key={i} variant="outline" className="border-teal-400/20 text-teal-400 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-pink-500/20">
                      <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-sm font-medium">{project.completedDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">{project.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Team Size</p>
                        <p className="text-sm font-medium">{project.team} members</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{project.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <GitBranch className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "Social Media Analytics Tool",
                  description: "Comprehensive analytics dashboard for social media performance",
                  lastEdited: "2 days ago",
                  tech: ["React", "Python", "MongoDB"],
                  status: "Draft",
                },
                {
                  title: "Cryptocurrency Portfolio Tracker",
                  description: "Real-time portfolio tracking with advanced analytics",
                  lastEdited: "1 week ago",
                  tech: ["Vue.js", "Node.js", "Redis"],
                  status: "Draft",
                },
              ].map((draft, index) => (
                <Card key={index} className="border-pink-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{draft.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{draft.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{draft.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tech Stack */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Planned Tech Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {draft.tech.map((tech, i) => (
                          <Badge key={i} variant="outline" className="border-teal-400/20 text-teal-400 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Last Edited */}
                    <div className="flex items-center gap-2 pt-2 border-t border-pink-500/20">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Last edited {draft.lastEdited}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit Draft
                      </Button>
                      <Button size="sm" className="flex-1 bg-pink-500 hover:bg-pink-600">
                        <Play className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
