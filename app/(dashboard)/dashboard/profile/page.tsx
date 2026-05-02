// app/(dashboard)/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  MapPin,
  Globe,
  Star,
  GitFork,
  Activity,
  Code2,
  Save,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  location: string;
  website: string;
  githubProfile: {
    username: string;
    profileUrl: string;
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    totalForks: number;
    contributions: number;
    experienceLevel: string;
    topLanguages: Array<{ name: string; percentage: number; color: string }>;
    pinnedRepos: Array<{ name: string; description: string; stars: number; language: string; url: string }>;
  } | null;
  intent: {
    lookingFor: string[];
    projectInterests: string[];
    availableHours: number;
    preferredTimezone: string;
  } | null;
}

const INTENT_OPTIONS = ["collaborator", "mentor", "mentee", "cofounder"];
const INTEREST_OPTIONS = ["web", "mobile", "ai", "blockchain", "devops", "gamedev", "data", "security"];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [hours, setHours] = useState(10);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data.user);
      setBio(data.user.bio || "");
      setLocation(data.user.location || "");
      setWebsite(data.user.website || "");
      setLookingFor(data.user.intent?.lookingFor || ["collaborator"]);
      setInterests(data.user.intent?.projectInterests || ["web"]);
      setHours(data.user.intent?.availableHours || 10);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio, location, website,
          intent: { lookingFor, projectInterests: interests, availableHours: hours },
        }),
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function toggleArrayItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      </div>
    );
  }

  const gh = profile?.githubProfile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User className="w-6 h-6 text-violet-400" />
        Your Profile
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* GitHub profile card */}
        <div className="glass rounded-xl p-6">
          <div className="text-center mb-6">
            {profile?.image && (
              <Image src={profile.image} alt="" width={80} height={80} className="rounded-full mx-auto mb-3 ring-2 ring-violet-500/20" />
            )}
            <h2 className="text-lg font-bold">{profile?.name}</h2>
            {gh && (
              <a href={gh.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-violet-400 flex items-center justify-center gap-1">
                @{gh.username} <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {gh && (
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 capitalize">
                {gh.experienceLevel}
              </span>
            )}
          </div>

          {gh && (
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Star, value: gh.totalStars, label: "Stars" },
                { icon: GitFork, value: gh.totalForks, label: "Forks" },
                { icon: Activity, value: gh.contributions, label: "Contrib." },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-white/[0.03] p-2.5">
                  <s.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm font-bold">{s.value?.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {gh?.topLanguages && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Code2 className="w-3 h-3" /> Languages
              </h3>
              <div className="flex flex-wrap gap-1">
                {gh.topLanguages.slice(0, 8).map((l) => (
                  <span key={l.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-4">About You</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-sm outline-none focus:ring-1 focus:ring-violet-500/30 resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-sm outline-none focus:ring-1 focus:ring-violet-500/30"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Website
                  </label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-sm outline-none focus:ring-1 focus:ring-violet-500/30"
                    placeholder="https://your-site.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Intent */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-4">What are you looking for?</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {INTENT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleArrayItem(lookingFor, opt, setLookingFor)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    lookingFor.includes(opt)
                      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                      : "bg-white/5 text-muted-foreground border border-white/5 hover:border-white/10"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold mb-3">Project interests</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleArrayItem(interests, opt, setInterests)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    interests.includes(opt)
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "bg-white/5 text-muted-foreground border border-white/5 hover:border-white/10"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold mb-3">Availability</h3>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={40}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="flex-1 accent-violet-500"
              />
              <span className="text-sm font-medium w-16 text-right">{hours} hrs/wk</span>
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
