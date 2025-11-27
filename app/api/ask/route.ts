import { NextResponse } from "next/server"
import type { ExternalSource } from "@/types/domain"
import externalSources from "@/data/external-sources.json"

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

interface AiToolCall {
  type: "recommend_sources"
  recommended_source_ids: string[]
}

interface AiApiResponse {
  answer: string
  recommendedSourceIds: string[]
}

function buildExternalSourcesContext(sources: ExternalSource[]): string {
  const lines = sources.map((source) => {
    const tags = source.tags.join(", ")
    return `- ID: ${source.id}\n  Typ: ${source.source_type}\n  Název: ${source.name}\n  URL: ${
      source.url || "N/A"
    }\n  Popis: ${source.description}\n  Tagy: ${tags}`
  })

  return lines.join("\n\n")
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Chybí dotaz." }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set")
      return NextResponse.json({ error: "Chybná konfigurace serveru." }, { status: 500 })
    }

    const sourcesContext = buildExternalSourcesContext(externalSources as ExternalSource[])

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "statikum_ai_answer",
            schema: {
              type: "object",
              properties: {
                answer: {
                  type: "string",
                  description:
                    "Verbální odpověď v češtině, srozumitelná pro uživatele Statikum. Oslovení neutrální (např. 'Můžete', nikoli 'Mohl byste').",
                },
                recommendedSourceIds: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "ID zdroje z poskytnutého seznamu externích zdrojů.",
                  },
                  description:
                    "Seznam ID externích zdrojů, které jsou nejvíce relevantní pro daný dotaz. Použij jen ID, která existují v seznamu.",
                },
              },
              required: ["answer"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
        messages: [
          {
            role: "system",
            content:
              "Jste Statikum AI Assistant. Odpovídáte stručně a srozumitelně v češtině. Pracujete s finančními výkazy, výročními zprávami, statistikami ČSU, katastrem a klientskými podklady. Udržujte neutrální oslovení (např. 'Můžete prosím upřesnit...', nikoliv 'Mohl byste...').",
          },
          {
            role: "system",
            content:
              "Máte k dispozici následující externí zdroje. V odpovědi uveďte slovní shrnutí a do seznamu recommendedSourceIds přidejte ID zdrojů, které by uživateli nejvíce pomohly. Pokud žádný zdroj není relevantní, použij prázdné pole.\n\n" +
              sourcesContext,
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
      return NextResponse.json(
        { error: "Nepodařilo se získat odpověď od AI. Zkuste to prosím znovu." },
        { status: 502 },
      )
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content

    let parsed: AiApiResponse | null = null
    if (typeof content === "string") {
      try {
        parsed = JSON.parse(content) as AiApiResponse
      } catch (err) {
        console.error("Failed to parse AI JSON response:", err, "content:", content)
      }
    }

    const answer =
      parsed?.answer ||
      "Model nevrátil žádnou použitelnou odpověď. Můžete prosím dotaz formulovat trochu jinak nebo jej upřesnit?"

    const recommendedSourceIds = Array.isArray(parsed?.recommendedSourceIds)
      ? parsed!.recommendedSourceIds.filter((id) =>
          (externalSources as ExternalSource[]).some((s) => s.id === id),
        )
      : []

    return NextResponse.json({ answer, recommendedSourceIds })
  } catch (error) {
    console.error("Error in /api/ask:", error)
    return NextResponse.json(
      { error: "Došlo k neočekávané chybě při zpracování dotazu. Zkuste to prosím znovu." },
      { status: 500 },
    )
  }
}



