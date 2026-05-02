// lib/queue.ts
// BullMQ job queue for background processing
import { Queue, Worker, Job, QueueEvents } from "bullmq";
import Redis from "ioredis";

// Create a separate Redis connection for BullMQ (required by BullMQ)
function createBullConnection() {
  return new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
  });
}

// ─── Queue Definitions ────────────────────────────────────────────────────────

export const QUEUE_NAMES = {
  GITHUB_SYNC: "github-sync",
  MATCH_COMPUTE: "match-compute",
  NOTIFICATION: "notification",
} as const;

// ─── Queue Instances ──────────────────────────────────────────────────────────

const queues = new Map<string, Queue>();

export function getQueue(name: string): Queue {
  if (!queues.has(name)) {
    const queue = new Queue(name, {
      connection: createBullConnection(),
      defaultJobOptions: {
        removeOnComplete: {
          age: 3600, // keep completed jobs for 1 hour
          count: 100, // keep max 100 completed jobs
        },
        removeOnFail: {
          age: 86400, // keep failed jobs for 24 hours
        },
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    });
    queues.set(name, queue);
  }
  return queues.get(name)!;
}

// ─── Job Types ────────────────────────────────────────────────────────────────

export interface GithubSyncJobData {
  userId: string;
  githubUsername: string;
  accessToken: string;
}

export interface MatchComputeJobData {
  userId: string;
  recomputeAll?: boolean;
}

export interface NotificationJobData {
  userId: string;
  type: "match_found" | "message_received" | "profile_viewed";
  payload: Record<string, unknown>;
}

// ─── Queue Helpers ────────────────────────────────────────────────────────────

export async function enqueueGithubSync(data: GithubSyncJobData): Promise<Job> {
  const queue = getQueue(QUEUE_NAMES.GITHUB_SYNC);
  return queue.add("sync-profile", data, {
    jobId: `github-sync-${data.userId}`, // Deduplicate: only one sync per user at a time
    priority: 1,
  });
}

export async function enqueueMatchCompute(data: MatchComputeJobData): Promise<Job> {
  const queue = getQueue(QUEUE_NAMES.MATCH_COMPUTE);
  return queue.add("compute-matches", data, {
    jobId: `match-compute-${data.userId}-${Date.now()}`,
    priority: 2,
    delay: 5000, // Wait 5s for GitHub sync to complete
  });
}

export async function enqueueNotification(data: NotificationJobData): Promise<Job> {
  const queue = getQueue(QUEUE_NAMES.NOTIFICATION);
  return queue.add("send-notification", data, {
    priority: 3,
  });
}

// ─── Worker Factory (used by worker service) ──────────────────────────────────

export function createWorker(
  queueName: string,
  processor: (job: Job) => Promise<void>,
  concurrency: number = 3
): Worker {
  const worker = new Worker(queueName, processor, {
    connection: createBullConnection(),
    concurrency,
    limiter: {
      max: 10,
      duration: 1000, // max 10 jobs per second
    },
  });

  worker.on("completed", (job: Job) => {
    console.log(`[Worker:${queueName}] Job ${job.id} completed`);
  });

  worker.on("failed", (job: Job | undefined, error: Error) => {
    console.error(
      `[Worker:${queueName}] Job ${job?.id} failed:`,
      error.message
    );
  });

  worker.on("error", (error: Error) => {
    console.error(`[Worker:${queueName}] Error:`, error.message);
  });

  return worker;
}

// ─── Queue Events (for monitoring) ────────────────────────────────────────────

export function createQueueEvents(queueName: string): QueueEvents {
  return new QueueEvents(queueName, {
    connection: createBullConnection(),
  });
}
