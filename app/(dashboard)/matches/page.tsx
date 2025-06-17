"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import { Heart, X, MessageSquare, Filter, Search, MapPin, Clock, Star, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Developer {
  id: string
  name: string
  title: string
  location: string
  timezone: string
  bio: string
  skills: string[]
  matchScore: number
  avatar: string
  githubStats: {
    repos: number
    stars: number
    followers: number
  }
  availability: boolean
  projectTypes: string[]
}

export default function MatchesPage() {
  const { playSound } = useSound()
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSkill, setFilterSkill] = useState("All Skills")
  const [filterTimezone, setFilterTimezone] = useState("All Timezones")
  const [isLoading, setIsLoading] = useState(false)
  const [filterTimeout, setFilterTimeout] = useState<NodeJS.Timeout | null>(null)

  const [developers] = useState<Developer[]>([
    {
      id: "1",
      name: "Sarah Chen",
      title: "Full-Stack Developer",
      location: "Seattle, WA",
      timezone: "America/Los_Angeles",
      bio: "Passionate about React and Node.js. Love building scalable web applications and contributing to open source.",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
      matchScore: 94,
      avatar: "SC",
      githubStats: { repos: 32, stars: 245, followers: 156 },
      availability: true,
      projectTypes: ["Frontend", "Fullstack"],
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      title: "Backend Engineer",
      location: "Austin, TX",
      timezone: "America/Chicago",
      bio: "Microservices architect with expertise in Python and Go. Building the future of distributed systems.",
      skills: ["Python", "Go", "Docker", "Kubernetes", "MongoDB"],
      matchScore: 87,
      avatar: "MR",
      githubStats: { repos: 28, stars: 189, followers: 98 },
      availability: true,
      projectTypes: ["Backend", "DevOps"],
    },
    {
      id: "3",
      name: "Emily Watson",
      title: "Frontend Specialist",
      location: "London, UK",
      timezone: "Europe/London",
      bio: "UI/UX focused developer who loves creating beautiful, accessible web experiences with modern frameworks.",
      skills: ["Vue.js", "React", "CSS", "Figma", "TypeScript"],
      matchScore: 91,
      avatar: "EW",
      githubStats: { repos: 45, stars: 312, followers: 203 },
      availability: false,
      projectTypes: ["Frontend", "Design"],
    },
    {
      id: "4",
      name: "David Kim",
      title: "AI/ML Engineer",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      bio: "Machine learning enthusiast working on computer vision and NLP projects. Always excited about new AI breakthroughs.",
      skills: ["Python", "TensorFlow", "PyTorch", "Jupyter", "Docker"],
      matchScore: 82,
      avatar: "DK",
      githubStats: { repos: 19, stars: 567, followers: 289 },
      availability: true,
      projectTypes: ["AI/ML", "Backend"],
    },
    {
      id: "5",
      name: "Lisa Thompson",
      title: "DevOps Engineer",
      location: "Toronto, CA",
      timezone: "America/Toronto",
      bio: "Infrastructure automation expert. Passionate about CI/CD, cloud architecture, and making deployments seamless.",
      skills: ["AWS", "Terraform", "Jenkins", "Docker", "Python"],
      matchScore: 78,
      avatar: "LT",
      githubStats: { repos: 23, stars: 134, followers: 87 },
      availability: true,
      projectTypes: ["DevOps", "Backend"],
    },
  ])

  const currentDeveloper = developers[currentIndex]

  const handleLike = () => {
    setIsLoading(true)
    playSound("success")

    setTimeout(() => {
      toast({
        title: "Match sent! 💖",
        description: `You've sent a collaboration request to ${currentDeveloper.name}. They'll be notified!`,
      })

      // Move to next developer and update queue
      if (currentIndex < developers.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex(0)
      }

      setIsLoading(false)
    }, 1000)
  }

  const handlePass = () => {
    setIsLoading(true)
    playSound("medium")

    // Add slide animation
    const matchCard = document.querySelector("[data-match-card]")
    if (matchCard) {
      matchCard.classList.add("animate-slide-out-left")
    }

    setTimeout(() => {
      nextDeveloper()
      setIsLoading(false)

      if (matchCard) {
        matchCard.classList.remove("animate-slide-out-left")
      }
    }, 300)
  }

  const handleMessage = () => {
    playSound("medium")
    toast({
      title: "Opening chat 💬",
      description: `Starting conversation with ${currentDeveloper.name}...`,
    })

    setTimeout(() => {
      // In a real app, this would navigate to chat with pre-filled recipient
      window.location.href = "/chat"
    }, 1500)
  }

  const nextDeveloper = () => {
    if (currentIndex < developers.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const filteredDevelopers = developers.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSkill = filterSkill === "All Skills" || dev.skills.includes(filterSkill)
    const matchesTimezone = filterTimezone === "All Timezones" || dev.timezone === filterTimezone
    return matchesSearch && matchesSkill && matchesTimezone
  })

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    if (filterTimeout) {
      clearTimeout(filterTimeout)
    }

    const timeout = setTimeout(() => {
      const filtered = developers.filter((dev) => {
        const matchesSearch =
          dev.name.toLowerCase().includes(value.toLowerCase()) ||
          dev.skills.some((skill) => skill.toLowerCase().includes(value.toLowerCase())) ||
          dev.bio.toLowerCase().includes(value.toLowerCase())
        const matchesSkill = filterSkill === "All Skills" || dev.skills.includes(filterSkill)
        const matchesTimezone = filterTimezone === "All Timezones" || dev.timezone === filterTimezone
        return matchesSearch && matchesSkill && matchesTimezone
      })

      playSound("high")
      toast({
        title: "Search updated",
        description: `Found ${filtered.length} matching developers.`,
      })
    }, 300)

    setFilterTimeout(timeout)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Matches</h1>
          <p className="text-muted-foreground">Discover developers who match your skills and interests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary-teal/10 text-primary-teal border-primary-teal/20">
            {filteredDevelopers.length} matches found
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-gray-900 border-gray-700 focus:border-primary-teal pl-10"
              />
            </div>
            <Select value={filterSkill} onValueChange={setFilterSkill}>
              <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="All Skills">All Skills</SelectItem>
                <SelectItem value="React">React</SelectItem>
                <SelectItem value="TypeScript">TypeScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Node.js">Node.js</SelectItem>
                <SelectItem value="AWS">AWS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTimezone} onValueChange={setFilterTimezone}>
              <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                <SelectValue placeholder="Filter by timezone" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="All Timezones">All Timezones</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="Europe/London">GMT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main matching interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current match card */}
        <div className="lg:col-span-2">
          {currentDeveloper && (
            <Card
              data-match-card
              className={cn(
                "border border-gray-800 bg-black/50 backdrop-blur-sm relative overflow-hidden group",
                isLoading && "pointer-events-none opacity-75",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/5 to-primary-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center text-white font-bold text-xl">
                      {currentDeveloper.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{currentDeveloper.name}</CardTitle>
                      <CardDescription className="text-base">{currentDeveloper.title}</CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {currentDeveloper.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {currentDeveloper.timezone.split("/")[1].replace("_", " ")}
                        </span>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${currentDeveloper.availability ? "bg-primary-teal" : "bg-gray-600"}`}
                          />
                          <span>{currentDeveloper.availability ? "Available" : "Busy"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-pink">{currentDeveloper.matchScore}%</div>
                    <div className="text-sm text-muted-foreground">Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <p className="text-muted-foreground">{currentDeveloper.bio}</p>

                <div>
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentDeveloper.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-primary-teal/10 text-primary-teal border-primary-teal/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Project Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentDeveloper.projectTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="bg-primary-pink/10 text-primary-pink border-primary-pink/20"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg border border-gray-800 bg-black/30">
                  <div className="text-center">
                    <div className="text-lg font-bold">{currentDeveloper.githubStats.repos}</div>
                    <div className="text-xs text-muted-foreground">Repositories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {currentDeveloper.githubStats.stars}
                    </div>
                    <div className="text-xs text-muted-foreground">Stars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{currentDeveloper.githubStats.followers}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePass}
                    className="flex-1 border-gray-800 hover:border-red-500 hover:bg-red-500/10 group"
                  >
                    <X className="h-5 w-5 mr-2 group-hover:text-red-500" />
                    Pass
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleMessage}
                    className="flex-1 border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10 group"
                  >
                    <MessageSquare className="h-5 w-5 mr-2 group-hover:text-primary-teal" />
                    Message
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleLike}
                    className="flex-1 bg-primary-pink hover:bg-primary-pink/90 text-white group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
                    <span className="relative z-10 flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Collaborate
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Match queue */}
        <div className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Match Queue
              </CardTitle>
              <CardDescription>Upcoming developer profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {developers.slice(currentIndex + 1, currentIndex + 4).map((dev, index) => (
                <div
                  key={dev.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-black/30 hover:border-primary-teal transition-all cursor-pointer"
                  onClick={() => {
                    setCurrentIndex(currentIndex + index + 1)
                    playSound("medium")
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center text-white font-bold text-sm">
                    {dev.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{dev.name}</h4>
                    <p className="text-xs text-muted-foreground">{dev.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary-pink">{dev.matchScore}%</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Profiles viewed today</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Collaboration requests sent</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Messages received</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Match success rate</span>
                <span className="font-medium text-primary-teal">68%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
