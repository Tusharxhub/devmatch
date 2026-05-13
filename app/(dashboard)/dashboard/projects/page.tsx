"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Users,
  GitBranch,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  techStack: string[];
  status: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  tags: string[];
  createdAt: string;
  creator: { id: string; name: string; image?: string | null };
  _count: { members: number; tasks: number };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    techStack: "",
    tags: "",
    repoUrl: "",
    isPublic: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?limit=30&search=${search}`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }

  async function createProject() {
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          techStack: form.techStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          tags: form.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          repoUrl: form.repoUrl || undefined,
          isPublic: form.isPublic,
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setForm({ name: "", description: "", techStack: "", tags: "", repoUrl: "", isPublic: true });
        fetchProjects();
      }
    } catch {
      console.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "success",
    PAUSED: "warning",
    COMPLETED: "info",
    ARCHIVED: "default",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-xl flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[var(--dm-accent)]" />
            Projects
          </h1>
          <p className="text-body-md mt-1">Collaborate on projects with other developers</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreate(true)}
        >
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dm-text-muted)]" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchProjects()}
          className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] focus:ring-1 focus:ring-[var(--dm-accent)]/20 transition-all"
        />
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--dm-accent)]" />
        </div>
      ) : projects.length === 0 ? (
        <Card variant="default" padding="lg">
          <div className="text-center py-12">
            <FolderKanban className="w-12 h-12 text-[var(--dm-text-faint)] mx-auto mb-3" />
            <p className="text-heading-sm mb-1">No projects yet</p>
            <p className="text-body-sm mb-4">Create your first project to start collaborating</p>
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
              Create Project
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.slug}`}>
              <Card variant="interactive" padding="md" className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-heading-sm truncate">{project.name}</h3>
                    {project.description && (
                      <p className="text-body-sm mt-1 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                  <Badge variant={statusColors[project.status] as "success" | "warning" | "info" | "default"} size="xs">
                    {project.status.toLowerCase()}
                  </Badge>
                </div>

                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <Badge key={tech} variant="outline" size="xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 5 && (
                      <Badge variant="outline" size="xs">
                        +{project.techStack.length - 5}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[var(--dm-border)]">
                  <div className="flex items-center gap-3 text-xs text-[var(--dm-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project._count.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {project._count.tasks} tasks
                    </span>
                  </div>
                  {project.repoUrl && (
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--dm-text-muted)]" />
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} size="md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-lg">Create Project</h2>
          <button onClick={() => setShowCreate(false)} className="text-[var(--dm-text-muted)] hover:text-[var(--dm-text-primary)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-label mb-1.5 block">Project Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="My awesome project"
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
            />
          </div>

          <div>
            <label className="text-label mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-label mb-1.5 block">Tech Stack (comma separated)</label>
            <input
              value={form.techStack}
              onChange={(e) => setForm({ ...form, techStack: e.target.value })}
              placeholder="React, TypeScript, PostgreSQL"
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
            />
          </div>

          <div>
            <label className="text-label mb-1.5 block">Repository URL (optional)</label>
            <input
              value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
            />
          </div>

          <div>
            <label className="text-label mb-1.5 block">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="open-source, collaboration, api"
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--dm-bg-raised)] border border-[var(--dm-border)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-accent)] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                className="w-4 h-4 rounded accent-[var(--dm-accent)]"
              />
              <span className="text-sm text-[var(--dm-text-secondary)]">Public project</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" size="md" onClick={() => setShowCreate(false)} fullWidth>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={createProject}
              isLoading={creating}
              disabled={!form.name.trim()}
              fullWidth
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
