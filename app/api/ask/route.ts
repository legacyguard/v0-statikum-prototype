import { NextResponse } from "next/server"

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set")
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 })
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // You can change model to the exact one you want to use, e.g. "gpt-4.1-mini" / "gpt-4.1-nano"
        model: "gpt-4.1-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are Statikum AI Assistant. Answer clearly and concisely in Czech or Slovak, based on the user's question about financial and legal documents.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", errorText)
      return NextResponse.json({ error: "Failed to get response from OpenAI" }, { status: 502 })
    }

    const data = await response.json()
    const answer =
      data?.choices?.[0]?.message?.content ??
      "Model nevrátil žádnou odpověď. Zkuste prosím dotaz formulovat trochu jinak."

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Error in /api/ask:", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}


