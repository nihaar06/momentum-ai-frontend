"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/nav"

type Roadmap = {
  roadmap_id: number
  description: string
  duration_weeks: number
  level: string
}

type Task = {
  id: string
  roadmap_id: number
  task_text: string
  completed: boolean
  completed_at?: string
  week_number: number
  day_number: number
}

export default function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const API = process.env.NEXT_PUBLIC_API_URL!

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      setUserId(data.user.id)

      const r = await fetch(`${API}/roadmaps?user_id=${data.user.id}`)
      const roadmapData = await r.json()
      setRoadmaps(roadmapData || [])

      const allTasks: Task[] = []

      for (const rm of roadmapData) {
        const res = await fetch(`${API}/roadmap/${rm.roadmap_id}`)
        const json = await res.json()
        if (Array.isArray(json.tasks)) {
          allTasks.push(...json.tasks)
        }
      }

      setTasks(allTasks)
      setLoading(false)
    }

    load()
  }, [])

  const completedTasks = tasks.filter((t) => t.completed).length

  // ✅ CORRECT, SINGLE STREAK LOGIC
  const streak = (() => {
    const days = new Set<string>()

    tasks.forEach((t) => {
      if (t.completed && t.completed_at) {
        days.add(t.completed_at.slice(0, 10))
      }
    })

    let count = 0
    let cursor = new Date()

    while (true) {
      const key = cursor.toISOString().slice(0, 10)
      if (days.has(key)) {
        count++
        cursor.setDate(cursor.getDate() - 1)
      } else break
    }

    return count
  })()

  const todaysTasks = tasks
    .filter((t) => !t.completed)
    .sort(
      (a, b) =>
        a.week_number - b.week_number ||
        a.day_number - b.day_number
    )
    .slice(0, 5)

  const roadmapProgress = (roadmapId: number) => {
    const rTasks = tasks.filter(
      (t) => t.roadmap_id === roadmapId
    )

    if (!rTasks.length) return 0

    const done = rTasks.filter((t) => t.completed).length
    return Math.round((done / rTasks.length) * 100)
  }

  const deleteRoadmap = async (roadmapId: number) => {
    if (!userId) return
    const ok = confirm("Delete this roadmap permanently?")
    if (!ok) return

    await fetch(`${API}/roadmap/${roadmapId}?user_id=${userId}`, {
      method: "DELETE",
    })

    setRoadmaps((prev) =>
      prev.filter((r) => r.roadmap_id !== roadmapId)
    )
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-400">
              Track your momentum and stay consistent
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-zinc-400 hover:text-red-400"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6">
            <p className="text-sm text-zinc-400">Active Roadmaps</p>
            <p className="text-3xl font-bold text-white">
              {roadmaps.length}
            </p>
          </div>

          <div className="glass-card p-6">
            <p className="text-sm text-zinc-400">Tasks Completed</p>
            <p className="text-3xl font-bold text-white">
              {completedTasks}
            </p>
          </div>

          <div className="glass-card p-6">
            <p className="text-sm text-zinc-400">Learning Streak</p>
            <p className="text-3xl font-bold text-white">
              🔥 {streak} days
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Your Roadmaps
              </h2>
              <Link
                href="/generate"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                New Roadmap
              </Link>
            </div>

            {loading ? (
              <p className="text-zinc-400">Loading…</p>
            ) : (
              <div className="space-y-4">
                {roadmaps.map((r) => {
                  const progress = roadmapProgress(r.roadmap_id)

                  return (
                    <div
                      key={r.roadmap_id}
                      className="glass-card p-6 relative group"
                    >
                      <Link href={`/roadmap/${r.roadmap_id}/weeks`}>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                          {r.description}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {r.duration_weeks} weeks · {r.level}
                        </p>

                        <div className="mt-4 w-full bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                          {progress}% completed
                        </p>
                      </Link>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteRoadmap(r.roadmap_id)
                        }}
                        className="absolute top-4 right-4 text-xs text-red-400 opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Today’s Tasks
            </h3>
            <div className="glass-card p-6 space-y-3">
              {todaysTasks.length === 0 ? (
                <p className="text-sm text-zinc-400">
                  All caught up 🎉
                </p>
              ) : (
                todaysTasks.map((t) => (
                  <p key={t.id} className="text-sm text-zinc-300">
                    • {t.task_text}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
