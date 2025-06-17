import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

// Global singleton instance
let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  // Server-side: always create a new client
  if (typeof window === "undefined") {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  // Browser-side: create singleton instance
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return client
}

// Export the singleton instance for direct use
export const supabase = createClient()
