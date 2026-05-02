// worker/index.ts
// Background worker service - runs as separate process
// Processes GitHub sync, match computation, and notification jobs

import { PrismaClient, Prisma } from "@prisma/client";
import { Job } from "bullmq";
import {
  createWorker,
  QUEUE_NAMES,
  type GithubSyncJobData,
  type MatchComputeJobData,
  type NotificationJobData,
} from "../lib/queue";
import { fetchGithubUserData } from "../lib/github";
import { computeMatchScore } from "../lib/match";
import { setCache } from "../lib/redis";

const prisma = new PrismaClient();

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  DevMatch v2 Worker Service Starting...  ");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// ─── GitHub Sync Processor ────────────────────────────────────────────────────

async function processGithubSync(job: Job<GithubSyncJobData>): Promise<void> {
  const { userId, githubUsername, accessToken } = job.data;
  console.log(`[GithubSync] Processing user: ${githubUsername}`);

  try {
    // Use provided access token or fall back to app token
    const token = accessToken || process.env.GITHUB_TOKEN!;
    const data = await fetchGithubUserData(githubUsername, token);

    // Update GitHub profile in DB
    await prisma.githubProfile.upsert({
      where: { userId },
      update: {
        publicRepos: data.publicRepos,
        followers: data.followers,
        following: data.following,
        totalStars: data.totalStars,
        totalForks: data.totalForks,
        contributions: data.contributions,
        topLanguages: JSON.parse(JSON.stringify(data.topLanguages)) as Prisma.InputJsonValue,
        pinnedRepos: JSON.parse(JSON.stringify(data.pinnedRepos)) as Prisma.InputJsonValue,
        activityData: JSON.parse(JSON.stringify(data.activityData)) as Prisma.InputJsonValue,
        experienceLevel: data.experienceLevel,
        fetchedAt: new Date(),
      },
      create: {
        userId,
        githubId: 0,
        username: githubUsername,
        avatarUrl: data.avatarUrl,
        profileUrl: data.profileUrl,
        publicRepos: data.publicRepos,
        followers: data.followers,
        following: data.following,
        totalStars: data.totalStars,
        totalForks: data.totalForks,
        contributions: data.contributions,
        topLanguages: JSON.parse(JSON.stringify(data.topLanguages)) as Prisma.InputJsonValue,
        pinnedRepos: JSON.parse(JSON.stringify(data.pinnedRepos)) as Prisma.InputJsonValue,
        activityData: JSON.parse(JSON.stringify(data.activityData)) as Prisma.InputJsonValue,
        experienceLevel: data.experienceLevel,
      },
    });

    // Auto-create skills from top languages
    for (const lang of data.topLanguages.slice(0, 10)) {
      const skill = await prisma.skill.upsert({
        where: { name: lang.name },
        update: { color: lang.color, category: "language" },
        create: { name: lang.name, color: lang.color, category: "language" },
      });

      const proficiency = lang.percentage > 30 ? 5 : lang.percentage > 15 ? 4 : lang.percentage > 5 ? 3 : 2;

      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId, skillId: skill.id } },
        update: { proficiency, isPrimary: lang.percentage > 20 },
        create: { userId, skillId: skill.id, proficiency, isPrimary: lang.percentage > 20 },
      });
    }

    // Cache the profile data
    await setCache(`github:profile:${userId}`, data, 3600);

    console.log(`[GithubSync] Completed for ${githubUsername}`);
    await job.updateProgress(100);
  } catch (error) {
    console.error(`[GithubSync] Failed for ${githubUsername}:`, error);
    throw error; // BullMQ will retry
  }
}

// ─── Match Compute Processor ──────────────────────────────────────────────────

