// app/(dashboard)/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Users, 
  MessageSquare, 
  Activity, 
  Star, 
  Code2, 
  ArrowRight, 
} from "lucide-react";
import Link from "next/link"
import Container from "@/components/ui/container"
import Card from "@/components/ui/card"
import Badge from "@/components/ui/badge"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [profile, matchCount, messageCount, topMatches] = await Promise.all([
    prisma.githubProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.matchScore.count({ where: { userId: session.user.id } }),
    prisma.message.count({
      where: { OR: [{ senderId: session.user.id }, { receiverId: session.user.id }] },
    }),
    prisma.matchScore.findMany({
      where: { userId: session.user.id },
      orderBy: { overallScore: "desc" },
      take: 5,
      include: {
        targetUser: {
          select: {
            id: true, name: true, image: true,
            githubProfile: { select: { username: true, experienceLevel: true, topLanguages: true } },
          },
        },
      },
    }),
  ]);

  const topLangs = (profile?.topLanguages as Array<{ name: string; percentage: number; color: string }>) || [];

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Container>
        {/* Header */}
        <div className="py-8 border-b border-line">
          <h1 className="text-heading-xl">Welcome back, {session.user.name?.split(" ")[0]}</h1>
          <p className="text-body-sm text-[#b0b0b8] mt-2">Here&apos;s your developer network overview</p>
        </div>

        {/* Stats Grid */}
        <div className="py-8 border-b border-line">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Matches", value: matchCount },
              { icon: MessageSquare, label: "Messages", value: messageCount },
              { icon: Star, label: "Stars", value: profile?.totalStars || 0 },
              { icon: Activity, label: "Contributions", value: profile?.contributions || 0 },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-[#ff2e63]" />
                  <span className="text-xs text-[#9ca3af] uppercase tracking-wide">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-[#eaeaf0]">{stat.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Languages & Matches Grid */}
        <div className="py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Top Languages */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-[#ff2e63]" />
                <h2 className="text-heading-md">Top Languages</h2>
              </div>
              
              {topLangs.length > 0 ? (
                <Card variant="default">
                  <div className="space-y-3">
                    {topLangs.slice(0, 8).map((lang) => (
                      <div key={lang.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                          <span className="text-sm text-[#eaeaf0]">{lang.name}</span>
                        </div>
                        <span className="text-xs text-[#9ca3af]">{lang.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card variant="default">
                  <p className="text-sm text-[#9ca3af]">Syncing your GitHub data...</p>
                </Card>
              )}
            </div>

            {/* Top Matches */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#ff2e63]" />
                  <h2 className="text-heading-md">Your Top Matches</h2>
                </div>
                <Link href="/dashboard/matches" className="text-sm text-[#ff2e63] hover:text-[#00ffa3] transition-colors flex items-center gap-1">
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {topMatches.length > 0 ? (
                <div className="space-y-3">
                  {topMatches.map((match) => (
                    <Link
                      key={match.id}
                      href={`/dashboard/matches/${match.targetUser.id}`}
                    >
                      <Card variant="interactive" className="group">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[#eaeaf0] truncate">{match.targetUser.name}</div>
                            <div className="text-xs text-[#9ca3af] mt-1">
                              @{match.targetUser.githubProfile?.username}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xl font-bold text-[#ff2e63]">
                              {Math.round(match.overallScore)}
                            </div>
                            <div className="text-xs text-[#9ca3af]">match</div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card variant="default">
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-[#9ca3af]/30 mx-auto mb-3" />
                    <p className="text-sm text-[#9ca3af]">No matches yet. Analyzing your profile...</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
