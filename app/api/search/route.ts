// app/api/search/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/search — global search across users, projects, communities
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const type = searchParams.get("type") || "all"; // all | users | projects | communities | posts
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 30);

    if (!query || query.length < 2) {
      return NextResponse.json({ results: { users: [], projects: [], communities: [] } });
    }

    const results: Record<string, unknown[]> = {
      users: [],
      projects: [],
      communities: [],
      posts: [],
    };

    // Search users
    if (type === "all" || type === "users") {
      results.users = await prisma.user.findMany({
        where: {
          isBanned: false,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { bio: { contains: query, mode: "insensitive" } },
            { headline: { contains: query, mode: "insensitive" } },
            {
              githubProfile: {
                username: { contains: query, mode: "insensitive" },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          image: true,
          headline: true,
          onlineStatus: true,
          githubProfile: {
            select: {
              username: true,
              experienceLevel: true,
              topLanguages: true,
            },
          },
        },
        take: limit,
      });
    }

    // Search projects
    if (type === "all" || type === "projects") {
      results.projects = await prisma.project.findMany({
        where: {
          isPublic: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query.toLowerCase()] } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          techStack: true,
          status: true,
          _count: { select: { members: true } },
          creator: { select: { id: true, name: true, image: true } },
        },
        take: limit,
      });
    }

    // Search communities
    if (type === "all" || type === "communities") {
      results.communities = await prisma.community.findMany({
        where: {
          isPublic: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query.toLowerCase()] } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          memberCount: true,
          image: true,
        },
        take: limit,
      });
    }

    // Search posts
    if (type === "all" || type === "posts") {
      results.posts = await prisma.post.findMany({
        where: {
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query.toLowerCase()] } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          tags: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              githubProfile: { select: { username: true } },
            },
          },
          _count: { select: { comments: true, reactions: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    }

    return NextResponse.json({ results, query });
  } catch (error) {
    console.error("[Search API] GET error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
