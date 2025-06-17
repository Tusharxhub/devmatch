import { type NextRequest, NextResponse } from "next/server"
import { generateProjectSuggestions } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { skills, preferences } = await request.json()

    const suggestions = await generateProjectSuggestions(skills, preferences)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error generating AI suggestions:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
