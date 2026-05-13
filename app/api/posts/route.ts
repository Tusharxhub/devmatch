// app/api/posts/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(10000),
  type: z.enum(["post", "project_update", "achievement", "collaboration_request"]).default("post"),
  projectId: z.string().optional(),
  communityId: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

// POST /api/posts — create a post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: session.user.id,
        projectId: data.projectId || null,
        communityId: data.communityId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            headline: true,
            githubProfile: { select: { username: true } },
          },
        },
        _count: { select: { comments: true, reactions: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[Posts API] POST error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
