"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // -----------------------------
  // Magic link login
  // -----------------------------
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

  // -----------------------------
  // Google OAuth login
  // -----------------------------
  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-in fade-in duration-700">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/login"
            className="inline-block font-bold text-2xl tracking-tight text-zinc-50 hover:text-blue-400 transition-colors mb-6"
          >
            Momentum
          </Link>

          <h1 className="text-3xl font-bold text-zinc-50 mb-2">
            Sign in to Momentum-AI
          </h1>
          <p className="text-zinc-400">
            Choose a sign-in method to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 mb-6 space-y-6">
          {/* Google Login */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.1H42V20H24v8h11.3C33.9 32.1 29.4 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.9l5.7-5.7C33.7 6.5 29.1 4.5 24 4.5 12.1 4.5 2.5 14.1 2.5 26S12.1 47.5 24 47.5 45.5 37.9 45.5 26c0-1.3-.1-2.6-.4-3.9z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-zinc-500 text-xs">
            <div className="flex-1 h-px bg-zinc-800" />
            OR
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Magic Link */}
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-4">
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
              <p className="text-zinc-400 text-sm">
                We sent a magic link to{" "}
                <span className="text-zinc-200 font-medium">{email}</span>
              </p>

              <button
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
                className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium"
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
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 disabled:opacity-50"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-zinc-500 text-xs">
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  )
}
