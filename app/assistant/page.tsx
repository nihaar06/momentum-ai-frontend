"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/nav"

type Roadmap = {
  roadmap_id: number
  description: string
}

export default function AssistantPage() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [selectedRoadmap, setSelectedRoadmap] = useState<number | null>(null)

  // 1️⃣ Get logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUserId(data.user.id)
    }
    loadUser()
  }, [])

  // 2️⃣ Load user roadmaps
  useEffect(() => {
    if (!userId) return

    const loadRoadmaps = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roadmaps?user_id=${userId}`
      )
      const json = await res.json()
      setRoadmaps(json)
      if (json.length > 0) {
        setSelectedRoadmap(json[0].roadmap_id)
      }
    }

    loadRoadmaps()
  }, [userId])

  // 3️⃣ Ask AI
  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !userId || !selectedRoadmap) return

    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ask-assistant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            roadmap_id: selectedRoadmap,
            input_data: question,
          }),
        }
      )

      const json = await res.json()
      setResponse(json.response || "No response from assistant.")
    } catch (err) {
      console.error("AI assistant error:", err)
      setResponse("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black pb-12">
      <Navigation />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-zinc-50 mb-6 text-center">
          AI Learning Assistant
        </h1>

        {/* Roadmap Selector */}
        <div className="glass-card p-4 mb-6">
          <label className="block text-sm text-zinc-400 mb-2">
            Select roadmap
          </label>
          <select
            value={selectedRoadmap ?? ""}
            onChange={(e) => setSelectedRoadmap(Number(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100"
          >
            {roadmaps.map((r) => (
              <option key={r.roadmap_id} value={r.roadmap_id}>
                {r.description}
              </option>
            ))}
          </select>
        </div>

        {/* Question */}
        <form onSubmit={handleAsk} className="glass-card p-6 space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something about this roadmap..."
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold"
          >
            {isLoading ? "Thinking…" : "Ask AI"}
          </button>
        </form>

        {response && (
          <div className="glass-card p-6 mt-6">
            <h3 className="font-semibold text-zinc-50 mb-2">Response</h3>
            <p className="text-zinc-300 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  )
}
