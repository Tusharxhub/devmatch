import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        *,
        users (
          name,
          avatar_url,
          github_username
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        ...body,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
