"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/nav"

type WeekSummary = {
  week_number: number
  weekly_goal: string
  total_tasks: number
  completed_tasks: number
  progress: number
}

export default function RoadmapWeeksPage() {
  const params = useParams()
  const roadmapId = params.id as string

  const [weeks, setWeeks] = useState<WeekSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWeeks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${roadmapId}/weeks`
        )

        if (!res.ok) {
          throw new Error("Failed to fetch weeks")
        }

        const data = await res.json()
        setWeeks(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load weeks", err)
      } finally {
        setLoading(false)
      }
    }

    loadWeeks()
  }, [roadmapId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-700">
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">
          Roadmap Progress
        </h1>
        <p className="text-zinc-400 mb-8">
          Track your weekly momentum and continue where you left off
        </p>

        {loading ? (
          <p className="text-zinc-400">Loading weeks…</p>
        ) : weeks.length === 0 ? (
          <p className="text-zinc-400">No weeks found.</p>
        ) : (
          <div className="space-y-4">
            {weeks.map((w) => (
              <div
                key={w.week_number}
                className="glass-card p-6 relative"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-50">
                      Week {w.week_number}
                      {w.progress === 100 && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-600/20 text-green-400">
                          Completed
                        </span>
                      )}
                    </h2>

                    <p className="text-sm text-zinc-400 mt-0.5">
                      🎯 {w.weekly_goal}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-zinc-300">
                    {w.progress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-800/50 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${w.progress}%` }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-zinc-500">
                    {w.completed_tasks} / {w.total_tasks} tasks completed
                  </p>

                  <Link
                    href={`/roadmap/${roadmapId}/week/${w.week_number}`}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Continue →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
