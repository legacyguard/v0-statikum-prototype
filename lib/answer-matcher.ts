import type { PreparedAnswer, Document, Metric } from "@/types/domain"

export function findPreparedAnswer(question: string, answers: PreparedAnswer[]): PreparedAnswer | undefined {
  const lowercaseQuestion = question.toLowerCase()

  return answers.find((answer) => lowercaseQuestion.includes(answer.match.toLowerCase()))
}

export function getRelatedDocuments(documentIds: string[] | undefined, allDocuments: Document[]): Document[] {
  if (!documentIds) return []

  return documentIds
    .map((id) => allDocuments.find((doc) => doc.id === id))
    .filter((doc): doc is Document => doc !== undefined)
}

export function formatCurrency(value: number): string {
  const millions = value / 1000000
  return `${millions.toFixed(1)} mil. Kč`
}

export function getRelatedMetrics(metricIds: string[], allMetrics: Metric[]): Metric[] {
  if (!metricIds || metricIds.length === 0) return []

  return metricIds
    .map((id) => allMetrics.find((metric) => metric.id === id))
    .filter((metric): metric is Metric => metric !== undefined)
}

export interface MetricsByYear {
  year: number
  trzby?: number
  ebitda?: number
}

export function groupMetricsByYear(metrics: Metric[]): MetricsByYear[] {
  const yearMap = new Map<number, MetricsByYear>()

  metrics.forEach((metric) => {
    if (!yearMap.has(metric.year)) {
      yearMap.set(metric.year, { year: metric.year })
    }
    const yearData = yearMap.get(metric.year)!

    if (metric.metric_name === "trzby") {
      yearData.trzby = metric.metric_value
    } else if (metric.metric_name === "ebitda") {
      yearData.ebitda = metric.metric_value
    }
  })

  return Array.from(yearMap.values()).sort((a, b) => a.year - b.year)
}
