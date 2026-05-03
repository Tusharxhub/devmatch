import { z } from "zod";

const isWorker = process.env.DEVMATCH_SERVICE === "worker";

// Worker only needs a subset of env vars
const workerSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

const appSchema = workerSchema.extend({
  GITHUB_ID: z.string().min(1, "GITHUB_ID is required"),
  GITHUB_SECRET: z.string().min(1, "GITHUB_SECRET is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
});

const schema = isWorker ? workerSchema : appSchema;
const parsedEnv = schema.safeParse(process.env);

if (!parsedEnv.success) {
  const missingOrInvalid = parsedEnv.error.issues
    .map((issue) => issue.path.join("."))
    .filter(Boolean)
    .join(", ");

  throw new Error(
    `Invalid environment configuration. Check: ${missingOrInvalid}`
  );
}

// For the app, cast to full env type; for worker, only the subset is available.
export const env = parsedEnv.data as z.infer<typeof appSchema>;
