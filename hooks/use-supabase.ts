"use client"

import { createClient } from "@/lib/supabase-browser"
import { useMemo } from "react"

// Custom hook that ensures we always use the singleton instance
export function useSupabase() {
  // Use useMemo to ensure we don't recreate the client on every render
  const supabase = useMemo(() => createClient(), [])

  return supabase
}
