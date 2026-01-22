"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/nav"

type Roadmap = {
  roadmap_id: number
  description: string
  duration_weeks: number
}

export default function AssistantPage() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)

  const [week, setWeek] = useState<number | "">("")
  const [day, setDay] = useState<number | "">("")

  // Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  // Load roadmaps
  useEffect(() => {
    if (!userId) return

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmaps?user_id=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setRoadmaps(data)
        if (data.length) setSelectedRoadmap(data[0])
      })
  }, [userId])

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !userId || !selectedRoadmap) return

    setIsLoading(true)
    setResponse("")

    const payload: any = {
      user_id: userId,
      roadmap_id: selectedRoadmap.roadmap_id,
      input_data: question,
    }

    if (week) payload.week_number = week
    if (day) payload.day_number = day

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ask-assistant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      const json = await res.json()
      setResponse(json.response)
    } catch {
      setResponse("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black pb-12">
      <Navigation />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        {/* 🤖 Header */}
        <div className="glass-card p-6 text-center">
          <div className="text-5xl mb-2">🤖</div>
          <h1 className="text-3xl font-bold text-zinc-50">
            AI Learning Assistant
          </h1>
          <p className="text-zinc-400 mt-2">
            Ask questions in the context of your roadmap
          </p>
        </div>

        {/* Context Selectors */}
        <div className="glass-card p-4 space-y-4">
          <select
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100"
            value={selectedRoadmap?.roadmap_id ?? ""}
            onChange={(e) =>
              setSelectedRoadmap(
                roadmaps.find(
                  (r) => r.roadmap_id === Number(e.target.value)
                ) || null
              )
            }
          >
            {roadmaps.map((r) => (
              <option key={r.roadmap_id} value={r.roadmap_id}>
                {r.description}
              </option>
            ))}
          </select>

          {/* Week + Day (optional) */}
          <div className="flex gap-4">
            <select
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100"
              value={week}
              onChange={(e) =>
                setWeek(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">All weeks</option>
              {selectedRoadmap &&
                Array.from(
                  { length: selectedRoadmap.duration_weeks },
                  (_, i) => i + 1
                ).map((w) => (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                ))}
            </select>

            <select
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100"
              value={day}
              onChange={(e) =>
                setDay(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">All days</option>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question */}
        <form onSubmit={handleAsk} className="glass-card p-6 space-y-4">
          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something about your roadmap..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold"
          >
            {isLoading ? "Thinking…" : "Ask AI"}
          </button>
        </form>

        {response && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-zinc-50 mb-2">Response</h3>
            <p className="text-zinc-300 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  )
}
