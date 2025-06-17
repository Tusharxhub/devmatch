"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Users,
  Calendar,
  Star,
  MessageSquare,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Edit,
  Trash2,
  Filter,
  Search,
  Share,
  BookmarkPlus,
  Eye,
  ThumbsUp,
  Award,
} from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "draft" | "available"
  progress: number
  technologies: string[]
  teamSize: number
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  type: string
  creator: string
  participants: string[]
  deadline?: string
  rating?: number
  likes?: number
  views?: number
  bookmarked?: boolean
}

export default function CollaborationsPage() {
  const { playSound } = useSound()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("active")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    type: "",
    technologies: "",
    duration: "",
    difficulty: "Intermediate" as const,
    teamSize: 2,
  })

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Building a modern e-commerce platform with React, Node.js, and PostgreSQL",
      status: "active",
      progress: 65,
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      teamSize: 4,
      duration: "3 months",
      difficulty: "Advanced",
      type: "Fullstack",
      creator: "Sarah Chen",
      participants: ["You", "Sarah Chen", "Marcus Rodriguez", "Emily Watson"],
      deadline: "2024-03-15",
      likes: 24,
      views: 156,
    },
    {
      id: "2",
      title: "AI Chat Bot",
      description: "Developing an intelligent chatbot using OpenAI API and Python",
      status: "active",
      progress: 30,
      technologies: ["Python", "OpenAI", "FastAPI", "React"],
      teamSize: 2,
      duration: "2 months",
      difficulty: "Intermediate",
      type: "AI/ML",
      creator: "David Kim",
      participants: ["You", "David Kim"],
      deadline: "2024-02-28",
      likes: 18,
      views: 89,
    },
    {
      id: "3",
      title: "Mobile Fitness App",
      description: "Cross-platform fitness tracking app with social features",
      status: "completed",
      progress: 100,
      technologies: ["React Native", "Firebase", "Node.js"],
      teamSize: 3,
      duration: "4 months",
      difficulty: "Advanced",
      type: "Mobile",
      creator: "Lisa Thompson",
      participants: ["You", "Lisa Thompson", "Alex Johnson"],
      rating: 4.8,
      likes: 45,
      views: 234,
    },
    {
      id: "4",
      title: "Weather Dashboard",
      description: "Real-time weather dashboard with beautiful visualizations",
      status: "available",
      progress: 0,
      technologies: ["Vue.js", "D3.js", "Weather API"],
      teamSize: 2,
      duration: "1 month",
      difficulty: "Beginner",
      type: "Frontend",
      creator: "Emily Watson",
      participants: ["Emily Watson"],
      likes: 12,
      views: 67,
      bookmarked: false,
    },
    {
      id: "5",
      title: "Blockchain Voting System",
      description: "Secure voting system using blockchain technology",
      status: "draft",
      progress: 0,
      technologies: ["Solidity", "Web3.js", "React"],
      teamSize: 3,
      duration: "6 months",
      difficulty: "Advanced",
      type: "Blockchain",
      creator: "You",
      participants: ["You"],
      likes: 8,
      views: 23,
    },
    {
      id: "6",
      title: "Social Media Analytics",
      description: "Analytics dashboard for social media performance tracking",
      status: "available",
      progress: 0,
      technologies: ["Python", "Django", "Chart.js", "PostgreSQL"],
      teamSize: 4,
      duration: "3 months",
      difficulty: "Intermediate",
      type: "Fullstack",
      creator: "Mike Johnson",
      participants: ["Mike Johnson"],
      likes: 31,
      views: 142,
      bookmarked: true,
    },
    {
      id: "7",
      title: "Task Management Tool",
      description: "Collaborative task management with real-time updates",
      status: "completed",
      progress: 100,
      technologies: ["React", "Socket.io", "MongoDB", "Express"],
      teamSize: 3,
      duration: "2 months",
      difficulty: "Intermediate",
      type: "Fullstack",
      creator: "Anna Davis",
      participants: ["You", "Anna Davis", "Tom Wilson"],
      rating: 4.6,
      likes: 38,
      views: 198,
    },
  ])

  // Enhanced filtering logic
  const filteredProjects = (status: string) => {
    return projects.filter((project) => {
      const matchesStatus = project.status === status
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = filterType === "all" || project.type === filterType
      const matchesDifficulty = filterDifficulty === "all" || project.difficulty === filterDifficulty

      return matchesStatus && matchesSearch && matchesType && matchesDifficulty
    })
  }

  const handleCreateProject = async () => {
    const errors = []

    if (!newProject.title.trim()) errors.push("Title is required")
    if (!newProject.description.trim()) errors.push("Description is required")
    if (newProject.title.length < 3) errors.push("Title must be at least 3 characters")
    if (newProject.description.length < 10) errors.push("Description must be at least 10 characters")

    if (errors.length > 0) {
      playSound("error")
      toast({
        title: "Validation failed",
        description: errors[0],
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    playSound("medium")

    // Simulate API call
    setTimeout(() => {
      const newProjectData: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        status: "draft",
        progress: 0,
        technologies: newProject.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        teamSize: newProject.teamSize,
        duration: newProject.duration,
        difficulty: newProject.difficulty,
        type: newProject.type,
        creator: "You",
        participants: ["You"],
        likes: 0,
        views: 0,
      }

      setProjects((prev) => [...prev, newProjectData])

      playSound("success")
      toast({
        title: "Project created successfully",
        description: `${newProject.title} has been added to your drafts.`,
      })

      setShowCreateForm(false)
      setNewProject({
        title: "",
        description: "",
        type: "",
        technologies: "",
        duration: "",
        difficulty: "Intermediate",
        teamSize: 2,
      })
      setIsLoading(false)
      setActiveTab("draft")
    }, 2000)
  }

  const handleApplyToProject = async (projectId: string) => {
    setIsLoading(true)
    playSound("medium")

    // Simulate application process
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate

      if (success) {
        playSound("success")
        toast({
          title: "Application sent successfully",
          description: "The project creator will review your application and get back to you.",
        })
      } else {
        playSound("error")
        toast({
          title: "Application failed",
          description: "There was an issue sending your application. Please try again.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleLikeProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, likes: (project.likes || 0) + 1 } : project)),
    )
    playSound("high")
    toast({
      title: "Project liked",
      description: "You liked this project!",
    })
  }

  const handleBookmarkProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, bookmarked: !project.bookmarked } : project)),
    )
    playSound("medium")
    const project = projects.find((p) => p.id === projectId)
    toast({
      title: project?.bookmarked ? "Bookmark removed" : "Project bookmarked",
      description: project?.bookmarked ? "Removed from your bookmarks" : "Added to your bookmarks",
    })
  }

  const handlePublishProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, status: "available" as const } : project)),
    )
    playSound("success")
    toast({
      title: "Project published",
      description: "Your project is now available for collaboration!",
    })
  }

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setProjects((prev) => prev.filter((project) => project.id !== projectId))
      playSound("error")
      toast({
        title: "Project deleted",
        description: "The project has been permanently removed.",
      })
    }
  }

  const handleCompleteProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, status: "completed" as const, progress: 100, rating: 4.5 } : project,
      ),
    )
    playSound("success")
    toast({
      title: "Project completed",
      description: "Congratulations on completing your project!",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-primary-teal" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "draft":
        return <Edit className="h-4 w-4 text-yellow-500" />
      case "available":
        return <AlertCircle className="h-4 w-4 text-primary-pink" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary-teal/10 text-primary-teal border-primary-teal/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "available":
        return "bg-primary-pink/10 text-primary-pink border-primary-pink/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Collaborations</h1>
          <p className="text-muted-foreground">Manage your projects and find new collaboration opportunities.</p>
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(true)
            playSound("medium")
          }}
          className="bg-primary-pink hover:bg-primary-pink/90 text-white group relative overflow-hidden w-full sm:w-auto"
        >
          <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 border-gray-700 focus:border-primary-teal pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Fullstack">Fullstack</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Blockchain">Blockchain</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterType("all")
                setFilterDifficulty("all")
                playSound("medium")
                toast({
                  title: "Filters cleared",
                  description: "All filters have been reset.",
                })
              }}
              className="border-gray-800 hover:border-primary-pink hover:bg-primary-pink/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Project Form */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-2xl border border-gray-800 bg-black/90 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Start a new collaboration project</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                  placeholder="Enter project title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Project Type</Label>
                <Select
                  value={newProject.type}
                  onValueChange={(value) => setNewProject({ ...newProject, type: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Fullstack">Fullstack</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Blockchain">Blockchain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-gray-900 border-gray-700 focus:border-primary-teal min-h-[100px]"
                placeholder="Describe your project..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                  placeholder="React, Node.js, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={newProject.duration}
                  onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                  placeholder="2 months"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={newProject.difficulty}
                  onValueChange={(value: any) => setNewProject({ ...newProject, difficulty: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  playSound("medium")
                }}
                className="border-gray-800 hover:border-gray-700"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                className="bg-primary-teal hover:bg-primary-teal/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-800">
          <TabsTrigger value="active" className="data-[state=active]:bg-primary-teal data-[state=active]:text-white">
            Active ({filteredProjects("active").length})
          </TabsTrigger>
          <TabsTrigger value="available" className="data-[state=active]:bg-primary-pink data-[state=active]:text-white">
            Available ({filteredProjects("available").length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Completed ({filteredProjects("completed").length})
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
            Drafts ({filteredProjects("draft").length})
          </TabsTrigger>
        </TabsList>

        {/* Active Projects */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects("active").map((project) => (
              <Card
                key={project.id}
                className="border border-gray-800 bg-black/50 backdrop-blur-sm hover:border-primary-teal/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getStatusIcon(project.status)}
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{project.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2 bg-gray-800">
                      <div
                        className="h-full bg-gradient-to-r from-primary-teal to-primary-pink rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </Progress>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="bg-primary-teal/10 text-primary-teal border-primary-teal/20 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {project.participants.length}/{project.teamSize} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{project.duration}</span>
                    </div>
                  </div>

                  {project.deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        playSound("medium")
                        toast({
                          title: "Opening team chat",
                          description: "Redirecting to team chat...",
                        })
                        setTimeout(() => (window.location.href = "/chat"), 1000)
                      }}
                      className="flex-1 border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Team Chat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteProject(project.id)}
                      className="flex-1 border-gray-800 hover:border-green-500 hover:bg-green-500/10"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Available Projects */}
        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects("available").map((project) => (
              <Card
                key={project.id}
                className="border border-gray-800 bg-black/50 backdrop-blur-sm hover:border-primary-pink/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getStatusIcon(project.status)}
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{project.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      Open
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="bg-primary-pink/10 text-primary-pink border-primary-pink/20 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Looking for {project.teamSize - project.participants.length} more</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{project.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{project.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <span>{project.likes}</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      by <span className="text-primary-teal">{project.creator}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleApplyToProject(project.id)}
                      disabled={isLoading}
                      className="flex-1 bg-primary-pink hover:bg-primary-pink/90 text-white group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
                      <span className="relative z-10">{isLoading ? "Applying..." : "Apply to Join"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLikeProject(project.id)}
                      className="border-gray-800 hover:border-primary-pink hover:bg-primary-pink/10"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookmarkProject(project.id)}
                      className={`border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10 ${
                        project.bookmarked ? "bg-primary-teal/20 border-primary-teal" : ""
                      }`}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Projects */}
        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects("completed").map((project) => (
              <Card
                key={project.id}
                className="border border-gray-800 bg-black/50 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getStatusIcon(project.status)}
                        {project.title}
                        <Award className="h-4 w-4 text-yellow-500" />
                      </CardTitle>
                      <CardDescription className="mt-2">{project.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {project.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(project.rating!) ? "text-yellow-500 fill-current" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{project.rating}/5.0</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{project.participants.length} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{project.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{project.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <span>{project.likes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        playSound("medium")
                        toast({
                          title: "Project portfolio",
                          description: "Opening project showcase...",
                        })
                      }}
                      className="flex-1 border-gray-800 hover:border-green-500 hover:bg-green-500/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        playSound("medium")
                        toast({
                          title: "Sharing project",
                          description: "Project link copied to clipboard!",
                        })
                      }}
                      className="border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Draft Projects */}
        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects("draft").map((project) => (
              <Card
                key={project.id}
                className="border border-gray-800 bg-black/50 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getStatusIcon(project.status)}
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{project.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      Draft
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Team size: {project.teamSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{project.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        playSound("medium")
                        toast({
                          title: "Editing project",
                          description: "Opening project editor...",
                        })
                      }}
                      className="flex-1 border-gray-800 hover:border-yellow-500 hover:bg-yellow-500/10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handlePublishProject(project.id)}
                      className="flex-1 bg-primary-teal hover:bg-primary-teal/90 text-white"
                    >
                      Publish
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="border-gray-800 hover:border-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
