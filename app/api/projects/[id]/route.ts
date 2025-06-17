import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      users!projects_owner_id_fkey(name, avatar_url, github_username),
      project_skills(skills(name)),
      project_collaborators(users(name, avatar_url))
    `)
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("owner_id", user.id) // Ensure user owns the project
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase.from("projects").delete().eq("id", params.id).eq("owner_id", user.id) // Ensure user owns the project

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
