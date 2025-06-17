"use client"

import { Switch } from "@/components/ui/switch"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSound } from "@/components/sound-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  Search,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  TrendingUp,
  Activity,
  RefreshCw,
  Download,
  MessageSquare,
  Flag,
  UserCheck,
  UserX,
  Server,
  Globe,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "banned" | "suspended"
  joinDate: string
  projects: number
  reports: number
  lastActive: string
}

interface Report {
  id: string
  reportedUser: string
  reportedBy: string
  reason: string
  status: "pending" | "resolved" | "dismissed"
  date: string
  description: string
  severity: "low" | "medium" | "high"
}

export default function AdminPage() {
  const { playSound } = useSound()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(true)
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRole, setFilterRole] = useState("all")

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@example.com",
      role: "Developer",
      status: "active",
      joinDate: "2024-01-15",
      projects: 3,
      reports: 0,
      lastActive: "2024-02-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      email: "marcus@example.com",
      role: "Developer",
      status: "active",
      joinDate: "2024-01-20",
      projects: 2,
      reports: 0,
      lastActive: "2024-02-14T15:45:00Z",
    },
    {
      id: "3",
      name: "Spam User",
      email: "spam@example.com",
      role: "Developer",
      status: "banned",
      joinDate: "2024-02-01",
      projects: 0,
      reports: 5,
      lastActive: "2024-02-10T08:20:00Z",
    },
    {
      id: "4",
      name: "John Doe",
      email: "john@example.com",
      role: "Developer",
      status: "suspended",
      joinDate: "2024-01-10",
      projects: 1,
      reports: 2,
      lastActive: "2024-02-12T12:15:00Z",
    },
  ])

  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      reportedUser: "John Doe",
      reportedBy: "Jane Smith",
      reason: "Inappropriate behavior",
      status: "pending",
      date: "2024-02-10",
      description: "User was sending inappropriate messages in project chat",
      severity: "high",
    },
    {
      id: "2",
      reportedUser: "Spam User",
      reportedBy: "Multiple Users",
      reason: "Spam",
      status: "resolved",
      date: "2024-02-08",
      description: "User was sending spam messages to multiple developers",
      severity: "medium",
    },
    {
      id: "3",
      reportedUser: "Test User",
      reportedBy: "Admin",
      reason: "Fake profile",
      status: "pending",
      date: "2024-02-12",
      description: "Profile appears to be using fake information and stolen photos",
      severity: "high",
    },
  ])

  const [analytics, setAnalytics] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalProjects: 156,
    completedProjects: 89,
    userGrowth: 12.5,
    projectGrowth: 8.3,
    successRate: 68.2,
    pendingReports: 3,
    resolvedReports: 15,
    bannedUsers: 8,
  })

  const [platformSettings, setPlatformSettings] = useState({
    registrationStatus: "open",
    maintenanceMode: "disabled",
    maxProjectsPerUser: "10",
    messageRateLimit: "100",
    fileUploadLimit: "50",
    sessionTimeout: "24",
    requireEmailVerification: true,
    allowGuestViewing: true,
    enableAnalytics: true,
  })

  const handlePasswordSubmit = () => {
    if (password === "0000") {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
      playSound("success")
      toast({
        title: "Access granted",
        description: "Welcome to the admin panel.",
      })
    } else {
      playSound("error")
      toast({
        title: "Access denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    setIsLoading(true)
    playSound("medium")

    setTimeout(() => {
      switch (action) {
        case "View":
          setSelectedUser(user)
          setShowUserDialog(true)
          toast({
            title: "User profile opened",
            description: `Viewing detailed profile for ${user.name}`,
          })
          break
        case "Ban":
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "banned" as const } : u)))
          toast({
            title: "User banned",
            description: `${user.name} has been banned from the platform.`,
            variant: "destructive",
          })
          break
        case "Unban":
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "active" as const } : u)))
          toast({
            title: "User unbanned",
            description: `${user.name} has been restored to active status.`,
          })
          break
        case "Suspend":
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "suspended" as const } : u)))
          toast({
            title: "User suspended",
            description: `${user.name} has been temporarily suspended.`,
          })
          break
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleReportAction = async (reportId: string, action: string) => {
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    setIsLoading(true)
    playSound("medium")

    setTimeout(() => {
      if (action === "Approve") {
        setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" as const } : r)))
        playSound("success")
        toast({
          title: "Report approved",
          description: `Action has been taken against ${report.reportedUser}.`,
        })
      } else if (action === "Dismiss") {
        setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: "dismissed" as const } : r)))
        toast({
          title: "Report dismissed",
          description: "No action will be taken on this report.",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handlePlatformSettingsSave = async () => {
    setIsLoading(true)
    playSound("medium")

    setTimeout(() => {
      playSound("success")
      toast({
        title: "Platform settings saved",
        description: "All platform configuration changes have been applied.",
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleExportData = async (type: string) => {
    setIsLoading(true)
    playSound("medium")

    setTimeout(() => {
      let data: any = {}
      let filename = ""

      switch (type) {
        case "users":
          data = users
          filename = "users-export"
          break
        case "reports":
          data = reports
          filename = "reports-export"
          break
        case "analytics":
          data = analytics
          filename = "analytics-export"
          break
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`
      a.click()

      playSound("success")
      toast({
        title: "Data exported",
        description: `${type} data has been downloaded successfully.`,
      })
      setIsLoading(false)
    }, 2000)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesRole = filterRole === "all" || user.role === filterRole

    return matchesSearch && matchesStatus && matchesRole
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const handleRefreshAnalytics = async () => {
    setIsLoading(true)
    playSound("medium")

    setTimeout(() => {
      // Simulate fetching fresh analytics data
      setAnalytics((prev) => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        userGrowth: +(Math.random() * 20).toFixed(1),
        projectGrowth: +(Math.random() * 15).toFixed(1),
      }))

      playSound("success")
      toast({
        title: "Analytics refreshed",
        description: "Latest analytics data has been loaded.",
      })
      setIsLoading(false)
    }, 2000)
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={showPasswordDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md border border-gray-800 bg-black/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-pink" />
              Admin Access Required
            </DialogTitle>
            <DialogDescription>Enter the admin password to access the admin panel.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                className="bg-gray-900 border-gray-700 focus:border-primary-pink"
                placeholder="Enter admin password (hint: 0000)"
              />
            </div>
            <Button
              onClick={handlePasswordSubmit}
              className="w-full bg-primary-pink hover:bg-primary-pink/90 text-white"
            >
              Access Admin Panel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, reports, and platform settings.</p>
        </div>
        <Badge variant="outline" className="bg-primary-pink/10 text-primary-pink border-primary-pink/20 w-fit">
          <Shield className="h-4 w-4 mr-2" />
          Admin Access
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-900 border border-gray-800">
          <TabsTrigger value="users" className="data-[state=active]:bg-primary-teal data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-primary-pink data-[state=active]:text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary-teal data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary-pink data-[state=active]:text-white">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and their permissions</CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => handleExportData("users")}
                  disabled={isLoading}
                  className="border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-800 rounded-lg bg-black/30 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center text-white font-bold text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              user.status === "active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : user.status === "banned"
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }`}
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm hidden sm:block">
                        <div>{user.projects} projects</div>
                        <div className="text-muted-foreground">{user.reports} reports</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserAction(user.id, "View")}
                          disabled={isLoading}
                          className="border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user.status === "active" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "Suspend")}
                              disabled={isLoading}
                              className="border-gray-800 hover:border-yellow-500 hover:bg-yellow-500/10"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "Ban")}
                              disabled={isLoading}
                              className="border-gray-800 hover:border-red-500 hover:bg-red-500/10"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, "Unban")}
                            disabled={isLoading}
                            className="border-gray-800 hover:border-green-500 hover:bg-green-500/10"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Management */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>User Reports</CardTitle>
                  <CardDescription>Handle user reports and moderation</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleExportData("reports")}
                  disabled={isLoading}
                  className="border-gray-800 hover:border-primary-pink hover:bg-primary-pink/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 border border-gray-800 rounded-lg bg-black/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{report.reportedUser}</h4>
                          <Badge variant="outline" className={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Reported by: {report.reportedBy}</p>
                        <p className="text-sm text-muted-foreground">Date: {report.date}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          report.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : report.status === "resolved"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reason: {report.reason}</p>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    </div>
                    {report.status === "pending" && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReportAction(report.id, "Approve")}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-600/90 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportAction(report.id, "Dismiss")}
                          disabled={isLoading}
                          className="border-gray-800 hover:border-red-500 hover:bg-red-500/10"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            playSound("medium")
                            toast({
                              title: "Opening investigation",
                              description: "Loading detailed report information...",
                            })
                          }}
                          className="border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Investigate
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{analytics.userGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{analytics.projectGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.successRate}%</div>
                <p className="text-xs text-muted-foreground">Project completion rate</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Detailed analytics and insights</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRefreshAnalytics}
                    disabled={isLoading}
                    className="border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExportData("analytics")}
                    disabled={isLoading}
                    className="border-gray-800 hover:border-primary-teal hover:bg-primary-teal/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Analytics
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed Projects</span>
                      <span className="text-sm font-medium">{analytics.completedProjects}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-primary-teal h-2 rounded-full"
                        style={{ width: `${(analytics.completedProjects / analytics.totalProjects) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Engagement</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-primary-pink h-2 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">{analytics.pendingReports}</div>
                    <div className="text-sm text-muted-foreground">Pending Reports</div>
                  </div>
                  <div className="text-center p-4 border border-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{analytics.resolvedReports}</div>
                    <div className="text-sm text-muted-foreground">Resolved Reports</div>
                  </div>
                  <div className="text-center p-4 border border-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">{analytics.bannedUsers}</div>
                    <div className="text-sm text-muted-foreground">Banned Users</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Configure platform-wide settings and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Registration Status
                  </Label>
                  <Select
                    value={platformSettings.registrationStatus}
                    onValueChange={(value) => setPlatformSettings((prev) => ({ ...prev, registrationStatus: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="open">Open Registration</SelectItem>
                      <SelectItem value="invite">Invite Only</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Maintenance Mode
                  </Label>
                  <Select
                    value={platformSettings.maintenanceMode}
                    onValueChange={(value) => setPlatformSettings((prev) => ({ ...prev, maintenanceMode: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-primary-teal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Projects Per User</Label>
                  <Input
                    value={platformSettings.maxProjectsPerUser}
                    onChange={(e) => setPlatformSettings((prev) => ({ ...prev, maxProjectsPerUser: e.target.value }))}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message Rate Limit (per hour)</Label>
                  <Input
                    value={platformSettings.messageRateLimit}
                    onChange={(e) => setPlatformSettings((prev) => ({ ...prev, messageRateLimit: e.target.value }))}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>File Upload Limit (MB)</Label>
                  <Input
                    value={platformSettings.fileUploadLimit}
                    onChange={(e) => setPlatformSettings((prev) => ({ ...prev, fileUploadLimit: e.target.value }))}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (hours)</Label>
                  <Input
                    value={platformSettings.sessionTimeout}
                    onChange={(e) => setPlatformSettings((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
                    className="bg-gray-900 border-gray-700 focus:border-primary-teal"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify their email before accessing the platform
                    </p>
                  </div>
                  <Switch
                    checked={platformSettings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setPlatformSettings((prev) => ({ ...prev, requireEmailVerification: checked }))
                    }
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Guest Viewing</Label>
                    <p className="text-sm text-muted-foreground">Allow non-registered users to view public profiles</p>
                  </div>
                  <Switch
                    checked={platformSettings.allowGuestViewing}
                    onCheckedChange={(checked) =>
                      setPlatformSettings((prev) => ({ ...prev, allowGuestViewing: checked }))
                    }
                    className="data-[state=checked]:bg-primary-teal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Analytics</Label>
                    <p className="text-sm text-muted-foreground">Collect anonymous usage analytics</p>
                  </div>
                  <Switch
                    checked={platformSettings.enableAnalytics}
                    onCheckedChange={(checked) =>
                      setPlatformSettings((prev) => ({ ...prev, enableAnalytics: checked }))
                    }
                    className="data-[state=checked]:bg-primary-pink"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handlePlatformSettingsSave}
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
                      <Settings className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-2xl border border-gray-800 bg-black/90 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the selected user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-pink to-primary-teal flex items-center justify-center text-white font-bold text-lg">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedUser.role}</Badge>
                    <Badge
                      variant="outline"
                      className={`${
                        selectedUser.status === "active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : selectedUser.status === "banned"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : selectedUser.status === "suspended"
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : ""
                      }`}
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Join Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Active</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUser.lastActive).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Projects</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.projects} active projects</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reports</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.reports} reports filed</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUserDialog(false)}
                  className="border-gray-800 hover:border-gray-700"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    playSound("medium")
                    toast({
                      title: "Sending message",
                      description: `Opening chat with ${selectedUser.name}...`,
                    })
                  }}
                  className="bg-primary-teal hover:bg-primary-teal/90 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
