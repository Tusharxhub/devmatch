"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Save,
  Github,
  Bell,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Users,
  Code,
  Star,
  X,
  Plus,
  Download,
} from "lucide-react"
import Image from "next/image"

const handleSaveChanges = () => {
  alert("Settings saved successfully!")
}

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button className="bg-squid-pink hover:bg-squid-pink/90" onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-pink-500">
                    <Image
                      src="/placeholder.jpg?height=96&width=96"
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Remove Photo
                    </Button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Tushar Kanti" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Dey" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" defaultValue="Tusharxhub" />
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
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://darkaura.me" />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Skills</Label>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Skill
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "TypeScript", "React", "Node.js", "Python", "Docker"].map((skill) => (
                      <Badge key={skill} variant="outline" className="border-pink-500/20 text-pink-500 px-3 py-1">
                        {skill}
                        <X className="ml-2 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collaboration Preferences */}
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Collaboration Preferences</CardTitle>
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
                    {["Frontend", "Backend", "Full Stack", "Mobile", "AI/ML", "DevOps", "Open Source"].map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="cursor-pointer hover:bg-pink-500/10 border-pink-500/20"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label>Timezone</Label>
                    <Select defaultValue="pst">
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
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="thetushardev0@gmail.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="Tusharxhub" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="Enter new password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                      </div>
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Enhance your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>

                {twoFactorEnabled && (
                  <div className="space-y-4 p-4 border border-pink-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-pink-500" />
                      <span className="font-medium">Authenticator App</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use an authenticator app like Google Authenticator or Authy to generate verification codes.
                    </p>
                    <Button variant="outline" size="sm">
                      Setup Authenticator
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Active Sessions</h4>
                  <div className="space-y-3">
                    {[
                      { device: "Asus TUF Gaming A15", location: "Barasat,India-700126", current: true },
                      { device: "Sumsung Galaxy S21 fe", location: "Barasat,India-700126", current: false },
                      { device: "Brave on Windows", location: "Barasat,India-700126", current: false },
                    ].map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} {session.current && "(Current session)"}
                          </p>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Who can see your profile</p>
                    </div>
                    <Select defaultValue="public">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Everyone</SelectItem>
                        <SelectItem value="members">Members only</SelectItem>
                        <SelectItem value="connections">Connections only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show GitHub Activity</Label>
                      <p className="text-sm text-muted-foreground">Display your GitHub contributions on your profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Project History</Label>
                      <p className="text-sm text-muted-foreground">Display your completed collaborations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">Let other developers message you directly</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data & Analytics</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Usage Analytics</Label>
                        <p className="text-sm text-muted-foreground">Help improve DevMatch with anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Personalized Recommendations</Label>
                        <p className="text-sm text-muted-foreground">Use your activity to suggest better matches</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {[
                    {
                      category: "Matches & Connections",
                      icon: Users,
                      notifications: [
                        {
                          name: "New matches",
                          description: "When you match with another developer",
                          email: true,
                          push: true,
                        },
                        {
                          name: "Connection requests",
                          description: "When someone wants to connect",
                          email: true,
                          push: true,
                        },
                        {
                          name: "Profile views",
                          description: "When someone views your profile",
                          email: false,
                          push: false,
                        },
                      ],
                    },
                    {
                      category: "Messages & Communication",
                      icon: MessageSquare,
                      notifications: [
                        {
                          name: "Direct messages",
                          description: "New messages from other developers",
                          email: true,
                          push: true,
                        },
                        { name: "Group messages", description: "Messages in project groups", email: false, push: true },
                        {
                          name: "Video call invites",
                          description: "When someone invites you to a call",
                          email: true,
                          push: true,
                        },
                      ],
                    },
                    {
                      category: "Projects & Collaborations",
                      icon: Code,
                      notifications: [
                        {
                          name: "Project invitations",
                          description: "When you're invited to join a project",
                          email: true,
                          push: true,
                        },
                        {
                          name: "Project updates",
                          description: "Updates from your active projects",
                          email: false,
                          push: true,
                        },
                        {
                          name: "Milestone completions",
                          description: "When project milestones are reached",
                          email: true,
                          push: false,
                        },
                      ],
                    },
                    {
                      category: "Platform Updates",
                      icon: Bell,
                      notifications: [
                        {
                          name: "Feature announcements",
                          description: "New features and updates",
                          email: true,
                          push: false,
                        },
                        {
                          name: "Security alerts",
                          description: "Important security notifications",
                          email: true,
                          push: true,
                        },
                        {
                          name: "Weekly digest",
                          description: "Weekly summary of your activity",
                          email: true,
                          push: false,
                        },
                      ],
                    },
                  ].map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <section.icon className="h-5 w-5 text-pink-500" />
                        <h4 className="font-medium">{section.category}</h4>
                      </div>
                      <div className="space-y-4 pl-7">
                        {section.notifications.map((notification, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">{notification.name}</Label>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <Switch defaultChecked={notification.email} />
                              </div>
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <Switch defaultChecked={notification.push} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {sectionIndex < 3 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Manage your connected accounts and integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    name: "GitHub",
                    description: "Connect your GitHub account to showcase your repositories and contributions",
                    icon: Github,
                    connected: true,
                    username: "Tusharxhub",
                  },
                  {
                    name: "Stack Overflow",
                    description: "Link your Stack Overflow profile to display your expertise and reputation",
                    icon: Star,
                    connected: false,
                    username: null,
                  },
                  {
                    name: "LinkedIn",
                    description: "Import your professional experience and network",
                    icon: Users,
                    connected: false,
                    username: null,
                  },
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <integration.icon className="h-6 w-6 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        {integration.connected && integration.username && (
                          <p className="text-sm text-pink-500">Connected as @{integration.username}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected ? (
                        <>
                          <Button variant="outline" size="sm">
                            Sync Now
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Manage your API keys and third-party access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Personal Access Token</h4>
                    <p className="text-sm text-muted-foreground">Use this token to access the DevMatch API</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="mr-2 h-4 w-4" />
                    Generate Token
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Download your data and account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Export Account Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download all your profile data, messages, and project history
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Request Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account status and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Deactivate Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable your account. You can reactivate it anytime.
                      </p>
                    </div>
                    <Button variant="outline">Deactivate</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your
                            data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
