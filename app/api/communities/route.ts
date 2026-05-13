// app/api/communities/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCommunitySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
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

// GET /api/communities
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = { isPublic: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        orderBy: { memberCount: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          creator: { select: { id: true, name: true, image: true } },
          _count: { select: { members: true, posts: true } },
        },
      }),
      prisma.community.count({ where }),
    ]);

    return NextResponse.json({
      communities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[Communities API] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}

// POST /api/communities
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createCommunitySchema.parse(body);

    let slug = slugify(data.name);
    const existing = await prisma.community.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const community = await prisma.community.create({
      data: {
        ...data,
        slug,
        creatorId: session.user.id,
        memberCount: 1,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        creator: { select: { id: true, name: true, image: true } },
        _count: { select: { members: true } },
      },
    });

    return NextResponse.json({ community }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[Communities API] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    );
  }
}
