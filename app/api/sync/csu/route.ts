import { NextResponse } from "next/server"

export async function POST() {
  // Placeholder sync endpoint for ČSU time series data.
  // A full implementation would download XLS/XLSX files and parse them
  // into structured metrics or reference tables.

  return NextResponse.json({
    status: "ok",
    message:
      "Synchronizace dat z ČSU je v tomto prototypu pouze simulovaná. Reálné stahování a zpracování časových řad bude součástí plné verze.",
  })
}


