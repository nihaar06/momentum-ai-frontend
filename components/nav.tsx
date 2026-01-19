"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="glass-card sticky top-0 z-50 w-full border-b border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="font-bold text-xl tracking-tight text-zinc-50 hover:text-blue-400 transition-colors"
        >
          Momentum
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link href="/generate" className={`nav-link ${isActive("/generate") ? "active" : ""}`}>
            Generate
          </Link>
          <Link href="/assistant" className={`nav-link ${isActive("/assistant") ? "active" : ""}`}>
            Assistant
          </Link>
        </div>
      </div>
    </nav>
  )
}
