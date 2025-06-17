import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/supabase-js"

// Global singleton instance
let supabaseClientInstance: SupabaseClient | null = null

// Singleton factory for client-side Supabase client
export const getSupabaseClient = (): SupabaseClient => {
  // Only create instance on client-side
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient should only be called on the client-side")
  }

  // Return existing instance if available
  if (supabaseClientInstance) {
    return supabaseClientInstance
  }

  // Create new instance only if none exists
  supabaseClientInstance = createClientComponentClient()

  return supabaseClientInstance
}

// Reset function for testing or cleanup (optional)
export const resetSupabaseClient = () => {
  supabaseClientInstance = null
}

// Export the singleton instance
export const supabase = typeof window !== "undefined" ? getSupabaseClient() : null
