// app/(dashboard)/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Star,
  GitFork,
  Code2,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="gradient-text">{session.user.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your developer profile overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Matches", value: matchCount, color: "text-violet-400", bg: "bg-violet-500/10" },
          { icon: MessageSquare, label: "Messages", value: messageCount, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { icon: Star, label: "Total Stars", value: profile?.totalStars || 0, color: "text-amber-400", bg: "bg-amber-500/10" },
          { icon: Activity, label: "Contributions", value: profile?.contributions || 0, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5 hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Languages */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-violet-400" />
              Top Languages
            </h2>
          </div>
          {topLangs.length > 0 ? (
            <div className="space-y-3">
              {topLangs.slice(0, 8).map((lang) => (
                <div key={lang.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                  <span className="text-sm font-medium flex-1">{lang.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                        style={{ width: `${Math.min(lang.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{lang.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Syncing your GitHub data...</p>
          )}
        </div>

        {/* Top Matches */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Top Matches
            </h2>
            <Link href="/dashboard/matches" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {topMatches.length > 0 ? (
            <div className="space-y-3">
              {topMatches.map((match) => {
                const targetLangs = (match.targetUser.githubProfile?.topLanguages as Array<{ name: string; color: string }>) || [];
                return (
                  <Link
                    key={match.id}
                    href={`/dashboard/matches`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Score ring */}
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="w-12 h-12" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                        <circle
                          cx="24" cy="24" r="20" fill="none" strokeWidth="2.5"
                          stroke="url(#scoreGrad)"
                          strokeDasharray={`${(match.overallScore / 100) * 125.6} 125.6`}
                          strokeLinecap="round"
                          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {Math.round(match.overallScore)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{match.targetUser.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{match.targetUser.githubProfile?.username} · {match.targetUser.githubProfile?.experienceLevel}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      {targetLangs.slice(0, 3).map((l) => (
                        <div key={l.name} className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} title={l.name} />
                      ))}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No matches yet. Your profile is being analyzed...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
