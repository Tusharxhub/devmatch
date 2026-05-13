"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Settings, User, Bell, Shield, Loader2, Save, Check } from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";

interface ProfileData {
  name: string;
  bio: string;
  headline: string;
  location: string;
  website: string;
  availability: string;
  lookingFor: string[];
  projectInterests: string[];
  availableHours: number;
  preferredTimezone: string;
}

const lookingForOptions = ["collaborator", "mentor", "mentee", "cofounder", "team"];
const interestOptions = ["web", "mobile", "ai", "blockchain", "devops", "gamedev", "data", "security", "iot"];
const availabilityOptions = ["AVAILABLE", "BUSY", "AWAY", "OFFLINE"];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState<ProfileData>({
    name: "",
    bio: "",
    headline: "",
    location: "",
    website: "",
    availability: "AVAILABLE",
    lookingFor: [],
    projectInterests: [],
    availableHours: 10,
    preferredTimezone: "",
  });

  useEffect(() => {
    if (session?.user?.id) loadProfile();
  }, [session?.user?.id]);

  async function loadProfile() {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          headline: data.headline || "",
          location: data.location || "",
          website: data.website || "",
          availability: data.availability || "AVAILABLE",
          lookingFor: data.intent?.lookingFor || [],
          projectInterests: data.intent?.projectInterests || [],
          availableHours: data.intent?.availableHours || 10,
          preferredTimezone: data.intent?.preferredTimezone || "",
        });
      }
    } catch {
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      console.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function toggleArrayItem(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "collaboration", label: "Collaboration", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-accent)]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-heading-xl flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[var(--dm-text-muted)]" />
          Settings
        </h1>
        <p className="text-body-md mt-1">Manage your profile and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[var(--dm-accent-muted)] text-[var(--dm-accent)]"
                : "text-[var(--dm-text-muted)] hover:text-[var(--dm-text-secondary)]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card variant="default" padding="lg">
          <h2 className="text-heading-md mb-6">Profile Information</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-4 mb-6">
              <Avatar src={session?.user?.image} alt={form.name} size="lg" />
              <div>
                <p className="text-sm font-semibold text-[var(--dm-text-primary)]">{form.name}</p>
                <p className="text-xs text-[var(--dm-text-muted)]">{session?.user?.email}</p>
              </div>
            </div>

            <div>
              <label className="text-label mb-1.5 block">Display Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
              />
            </div>

            <div>
              <label className="text-label mb-1.5 block">Headline</label>
              <input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="Senior Full-Stack Engineer"
                className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
              />
            </div>

            <div>
              <label className="text-label mb-1.5 block">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder="Tell others about yourself..."
                className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label mb-1.5 block">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
                />
              </div>
              <div>
                <label className="text-label mb-1.5 block">Website</label>
                <input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://yoursite.com"
                  className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-label mb-2 block">Availability</label>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((opt) => (
                  <button key={opt} onClick={() => setForm({ ...form, availability: opt })}>
                    <Badge
                      variant={form.availability === opt ? "success" : "outline"}
                      size="sm"
                      className="cursor-pointer"
                    >
                      {opt.toLowerCase()}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Collaboration Tab */}
      {activeTab === "collaboration" && (
        <Card variant="default" padding="lg">
          <h2 className="text-heading-md mb-6">Collaboration Preferences</h2>
          <div className="space-y-6">
            <div>
              <label className="text-label mb-2 block">I&apos;m looking for</label>
              <div className="flex flex-wrap gap-2">
                {lookingForOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setForm({ ...form, lookingFor: toggleArrayItem(form.lookingFor, opt) })
                    }
                  >
                    <Badge
                      variant={form.lookingFor.includes(opt) ? "accent" : "outline"}
                      size="sm"
                      className="cursor-pointer capitalize"
                    >
                      {opt}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-label mb-2 block">Project interests</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setForm({
                        ...form,
                        projectInterests: toggleArrayItem(form.projectInterests, opt),
                      })
                    }
                  >
                    <Badge
                      variant={form.projectInterests.includes(opt) ? "info" : "outline"}
                      size="sm"
                      className="cursor-pointer capitalize"
                    >
                      {opt}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label mb-1.5 block">Available hours per week</label>
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={form.availableHours}
                  onChange={(e) =>
                    setForm({ ...form, availableHours: parseInt(e.target.value) || 10 })
                  }
                  className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
                />
              </div>
              <div>
                <label className="text-label mb-1.5 block">Preferred timezone</label>
                <input
                  value={form.preferredTimezone}
                  onChange={(e) => setForm({ ...form, preferredTimezone: e.target.value })}
                  placeholder="UTC+5:30"
                  className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          onClick={saveProfile}
          isLoading={saving}
          icon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {saved ? "Saved" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
