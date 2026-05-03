"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
} from "lucide-react"
import { toast } from "sonner"
import Container from "@/components/ui/container"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import Badge from "@/components/ui/badge"

interface ProfileData {
  id: string
  name: string
  email: string
  image: string
  bio: string
  location: string
  website: string
  githubProfile: {
    username: string
    profileUrl: string
    publicRepos: number
    followers: number
    following: number
    totalStars: number
    totalForks: number
    contributions: number
    experienceLevel: string
    topLanguages: Array<{ name: string; percentage: number; color: string }>
    pinnedRepos: Array<{ name: string; description: string; stars: number; language: string; url: string }>
  } | null
  intent: {
    lookingFor: string[]
    projectInterests: string[]
    availableHours: number
    preferredTimezone: string
  } | null
}

const INTENT_OPTIONS = ["collaborator", "mentor", "mentee", "cofounder"]
const INTEREST_OPTIONS = ["web", "mobile", "ai", "blockchain", "devops", "gamedev", "data", "security"]

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [lookingFor, setLookingFor] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [hours, setHours] = useState(10)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()
      setProfile(data.user)
      setBio(data.user.bio || "")
      setLocation(data.user.location || "")
      setWebsite(data.user.website || "")
      setLookingFor(data.user.intent?.lookingFor || ["collaborator"])
      setInterests(data.user.intent?.projectInterests || ["web"])
      setHours(data.user.intent?.availableHours || 10)
    } catch {
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile() {
    setSaving(true)
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio, location, website,
          intent: { lookingFor, projectInterests: interests, availableHours: hours },
        }),
      })
      toast.success("Profile updated!")
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  function toggleArrayItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#ff2e63]" />
      </div>
    )
  }

  const gh = profile?.githubProfile

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Container>
        {/* Header */}
        <div className="py-8 border-b border-line">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#ff2e63]" />
            <h1 className="text-heading-xl">Your Profile</h1>
          </div>
        </div>

        <div className="py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* GitHub Profile Card */}
            <div>
              <Card variant="featured">
                <div className="text-center mb-6">
                  {profile?.image && (
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={80}
                      height={80}
                      className="rounded-full mx-auto mb-3 border-2 border-[rgba(255,46,99,0.2)]"
                    />
                  )}
                  <h2 className="text-heading-md">{profile?.name}</h2>
                  {gh && (
                    <a
                      href={gh.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#ff2e63] hover:text-[#00ffa3] flex items-center justify-center gap-1 mt-2 transition-colors"
                    >
                      @{gh.username}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {gh && (
                    <Badge variant="accent" size="sm" className="inline-block mt-3">
                      {gh.experienceLevel}
                    </Badge>
                  )}
                </div>

                {gh && (
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                    {[
                      { icon: Star, value: gh.totalStars, label: "Stars" },
                      { icon: GitFork, value: gh.totalForks, label: "Forks" },
                      { icon: Activity, value: gh.contributions, label: "Contrib." },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <s.icon className="w-4 h-4 text-[#ff2e63] mx-auto mb-1" />
                        <div className="text-sm font-bold text-[#eaeaf0]">{s.value?.toLocaleString()}</div>
                        <div className="text-[10px] text-[#9ca3af]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {gh?.topLanguages && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                    <h3 className="text-xs font-semibold text-[#9ca3af] mb-3 flex items-center gap-1 uppercase tracking-wide">
                      <Code2 className="w-3 h-3" /> Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {gh.topLanguages.slice(0, 8).map((l) => (
                        <Badge key={l.name} variant="default" size="sm">
                          {l.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* About You */}
              <Card variant="default">
                <h3 className="text-heading-md mb-4">About You</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#9ca3af] mb-2 block uppercase tracking-wide">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="input-base w-full resize-none"
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#9ca3af] mb-2 block uppercase tracking-wide flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                      </label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input-base w-full"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#9ca3af] mb-2 block uppercase tracking-wide flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Website
                      </label>
                      <input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="input-base w-full"
                        placeholder="https://your-site.com"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* What are you looking for? */}
              <Card variant="default">
                <h3 className="text-heading-md mb-4">What are you looking for?</h3>
                
                <div className="mb-6">
                  <div className="text-sm text-[#9ca3af] mb-3 uppercase tracking-wide">Role</div>
                  <div className="flex flex-wrap gap-2">
                    {INTENT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleArrayItem(lookingFor, opt, setLookingFor)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                          lookingFor.includes(opt)
                            ? "bg-[rgba(255,46,99,0.2)] text-[#ff2e63] border border-[rgba(255,46,99,0.3)]"
                            : "bg-[rgba(255,255,255,0.05)] text-[#9ca3af] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-[#9ca3af] mb-3 uppercase tracking-wide">Project Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleArrayItem(interests, opt, setInterests)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                          interests.includes(opt)
                            ? "bg-[rgba(0,255,163,0.2)] text-[#00ffa3] border border-[rgba(0,255,163,0.3)]"
                            : "bg-[rgba(255,255,255,0.05)] text-[#9ca3af] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#9ca3af] mb-3 uppercase tracking-wide">Weekly Availability</div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={40}
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="flex-1"
                      style={{
                        accentColor: '#ff2e63'
                      }}
                    />
                    <span className="text-sm font-medium w-16 text-right text-[#eaeaf0]">{hours} hrs</span>
                  </div>
                </div>
              </Card>

              {/* Save Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={saveProfile}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
