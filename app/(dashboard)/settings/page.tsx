"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Shield,
  Bell,
  Link,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Save,
  RefreshCw,
  AlertTriangle,
  Smartphone,
  Mail,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function SettingsPage() {
  const { playSound } = useSound()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [settings, setSettings] = useState({
    // Profile settings
    displayName: "Alex Developer",
    email: "alex@example.com",
    bio: "Full-stack developer passionate about React and Node.js",
    location: "San Francisco, CA",
    website: "https://alexdev.com",
    avatar: "",

    // Account settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    sessionTimeout: "24",
    loginNotifications: true,

    // Privacy settings
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    showActivity: true,
    allowMessages: true,
    searchable: true,
    showOnlineStatus: true,

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    matchNotifications: true,
    messageNotifications: true,
    projectNotifications: true,
    weeklyDigest: true,
    marketingEmails: false,
    securityAlerts: true,

    // Integration settings
    githubConnected: true,
    githubUsername: "alexdev",
    stackOverflowConnected: false,
    stackOverflowId: "",
    linkedinConnected: false,
    linkedinProfile: "",
    twitterConnected: false,
    twitterHandle: "",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async (section: string) => {
    setIsLoading(true)
    playSound("medium")

    // Simulate API call
    setTimeout(() => {
      playSound("success")
      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully.`,
      })
      setHasUnsavedChanges(false)
      setIsLoading(false)
    }, 1500)
  }

  const handlePasswordChange = async () => {
    const errors = []

    if (!settings.currentPassword) errors.push("Current password is required")
    if (!settings.newPassword) errors.push("New password is required")
    if (!settings.confirmPassword) errors.push("Password confirmation is required")
    if (settings.newPassword !== settings.confirmPassword) errors.push("Passwords don't match")
    if (settings.newPassword.length < 8) errors.push("New password must be at least 8 characters")
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(settings.newPassword)) {
      errors.push("Password must contain uppercase, lowercase, and numbers")
    }

    if (errors.length > 0) {
      playSound("error")
      toast({
        title: "Password change failed",
        description: errors[0],
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    playSound("medium")

    // Simulate password change
    setTimeout(() => {
      playSound("success")
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed. Please log in again.",
      })

      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      setIsLoading(false)
    }, 2000)
  }

  const handleDataExport = async () => {
    setIsLoading(true)
    playSound("medium")

    toast({
      title: "Preparing data export",
      description: "This may take a few moments...",
    })

    // Simulate data preparation
    setTimeout(() => {
      const data = {
        profile: settings,
        exportDate: new Date().toISOString(),
        version: "1.0",
        projects: [],
        messages: [],
        connections: [],
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `devmatch-data-${new Date().toISOString().split("T")[0]}.json`
      a.click()

      playSound("success")
      toast({
        title: "Data export complete",
        description: "Your data has been downloaded successfully.",
      })
      setIsLoading(false)
    }, 3000)
  }

  const handleAccountDeletion = () => {
    setShowDeleteDialog(true)
  }

  const confirmAccountDeletion = async () => {
    const finalConfirm = window.prompt("Type 'DELETE' to confirm account deletion:")

    if (finalConfirm === "DELETE") {
      setIsLoading(true)
      playSound("error")

      setTimeout(() => {
        toast({
          title: "Account deletion initiated",
          description: "Your account will be deleted within 24 hours. Contact support to cancel.",
          variant: "destructive",
        })
        setShowDeleteDialog(false)
        setIsLoading(false)
      }, 2000)
    } else {
      toast({
        title: "Account deletion cancelled",
        description: "Your account is safe.",
      })
    }
  }

  const handleIntegrationConnect = async (platform: string) => {
    setIsLoading(true)
    playSound("medium")

    // Simulate OAuth flow
    setTimeout(() => {
      const isConnected = settings[`${platform}Connected` as keyof typeof settings]

      if (isConnected) {
        // Disconnect
        handleSettingChange(`${platform}Connected`, false)
        handleSettingChange(`${platform}Username`, "")
        playSound("medium")
        toast({
          title: `${platform} disconnected`,
          description: `Your ${platform} account has been disconnected.`,
        })
      } else {
        // Connect
        handleSettingChange(`${platform}Connected`, true)
        handleSettingChange(`${platform}Username`, `user_${platform}`)
        playSound("success")
        toast({
          title: `${platform} connected`,
          description: `Your ${platform} account has been connected successfully.`,
        })
      }
      setIsLoading(false)
    }, 2000)
  }

  const handleTestNotification = (type: string) => {
    playSound("high")
    toast({
      title: `Test ${type} notification`,
      description: `This is how your ${type} notifications will appear.`,
    })
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Unsaved changes</span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-gray-900 border border-gray-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary-teal data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-primary-pink data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-primary-teal data-[state=active]:text-white">
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary-pink data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:bg-primary-teal data-[state=active]:text-white"
          >
            <Link className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => handleSettingChange("displayName", e.target.value)}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange("email", e.target.value)}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => handleSettingChange("bio", e.target.value)}
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal min-h-[100px]"
                  placeholder="Tell others about yourself..."
                />
                <p className="text-xs text-muted-foreground">{settings.bio.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => handleSettingChange("location", e.target.value)}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => handleSettingChange("website", e.target.value)}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Profile")}
                  disabled={isLoading}
                  className="bg-primary-teal hover:bg-primary-teal/90 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) => handleSettingChange("currentPassword", e.target.value)}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 hover:bg-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={settings.newPassword}
                  onChange={(e) => handleSettingChange("newPassword", e.target.value)}
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={settings.confirmPassword}
                  onChange={(e) => handleSettingChange("confirmPassword", e.target.value)}
                  className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                  className="bg-primary-pink hover:bg-primary-pink/90 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    handleSettingChange("twoFactorEnabled", checked)
                    playSound("medium")
                    toast({
                      title: checked ? "2FA enabled" : "2FA disabled",
                      description: checked
                        ? "Two-factor authentication has been enabled."
                        : "Two-factor authentication has been disabled.",
                    })
                  }}
                  className="data-[state=checked]:bg-primary-teal"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                </div>
                <Switch
                  checked={settings.loginNotifications}
                  onCheckedChange={(checked) => handleSettingChange("loginNotifications", checked)}
                  className="data-[state=checked]:bg-primary-teal"
                />
              </div>

              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select
                  value={settings.sessionTimeout}
                  onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Profile Visibility</CardTitle>
              <CardDescription>Control who can see your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) => handleSettingChange("profileVisibility", value)}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                    <SelectItem value="members">Members only - Only DevMatch users</SelectItem>
                    <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your email</p>
                  </div>
                  <Switch
                    checked={settings.showEmail}
                    onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Location</Label>
                    <p className="text-sm text-muted-foreground">Display your location on your profile</p>
                  </div>
                  <Switch
                    checked={settings.showLocation}
                    onCheckedChange={(checked) => handleSettingChange("showLocation", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Activity Status</Label>
                    <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                  </div>
                  <Switch
                    checked={settings.showActivity}
                    onCheckedChange={(checked) => handleSettingChange("showActivity", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Let other developers message you</p>
                  </div>
                  <Switch
                    checked={settings.allowMessages}
                    onCheckedChange={(checked) => handleSettingChange("allowMessages", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Searchable Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow your profile to appear in search results</p>
                  </div>
                  <Switch
                    checked={settings.searchable}
                    onCheckedChange={(checked) => handleSettingChange("searchable", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">Display when you're online to others</p>
                  </div>
                  <Switch
                    checked={settings.showOnlineStatus}
                    onCheckedChange={(checked) => handleSettingChange("showOnlineStatus", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Privacy")}
                  disabled={isLoading}
                  className="bg-primary-teal hover:bg-primary-teal/90 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Privacy Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                      className="data-[state=checked]:bg-primary-pink"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestNotification("email")}
                      className="border-gray-800 hover:border-primary-pink hover:bg-primary-pink/10"
                    >
                      Test
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                      className="data-[state=checked]:bg-primary-pink"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestNotification("push")}
                      className="border-gray-800 hover:border-primary-pink hover:bg-primary-pink/10"
                    >
                      Test
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Matches</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new developer matches</p>
                  </div>
                  <Switch
                    checked={settings.matchNotifications}
                    onCheckedChange={(checked) => handleSettingChange("matchNotifications", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                  </div>
                  <Switch
                    checked={settings.messageNotifications}
                    onCheckedChange={(checked) => handleSettingChange("messageNotifications", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about project activities</p>
                  </div>
                  <Switch
                    checked={settings.projectNotifications}
                    onCheckedChange={(checked) => handleSettingChange("projectNotifications", checked)}
                    className="data-[state=checked]:bg-primary-pink"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary email</p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                    className="data-[state=checked]:bg-primary-pink"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Important security notifications</p>
                  </div>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => handleSettingChange("securityAlerts", checked)}
                    className="data-[state=checked]:bg-red-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Notification")}
                  disabled={isLoading}
                  className="bg-primary-pink hover:bg-primary-pink/90 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Notification Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Connected Accounts
              </CardTitle>
              <CardDescription>Manage your connected developer accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <Github className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">GitHub</h4>
                      <p className="text-sm text-muted-foreground">
                        {settings.githubConnected ? `Connected as @${settings.githubUsername}` : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={settings.githubConnected ? "outline" : "default"}
                    onClick={() => handleIntegrationConnect("github")}
                    disabled={isLoading}
                    className={
                      settings.githubConnected
                        ? "border-gray-800 hover:border-red-500 hover:bg-red-500/10"
                        : "bg-primary-teal hover:bg-primary-teal/90 text-white"
                    }
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : settings.githubConnected ? (
                      "Disconnect"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">SO</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Stack Overflow</h4>
                      <p className="text-sm text-muted-foreground">
                        {settings.stackOverflowConnected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={settings.stackOverflowConnected ? "outline" : "default"}
                    onClick={() => handleIntegrationConnect("stackOverflow")}
                    disabled={isLoading}
                    className={
                      settings.stackOverflowConnected
                        ? "border-gray-800 hover:border-red-500 hover:bg-red-500/10"
                        : "bg-primary-pink hover:bg-primary-pink/90 text-white"
                    }
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : settings.stackOverflowConnected ? (
                      "Disconnect"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Linkedin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">LinkedIn</h4>
                      <p className="text-sm text-muted-foreground">
                        {settings.linkedinConnected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={settings.linkedinConnected ? "outline" : "default"}
                    onClick={() => handleIntegrationConnect("linkedin")}
                    disabled={isLoading}
                    className={
                      settings.linkedinConnected
                        ? "border-gray-800 hover:border-red-500 hover:bg-red-500/10"
                        : "bg-primary-teal hover:bg-primary-teal/90 text-white"
                    }
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : settings.linkedinConnected ? (
                      "Disconnect"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                      <Twitter className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Twitter</h4>
                      <p className="text-sm text-muted-foreground">
                        {settings.twitterConnected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={settings.twitterConnected ? "outline" : "default"}
                    onClick={() => handleIntegrationConnect("twitter")}
                    disabled={isLoading}
                    className={
                      settings.twitterConnected
                        ? "border-gray-800 hover:border-red-500 hover:bg-red-500/10"
                        : "bg-primary-pink hover:bg-primary-pink/90 text-white"
                    }
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : settings.twitterConnected ? (
                      "Disconnect"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Advanced Settings */}
      <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Data management and account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium">Export Data</h4>
              <p className="text-sm text-muted-foreground">Download a copy of your account data</p>
            </div>
            <Button
              variant="outline"
              onClick={handleDataExport}
              disabled={isLoading}
              className="border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-800 rounded-lg bg-red-500/5">
            <div>
              <h4 className="font-medium text-red-400">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button
              variant="outline"
              onClick={handleAccountDeletion}
              className="border-red-800 text-red-400 hover:border-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md border border-red-800 bg-black/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="font-medium text-red-400 mb-2">What will be deleted:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your profile and personal information</li>
                <li>• All your projects and collaborations</li>
                <li>• Your messages and connections</li>
                <li>• Your account settings and preferences</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="border-gray-800 hover:border-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAccountDeletion}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-600/90 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
