"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  TrendingUp,
  MessageSquare,
  Heart,
  Repeat,
  Send,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface PostData {
  id: string;
  title?: string | null;
  content: string;
  type: string;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    name?: string | null;
    image?: string | null;
    headline?: string | null;
    githubProfile?: { username?: string | null } | null;
  };
  project?: { id: string; name: string; slug: string } | null;
  community?: { id: string; name: string; slug: string } | null;
  _count: { comments: number; reactions: number };
}

const typeLabels: Record<string, { label: string; variant: "accent" | "success" | "info" | "warning" }> = {
  post: { label: "Post", variant: "accent" },
  project_update: { label: "Project Update", variant: "info" },
  achievement: { label: "Achievement", variant: "success" },
  collaboration_request: { label: "Looking for Collaborators", variant: "warning" },
};

export default function FeedPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("post");
  const [posting, setPosting] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (cursorId?: string | null) => {
    if (cursorId) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({ limit: "15" });
      if (cursorId) params.set("cursor", cursorId);

      const res = await fetch(`/api/feed?${params}`);
      const data = await res.json();

      if (cursorId) {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      } else {
        setPosts(data.posts || []);
      }
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      console.error("Failed to fetch feed");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && cursor) {
          fetchPosts(cursor);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, fetchPosts]);

  async function submitPost() {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost, type: postType }),
      });
      if (res.ok) {
        setNewPost("");
        fetchPosts();
      }
    } catch {
      console.error("Failed to create post");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-heading-xl flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-[var(--dm-amber)]" />
          Feed
        </h1>
        <p className="text-body-md mt-1">Updates, achievements, and collaboration requests</p>
      </div>

      {/* Compose */}
      <Card variant="default" padding="md">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share an update, achievement, or collaboration request..."
          rows={3}
          className="w-full bg-transparent text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--dm-border)]">
          <div className="flex items-center gap-2">
            {Object.entries(typeLabels).map(([key, { label, variant }]) => (
              <button
                key={key}
                onClick={() => setPostType(key)}
                className="transition-opacity"
              >
                <Badge
                  variant={postType === key ? variant : "outline"}
                  size="xs"
                  className="cursor-pointer"
                >
                  {label}
                </Badge>
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            size="xs"
            onClick={submitPost}
            isLoading={posting}
            disabled={!newPost.trim()}
            icon={<Send className="w-3 h-3" />}
          >
            Post
          </Button>
        </div>
      </Card>

      {/* Posts */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-amber)]" />
        </div>
      ) : posts.length === 0 ? (
        <Card variant="default" padding="lg">
          <div className="text-center py-8">
            <TrendingUp className="w-10 h-10 text-[var(--dm-text-faint)] mx-auto mb-3" />
            <p className="text-heading-sm mb-1">Feed is empty</p>
            <p className="text-body-sm">Be the first to share something with the community</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const typeInfo = typeLabels[post.type] || typeLabels.post;
            return (
              <Card key={post.id} variant="default" padding="md" className="group">
                {/* Author */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar src={post.author.image} alt={post.author.name || ""} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[var(--dm-text-primary)]">
                        {post.author.name}
                      </span>
                      {post.author.githubProfile?.username && (
                        <span className="text-xs text-[var(--dm-text-muted)]">
                          @{post.author.githubProfile.username}
                        </span>
                      )}
                      <span className="text-xs text-[var(--dm-text-faint)]">·</span>
                      <span className="text-xs text-[var(--dm-text-faint)]">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {post.author.headline && (
                      <p className="text-xs text-[var(--dm-text-muted)] mt-0.5">{post.author.headline}</p>
                    )}
                  </div>
                  <Badge variant={typeInfo.variant} size="xs">{typeInfo.label}</Badge>
                </div>

                {/* Content */}
                {post.title && (
                  <h3 className="text-heading-sm mb-2">{post.title}</h3>
                )}
                <p className="text-sm text-[var(--dm-text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Context */}
                {(post.project || post.community) && (
                  <div className="flex gap-2 mt-3">
                    {post.project && (
                      <Badge variant="info" size="xs">📁 {post.project.name}</Badge>
                    )}
                    {post.community && (
                      <Badge variant="success" size="xs">🌐 {post.community.name}</Badge>
                    )}
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" size="xs">#{tag}</Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--dm-border)]">
                  <button className="flex items-center gap-1.5 text-xs text-[var(--dm-text-muted)] hover:text-[var(--dm-accent)] transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    {post._count.reactions || 0}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[var(--dm-text-muted)] hover:text-[var(--dm-cyan)] transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {post._count.comments || 0}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[var(--dm-text-muted)] hover:text-[var(--dm-green)] transition-colors">
                    <Repeat className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>
              </Card>
            );
          })}

          {/* Infinite scroll sentinel */}
          <div ref={observerRef} className="h-4" />
          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--dm-text-muted)]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
