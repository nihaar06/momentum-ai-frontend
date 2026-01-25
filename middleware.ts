import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // We are adding the new 'spectacular-expression' URL to the connect-src whitelist
  const connectSrc = [
    "'self'",
    "https://spectacular-expression-production.up.railway.app",
    "https://*.supabase.co",
    "https://api.supabase.com",
    "http://localhost:8000", // For local backend testing
  ].join(" ")

  res.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; connect-src ${connectSrc}; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`
  )

  return res
}

export const config = {
  matcher: "/:path*",
}