import { Prisma, PrismaClient } from "@prisma/client";
import { computeMatchScore } from "../lib/match";

const prisma = new PrismaClient();

const developers = [
  {
    email: "sarah.chen@devmatch.local",
    name: "Sarah Chen",
    headline: "Staff full-stack engineer building collaborative AI tooling",
    location: "San Francisco, CA",
    username: "sarahbuilds",
    githubId: 900001,
    experienceLevel: "expert",
    topLanguages: [
      { name: "TypeScript", percentage: 42, color: "#3178c6", size: 42000 },
      { name: "Go", percentage: 22, color: "#00ADD8", size: 22000 },
      { name: "PostgreSQL", percentage: 14, color: "#336791", size: 14000 },
    ],
    stats: { publicRepos: 68, followers: 520, following: 74, totalStars: 1840, totalForks: 240, contributions: 2160 },
    intent: {
      lookingFor: ["collaborator", "mentor"],
      projectInterests: ["ai", "web", "devtools"],
      availableHours: 8,
      preferredTimezone: "America/Los_Angeles",
    },
  },
  {
    email: "marcus.johnson@devmatch.local",
    name: "Marcus Johnson",
    headline: "Backend engineer focused on distributed systems and observability",
    location: "Austin, TX",
    username: "marcusops",
    githubId: 900002,
    experienceLevel: "advanced",
    topLanguages: [
      { name: "Rust", percentage: 36, color: "#dea584", size: 36000 },
      { name: "Python", percentage: 26, color: "#3572A5", size: 26000 },
      { name: "Go", percentage: 21, color: "#00ADD8", size: 21000 },
    ],
    stats: { publicRepos: 41, followers: 210, following: 90, totalStars: 760, totalForks: 118, contributions: 1280 },
    intent: {
      lookingFor: ["collaborator", "cofounder"],
      projectInterests: ["devops", "data", "security"],
      availableHours: 12,
      preferredTimezone: "America/Chicago",
    },
  },
  {
    email: "yuki.tanaka@devmatch.local",
    name: "Yuki Tanaka",
    headline: "DevOps lead making deployment pipelines boring in the best way",
    location: "Tokyo, Japan",
    username: "yukiships",
    githubId: 900003,
    experienceLevel: "advanced",
    topLanguages: [
      { name: "Go", percentage: 34, color: "#00ADD8", size: 34000 },
      { name: "Terraform", percentage: 25, color: "#844FBA", size: 25000 },
      { name: "TypeScript", percentage: 18, color: "#3178c6", size: 18000 },
    ],
    stats: { publicRepos: 53, followers: 340, following: 106, totalStars: 980, totalForks: 150, contributions: 1740 },
    intent: {
      lookingFor: ["collaborator", "mentor"],
      projectInterests: ["devops", "web", "security"],
      availableHours: 6,
      preferredTimezone: "Asia/Tokyo",
    },
  },
  {
    email: "amina.rahman@devmatch.local",
    name: "Amina Rahman",
    headline: "Product-minded frontend engineer working on community systems",
    location: "London, UK",
    username: "aminaui",
    githubId: 900004,
    experienceLevel: "intermediate",
    topLanguages: [
      { name: "TypeScript", percentage: 48, color: "#3178c6", size: 48000 },
      { name: "React", percentage: 28, color: "#61dafb", size: 28000 },
      { name: "CSS", percentage: 12, color: "#563d7c", size: 12000 },
    ],
    stats: { publicRepos: 26, followers: 96, following: 144, totalStars: 240, totalForks: 42, contributions: 820 },
    intent: {
      lookingFor: ["collaborator", "mentee"],
      projectInterests: ["web", "mobile", "ai"],
      availableHours: 10,
      preferredTimezone: "Europe/London",
    },
  },
];

