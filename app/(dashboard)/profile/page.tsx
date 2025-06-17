"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Plus, Github, Star, GitFork, MapPin, Clock, Code, Zap, AlertCircle } from "lucide-react"

interface ValidationErrors {
  [key: string]: string
}

export default function ProfilePage() {
  const { playSound } = useSound()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [profileData, setProfileData] = useState({
    name: "Alex Developer",
    email: "alex@example.com",
    bio: "Full-stack developer passionate about React and Node.js",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
    availability: true,
    projectTypes: ["Frontend", "Fullstack"],
    skills: ["React", "TypeScript", "Node.js", "Python", "GraphQL"],
    githubUsername: "alexdev",
    stackOverflowUsername: "alexcoder",
  })
  const [newSkill, setNewSkill] = useState("")

  const validateProfileData = (data: typeof profileData): ValidationErrors => {
    const errors: ValidationErrors = {}

    // Name validation
    if (!data.name.trim()) {
      errors.name = "Name is required"
    } else if (data.name.length < 2) {
      errors.name = "Name must be at least 2 characters"
    } else if (data.name.length > 50) {
      errors.name = "Name must be less than 50 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Bio validation
    if (data.bio.length > 500) {
      errors.bio = "Bio must be less than 500 characters"
    }

    // Location validation
    if (data.location.length > 100) {
      errors.location = "Location must be less than 100 characters"
    }

    // GitHub username validation
    if (data.githubUsername) {
      const githubRegex = /^[a-zA-Z0-9-]+$/
      if (!githubRegex.test(data.githubUsername)) {
        errors.githubUsername = "GitHub username can only contain letters, numbers, and hyphens"
      } else if (data.githubUsername.length < 3 || data.githubUsername.length > 39) {
        errors.githubUsername = "GitHub username must be between 3 and 39 characters"
      }
    }

    // Stack Overflow username validation
    if (data.stackOverflowUsername) {
      const soRegex = /^[a-zA-Z0-9-_]+$/
      if (!soRegex.test(data.stackOverflowUsername)) {
        errors.stackOverflowUsername =
          "Stack Overflow username can only contain letters, numbers, hyphens, and underscores"
      } else if (data.stackOverflowUsername.length < 3) {
        errors.stackOverflowUsername = "Stack Overflow username must be at least 3 characters"
      }
    }

    return errors
  }

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addSkill = () => {
    const trimmedSkill = newSkill.trim()

    if (!trimmedSkill) {
      playSound("error")
      toast({
        title: "Invalid skill",
        description: "Please enter a valid skill name.",
        variant: "destructive",
      })
      return
    }

    if (trimmedSkill.length < 2) {
      playSound("error")
      toast({
        title: "Skill too short",
        description: "Skill name must be at least 2 characters long.",
        variant: "destructive",
      })
      return
    }

    if (profileData.skills.includes(trimmedSkill)) {
      playSound("error")
      toast({
        title: "Duplicate skill",
        description: "This skill is already in your list.",
        variant: "destructive",
      })
      return
    }

    if (profileData.skills.length >= 20) {
      playSound("error")
      toast({
        title: "Too many skills",
        description: "You can add up to 20 skills maximum.",
        variant: "destructive",
      })
      return
    }

    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill],
    }))
    setNewSkill("")
    playSound("success")
    toast({
      title: "Skill added",
      description: `${trimmedSkill} has been added to your skills.`,
    })
  }

  const removeSkill = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
    playSound("medium")
  }

  const handleSave = async () => {
    // Validate profile data
    const validationErrors = validateProfileData(profileData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      playSound("error")
      toast({
        title: "Validation failed",
        description: "Please fix the errors in your profile before saving.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    playSound("medium")

    try {
      // Simulate API call with realistic processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      playSound("success")
      toast({
        title: "Profile updated successfully",
        description: "Your profile changes have been saved.",
      })
    } catch (error) {
      playSound("error")
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          playSound("error")
          toast({
            title: "File too large",
            description: "Please select an image smaller than 5MB.",
            variant: "destructive",
          })
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          playSound("success")
          toast({
            title: "Photo uploaded",
            description: "Your profile photo has been updated successfully.",
          })
          // In a real app, you'd upload to server here
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleGitHubRefresh = async () => {
    setIsLoading(true)
    playSound("medium")

    try {
      // Simulate API call to GitHub
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate updated stats
      const newStats = {
        repos: Math.floor(Math.random() * 10) + 20,
        stars: Math.floor(Math.random() * 50) + 120,
        forks: Math.floor(Math.random() * 20) + 40,
        followers: Math.floor(Math.random() * 30) + 70,
      }

      playSound("success")
      toast({
        title: "GitHub data refreshed",
        description: "Your GitHub statistics have been updated.",
      })
    } catch (error) {
      playSound("error")
      toast({
        title: "Refresh failed",
        description: "Could not fetch GitHub data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your developer profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Profile basics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
                  onClick={handlePhotoUpload}
                >
                  <Upload className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={handlePhotoUpload}
                    className="border-gray-800 hover:border-primary-teal"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`bg-gray-900 border-gray-700 focus:border-primary-teal ${
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-gray-900 border-gray-700 focus:border-primary-teal ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={`bg-gray-900 border-gray-700 focus:border-primary-teal min-h-[100px] ${
                    errors.bio ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="Tell other developers about yourself..."
                />
                <div className="flex justify-between items-center">
                  {errors.bio && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.bio}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">{profileData.bio.length}/500 characters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className={`bg-gray-900 border-gray-700 focus:border-primary-teal pl-10 ${
                        errors.location ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.location}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Europe/Berlin">Central European Time (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
              <CardDescription>Add your technical skills and expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., React, Python, AWS)"
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} className="bg-primary-teal hover:bg-primary-teal/90">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-primary-pink/10 text-primary-pink border-primary-pink/20 group cursor-pointer hover:bg-primary-pink/20 transition-colors"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill}
                    <X className="h-3 w-3 ml-1 group-hover:text-red-400" />
                  </Badge>
                ))}
              </div>
              {profileData.skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills added yet. Add your first skill above!</p>
              )}
            </CardContent>
          </Card>

          {/* Project Preferences */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Project Preferences</CardTitle>
              <CardDescription>What type of projects are you interested in?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Frontend", "Backend", "Fullstack", "Mobile", "AI/ML", "DevOps", "Design", "Data"].map((type) => (
                  <div
                    key={type}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                      profileData.projectTypes.includes(type)
                        ? "border-primary-teal bg-primary-teal/10 text-primary-teal"
                        : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
                    }`}
                    onClick={() => {
                      const newTypes = profileData.projectTypes.includes(type)
                        ? profileData.projectTypes.filter((t) => t !== type)
                        : [...profileData.projectTypes, type]
                      handleInputChange("projectTypes", newTypes)
                      playSound("medium")
                    }}
                  >
                    <div className="text-center">
                      <Code className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">{type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - GitHub stats and availability */}
        <div className="space-y-6">
          {/* Availability */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Let others know if you're available for collaboration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Available for projects</Label>
                  <p className="text-sm text-muted-foreground">Show as available to other developers</p>
                </div>
                <Switch
                  checked={profileData.availability}
                  onCheckedChange={(checked) => {
                    handleInputChange("availability", checked)
                    playSound("medium")
                    toast({
                      title: checked ? "Now available" : "Marked as busy",
                      description: checked
                        ? "Other developers can now see you're available for projects."
                        : "You're now marked as busy and won't receive new project requests.",
                    })
                  }}
                  className="data-[state=checked]:bg-primary-teal"
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    profileData.availability ? "bg-primary-teal" : "bg-gray-600"
                  }`}
                />
                <span className="text-sm">{profileData.availability ? "Available" : "Busy"}</span>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Stats */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Stats
              </CardTitle>
              <CardDescription>Auto-imported from your GitHub profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Public Repositories</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Stars Received
                  </span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    Forks
                  </span>
                  <span className="font-medium">56</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Followers</span>
                  <span className="font-medium">89</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                onClick={() => {
                  handleGitHubRefresh()
                }}
              >
                <Github className="h-4 w-4 mr-2" />
                Refresh GitHub Data
              </Button>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect your developer accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Username</Label>
                <Input
                  id="github"
                  value={profileData.githubUsername}
                  onChange={(e) => handleInputChange("githubUsername", e.target.value)}
                  className={`bg-gray-900 border-gray-700 focus:border-primary-teal ${
                    errors.githubUsername ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.githubUsername && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.githubUsername}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stackoverflow">Stack Overflow Username</Label>
                <Input
                  id="stackoverflow"
                  value={profileData.stackOverflowUsername}
                  onChange={(e) => handleInputChange("stackOverflowUsername", e.target.value)}
                  className={`bg-gray-900 border-gray-700 focus:border-primary-teal ${
                    errors.stackOverflowUsername ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.stackOverflowUsername && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.stackOverflowUsername}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary-pink hover:bg-primary-pink/90 text-white px-8 group relative overflow-hidden"
        >
          <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary-pink to-primary-teal group-hover:w-full transition-all duration-300 opacity-30"></span>
          <span className="relative z-10 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Profile"}
          </span>
        </Button>
      </div>
    </div>
  )
}
