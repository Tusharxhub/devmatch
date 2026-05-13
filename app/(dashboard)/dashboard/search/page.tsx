"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search as SearchIcon,
  Users,
  FolderKanban,
  Globe,
  FileText,
  Loader2,
  ArrowRight,
  X,
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";

type SearchType = "all" | "users" | "projects" | "communities" | "posts";

interface SearchResults {
  users: Array<{
    id: string;
    name?: string | null;
    image?: string | null;
    headline?: string | null;
    onlineStatus: boolean;
    githubProfile?: {
      username?: string | null;
      experienceLevel?: string | null;
      topLanguages?: Array<{ name: string; color: string }>;
    } | null;
  }>;
  projects: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    techStack: string[];
    status: string;
    _count: { members: number };
    creator: { id: string; name: string; image?: string | null };
  }>;
  communities: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    memberCount: number;
    image?: string | null;
  }>;
  posts: Array<{
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
      githubProfile?: { username?: string | null } | null;
    };
    _count: { comments: number; reactions: number };
  }>;
}

const tabs: Array<{ value: SearchType; label: string; icon: typeof SearchIcon }> = [
  { value: "all", label: "All", icon: SearchIcon },
  { value: "users", label: "Developers", icon: Users },
  { value: "projects", label: "Projects", icon: FolderKanban },
  { value: "communities", label: "Communities", icon: Globe },
  { value: "posts", label: "Posts", icon: FileText },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("all");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, type]);

  async function performSearch() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, type, limit: "15" });
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.results);
    } catch {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  }

  const totalResults = results
    ? results.users.length + results.projects.length + results.communities.length + results.posts.length
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--dm-text-muted)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search developers, projects, communities..."
          className="w-full pl-12 pr-10 py-4 rounded-[var(--radius-lg)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-base text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] focus:ring-2 focus:ring-[var(--dm-accent)]/10 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--dm-text-muted)] hover:text-[var(--dm-text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setType(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${
              type === tab.value
                ? "bg-[var(--dm-accent-muted)] text-[var(--dm-accent)]"
                : "text-[var(--dm-text-muted)] hover:text-[var(--dm-text-secondary)]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-accent)]" />
        </div>
      ) : !results ? (
        <div className="text-center py-16">
          <SearchIcon className="w-10 h-10 text-[var(--dm-text-faint)] mx-auto mb-3" />
          <p className="text-heading-sm mb-1 text-[var(--dm-text-secondary)]">Search DevMatch</p>
          <p className="text-body-sm">Find developers, projects, and communities</p>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-16">
          <SearchIcon className="w-10 h-10 text-[var(--dm-text-faint)] mx-auto mb-3" />
          <p className="text-heading-sm mb-1">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-body-sm">Try different keywords or filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Users */}
          {results.users.length > 0 && (type === "all" || type === "users") && (
            <section>
              <h2 className="text-label mb-3 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Developers ({results.users.length})
              </h2>
              <div className="space-y-2">
                {results.users.map((user) => (
                  <Card key={user.id} variant="interactive" padding="sm">
                    <div className="flex items-center gap-3 p-1">
                      <Avatar src={user.image} alt={user.name || ""} size="md" online={user.onlineStatus} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--dm-text-primary)] truncate">
                          {user.name}
                        </div>
                        {user.githubProfile?.username && (
                          <div className="text-xs text-[var(--dm-text-muted)]">
                            @{user.githubProfile.username}
                          </div>
                        )}
                        {user.headline && (
                          <div className="text-xs text-[var(--dm-text-muted)] mt-0.5 truncate">
                            {user.headline}
                          </div>
                        )}
                      </div>
                      {user.githubProfile?.experienceLevel && (
                        <Badge variant="default" size="xs">
                          {user.githubProfile.experienceLevel}
                        </Badge>
                      )}
                      <ArrowRight className="w-4 h-4 text-[var(--dm-text-faint)] group-hover:text-[var(--dm-text-muted)]" />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {results.projects.length > 0 && (type === "all" || type === "projects") && (
            <section>
              <h2 className="text-label mb-3 flex items-center gap-2">
                <FolderKanban className="w-3.5 h-3.5" />
                Projects ({results.projects.length})
              </h2>
              <div className="space-y-2">
                {results.projects.map((project) => (
                  <Card key={project.id} variant="interactive" padding="sm">
                    <div className="flex items-center gap-3 p-1">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--dm-accent-muted)] flex items-center justify-center shrink-0">
                        <FolderKanban className="w-5 h-5 text-[var(--dm-accent)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--dm-text-primary)] truncate">
                          {project.name}
                        </div>
                        {project.description && (
                          <div className="text-xs text-[var(--dm-text-muted)] truncate">
                            {project.description}
                          </div>
                        )}
                        {project.techStack.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {project.techStack.slice(0, 3).map((t) => (
                              <Badge key={t} variant="outline" size="xs">{t}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-[var(--dm-text-muted)] flex items-center gap-1">
                        <Users className="w-3 h-3" /> {project._count.members}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Communities */}
          {results.communities.length > 0 && (type === "all" || type === "communities") && (
            <section>
              <h2 className="text-label mb-3 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                Communities ({results.communities.length})
              </h2>
              <div className="space-y-2">
                {results.communities.map((community) => (
                  <Card key={community.id} variant="interactive" padding="sm">
                    <div className="flex items-center gap-3 p-1">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--dm-green-muted)] flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-[var(--dm-green)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--dm-text-primary)] truncate">
                          {community.name}
                        </div>
                        {community.description && (
                          <div className="text-xs text-[var(--dm-text-muted)] truncate">
                            {community.description}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-[var(--dm-text-muted)]">
                        {community.memberCount} members
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Posts */}
          {results.posts.length > 0 && (type === "all" || type === "posts") && (
            <section>
              <h2 className="text-label mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Posts ({results.posts.length})
              </h2>
              <div className="space-y-2">
                {results.posts.map((post) => (
                  <Card key={post.id} variant="interactive" padding="sm">
                    <div className="flex items-start gap-3 p-1">
                      <Avatar src={post.author.image} alt={post.author.name || ""} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-[var(--dm-text-primary)] truncate">
                            {post.title || post.content.slice(0, 72)}
                          </div>
                          <Badge variant="outline" size="xs">
                            {post.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--dm-text-muted)] line-clamp-2">
                          {post.content}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--dm-text-faint)]">
                          <span>{post.author.name || post.author.githubProfile?.username || "Developer"}</span>
                          <span>{post._count.comments} replies</span>
                          <span>{post._count.reactions} reactions</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
