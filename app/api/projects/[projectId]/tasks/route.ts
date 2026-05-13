// app/api/projects/[projectId]/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createTaskSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  priority: z.nativeEnum(TaskPriority).default("MEDIUM"),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
});

const updateTaskSchema = createTaskSchema.partial().extend({
  taskId: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

async function getProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      isPublic: true,
      creatorId: true,
      members: { select: { userId: true, role: true } },
    },
  });

  if (!project) return { project: null, isMember: false, canWrite: false };

  const membership = project.members.find((member) => member.userId === userId);
  const isMember = Boolean(membership);
  const canWrite = Boolean(
    membership && ["OWNER", "ADMIN", "CONTRIBUTOR"].includes(membership.role)
  );

  return { project, isMember, canWrite };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getProjectAccess(params.projectId, session.user.id);
  if (!access.project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!access.project.isPublic && !access.isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tasks = await prisma.projectTask.findMany({
    where: { projectId: params.projectId },
    orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ tasks });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getProjectAccess(params.projectId, session.user.id);
  if (!access.project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!access.canWrite) {
    return NextResponse.json({ error: "Only collaborators can create tasks" }, { status: 403 });
  }

  try {
    const data = createTaskSchema.parse(await req.json());

    if (data.assigneeId) {
      const assignee = access.project.members.some(
        (member) => member.userId === data.assigneeId
      );
      if (!assignee) {
        return NextResponse.json({ error: "Assignee is not a collaborator" }, { status: 400 });
      }
    }

    const order = await prisma.projectTask.count({
      where: { projectId: params.projectId, status: data.status },
    });

    const task = await prisma.projectTask.create({
      data: {
        projectId: params.projectId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        order,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "project.task_create",
        entity: "projectTask",
        entityId: task.id,
        metadata: { projectId: params.projectId, title: task.title },
      },
    }).catch(() => {});

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[Project Tasks API] POST error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getProjectAccess(params.projectId, session.user.id);
  if (!access.project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!access.canWrite) {
    return NextResponse.json({ error: "Only collaborators can update tasks" }, { status: 403 });
  }

  try {
    const data = updateTaskSchema.parse(await req.json());

    const task = await prisma.projectTask.update({
      where: { id: data.taskId, projectId: params.projectId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[Project Tasks API] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
