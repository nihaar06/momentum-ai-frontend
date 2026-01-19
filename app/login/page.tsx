"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-in fade-in duration-700">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/login"
            className="inline-block font-bold text-2xl tracking-tight text-zinc-50 hover:text-blue-400 transition-colors mb-8"
          >
            Momentum
          </Link>
          <h1 className="text-3xl font-bold text-zinc-50 mb-3">
            Sign in to Momentum-AI
          </h1>
          <p className="text-zinc-400">
            We’ll email you a magic sign-in link
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 mb-6">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-zinc-50 mb-2">
                Check your email
              </h2>
              <p className="text-zinc-400 text-sm mb-4">
                We sent a magic link to{" "}
                <span className="text-zinc-300 font-medium">{email}</span>
              </p>
              <p className="text-zinc-500 text-xs mb-6">
                Click the link to sign in instantly — no password needed
              </p>

              <button
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors disabled:opacity-50"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-2.5 mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Sending link…" : "Send magic link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-zinc-500 text-xs">
          Passwordless authentication powered by magic links
        </p>
      </div>
    </div>
  )
}
