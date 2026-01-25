import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' https://momentum-ai-production.up.railway.app https://*.supabase.co https://api.supabase.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  return res
}

export const config = {
  matcher: "/:path*",
}