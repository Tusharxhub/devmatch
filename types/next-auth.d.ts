// types/next-auth.d.ts
// Extend NextAuth types to include custom fields
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubUsername?: string;
      role?: "DEVELOPER" | "RECRUITER" | "ADMIN";
      isBanned?: boolean;
    };
  }

  interface User {
    id: string;
    githubUsername?: string;
    role?: "DEVELOPER" | "RECRUITER" | "ADMIN";
    isBanned?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    githubUsername?: string;
    role?: "DEVELOPER" | "RECRUITER" | "ADMIN";
    isBanned?: boolean;
  }
}
