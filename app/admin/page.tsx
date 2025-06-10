"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Users, Ban, CheckCircle, Eye, Trash2 } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-background to-background/80">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users, reports, and platform settings</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Users", value: "1,247", icon: Users, color: "text-blue-500" },
            { title: "Active Reports", value: "23", icon: AlertTriangle, color: "text-yellow-500" },
            { title: "Banned Users", value: "12", icon: Ban, color: "text-red-500" },
            { title: "Verified Users", value: "892", icon: CheckCircle, color: "text-green-500" },
          ].map((stat, index) => (
            <Card key={index} className="border-pink-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-lg">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="users" className="space-y-6">
              <Card className="border-pink-500/20">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input placeholder="Search users..." className="max-w-sm" />
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all-roles">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-roles">All Roles</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="mentor">Mentor</SelectItem>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          name: "Arpan Samanta",
                          email: "alex@example.com",
                          role: "Developer",
                          status: "Active",
                          joined: "2024-01-15",
                          verified: true,
                        },
                        {
                          name: "Arijit Ghorai",
                          email: "sarah@example.com",
                          role: "Developer",
                          status: "Active",
                          joined: "2024-01-10",
                          verified: true,
                        },
                        {
                          name: "Sudip Das",
                          email: "miguel@example.com",
                          role: "Mentor",
                          status: "Active",
                          joined: "2024-01-08",
                          verified: false,
                        },
                        {
                          name: "Samriddhi  Singha",
                          email: "emma@example.com",
                          role: "Recruiter",
                          status: "Suspended",
                          joined: "2024-01-05",
                          verified: true,
                        },
                        {
                          name: "Abhishek Singh",
                          email: "james@example.com",
                          role: "Developer",
                          status: "Active",
                          joined: "2024-01-03",
                          verified: true,
                        },
                      ].map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <Image
                                  src="/placeholder.jpg?height=32&width=32"
                                  alt={user.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={user.status === "Active" ? "default" : "destructive"}
                                className={user.status === "Active" ? "bg-green-500" : ""}
                              >
                                {user.status}
                              </Badge>
                              {user.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </div>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Ban className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card className="border-pink-500/20">
                <CardHeader>
                  <CardTitle>Reported Users</CardTitle>
                  <CardDescription>Review and manage user reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reported User</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          reportedUser: "Debasmita Bose",
                          reporter: "Baibhab Adhikari",
                          reason: "Inappropriate messages",
                          date: "2025-01-20",
                          status: "Pending",
                        },
                        {
                          reportedUser: "Shayam Sundar Barman",
                          reporter: "Arpita Das",
                          reason: "Spam behavior",
                          date: "2025-01-19",
                          status: "Under Review",
                        },
                        {
                          reportedUser: "Soma Chatterjee",
                          reporter: "Snahasish mandal",
                          reason: "Fake profile",
                          date: "2025-01-18",
                          status: "Resolved",
                        },
                      ].map((report, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <Image
                                  src="/placeholder.jpg?height=32&width=32"
                                  alt={report.reportedUser}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">{report.reportedUser}</span>
                            </div>
                          </TableCell>
                          <TableCell>{report.reporter}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.status === "Resolved"
                                  ? "default"
                                  : report.status === "Under Review"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={
                                report.status === "Resolved"
                                  ? "bg-green-500"
                                  : report.status === "Under Review"
                                    ? "bg-yellow-500"
                                    : ""
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                Review
                              </Button>
                              <Button variant="destructive" size="sm">
                                Ban User
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <Card className="border-pink-500/20">
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>Manage user roles and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        role: "Developer",
                        description: "Regular developer users who can match and collaborate",
                        count: 1089,
                        permissions: ["Create Profile", "Match with Others", "Send Messages", "Join Collaborations"],
                      },
                      {
                        role: "Mentor",
                        description: "Experienced developers who can mentor others",
                        count: 87,
                        permissions: [
                          "All Developer Permissions",
                          "Create Mentorship Programs",
                          "Access Mentee Analytics",
                        ],
                      },
                      {
                        role: "Recruiter",
                        description: "Company recruiters looking for talent",
                        count: 71,
                        permissions: ["View Developer Profiles", "Send Job Offers", "Access Talent Analytics"],
                      },
                    ].map((roleData, index) => (
                      <div key={index} className="border border-pink-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium">{roleData.role}</h3>
                            <p className="text-sm text-muted-foreground">{roleData.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{roleData.count}</p>
                            <p className="text-sm text-muted-foreground">users</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-2">
                            {roleData.permissions.map((permission, i) => (
                              <Badge key={i} variant="outline" className="border-teal-400/20 text-teal-400">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-pink-500/20">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings and features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">User Verification Required</p>
                      <p className="text-sm text-muted-foreground">Require users to verify their GitHub accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Auto-ban Spam Accounts</p>
                      <p className="text-sm text-muted-foreground">Automatically ban accounts flagged as spam</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Allow Recruiter Accounts</p>
                      <p className="text-sm text-muted-foreground">Allow company recruiters to create accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Enable AI Matching</p>
                      <p className="text-sm text-muted-foreground">Use AI to improve developer matching accuracy</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-pink-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-pink-500">+127</div>
                    <p className="text-sm text-muted-foreground">New users this month</p>
                  </CardContent>
                </Card>

                <Card className="border-pink-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Active Collaborations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-teal-400">342</div>
                    <p className="text-sm text-muted-foreground">Projects in progress</p>
                  </CardContent>
                </Card>

                <Card className="border-pink-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Match Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">87%</div>
                    <p className="text-sm text-muted-foreground">Successful matches</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
