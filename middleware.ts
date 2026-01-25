import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Update the whitelist to include your new spectacular-expression URL
  const connectSrc = [
    "'self'",
    "https://spectacular-expression-production.up.railway.app",
    "https://*.supabase.co",
    "https://api.supabase.com",
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