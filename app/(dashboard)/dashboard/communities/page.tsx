"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Plus,
  Search,
  Users,
  MessageSquare,
  Loader2,
  X,
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

interface CommunityData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  memberCount: number;
  tags: string[];
  createdAt: string;
  creator: { id: string; name: string; image?: string | null };
  _count: { members: number; posts: number };
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", tags: "", isPublic: true });

  useEffect(() => {
    fetchCommunities();
  }, []);

  async function fetchCommunities() {
    setLoading(true);
    try {
      const res = await fetch(`/api/communities?limit=30&search=${search}`);
      const data = await res.json();
      setCommunities(data.communities || []);
    } catch {
      console.error("Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  }

  async function createCommunity() {
    setCreating(true);
    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
          isPublic: form.isPublic,
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setForm({ name: "", description: "", tags: "", isPublic: true });
        fetchCommunities();
      }
    } catch {
      console.error("Failed to create community");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-xl flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-[var(--dm-green)]" />
            Communities
          </h1>
          <p className="text-body-md mt-1">Join developer communities and discussions</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
          New Community
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dm-text-muted)]" />
        <input
          type="text"
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchCommunities()}
          className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] focus:ring-1 focus:ring-[var(--dm-accent)]/20 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-green)]" />
        </div>
      ) : communities.length === 0 ? (
        <Card variant="default" padding="lg">
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-[var(--dm-text-faint)] mx-auto mb-3" />
            <p className="text-heading-sm mb-1">No communities yet</p>
            <p className="text-body-sm mb-4">Start a community around a technology or interest</p>
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
              Create Community
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community.id} variant="interactive" padding="md">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--dm-green-muted)] flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-[var(--dm-green)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-heading-sm truncate">{community.name}</h3>
                  {community.description && (
                    <p className="text-body-sm mt-0.5 line-clamp-2">{community.description}</p>
                  )}
                </div>
              </div>

              {community.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {community.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" size="xs">{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-3 border-t border-[var(--dm-border)] text-xs text-[var(--dm-text-muted)]">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {community.memberCount} members
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {community._count.posts} posts
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Community Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} size="md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-lg">Create Community</h2>
          <button onClick={() => setShowCreate(false)} className="text-[var(--dm-text-muted)] hover:text-[var(--dm-text-primary)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-label mb-1.5 block">Community Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="TypeScript Enthusiasts"
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
            />
          </div>
          <div>
            <label className="text-label mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this community about?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-label mb-1.5 block">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="typescript, react, webdev"
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" size="md" onClick={() => setShowCreate(false)} fullWidth>Cancel</Button>
            <Button variant="primary" size="md" onClick={createCommunity} isLoading={creating} disabled={!form.name.trim()} fullWidth>
              Create Community
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
