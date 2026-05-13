// app/(dashboard)/dashboard/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  User,
  MapPin,
  Globe,
  Github,
  Star,
  GitFork,
  Activity,
  Code2,
  Calendar,
  ExternalLink,
  Users,
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      githubProfile: true,
      skills: { include: { skill: true }, orderBy: { proficiency: "desc" } },
      intent: true,
      _count: { select: { matchesAsUser: true, sentMessages: true } },
    },
  });

  if (!user) redirect("/auth/signin");

  const profile = user.githubProfile;
  const topLangs = (profile?.topLanguages as Array<{ name: string; percentage: number; color: string }>) || [];
  const pinnedRepos = (profile?.pinnedRepos as Array<{ name: string; description: string | null; stars: number; forks?: number; language: string | null; url: string }>) || [];
  const socialLinks = (user.socialLinks as Record<string, string>) || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ─── Profile Header ─── */}
      <div className="relative">
        {/* Banner */}
        <div className="h-32 sm:h-44 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--dm-accent)]/10 via-[var(--dm-bg-surface)] to-[var(--dm-cyan)]/10 border border-[var(--dm-border)]" />

        {/* Avatar + Info */}
        <div className="px-6 pb-6 -mt-12 sm:-mt-16 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="shrink-0">
            <Avatar src={user.image} alt={user.name || ""} size="xl" online={user.onlineStatus} />
          </div>
          <div className="flex-1 min-w-0 pt-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-heading-xl">{user.name}</h1>
              {profile?.experienceLevel && (
                <Badge variant="accent" size="sm">{profile.experienceLevel}</Badge>
              )}
              <Badge
                variant={user.availability === "AVAILABLE" ? "success" : user.availability === "BUSY" ? "warning" : "default"}
                size="sm"
                dot
              >
                {user.availability?.toLowerCase() || "available"}
              </Badge>
            </div>
            {user.headline && (
              <p className="text-body-md mt-1">{user.headline}</p>
            )}
            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-[var(--dm-text-muted)]">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {user.location}
                </span>
              )}
              {profile?.username && (
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[var(--dm-text-primary)] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" /> @{profile.username}
                </a>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[var(--dm-text-primary)] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
            </div>
          </div>
          <Link href="/dashboard/settings">
            <Button variant="outline" size="sm">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {/* ─── Bio ─── */}
      {user.bio && (
        <Card variant="default" padding="md">
          <h2 className="text-heading-sm mb-2">About</h2>
          <p className="text-body-md whitespace-pre-wrap">{user.bio}</p>
        </Card>
      )}

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { icon: Code2, label: "Repos", value: profile?.publicRepos || 0 },
          { icon: Star, label: "Stars", value: profile?.totalStars || 0 },
          { icon: GitFork, label: "Forks", value: profile?.totalForks || 0 },
          { icon: Activity, label: "Contributions", value: profile?.contributions || 0 },
          { icon: Users, label: "Followers", value: profile?.followers || 0 },
          { icon: Users, label: "Matches", value: user._count.matchesAsUser },
        ].map((stat) => (
          <Card key={stat.label} variant="default" padding="sm" className="text-center">
            <stat.icon className="w-4 h-4 mx-auto mb-1.5 text-[var(--dm-text-muted)]" />
            <div className="text-lg font-bold font-display text-[var(--dm-text-primary)]">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--dm-text-muted)]">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── Skills ─── */}
        <div>
          <h2 className="text-heading-sm mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[var(--dm-accent)]" />
            Languages & Skills
          </h2>
          <Card variant="default" padding="md">
            {topLangs.length > 0 ? (
              <div className="space-y-2.5">
                {topLangs.slice(0, 10).map((lang) => (
                  <div key={lang.name} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                    <span className="text-sm text-[var(--dm-text-primary)] flex-1">{lang.name}</span>
                    <div className="w-24 h-1.5 rounded-full bg-[var(--dm-bg-surface)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(lang.percentage, 100)}%`, backgroundColor: lang.color, opacity: 0.7 }}
                      />
                    </div>
                    <span className="text-xs text-[var(--dm-text-muted)] w-10 text-right tabular-nums">
                      {lang.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-center py-4">Syncing language data...</p>
            )}
          </Card>
        </div>

        {/* ─── Collaboration Intent ─── */}
        <div>
          <h2 className="text-heading-sm mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--dm-green)]" />
            Collaboration
          </h2>
          <Card variant="default" padding="md">
            {user.intent ? (
              <div className="space-y-4">
                <div>
                  <div className="text-label mb-2">Looking for</div>
                  <div className="flex flex-wrap gap-1.5">
                    {user.intent.lookingFor.map((item) => (
                      <Badge key={item} variant="success" size="sm">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-label mb-2">Interests</div>
                  <div className="flex flex-wrap gap-1.5">
                    {user.intent.projectInterests.map((item) => (
                      <Badge key={item} variant="info" size="sm">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--dm-text-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {user.intent.availableHours}h/week
                  </span>
                  {user.intent.preferredTimezone && (
                    <span>{user.intent.preferredTimezone}</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-body-sm text-center py-4">Set your collaboration preferences in settings</p>
            )}
          </Card>
        </div>
      </div>

      {/* ─── Pinned Repos ─── */}
      {pinnedRepos.length > 0 && (
        <div>
          <h2 className="text-heading-sm mb-4 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-[var(--dm-cyan)]" />
            Pinned Repositories
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {pinnedRepos.map((repo) => (
              <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer">
                <Card variant="interactive" padding="md" className="group h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[var(--dm-text-primary)] group-hover:text-[var(--dm-accent)] transition-colors">
                      {repo.name}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--dm-text-faint)] group-hover:text-[var(--dm-text-muted)] shrink-0" />
                  </div>
                  {repo.description && (
                    <p className="text-xs text-[var(--dm-text-muted)] line-clamp-2 mb-3">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-[var(--dm-text-muted)]">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--dm-cyan)]" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> {repo.stars}
                    </span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
