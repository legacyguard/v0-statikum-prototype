import { NextResponse } from "next/server"
import type { MockData } from "@/types/domain"
import documents from "@/data/documents.json"
import metrics from "@/data/metrics.json"
import answers from "@/data/answers.json"

export async function GET() {
  const data: MockData = {
    documents,
    metrics,
    answers,
  }

  return NextResponse.json(data)
}
