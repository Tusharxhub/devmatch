// lib/auth.ts
// NextAuth configuration with GitHub OAuth + Prisma adapter
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { enqueueGithubSync, enqueueMatchCompute } from "@/lib/queue";
import { env } from "@/lib/env";

function logInfo(event: string, context?: Record<string, unknown>) {
  console.info(`[Auth] ${event}`, context ?? {});
}

function logWarn(event: string, context?: Record<string, unknown>) {
  console.warn(`[Auth] ${event}`, context ?? {});
}

function logError(event: string, error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error("Unknown error");
  console.error(`[Auth] ${event}`, {
    ...context,
    name: err.name,
    message: err.message,
  });
}

const providers: NextAuthOptions["providers"] = [
  GitHubProvider({
    clientId: env.GITHUB_ID,
    clientSecret: env.GITHUB_SECRET,
    authorization: {
      params: {
        scope: "read:user user:email repo",
      },
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
  }),
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  providers,

  callbacks: {
    async jwt({ token, user, profile, account }) {
      if (user?.id) {
        token.id = user.id;
      } else if (!token.id && token.sub) {
        token.id = token.sub;
      }

      if (account?.provider === "github" && profile) {
        token.githubUsername = (profile as { login?: string }).login;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            role: true,
            isBanned: true,
            githubProfile: { select: { username: true } },
          },
        });
        if (!token.githubUsername && dbUser?.githubProfile?.username) {
          token.githubUsername = dbUser.githubProfile.username;
        }
        token.role = dbUser?.role;
        token.isBanned = dbUser?.isBanned;
      }

      return token;
    },

    async signIn({ user, account, profile }) {
      if (user.id) {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isBanned: true },
        }).catch(() => null);

        if (existingUser?.isBanned) {
          logWarn("blocked_banned_user_signin", { userId: user.id });
          return false;
        }
      }

      if (account?.provider === "github" && profile) {
        const githubProfile = profile as {
          login: string;
          id: number;
          avatar_url: string;
          html_url: string;
        };

        try {
          // Upsert GitHub profile data
          await prisma.githubProfile.upsert({
            where: { githubId: githubProfile.id },
            update: {
              username: githubProfile.login,
              avatarUrl: githubProfile.avatar_url,
              profileUrl: githubProfile.html_url,
            },
            create: {
              userId: user.id,
              githubId: githubProfile.id,
              username: githubProfile.login,
              avatarUrl: githubProfile.avatar_url,
              profileUrl: githubProfile.html_url,
            },
          });

          // Enqueue background job to fetch detailed GitHub data
          if (account.access_token) {
            await enqueueGithubSync({
              userId: user.id,
              githubUsername: githubProfile.login,
              accessToken: account.access_token,
            }).catch((err) => {
              logWarn("github_sync_enqueue_failed", {
                userId: user.id,
                reason: err instanceof Error ? err.message : "unknown",
              });
            });
          }
        } catch (error) {
          logError("signin_callback_error", error, { userId: user.id });
          // Don't block sign-in on profile sync failure
        }
      }

      return true;
    },

    async session({ session, token }) {
      const userId = token.id ?? token.sub;

      if (session.user) {
        session.user.id = userId ?? "";

        if (token.githubUsername) {
          (session.user as { githubUsername?: string }).githubUsername =
            token.githubUsername;
        }
        if (token.role) {
          session.user.role = token.role;
        }
        if (typeof token.isBanned === "boolean") {
          session.user.isBanned = token.isBanned;
        }

        if (userId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              role: true,
              isBanned: true,
              githubProfile: { select: { username: true } },
            },
          });

          if (dbUser?.githubProfile) {
            (session.user as { githubUsername?: string }).githubUsername =
              dbUser.githubProfile.username;
          }
          session.user.role = dbUser?.role;
          session.user.isBanned = dbUser?.isBanned;
        }
      }

      // Update online status
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { onlineStatus: true, lastSeenAt: new Date() },
        }).catch(() => {});
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Keep users away from auth pages after successful sign in.
      if (url.startsWith("/auth")) return `${baseUrl}/dashboard`;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  events: {
    async createUser({ user }) {
      logInfo("user_created", { userId: user.id });

      // Create default user intent
      await prisma.userIntent.create({
        data: {
          userId: user.id,
          lookingFor: ["collaborator"],
          projectInterests: ["web"],
          availableHours: 10,
        },
      }).catch(() => {});
    },

    async signIn({ user }) {
      logInfo("user_signed_in", { userId: user.id });

      // Re-trigger match computation on each sign-in
      await enqueueMatchCompute({
        userId: user.id!,
      }).catch((err) => {
        logWarn("match_compute_enqueue_failed", {
          userId: user.id,
          reason: err instanceof Error ? err.message : "unknown",
        });
      });
    },

    async signOut(message) {
      const token = "token" in message ? message.token : null;
      if (token?.sub) {
        try {
          await prisma.user.update({
            where: { id: token.sub },
            data: { onlineStatus: false, lastSeenAt: new Date() },
          });
        } catch {
          // Silently fail - user is signing out anyway.
        }
      }
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: env.NEXTAUTH_SECRET,
  debug: false,
};
