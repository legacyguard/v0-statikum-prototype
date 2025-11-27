import { Card } from "@/components/ui/card"
import type { PreparedAnswer, Document, Metric, ExternalSource } from "@/types/domain"
import { getRelatedDocuments, getRelatedMetrics, groupMetricsByYear, formatCurrency } from "@/lib/answer-matcher"
import { FileText, TrendingUp, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react"

interface AnswerDisplayProps {
  answer: PreparedAnswer | null
  documents: Document[]
  metrics: Metric[]
  externalSources: ExternalSource[]
  recommendedExternalSourceIds?: string[]
}

export function AnswerDisplay({
  answer,
  documents,
  metrics,
  externalSources,
  recommendedExternalSourceIds = [],
}: AnswerDisplayProps) {
  if (answer === null) {
    return (
      <Card className="p-10 shadow-xl border-2 border-dashed">
        <div className="space-y-5 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted">
            <AlertCircle className="w-8 h-8 text-muted-foreground" strokeWidth={2} />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">Scénář není v prototypu</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pro tento dotaz zatím nemáme připravený scénář v prototypu.
            </p>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              V ostré verzi by AI model odpovídal na základě všech dokumentů Statikum a poskytoval relevantní informace
              i pro dotazy mimo připravené scénáře.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const relatedDocs = getRelatedDocuments(answer.related_docs, documents)
  const relatedMetrics = getRelatedMetrics(answer.related_metrics, metrics)
  const metricsByYear = groupMetricsByYear(relatedMetrics)

  const recommendedSources: ExternalSource[] =
    answer.id === "ai-generated"
      ? externalSources.filter((source) => recommendedExternalSourceIds.includes(source.id))
      : []

  return (
    <Card className="p-10 shadow-xl border-2 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
          <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="space-y-3 flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-balance">{answer.title}</h2>
          {answer.id === "ai-generated" ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Odpověď AI modelu
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Ukázkový výstup z prototypu
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-foreground leading-relaxed text-pretty text-lg">{answer.answer_text}</p>
      </div>

      {recommendedSources.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <ExternalLink className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold">Doporučené zdroje</h3>
          </div>
          <div className="grid gap-4">
            {recommendedSources.map((source) => (
              <a
                key={source.id}
                href={source.url || "#"}
                target={source.url ? "_blank" : undefined}
                rel={source.url ? "noreferrer" : undefined}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border-2 border-border hover:border-primary/60 hover:shadow-lg transition-all group"
              >
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shrink-0 uppercase tracking-wide shadow-sm">
                  {source.source_type === "justice" && "Justice"}
                  {source.source_type === "csu" && "ČSU"}
                  {source.source_type === "cadastral" && "Katastr"}
                  {source.source_type === "client_document" && "Klient"}
                </span>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {source.name}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{source.description}</p>
                  {source.url && (
                    <p className="text-xs text-muted-foreground/80 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>Otevřít externí odkaz</span>
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {metricsByYear.length > 0 && answer.id !== "ai-generated" && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold">Klíčové metriky</h3>
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-border shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-left py-4 px-6 text-sm font-bold uppercase tracking-wide">Rok</th>
                  {metricsByYear.some((m) => m.trzby !== undefined) && (
                    <th className="text-right py-4 px-6 text-sm font-bold uppercase tracking-wide">Tržby</th>
                  )}
                  {metricsByYear.some((m) => m.ebitda !== undefined) && (
                    <th className="text-right py-4 px-6 text-sm font-bold uppercase tracking-wide">EBITDA</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-card">
                {metricsByYear.map((yearData, idx) => (
                  <tr
                    key={yearData.year}
                    className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                      idx % 2 === 0 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="py-4 px-6 text-base font-bold text-primary">{yearData.year}</td>
                    {metricsByYear.some((m) => m.trzby !== undefined) && (
                      <td className="text-right py-4 px-6 text-base font-semibold tabular-nums">
                        {yearData.trzby !== undefined ? formatCurrency(yearData.trzby) : "—"}
                      </td>
                    )}
                    {metricsByYear.some((m) => m.ebitda !== undefined) && (
                      <td className="text-right py-4 px-6 text-base font-semibold tabular-nums">
                        {yearData.ebitda !== undefined ? formatCurrency(yearData.ebitda) : "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {relatedDocs.length > 0 && answer.id !== "ai-generated" && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent">
              <FileText className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold">Související dokumenty</h3>
          </div>
          <div className="grid gap-4">
            {relatedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start gap-5 p-5 rounded-xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <span className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground shrink-0 uppercase tracking-wide shadow-sm">
                  {doc.doc_type}
                </span>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {doc.name}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doc.short_description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
