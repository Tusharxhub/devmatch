// app/(dashboard)/dashboard/projects/[slug]/page.tsx
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Lock,
  Users,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import ProjectBoard from "@/components/projects/project-board";

export const metadata = { title: "Project" };

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      creator: { select: { id: true, name: true, image: true } },
      members: {
        orderBy: { joinedAt: "asc" },
        select: {
          role: true,
          user: { select: { id: true, name: true, image: true } },
        },
      },
      tasks: { orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }] },
      _count: { select: { tasks: true, posts: true, members: true } },
    },
  });

  if (!project) notFound();

  const membership = project.members.find((member) => member.user.id === session.user.id);
  if (!project.isPublic && !membership) redirect("/dashboard/projects");

  const canWrite = Boolean(
    membership && ["OWNER", "ADMIN", "CONTRIBUTOR"].includes(membership.role)
  );

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm text-[var(--dm-text-muted)] transition-colors hover:text-[var(--dm-text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>

      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--dm-border)] bg-[var(--dm-bg-base)]">
        <div className="border-b border-[var(--dm-border)] bg-[radial-gradient(circle_at_20%_0%,rgba(230,57,86,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(79,184,201,0.12),transparent_30%)] px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant={project.status === "ACTIVE" ? "success" : "default"} size="sm">
                  {project.status.toLowerCase()}
                </Badge>
                {!project.isPublic && (
                  <Badge variant="outline" size="sm">
                    <Lock className="h-3 w-3" />
                    Private
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight text-[var(--dm-text-primary)] sm:text-4xl">
                {project.name}
              </h1>
              {project.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--dm-text-secondary)]">
                  {project.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" icon={<GitBranch className="h-4 w-4" />}>
                    Repository
                  </Button>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                    Live
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-0 border-b border-[var(--dm-border)] sm:grid-cols-3">
          {[
            { label: "Collaborators", value: project._count.members, icon: Users },
            { label: "Tasks", value: project._count.tasks, icon: FolderKanban },
            { label: "Updates", value: project._count.posts, icon: GitBranch },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 border-b border-[var(--dm-border)] px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <stat.icon className="h-4 w-4 text-[var(--dm-accent)]" />
              <div>
                <div className="text-lg font-bold text-[var(--dm-text-primary)]">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--dm-text-muted)]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-heading-sm">Execution Board</h2>
                <p className="text-body-sm">Move work from idea to review without leaving the project.</p>
              </div>
            </div>
            <ProjectBoard
              projectId={project.id}
              initialTasks={project.tasks.map((task) => ({
                ...task,
                createdAt: task.createdAt.toISOString(),
                updatedAt: task.updatedAt.toISOString(),
                dueDate: task.dueDate?.toISOString() ?? null,
              }))}
              members={project.members}
              canWrite={canWrite}
            />
          </div>

          <aside className="space-y-4">
            <Card variant="default" padding="md">
              <h3 className="text-heading-sm mb-3">Collaborators</h3>
              <div className="space-y-3">
                {project.members.map((member) => (
                  <div key={member.user.id} className="flex items-center gap-3">
                    <Avatar src={member.user.image} alt={member.user.name || ""} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-[var(--dm-text-primary)]">
                        {member.user.name || "Developer"}
                      </div>
                      <div className="text-xs text-[var(--dm-text-muted)]">
                        {member.role.toLowerCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {project.techStack.length > 0 && (
              <Card variant="default" padding="md">
                <h3 className="text-heading-sm mb-3">Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" size="xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
