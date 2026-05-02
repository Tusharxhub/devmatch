// lib/match.ts
// Multi-factor matching algorithm for computing developer compatibility scores

import type { GithubProfile, UserIntent } from "@prisma/client";

interface UserProfile {
  githubProfile: GithubProfile | null;
  intent: UserIntent | null;
}

interface MatchResult {
  overallScore: number;
  languageScore: number;
  activityScore: number;
  experienceScore: number;
  intentScore: number;
  reasons: string[];
}

// Weight configuration for each factor
const WEIGHTS = {
  language: 0.35,
  activity: 0.20,
  experience: 0.20,
  intent: 0.25,
};

// ─── Language Compatibility ───────────────────────────────────────────────────
function computeLanguageScore(
  userLangs: Array<{ name: string; percentage: number }>,
  targetLangs: Array<{ name: string; percentage: number }>
): { score: number; reasons: string[] } {
  if (!userLangs.length || !targetLangs.length) return { score: 0, reasons: [] };

  const userLangSet = new Set(userLangs.map((l) => l.name.toLowerCase()));
  const targetLangSet = new Set(targetLangs.map((l) => l.name.toLowerCase()));
  const common = Array.from(userLangSet).filter((l) => targetLangSet.has(l));

  if (common.length === 0) return { score: 5, reasons: ["Complementary language stacks"] };

  // Jaccard similarity with percentage weighting
  const union = new Set([...Array.from(userLangSet), ...Array.from(targetLangSet)]);
  const jaccardBase = common.length / union.size;

  // Weight by how significant the common languages are
  const userCommonWeight = userLangs
    .filter((l) => common.includes(l.name.toLowerCase()))
    .reduce((s, l) => s + l.percentage, 0);
  const targetCommonWeight = targetLangs
    .filter((l) => common.includes(l.name.toLowerCase()))
    .reduce((s, l) => s + l.percentage, 0);
  const weightFactor = (userCommonWeight + targetCommonWeight) / 200;

  const score = Math.min(100, Math.round((jaccardBase * 60 + weightFactor * 40)));
  const reasons = common.length > 0
    ? [`${common.length} shared language${common.length > 1 ? "s" : ""}: ${common.slice(0, 5).join(", ")}`]
    : [];

  return { score, reasons };
}

// ─── Activity Similarity ──────────────────────────────────────────────────────
function computeActivityScore(
  userProfile: GithubProfile | null,
  targetProfile: GithubProfile | null
): { score: number; reasons: string[] } {
  if (!userProfile || !targetProfile) return { score: 0, reasons: [] };

  const userActivity = userProfile.contributions;
  const targetActivity = targetProfile.contributions;

  if (userActivity === 0 && targetActivity === 0) return { score: 50, reasons: ["Both just getting started"] };

  // Ratio-based similarity (closer to 1.0 = more similar)
  const maxA = Math.max(userActivity, targetActivity);
  const minA = Math.min(userActivity, targetActivity);
  const ratio = maxA > 0 ? minA / maxA : 0;

  // Stars and forks similarity
  const maxS = Math.max(userProfile.totalStars, targetProfile.totalStars, 1);
  const minS = Math.min(userProfile.totalStars, targetProfile.totalStars);
  const starRatio = minS / maxS;

  const score = Math.round((ratio * 60 + starRatio * 40));
  const reasons: string[] = [];

  if (ratio > 0.7) reasons.push("Similar contribution activity levels");
  if (starRatio > 0.5) reasons.push("Comparable project impact");

  return { score, reasons };
}

// ─── Experience Compatibility ─────────────────────────────────────────────────
const LEVEL_MAP: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

function computeExperienceScore(
  userProfile: GithubProfile | null,
  targetProfile: GithubProfile | null
): { score: number; reasons: string[] } {
  if (!userProfile || !targetProfile) return { score: 0, reasons: [] };

  const userLevel = LEVEL_MAP[userProfile.experienceLevel] || 1;
  const targetLevel = LEVEL_MAP[targetProfile.experienceLevel] || 1;
  const diff = Math.abs(userLevel - targetLevel);

  // Same level or adjacent = good match
  // 0 diff = 90, 1 diff = 70, 2 diff = 40 (mentor/mentee), 3 diff = 20
  const scores: Record<number, number> = { 0: 90, 1: 70, 2: 40, 3: 20 };
  const score = scores[diff] ?? 10;

  const reasons: string[] = [];
  if (diff === 0) reasons.push(`Both at ${userProfile.experienceLevel} level`);
  else if (diff === 1) reasons.push("Adjacent experience levels — great for peer learning");
  else if (diff >= 2) reasons.push("Potential mentor-mentee relationship");

  return { score, reasons };
}

// ─── Intent Compatibility ─────────────────────────────────────────────────────
function computeIntentScore(
  userIntent: UserIntent | null,
  targetIntent: UserIntent | null
): { score: number; reasons: string[] } {
  if (!userIntent || !targetIntent) return { score: 50, reasons: [] };

  let score = 0;
  const reasons: string[] = [];

  // Check complementary intents (mentor seeks mentee and vice versa)
  const userLooking = new Set(userIntent.lookingFor);
  const targetLooking = new Set(targetIntent.lookingFor);

  if (userLooking.has("mentor") && targetLooking.has("mentee")) {
    score += 30; reasons.push("Mentor-mentee match");
  }
  if (userLooking.has("mentee") && targetLooking.has("mentor")) {
    score += 30; reasons.push("Mentor-mentee match");
  }
  if (userLooking.has("collaborator") && targetLooking.has("collaborator")) {
    score += 25; reasons.push("Both seeking collaborators");
  }
  if (userLooking.has("cofounder") && targetLooking.has("cofounder")) {
    score += 30; reasons.push("Both looking for cofounders");
  }

  // Project interest overlap
  const userInterests = new Set(userIntent.projectInterests);
  const targetInterests = new Set(targetIntent.projectInterests);
  const commonInterests = Array.from(userInterests).filter((i) => targetInterests.has(i));

  if (commonInterests.length > 0) {
    score += Math.min(30, commonInterests.length * 10);
    reasons.push(`Shared interests: ${commonInterests.join(", ")}`);
  }

  // Timezone compatibility (basic)
  if (userIntent.preferredTimezone && targetIntent.preferredTimezone) {
    if (userIntent.preferredTimezone === targetIntent.preferredTimezone) {
      score += 10; reasons.push("Same timezone");
    }
  }

  return { score: Math.min(100, score), reasons };
}

// ─── Main Matching Function ───────────────────────────────────────────────────
export function computeMatchScore(
  user: UserProfile,
  target: UserProfile
): MatchResult {
  const userLangs = (user.githubProfile?.topLanguages as Array<{ name: string; percentage: number }>) || [];
  const targetLangs = (target.githubProfile?.topLanguages as Array<{ name: string; percentage: number }>) || [];

  const lang = computeLanguageScore(userLangs, targetLangs);
  const activity = computeActivityScore(user.githubProfile, target.githubProfile);
  const exp = computeExperienceScore(user.githubProfile, target.githubProfile);
  const intent = computeIntentScore(user.intent, target.intent);

  const overall = Math.round(
    lang.score * WEIGHTS.language +
    activity.score * WEIGHTS.activity +
    exp.score * WEIGHTS.experience +
    intent.score * WEIGHTS.intent
  );

  return {
    overallScore: Math.min(100, Math.max(0, overall)),
    languageScore: lang.score,
    activityScore: activity.score,
    experienceScore: exp.score,
    intentScore: intent.score,
    reasons: [...lang.reasons, ...activity.reasons, ...exp.reasons, ...intent.reasons],
  };
}
