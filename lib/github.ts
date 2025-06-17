const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN!

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  public_repos: number
  followers: number
  following: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export const fetchGitHubStats = async (username: string) => {
  try {
    const [user, repos] = await Promise.all([fetchGitHubUser(username), fetchGitHubRepos(username)])

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)
    const languages = repos
      .filter((repo) => repo.language)
      .reduce(
        (acc, repo) => {
          acc[repo.language] = (acc[repo.language] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    return {
      user,
      repos: user.public_repos,
      stars: totalStars,
      forks: totalForks,
      followers: user.followers,
      languages: Object.keys(languages).slice(0, 5),
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error)
    throw error
  }
}
