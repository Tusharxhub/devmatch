import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Code, Star, GitFork, Users, Save, Plus, X } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your developer profile and preferences</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* GitHub Profile */}
      <Card className="border-pink-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">GitHub Profile</CardTitle>
              <CardDescription>Your GitHub data is automatically synced</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Github className="mr-2 h-4 w-4" />
              Sync GitHub
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-pink-500">
                <Image
                  src="/Tushar.jpg?height=96&width=96"
                  alt="GitHub Avatar"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Tushar</h3>
                <p className="text-muted-foreground">github.com/Tusharxhub</p>
                <p className="text-sm text-muted-foreground mt-1">Member since 2019</p>
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
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="border-pink-500/20">
        <CardHeader>
          <CardTitle className="text-xl">Basic Information</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" defaultValue="Tushar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="thetushardev0@gmail.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell other developers about yourself..."
              defaultValue="Full-stack developer passionate about building scalable web applications. I love working with React, Node.js, and exploring new technologies."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="Barasat,India-700126" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="ist">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                  <SelectItem value="cst">China Standard Time (CST)</SelectItem>
                  <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                  <SelectItem value="ict">Indochina Time (ICT)</SelectItem>
                  <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Technologies */}
      <Card className="border-pink-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Skills & Technologies</CardTitle>
              <CardDescription>Add your technical skills and expertise</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Programming Languages</Label>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust"].map((skill) => (
                  <Badge key={skill} variant="outline" className="border-pink-500/20 text-pink-500 px-3 py-1">
                    {skill}
                    <X className="ml-2 h-3 w-3 cursor-pointer" />
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-3 block">Frameworks & Libraries</Label>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "Node.js", "Express", "Vue.js", "Angular"].map((skill) => (
                  <Badge key={skill} variant="outline" className="border-teal-400/20 text-teal-400 px-3 py-1">
                    {skill}
                    <X className="ml-2 h-3 w-3 cursor-pointer" />
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-3 block">Tools & Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {["Git", "Docker", "AWS", "MongoDB", "PostgreSQL", "Redis"].map((skill) => (
                  <Badge key={skill} variant="outline" className="border-purple-400/20 text-purple-400 px-3 py-1">
                    {skill}
                    <X className="ml-2 h-3 w-3 cursor-pointer" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-pink-500/20">
        <CardHeader>
          <CardTitle className="text-xl">Collaboration Preferences</CardTitle>
          <CardDescription>Set your availability and project preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Available for Collaboration</Label>
              <p className="text-sm text-muted-foreground">Show your profile to other developers</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Project Types</Label>
            <div className="flex flex-wrap gap-2">
              {["Frontend", "Backend", "Full Stack", "Mobile", "AI/ML", "DevOps", "Open Source", "Freelance"].map(
                (type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="cursor-pointer hover:bg-pink-500/10 border-pink-500/20"
                  >
                    {type}
                  </Badge>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Commitment Level</Label>
            <Select defaultValue="part-time">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual (1-5 hours/week)</SelectItem>
                <SelectItem value="part-time">Part-time (5-20 hours/week)</SelectItem>
                <SelectItem value="full-time">Full-time (20+ hours/week)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Communication Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {["Slack", "Discord", "Email", "Video Calls", "In-person"].map((method) => (
                <Badge
                  key={method}
                  variant="outline"
                  className="cursor-pointer hover:bg-pink-500/10 border-pink-500/20"
                >
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stack Overflow Integration */}
      <Card className="border-pink-500/20">
        <CardHeader>
          <CardTitle className="text-xl">Stack Overflow Integration</CardTitle>
          <CardDescription>Connect your Stack Overflow profile to showcase your expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Stack Overflow Profile</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
