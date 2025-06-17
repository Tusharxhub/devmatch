import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
})

export const generateProjectSuggestions = async (userSkills: string[], preferences: string[]) => {
  try {
    const prompt = `Based on these skills: ${userSkills.join(", ")} and preferences: ${preferences.join(", ")}, suggest 3 innovative project ideas for collaboration. Format as JSON array with title, description, difficulty, and required_skills fields.`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that suggests programming project ideas for collaboration.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error("No response from OpenAI")

    return JSON.parse(content)
  } catch (error) {
    console.error("Error generating project suggestions:", error)
    // Fallback suggestions
    return [
      {
        title: "AI-Powered Task Manager",
        description: "Build a smart task management app with AI-driven prioritization and scheduling.",
        difficulty: "intermediate",
        required_skills: ["React", "Node.js", "OpenAI API"],
      },
      {
        title: "Real-time Code Collaboration Platform",
        description: "Create a platform for developers to collaborate on code in real-time with video chat.",
        difficulty: "advanced",
        required_skills: ["WebRTC", "Socket.io", "React", "Express"],
      },
      {
        title: "Developer Portfolio Generator",
        description: "Build a tool that automatically generates beautiful portfolios from GitHub data.",
        difficulty: "beginner",
        required_skills: ["React", "GitHub API", "CSS"],
      },
    ]
  }
}

export const generateChatSuggestions = async (context: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that suggests professional responses for developer collaboration chats. Keep responses concise and professional.",
        },
        {
          role: "user",
          content: `Suggest 3 appropriate responses to this message: "${context}"`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error("No response from OpenAI")

    return content
      .split("\n")
      .filter((line) => line.trim())
      .slice(0, 3)
  } catch (error) {
    console.error("Error generating chat suggestions:", error)
    return [
      "That sounds great! I'd love to collaborate.",
      "Could you tell me more about the technical requirements?",
      "I'm interested. When would be a good time to discuss this further?",
    ]
  }
}
