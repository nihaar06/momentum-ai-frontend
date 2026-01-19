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

export default function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // 🔹 Load roadmaps
  const loadRoadmaps = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) return

    setUserId(data.user.id)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roadmaps?user_id=${data.user.id}`
      )

      if (!res.ok) {
        throw new Error("Failed to fetch roadmaps")
      }

      const json = await res.json()
      setRoadmaps(json || [])
    } catch (err) {
      console.error("Failed to load roadmaps", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoadmaps()
  }, [])

  // 🔥 DELETE HANDLER (FIXED)
  const deleteRoadmap = async (roadmapId: number) => {
    if (!userId) return

    const confirmDelete = confirm(
      "Are you sure you want to delete this roadmap? This cannot be undone."
    )
    if (!confirmDelete) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${roadmapId}?user_id=${userId}`,
        { method: "DELETE" }
      )

      if (!res.ok) {
        throw new Error("Delete failed")
      }

      // Optimistic UI update
      setRoadmaps((prev) =>
        prev.filter((r) => r.roadmap_id !== roadmapId)
      )
    } catch (err) {
      console.error("Failed to delete roadmap", err)
      alert("Failed to delete roadmap")
    }
  }

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
              {roadmaps.length}
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <p className="text-zinc-400 text-sm mb-2">Tasks Completed</p>
            <p className="text-3xl font-bold text-zinc-50">—</p>
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
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm"
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
                    <Link href={`/roadmap/${roadmap.roadmap_id}/weeks`}>

                      <div>
                        <h3 className="text-lg font-semibold text-zinc-50 group-hover:text-blue-400 transition-colors">
                          {roadmap.description}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          {roadmap.duration_weeks} weeks · {roadmap.level}
                        </p>
                      </div>
                    </Link>

                    {/* DELETE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteRoadmap(roadmap.roadmap_id)
                      }}
                      className="absolute top-4 right-4 text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>

                    <div className="mt-4 w-full bg-zinc-800/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                        style={{ width: "10%" }}
                      />
                    </div>

                    <p className="text-xs text-zinc-500 mt-3">
                      Progress updates as tasks are completed
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
console.log("API:", process.env.NEXT_PUBLIC_API_URL)
