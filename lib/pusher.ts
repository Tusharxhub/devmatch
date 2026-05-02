// lib/pusher.ts
// Pusher server + client configuration for real-time features
import Pusher from "pusher";
import PusherClient from "pusher-js";

// ─── Server-side Pusher ───────────────────────────────────────────────────────

let pusherServer: Pusher | null = null;

export function getPusherServer(): Pusher {
  if (!pusherServer) {
    pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return pusherServer;
}

// ─── Client-side Pusher ───────────────────────────────────────────────────────

let pusherClient: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient must be called on the client side");
  }

  if (!pusherClient) {
    pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
        authTransport: "ajax",
      }
    );
  }
  return pusherClient;
}

// ─── Channel Names ────────────────────────────────────────────────────────────

export const CHANNELS = {
  chat: (userId1: string, userId2: string) => {
    const sorted = [userId1, userId2].sort();
    return `private-chat-${sorted[0]}-${sorted[1]}`;
  },
  user: (userId: string) => `private-user-${userId}`,
  presence: "presence-online",
} as const;

// ─── Event Names ──────────────────────────────────────────────────────────────

export const EVENTS = {
  NEW_MESSAGE: "new-message",
  MESSAGE_READ: "message-read",
  USER_TYPING: "user-typing",
  USER_ONLINE: "user-online",
  USER_OFFLINE: "user-offline",
  MATCH_FOUND: "match-found",
} as const;
