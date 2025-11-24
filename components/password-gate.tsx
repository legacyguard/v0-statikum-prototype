"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, ShieldCheck } from "lucide-react"

interface PasswordGateProps {
  onAuthenticated: () => void
}

const DEMO_PASSWORD = "statikum2025"

export function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === DEMO_PASSWORD) {
      setError("")
      onAuthenticated()
    } else {
      setError("Nesprávné heslo. Zkuste to prosím znovu.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-lg p-10 shadow-xl border-2">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
              <ShieldCheck className="w-9 h-9" strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-balance">Statikum AI Prototype</h1>
              <p className="text-sm font-medium text-primary">Interní náhled s mock daty</p>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Toto je <strong className="text-foreground">výhradně interní prototyp</strong> pro účely demonstrace.
                  Všechna data jsou umělá – nejsou zde použita žádná reálná klientská data.
                </p>
                <p className="text-xs">
                  <strong className="text-foreground">Účel:</strong> Ukázat, jak by mohlo vypadat inteligentní
                  vyhledávání a analýza dokumentů nad daty Statikum.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Zadejte přístupové heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 text-base border-2 focus:border-primary"
              />
              {error && (
                <p className="text-destructive text-sm font-medium flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20">
              Vstoupit do prototypu
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
