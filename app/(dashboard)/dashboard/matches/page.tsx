// app/(dashboard)/dashboard/matches/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  Filter,
  MessageSquare,
  Star,
  Activity,
  Code2,
  MapPin,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface MatchData {
  id: string;
  overallScore: number;
  languageScore: number;
  activityScore: number;
  experienceScore: number;
  intentScore: number;
  reasons: string[];
  targetUser: {
    id: string;
    name: string;
    image: string;
    bio: string;
    location: string;
    onlineStatus: boolean;
    githubProfile: {
      username: string;
      topLanguages: Array<{ name: string; percentage: number; color: string }>;
      contributions: number;
      totalStars: number;
      experienceLevel: string;
    };
  };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [minScore]);

  async function fetchMatches() {
    setLoading(true);
    try {
      const res = await fetch(`/api/matches?limit=50&minScore=${minScore}`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch {
      console.error("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  }

  const filtered = matches.filter((m) =>
    !search ||
    m.targetUser.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.targetUser.githubProfile?.username?.toLowerCase().includes(search.toLowerCase())
  );

  function getScoreColor(score: number) {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-muted-foreground";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-400" />
            Developer Profiles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All developers fetched from the database
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search matches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-lg glass text-sm outline-none focus:ring-1 focus:ring-violet-500/30"
            />
          </div>
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="px-3 py-2 rounded-lg glass text-sm outline-none focus:ring-1 focus:ring-violet-500/30 bg-transparent"
          >
            <option value={0} className="bg-[hsl(222,47%,6%)]">All scores</option>
            <option value={30} className="bg-[hsl(222,47%,6%)]">30+</option>
            <option value={50} className="bg-[hsl(222,47%,6%)]">50+</option>
            <option value={70} className="bg-[hsl(222,47%,6%)]">70+</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No profiles found</h2>
          <p className="text-sm text-muted-foreground">
            No user profiles are available yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((match) => (
            <div
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="glass rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group gradient-border"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  {match.targetUser.image ? (
                    <Image
                      src={match.targetUser.image}
                      alt={match.targetUser.name || ""}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-400" />
                    </div>
                  )}
                  {match.targetUser.onlineStatus && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[hsl(222,47%,4%)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{match.targetUser.name}</p>
                  <p className="text-xs text-muted-foreground">@{match.targetUser.githubProfile?.username}</p>
                  {match.targetUser.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {match.targetUser.location}
                    </p>
                  )}
                </div>
                <div className={`text-xl font-bold ${getScoreColor(match.overallScore)}`}>
                  {Math.round(match.overallScore)}
                </div>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: "Lang", score: match.languageScore, icon: Code2 },
                  { label: "Activity", score: match.activityScore, icon: Activity },
                  { label: "Exp", score: match.experienceScore, icon: Star },
                  { label: "Intent", score: match.intentScore, icon: Filter },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div className="text-sm font-semibold">{Math.round(s.score)}</div>
                  </div>
                ))}
              </div>

              {/* Languages */}
              {match.targetUser.githubProfile?.topLanguages && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {match.targetUser.githubProfile.topLanguages.slice(0, 5).map((lang) => (
                    <span
                      key={lang.name}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                      {lang.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Match reasons */}
              {match.reasons && (match.reasons as string[]).length > 0 && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {(match.reasons as string[]).slice(0, 2).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Match detail modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedMatch(null)}>
          <div className="glass-strong rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              {selectedMatch.targetUser.image && (
                <Image src={selectedMatch.targetUser.image} alt="" width={64} height={64} className="rounded-full" />
              )}
              <div>
                <h2 className="text-xl font-bold">{selectedMatch.targetUser.name}</h2>
                <p className="text-sm text-muted-foreground">@{selectedMatch.targetUser.githubProfile?.username}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {selectedMatch.targetUser.githubProfile?.experienceLevel}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-lg font-bold">{selectedMatch.targetUser.githubProfile?.totalStars}</div>
                <div className="text-xs text-muted-foreground">Stars</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-lg font-bold">{selectedMatch.targetUser.githubProfile?.contributions}</div>
                <div className="text-xs text-muted-foreground">Contributions</div>
              </div>
            </div>

            {/* Score breakdown */}
            <h3 className="text-sm font-semibold mb-3">Compatibility Breakdown</h3>
            <div className="space-y-2 mb-6">
              {[
                { label: "Languages", score: selectedMatch.languageScore, color: "from-violet-500 to-purple-500" },
                { label: "Activity Level", score: selectedMatch.activityScore, color: "from-cyan-500 to-blue-500" },
                { label: "Experience", score: selectedMatch.experienceScore, color: "from-emerald-500 to-teal-500" },
                { label: "Intent Match", score: selectedMatch.intentScore, color: "from-pink-500 to-rose-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">{s.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width: `${s.score}%` }} />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right">{Math.round(s.score)}</span>
                </div>
              ))}
            </div>

            {/* Reasons */}
            {selectedMatch.reasons && (selectedMatch.reasons as string[]).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Why you match</h3>
                <ul className="space-y-1">
                  {(selectedMatch.reasons as string[]).map((reason, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-violet-400 mt-0.5">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <a
                href={`https://github.com/${selectedMatch.targetUser.githubProfile?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" /> GitHub
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
