// lib/github.ts
// GitHub GraphQL API integration for fetching developer profiles

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export interface GithubLanguage {
  name: string;
  percentage: number;
  color: string;
  size: number;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  updatedAt: string;
}

export interface GithubUserData {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  contributions: number;
  topLanguages: GithubLanguage[];
  pinnedRepos: GithubRepo[];
  experienceLevel: string;
  activityData: {
    totalContributions: number;
    weeks: Array<{ contributionCount: number; date: string }>;
  };
}

const USER_PROFILE_QUERY = `
query UserProfile($username: String!) {
  user(login: $username) {
    login
    avatarUrl
    url
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        stargazerCount
        forkCount
        primaryLanguage { name color }
        url
        updatedAt
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
          totalSize
        }
      }
    }
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name description stargazerCount forkCount
          primaryLanguage { name color }
          url
        }
      }
    }
    followers { totalCount }
    following { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount date } }
      }
    }
  }
}`;

async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
  retries = 2
): Promise<T> {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
      "User-Agent": "DevMatch-v2",
    },
    body: JSON.stringify({ query, variables }),
  });

  // Handle rate limiting
  if (res.status === 403 || res.status === 429) {
    const retryAfter = res.headers.get("retry-after");
    const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");

    if (rateLimitRemaining === "0" || res.status === 429) {
      const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 60_000;
      if (retries > 0) {
        console.warn(`[GitHub] Rate limited, waiting ${waitMs / 1000}s before retry...`);
        await new Promise((resolve) => setTimeout(resolve, Math.min(waitMs, 120_000)));
        return graphqlRequest<T>(query, variables, token, retries - 1);
      }
      throw new Error(`GitHub API rate limited. Retry after ${waitMs / 1000}s`);
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API error (${res.status}): ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  if (json.errors) {
    // Check for rate-limit errors in the GraphQL response
    const rateLimited = json.errors.some(
      (e: { type?: string }) => e.type === "RATE_LIMITED"
    );
    if (rateLimited && retries > 0) {
      console.warn("[GitHub] GraphQL rate limited, retrying in 60s...");
      await new Promise((resolve) => setTimeout(resolve, 60_000));
      return graphqlRequest<T>(query, variables, token, retries - 1);
    }
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

function computeLanguages(repos: Array<{
  languages: { edges: Array<{ size: number; node: { name: string; color: string } }>; totalSize: number };
}>): GithubLanguage[] {
  const map = new Map<string, { size: number; color: string }>();
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const ex = map.get(edge.node.name);
      map.set(edge.node.name, { size: (ex?.size || 0) + edge.size, color: edge.node.color || "#808080" });
    }
  }
  const total = Array.from(map.values()).reduce((s, l) => s + l.size, 0);
  return Array.from(map.entries())
    .map(([name, d]) => ({ name, percentage: Math.round((d.size / total) * 1000) / 10, color: d.color, size: d.size }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 15);
}

function computeExperienceLevel(d: { publicRepos: number; totalStars: number; contributions: number; followers: number }): string {
  let s = 0;
  if (d.publicRepos > 50) s += 3; else if (d.publicRepos > 20) s += 2; else if (d.publicRepos > 5) s += 1;
  if (d.totalStars > 500) s += 3; else if (d.totalStars > 100) s += 2; else if (d.totalStars > 10) s += 1;
  if (d.contributions > 1000) s += 3; else if (d.contributions > 300) s += 2; else if (d.contributions > 50) s += 1;
  if (d.followers > 100) s += 3; else if (d.followers > 20) s += 2; else if (d.followers > 5) s += 1;
  if (s >= 10) return "expert";
  if (s >= 7) return "advanced";
  if (s >= 4) return "intermediate";
  return "beginner";
}

export async function fetchGithubUserData(username: string, token: string): Promise<GithubUserData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await graphqlRequest<{ user: any }>(USER_PROFILE_QUERY, { username }, token);
  const u = data.user;
  const repos = u.repositories.nodes;
  const totalStars = repos.reduce((s: number, r: { stargazerCount: number }) => s + r.stargazerCount, 0);
  const totalForks = repos.reduce((s: number, r: { forkCount: number }) => s + r.forkCount, 0);
  const contributions = u.contributionsCollection.contributionCalendar.totalContributions;
  const topLanguages = computeLanguages(repos);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinnedRepos: GithubRepo[] = u.pinnedItems.nodes.map((r: any) => ({
    name: r.name, description: r.description, stars: r.stargazerCount,
    forks: r.forkCount, language: r.primaryLanguage?.name || null, url: r.url, updatedAt: "",
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const weeks = u.contributionsCollection.contributionCalendar.weeks.map((w: any) => ({
    contributionCount: w.contributionDays.reduce((s: number, d: { contributionCount: number }) => s + d.contributionCount, 0),
    date: w.contributionDays[0]?.date || "",
  }));
  return {
    username: u.login, avatarUrl: u.avatarUrl, profileUrl: u.url,
    publicRepos: u.repositories.totalCount, followers: u.followers.totalCount,
    following: u.following.totalCount, totalStars, totalForks, contributions,
    topLanguages, pinnedRepos,
    experienceLevel: computeExperienceLevel({ publicRepos: u.repositories.totalCount, totalStars, contributions, followers: u.followers.totalCount }),
    activityData: { totalContributions: contributions, weeks },
  };
}
