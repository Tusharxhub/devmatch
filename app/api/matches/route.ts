// app/api/matches/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeMatchScore } from "@/lib/match";
import { z } from "zod";

const querySchema = z.object({
  limit: z.string().optional(),
  cursor: z.string().optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  refresh: z.coerce.boolean().optional(),
});

async function computeAndStoreMatches(userId: string) {
  const source = await prisma.user.findUnique({
    where: { id: userId },
    include: { githubProfile: true, intent: true },
  });

  if (!source) return;

  const candidates = await prisma.user.findMany({
    where: {
      id: { not: userId },
      isBanned: false,
    },
    take: 250,
    include: { githubProfile: true, intent: true },
  });

  await Promise.all(
    candidates.map((candidate) => {
      const score = computeMatchScore(
        { githubProfile: source.githubProfile, intent: source.intent },
        { githubProfile: candidate.githubProfile, intent: candidate.intent }
      );

      return prisma.matchScore.upsert({
        where: {
          userId_targetUserId: {
            userId,
            targetUserId: candidate.id,
          },
        },
        update: {
          overallScore: score.overallScore,
          languageScore: score.languageScore,
          activityScore: score.activityScore,
          experienceScore: score.experienceScore,
          intentScore: score.intentScore,
          reasons: score.reasons,
          computedAt: new Date(),
        },
        create: {
          userId,
          targetUserId: candidate.id,
          overallScore: score.overallScore,
          languageScore: score.languageScore,
          activityScore: score.activityScore,
          experienceScore: score.experienceScore,
          intentScore: score.intentScore,
          reasons: score.reasons,
        },
      });
    })
  );
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });

  const limit = Math.min(parsed.data.limit ? parseInt(parsed.data.limit) : 20, 50);
  const cursor = parsed.data.cursor;
  const minScore = parsed.data.minScore ?? 0;

  const existingMatchCount = await prisma.matchScore.count({
    where: { userId: session.user.id },
  });

  if (existingMatchCount === 0 || parsed.data.refresh) {
    await computeAndStoreMatches(session.user.id);
  }

  const matches = await prisma.matchScore.findMany({
    where: {
      userId: session.user.id,
      overallScore: { gte: minScore },
      targetUser: { isBanned: false },
    },
    orderBy: [{ overallScore: "desc" }, { computedAt: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      targetUser: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          location: true,
          onlineStatus: true,
          headline: true,
          githubProfile: {
            select: {
              username: true,
              topLanguages: true,
              contributions: true,
              totalStars: true,
              experienceLevel: true,
            },
          },
        },
      },
    },
  });

  const hasMore = matches.length > limit;
  const paged = hasMore ? matches.slice(0, -1) : matches;
  const nextCursor = hasMore ? paged[paged.length - 1]?.id : null;

  return NextResponse.json({ matches: paged, nextCursor, hasMore });
}