async function processMatchCompute(job: Job<MatchComputeJobData>): Promise<void> {
  const { userId, recomputeAll } = job.data;
  console.log(`[MatchCompute] Computing matches for user: ${userId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { githubProfile: true, intent: true },
    });

    if (!user?.githubProfile) {
      console.log(`[MatchCompute] User ${userId} has no GitHub profile, skipping`);
      return;
    }

    // Get all other users with GitHub profiles
    const candidates = await prisma.user.findMany({
      where: { id: { not: userId }, githubProfile: { isNot: null } },
      include: { githubProfile: true, intent: true },
    });

    console.log(`[MatchCompute] Computing scores against ${candidates.length} candidates`);
    let processed = 0;

    for (const candidate of candidates) {
      const result = computeMatchScore(
        { githubProfile: user.githubProfile, intent: user.intent },
        { githubProfile: candidate.githubProfile, intent: candidate.intent }
      );

      // Store bidirectional match scores
      await prisma.matchScore.upsert({
        where: { userId_targetUserId: { userId, targetUserId: candidate.id } },
        update: {
          overallScore: result.overallScore,
          languageScore: result.languageScore,
          activityScore: result.activityScore,
          experienceScore: result.experienceScore,
          intentScore: result.intentScore,
          reasons: result.reasons,
          computedAt: new Date(),
        },
        create: {
          userId,
          targetUserId: candidate.id,
          overallScore: result.overallScore,
          languageScore: result.languageScore,
          activityScore: result.activityScore,
          experienceScore: result.experienceScore,
          intentScore: result.intentScore,
          reasons: result.reasons,
        },
      });

      // Also compute reverse match
      const reverseResult = computeMatchScore(
        { githubProfile: candidate.githubProfile, intent: candidate.intent },
        { githubProfile: user.githubProfile, intent: user.intent }
      );

      await prisma.matchScore.upsert({
        where: { userId_targetUserId: { userId: candidate.id, targetUserId: userId } },
        update: {
          overallScore: reverseResult.overallScore,
          languageScore: reverseResult.languageScore,
          activityScore: reverseResult.activityScore,
          experienceScore: reverseResult.experienceScore,
          intentScore: reverseResult.intentScore,
          reasons: reverseResult.reasons,
          computedAt: new Date(),
        },
        create: {
          userId: candidate.id,
          targetUserId: userId,
          overallScore: reverseResult.overallScore,
          languageScore: reverseResult.languageScore,
          activityScore: reverseResult.activityScore,
          experienceScore: reverseResult.experienceScore,
          intentScore: reverseResult.intentScore,
          reasons: reverseResult.reasons,
        },
      });

      processed++;
      await job.updateProgress(Math.round((processed / candidates.length) * 100));
    }

    // Invalidate cached matches
    await setCache(`matches:${userId}`, null, 1);

    console.log(`[MatchCompute] Completed ${processed} match pairs for user ${userId}`);
  } catch (error) {
    console.error(`[MatchCompute] Failed for user ${userId}:`, error);
    throw error;
  }
}

// ─── Notification Processor ───────────────────────────────────────────────────

async function processNotification(job: Job<NotificationJobData>): Promise<void> {
  const { userId, type, payload } = job.data;
  console.log(`[Notification] Sending ${type} to user: ${userId}`);
  // In production, integrate with Pusher/email/push notifications
  // For now, log the notification
  console.log(`[Notification] Payload:`, JSON.stringify(payload));
}

// ─── Start Workers ────────────────────────────────────────────────────────────

const githubWorker = createWorker(QUEUE_NAMES.GITHUB_SYNC, processGithubSync, 2);
const matchWorker = createWorker(QUEUE_NAMES.MATCH_COMPUTE, processMatchCompute, 1);
const notificationWorker = createWorker(QUEUE_NAMES.NOTIFICATION, processNotification, 5);

console.log("[Worker] All workers started successfully");
console.log(`[Worker] Listening on queues: ${Object.values(QUEUE_NAMES).join(", ")}`);

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

async function shutdown() {
  console.log("\n[Worker] Shutting down gracefully...");
  await Promise.all([
    githubWorker.close(),
    matchWorker.close(),
    notificationWorker.close(),
  ]);
  await prisma.$disconnect();
  console.log("[Worker] Shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("uncaughtException", (err) => {
  console.error("[Worker] Uncaught exception:", err);
  shutdown();
});
