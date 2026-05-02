// lib/auth.ts
// NextAuth configuration with GitHub OAuth + Prisma adapter
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { enqueueGithubSync, enqueueMatchCompute } from "@/lib/queue";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
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
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
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
              console.error("[Auth] Failed to enqueue GitHub sync:", err.message);
            });
          }
        } catch (error) {
          console.error("[Auth] Error during signIn callback:", error);
          // Don't block sign-in on profile sync failure
        }
      }

      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Attach GitHub username to session
        const githubProfile = await prisma.githubProfile.findUnique({
          where: { userId: user.id },
          select: { username: true },
        });

        if (githubProfile) {
          (session.user as { githubUsername?: string }).githubUsername =
            githubProfile.username;
        }
      }

      // Update online status
      await prisma.user.update({
        where: { id: user.id },
        data: { onlineStatus: true, lastSeenAt: new Date() },
      }).catch(() => {});

      return session;
    },

    async redirect({ url, baseUrl }) {
      // After sign in, redirect to dashboard
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  events: {
    async createUser({ user }) {
      console.log(`[Auth] New user created: ${user.id}`);

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
      console.log(`[Auth] User signed in: ${user.id}`);

      // Re-trigger match computation on each sign-in
      await enqueueMatchCompute({
        userId: user.id!,
      }).catch((err) => {
        console.error("[Auth] Failed to enqueue match compute:", err.message);
      });
    },

    async signOut(message) {
      // Update offline status - session-based signOut includes a session object
      const session = 'session' in message ? message.session : null;
      if (session) {
        // Extract user ID from session by querying the session token
        try {
          const dbSession = await prisma.session.findUnique({
            where: { sessionToken: (session as { sessionToken?: string }).sessionToken || '' },
            select: { userId: true },
          });
          if (dbSession) {
            await prisma.user.update({
              where: { id: dbSession.userId },
              data: { onlineStatus: false, lastSeenAt: new Date() },
            });
          }
        } catch {
          // Silently fail - user is signing out anyway
        }
      }
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
