export interface Document {
  id: string
  name: string
  doc_type: string
  client: string
  year: number
  short_description: string
  link: string
  text_excerpt?: string
}

export interface Metric {
  id: string
  client: string
  year: number
  metric_name: string
  metric_value: number
  currency: string
}

export interface PreparedAnswer {
  id: string
  match: string // keyword to match against user question (lowercase)
  title: string
  answer_text: string
  related_client: string
  related_docs: string[] // array of document IDs
  related_metrics: string[] // array of metric IDs
}

export interface MockData {
  documents: Document[]
  metrics: Metric[]
  answers: PreparedAnswer[]
}
