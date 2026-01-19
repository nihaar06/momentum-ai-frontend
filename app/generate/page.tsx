"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/nav"

export default function GeneratePage() {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    goal: "",
    duration: "8",
    hours: "2",
    level: "intermediate",
  })

  // 1️⃣ Get logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUserId(data.user.id)
    }
    loadUser()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 2️⃣ Call backend to generate roadmap
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate_roadmap`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            goal: formData.goal,
            duration_weeks: Number(formData.duration),
            daily_hours: Number(formData.hours),
            level: formData.level,
          }),
        }
      )

      if (!res.ok) {
        throw new Error("Failed to generate roadmap")
      }

      await res.json()

      // 3️⃣ Redirect to dashboard after success
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navigation />

      <div className="max-w-2xl mx-auto px-6 py-16 animate-in fade-in duration-700">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-zinc-50 mb-4 leading-tight">
            Create Your Learning Roadmap
          </h1>
          <p className="text-lg text-zinc-400">
            Tell us your goal, and we’ll generate a personalized learning path powered by AI.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-3">
              What do you want to learn?
            </label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              placeholder="e.g., Build full-stack web applications with Next.js and PostgreSQL"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-3">
                Duration (weeks)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                max="52"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-3">
                Daily hours
              </label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleInputChange}
                min="0.5"
                max="8"
                step="0.5"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-3">
                Your level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !formData.goal}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating your roadmap…
              </span>
            ) : (
              "Generate Roadmap"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
