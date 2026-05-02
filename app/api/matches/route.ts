// app/api/matches/route.ts
// GET: Fetch precomputed match scores for the authenticated user
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCacheOrFetch } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const offset = parseInt(searchParams.get("offset") || "0");
  const minScore = parseFloat(searchParams.get("minScore") || "0");

  try {
    const cacheKey = `matches:${session.user.id}:${limit}:${offset}:${minScore}`;

    const matches = await getCacheOrFetch(
      cacheKey,
      async () => {
        const [users, matchScores] = await Promise.all([
          prisma.user.findMany({
            where: {
              id: { not: session.user.id },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
              location: true,
              onlineStatus: true,
              lastSeenAt: true,
              githubProfile: {
                select: {
                  username: true,
                  avatarUrl: true,
                  profileUrl: true,
                  topLanguages: true,
                  contributions: true,
                  totalStars: true,
                  experienceLevel: true,
                },
              },
            },
          }),
          prisma.matchScore.findMany({
            where: {
              userId: session.user.id,
            },
            select: {
              id: true,
              targetUserId: true,
              overallScore: true,
              languageScore: true,
              activityScore: true,
              experienceScore: true,
              intentScore: true,
              reasons: true,
            },
          }),
        ]);

        const scoreByTarget = new Map(
          matchScores.map((score) => [score.targetUserId, score])
        );

        return users
          .map((user) => {
            const score = scoreByTarget.get(user.id);

            return {
              id: score?.id ?? `user-${user.id}`,
              overallScore: score?.overallScore ?? 0,
              languageScore: score?.languageScore ?? 0,
              activityScore: score?.activityScore ?? 0,
              experienceScore: score?.experienceScore ?? 0,
              intentScore: score?.intentScore ?? 0,
              reasons: (score?.reasons as string[] | undefined) ?? [],
              targetUser: user,
            };
          })
          .filter((entry) => entry.overallScore >= minScore)
          .sort((a, b) => b.overallScore - a.overallScore);
      },
      300 // 5 minutes cache
    );

    const total = await prisma.user.count({
      where: { id: { not: session.user.id } },
    });

    return NextResponse.json({ matches, total, limit, offset });
  } catch (error) {
    console.error("[API:Matches] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
