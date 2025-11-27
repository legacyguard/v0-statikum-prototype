import { NextResponse } from "next/server"
import type { MockData } from "@/types/domain"
import documents from "@/data/documents.json"
import metrics from "@/data/metrics.json"
import answers from "@/data/answers.json"
import externalSources from "@/data/external-sources.json"

export async function GET() {
  const data: MockData = {
    documents,
    metrics,
    answers,
    externalSources,
  }

  return NextResponse.json(data)
}

