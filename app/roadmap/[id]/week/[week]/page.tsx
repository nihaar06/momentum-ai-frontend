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
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export default function WeekPage() {
  const { id, week } = useParams<{ id: string; week: string }>()

  const [data, setData] = useState<WeekData | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiDown, setApiDown] = useState(false)

  useEffect(() => {
    if (!id || !week) return

    const loadWeek = async () => {
      try {
        const res = await fetch(
          `${API}/roadmap/${id}/week/${week}`
        )

        if (!res.ok) {
          setApiDown(true)
          return
        }

        const json = await res.json()
        setData(json)
        setApiDown(false)
      } catch {
        setApiDown(true)
      } finally {
        setLoading(false)
      }
    }

    loadWeek()
  }, [id, week])

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!data || apiDown) return

    const prev = structuredClone(data)

    setData((curr) => {
      if (!curr) return curr

      const days = Object.fromEntries(
        Object.entries(curr.days).map(([d, tasks]) => [
          d,
          tasks.map((t) =>
            t.id === taskId ? { ...t, completed } : t
          ),
        ])
      )

      const all = Object.values(days).flat()
      const done = all.filter((t) => t.completed).length

      return {
        ...curr,
        days,
        progress: Math.round((done / all.length) * 100),
      }
    })

    try {
      const res = await fetch(`${API}/task/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, completed }),
      })

      if (!res.ok) setData(prev)
    } catch {
      setApiDown(true)
      setData(prev)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <p className="p-6 text-zinc-400">Loading week…</p>
      </div>
    )
  }

  if (apiDown || !data) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <p className="p-6 text-red-400">
          Backend unavailable. Please start the API.
        </p>
      </div>
    )
  }

  const totalTasks = Object.values(data.days).flat().length
  const completedTasks = Object.values(data.days)
    .flat()
    .filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl text-white">
            Week {data.week_number}
          </h1>
          <p className="text-zinc-400 mt-1">
            Stay consistent — small wins every day compound
          </p>
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-zinc-800 rounded">
            <div
              className="h-3 bg-blue-500 rounded transition-all"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            {completedTasks} / {totalTasks} tasks completed
          </p>
        </div>

        {Object.entries(data.days).map(([day, tasks]) => (
          <div key={day} className="glass-card p-5">
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
