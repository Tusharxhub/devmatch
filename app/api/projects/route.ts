// app/api/projects/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  longDesc: z.string().max(5000).optional(),
  techStack: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
  maxMembers: z.number().min(1).max(50).default(10),
  tags: z.array(z.string()).default([]),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// GET /api/projects — list projects
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const status = searchParams.get("status") || "ACTIVE";
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {
      isPublic: true,
      status,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          creator: {
            select: { id: true, name: true, image: true },
          },
          members: {
            select: {
              user: { select: { id: true, name: true, image: true } },
              role: true,
            },
          },
          _count: { select: { tasks: true, members: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[Projects API] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects — create project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createProjectSchema.parse(body);

    let slug = slugify(data.name);
    // Ensure unique slug
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        repoUrl: data.repoUrl || null,
        liveUrl: data.liveUrl || null,
        creatorId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        creator: { select: { id: true, name: true, image: true } },
        members: {
          select: {
            user: { select: { id: true, name: true, image: true } },
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[Projects API] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
