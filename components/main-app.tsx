"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnswerDisplay } from "@/components/answer-display"
import type { MockData, PreparedAnswer } from "@/types/domain"
import { Sparkles, Search } from "lucide-react"

interface MainAppProps {
  mockData: MockData
}

export function MainApp({ mockData }: MainAppProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<PreparedAnswer | null | undefined>(undefined)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendedExternalSourceIds, setRecommendedExternalSourceIds] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) return

    setIsSearching(true)
    setError(null)
    setAnswer(undefined)
    setRecommendedExternalSourceIds([])

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const message = data?.error || "Nepodarilo sa získať odpoveď od AI."
        setError(message)
        setAnswer(null)
        return
      }

      const data: { answer?: string; recommendedSourceIds?: string[] } = await response.json()

      const answerText =
        data.answer ||
        "Model nevrátil žiadnu odpoveď. Skúste prosím otázku preformulovať alebo ju spresniť."

      const aiAnswer: PreparedAnswer = {
        id: "ai-generated",
        match: question.toLowerCase(),
        title: "AI odpoveď",
        answer_text: answerText,
        related_client: "",
        related_docs: [],
        related_metrics: [],
      }

      if (Array.isArray(data.recommendedSourceIds)) {
        setRecommendedExternalSourceIds(data.recommendedSourceIds)
      }

      setAnswer(aiAnswer)
    } catch (err) {
      console.error("Error while asking AI:", err)
      setError("Pri komunikácii s AI došlo k chybe. Skúste to znova.")
      setAnswer(null)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Sparkles className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight text-balance bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              Statikum AI Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              Inteligentní vyhledávání a analýza dokumentů – účetní závěrky, smlouvy, listy vlastnictví a další
              klientská data
            </p>
          </div>
        </div>

        <Card className="p-8 shadow-xl border-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="question" className="block text-base font-bold text-foreground flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Položte otázku
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Např.: Jaké byly finanční výsledky Klienta X v posledních třech letech?"
                className="w-full min-h-36 px-5 py-4 border-2 border-input rounded-xl bg-background text-foreground text-base resize-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/60"
                disabled={isSearching}
              />
              <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Příklady otázek:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>"Jaké byly finanční výsledky Klienta X?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>"Jaká jsou rizika nájemních smluv Klienta Y?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>"Jsou nemovitosti Klienta Y zatížené?"</span>
                  </li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              disabled={isSearching || !question.trim()}
            >
              {isSearching ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Analyzuji data...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Zeptat se AI
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Answer Display */}
        {answer !== undefined && (
          <AnswerDisplay
            answer={answer}
            documents={mockData.documents}
            metrics={mockData.metrics}
            externalSources={mockData.externalSources}
            recommendedExternalSourceIds={recommendedExternalSourceIds}
          />
        )}
      </div>
    </div>
  )
}
