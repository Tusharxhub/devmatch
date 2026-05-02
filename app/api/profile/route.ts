// app/api/profile/route.ts
// GET: Fetch user profile, PATCH: Update profile
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ user });
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
    const body = await req.json();
    const { bio, location, website, intent } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
      },
    });

    // Update intent if provided
    if (intent) {
      await prisma.userIntent.upsert({
        where: { userId: session.user.id },
        update: {
          ...(intent.lookingFor && { lookingFor: intent.lookingFor }),
          ...(intent.projectInterests && { projectInterests: intent.projectInterests }),
          ...(intent.availableHours !== undefined && { availableHours: intent.availableHours }),
          ...(intent.preferredTimezone && { preferredTimezone: intent.preferredTimezone }),
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
    console.error("[API:Profile] PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
