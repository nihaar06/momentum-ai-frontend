"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/nav"

type Task = {
  id: string
  task_text: string
  completed: boolean
}

type WeekData = {
  week_number: number
  progress: number
  days: Record<string, Task[]>
}

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000" // fallback (must be running)

export default function WeekPage() {
  const { id, week } = useParams<{
    id: string
    week: string
  }>()

  const [data, setData] = useState<WeekData | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiDown, setApiDown] = useState(false)

  // ----------------------------
  // Load week data
  // ----------------------------
  useEffect(() => {
    if (!id || !week || week === "null") return

    const loadWeek = async () => {
      try {
        const res = await fetch(
          `${API}/roadmap/${id}/week/${week}`
        )

        if (!res.ok) {
          console.error("Week fetch failed:", res.status)
          setApiDown(true)
          return
        }

        const json = await res.json()
        if (!json?.days) {
          setData(null)
          return
        }

        setApiDown(false)
        setData(json)
      } catch (err) {
        console.error("Backend unreachable:", err)
        setApiDown(true)
      } finally {
        setLoading(false)
      }
    }

    loadWeek()
  }, [id, week])

  // ----------------------------
  // Toggle task completion
  // ----------------------------
  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!data || apiDown) return

    const previous = structuredClone(data)

    // Optimistic UI update
    setData((prev) => {
      if (!prev) return prev

      const days: WeekData["days"] = {}
      for (const [d, tasks] of Object.entries(prev.days)) {
        days[d] = tasks.map((t) =>
          t.id === taskId ? { ...t, completed } : t
        )
      }

      const all = Object.values(days).flat()
      const done = all.filter((t) => t.completed).length

      return {
        ...prev,
        days,
        progress: all.length
          ? Math.round((done / all.length) * 100)
          : 0,
      }
    })

    try {
      const res = await fetch(`${API}/task/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, completed }),
      })

      if (!res.ok) {
        console.error("Update rejected:", res.status)
        setData(previous)
      }
    } catch (err) {
      console.error("Backend unreachable:", err)
      setApiDown(true)
      setData(previous)
    }
  }

  // ----------------------------
  // UI states
  // ----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <p className="p-6 text-zinc-400">Loading week…</p>
      </div>
    )
  }

  if (apiDown) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="p-6 text-red-400">
          Backend unreachable. Start the API server.
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <p className="p-6 text-zinc-400">
          No data found for this week.
        </p>
      </div>
    )
  }

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl text-white">
          Week {data.week_number}
        </h1>

        <div className="h-3 bg-zinc-800 rounded">
          <div
            className="h-3 bg-blue-500 rounded transition-all duration-500"
            style={{ width: `${data.progress}%` }}
          />
        </div>

        {Object.entries(data.days).map(([day, tasks]) => (
          <div key={day} className="glass-card p-4">
            <h2 className="text-white font-semibold mb-3">
              Day {day}
            </h2>

            <div className="space-y-2">
              {tasks.map((t) => (
                <label
                  key={t.id}
                  className="flex gap-3 text-zinc-300"
                >
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={(e) =>
                      toggleTask(t.id, e.target.checked)
                    }
                    className="accent-blue-500"
                  />
                  <span
                    className={
                      t.completed
                        ? "line-through text-zinc-500"
                        : ""
                    }
                  >
                    {t.task_text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
