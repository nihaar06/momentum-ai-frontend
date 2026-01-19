"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/nav"

type Task = {
  id: string
  task_text: string
  completed: boolean
}

export default function WeekPage() {
  const params = useParams()
  const id = params?.id as string
  const week = params?.week as string

  const [data, setData] = useState<{
    week_number: number
    progress: number
    days: Record<string, Task[]>
  } | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !week || week === "null") return

    const loadWeek = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${id}/week/${week}`
        )

        if (!res.ok) throw new Error("Failed to fetch week")

        const json = await res.json()

        if (!json || !json.days) {
          setData(null)
          return
        }

        setData(json)
      } catch (err) {
        console.error("Failed to load week", err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    loadWeek()
  }, [id, week])

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6 text-zinc-400">
          Loading week…
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6 text-zinc-400">
          No data found for this week.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl text-white">
          Week {data.week_number}
        </h1>

        <div className="h-3 bg-zinc-800 rounded">
          <div
            className="h-3 bg-blue-500 rounded"
            style={{ width: `${data.progress}%` }}
          />
        </div>

        {Object.entries(data.days).map(([day, tasks]) => (
          <div key={day} className="glass-card p-4">
            <h2 className="font-semibold text-white mb-3">
              Day {day}
            </h2>

            <div className="space-y-2">
              {tasks.map((t) => (
                <label
                  key={t.id}
                  className="flex items-start gap-3 text-zinc-300"
                >
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() =>
                      fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/task/update`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            task_id: t.id,
                            completed: !t.completed,
                          }),
                        }
                      )
                    }
                    className="mt-1 accent-blue-500"
                  />
                  <span
                    className={
                      t.completed ? "line-through text-zinc-500" : ""
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
