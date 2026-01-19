"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/nav"

type WeekSummary = {
  week_number: number
  progress: number
  total_tasks: number
  completed_tasks: number
}

export default function WeeksPage() {
  const params = useParams()
  const id = params?.id as string

  const [weeks, setWeeks] = useState<WeekSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const loadWeeks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${id}/weeks`
        )

        if (!res.ok) throw new Error("Failed to fetch weeks")

        const json = await res.json()
        setWeeks(Array.isArray(json) ? json : [])
      } catch (err) {
        console.error("Failed to load weeks", err)
        setWeeks([])
      } finally {
        setLoading(false)
      }
    }

    loadWeeks()
  }, [id])

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Roadmap Progress
        </h1>

        {loading ? (
          <p className="text-zinc-400">Loading weeks…</p>
        ) : weeks.length === 0 ? (
          <p className="text-zinc-400">No weeks found.</p>
        ) : (
          weeks.map((w) => (
            <Link
              key={w.week_number}
              href={`/roadmap/${id}/week/${w.week_number}`}
              className="block glass-card p-4 hover:bg-zinc-900/40 transition"
            >
              <div className="flex justify-between text-white mb-2">
                <span>Week {w.week_number}</span>
                <span>{w.progress}%</span>
              </div>

              <div className="h-2 bg-zinc-800 rounded">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${w.progress}%` }}
                />
              </div>

              <p className="text-xs text-zinc-500 mt-2">
                {w.completed_tasks} / {w.total_tasks} tasks completed
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
