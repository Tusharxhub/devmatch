"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase()

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
}

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error("useSupabaseContext must be used within a SupabaseProvider")
  }
  return context
}
