// app/api/matches/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  limit: z.string().optional(),
  cursor: z.string().optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });

  const limit = Math.min(parsed.data.limit ? parseInt(parsed.data.limit) : 20, 50);
  const cursor = parsed.data.cursor;
  const minScore = parsed.data.minScore ?? 0;

  // Retrieve potential matches (excluding self) – placeholder logic
  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id }, isBanned: false },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      location: true,
      onlineStatus: true,
      githubProfile: { select: { username: true, topLanguages: true, contributions: true, totalStars: true, experienceLevel: true } },
      intent: true,
      _count: { select: { matchesAsUser: true } },
    },
  });

  // TODO: replace with real match scoring algorithm – currently random scores for demo
  const scored = users
    .map((u) => {
      const overallScore = Math.floor(Math.random() * 100);
      return {
        ...u,
        overallScore,
        languageScore: Math.random() * 100,
        activityScore: Math.random() * 100,
        experienceScore: Math.random() * 100,
        intentScore: Math.random() * 100,
        reasons: [],
      };
    })
    .filter((m) => m.overallScore >= minScore);

  // Pagination via cursor (using id as marker)
  let startIdx = 0;
  if (cursor) {
    const idx = scored.findIndex((m) => m.id === cursor);
    startIdx = idx >= 0 ? idx + 1 : 0;
  }
  const paged = scored.slice(startIdx, startIdx + limit);
  const nextCursor = paged.length === limit ? paged[paged.length - 1].id : null;

  return NextResponse.json({ matches: paged, nextCursor, hasMore: !!nextCursor });
}
