"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  Plus,
} from "lucide-react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | Date | null;
  order: number;
  createdAt: string | Date;
}

interface Member {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  role: string;
}

interface ProjectBoardProps {
  projectId: string;
  initialTasks: Task[];
  members: Member[];
  canWrite: boolean;
}

const columns: Array<{ id: TaskStatus; label: string; icon: typeof Circle }> = [
  { id: "BACKLOG", label: "Backlog", icon: Circle },
  { id: "TODO", label: "Ready", icon: Clock3 },
  { id: "IN_PROGRESS", label: "Building", icon: Loader2 },
  { id: "REVIEW", label: "Review", icon: ArrowRight },
  { id: "DONE", label: "Done", icon: CheckCircle2 },
];

const priorities: Record<TaskPriority, "default" | "info" | "warning" | "accent"> = {
  LOW: "default",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "accent",
};

export default function ProjectBoard({
  projectId,
  initialTasks,
  members,
  canWrite,
}: ProjectBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [drafts, setDrafts] = useState<Record<TaskStatus, string>>({
    BACKLOG: "",
    TODO: "",
    IN_PROGRESS: "",
    REVIEW: "",
    DONE: "",
  });
  const [pending, setPending] = useState<string | null>(null);

  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<TaskStatus, Task[]>>((acc, column) => {
      acc[column.id] = tasks
        .filter((task) => task.status === column.id)
        .sort((a, b) => a.order - b.order);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  async function createTask(status: TaskStatus) {
    const title = drafts[status].trim();
    if (!title || pending) return;

    setPending(`create-${status}`);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setDrafts((prev) => ({ ...prev, [status]: "" }));
    } catch (error) {
      console.error("[ProjectBoard] Create task failed:", error);
    } finally {
      setPending(null);
    }
  }

  async function moveTask(task: Task, direction: -1 | 1) {
    const currentIndex = columns.findIndex((column) => column.id === task.status);
    const next = columns[currentIndex + direction];
    if (!next || pending) return;

    setPending(task.id);
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((item) => (item.id === task.id ? { ...item, status: next.id } : item))
    );

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, status: next.id }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const data = await res.json();
      setTasks((prev) => prev.map((item) => (item.id === task.id ? data.task : item)));
    } catch (error) {
      console.error("[ProjectBoard] Move task failed:", error);
      setTasks(previousTasks);
    } finally {
      setPending(null);
    }
  }

  function assigneeName(task: Task) {
    if (!task.assigneeId) return null;
    return members.find((member) => member.user.id === task.assigneeId)?.user.name;
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[980px] grid-cols-5 gap-3">
        {columns.map((column) => {
          const Icon = column.icon;
          return (
            <section
              key={column.id}
              className="min-h-[520px] rounded-[var(--radius-lg)] border border-[var(--dm-border)] bg-[var(--dm-bg-base)]/70"
            >
              <div className="flex items-center justify-between border-b border-[var(--dm-border)] px-3 py-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-[var(--dm-text-muted)]" />
                  <h3 className="text-sm font-semibold text-[var(--dm-text-primary)]">
                    {column.label}
                  </h3>
                </div>
                <span className="rounded-full bg-[var(--dm-bg-surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--dm-text-muted)]">
                  {tasksByStatus[column.id].length}
                </span>
              </div>

              <div className="space-y-2.5 p-2.5">
                {canWrite && (
                  <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--dm-border)] bg-[var(--dm-bg-raised)]/60 p-2">
                    <input
                      value={drafts[column.id]}
                      onChange={(event) =>
                        setDrafts((prev) => ({ ...prev, [column.id]: event.target.value }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") createTask(column.id);
                      }}
                      placeholder="Add task"
                      className="mb-2 w-full bg-transparent text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-faint)] focus:outline-none"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      fullWidth
                      onClick={() => createTask(column.id)}
                      disabled={!drafts[column.id].trim()}
                      isLoading={pending === `create-${column.id}`}
                      icon={<Plus className="h-3.5 w-3.5" />}
                    >
                      Add
                    </Button>
                  </div>
                )}

                {tasksByStatus[column.id].map((task) => (
                  <Card key={task.id} variant="default" padding="sm">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold leading-snug text-[var(--dm-text-primary)]">
                          {task.title}
                        </div>
                        {task.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-[var(--dm-text-muted)]">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={priorities[task.priority]} size="xs">
                          {task.priority.toLowerCase()}
                        </Badge>
                        {assigneeName(task) && (
                          <span className="truncate text-[10px] text-[var(--dm-text-muted)]">
                            {assigneeName(task)}
                          </span>
                        )}
                      </div>

                      {canWrite && (
                        <div className="flex items-center justify-between border-t border-[var(--dm-border)] pt-2">
                          <button
                            title="Move left"
                            onClick={() => moveTask(task, -1)}
                            disabled={column.id === "BACKLOG" || pending === task.id}
                            className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--dm-text-muted)] transition-colors hover:bg-[var(--dm-bg-hover)] hover:text-[var(--dm-text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Move right"
                            onClick={() => moveTask(task, 1)}
                            disabled={column.id === "DONE" || pending === task.id}
                            className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--dm-text-muted)] transition-colors hover:bg-[var(--dm-bg-hover)] hover:text-[var(--dm-text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
