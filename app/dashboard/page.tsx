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
  created_at: string
}

type RoadmapWithProgress = Roadmap & {
  totalTasks: number
  completedTasks: number
  progress: number
}

export default function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState<RoadmapWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // 🔹 Load roadmaps WITH progress (defensive)
  const loadRoadmaps = async () => {
    try {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        setRoadmaps([])
        return
      }

      const uid = data.user.id
      setUserId(uid)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roadmaps?user_id=${uid}`
      )

      if (!res.ok) {
        setRoadmaps([])
        return
      }

      const baseRoadmapsRaw = await res.json()

      // ✅ GUARANTEE ARRAY
      const baseRoadmaps: Roadmap[] = Array.isArray(baseRoadmapsRaw)
        ? baseRoadmapsRaw
        : []

      const enriched: RoadmapWithProgress[] = await Promise.all(
        baseRoadmaps.map(async (rm) => {
          try {
            const taskRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${rm.roadmap_id}`
            )

            if (!taskRes.ok) {
              return {
                ...rm,
                totalTasks: 0,
                completedTasks: 0,
                progress: 0,
              }
            }

            const taskJson = await taskRes.json()
            const tasks = Array.isArray(taskJson?.tasks)
              ? taskJson.tasks
              : []

            const totalTasks = tasks.length
            const completedTasks = tasks.filter(
              (t: any) => t.completed === true
            ).length

            const progress =
              totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0

            return {
              ...rm,
              totalTasks,
              completedTasks,
              progress,
            }
          } catch {
            return {
              ...rm,
              totalTasks: 0,
              completedTasks: 0,
              progress: 0,
            }
          }
        })
      )

      setRoadmaps(enriched)
    } catch (err) {
      console.error("Dashboard load failed:", err)
      setRoadmaps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoadmaps()
  }, [])

  // 🔥 DELETE HANDLER
  const deleteRoadmap = async (roadmapId: number) => {
    if (!userId) return

    const ok = confirm(
      "Are you sure you want to delete this roadmap? This cannot be undone."
    )
    if (!ok) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${roadmapId}?user_id=${userId}`,
        { method: "DELETE" }
      )

      if (!res.ok) throw new Error("Delete failed")

      setRoadmaps((prev) =>
        Array.isArray(prev)
          ? prev.filter((r) => r.roadmap_id !== roadmapId)
          : []
      )
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Failed to delete roadmap")
    }
  }

  // 🔢 Aggregates (safe)
  const activeRoadmapsCount = Array.isArray(roadmaps)
    ? roadmaps.length
    : 0

  const totalCompletedTasks = Array.isArray(roadmaps)
    ? roadmaps.reduce((sum, r) => sum + (r.completedTasks || 0), 0)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-50 mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-400">
            Keep learning. Stay consistent. Master new skills.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card-hover p-6">
            <p className="text-zinc-400 text-sm mb-2">Active Roadmaps</p>
            <p className="text-3xl font-bold text-zinc-50">
              {activeRoadmapsCount}
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <p className="text-zinc-400 text-sm mb-2">Tasks Completed</p>
            <p className="text-3xl font-bold text-zinc-50">
              {totalCompletedTasks}
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <p className="text-zinc-400 text-sm mb-2">Learning Streak</p>
            <p className="text-3xl font-bold text-zinc-50">—</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roadmaps */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-zinc-50">
                Your Roadmaps
              </h2>
              <Link
                href="/generate"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm"
              >
                New Roadmap
              </Link>
            </div>

            {loading ? (
              <p className="text-zinc-400">Loading roadmaps…</p>
            ) : roadmaps.length === 0 ? (
              <p className="text-zinc-400">
                No roadmaps yet. Generate one to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {roadmaps.map((roadmap) => (
                  <div
                    key={roadmap.roadmap_id}
                    className="glass-card-hover p-6 group relative"
                  >
                    <Link
                      href={`/roadmap/${roadmap.roadmap_id}/weeks`}
                    >
                      <h3 className="text-lg font-semibold text-zinc-50 group-hover:text-blue-400">
                        {roadmap.description}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        {roadmap.duration_weeks} weeks · {roadmap.level}
                      </p>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteRoadmap(roadmap.roadmap_id)
                      }}
                      className="absolute top-4 right-4 text-xs text-red-400 opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>

                    <div className="mt-4 w-full bg-zinc-800/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${roadmap.progress}%` }}
                      />
                    </div>

                    <p className="text-xs text-zinc-500 mt-3">
                      {roadmap.completedTasks} / {roadmap.totalTasks} tasks
                      completed
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-zinc-50 mb-4">
              Today’s Tasks
            </h3>
            <div className="glass-card p-6">
              <p className="text-sm text-zinc-400">
                Tasks will appear here once you start a roadmap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
