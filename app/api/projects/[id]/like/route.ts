import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("project_likes")
    .select("id")
    .eq("project_id", params.id)
    .eq("user_id", user.id)
    .single()

  if (existingLike) {
    // Unlike
    await supabase.from("project_likes").delete().eq("project_id", params.id).eq("user_id", user.id)

    // Decrement likes count
    const { data: project } = await supabase.from("projects").select("likes_count").eq("id", params.id).single()

    if (project) {
      await supabase
        .from("projects")
        .update({ likes_count: Math.max(0, project.likes_count - 1) })
        .eq("id", params.id)
    }

    return NextResponse.json({ liked: false })
  } else {
    // Like
    await supabase.from("project_likes").insert({
      project_id: params.id,
      user_id: user.id,
    })

    // Increment likes count
    const { data: project } = await supabase.from("projects").select("likes_count").eq("id", params.id).single()

    if (project) {
      await supabase
        .from("projects")
        .update({ likes_count: project.likes_count + 1 })
        .eq("id", params.id)
    }

    return NextResponse.json({ liked: true })
  }
}
