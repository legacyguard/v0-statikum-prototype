"use client"

import { useState, useEffect } from "react"
import { PasswordGate } from "@/components/password-gate"
import { MainApp } from "@/components/main-app"
import type { MockData } from "@/types/domain"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mockData, setMockData] = useState<MockData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMockData() {
      try {
        const response = await fetch("/api/mock-data")
        const data = await response.json()
        setMockData(data)
      } catch (error) {
        console.error("Error fetching mock data:", error)
        setMockData({ documents: [], metrics: [], answers: [] })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMockData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Načítání...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />
  }

  if (!mockData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Chyba při načítání dat.</p>
      </div>
    )
  }

  return <MainApp mockData={mockData} />
}
