import { createClient } from "./supabase-browser"
import type { User } from "@supabase/supabase-js"

// Get the singleton client instance
const getSupabaseClient = () => createClient()

export const signInWithGitHub = async () => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: "read:user user:email",
    },
  })

  if (error) throw error
  return data
}

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = getSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const updateUserProfile = async (updates: {
  name?: string
  bio?: string
  location?: string
  github_username?: string
  stackoverflow_username?: string
  availability?: boolean
}) => {
  const supabase = getSupabaseClient()
  const user = await getCurrentUser()
  if (!user) throw new Error("No authenticated user")

  const { data, error } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      email: user.email!,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}
