// app/api/profile/route.ts
// GET: Fetch user profile, PATCH: Update profile
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const intentSchema = z.object({
  lookingFor: z.array(z.string().min(1).max(40)).max(10).optional(),
  projectInterests: z.array(z.string().min(1).max(40)).max(15).optional(),
  availableHours: z.coerce.number().int().min(1).max(80).optional(),
  preferredTimezone: z.string().max(80).nullable().optional(),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  bio: z.string().max(2000).nullable().optional(),
  headline: z.string().max(140).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  website: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  availability: z.enum(["AVAILABLE", "BUSY", "AWAY", "OFFLINE"]).optional(),
  lookingFor: intentSchema.shape.lookingFor,
  projectInterests: intentSchema.shape.projectInterests,
  availableHours: intentSchema.shape.availableHours,
  preferredTimezone: intentSchema.shape.preferredTimezone,
  intent: intentSchema.optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        githubProfile: true,
        skills: { include: { skill: true }, orderBy: { proficiency: "desc" } },
        intent: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API:Profile] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = updateProfileSchema.parse(await req.json());
    const intent = body.intent ?? {
      lookingFor: body.lookingFor,
      projectInterests: body.projectInterests,
      availableHours: body.availableHours,
      preferredTimezone: body.preferredTimezone,
    };

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.headline !== undefined && { headline: body.headline }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.website !== undefined && { website: body.website || null }),
        ...(body.availability !== undefined && { availability: body.availability }),
      },
    });

    // Update intent if provided
    if (
      intent.lookingFor !== undefined ||
      intent.projectInterests !== undefined ||
      intent.availableHours !== undefined ||
      intent.preferredTimezone !== undefined
    ) {
      await prisma.userIntent.upsert({
        where: { userId: session.user.id },
        update: {
          ...(intent.lookingFor !== undefined && { lookingFor: intent.lookingFor }),
          ...(intent.projectInterests !== undefined && { projectInterests: intent.projectInterests }),
          ...(intent.availableHours !== undefined && { availableHours: intent.availableHours }),
          ...(intent.preferredTimezone !== undefined && { preferredTimezone: intent.preferredTimezone }),
        },
        create: {
          userId: session.user.id,
          lookingFor: intent.lookingFor || ["collaborator"],
          projectInterests: intent.projectInterests || ["web"],
          availableHours: intent.availableHours || 10,
          preferredTimezone: intent.preferredTimezone,
        },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[API:Profile] PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
