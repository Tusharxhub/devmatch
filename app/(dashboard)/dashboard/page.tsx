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
  FolderKanban,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  const [profile, matchCount, messageCount, topMatches, recentNotifications] =
    await Promise.all([
      prisma.githubProfile.findUnique({ where: { userId } }),
      prisma.matchScore.count({ where: { userId } }),
      prisma.message.count({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
      prisma.matchScore.findMany({
        where: { userId },
        orderBy: { overallScore: "desc" },
        take: 5,
        include: {
          targetUser: {
            select: {
              id: true,
              name: true,
              image: true,
              onlineStatus: true,
              githubProfile: {
                select: {
                  username: true,
                  experienceLevel: true,
                  topLanguages: true,
                },
              },
            },
          },
        },
      }),
      prisma.notification
        .findMany({
          where: { userId, read: false },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
        .catch(() => []),
    ]);

  const topLangs =
    (profile?.topLanguages as Array<{
      name: string;
      percentage: number;
      color: string;
    }>) || [];

  const firstName = session.user.name?.split(" ")[0] || "Developer";

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-heading-xl">
          Welcome back, {firstName}
        </h1>
        <p className="text-body-md mt-1.5">
          Here&apos;s your developer network at a glance
        </p>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            label: "Matches",
            value: matchCount,
            color: "var(--dm-accent)",
            href: "/dashboard/matches",
          },
          {
            icon: MessageSquare,
            label: "Messages",
            value: messageCount,
            color: "var(--dm-cyan)",
            href: "/messages",
          },
          {
            icon: Star,
            label: "Stars",
            value: profile?.totalStars || 0,
            color: "var(--dm-amber)",
            href: "/dashboard/profile",
          },
          {
            icon: Activity,
            label: "Contributions",
            value: profile?.contributions || 0,
            color: "var(--dm-green)",
            href: "/dashboard/profile",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card variant="interactive" padding="md">
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center"
                  style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 12%, transparent)` }}
                >
                  <stat.icon
                    className="w-4 h-4"
                    style={{ color: stat.color }}
                  />
                </div>
                <span className="text-label">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold font-display text-[var(--dm-text-primary)]">
                {stat.value.toLocaleString()}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Top Languages ─── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-[var(--dm-accent)]" />
            <h2 className="text-heading-sm">Top Languages</h2>
          </div>

          <Card variant="default" padding="md">
            {topLangs.length > 0 ? (
              <div className="space-y-3">
                {topLangs.slice(0, 8).map((lang) => (
                  <div key={lang.name} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-sm text-[var(--dm-text-primary)] flex-1">
                      {lang.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-[var(--dm-bg-surface)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(lang.percentage, 100)}%`,
                            backgroundColor: lang.color,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--dm-text-muted)] w-10 text-right tabular-nums">
                        {lang.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <Code2 className="w-8 h-8 text-[var(--dm-text-faint)] mx-auto mb-2" />
                <p className="text-body-sm">Syncing your GitHub data...</p>
              </div>
            )}
          </Card>
        </div>

        {/* ─── Top Matches ─── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--dm-accent)]" />
              <h2 className="text-heading-sm">Top Matches</h2>
            </div>
            <Link
              href="/dashboard/matches"
              className="text-sm text-[var(--dm-accent)] hover:text-[var(--dm-accent-hover)] transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {topMatches.length > 0 ? (
            <div className="space-y-2">
              {topMatches.map((match) => {
                const langs =
                  (match.targetUser.githubProfile?.topLanguages as Array<{
                    name: string;
                    color: string;
                  }>) || [];

                return (
                  <Link
                    key={match.id}
                    href={`/dashboard/matches`}
                  >
                    <Card variant="interactive" padding="sm" className="group">
                      <div className="flex items-center gap-4 p-1.5">
                        <Avatar
                          src={match.targetUser.image}
                          alt={match.targetUser.name || ""}
                          size="md"
                          online={match.targetUser.onlineStatus}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[var(--dm-text-primary)] truncate">
                              {match.targetUser.name}
                            </span>
                            {match.targetUser.githubProfile?.experienceLevel && (
                              <Badge variant="default" size="xs">
                                {match.targetUser.githubProfile.experienceLevel}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-[var(--dm-text-muted)] mt-0.5">
                            @{match.targetUser.githubProfile?.username}
                          </div>
                          {langs.length > 0 && (
                            <div className="flex gap-1 mt-1.5">
                              {langs.slice(0, 4).map((lang) => (
                                <span
                                  key={lang.name}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--dm-bg-surface)] text-[var(--dm-text-muted)] border border-[var(--dm-border)]"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: lang.color }}
                                  />
                                  {lang.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xl font-bold font-display text-[var(--dm-accent)]">
                            {Math.round(match.overallScore)}
                          </div>
                          <div className="text-[10px] text-[var(--dm-text-muted)] uppercase tracking-wider">
                            match
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card variant="default" padding="lg">
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-[var(--dm-text-faint)] mx-auto mb-3" />
                <p className="text-heading-sm mb-1">No matches yet</p>
                <p className="text-body-sm">
                  Your profile is being analyzed. Matches will appear shortly.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div>
        <h2 className="text-heading-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: FolderKanban,
              label: "New Project",
              href: "/dashboard/projects",
              color: "var(--dm-green)",
            },
            {
              icon: Users,
              label: "Browse Matches",
              href: "/dashboard/matches",
              color: "var(--dm-accent)",
            },
            {
              icon: Eye,
              label: "Edit Profile",
              href: "/dashboard/profile",
              color: "var(--dm-cyan)",
            },
            {
              icon: TrendingUp,
              label: "View Feed",
              href: "/dashboard/feed",
              color: "var(--dm-amber)",
            },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card
                variant="interactive"
                padding="md"
                className="text-center group"
              >
                <action.icon
                  className="w-5 h-5 mx-auto mb-2 transition-transform group-hover:scale-110"
                  style={{ color: action.color }}
                />
                <span className="text-sm font-medium text-[var(--dm-text-secondary)] group-hover:text-[var(--dm-text-primary)]">
                  {action.label}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
