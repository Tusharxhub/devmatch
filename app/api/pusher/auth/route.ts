// app/api/pusher/auth/route.ts
// Pusher channel authentication endpoint
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const socketId = params.get("socket_id");
    const channel = params.get("channel_name");

    if (!socketId || !channel) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const pusher = getPusherServer();

    // Presence channel auth
    if (channel.startsWith("presence-")) {
      const presenceData = {
        user_id: session.user.id,
        user_info: {
          name: session.user.name,
          image: session.user.image,
        },
      };
      const auth = pusher.authorizeChannel(socketId, channel, presenceData);
      return NextResponse.json(auth);
    }

    // Private channel auth - verify user has access
    if (channel.startsWith("private-")) {
      if (channel.includes(session.user.id) || channel === `private-user-${session.user.id}`) {
        const auth = pusher.authorizeChannel(socketId, channel);
        return NextResponse.json(auth);
      }
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  } catch (error) {
    console.error("[API:PusherAuth] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