async function main() {
  const users = [];

  for (const developer of developers) {
    const user = await prisma.user.upsert({
      where: { email: developer.email },
      update: {
        name: developer.name,
        headline: developer.headline,
        location: developer.location,
        bio: `${developer.name.split(" ")[0]} is exploring collaboration around ${developer.intent.projectInterests.join(", ")}.`,
        image: `https://avatars.githubusercontent.com/u/${developer.githubId}?v=4`,
        availability: "AVAILABLE",
      },
      create: {
        email: developer.email,
        name: developer.name,
        headline: developer.headline,
        location: developer.location,
        bio: `${developer.name.split(" ")[0]} is exploring collaboration around ${developer.intent.projectInterests.join(", ")}.`,
        image: `https://avatars.githubusercontent.com/u/${developer.githubId}?v=4`,
        availability: "AVAILABLE",
      },
    });

    await prisma.githubProfile.upsert({
      where: { userId: user.id },
      update: {
        username: developer.username,
        avatarUrl: user.image,
        profileUrl: `https://github.com/${developer.username}`,
        ...developer.stats,
        topLanguages: developer.topLanguages as Prisma.InputJsonValue,
        pinnedRepos: [
          {
            name: "signalroom",
            description: "Collaboration primitives for high-signal developer teams.",
            stars: Math.floor(developer.stats.totalStars / 4),
            forks: Math.floor(developer.stats.totalForks / 4),
            language: developer.topLanguages[0].name,
            url: `https://github.com/${developer.username}/signalroom`,
          },
        ] as Prisma.InputJsonValue,
        activityData: { totalContributions: developer.stats.contributions } as Prisma.InputJsonValue,
        experienceLevel: developer.experienceLevel,
      },
      create: {
        userId: user.id,
        githubId: developer.githubId,
        username: developer.username,
        avatarUrl: user.image,
        profileUrl: `https://github.com/${developer.username}`,
        ...developer.stats,
        topLanguages: developer.topLanguages as Prisma.InputJsonValue,
        pinnedRepos: [] as Prisma.InputJsonValue,
        activityData: { totalContributions: developer.stats.contributions } as Prisma.InputJsonValue,
        experienceLevel: developer.experienceLevel,
      },
    });

    await prisma.userIntent.upsert({
      where: { userId: user.id },
      update: developer.intent,
      create: { userId: user.id, ...developer.intent },
    });

    for (const language of developer.topLanguages) {
      const skill = await prisma.skill.upsert({
        where: { name: language.name },
        update: { color: language.color, category: "language" },
        create: { name: language.name, color: language.color, category: "language" },
      });

      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId: user.id, skillId: skill.id } },
        update: { proficiency: language.percentage > 30 ? 5 : 4, isPrimary: language.percentage > 25 },
        create: {
          userId: user.id,
          skillId: skill.id,
          proficiency: language.percentage > 30 ? 5 : 4,
          isPrimary: language.percentage > 25,
        },
      });
    }

    users.push(user);
  }

  const [owner] = users;

  const project = await prisma.project.upsert({
    where: { slug: "signalroom" },
    update: {},
    create: {
      name: "SignalRoom",
      slug: "signalroom",
      description: "A lightweight collaboration cockpit for technical teams building in public.",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
      tags: ["devtools", "collaboration", "open-source"],
      creatorId: owner.id,
      members: {
        create: users.slice(0, 3).map((user, index) => ({
          userId: user.id,
          role: index === 0 ? "OWNER" : "CONTRIBUTOR",
        })),
      },
      tasks: {
        create: [
          { title: "Design contributor invitation flow", status: "TODO", priority: "HIGH", order: 0 },
          { title: "Add realtime read receipts", status: "IN_PROGRESS", priority: "MEDIUM", order: 0 },
          { title: "Write launch architecture note", status: "REVIEW", priority: "LOW", order: 0 },
        ],
      },
    },
  });

  const community = await prisma.community.upsert({
    where: { slug: "devtools-foundry" },
    update: {},
    create: {
      name: "Devtools Foundry",
      slug: "devtools-foundry",
      description: "For developers building tools that make other developers faster.",
      creatorId: owner.id,
      tags: ["devtools", "design-systems", "infra"],
      memberCount: users.length,
      members: {
        create: users.map((user, index) => ({
          userId: user.id,
          role: index === 0 ? "OWNER" : "MEMBER",
        })),
      },
    },
  });

  const existingPost = await prisma.post.findFirst({
    where: {
      authorId: owner.id,
      title: "Looking for a realtime systems collaborator",
    },
  });

  if (!existingPost) {
    await prisma.post.create({
      data: {
        authorId: owner.id,
        projectId: project.id,
        communityId: community.id,
        type: "collaboration_request",
        title: "Looking for a realtime systems collaborator",
        content:
          "We are tightening presence, read receipts, and project activity streams for SignalRoom. Ideal collaborator has Socket.IO, Redis, or event architecture experience.",
        tags: ["realtime", "redis", "collaboration"],
      },
    });
  }

  const profiles = await prisma.user.findMany({
    include: { githubProfile: true, intent: true },
  });

  for (const user of profiles) {
    for (const target of profiles) {
      if (user.id === target.id) continue;
      const result = computeMatchScore(
        { githubProfile: user.githubProfile, intent: user.intent },
        { githubProfile: target.githubProfile, intent: target.intent }
      );
      await prisma.matchScore.upsert({
        where: { userId_targetUserId: { userId: user.id, targetUserId: target.id } },
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
          userId: user.id,
          targetUserId: target.id,
          overallScore: result.overallScore,
          languageScore: result.languageScore,
          activityScore: result.activityScore,
          experienceScore: result.experienceScore,
          intentScore: result.intentScore,
          reasons: result.reasons,
        },
      });
    }
  }

  console.log(`Seeded ${users.length} developers, 1 project, 1 community, and match scores.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
