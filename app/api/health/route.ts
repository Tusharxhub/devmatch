// app/api/health/route.ts
// Health check endpoint for Docker + load balancers
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRedisHealth } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const services: Record<string, string> = { app: "running" };
  let isHealthy = true;

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    services.database = "connected";
  } catch {
    services.database = "disconnected";
    isHealthy = false;
  }

  // Check Redis connectivity
  try {
    const redisOk = await checkRedisHealth();
    services.redis = redisOk ? "connected" : "degraded";
    if (!redisOk) isHealthy = false;
  } catch {
    services.redis = "disconnected";
    // Redis being down is not fatal — mark as degraded but not unhealthy
  }

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      services,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
