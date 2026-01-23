"use client"

import { supabase } from "@/lib/supabase"

export function UserMenu() {
  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-zinc-400 hover:text-red-400"
    >
      Logout
    </button>
  )
}
